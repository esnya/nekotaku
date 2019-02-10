/* eslint no-console: off, class-methods-use-this: off */

import forEach from 'lodash/forEach';
import get from 'lodash/get';
import map from 'lodash/map';
import set from 'lodash/set';
import fromPairs from 'lodash/fromPairs';
import values from 'lodash/values';
import EventEmitter from 'eventemitter3';
import log from 'loglevel';
import shortid from 'shortid';
import StubData from '@/browser/constants/StubData';
import Backend from '@/browser/backend/Backend';
import NotFoundError from '@/browser/backend/NotFoundError';
import UnauthorizedError from '@/browser/backend/UnauthorizedError';
import * as ListEvent from '@/constants/ListEvent';
import * as ObjectEvent from '@/constants/ObjectEvent';
import checkRule from '@/utilities/rule';

function getParentPath(path: string): string | null {
  return path.replace(/\/?[^/]+$/, '') || null;
}

function reader<T = any>(data: T): T {
  if (data && (data as { password?: string | null }).password) {
    const {
      password,
      ...others
    } = (data as { password?: string | null });
    return ({
      ...others,
      isLocked: Boolean(password),
    } as any);
  }

  return data;
}

export const UserId = 'user';

class StubEventBus {
  private ee = new EventEmitter();

  on(path: string, event: string, callback: (data: {}) => void): (data: {}) => void {
    this.ee.on(`${path}:${event}`, callback);
    return callback;
  }

  off(path: string, event: string, callback: (data: {}) => void): void {
    this.ee.off(`${path}:${event}`, callback);
  }

  emit(path: string, event: string, data: {}): void {
    // log.info('[StubStrategy]', 'emit', { path, event, data });
    this.ee.emit(`${path}:${event}`, reader(data));
  }
}

interface StorageDataBucket<T> {
  [roomId: string]: T;
}

interface StorageDataList<T> {
  [itemId: string]: T;
}
interface StorageListBucket<T> extends StorageDataBucket<StorageDataList<T>> {
}
interface StorageData {
  'chat-paletts': StorageListBucket<{}>;
  characters: StorageListBucket<{}>;
  maps: StorageDataBucket<{}>;
  members: StorageListBucket<{}>;
  memos: StorageListBucket<{}>;
  messages: StorageListBucket<{}>;
  rooms: StorageDataBucket<{}>;
  shapes: StorageListBucket<{}>;
}

function copyStubData(src: { id: string }[]): { [itemId: string]: { id: string } } {
  const pairs = map(src, (a: { id: string }) => [a.id, { ...a }]);
  return fromPairs(pairs);
}

class StubStorage {
  private data: StorageData;

  constructor() {
    this.data = {
      'chat-paletts': {},
      characters: {},
      maps: {},
      members: {},
      memos: {},
      messages: {},
      rooms: {},
      shapes: {},
    };

    StubData.rooms.forEach((room) => {
      const { id } = room;

      this.data.rooms[id] = room;
      this.data.characters[id] = copyStubData(StubData.characters);
      this.data.messages[id] = copyStubData(StubData.messages);
      this.data.memos[id] = copyStubData(StubData.memos);
      this.data.shapes[id] = copyStubData(StubData.shapes);
      this.data.maps[id] = { ...StubData.map };
      this.data.members[id] = {};
      this.data['chat-paletts'][id] = {
        [UserId]: StubData['chat-paletts'],
      };
    });
  }

