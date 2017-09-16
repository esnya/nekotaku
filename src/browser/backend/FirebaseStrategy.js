/* eslint no-return-await: off */
import EventEmitter from 'eventemitter3';
import _ from 'lodash';
import firebase from 'firebase';
import BackendStrategy, { type Handler } from './BackendStrategy';

function dataFilter(data) {
  return data.val();
}

function itemFilter(data) {
  return {
    id: data.key,
    ...dataFilter(data),
  };
}

function roomFilter(data) {
  const {
    password,
    ...others
  } = itemFilter(data);

  return {
    ...others,
    isLocked: Boolean(password),
  };
}

const ListEvents = {
  add: 'child_added',
  change: 'child_changed',
  remove: 'child_removed',
};
function watchList(
  ref: firebase.database.Reference,
  type: string,
  handler: Handler,
  filter = itemFilter,
) {
  _(ListEvents).forEach((src, dst) => {
    const event = `${type}:${dst}`;
    ref.on(src, v => handler(event, filter(v)));
  });
}

function unwatchList(ref: firebase.database.Reference) {
  _(ListEvents).forEach((src) => {
    ref.off(src);
  });
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

    this.roomsRef = database.ref('rooms');

    const storage = firebase.storage();
    this.storage = storage;
  }

  /* Utilities */

  databaseRef(path: string): firebase.database.Reference {
    return this.database.ref(path);
  }
  childRef(
    type: string,
    roomId: string,
    childId: ?string = null,
    key: ?string = null,
  ): firebase.database.Reference {
    return this.databaseRef([type, roomId, childId, key].filter(a => a).join('/'));
  }
  roomRef(roomId: string): firebase.database.Referenct {
    return this.childRef('rooms', roomId);
  }
  async getRoomSnapshot(roomId: string): Promise<firebase.database.DataSnapshot> {
    const dataSnapshot = await this.roomRef(roomId).once('value');
    return dataSnapshot;
  }
  storageRef(roomId: string, path: string): firebase.storeage.Reference {
    return this.storage.ref(`${roomId}/${path}`);
  }
  async getUser(): Promise<firebase.auth.UserCredential> {
    if (this.user) return this.user;

    const user = await new Promise((resolve) => {
      this.eventBus.once('auth_state_changed', resolve);
    });

    return user;
  }
  async updateMemberCount(roomId: string): Promise<void> {
    const data = await this.childRef('members', roomId).once('value');
    this.update('rooms', roomId, { players: Object.keys(data.val()).length });
  }

  /* Strategy Implements */

  async watchLobby(handler: Handler) {
    watchList(this.roomsRef, 'rooms', handler, roomFilter);
  }
  async unwatchLobby() {
    unwatchList(this.roomsRef);
  }
  async watchRoom(roomId: string, handler: Handler) {
    const ref = this.childRef('rooms', roomId);
    const event = 'room:update';
    ref.on('value', v => handler(event, roomFilter(v)));
  }
  async unwatchRoom(roomId: string) {
    const ref = this.childRef('rooms', roomId);
    ref.off('value');
  }
  async watchObject(type: string, roomId: string, handler: Handler) {
    const ref = this.childRef(type, roomId);
    const event = `${type}:update`;
    ref.on('value', v => handler(event, dataFilter(v)));
  }
  async unwatchObject(type: string, roomId: string) {
    const ref = this.childRef(type, roomId);
    ref.off('value');
  }
  async watchList(type: string, roomId: string, handler: Handler) {
    const ref = this.childRef(type, roomId);
    watchList(ref, type, handler);
  }
  async unwatchList(type: string, roomId: string) {
    const ref = this.childRef(type, roomId);
    unwatchList(ref);
  }

  async update(type: string, roomId: string, value: Object) {
    const ref = this.childRef(type, roomId);
    await ref.update(value);
  }
  async remove(type: string, roomId: string) {
    const ref = this.childRef(type, roomId);
    await ref.remove();
  }
  async addChild(type: string, roomId: string, value: string) {
    const ref = this.childRef(type, roomId).push();
    ref.set(value);
    return ref.key;
  }
  async changeChild(type: string, roomId: string, childId: string, value: Object) {
    const ref = this.childRef(type, roomId, childId);
    await ref.update(value);
  }
  async changeChildValue(type: string, roomId: string, childId: string, key: string, value: any) {
    const ref = this.childRef(type, roomId, childId, key);
    await ref.set(value);
  }
  async removeChild(type: string, roomId: string, childId: string): Promise<void> {
    const ref = this.childRef(type, roomId, childId);
    await ref.remove();
  }

  async uploadFile(roomId: string, path: string, file: File) {
    const ref = this.storageRef(roomId, path);
    const { downloadURL } = await ref.put(file, { contentType: file.type });
    return downloadURL;
  }
  async deleteFile(roomId: string, path: string) {
    try {
      const ref = this.storageRef(roomId, path);
      await ref.delete();
    } catch (e) {
      if (e.code !== 'storage/object-not-found') throw e;
    }
  }

  async createRoom(room: Object) {
    const ref = this.databaseRef('rooms').push();
    await ref.set(room);
    return ref.key;
  }
  async getRoom(roomId: string) {
    const room = await this.getRoomSnapshot(roomId);
    return room.exists() ? roomFilter(room) : null;
  }
  async updateRoom(roomId: string, value: Object) {
    await this.update('rooms', roomId, value);
  }
  async loginRoom(roomId: string, password: ?string) {
    const user = await this.getUser();

    if (password) {
      await this.childRef('passwords', roomId, user.uid).set(password);
    }

    try {
      await this.childRef('members', roomId, user.uid).set(Date.now());

      this.updateMemberCount(roomId);

      return true;
    } catch (e) {
      return false;
    }
  }
  async removeRoom(roomId: string) {
    const ref = this.roomRef(roomId);
    await ref.set({ canRemove: true });

    await this.remove('members', roomId);
    await this.remove('passwords', roomId);
    await this.remove('rooms', roomId);
  }

  async removeMe(roomId: string) {
    const { uid } = await this.getUser();
    await this.childRef('members', roomId, uid).remove();
  }
}
