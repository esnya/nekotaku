/* eslint no-console: off, class-methods-use-this: off */

import _ from 'lodash';
import EventEmitter from 'eventemitter3';
import shortid from 'shortid';
import StubData from '../constants/StubData';
import BackendStrategy, { Handler } from './BackendStrategy';
import { ListEvent } from '@/browser/models/ListModel';
import { ObjectEvent } from '@/browser/models/ObjectModel';

const Delay = 1000;

const ListEvents = [
  'add',
  'change',
  'remove',
];

function getParentPath(path: string): string {
  return path.replace(/\/?[^/]+$/, '') || null;
}

function roomFilter(room) {
  const {
    password,
    ...others
  } = room;

  return {
    ...others,
    isLocked: Boolean(password),
  };
}

export const UserId = 'user';

export default class StubStrategy extends BackendStrategy {
  constructor(config: Object) {
    super(config);

    this.eventBus = new EventEmitter();
    this.data = {
      rooms: StubData.rooms.map(r => ({ ...r })),
      maps: {},
      characters: {},
      messages: {},
      members: {},
      shapes: {},
      memos: {},
    };

    this.data.rooms.forEach(({ id }) => {
      ['characters', 'messages', 'shapes', 'memos'].forEach((type) => {
        this.data[type][id] = StubData[type];
      });
      this.data.maps[id] = { ...StubData.map };
      this.data.members[id] = {};
    });
    this.files = {};

    // console.log(this.data);
    this.data2 = {
      rooms: {},
      maps: {},
      characters: {},
      messages: {},
      members: {},
      shapes: {},
      memos: {},
    };
    StubData.rooms.forEach((room) => {
      const { id } = room;

      this.data2.rooms[id] = room;
      ['characters', 'messages', 'shapes', 'memos'].forEach((type) => {
        this.data2[type][id] = _(StubData[type])
          .map(a => [a.id, { ...a }])
          .fromPairs()
          .value();
      });
      this.data2.maps[id] = { ...StubData.map };
      this.data2.members[id] = {};
    });

    console.log(this.data2);
  }

  /* Utilities */

  on(event: string, handler: Handler) {
    this.eventBus.on(event, handler);
  }

  emit(event: string, data: any) {
    this.eventBus.emit(event, data);
  }

  off(event: string) {
    this.eventBus.off(event);
  }

  get(type: string, roomId: string): Object | Object[] {
    return this.data[type][roomId];
  }

  getObject(type: string, roomId: string): Object {
    const data = this.get(type, roomId);
    if (!(data instanceof Object)) throw new TypeError(`${type}.${roomId} is not Object`);
    return data;
  }

  getList(type: string, roomId: string): Object[] {
    const data = this.get(type, roomId);
    if (!(Array.isArray(data))) throw new TypeError(`${type}.${roomId} is not Array`);
    return data;
  }

  set(type: string, roomId: string, value: Object | Object[]) {
    this.data[type][roomId] = value;
    // console.log(this.data);
  }

  setObject(type: string, roomId: string, value: Object) {
    if (!(value instanceof Object)) throw new TypeError(`${type}.${roomId} is not Object`);
    this.set(type, roomId, value);
    // console.log(this.data);
  }

  setList(type: string, roomId: string, value: Object[]) {
    if (!(Array.isArray(value))) throw new TypeError(`${type}.${roomId} is not Array`);
    this.set(type, roomId, value);
    // console.log(this.data);
  }

  findChild(type: string, roomId: string, childId: string): Object {
    return this.getList(type, roomId).find(i => i.id === childId);
  }

  findRoom(roomId: string): Object {
    return this.data.rooms.find(r => r.id === roomId);
  }

  /* Implementations */

  async watchLobby(handler: Handler) {
    ListEvents.forEach((key) => {
      const event = `rooms:${key}`;
      this.on(event, v => handler(event, roomFilter(v)));
    });
    setTimeout(() => {
      this.data.rooms.forEach((room) => {
        handler('rooms:add', roomFilter(room));
      });
    }, Delay);
  }

  async unwatchLobby() {
    ListEvents.forEach((key) => {
      const event = `rooms:${key}`;
      this.off(event);
    });
  }

