/* eslint no-console: off */

import EventEmitter from 'eventemitter3';
import shortid from 'shortid';
import StubData from '../constants/StubData';
import Backend from './Backend';
import * as JoinResult from './JoinResult';

class ObjectData extends EventEmitter {
  constructor(value) {
    super();
    this.value = Array.isArray(value) ? [...value] : { ...value };
  }

  update(value) {
    this.value = value;
    this.emit('update', value);
  }

  on(event, handler, ignoreFirst = false) {
    const result = super.on(event, handler);
    if (event === 'update' && !ignoreFirst) setTimeout(() => handler(this.value));
    return result;
  }
}

class ArrayData extends ObjectData {
  constructor(value) {
    super((value || []).map(item => (
      (item instanceof ObjectData) ? item : new ObjectData({ id: shortid(), ...item })
    )));

    this.forEach((item) => {
      item.on('update', (newValue) => {
        this.emit('child_changed', newValue);
      }, true);
    });
  }

  map(...args) {
    return this.value.map(...args);
  }
  filter(...args) {
    return this.value.filter(...args);
  }
  find(...args) {
    return this.value.find(...args);
  }
  forEach(...args) {
    return this.value.forEach(...args);
  }

  on(event, handler) {
    const result = super.on(event, handler);
    if (event === 'child_added') {
      setTimeout(() => {
        this.forEach(item => handler(item.value));
      });
    }
    return result;
  }

  push(value) {
    const id = shortid();
    const item = (value instanceof ObjectData)
      ? value : new ObjectData({ id, ...value });

      // eslint-disable-next-line
    if (value instanceof ObjectData) item.value.id = id;

    this.value.push(item);
    this.emit('child_added', item.value);
    item.on('update', (newValue) => {
      this.emit('child_changed', newValue);
    }, true);

    return item;
  }

  remove(id) {
    this.value = this.filter(item => item.id !== id);
    this.emit('child_removed', { id });
  }
}

class RoomChildren {
  constructor(children) {
    this.children = children;
  }

  filter(event) {
    return {
      child_added: key => (this.children[key] instanceof ArrayData),
      child_changed: key => (this.children[key] instanceof ArrayData),
      child_removed: key => (this.children[key] instanceof ArrayData),
      update: key => !(this.children[key] instanceof ArrayData),
    }[event] || (() => true);
  }

  on(event, emits, handler) {
    Object.keys(this.children).filter(this.filter(event)).forEach((key) => {
      this.children[key].on(event, value => handler(`${key}:${emits}`, value));
    });
  }

  removeListener(event) {
    Object.keys(this.children).filter(this.filter(event)).forEach((key) => {
      this.children[key].removeListener(event);
    });
  }
}

class Room extends ObjectData {
  constructor(value) {
    super(value);

    const characters = new ArrayData(StubData.characters);
    const messages = new ArrayData(StubData.messages);
    const map = new ObjectData(StubData.map);
    const shapes = new ArrayData(StubData.shapes);

    this.children = new RoomChildren({
      characters,
      map,
      messages,
      shapes,
    });
    Object.assign(this, this.children.children);
  }
}

async function timeout(t, value) {
  await new Promise((resolve) => {
    setTimeout(() => resolve(value), t);
  });
}

function roomFilter(room) {
  const {
    password,
    ...others
  } = room;

  return {
    ...others,
    isLocked: Boolean(password),
  };
}

export default class BackendStub extends Backend {
  constructor(config) {
    super(config);

    this.rooms = new ArrayData(StubData.rooms.map(value => new Room(value)));
  }

  findRoom(id: string) {
    return this.rooms.find(room => room.value.id === id);
  }

  async joinLobby(handler) {
    console.log('joinLobby');
    this.rooms.on('child_added', value => handler('rooms:add', roomFilter(value)));
  }

  async leaveLobby() {
    console.log('leaveLobby');
    this.rooms.off('child_added');
  }

  async createRoom(
    title: string,
    dice: string,
    characterAttributes: string[],
    mapWidth: number,
    mapHeight: number,
  ) {
    console.log('createRoom', title, dice, characterAttributes);

    const id = shortid();
    const room = this.rooms.push(new Room({
      id,
      title,
      dice,
      characterAttributes: characterAttributes || [],
    }));

    room.update({
      width: mapWidth,
      height: mapHeight,
    });

    await timeout(50);

    return id;
  }

  async joinRoom(id: string, password: ?string, handler) {
    console.log('joinRoom', id);

    const room = this.findRoom(id);
    if (!room) return { result: JoinResult.NotFound };

    const { title } = room.value;
    if (room.value.password) {
      if (!password) {
        return { result: JoinResult.PasswordRequired, title };
      } else if (room.value.password !== password) {
        return { result: JoinResult.IncorrectPassword, title };
      }
    }

    this.roomId = id;

    room.on('update', value => handler('room:update', roomFilter(value)));
    room.children.on('child_added', 'add', handler);
    room.children.on('child_changed', 'change', handler);
    room.children.on('child_removed', 'remove', handler);
    room.children.on('update', 'update', handler);

    return { result: JoinResult.OK, title };
  }

