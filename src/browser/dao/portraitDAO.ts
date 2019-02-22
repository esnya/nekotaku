import Portrait, { PortraitAdd, PortraitUpdate } from '@/models/Portrait';
import DAO from './DAO';
import { parseCollectionPath, getRoomId, concatItemId } from './utilities';
import CollectionPath from '../backend/CollectionPath';
import PathElement from '../backend/PathElement';
import Model from '@/models/Model';

export interface ItemKey {
  characterId: string;
  portraitId: string;
}

export class PortraitDAO extends DAO<string, ItemKey, PortraitAdd, PortraitUpdate, Portrait> {
  async getCollectionPath(characterId: string): Promise<CollectionPath> {
    return parseCollectionPath(`rooms/${getRoomId()}/characters/${characterId}/portraits`);
  }

  async getItemPath({ characterId, portraitId }: ItemKey): Promise<PathElement[]> {
    const collectionPath = await this.getCollectionPath(characterId);
    return concatItemId(collectionPath, portraitId);
  }

  read(value: Model): Portrait {
    return {
      name: '立ち絵',
      tags: [],
      ...value,
    };
  }
}
