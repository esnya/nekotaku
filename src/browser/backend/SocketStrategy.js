import EventEmitter from 'eventemitter3';
import shortid from 'shortid';
import SocketIO from 'socket.io-client';
import uuidv4 from 'uuid/v4';
import * as SocketEvents from '../../constants/SocketEvents';
import localStorage from '../utilities/localStorage';
import BackendStrategy, { Handler } from './BackendStrategy';

const ListEvents = [
  'add',
  'change',
  'remove',
];

function joinKey(...args) {
  return args.filter(a => a).join(':');
}

const UIDKey = 'nekotaku:socketbackend:uid';
function getUID() {
  const stored = localStorage.getItem(UIDKey);
  if (stored) return stored;

  const uid = uuidv4();
  localStorage.setItem(UIDKey, uid);
  return uid;
}

export default class SocketStrategy extends BackendStrategy {
  constructor(config: Object) {
    super(config);

    this.handlers = [];
    this.resolvers = {};

    this.emitter = new EventEmitter();

    this.socket = new SocketIO();

    this.socket.on('connect', () => {
      this.socket.emit(SocketEvents.SetUID, getUID());
    });
    this.socket.on('reconnect', () => {
      this.handlers.forEach(({ event, type, roomId }) => {
        this.socket.emit(SocketEvents.Watch, event, type, roomId, true);
      });
    });

    this.socket.on('message', (event, ...args) => {
      this.emitter.emit(event, ...args);
    });

    this.socket.on('response:resolve', (requestId: string, data: any) => {
      if (this.resolvers[requestId]) {
        const { resolve } = this.resolvers[requestId];
        this.resolvers[requestId] = null;
        resolve(data);
      }
    });
    this.socket.on('response:reject', (requestId: string, error: any) => {
      if (this.resolvers[requestId]) {
        const { reject } = this.resolvers[requestId];
        this.resolvers[requestId] = null;
        reject(error);
      }
    });
  }

  emit(event: string, ...args) {
    this.socket.emit(event, ...args);
  }
  async request(event: string, ...args) {
    const requestId = shortid();

    const result = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        if (this.resolvers[requestId]) {
          this.resolvers[requestId] = null;
          reject(new Error('timeout'));
        }
      }, 30 * 1000);

      this.resolvers[requestId] = {
        resolve: (data) => {
          clearTimeout(timeout);
          resolve(data);
        },
        reject,
      };

      this.emit(event, requestId, ...args);
    });

    return result;
  }
  async on(event: string, type: string, roomId: ?string, handler: Handler) {
    this.emitter.on(joinKey(event, type, roomId), handler);
    await this.request(SocketEvents.Watch, event, type, roomId);
    this.handlers.push({ event, type, roomId });
  }
  async off(event: string, type: string, roomId: ?string) {
    await this.request(SocketEvents.Unwatch, event, type, roomId);
    this.emitter.removeListener(joinKey(event, type, roomId));
    this.handlers =
      this.handlers.filter(h => !(h.event === event && h.type === type && h.roomId === roomId));
  }

  /* Strategy Implements */
  async getUID(): Promise<string> {
    return getUID();
  }

  async watchLobby(handler: Handler): Promise<void> {
    const tasks = ListEvents.map((event) => {
      const handlerEvent = `rooms:${event}`;
      return this.on(event, 'rooms', null, data => handler(handlerEvent, data));
    });
    await Promise.all(tasks);
  }
  async unwatchLobby(): Promise<void> {
    const tasks = ListEvents.map(event => this.off(event, 'rooms', null));
    await Promise.all(tasks);
  }
  async watchRoom(roomId: string, handler: Handler): Promise<void> {
    await this.on('update', 'rooms', roomId, data => handler('room:update', data));
  }
  async unwatchRoom(roomId: string) {
    await this.off('update', 'rooms', roomId);
  }
  async watchObject(type: string, roomId: string, handler: Handler): Promise<void> {
    const event = `${type}:update`;
    await this.on('update', type, roomId, data => handler(event, data));
  }
  async unwatchObject(type: string, roomId: string): Promise<void> {
    await this.off('update', type, roomId);
  }
  async watchList(type: string, roomId: string, handler: Handler): Promise<void> {
    const tasks = ListEvents.map((event) => {
      const handlerEvent = `${type}:${event}`;
      return this.on(event, type, roomId, data => handler(handlerEvent, data));
    });
    await Promise.all(tasks);
  }
  async unwatchList(type: string, roomId: string): Promise<void> {
    const tasks = ListEvents.map(event => this.off(event, type, roomId));
    await Promise.all(tasks);
  }

  async update(type: string, roomId: string, value: Object): Promise<void> {
    this.emit(SocketEvents.Update, type, roomId, value);
  }
  async remove(type: string, roomId: string): Promise<void> {
    this.emit(SocketEvents.Remove, type, roomId);
  }
  async addChild(type: string, roomId: string, value: Object): Promise<string> {
    const id = await this.request(SocketEvents.AddChild, type, roomId, value);
    return id;
  }
  async changeChild(type: string, roomId: string, childId: string, value: Object): Promise<void> {
    this.emit(SocketEvents.ChangeChild, type, roomId, childId, value);
  }
  async changeChildValue(
    type: string,
    roomId: string,
    childId: string,
    key: string,
    value: any,
  ): Promise<void> {
    this.emit(SocketEvents.ChangeChildValue, type, roomId, childId, key, value);
  }
  async removeChild(type: string, roomId: string, chlidId: string): Promise<void> {
    this.emit(SocketEvents.RemoveChild, type, roomId, chlidId);
  }

  async uploadFile(roomId: string, path: string, file: File): Promise<string> {
    const url = await this.request(SocketEvents.UploadFile, roomId, path, file.type, file);
    return url;
  }
  async deleteFile(roomId: string, path: string) {
    this.emit(SocketEvents.DeleteFile, roomId, path);
  }

  async createRoom(room: Object): Promise<string> {
    const roomId = await this.request(SocketEvents.CreateRoom, room);
    return roomId;
  }
  async getRoom(roomId: string): Promise<?Object> {
    const room = await this.request(SocketEvents.GetRoom, roomId);
    return room;
  }
  async updateRoom(roomId: string, value: Object): Promise<void> {
    await this.request(SocketEvents.UpdateRoom, roomId, value);
  }
  async loginRoom(roomId: string, password: ?string): Promise<boolean> {
    const result = await this.request(SocketEvents.LoginRoom, roomId, password);
    return result;
  }
  async removeRoom(roomId: string): Promise<void> {
    this.emit(SocketEvents.RemoveRoom, roomId);
  }

  async removeMe(roomId: string): Promise<void> {
    await this.request(SocketEvents.RemoveMe, roomId);
  }
}