/* eslint no-console: off, class-methods-use-this: off */

import _ from 'lodash';
import EventEmitter from 'eventemitter3';
import shortid from 'shortid';
import StubData from '../constants/StubData';
import BackendStrategy from './BackendStrategy';
import { ListEvent } from '@/browser/models/ListModel';
import { ObjectEvent } from '@/browser/models/ObjectModel';

function getParentPath(path: string): string {
  return path.replace(/\/?[^/]+$/, '') || null;
}

// function roomFilter(room) {
//   const {
//     password,
//     ...others
//   } = room;

//   return {
//     ...others,
//     isLocked: Boolean(password),
//   };
// }

export const UserId = 'user';

export default class StubStrategy extends BackendStrategy {
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
  get2(path: string, defaultValue = null): any {
    return _.get(this.data, path.replace(/\//g, '.'), defaultValue);
  }

  set2(path: string, data: Object): Object {
    _.set(this.data, path.replace(/\//g, '.'), data);
  }

  emit(path, event, data) {
    console.log('[StubStrategy]', 'emit', { path, event, data });
    this.eventBus.emit(`${path}:${event}`, data);
  }

  emitUpdate(path) {
    console.log('[StubStrategy]', 'emitUpdate', { path });

    if (!path) return;

    const emitData = this.get2(path);

    this.emit(path, ObjectEvent.Value, emitData);

    const parentPath = getParentPath(path);
    if (!path) return;

    if (emitData !== null) this.emit(parentPath, ListEvent.ChildChanged, emitData);

    this.emitUpdate(parentPath);
  }

  /* APIs */
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
      this.emit(path, ListEvent.ChildAdded, newData);
      this.emit(`${path}/${id}`, ObjectEvent.Value, newData);
    });

    return id;
  }

  async update(
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

  async remove(
    path: string,
  ): Promise<string> {
    const [key] = path.match(/[^/]+$/);

    console.log('[StubStrategy]', 'remove', { path, key });

    const parentPath = getParentPath(path);
    delete this.get2(parentPath)[key];

    setTimeout(() => {
      this.emit(parentPath, ListEvent.ChildRemoved, key);
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