  async watchRoom(roomId: string, handler: Handler) {
    this.on('room:update', v => handler('room:update', roomFilter(v)));
    handler('room:update', roomFilter(this.findRoom(roomId)));
  }

  async unwatchRoom() {
    this.off('room:update');
  }

  async watchObject(type: string, roomId: string, handler: Handler) {
    const event = `${type}:update`;
    this.on(event, v => handler(event, v));
    handler(event, this.getObject(type, roomId));
  }

  async unwatchObject(type: string) {
    const event = `${type}:update`;
    this.off(event);
  }

  async watchList(type: string, roomId: string, handler: Handler) {
    ListEvents.forEach((key) => {
      const event = `${type}:${key}`;
      this.on(event, v => handler(event, v));
    });
    setTimeout(() => {
      this.getList(type, roomId).forEach((item) => {
        handler(`${type}:add`, item);
      });
    }, Delay);
  }

  async unwatchList(type: string) {
    ListEvents.forEach((key) => {
      const event = `${type}:${key}`;
      this.off(event);
    });
  }

  async update(type: string, roomId: string, value: Object) {
    this.setObject(type, roomId, {
      ...this.getObject(type, roomId),
      ...value,
    });
    this.emit(`${type}:update`, this.getObject(type, roomId));
  }

  async remove(type: string, roomId: string) {
    this.data[type][roomId] = null;
  }

