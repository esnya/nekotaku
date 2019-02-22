import backend from '@/browser/backend';
import { parseItemPath } from './utilities';
import CollectionPath from '../backend/CollectionPath';
import PathElement from '../backend/PathElement';
import Model from '@/models/Model';
import Unsubscribe from '../backend/Unsubscribe';

export default abstract class DAO<CollectionKey, ItemKey, Add, Update, Value extends Model> {
  abstract getCollectionPath(collectionKey: CollectionKey): Promise<CollectionPath>;
  abstract read(value: Model): Value;

  getItemPath(itemKey: ItemKey): Promise<PathElement[]> {
    throw new Error('Abstract method called');
  }

  async subscribeChild(
    collectionKey: CollectionKey,
    onAdded: (value: Value) => void,
    onChanged: (value: Value) => void,
    onRemoved: (id: string) => void,
  ): Promise<Unsubscribe> {
    const path = await this.getCollectionPath(collectionKey);

    const unsubscribe = await backend.v2subscribeChild(
      path,
      (value: Model) => onAdded(this.read(value)),
      (value: Model) => onChanged(this.read(value)),
      onRemoved,
    );

    return unsubscribe;
  }

  async subscribeValue(key: ItemKey, onValue: (value: Value | null) => void): Promise<Unsubscribe> {
    const path = await this.getItemPath(key);

    const unsubscribe = await backend.v2subscribeValue(
      path,
      (value: Model | null) => onValue(value && this.read(value)),
    );

    return unsubscribe;
  }

  async add(collectionKey: CollectionKey, value: Add): Promise<string> {
    const path = await this.getCollectionPath(collectionKey);
    const id = await backend.v2add(path, {
      ...value,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return id;
  }

  async update(key: ItemKey, value: Update): Promise<void> {
    const path = await this.getItemPath(key);
    await backend.v2update(path, {
      ...value,
      updatedAt: new Date(),
    });
  }

  async remove(key: ItemKey): Promise<void> {
    const path = await this.getItemPath(key);
    await backend.v2remove(path);
  }
}
