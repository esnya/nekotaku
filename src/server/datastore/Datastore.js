/* eslint class-methods-use-this: off */

import _ from 'lodash';
import { MongoClient, ObjectId } from 'mongodb';
import { system } from '../logger';

function refineQuery(query: Object): Object {
  const {
    id,
    ...others
  } = query;

  return _.pickBy({
    ...others,
    _id: id && (id.length === 24 && id.match(/^[0-9a-f]+$/) ? ObjectId(id) : id),
  }, value => value !== undefined);
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

  async findOne(collection: string, query: Object) {
    const col = await this.collection(collection);
    const result = await col.findOne(refineQuery(query));
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

  async updateOne(collection: string, query: Object, value: string) {
    const col = await this.collection(collection);
    await col.updateOne(refineQuery(query), { $set: value });
  }

  async remove(collection: string, query: Object) {
    const col = await this.collection(collection);
    await col.deleteMany(refineQuery(query));
  }
}