  async updateChild(type: string, roomId: string, path: string, value: Object) {
    const key = `${type}/${roomId}/${path}`.replace(/\//g, '.');
    _.set(this.data, key, value);
    this.emit(`${type}:update`, _.get(this.data, `${type}.${roomId}`));
  }

  async addChild(type: string, roomId: string, value: any) {
    const id = shortid();

    const data = {
      ...value,
      id,
    };

    this.getList(type, roomId).push(data);

    this.emit(`${type}:add`, data);

    // console.log(this.data);

    return id;
  }

  async changeChild(type: string, roomId: string, childId: string, value: any) {
    const data = {
      ...this.findChild(type, roomId, childId),
      ...value,
    };
    this.setList(type, roomId, this.getList(type, roomId).map(i => (i.id === childId ? data : i)));
    this.emit(`${type}:change`, data);

    // console.log(this.data);
  }

  async changeChildValue(type: string, roomId: string, childId: string, key: string, value: any) {
    const data = {
      ...this.findChild(type, roomId, childId),
    };
    _.set(data, key.replace(/\//g, '.'), value);
    this.changeChild(type, roomId, childId, data);

    // console.log(this.data);
  }

  async removeChild(type: string, roomId: string, childId: string) {
    const data = this.findChild(type, roomId, childId);
    this.setList(type, roomId, this.getList(type, roomId).filter(i => i.id !== childId));
    this.emit(`${type}:remove`, data);

    // console.log(this.data);
  }

  async uploadFile(roomId: string, path: string, file: File) {
    const url = URL.createObjectURL(file);
    this.files[`${roomId}/${path}`] = url;
    return url;
  }

  async deleteFile(roomId: string, path: string) {
    const key = `${roomId}/${path}`;
    const url = this.files[key];

    this.files[key] = null;

    if (url) URL.revokeObjectURL(url);
  }

  async createRoom(room: Object, member: Object) {
    const id = room.id || shortid();
    const uid = await this.getUID();
    const now = Date.now();
    const data = {
      ...room,
      uid,
      id,
      players: 1,
      createdAt: now,
      updatedAt: now,
    };

    this.data.rooms.push(data);

    this.data.maps[id] = {};
    this.data.members[id] = {};
    this.data.characters[id] = [];
    this.data.messages[id] = [];
    this.data.shapes[id] = [];
    this.data.memos[id] = [];

    await this.updateChild('members', id, uid, member);

    this.emit('rooms:add', data);
    this.emit('room:update', data);

    return id;
  }

  async getRoom(roomId: string) {
    const room = this.findRoom(roomId);
    if (!room) return null;
    return roomFilter(room);
  }

  async updateRoom(roomId: string, value: Object) {
    const data = {
      ...this.findRoom(roomId),
      ...value,
    };
    this.data.rooms = this.data.rooms.map(r => (r.id === roomId ? data : r));
    this.emit('rooms:change', data);
    this.emit('room:update', data);
  }

  async loginRoom(roomId: string, password: ?string, member: Object) {
    const uid = await this.getUID();
    const room = this.findRoom(roomId);
    const isMember = _.get(this.data, `members.${roomId}.${uid}`);

    if (!isMember && room.password !== password) return false;

    await this.updateRoom(roomId, { players: 1 });
    await this.updateChild('members', roomId, uid, member);

    return true;
  }

  async removeRoom(roomId: string) {
    const room = this.findRoom(roomId);
    this.data.rooms = this.data.rooms.filter(r => r.id !== roomId);
    this.remove('members', roomId);
    this.emit('rooms:remove', room);
  }

  async removeMe(roomId: string) {
    const uid = await this.getUID();
    _.set(this.data, `members.${roomId}.${uid}`, null);
    await this.updateRoom(roomId, { players: 0 });
    this.emit('members:update', this.data.members);
  }

  /* New Utilities */
  get2(path: string, defaultValue = null): any {
    return _.get(this.data2, path.replace(/\//g, '.'), defaultValue);
  }

  set2(path: string, data: Object): Object {
    _.set(this.data2, path.replace(/\//g, '.'), data);
  }

  emit2(path, event, data) {
    console.log('[StubStrategy]', 'emit', { path, event, data });
    this.emit(`${path}:${event}`, data);
  }

  emitUpdate(path) {
    console.log('[StubStrategy]', 'emitUpdate', { path });

    if (!path) return;

    const emitData = this.get2(path);

    this.emit2(path, ObjectEvent.Value, emitData);

    const parentPath = getParentPath(path);
    if (!path) return;

    if (emitData !== null) this.emit2(parentPath, ListEvent.ChildChanged, emitData);

    this.emitUpdate(parentPath);
  }

  /* New APIs */
  async getUID(): Promise<string> {
    return UserId;
  }

  async subscribe(
    path: string,
    event: String,
    callback: Object => void,
  ): Promise<() => Promise<void>> {
    console.log('[StubStrategy]', 'subscribe', { path, event, callback });

    const eventPath = `${path}:${event}`;
    this.on(eventPath, callback);

    setTimeout(() => {
      switch (event) {
        case ObjectEvent.Value:
          callback(this.get2(path));
          break;
        case ListEvent.ChildAdded:
          _(this.get2(path)).forEach(item => callback(item));
          break;
        default:
      }
    });

    return () => {
      console.log('[StubStrategy]', 'unsubscribe', { path, event, callback });
      this.off(eventPath, callback);
    };
  }

  async push(
    path: string,
    data: string,
  ): Promise<string> {
    console.log('[StubStrategy]', 'push', { path, data });

    const id = `${Date.now()}_${shortid()}`;
    const newData = {
      ...data,
      id,
    };

    this.set2(`${path}/${id}`, newData);

    setTimeout(() => {
      this.emit2(path, ListEvent.ChildAdded, newData);
      this.emit2(`${path}/${id}`, ObjectEvent.Value, newData);
    });

    return id;
  }

  async update2(
    path: string,
    data: string,
  ): Promise<string> {
    console.log('[StubStrategy]', 'update', { path, data });

    const oldData = this.get2(path, {});
    const newData = {
      ...oldData,
      ...data,
      id: oldData.id,
    };
    this.set2(path, newData);

    setTimeout(() => this.emitUpdate(path));
  }

  async remove2(
    path: string,
  ): Promise<string> {
    const [key] = path.match(/[^/]+$/);

    console.log('[StubStrategy]', 'remove', { path, key });

    const parentPath = getParentPath(path);
    delete this.get2(parentPath)[key];

    setTimeout(() => {
      this.emit2(parentPath, ListEvent.ChildRemoved, key);
      this.emitUpdate(path);
    });
  }

  async pushFile(
    path: string,
    file: File,
  ): Promise<string> {
    console.log('[StubStrategy]', 'putFile', { path, file });

    const url = URL.createObjectURL(file);
    const id = shortid();

    this.set2(`files/${path}/${id}`, url);

    return url;
  }
}
