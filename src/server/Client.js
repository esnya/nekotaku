import fs from 'mz/fs';
import _ from 'lodash';
import path from 'path';
import SI from 'si-tools';
import * as SocketEvents from '../constants/SocketEvents';
import config from './config';
import datastore from './datastore';
import { system } from './logger';

const ParsedFileSize = SI.parse(config.file.maxSize);
const MaxFileSize = ParsedFileSize.number;
const FilePath = config.file.path;

function key2obj(key: string, value: any) {
  const paths = key.split(/\//g);
  return paths.reduceRight((obj, p) => ({
    [p]: obj,
  }), value);
}

function joinKeys(...keys) {
  return keys.filter(a => a).join(':');
}

function roomFilter(value: ?Object) {
  if (!value) return value;

  const {
    password,
    ...othres
  } = value;

  return {
    ...othres,
    isLocked: Boolean(password),
  };
}

export default class Client {
  connection(io, socket) {
    this.io = io;
    this.socket = socket;

    system.info(`New socket connection ${socket.id}`);

    _(SocketEvents).forEach((event, key) => {
      socket.on(event, (...args) => {
        try {
          system.trace('received', event, ...args);
          const methodKey = `on${key}`;
          if (!this[methodKey]) system.fatal(`Client.${methodKey} is not defined`);
          this[methodKey](...args);
        } catch (e) {
          system.error(e, args);
        }
      });
    });
  }

  join(...keys: string[]) {
    system.trace('join', ...keys);
    this.socket.join(joinKeys(...keys));
  }
  leave(...keys: string[]) {
    system.trace('leave', ...keys);
    this.socket.leave(joinKeys(...keys));
  }
  emitMessage(eventKeys: string[], value: Object, broadcast: boolean = true) {
    const event = joinKeys(...eventKeys);

    const filtered = eventKeys[1] === 'rooms' ? roomFilter(value) : value;

    if (broadcast) {
      system.trace('emit(io)', 'message', event, filtered);
      this.io.emit('message', event, filtered);
    } else {
      system.trace('emit', 'message', event, filtered);
      this.socket.emit('message', event, filtered);
    }
  }
  resolve(requestId: string, value: Object) {
    system.trace('emit', 'response:resolve', requestId, value);
    this.socket.emit('response:resolve', requestId, value);
  }
  reject(requestId: string, error: Error) {
    system.trace('emit', 'response:reject', requestId, error);
    this.socket.emit('response:reject', requestId, error.toString());
  }

  getUID() {
    if (!this.uid) throw new Error('Unautohrized');
    return this.uid;
  }

  async update(type: string, targetId: ?string, roomId: ?string, value: Object) {
    const now = Date.now();
    const query = roomId ? { roomId } : {};

    const oldValue = await datastore.findOne(type, targetId, query);
    const newValue = {
      ...oldValue,
      ...value,
      ...(roomId ? { roomId } : {}),
      uid: (oldValue && oldValue.uid) || this.getUID(),
      updatedAt: now,
    };
    if (!oldValue) {
      await datastore.insert(type, {
        ...newValue,
        createdAt: now,
      });
    } else {
      await datastore.updateOne(type, targetId, query, newValue);
    }

    const updatedValue = await datastore.findOne(type, targetId, query);
    return updatedValue;
  }
  async insertMember(roomId: string): Promise<Object> {
    const uid = this.getUID();
    const now = Date.now();

    const oldValue = await datastore.findOne('members', null, { roomId });
    const newValue = {
      members: {
        [uid]: now,
      },
      roomId,
      updatedAt: now,
    };

    if (!oldValue) {
      await datastore.insert('members', {
        ...newValue,
        createdAt: now,
      });
    } else {
      await datastore.updateOne('members', null, { roomId }, _.merge(
        {},
        oldValue,
        newValue,
      ));
    }

    const updatedValue = await datastore.findOne('members', null, { roomId });

    this.emitMessage(['update', 'members', roomId], updatedValue.members);

    return updatedValue;
  }
  async isMemberOf(roomId: string): Promise<?number> {
    const uid = this.getUID();

    const value = await datastore.findOne('members', null, { roomId });
    if (!value || !value.members[uid]) return null;

    return value.members[uid];
  }
  async enforceMember(roomId: string) {
    const isMember = await this.isMemberOf(roomId);
    if (!isMember) {
      system.error('Permission denied', roomId);
      throw new Error('Premission denied');
    }
  }
  async updateRoom(roomId: string, value: Object): Promise<void> {
    await this.enforceMember(roomId);

    const room = await this.update('rooms', roomId, null, value);
    this.emitMessage(['update', 'rooms', roomId], room);
    this.emitMessage(['change', 'rooms'], room);
  }

  async onSetUID(uid: string) {
    this.uid = uid;
  }
  async onWatch(
    requestId: string,
    event: string,
    type: string,
    roomId: ?string,
    silent: boolean = false,
  ) {
    try {
      if (roomId) await this.enforceMember(roomId);

      this.join(event, type, roomId);

      if (silent) return this.resolve(requestId);

      if (event === 'add') {
        const children = await datastore.findArray(type, roomId && { roomId });
        children.forEach((child) => {
          this.emitMessage([event, type, roomId], child, false);
        });
      } else if (event === 'update') {
        const data = await datastore.findOne(type, type === 'rooms' ? roomId : null, type === 'rooms' ? null : { roomId });
        if (data) this.emitMessage([event, type, roomId], type === 'members' ? data.members : data, false);
      }

      return this.resolve(requestId);
    } catch (e) {
      system.error(e, { requestId });
      return this.reject(requestId);
    }
  }
  onUnwatch(requestId: string, event: string, type: string, roomId: ?string) {
    try {
      this.leave(event, type, roomId);
      this.resolve(requestId);
    } catch (e) {
      system.error(e, { requestId });
      this.reject(requestId);
    }
  }

  async onUpdate(type: string, roomId: string, value: Object) {
    await this.enforceMember(roomId);

    const updatedValue = await this.update(type, null, roomId, value);
    this.emitMessage(['update', type, roomId], updatedValue);
  }
  async onRemove(type: string, roomId: string) {
    await this.enforceMember(roomId);

    await datastore.remove(type, null, { roomId });
    this.emitMessage(['update', type, roomId], null);
  }
  async onAddChild(requestId: string, type: string, roomId: string, value: Object) {
    let childId;
    try {
      await this.enforceMember(roomId);

      const now = Date.now();
      childId = await datastore.insert(type, {
        ...value,
        uid: this.getUID(),
        roomId,
        createdAt: now,
        updatedAt: now,
      });
      this.resolve(requestId, childId);
    } catch (e) {
      system.error(e, { requestId });
      this.reject(requestId, e);
    }

    const child = await datastore.findOne(type, childId, { roomId });
    if (child) this.emitMessage(['add', type, roomId], child);
  }
  async onChangeChild(type: string, roomId: string, childId: string, value: Object) {
    await this.enforceMember(roomId);

    const oldValue = await datastore.findOne(type, childId, { roomId });
    if (!oldValue) {
      system.error(new Error('child not found'), type, roomId, childId);
      return;
    }

    const newValue = _.merge(
      {},
      oldValue,
      value,
      {
        uid: oldValue.uid || this.getUID(),
        roomId,
        updatedAt: Date.now(),
      },
    );
    await datastore.updateOne(type, childId, { roomId }, newValue);
    this.emitMessage(['change', type, roomId], newValue);
  }
  async onChangeChildValue(
    type: string,
    roomId: string,
    childId: string,
    key: string,
    value: any,
  ) {
    const newValue = key2obj(key, value);
    await this.onChangeChild(type, roomId, childId, newValue);
  }
  async onRemoveChild(type: string, roomId: string, childId: string) {
    await this.enforceMember(roomId);

    const data = await datastore.findOne(type, childId, { roomId });
    if (!data) return;

    await datastore.remove(type, childId, { roomId });
    this.emitMessage(['remove', type, roomId], data);
  }

  async onUploadFile(
    requestId: string,
    roomId: string,
    filePath: string,
    type: string,
    file: Buffer,
  ) {
    try {
      await this.enforceMember(roomId);

      if (file.length > MaxFileSize) throw new Error('Maximum file size exceeded');

      const fileId = await datastore.insert('files', { roomId, type, path: filePath });
      await fs.writeFile(path.join(FilePath, fileId), file);

      this.resolve(requestId, `/files/${fileId}`);
    } catch (e) {
      system.error(e, { requestId });
      this.reject(requestId, e);
    }
  }
  async onDeleteFile(roomId: string, filePath: string) {
    await this.enforceMember(roomId);

    const files = await datastore.findArray('files', { roomId, path: filePath });
    files.forEach(async (file) => {
      try {
        // eslint-disable-next-line no-underscore-dangle
        const fileId = file._id.toString();
        await datastore.remove('files', fileId);
        await fs.unlink(path.join(FilePath, fileId));
      } catch (e) {
        system.error(e);
      }
    });
  }

  async onCreateRoom(requestId: string, room: Object) {
    let roomId;
    try {
      const uid = this.getUID();
      const now = Date.now();
      const newValue = {
        ...room,
        players: 1,
        uid,
        createdAt: now,
        updatedAt: now,
      };

      roomId = await datastore.insert('rooms', newValue);
      await this.insertMember(roomId);

      this.resolve(requestId, roomId);
    } catch (e) {
      system.error(e, { requestId });
      this.reject(requestId, e);
    }

    const storedValue = await datastore.findOne('rooms', roomId);
    this.emitMessage(['add', 'rooms'], storedValue);
  }
  async onGetRoom(requestId: string, roomId: string) {
    try {
      const room = await datastore.findOne('rooms', roomId);
      this.resolve(requestId, room && roomFilter(room));
    } catch (e) {
      system.error(e, { requestId });
      this.reject(requestId, e);
    }
  }
  async onUpdateRoom(requestId: string, roomId: string, value: Object) {
    try {
      await this.updateRoom(roomId, value);
      this.resolve(requestId);
    } catch (e) {
      system.error(e, { requestId });
      this.reject(requestId, e);
    }
  }
  async onLoginRoom(requestId: string, roomId: string, password: ?string) {
    try {
      const member = await this.isMemberOf(roomId);
      if (member) {
        return this.resolve(requestId, true);
      }

      const room = await datastore.findOne('rooms', roomId);
      if (!room || (room.password && room.password !== password)) {
        return this.resolve(requestId, false);
      }

      const members = await this.insertMember(roomId);
      this.updateRoom(roomId, { players: Object.keys(members.members).length });

      return this.resolve(requestId, true);
    } catch (e) {
      system.error(e, { requestId });
      return this.reject(requestId, e);
    }
  }
  async onRemoveRoom(roomId: string) {
    await this.enforceMember(roomId);

    await datastore.remove('rooms', roomId);

    this.emitMessage(['remove', 'rooms'], { id: roomId });
    this.emitMessage(['update', 'rooms', roomId], null);
  }

  async onRemoveMe(requestId: string, roomId: string) {
    try {
      const uid = this.getUID();
      await this.enforceMember(roomId);

      const oldValue = await datastore.findOne('members', null, { roomId });
      const newValue = {
        ...oldValue,
        members: _(oldValue.members).pickBy((v, k) => k !== uid).value(),
      };

      await datastore.updateOne('members', null, { roomId }, newValue);

      this.resolve(requestId);
    } catch (e) {
      system.error(e, { requestId });
      this.reject(requestId, e);
    }
  }
}
