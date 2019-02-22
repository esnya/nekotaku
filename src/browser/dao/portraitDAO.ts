import Portrait, { PortraitAdd, PortraitUpdate } from '@/models/Portrait';
import DAO from './DAO';
import { parseCollectionPath, getRoomId, concatItemId } from './utilities';
import CollectionPath from '../backend/CollectionPath';
import PathElement from '../backend/PathElement';
import Model from '@/models/Model';
import backend from '../backend';

export interface ItemKey {
  characterId: string;
  portraitId: string;
}

export class PortraitDAO extends DAO<string, ItemKey, PortraitAdd, PortraitUpdate, Portrait> {
  async getCollectionPath(characterId?: string): Promise<CollectionPath> {
    if (!characterId) throw new Error('characterId is required');
    return parseCollectionPath(`rooms/${getRoomId()}/characters/${characterId}/portraits`);
  }

  async getItemPath(key?: ItemKey): Promise<PathElement[]> {
    if (!key) throw new Error('key is required');
    const collectionPath = await this.getCollectionPath(key.characterId);
    return concatItemId(collectionPath, key.portraitId);
  }

  read(value: Model): Portrait {
    return {
      name: '立ち絵',
      tags: [],
      ...value,
    };
  }
}
export default new PortraitDAO(backend);
