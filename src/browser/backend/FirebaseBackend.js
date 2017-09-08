/* eslint no-return-await: off */
import EventEmitter from 'eventemitter3';
import _ from 'lodash';
import firebase from 'firebase';
import Backend from './Backend';
import * as JoinResult from './JoinResult';

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

const ChildLists = [
  'characters',
  'messages',
  'shapes',
];
const ChildObjects = [
  'map',
  'member',
];
const ListEvents = {
  add: 'child_added',
  change: 'child_changed',
  remove: 'child_removed',
};

export default class FirebaseBackend extends Backend {
  constructor(config) {
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

    this.rooms = database.ref('rooms');

    const storage = firebase.storage();
    this.storage = storage;
  }

  ref(path) {
    return this.database.ref(path);
  }
  async getUser() {
    if (this.user) return this.user;

    const user = await new Promise((resolve) => {
      this.eventBus.once('auth_state_changed', resolve);
    });
    return user;
  }
  async withRoom(callback) {
    if (this.room) {
      const result = await callback(this.room, this.roomId);
      return result;
    }

    return null;
  }
  async uploadFile(path: string, file: File) {
    return await this.withRoom(async () => {
      const ref = this.roomStorage.child(path);

      return await new Promise((resolve, reject) => {
        ref
          .put(file, {
            contentType: file.type,
          })
          .then(resolve, reject);
      });
    });
  }
  async deleteFile(path: string) {
    return await this.withRoom(async () => {
      try {
        return await this.roomStorage.child(path).delete();
      } catch (e) {
        if (e.code !== 'storage/object-not-found') throw e;
        return null;
      }
    });
  }

  async joinLobby(handler) {
    this.rooms.on('child_added', value => handler('rooms:add', roomFilter(value)));
  }
  async leaveLobby() {
    this.rooms.off('child_added');
  }
  async createRoom(
    title: string,
    dice: string,
    characterAttributes: string[],
    mapWidth: number,
    mapHeight: number,
  ) {
    const user = await this.getUser();

    const roomRef = this.rooms.push();

    const now = Date.now();
    await roomRef.set({
      title,
      dice,
      characterAttributes,
      createdAt: now,
      updatedAt: now,
    });

    await this.ref(`member/${roomRef.key}/${user.uid}`).set(Date.now());

    await this.ref(`map/${roomRef.key}`).set({
      width: mapWidth,
      height: mapHeight,
    });

    return roomRef.key;
  }

  async joinRoom(id: string, password: ?string, handler) {
    const user = await this.getUser();

    const prefetchedRoom = await this.rooms.child(id).once('value');
    if (!prefetchedRoom.exists()) {
      return {
        result: JoinResult.NotFound,
      };
    }

    if (password) {
      this.ref(`password/${id}/${user.uid}`).set(password);
    }
    try {
      await this.ref(`member/${id}/${user.uid}`).set(Date.now());
    } catch (e) {
      return {
        result: JoinResult.PasswordRequired,
        title: prefetchedRoom.val().title,
      };
    }

    const room = this.rooms.child(id);
    this.roomId = id;
    this.room = room;

    this.roomStorage = this.storage.ref(id);

    room.on('value', v => handler('room:update', roomFilter(v)));
    ChildLists.forEach((key) => {
      const ref = this.ref(`${key}/${id}`);
      this[key] = ref.ref;

      _(ListEvents).forEach((src, dst) => {
        const event = `${key}:${dst}`;
        ref.on(src, v => handler(event, itemFilter(v)));
      });
    });

    ChildObjects.forEach((key) => {
      const ref = this.ref(`${key}/${id}`);
      this[key] = ref.ref;

      const event = `${key}:update`;
      ref.on('value', v => handler(event, dataFilter(v)));
    });

    const memberData = await this.ref(`member/${id}`).once('value');
    room.child('players').set(Object.keys(memberData.val()).length);

    return {
      result: JoinResult.OK,
    };
  }
  async leaveRoom() {
    const { id, room } = this;
    if (!id || !room) return;

    ChildLists.forEach((key) => {
      const ref = this[key];
      this[key] = null;

      _(ListEvents).forEach((src) => {
        ref.off(src);
      });
    });

    ChildObjects.forEach((key) => {
      const ref = this[key];
      this[key] = null;
      ref.off('value');
    });

    this.room.off('update');

    this.roomStorage = null;
    this.roomId = null;
    this.room = null;
  }

  async updateRoom(key, value) {
    return await this.withRoom((room) => {
      room.update({
        [key]: value,
      });
    });
  }
  async clearRoomPassword() {
    return await this.updateRoomPassword(null);
  }
  async updateRoomPassword(password) {
    return await this.updateRoom('password', password);
  }

  async update(key, value) {
    return await this.withRoom(
      () => this[key].update(value),
    );
  }
  async addChild(type, value) {
    return await this.withRoom(() => {
      const ref = this[type].push();

      ref.set(value);

      return ref.key;
    });
  }
  async changeChild(type, id, value) {
    return await this.withRoom(() => {
      const list = this[type];
      const ref = list.child(id);
      return ref.update(value);
    });
  }
  async removeChild(type, id) {
    return await this.withRoom(async () => {
      const list = this[type];
      const ref = list.child(id);
      const result = await ref.remove();

      return result;
    });
  }

  async sendMessage(message) {
    return await this.addChild('messages', message);
  }

  async createCharacter(character) {
    return await this.addChild('characters', character);
  }
  async updateCharacter(id, key, value) {
    return await this.changeChild('characters', id, { [key]: value });
  }
  async removeCharacter(id) {
    await Promise.all([
      this.clearCharacterIcon(id),
      this.clearCharacterPortrait(id, 'default'),
    ]);
    return await this.removeChild('characters', id);
  }
  async moveCharacter(id, x, y, z) {
    return await this.changeChild('characters', id, {
      x, y, z,
    });
  }
  async clearCharacterIcon(id) {
    await this.deleteFile(`characters/${id}/icon`);
    return await this.updateCharacter(id, 'icon', null);
  }
  async clearCharacterPortrait(id, key) {
    await this.deleteFile(`characters/${id}/portrailt/${key}/`);
    return await this.updateCharacter(id, 'portrait', { [key]: null });
  }
  async updateCharacterIcon(id, file) {
    const { downloadURL } = await this.uploadFile(`characters/${id}/icon`, file);
    return await this.updateCharacter(id, 'icon', downloadURL);
  }
  async updateCharacterPortrait(id, key, file) {
    const { downloadURL } = await this.uploadFile(`characters/${id}/portrailt/${key}`, file);
    return await this.characters.child(`${id}/portrait/${key}/url`).set(downloadURL);
  }

  async createShape(shape) {
    return await this.addChild('shapes', shape);
  }
  async updateShape(id, shape) {
    return await this.changeChild('shapes', id, shape);
  }
  async removeShape(id) {
    return await this.removeChild('shapes', id);
  }
  async moveShape(id, x, y, z) {
    return await this.changeChild('shapes', id, { x, y, z });
  }

  async updateMap(key, value) {
    return await this.update('map', { [key]: value });
  }
  async clearMapBackgroundImage() {
    await this.deleteFile('map');
    return await this.update('mape', { backgroundImage: null });
  }
  async updateMapBackgroundImage(file) {
    const { downloadURL } = await this.uploadFile('map', file);
    return await this.update('map', { backgroundImage: downloadURL });
  }
}
