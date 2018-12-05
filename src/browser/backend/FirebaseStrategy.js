/* eslint no-return-await: off */

import _ from 'lodash';
import EventEmitter from 'eventemitter3';
import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/database';
import '@firebase/storage';
import BackendStrategy from './BackendStrategy';

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

export default class FirebaseStrategy extends BackendStrategy {
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

  /* APIs */
  async getUID(): Promise<string> {
    if (this.user) return this.user.uid;
    return new Promise((resolve) => {
      this.eventBus.once('auth_state_changed', user => resolve(user.uid));
    });
  }

  async subscribe(
    path: string,
    event: string,
    callback: Object => void,
  ): Promise<() => Promise<void>> {
    const wrappedCallback = this.ref(path).on(event, snapshot => callback(filter(snapshot)));

    return () => {
      this.ref(path).off(event, wrappedCallback);
    };
  }

  async push(
    path: string,
    data: string,
  ): Promise<string> {
    const ref = this.ref(path).push();
    await ref.set(data);
    return ref.key;
  }

  async update(
    path: string,
    data: any,
  ): Promise<void> {
    const ref = this.ref(path);

    if (data && typeof data === 'object') await ref.update(data);
    else await ref.set(data);
  }

  async remove(
    path: string,
  ): Promise<void> {
    const ref = this.ref(path);
    await ref.remove();
  }

  async pushFile(
    path: string,
    file: File,
  ): Promise<string> {
    const ref = this.storage.ref(path);
    await ref.put(file);
    const url = ref.getDownloadURL();
    await this.ref(`files/${path}`).set(path);
    return url;
  }

  async removeFile(
    path: string,
  ): Promise<string> {
    const ref = this.storage.ref(path);
    await ref.delete();
    await this.ref(`files/${path}`).remove();
  }

  async removeFiles(
    path: string,
  ): Promise<void> {
    const ref = this.ref(`files/${path}`);
    const data = ref.once('value');

    if (typeof data === 'string') await this.removeFile(path);
    else if (data && typeof data === 'object') {
      await Promise.all(Object.keys(data).map(key => this.removeFiles(`${path}/${key}`)));
    }
  }
}
