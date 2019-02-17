import pickBy from 'lodash/pickBy';
import { MongoClient, ObjectId, Db } from 'mongodb';

interface Query {
  [key: string]: any;
}

function refineQuery(query: Query): Query {
  const {
    id,
    ...others
  } = query;

  return pickBy({
    ...others,
    _id: id && (id.length === 24 && id.match(/^[0-9a-f]+$/) ? new ObjectId(id) : id),
  }, value => value !== undefined);
}

export interface DatastoreOptions {
  datastore: {
    type: string;
    url: string;
    dbname: string;
  };
  logger: Logger;
}

interface Logger {
  fatal: (...args: any[]) => void,
  info: (...args: any[]) => void,
}

export default class Datastore {
  private logger: Logger;
  private db: Db | null = null;

  type: string;

  constructor(config: DatastoreOptions) {
    const {
      type,
      url,
      dbname,
      ...options
    } = config.datastore;
    this.logger = config.logger;
    this.type = type;
    this.connect(url, dbname, options);
  }

  async getDB(): Promise<Db> {
    if (!this.db) throw new Error('Database connection is not initialized');
    return this.db;
  }

  async connect(url: string, dbname: string, options?: {}) {
    try {
      this.logger.info('Datastore connecting', url);
      const client = await MongoClient.connect(url, options);
      this.db = client.db(dbname);
      this.logger.info('Datastore connected');
    } catch (e) {
      this.logger.fatal(e);
    }
  }

  async close() {
    try {
      this.logger.info('Datastore connection closing');
      const db = await this.getDB();
      await (db as any).close();
      this.logger.info('Datastore connection closed');
    } catch (e) {
      this.logger.fatal(e);
    }
  }

  async collection(name: string) {
    const db = await this.getDB();
    return db.collection(name);
  }

  async findOne(collection: string, query: Query) {
    const col = await this.collection(collection);
    const result = await col.findOne(refineQuery(query));
    return result;
  }

  async findArray(name: string, query: Object) {
    const collection = await this.collection(name);
    const result = await collection.find(refineQuery(query)).toArray();
    return result;
  }

  async insert(collection: string, value: Object) {
    const col = await this.collection(collection);
    const { insertedId } = await col.insertOne(value);
    return insertedId.toString();
  }

  async updateOne(collection: string, query: Object, value: Object) {
    const col = await this.collection(collection);
    await col.updateOne(refineQuery(query), { $set: value });
  }

  async remove(collection: string, query: Object) {
    const col = await this.collection(collection);
    await col.deleteMany(refineQuery(query));
  }
}
