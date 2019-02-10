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

    if (!config.firebase) {
      firebase.initializeApp(config);
    }

    const app = config.firebase || firebase.app();

    const auth = app.auth();

    auth.onAuthStateChanged((user) => {
      this.user = user;
      this.eventBus.emit('auth_state_changed', user);
    });
    auth.signInAnonymously();

    const database = app.database();
    this.database = database;

    const storage = app.storage();
    this.storage = storage;

    if ((typeof config.onInitialized) === 'function') config.onInitialized();
  }

  getType(): string {
    return 'firebase';
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
    callback: (data: Object) => void,
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
    roomId: string,
    path: string,
    file: File,
  ): Promise<string> {
    const dbPath = `files/${roomId}`;
    return this.handleError(dbPath, async () => {
      await this.push(dbPath, { path });

      const ref = this.storage.ref(`${roomId}/${path}`);
      await ref.put(file);

      const url = ref.getDownloadURL();
      return url;
    });
  }

  async removeFile(
    roomId: string,
    path: string,
  ): Promise<string> {
    try {
      await this.storage.ref(`${roomId}/${path}`).delete();
      // eslint-disable-next-line no-empty
    } catch (e) {
    }
  }

  removeFiles(
    roomId: string,
  ): Promise<void> {
    const dbPath = `files/${roomId}`;
    return this.handleError(dbPath, async () => {
      const snapshot = await this.ref(dbPath).once('value');
      const files = snapshot.val();
      await Promise.all(_.map(files, async ({ path }, key) => {
        await this.ref(`files/${roomId}/${key}`).remove();
        await this.removeFile(roomId, path);
      }));
    });
  }
}
