import DAO from './DAO';
import CollectionPath from '../backend/CollectionPath';
import { parseCollectionPath, getRoomId, concatItemId } from './utilities';
import PathElement from '../backend/PathElement';
import Model from '@/models/Model';

export default abstract class UserDataDAO<Update, Value extends Model>
  extends DAO<void, void, void, Update, Value> {
  abstract getCollectionName(): string;

  async getCollectionPath(): Promise<CollectionPath> {
    return parseCollectionPath(`rooms/${getRoomId()}/${this.getCollectionName()}`);
  }

  async getItemPath(): Promise<PathElement[]> {
    const collectionPath = await this.getCollectionPath();
    const userId = await this.backend.v2getUserId();

    return concatItemId(collectionPath, userId)
  }

  async add(value: void): Promise<string> {
    throw new Error('Cannot add UserData');
  }
}
