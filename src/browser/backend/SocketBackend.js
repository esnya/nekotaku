/* eslint class-methods-use-this: off */

import EventEmitter from 'eventemitter3';
import shortid from 'shortid';
import SocketIO from 'socket.io-client';
import uuidv4 from 'uuid/v4';
import Backend, { NotFoundError, UnauthorizedError } from '@/browser/backend/Backend';
import localStorage from '@/browser/utilities/localStorage';
import * as ErrorCode from '@/constants/ErrorCode';
import * as ListEvent from '@/constants/ListEvent';
import * as ObjectEvent from '@/constants/ObjectEvent';
import * as SocketEvents from '@/constants/SocketEvents';

const UIDKey = 'nekotaku:socketbackend:uid';
function getUID() {
  const stored = localStorage.getItem(UIDKey);
  if (stored) return stored;

  const uid = uuidv4();
  localStorage.setItem(UIDKey, uid);
  return uid;
}

function getEventPath(path, event) {
  return `${path}:${event}`;
}

export default class SocketBackend extends Backend {
  constructor(config: Object) {
    super(config);

    this.handlers = [];
    this.resolvers = {};

    this.eventBus = new EventEmitter();

    this.socket = config.socket || new SocketIO();

    this.socket.on('connect', () => {
      this.request(SocketEvents.SetUID, getUID());
    });

    this.socket.on('event', (path, event, data) => {
      this.emit(path, event, data);
    });

    if (config.onInitialized) config.onInitialized();
  }

  /* Remote */
  async request(event: string, ...args: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      const requestId = shortid();
      this.socket.once(`response:${event}:${requestId}`, (error, result) => {
        if (error) {
          switch (error.code) {
            case ErrorCode.NotFound:
              reject(new NotFoundError());
              break;
            case ErrorCode.Unauthorized:
              reject(new UnauthorizedError());
              break;
            default:
              reject(new Error(error.message));
              break;
          }
        } else resolve(result);
      });
      this.socket.emit(`request:${event}`, requestId, ...args);
    });
  }

  /* Local */
  emit(path: string, event: string, data: Object): void {
    this.eventBus.emit(getEventPath(path, event), data);
  }

  on(path: string, event: string, callback: Object => void): void {
    this.eventBus.on(getEventPath(path, event), callback);
  }

  off(path: string, event: string, callback: Object => void): void {
    this.eventBus.off(getEventPath(path, event), callback);
  }

  /* Strategy Implements */
  async getUID(): Promise<string> {
    return getUID();
  }

  async subscribe(
    path: string,
    event: string,
    callback: Object => void,
  ): Promise<() => Promise<void>> {
    this.on(path, event, callback);
    const data = await this.request(SocketEvents.Subscribe, path, event);

    switch (event) {
      case ObjectEvent.Value:
        callback(data);
        break;
      case ListEvent.ChildAdded:
        data.forEach(child => callback(child));
        break;
      default:
        break;
    }

    return async () => {
      this.off(path, event, callback);
      await this.request(SocketEvents.Unsubscribe, path, event);
    };
  }

  async push(
    path: string,
    data: string,
  ): Promise<string> {
    const id = await this.request(SocketEvents.Push, path, data);
    return id;
  }

  async update(
    path: string,
    data: Object,
  ): Promise<void> {
    await this.request(SocketEvents.Update, path, data);
  }

  async remove(
    path: string,
  ): Promise<void> {
    await this.request(SocketEvents.Remove, path);
  }

  async pushFile(
    path: string,
    file: File,
  ): Promise<string> {
    await this.request(SocketEvents.PushFile, path, file);
  }

  async removeFile(
    path: string,
  ): Promise<void> {
    await this.request(SocketEvents.RemoveFile, path);
  }

  async removeFiles(
    path: string,
  ): Promise<void> {
    await this.request(SocketEvents.RemoveFiles, path);
  }
}
