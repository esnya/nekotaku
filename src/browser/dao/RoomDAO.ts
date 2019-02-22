import DAO from '@/browser/dao/DAO';
import Room, { RoomAdd, RoomUpdate } from '@/models/Room';
import CollectionPath from '../backend/CollectionPath';
import { parseCollectionPath, concatItemId, getRoomId } from './utilities';
import Model from '@/models/Model';
import PathElement from '../backend/PathElement';
import backend from '../backend';

export const collectionPath = parseCollectionPath('rooms');

export class RoomDAO extends DAO<void, void, RoomAdd, RoomUpdate, Room> {
  async getCollectionPath(): Promise<CollectionPath> {
    return collectionPath;
  }

  async getItemPath(): Promise<PathElement[]> {
    return concatItemId(collectionPath, getRoomId());
  }

  read(value: Model): Room {
    return {
      channels: ['メイン'],
      characterAttributes: [],
      dice: 'DiceBot',
      title: '卓',
      mapGrid: true,
      mapHeight: 10,
      mapWidth: 10,
      ...value,
    };
  }
}
export default new RoomDAO(backend);
