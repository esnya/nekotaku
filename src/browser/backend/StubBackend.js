/* eslint no-console: off, class-methods-use-this: off */

import _ from 'lodash';
import EventEmitter from 'eventemitter3';
import shortid from 'shortid';
import StubData from '../constants/StubData';
import Backend, { UnauthorizedError, NotFoundError } from './Backend';
import * as ListEvent from '@/constants/ListEvent';
import * as ObjectEvent from '@/constants/ObjectEvent';
import checkRule from '@/utilities/rule';

function getParentPath(path: string): string {
  return path.replace(/\/?[^/]+$/, '') || null;
}

function filter(data: Object): Object {
  if (data && data.password) {
    const {
      password,
      ...others
    } = data;
    return {
      ...others,
      isLocked: Boolean(password),
    };
  }

  return data;
}

export const UserId = 'user';

export default class StubBackend extends Backend {
  constructor(config: Object) {
    super(config);

    this.eventBus = new EventEmitter();

    this.data = {
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

      this.data.rooms[id] = room;
      ['characters', 'messages', 'shapes', 'memos'].forEach((type) => {
        this.data[type][id] = _(StubData[type])
          .map(a => [a.id, { ...a }])
          .fromPairs()
          .value();
      });
      this.data.maps[id] = { ...StubData.map };
      this.data.members[id] = {};
    });
  }

  /* Utilities */
  get(path: string, defaultValue = null): any {
    return _.get(this.data, path.replace(/\//g, '.'), defaultValue);
  }

  set(path: string, data: Object): Object {
    _.set(this.data, path.replace(/\//g, '.'), data);
  }

  on(path, event, callback) {
    this.eventBus.on(`${path}:${event}`, callback);
    return callback;
  }

  off(path, event, callback) {
    this.eventBus.off(`${path}:${event}`, callback);
  }

  emit(path, event, data) {
    console.log('[StubStrategy]', 'emit', { path, event, data });
    this.eventBus.emit(`${path}:${event}`, filter(data));
  }

  emitUpdate(path) {
    console.log('[StubStrategy]', 'emitUpdate', { path });

    if (!path) return;

    const emitData = this.get(path);

    this.emit(path, ObjectEvent.Value, emitData);

    const parentPath = getParentPath(path);
    if (!path) return;

    if (emitData !== null) this.emit(parentPath, ListEvent.ChildChanged, emitData);

    this.emitUpdate(parentPath);
  }

  async checkPath(path: string, mode: string) {
    const authorized = await checkRule(path, mode, UserId, async p => this.get(p));
    if (authorized) return;

    const roomId = path.split(/\//g)[1];
    const room = await this.get(`rooms/${roomId}`);

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
    callback: Object => void,
  ): Promise<() => Promise<void>> {
    console.log('[StubStrategy]', 'subscribe', { path, event, callback });

    await this.checkPath(path, 'read');

    this.on(path, event, callback);

    setTimeout(() => {
      switch (event) {
        case ObjectEvent.Value:
          callback(filter(this.get(path)));
          break;
        case ListEvent.ChildAdded:
          _(this.get(path)).forEach(item => callback(filter(item)));
          break;
        default:
      }
    });

    return () => {
      console.log('[StubStrategy]', 'unsubscribe', { path, event, callback });
      this.off(path, event, callback);
    };
  }

  async push(
    path: string,
    data: string,
  ): Promise<string> {
    console.log('[StubStrategy]', 'push', { path, data });

    const id = `${Date.now()}_${shortid()}`;

    await this.checkPath(`${path}/${id}`, 'write');

    const newData = {
      ...data,
      id,
    };

    this.set(`${path}/${id}`, newData);

    setTimeout(() => {
      this.emit(path, ListEvent.ChildAdded, newData);
      this.emit(`${path}/${id}`, ObjectEvent.Value, newData);
    });

    return id;
  }

  async update(
    path: string,
    data: any,
  ): Promise<void> {
    console.log('[StubStrategy]', 'update', { path, data });

    await this.checkPath(path, 'write');

    const oldData = this.get(path);
    const newData = (typeof data === 'object' && oldData && oldData.id) ? {
      ...oldData,
      ...data,
      id: oldData.id,
    } : data;
    this.set(path, newData);

    setTimeout(() => this.emitUpdate(path));
  }

  async remove(
    path: string,
  ): Promise<void> {
    const [key] = path.match(/[^/]+$/);

    console.log('[StubStrategy]', 'remove', { path, key });

    await this.checkPath(path, 'write');

    const parentPath = getParentPath(path);
    delete this.get(parentPath)[key];

    setTimeout(() => {
      this.emit(parentPath, ListEvent.ChildRemoved, { id: key });
      this.emitUpdate(path);
    });
  }

  async pushFile(
    path: string,
    file: File,
  ): Promise<string> {
    console.log('[StubStrategy]', 'putFile', { path, file });

    const filePath = `files/${path}`;
    const oldUrl = this.get(filePath);
    if (oldUrl) URL.revokeObjectURL(oldUrl);

    const url = URL.createObjectURL(file);

    this.set(filePath, url);

    return url;
  }

  async removeFile(
    path: string,
  ): Promise<void> {
    console.log('[StubStrategy]', 'removeFile', { path });

    const filePath = `files/${path}`;
    const url = this.get(filePath);
    if (url) {
      URL.revokeObjectURL(url);
      this.set(filePath, null);
    }
  }

  async removeFiles(
    path: string,
  ): Promise<void> {
    console.log('[StubStrategy]', 'removeFiles', { path });

    const data = this.get(`files/${path}`);
    if (typeof data === 'string') await this.removeFile(path);
    else if (data && typeof data === 'object') {
      await Promise.all(Object.keys(data).map(key => this.removeFiles(`${path}/${key}`)));
    }
  }
}
