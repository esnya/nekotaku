import { EventEmitter } from 'events';
import _ from 'lodash';
import shortid from 'shortid';

const initializeApp = jest.fn();

const UID = 'local-uid';
const authEventBus = new EventEmitter();
const mockUser = {
  uid: UID,
};
const mockAuth = {
  signInAnonymously: jest.fn(() => authEventBus.emit('auth_state_changed', mockUser)),
  onAuthStateChanged: jest.fn((listener: any => any) => authEventBus.on('auth_state_changed', listener)),
};
const auth = jest.fn().mockReturnValue(mockAuth);

function getKeys(path: string): string[] {
  return path.replace(/^\//, '').split(/\//g);
}
function getLastKey(path: string): string {
  return getKeys(path).slice(-1)[0];
}
function getParent(path: string): string {
  return getKeys(path).slice(0, -1).join('/');
}

class DatabaseStore {
  data: Object;
  constructor() {
    this.data = {};
  }

  get(path: string) {
    // console.log('store.get', path, this.data);

    return getKeys(path).reduce((prev, curr) => (prev || {})[curr], this.data);
  }
  set(path: string, data: any) {
    // console.log('store.set', path, data);

    let target = this.data;
    const keys = getKeys(path);

    keys.slice(0, -1).forEach((key) => {
      if (!(key in target)) {
        target[key] = {};
      }

      target = target[key];
    });

    const lastKey = keys.slice(-1)[0];
    if (data === null) {
      delete target[lastKey];
    } else {
      target[lastKey] = (typeof data === 'object')
        ? _.pickBy(data, v => v !== null)
        : data;
    }
  }
  remove(path: string) {
    const target = this.get(getParent(path));
    const lastKey = getLastKey(path);
    if (target && (lastKey in target)) delete target[getLastKey(path)];
  }
}
const databaseStore = new DatabaseStore();
const databaseEventBus = new EventEmitter();
class DatabaseSnapshot {
  path: string;
  constructor(path: string, data: any) {
    this.path = path;
    this.data = data;
  }

  get key() {
    return getLastKey(this.path);
  }

  val() {
    return this.data;
  }

  exists() {
    return this.key in databaseStore.get(getParent(this.path));
  }
}
class DatabaseReference {
  path: string;

  constructor(path: string) {
    this.path = path || '/';
  }

  isWritable() {
    const m = this.path.match(/(members)\/([^/]+)\/([^/]+)$/);
    if (m && m[1] === 'members') {
      const roomId = m[2];
      const room = databaseStore.get(`rooms/${roomId}`);
      const member = databaseStore.get(`members/${roomId}/${UID}`);
      const password = databaseStore.get(`passwords/${roomId}/${UID}`);

      return member || !room.password || room.password === password;
    }

    return true;
  }

  getEventName(event: string) {
    return `${this.path}@${event}`;
  }
  emit(event: string, snapshot: DatabaseSnapshot) {
    databaseEventBus.emit(this.getEventName(event), snapshot);
  }
  getSnapshot() {
    return new DatabaseSnapshot(this.path, databaseStore.get(this.path));
  }

  get key() {
    return getLastKey(this.path);
  }

  parent() {
    if (!this.path || this.path === '/') return null;
    return new DatabaseReference(getParent(this.path));
  }
  child(path: string) {
    return new DatabaseReference(`${this.path}/${path}`);
  }

  exists(): boolean {
    return Boolean(databaseStore.get(this.path));
  }

  push(): DatabaseReference {
    return new DatabaseReference(`${this.path}/${shortid()}`);
  }
  async set(data: any) {
    if (!this.isWritable()) throw new Error('Can not write');

    const exists = this.exists();

    databaseStore.set(this.path, data);
    const snapshot = this.getSnapshot();
    this.emit('value', snapshot);

    this.parent().emit(exists ? 'child_changed' : 'child_added', snapshot);
    let target = this.parent().parent();
    let targetSnapshot = this.parent().getSnapshot();
    while (target) {
      target.emit('child_changed', targetSnapshot);
      targetSnapshot = target.getSnapshot();
      target = target.parent();
    }
  }
  async update(data: any) {
    const oldData = databaseStore.get(this.path);
    await this.set({
      ...oldData,
      ...data,
    });
  }
  async remove() {
    if (!this.isWritable()) throw new Error('Can not write');

    const snapshot = this.getSnapshot();
    databaseStore.remove(this.path);
    this.emit('value', new DatabaseSnapshot(this.path, null));
    this.parent().emit('child_removed', snapshot);
  }

  emitImmediateEvent(event: string, listener: any => any) {
    if (event === 'value') {
      listener(this.getSnapshot());
      return true;
    } else if (event === 'child_added') {
      _(databaseStore.get(this.path)).forEach((data, key) => {
        listener(new DatabaseSnapshot(`${this.path}/${key}`, data));
      });
      return true;
    }
    return false;
  }
  on(event: string, listener: any => any) {
    databaseEventBus.on(this.getEventName(event), listener);
    this.emitImmediateEvent(event, listener);
  }
  once(event: string, listener: Function): Promise<any> {
    let listenerWithPromise;
    const promise = new Promise((resolve) => {
      listenerWithPromise = (data) => {
        if (listener) listener(data);
        resolve(data);
      };
    });

    if (!this.emitImmediateEvent(event, listenerWithPromise)) {
      databaseEventBus.once(this.getEventName(event), listenerWithPromise);
    }

    return promise;
  }
  off(event: string, listener?: any => any) {
    if (listener) {
      databaseEventBus.removeListener(event, listener);
    } else {
      databaseEventBus.removeAllListeners(event);
    }
  }
}
const mockDatabase = {
  ref: jest.fn(path => new DatabaseReference(path)),
};
const database = jest.fn().mockReturnValue(mockDatabase);

const storageStore = {};
class StorageObjectNotFoundError extends Error {
  constructor(msg) {
    super(msg);
    this.code = 'storage/object-not-found';
  }
}
class StorageReference {
  path: string;
  constructor(path?: string) {
    this.path = path || '/';
  }

  async put() {
    // console.log('storage.put', this.path);
    storageStore[this.path] = true;
    return {};
  }
  async delete() {
    // console.log('storage.delete', this.path);
    if (!storageStore[this.path]) throw new StorageObjectNotFoundError('File not found');
  }

  getDownloadURL() {
    return '/';
  }
}
const mockStorage = {
  ref: (path?: string) => new StorageReference(path),
};
const storage = jest.fn().mockReturnValue(mockStorage);

module.exports = {
  initializeApp,
  database,
  auth,
  storage,
};
