/* eslint class-methods-use-this: off */

import fs from 'mz/fs';
import _ from 'lodash';
import { join as joinPath } from 'path';
import SI from 'si-tools';
import crypto from 'crypto';
import * as SocketEvents from '../constants/SocketEvents';
import * as ListEvent from '../constants/ListEvent';
import * as ObjectEvent from '../constants/ObjectEvent';
import config from './config';
import datastore from './datastore';
import { system } from './logger';

function filter(value: ?Object) {
  if (!value) return value;
  const {
    _id,
    password,
    ...others
  } = value;

  return _.pickBy({
    ...others,
    id: _id && _id.toString(),
    isLocked: password ? true : undefined,
  }, v => v !== undefined);
}

function getHash(data): string {
  const sha1 = crypto.createHash('sha1');
  sha1.update(data);
  return sha1.digest('hex');
}

const ParsedFileSize = SI.parse(config.file.maxSize);
const MaxFileSize = ParsedFileSize.number;
const FilePath = config.file.path;

function getEventPath(path: string, event: string) {
  return `${path}:${event}`;
}

function parsePath(path: string): Object {
  const [collection, roomId, childId, ...subPathArray] = path.split(/\//g);
  const subPath = subPathArray.join('/');

  switch (collection) {
    case 'rooms':
      return {
        collection,
        roomId,
        query: { id: roomId },
      };
    case 'members':
    case 'passwords':
      return {
        collection,
        roomId,
        query: { roomId },
        childId: undefined,
        subPath: [childId, ...subPathArray].join('/'),
      };
    default:
      return {
        collection,
        roomId,
        query: {
          id: childId,
          roomId,
        },
        childId,
        subPath,
      };
  }
}

export default class Client {
  connection(io, socket) {
    this.io = io;
    this.socket = socket;
    this.subscribeCounter = {};

    system.info(`New socket connection ${socket.id}`);

    _(SocketEvents).forEach((event, key) => {
      socket.on(`request:${event}`, async (requestId, ...args) => {
        try {
          system.trace('received', event, ...args);

          const methodKey = `on${key}`;
          if (!this[methodKey]) system.fatal(`Client.${methodKey} is not defined`);

          const result = await this[methodKey](...args);
          this.socket.emit(`response:${event}:${requestId}`, null, result);
        } catch (e) {
          system.error(e, requestId, args);
          this.socket.emit(`response:${event}:${requestId}`, e, null);
        }
      });
    });
  }

  /* Utilities */
  async get(path: string): Promise<Object> {
    const { collection, query } = parsePath(path);
    const data = await datastore.findOne(collection, query);
    return data;
  }

  async list(path: string): Promise<Object[]> {
    const { collection, query } = parsePath(path);
    const data = await datastore.findArray(collection, query);
    return data;
  }

  async update(path: string, data: any): Promise<void> {
    const {
      collection,
      query,
      roomId,
      childId,
      subPath,
    } = parsePath(path);
    const oldData = await datastore.findOne(collection, query);

    const newData = subPath ? _.set(oldData || {}, subPath.replace(/\//g, '.'), data) : {
      ...oldData,
      ...data,
      roomId: collection !== 'room' ? roomId : undefined,
    };

    if (!oldData) await datastore.insert(collection, newData);
    else await datastore.updateOne(collection, query, newData);

    const collectionData = await this.get(`${collection}/${roomId}`);
    this.io.emit('event', `${collection}/${roomId}`, ObjectEvent.Value, filter(collectionData));
    if (childId) {
      const itemData = await this.get(`${collection}/${roomId}/${childId}`);
      this.io.emit('event', `${collection}/${roomId}/${childId}`, ObjectEvent.Value, filter(itemData));
      this.io.emit('event', `${collection}/${roomId}`, ListEvent.ChildChanged, filter(itemData));
    }
  }

  async remove(path: string): Promise<void> {
    const {
      collection,
      query,
      roomId,
      childId,
      subPath,
    } = parsePath(path);

    if (subPath) {
      await this.update(path, undefined);
    } else {
      await datastore.remove(collection, query);
      this.io.emit('event', `${collection}/${roomId}`, ListEvent.ChildRemoved, { id: childId });
    }
  }

  async push(path: string, data: Object): Promise<string> {
    const { collection, roomId } = parsePath(path);
    const id = await datastore.insert(collection, {
      ...data,
      roomId,
    });

    const newData = await this.get(`${path}/${id}`);
    this.io.emit('event', path, ListEvent.ChildAdded, filter(newData));
    this.io.emit('event', `${path}/${id}`, ObjectEvent.Value, filter(newData));

    return id;
  }

  /* Event Listeners */
  async onSetUID(uid: string) {
    this.uid = uid;
  }

  async onSubscribe(
    path: string,
    event: string,
  ): Promise<Object | Object[]> {
    const eventPath = getEventPath(path, event);

    if (!this.subscribeCounter[eventPath]) {
      this.subscribeCounter[eventPath] = 1;
      this.socket.join(eventPath);
    } else this.subscribeCounter[eventPath] += 1;

    system.info('Subscribed', path, event);

    switch (event) {
      case ObjectEvent.Value:
      {
        const value = await this.get(path);
        return filter(value);
      }
      case ListEvent.ChildAdded:
      {
        const children = await this.list(path);
        return children.map(filter);
      }
      default:
        return null;
    }
  }

  async onUnsubscribe(
    path: string,
    event: string,
  ): Promise<() => Promise<void>> {
    const eventPath = getEventPath(path, event);
    this.subscribeCounter[eventPath] -= 1;

    if (!this.subscribeCounter[eventPath]) {
      this.socket.leave(eventPath);
    }
  }

  async onPush(
    path: string,
    data: string,
  ): Promise<string> {
    const id = await this.push(path, data);
    return id;
  }

  async onUpdate(
    path: string,
    data: Object,
  ): Promise<void> {
    await this.update(path, data);
  }

  async onRemove(
    path: string,
  ): Promise<void> {
    await this.remove(path);
  }

  async onPushFile(
    path: string,
    file: File,
  ): Promise<string> {
    if (file.length > MaxFileSize) throw new Error('Maximum file size exceeded');

    const [roomId] = path.split(/\//g);
    const hash = getHash(path);
    const filePath = joinPath(FilePath, hash);

    await fs.writeFile(filePath, file);
    await this.remove('files', { roomId, hash });
    await this.insert('files', { roomId, hash, file });

    return `/files/${hash}`;
  }

  async onRemoveFile(
    path: string,
  ): Promise<void> {
    const [roomId] = path.split(/\//g);
    const hash = getHash(path);
    const filePath = joinPath(FilePath, hash);
    await fs.unlink(filePath);
    await this.remove('files', { roomId, hash });
  }

  async onRemoveFiles(
    path: string,
  ): Promise<void> {
    const [roomId] = path.split(/\//g);
    const data = await datastore.findArray('files', { roomId });

    await Promise.all(
      data.map(item => fs.unlink(joinPath(FilePath, item.hash))),
    );

    await datastore.remove('files', null, { roomId });
  }
}
