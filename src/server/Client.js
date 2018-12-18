/* eslint class-methods-use-this: off */

import fs from 'mz/fs';
import _ from 'lodash';
import { join as joinPath } from 'path';
import SI from 'si-tools';
import crypto from 'crypto';
import * as ErrorCode from '../constants/ErrorCode';
import * as SocketEvents from '../constants/SocketEvents';
import * as ListEvent from '../constants/ListEvent';
import * as ObjectEvent from '../constants/ObjectEvent';
import checkRule from '../utilities/rule';
import config from './config';
import datastore from './datastore';
import { client } from './logger';

class NotFoundError extends Error {
  constructor(...args) {
    super(...args);
    this.code = ErrorCode.NotFound;
  }
}

class UnauthorizedError extends Error {
  constructor(...args) {
    super(...args);
    this.code = ErrorCode.Unauthorized;
  }
}

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
        subPath: [childId, ...subPathArray].join('/'),
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

    client.info('Connection', socket.id);

    _(SocketEvents).forEach((event, key) => {
      socket.on(`request:${event}`, async (requestId, ...args) => {
        try {
          client.trace('received', event, ...args);

          const methodKey = `on${key}`;
          if (!this[methodKey]) client.fatal(`Client.${methodKey} is not defined`);

          const result = await this[methodKey](...args);
          this.socket.emit(`response:${event}:${requestId}`, null, result);
        } catch (e) {
          client.error(e, requestId, args);
          this.socket.emit(`response:${event}:${requestId}`, e, null);
        }
      });
    });
  }

  /* Utilities */
  async get(path: string): Promise<Object> {
    const { collection, query, subPath } = parsePath(path);
    const data = await datastore.findOne(collection, query);

    if (subPath) return _.get(data, subPath.replace(/\//g, '.'));
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

    const newData = subPath ? _.set(oldData || {
      roomId: collection !== 'room' ? roomId : undefined,
    }, subPath.replace(/\//g, '.'), data) : {
      ...oldData,
      ...data,
      roomId: collection !== 'room' ? roomId : undefined,
    };

    if (!oldData) await datastore.insert(collection, newData);
    else await datastore.updateOne(collection, query, newData);

    if (collection !== 'passwords') {
      const collectionData = await this.get(`${collection}/${roomId}`);
      this.io.emit('event', `${collection}/${roomId}`, ObjectEvent.Value, filter(collectionData));
      if (childId) {
        const itemData = await this.get(`${collection}/${roomId}/${childId}`);
        this.io.emit('event', `${collection}/${roomId}/${childId}`, ObjectEvent.Value, filter(itemData));
        this.io.emit('event', `${collection}/${roomId}`, ListEvent.ChildChanged, filter(itemData));
      }
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
      if (collection !== 'passwords') {
        this.io.emit('event', `${collection}/${roomId}`, ListEvent.ChildRemoved, { id: childId });
      }
    }
  }

  async push(path: string, data: Object): Promise<string> {
    const { collection, roomId } = parsePath(path);
    const id = await datastore.insert(collection, {
      ...data,
      roomId,
    });

    if (collection !== 'passwords') {
      const newData = await this.get(`${path}/${id}`);
      this.io.emit('event', path, ListEvent.ChildAdded, filter(newData));
      this.io.emit('event', `${path}/${id}`, ObjectEvent.Value, filter(newData));
    }

    return id;
  }

  async authorize(path: string, mode: string) {
    const authorized = await checkRule(path, mode, this.uid, p => this.get(p));
    if (!authorized) {
      const roomId = path.split(/\//g)[1];
      const room = await this.get(`rooms/${roomId}`);

      if (room && room.id === roomId) {
        client.info('Unauthorized', path, mode, this.uid);
        throw new UnauthorizedError();
      }
      client.info('NotFound', path, mode, this.uid);
      throw new NotFoundError();
    }
  }

  /* Event Listeners */
  async onSetUID(uid: string) {
    this.uid = uid;
  }

  async onSubscribe(
    path: string,
    event: string,
  ): Promise<Object | Object[]> {
    client.info('Subscribe', path, event);
    await this.authorize(path, 'read');
    const eventPath = getEventPath(path, event);

    if (!this.subscribeCounter[eventPath]) {
      this.subscribeCounter[eventPath] = 1;
      this.socket.join(eventPath);
    } else this.subscribeCounter[eventPath] += 1;


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
    client.info('Unsubscribe', path, event);
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
    client.info('Push', path, data);
    await this.authorize(path, 'write');
    const id = await this.push(path, data);
    return id;
  }

  async onUpdate(
    path: string,
    data: Object,
  ): Promise<void> {
    client.info('Update', path, data);
    await this.authorize(path, 'write');
    await this.update(path, data);
  }

  async onRemove(
    path: string,
  ): Promise<void> {
    client.info('Remove', path);
    await this.authorize(path, 'write');
    await this.remove(path);
  }

  async onPushFile(
    roomId: string,
    path: string,
    type: string,
    name: string,
    data: Buffer,
  ): Promise<string> {
    client.info('PushFile', roomId, path, type, name, data);

    await this.authorize(`files/${roomId}`, 'write');

    if (data.length > MaxFileSize) throw new Error('Maximum file size exceeded');

    const pathHash = getHash(path);
    await this.onRemoveFile(roomId, path);

    const id = await datastore.insert('files', {
      roomId,
      pathHash,
      type,
      name,
    });
    const filePath = joinPath(FilePath, id);
    await fs.writeFile(filePath, data);

    return `/files/${id}`;
  }

  async onRemoveFile(
    roomId: string,
    path: string,
  ): Promise<void> {
    client.info('RemoveFile', roomId, path);

    await this.authorize(`files/${roomId}`, 'write');

    const pathHash = getHash(path);
    const files = await datastore.findArray('files', { roomId, pathHash });

    await Promise.all(files.map(async (file) => {
      // eslint-disable-next-line no-underscore-dangle
      const id = file._id.toString();
      const filePath = joinPath(FilePath, id);
      await fs.unlink(filePath);
    }));

    await datastore.remove('files', { roomId, pathHash });
  }

  async onRemoveFiles(
    roomId: string,
  ): Promise<void> {
    client.info('RemoveFiles', roomId);

    await this.authorize(`files/${roomId}`, 'write');

    const files = await datastore.findArray('files', { roomId });

    // eslint-disable-next-line no-underscore-dangle
    await Promise.all(files.map(file => fs.unlink(joinPath(FilePath, file._id.toString()))));

    await datastore.remove('files', { roomId });
  }
}
