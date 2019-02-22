import DAO from './DAO';
import CollectionPath from '../backend/CollectionPath';
import { parseCollectionPath, getRoomId, concatItemId } from './utilities';
import PathElement from '../backend/PathElement';
import Model from '@/models/Model';
import backend from '../backend';

export default abstract class RoomPrivateChildDAO<Add, Update, Value extends Model>
  extends DAO<void, string, Add, Update, Value> {
  abstract getCollectionName(): string;

  async getCollectionPath(): Promise<CollectionPath> {
    const roomId = getRoomId();
    const userId = await backend.v2getUserId();
    return parseCollectionPath(`rooms/${roomId}/members/${userId}/${this.getCollectionName()}`);
  }

  async getItemPath(key: string): Promise<PathElement[]> {
    const collectionPath = await this.getCollectionPath();
    return concatItemId(collectionPath, key);
  }
}
