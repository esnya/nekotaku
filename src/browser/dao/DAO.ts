import CollectionPath from '../backend/CollectionPath';
import PathElement from '../backend/PathElement';
import Model from '@/models/Model';
import Unsubscribe from '../backend/Unsubscribe';
import Backend from '../backend/Backend';

export default abstract class DAO<CollectionKey, ItemKey, Add, Update, Value extends Model> {
  protected backend: Backend;

  constructor(backend: Backend) {
    this.backend = backend;
  }

  abstract getCollectionPath(collectionKey?: CollectionKey): Promise<CollectionPath>;
  abstract read(value: Model): Value;

  getItemPath(itemKey?: ItemKey): Promise<PathElement[]> {
    throw new Error('Abstract method called');
  }

  async subscribeChild(
    onAdded: (value: Value) => void,
    onChanged: (value: Value) => void,
    onRemoved: (id: string) => void,
    collectionKey?: CollectionKey,
  ): Promise<Unsubscribe> {
    const path = await this.getCollectionPath(collectionKey);

    const unsubscribe = await this.backend.v2subscribeChild(
      path,
      (value: Model) => onAdded(this.read(value)),
      (value: Model) => onChanged(this.read(value)),
      onRemoved,
    );

    return unsubscribe;
  }

  async subscribeValue(onValue: (value: Value | null) => void, key: ItemKey): Promise<Unsubscribe> {
    const path = await this.getItemPath(key);

    const unsubscribe = await this.backend.v2subscribeValue(
      path,
      (value: Model | null) => onValue(value && this.read(value)),
    );

    return unsubscribe;
  }

  async add(value: Add, collectionKey?: CollectionKey): Promise<string> {
    const path = await this.getCollectionPath(collectionKey);
    const id = await this.backend.v2add(path, {
      ...value,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return id;
  }

  async update(value: Update, key?: ItemKey): Promise<void> {
    const path = await this.getItemPath(key);
    await this.backend.v2update(path, {
      ...value,
      updatedAt: new Date(),
    });
  }

  async remove(key?: ItemKey): Promise<void> {
    const path = await this.getItemPath(key);
    await this.backend.v2remove(path);
  }
}
