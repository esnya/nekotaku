import DAO from './DAO';
import CollectionPath from '../backend/CollectionPath';
import { parseCollectionPath, getRoomId, concatItemId } from './utilities';
import PathElement from '../backend/PathElement';
import Model from '@/models/Model';

export default abstract class RoomChildDAO<Add, Update, Value extends Model>
  extends DAO<void, string, Add, Update, Value> {
  abstract getCollectionName(): string;

  async getCollectionPath(): Promise<CollectionPath> {
    const roomId = getRoomId();
    return parseCollectionPath(`rooms/${roomId}/${this.getCollectionName()}`);
  }

  async getItemPath(key: string): Promise<PathElement[]> {
    const collectionPath = await this.getCollectionPath();
    return concatItemId(collectionPath, key);
  }
}