  async leaveRoom() {
    console.log('leaveRoom', this.roomId || null);

    const room = this.findRoom(this.roomId);
    if (!room) return;

    this.roomId = null;
    room.removeListener('update');
    room.children.removeListener('child_added');
    room.children.removeListener('child_changed');
    room.children.removeListener('child_removed');
  }

  async updateRoom(key, value) {
    console.log('updateRoom', key, value);

    const room = this.findRoom(this.roomId);
    if (!room) return;

    room.update({
      ...room.value,
      [key]: value,
    });
  }

  async clearRoomPassword() {
    this.updateRoomPassword(null);
  }

  async updateRoomPassword(password) {
    console.log('upadteRoomPassword');

    const room = this.findRoom(this.roomId);
    if (!room) return;

    room.update({
      ...room.value,
      password,
    });
  }

  async sendMessage(message) {
    console.log('sendMessage', message);

    const room = this.findRoom(this.roomId);
    if (!room) return;

    room.messages.push(message);
  }

  async createCharacter(character) {
    console.log('createCharacter', character);

    const room = this.findRoom(this.roomId);
    if (!room) return;

    room.characters.push(character);
  }

  async updateCharacter(id, key, value) {
    console.log('updateCharacter', id, key, value);

    const room = this.findRoom(this.roomId);
    if (!room) return;

    const character = room.characters.find(c => c.value.id === id);
    if (!character) return;

    character.update({
      ...character.value,
      [key]: value,
    });
  }

  async updateCharacterIcon(id, file) {
    console.log('updateCharacterIcon', id);

    const room = this.findRoom(this.roomId);
    if (!room) return;

    const character = room.characters.find(c => c.value.id === id);
    if (!character) return;

    this.updateCharacter(id, 'icon', URL.createObjectURL(file));
  }

  async updateCharacterPortrait(id, key, file) {
    console.log('updateCharacterPortrait', id, key);

    const room = this.findRoom(this.roomId);
    if (!room) return;

    const character = room.characters.find(c => c.value.id === id);
    if (!character) return;

    this.updateCharacter(id, 'portrait', {
      ...character.value.portrait,
      [key]: { url: URL.createObjectURL(file) },
    });
  }

  async clearCharacterIcon(id) {
    console.log('clearCharacterIcon', id);

    const room = this.findRoom(this.roomId);
    if (!room) return;

    const character = room.characters.find(c => c.value.id === id);
    if (!character) return;

    this.updateCharacter(id, 'icon', null);
  }

  async clearCharacterPortrait(id, key) {
    console.log('clearCharacterPoitrait', id, key);

    const room = this.findRoom(this.roomId);
    if (!room) return;

    const character = room.characters.find(c => c.value.id === id);
    if (!character) return;

    this.updateCharacter(id, 'portrait', {
      ...character.value.portrait,
      [key]: null,
    });
  }

  async removeCharacter(id) {
    console.log('removeCharacter', id);

    const room = this.findRoom(this.roomId);
    if (!room) return;

    room.characters.remove(id);
  }

  async moveCharacter(id: string, x: number, y: number, z: number) {
    console.log('moveCharacter', id); // , x, y);

    const room = this.findRoom(this.roomId);
    if (!room) return;

    const character = room.characters.find(c => c.value.id === id);
    if (!character) return;

    character.update({
      ...character.value,
      x,
      y,
      z,
    });
  }

  async moveShape(id: string, x: number, y: number, z: number) {
    console.log('moveShape', id); // , x, y);

    const room = this.findRoom(this.roomId);
    if (!room) return;

    const shape = room.shapes.find(s => s.value.id === id);
    if (!shape) return;

    shape.update({
      ...shape.value,
      x,
      y,
      z,
    });
  }

  async createShape(shape) {
    console.log('createShape', shape);

    const room = this.findRoom(this.roomId);
    if (!room) return null;

    const { id } = room.shapes.push(shape);

    await timeout(50);

    return id;
  }

  async updateShape(id, data) {
    console.log('updateShape', id);

    const room = this.findRoom(this.roomId);
    if (!room) return;

    const shape = room.shapes.find(s => s.value.id === id);
    if (!shape) return;

    shape.update({
      ...shape.value,
      ...data,
    });
  }

  async removeShape(id) {
    console.log('removeShape', id);

    const room = this.findRoom(this.roomId);
    if (!room) return;

    room.shapes.remove(id);
  }

  async updateMap(key, value) {
    console.log('updateMap', { [key]: value });

    const room = this.findRoom(this.roomId);
    if (!room) return;

    const map = room.map;
    map.update({
      ...map.value,
      [key]: value,
    });
  }

  async updateMapBackgroundImage(image) {
    console.log('updateMapBackgroundImage');
    this.updateMap('backgroundImage', URL.createObjectURL(image));
  }

  async clearMapBackgroundImage() {
    console.log('clearMapBackgroundImage');
    this.updateMap('backgroundImage', null);
  }
}
