

import EventEmitter from 'eventemitter3';
import io from 'socket.io-client';
import shortid from 'shortid';
import uuidv4 from 'uuid/v4';
import Backend from '@/browser/backend/Backend';
import NotFoundError from '@/browser/backend/NotFoundError';
import SocketBackendOptions from '@/browser/backend/SocketBackendOptions';
import UnauthorizedError from '@/browser/backend/UnauthorizedError';
import localStorage from '@/browser/wrappers/localStorage';
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

function getEventPath(path: string, event: string) {
  return `${path}:${event}`;
}

interface ErrorMessage {
  code: string;
  message: string;
}

export default class SocketBackend implements Backend {
  private eventBus = new EventEmitter();
  private socket: SocketIOClient.Socket;

  constructor(options: SocketBackendOptions) {
    this.eventBus = new EventEmitter();

    this.socket = options.socket || io();

    this.socket.on('connect', () => {
      this.request(SocketEvents.SetUID, getUID());
    });

    this.socket.on('event', (path: string, event: string, data: {}) => {
      this.emit(path, event, data);
    });

    if (options.onInitialized) options.onInitialized();
  }

  getType(): string {
    return 'socket';
  }

  /* Remote */
  request(event: string, ...args: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      const requestId = shortid();
      this.socket.once(`response:${event}:${requestId}`, (error: ErrorMessage | null, result: {}) => {
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
  emit(path: string, event: string, data: {}): void {
    this.eventBus.emit(getEventPath(path, event), data);
  }

  on(path: string, event: string, callback: (data: {}) => void): void {
    this.eventBus.on(getEventPath(path, event), callback);
  }

  off(path: string, event: string, callback: (data: {}) => void): void {
    this.eventBus.off(getEventPath(path, event), callback);
  }

  /* Strategy Implements */
  async getUID(): Promise<string> {
    return getUID();
  }

  async subscribe(
    path: string,
    event: string,
    callback: (data: {}) => void,
  ): Promise<() => Promise<void>> {
    this.on(path, event, callback);
    const data = await this.request(SocketEvents.Subscribe, path, event);

    switch (event) {
      case ObjectEvent.Value:
        callback(data);
        break;
      case ListEvent.ChildAdded:
        data.forEach((child: {}) => callback(child));
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
    data: {},
  ): Promise<void> {
    await this.request(SocketEvents.Update, path, data);
  }

  async remove(
    path: string,
  ): Promise<void> {
    await this.request(SocketEvents.Remove, path);
  }

  async pushFile(
    roomId: string,
    path: string,
    file: File,
  ): Promise<string> {
    const url = await this.request(SocketEvents.PushFile, roomId, path, file.type, file.name, file);
    return url;
  }

  async removeFile(
    roomId: string,
    path: string,
  ): Promise<void> {
    await this.request(SocketEvents.RemoveFile, roomId, path);
  }

  async removeFiles(
    roomId: string,
  ): Promise<void> {
    await this.request(SocketEvents.RemoveFiles, roomId);
  }
}
