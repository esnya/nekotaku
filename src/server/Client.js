

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
  constructor(config) {
    const {
      datastore,
      file,
      logger,
    } = config;

    const prsedFileSize = SI.parse(file.maxSize);
    this.maxFileSize = prsedFileSize.number;
    this.filePath = file.path;

    this.datastore = datastore;
    this.logger = logger;
  }

  connection(io, socket) {
    this.io = io;
    this.socket = socket;
    this.subscribeCounter = {};

    this.logger.debug('Connection', socket.id);

    _(SocketEvents).forEach((event, key) => {
      socket.on(`request:${event}`, async (requestId, ...args) => {
        try {
          this.logger.trace('received', event, ...args);

          const methodKey = `on${key}`;
          if (!this[methodKey]) this.logger.fatal(`Client.${methodKey} is not defined`);

          const result = await this[methodKey](...args);
          this.socket.emit(`response:${event}:${requestId}`, null, result);
        } catch (e) {
          this.logger.error(e, requestId, args);
          this.socket.emit(`response:${event}:${requestId}`, e, null);
        }
      });
    });
  }

  /* Utilities */
  async get(path: string): Promise<Object> {
    const { collection, query, subPath } = parsePath(path);
    const data = await this.datastore.findOne(collection, query);

    if (subPath) return _.get(data, subPath.replace(/\//g, '.'));
    return data;
  }

  async list(path: string): Promise<Object[]> {
    const { collection, query } = parsePath(path);
    const data = await this.datastore.findArray(collection, query);
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
    const oldData = await this.datastore.findOne(collection, query);

    const newData = subPath ? _.set(oldData || {
      roomId: collection !== 'room' ? roomId : undefined,
    }, subPath.replace(/\//g, '.'), data) : {
      ...oldData,
      ...data,
      roomId: collection !== 'room' ? roomId : undefined,
    };

    if (!oldData) await this.datastore.insert(collection, newData);
    else await this.datastore.updateOne(collection, query, newData);

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
      await this.datastore.remove(collection, query);
      if (collection !== 'passwords') {
        this.io.emit('event', `${collection}/${roomId}`, ListEvent.ChildRemoved, { id: childId });
      }
    }
  }

  async push(path: string, data: Object): Promise<string> {
    const { collection, roomId } = parsePath(path);
    const id = await this.datastore.insert(collection, {
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
      const room = filter(await this.get(`rooms/${roomId}`));

      if (room && room.id === roomId) {
        this.logger.debug('AutohrizationFailed', 'Unauthorized', path, mode, this.uid);
        throw new UnauthorizedError();
      }
      this.logger.debug('AutohrizationFailed', 'NotFound', path, mode, this.uid);
      throw new NotFoundError();
    }
  }

  /* Event Listeners */
  async onSetUID(uid: string): Promise<void> {
    this.logger.debug('SetUID', uid);
    this.uid = uid;
  }

  async onSubscribe(
    path: string,
    event: string,
  ): Promise<Object | Object[]> {
    this.logger.debug('Subscribe', path, event);
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
    this.logger.debug('Unsubscribe', path, event);
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
    this.logger.debug('Push', path, data);
    await this.authorize(`${path}/childId`, 'write');
    const id = await this.push(path, data);
    return id;
  }

  async onUpdate(
    path: string,
    data: Object,
  ): Promise<void> {
    this.logger.debug('Update', path, data);
    await this.authorize(path, 'write');
    await this.update(path, data);
  }

  async onRemove(
    path: string,
  ): Promise<void> {
    this.logger.debug('Remove', path);
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
    this.logger.debug('PushFile', roomId, path, type, name, data);

    await this.authorize(`files/${roomId}`, 'write');

    if (data.length > this.maxFileSize) throw new Error('Maximum file size exceeded');

    const pathHash = getHash(path);
    await this.onRemoveFile(roomId, path);

    const id = await this.datastore.insert('files', {
      roomId,
      pathHash,
      type,
      name,
    });
    const filePath = joinPath(this.filePath, id);
    await fs.writeFile(filePath, data);

    return `/files/${id}`;
  }

  async onRemoveFile(
    roomId: string,
    path: string,
  ): Promise<void> {
    this.logger.debug('RemoveFile', roomId, path);

    await this.authorize(`files/${roomId}`, 'write');

    const pathHash = getHash(path);
    const files = await this.datastore.findArray('files', { roomId, pathHash });

    await Promise.all(files.map(async (file) => {
      // eslint-disable-next-line no-underscore-dangle
      const id = file._id.toString();
      const filePath = joinPath(this.filePath, id);
      await fs.unlink(filePath);
    }));

    await this.datastore.remove('files', { roomId, pathHash });
  }

  async onRemoveFiles(
    roomId: string,
  ): Promise<void> {
    this.logger.debug('RemoveFiles', roomId);

    await this.authorize(`files/${roomId}`, 'write');

    const files = await this.datastore.findArray('files', { roomId });

    // eslint-disable-next-line no-underscore-dangle
    await Promise.all(files.map(file => fs.unlink(joinPath(this.filePath, file._id.toString()))));

    await this.datastore.remove('files', { roomId });
  }
}
