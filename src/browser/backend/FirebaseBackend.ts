/* eslint no-return-await: off */

import EventEmitter from 'eventemitter3';
import firebase from 'firebase';
import map from 'lodash/map';
import pickBy from 'lodash/pickBy';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import Backend from '@/browser/backend/Backend';
import NotFoundError from '@/browser/backend/NotFoundError';
import UnauthorizedError from '@/browser/backend/UnauthorizedError';
import FirebaseBackendOptions from './FirebaseBackendOptions';

function reader(snapshot: firebase.database.DataSnapshot | null): {} | null {
  if (!snapshot) return null;

  const val = snapshot.val();

  if (!val || typeof val !== 'object') return val;

  return pickBy({
    ...val,
    id: snapshot.key,
    password: undefined,
    isLocked: val.password ? true : undefined,
  }, v => v !== undefined);
}

type FirebaseEvent = 'value' | 'child_added' | 'child_changed' | 'child_removed';


export default class FirebaseBackend implements Backend {
  private eventBus = new EventEmitter();
  private database: firebase.database.Database;
  private storage: firebase.storage.Storage;
  private user: firebase.User | null = null;

  constructor(options: FirebaseBackendOptions) {
    if (!options.firebase) {
      firebase.initializeApp(options);
    }

    const app = options.firebase || firebase.app();

    if (!app.auth) throw Error('Failed to initialize firebase');
    const auth = app.auth();

    auth.onAuthStateChanged((user: firebase.User | null) => {
      this.user = user;
      this.eventBus.emit('auth_state_changed', user);
    });
    auth.signInAnonymously();

    if (!app.database) throw Error('Failed to initialize firebase');
    this.database = app.database();

    if (!app.storage) throw Error('Failed to initialize firebase');
    this.storage = app.storage();

    if (options.onInitialized) options.onInitialized();
  }

  getType(): string {
    return 'firebase';
  }

  /* Utilities */
  ref(path: string) {
    return this.database.ref(path);
  }

  async handleError<T>(path: string, callback: () => Promise<T>): Promise<T> {
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
    callback: (data: {}) => void,
  ): Promise<() => Promise<void>> {
    return this.handleError(path, async () => {
      const wrappedCallback = (
        a: firebase.database.DataSnapshot | null,
        b?: string | null | undefined,
      ) => callback(reader(a) || {});
      this.ref(path).on(event as FirebaseEvent, wrappedCallback);

      return async () => {
        this.ref(path).off(event as FirebaseEvent, wrappedCallback);
      };
    });
  }

  push(
    path: string,
    data: {},
  ): Promise<string> {
    return this.handleError(path, async () => {
      const ref = this.ref(path).push();
      await ref.set(data);
      if (!ref.key) throw new Error(`Failed to push into ${path}`);
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
  ): Promise<void> {
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
      await Promise.all(map(files, async ({ path }, key) => {
        await this.ref(`files/${roomId}/${key}`).remove();
        await this.removeFile(roomId, path);
      }));
    });
  }
}
