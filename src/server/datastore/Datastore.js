/* eslint class-methods-use-this: off */

import { MongoClient, ObjectId } from 'mongodb';
import { system } from '../logger';

function getQuery(id: ?string, query: Object = {}) {
  return id ? { _id: ObjectId(id), ...query } : query;
}

export default class Datastore {
  constructor(config) {
    const {
      type,
      url,
      dbname,
      ...options
    } = config;
    this.type = type;
    this.connect(url, dbname, options);
  }

  async getDB() {
    return this.db;
  }

  async connect(url: string, dbname: string, options: ?Object) {
    try {
      system.info('Datastore connecting', url);
      const client = await MongoClient.connect(url, options);
      this.db = client.db(dbname);
      system.info('Datastore connected');
    } catch (e) {
      system.fatal(e);
    }
  }

  async close() {
    try {
      system.info('Datastore connection closing');
      const db = await this.getDB();
      await db.close();
      system.info('Datastore connection closed');
    } catch (e) {
      system.fatal(e);
    }
  }

  async collection(name: string) {
    const db = await this.getDB();
    return db.collection(name);
  }

  async findOne(collection: string, id: ?string, query: Object = {}) {
    const col = await this.collection(collection);
    const result = await col.findOne(getQuery(id, query));
    return result;
  }

  async findArray(name: string, query: Object) {
    const collection = await this.collection(name);
    const result = await collection.find(query).toArray();
    return result;
  }

  async insert(collection: string, value: string) {
    const col = await this.collection(collection);
    const { insertedId } = await col.insertOne(value);
    return insertedId.toString();
  }

  async updateOne(collection: string, id: ?string, query: Object, value: string) {
    const col = await this.collection(collection);
    await col.updateOne(getQuery(id, query), { $set: value });
  }

  async remove(collection: string, id: ?string, query: Object) {
    const col = await this.collection(collection);
    await col.remove(getQuery(id, query));
  }
}
