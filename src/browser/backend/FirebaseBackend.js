/* eslint no-return-await: off */

import _ from 'lodash';
import EventEmitter from 'eventemitter3';
import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/database';
import '@firebase/storage';
import Backend, { NotFoundError, UnauthorizedError } from './Backend';

function filter(snapshot) {
  const val = snapshot.val();

  if (!val || typeof val !== 'object') return val;

  return _.pickBy({
    ...val,
    id: snapshot.key,
    password: undefined,
    isLocked: val.password ? true : undefined,
  }, v => v !== undefined);
}

export default class FirebaseBackend extends Backend {
  constructor(config: Object) {
    super(config);

    this.eventBus = new EventEmitter();

    firebase.initializeApp(config);

    const auth = firebase.auth();

    auth.onAuthStateChanged((user) => {
      this.user = user;
      this.eventBus.emit('auth_state_changed', user);
    });
    auth.signInAnonymously();

    const database = firebase.database();
    this.database = database;

    const storage = firebase.storage();
    this.storage = storage;
  }

  /* Utilities */
  ref(path: string) {
    return this.database.ref(path);
  }

  async handleError<T>(path, callback: () => Promise<T>): Promise<T> {
    try {
      const result = await callback();
      return result;
    } catch (e) {
      if (e.code === 'PERMISSION_DENIED') {
        const [model, roomId] = path.split(/\//g);
        if (model === 'members') {
          const roomRef = this.ref(`rooms/${roomId}`);
          const room = await roomRef.once('value');
          if (!room.val()) throw new NotFoundError();
        }

        throw new UnauthorizedError();
      }
      throw e;
    }
  }

  /* APIs */
  async getUID(): Promise<string> {
    if (this.user) return this.user.uid;
    return new Promise((resolve) => {
      this.eventBus.once('auth_state_changed', user => resolve(user.uid));
    });
  }

  subscribe(
    path: string,
    event: string,
    callback: Object => void,
  ): Promise<() => Promise<void>> {
    return this.handleError(path, async () => {
      const wrappedCallback = this.ref(path).on(event, snapshot => callback(filter(snapshot)));

      return () => {
        this.ref(path).off(event, wrappedCallback);
      };
    });
  }

  push(
    path: string,
    data: string,
  ): Promise<string> {
    return this.handleError(path, async () => {
      const ref = this.ref(path).push();
      await ref.set(data);
      return ref.key;
    });
  }

  update(
    path: string,
    data: any,
  ): Promise<void> {
    return this.handleError(path, async () => {
      const ref = this.ref(path);

      if (data && typeof data === 'object') await ref.update(data);
      else await ref.set(data);
    });
  }

  remove(
    path: string,
  ): Promise<void> {
    return this.handleError(path, async () => {
      const ref = this.ref(path);
      await ref.remove();
    });
  }

  pushFile(
    path: string,
    file: File,
  ): Promise<string> {
    return this.handleError(path, async () => {
      const ref = this.storage.ref(path);
      await ref.put(file);
      const url = ref.getDownloadURL();
      await this.ref(`files/${path}`).set(path);
      return url;
    });
  }

  removeFile(
    path: string,
  ): Promise<string> {
    return this.handleError(path, async () => {
      const ref = this.storage.ref(path);
      await ref.delete();
      await this.ref(`files/${path}`).remove();
    });
  }

  removeFiles(
    path: string,
  ): Promise<void> {
    return this.handleError(path, async () => {
      const ref = this.ref(`files/${path}`);
      const data = ref.once('value');

      if (typeof data === 'string') await this.removeFile(path);
      else if (data && typeof data === 'object') {
        await Promise.all(Object.keys(data).map(key => this.removeFiles(`${path}/${key}`)));
      }
    });
  }
}
