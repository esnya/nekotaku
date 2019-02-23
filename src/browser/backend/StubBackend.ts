/* eslint no-console: off, class-methods-use-this: off */

import * as ListEvent from '@/constants/ListEvent';
import * as ObjectEvent from '@/constants/ObjectEvent';
import Backend from '@/browser/backend/Backend';
import EventEmitter from 'eventemitter3';
import NotFoundError from '@/browser/backend/NotFoundError';
import StubData from '@/browser/constants/StubData';
import UnauthorizedError from '@/browser/backend/UnauthorizedError';
import checkRule from '@/utilities/rule';
import forEach from 'lodash/forEach';
import fromPairs from 'lodash/fromPairs';
import get from 'lodash/get';
import log from 'loglevel';
import map from 'lodash/map';
import set from 'lodash/set';
import shortid from 'shortid';
import values from 'lodash/values';
import Timestamp from '@/models/Timestamp';
import CollectionPath from './CollectionPath';
import PathElement from './PathElement';
import Model from '@/models/Model';
import Unsubscribe from './Unsubscribe';
import Room from '@/models/Room';
import { concatItemId } from '../dao/utilities';

function getParentPath(path: string): string | null {
  return path.replace(/\/?[^/]+$/, '') || null;
}

function reader<T>(data: T): T {
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

function v2filter(value: any): Model {
  const {
    id,
    createdAt,
    updatedAt,
    password,
    ...others
  } = value;

  return {
    ...others,
    id,
    createdAt,
    updatedAt,
    isLocked: password ? true : undefined,
  };
}

function v2getObjectPath(path: PathElement[]): string {
  return path.map(e => e.id).join('/');
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

  /* v2 Utilities */
  private v2eventBus = new EventEmitter();
  private v2data: { [collection: string]: { [key: string]: {} } } = {
    'chat-names': {},
    members: {},
    memos: {},
    messages: {},
    rooms: {
      '-room01': {
        id: '-room01',
        channels: ['メイン', '雑談'],
        characterAttributes: ['HP', 'MP'],
        dice: 'SwordWorld2_0',
        title: '卓01',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      '-room02': {
        id: '-room02',
        channels: ['メイン', '雑談'],
        characterAttributes: ['HP', 'SAN'],
        dice: 'Cthulhu7th',
        title: '卓02',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
  };

  v2dataInsert<T extends Timestamp>(
    collection: string,
    collectionObjectPath: string,
    value: T,
  ): string {
    if (!(collection in this.v2data)) throw new Error(`Invalid collection name: ${collection}`);

    const id = shortid();
    const objectPath = [collectionObjectPath, id].filter(a => a).join('/');
    this.v2data[collection][objectPath] = {
      id,
      ...value,
    };
    return id;
  }

  v2dataUpdate<T extends { updatedAt: Date }>(
    collection: string,
    objectId: string,
    id: string,
    value: T,
  ): void {
    if (!(collection in this.v2data)) throw new Error(`Invalid collection name: ${collection}`);

    const oldValue = this.v2data[collection][objectId];
    this.v2data[collection][objectId] = {
      ...oldValue,
      ...value,
      id,
    };
  }

  v2dataFind(collection: string, collectionObjectPath: string): any[] {
    if (!(collection in this.v2data)) throw new Error(`Invalid collection name: ${collection}`);

    return Object.keys(this.v2data[collection])
      .filter(objectId => objectId.match(new RegExp(`^${collectionObjectPath}`)))
      .map(objectId => this.v2data[collection][objectId]);
  }

  v2dataFindOne(collection: string, objectPath: string): any {
    if (!(collection in this.v2data)) throw new Error(`Invalid collection name: ${collection}`);

    return this.v2data[collection][objectPath] || null;
  }

  /* v2 API */
  async v2getUserId(): Promise<string> {
    return UserId;
  }

  async v2add<T extends Timestamp>(path: CollectionPath, value: T): Promise<string> {
    log.info('add', { path, value });

    const {
      parentPath,
      collection,
    } = path;
    if (parentPath.length !== 0) throw new Error('ToDo');

    const collectionObjectPath = v2getObjectPath(parentPath);

    const id = this.v2dataInsert(collection, collectionObjectPath, value);

    setTimeout(() => {
      const objectPath = v2getObjectPath(concatItemId(path, id));
      const addedValue = this.v2dataFindOne(collection, objectPath);
      this.v2eventBus.emit(`${collection}:added`, addedValue);
      this.v2eventBus.emit(`${collection}:${id}:value`, addedValue);
    });

    log.info('data', this.v2data);

    return id;
  }

  async v2update<T extends { updatedAt: Date }>(path: PathElement[], value: T): Promise<void> {
    log.info('update', { path, value });

    const {
      collection,
      id,
    } = path[path.length - 1];
    const objectPath = v2getObjectPath(path);

    this.v2dataUpdate(collection, objectPath, id, value);

    setTimeout(() => {
      const updatedValue = this.v2dataFindOne(collection, objectPath);
      this.v2eventBus.emit(`${collection}:changed`, updatedValue);
      this.v2eventBus.emit(`${collection}:${id}:value`, updatedValue);
    });

    log.info('data', this.v2data);
  }

  async v2remove(path: PathElement[]): Promise<void> {
    throw new Error('ToDo');
  }

  async v2subscribeChild(
    path: CollectionPath,
    onAdded: (value: Model) => void,
    onChanged: (value: Model) => void,
    onRemoved: (id: string) => void,
  ): Promise<Unsubscribe> {
    log.info('subscribeChild', { path });

    const {
      parentPath,
      collection,
    } = path;

    this.v2eventBus.on(`${collection}:added`, value => onAdded(v2filter(value)));
    this.v2eventBus.on(`${collection}:changed`, value => onChanged(v2filter(value)));
    this.v2eventBus.on(`${collection}:removed`, onRemoved);

    setTimeout(() => {
      const collectionObjectPath = v2getObjectPath(parentPath);
      const items = this.v2dataFind(collection, collectionObjectPath);
      items.forEach((item: any) => onAdded(v2filter(item)));
    });

    return async () => {
      this.v2eventBus.off(`${collection}:added`, onAdded);
      this.v2eventBus.off(`${collection}:changed`, onChanged);
      this.v2eventBus.off(`${collection}:removed`, onRemoved);
    };
  }

  async v2subscribeValue(
    path: PathElement[],
    onValue: (value: Model | null) => void,
  ): Promise<Unsubscribe> {
    log.info('subscribeValue', { path });

    const {
      collection,
      id,
    } = path[path.length - 1];

    this.v2eventBus.on(`${collection}:${id}:value`, value => onValue(v2filter(value)));

    setTimeout(() => {
      const value = this.v2dataFindOne(collection, v2getObjectPath(path));
      onValue(v2filter(value));
    });

    return async () => {
      this.v2eventBus.off(`${collection}:${id}:value`, value => onValue(v2filter(value)));
    };
  }
}
