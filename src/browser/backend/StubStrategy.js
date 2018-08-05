/* eslint no-console: off */

import EventEmitter from 'eventemitter3';
import shortid from 'shortid';
import StubData from '../constants/StubData';
import BackendStrategy, { Handler } from './BackendStrategy';

const ListEvents = [
  'add',
  'change',
  'remove',
];

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
  async getUID(): Promise<string> {
    return UserId;
  }

  async watchLobby(handler: Handler) {
    ListEvents.forEach((key) => {
      const event = `rooms:${key}`;
      this.on(event, v => handler(event, roomFilter(v)));
    });
    this.data.rooms.forEach((room) => {
      handler('rooms:add', roomFilter(room));
    });
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
    this.getList(type, roomId).forEach((item) => {
      handler(`${type}:add`, item);
    });
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
    this.changeChild(type, roomId, childId, key.split(/\//g).reduceRight((prev, curr) => ({ [curr]: prev }), value));

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

  async createRoom(room: Object) {
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

    await this.update('members', id, { [uid]: Date.now() });

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
  async loginRoom(roomId: string, password: ?string) {
    const uid = this.getUID();
    const room = this.findRoom(roomId);
    const isMember = this.getObject('members', roomId)[uid];

    if (!isMember && room.password !== password) return false;

    await this.updateRoom(roomId, { players: 1 });
    await this.update('members', roomId, { [uid]: Date.now() });

    return true;
  }
  async removeRoom(roomId: string) {
    const room = this.findRoom(roomId);
    this.data.rooms = this.data.rooms.filter(r => r.id !== roomId);
    this.remove('members', roomId);
    this.emit('rooms:remove', room);
  }

  async removeMe(roomId: string) {
    const uid = this.getUID();
    delete this.data.members[roomId][uid];
    await this.updateRoom(roomId, { players: 0 });
    this.emit('members:update', this.data.members);
  }
}