  get<T = {}>(path: string): T | null {
    return get(this.data, path.replace(/\//g, '.'), null);
  }

  set<T>(path: string, data: T): void {
    set(this.data, path.replace(/\//g, '.'), data);
  }
}

export default class StubBackend implements Backend {
  private eventBus = new StubEventBus();
  private data = new StubStorage();

  getType(): string {
    return 'stub';
  }

  emitUpdate(path: string) {
    // log.info('[StubStrategy]', 'emitUpdate', { path });
    const emitData = this.data.get(path);

    this.eventBus.emit(path, ObjectEvent.Value, emitData || {});

    const parentPath = getParentPath(path);
    if (!parentPath) return;

    if (emitData !== null) this.eventBus.emit(parentPath, ListEvent.ChildChanged, emitData);

    this.emitUpdate(parentPath);
  }

  async checkPath(path: string, mode: string) {
    const authorized = await checkRule(path, mode, UserId, async (p: string) => this.data.get(p));
    if (authorized) return;

    const roomId = path.split(/\//g)[1];
    const room = await this.data.get(`rooms/${roomId}`);

    if (room) throw new UnauthorizedError();
    throw new NotFoundError();
  }

  /* APIs */
  async getUID(): Promise<string> {
    return UserId;
  }

  async subscribe(
    path: string,
    event: string,
    callback: (data: {}) => void,
  ): Promise<() => Promise<void>> {
    log.info('[StubStrategy]', 'subscribe', { path, event, callback });

    await this.checkPath(path, 'read');

    this.eventBus.on(path, event, callback);

    setTimeout(() => {
      switch (event) {
        case ObjectEvent.Value:
          callback(reader(this.data.get(path) || {}));
          break;
        case ListEvent.ChildAdded:
          forEach(this.data.get(path), (item: {}) => callback(reader(item)));
          break;
        default:
      }
    });

    return async () => {
      log.info('[StubStrategy]', 'unsubscribe', { path, event, callback });
      this.eventBus.off(path, event, callback);
    };
  }

  async push(
    path: string,
    data: {},
  ): Promise<string> {
    log.info('[StubStrategy]', 'push', { path, data });

    const id = `${Date.now()}_${shortid()}`;

    await this.checkPath(`${path}/${id}`, 'write');

    const newData = {
      ...data,
      id,
    };

    this.data.set(`${path}/${id}`, newData);

    setTimeout(() => {
      this.eventBus.emit(path, ListEvent.ChildAdded, newData);
      this.eventBus.emit(`${path}/${id}`, ObjectEvent.Value, newData);
    });

    return id;
  }

  async update(
    path: string,
    data: any,
  ): Promise<void> {
    log.info('[StubStrategy]', 'update', { path, data });

    await this.checkPath(path, 'write');

    const oldData = this.data.get<{ id?: string }>(path);
    const newData = (typeof data === 'object' && oldData) ? {
      ...oldData,
      ...data,
      id: oldData.id,
    } : data;
    this.data.set(path, newData);

    setTimeout(() => this.emitUpdate(path));
  }

  async remove(
    path: string,
  ): Promise<void> {
    const match = path.match(/[^/]+$/);
    if (!match) return;
    const key = match[0];

    log.info('[StubStrategy]', 'remove', { path, key });

    await this.checkPath(path, 'write');

    const parentPath = getParentPath(path);
    const parentData = parentPath && this.data.get<{ [key: string]: {} }>(parentPath);
    if (parentData) delete parentData[key];

    setTimeout(() => {
      if (parentPath) this.eventBus.emit(parentPath, ListEvent.ChildRemoved, { id: key });
      this.emitUpdate(path);
    });
  }

  async pushFile(
    roomId: string,
    path: string,
    file: File,
  ): Promise<string> {
    log.info('[StubStrategy]', 'putFile', { roomId, path, file });

    const filePath = `files/${roomId}/${path}`;
    const oldUrl = this.data.get<string>(filePath);
    if (oldUrl) URL.revokeObjectURL(oldUrl);

    const url = URL.createObjectURL(file);

    this.data.set(filePath, url);

    return url;
  }

  async removeFile(
    roomId: string,
    path: string,
  ): Promise<void> {
    log.info('[StubStrategy]', 'removeFile', { roomId, path });

    const filePath = `files/${roomId}/${path}`;
    const url = this.data.get<string>(filePath);
    if (url) {
      URL.revokeObjectURL(url);
      this.data.set(filePath, null);
    }
  }

  async removeFiles(
    roomId: string,
  ): Promise<void> {
    log.info('[StubStrategy]', 'removeFiles', { roomId });

    const data = this.data.get<string>(`files/${roomId}`);
    if (data) {
      values(data).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
      this.remove(`files/${roomId}`);
    }
  }
}
