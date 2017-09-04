/* eslint no-console: off */

import EventEmitter from 'eventemitter3';
import shortid from 'shortid';
import StubData from '../constants/StubData';
import Backend from './Backend';

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
  }

  on(event, handler) {
    const result = super.on(event, handler);
    if (event === 'child_added') {
      setTimeout(() => {
        this.value.forEach(item => handler(item.value));
      });
    }
    return result;
  }

  push(value) {
    const id = shortid();
    const item = (value instanceof ObjectData)
      ? value : new ObjectData({ id, ...value });
    // eslint-disable-next-line
    if (value instanceof ObjectData) value.id = id;
    this.value.push(item);
    this.emit('child_added', item.value);
    item.on('update', (newValue) => {
      this.emit('child_changed', newValue);
    });
  }
}

class RoomChildren {
  constructor(children) {
    this.children = children;
  }

  filter(event) {
    return {
      child_added: key => (this.children[key] instanceof ArrayData),
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

export default class BackendStub extends Backend {
  constructor(config) {
    super(config);

    this.rooms = new ArrayData(StubData.rooms.map(value => new Room(value)));
  }

  findRoom(id: string) {
    return this.rooms.value.find(room => room.value.id === id);
  }

  async joinLobby(handler) {
    console.log('joinLobby');
    this.rooms.on('child_added', value => handler('rooms:add', value));
  }

  async leaveLobby() {
    console.log('leaveLobby');
    this.rooms.off('child_added');
  }

  async createRoom(title: string, dice: ?string, characterAttributes: string[]) {
    console.log('createRoom', title, dice, characterAttributes);

    const room = {
      id: shortid(),
      title,
      dice: dice || 'DiceBot',
      characterAttributes: characterAttributes || [],
    };
    this.rooms.push(new Room(room));

    await timeout(50);

    return room.id;
  }

  async joinRoom(id: string, handler) {
    console.log('joinRoom', id);

    const room = this.findRoom(id);
    if (!room) return;
    this.roomId = id;

    room.on('update', value => handler('room:update', value));
    room.children.on('child_added', 'add', handler);
    room.children.on('update', 'update', handler);
  }

  async leaveRoom() {
    console.log('reaveRoom', this.roomId || null);

    const room = this.findRoom(this.roomId);
    if (!room) return;

    this.roomId = null;
    room.removeListener('update');
    room.children.removeListener('child_added');
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

  async sendMessage(message) {
    console.log('sendMessage', message);

    const room = this.findRoom(this.roomId);
    if (!room) return;

    room.messages.push(new ObjectData(message));
  }
}
