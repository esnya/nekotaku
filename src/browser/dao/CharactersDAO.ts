import ListDAO, { ListItemDataType } from '@/browser/dao/ListDAO';

export interface CharacterPortrait {
  url?: string | null;
}

export interface Character extends ListItemDataType {
  attributes: string[];
  icon?: string | null;
  initiative: number;
  name: string;
  portrait: { [fase: string]: CharacterPortrait };
  x: number;
  y: number;
}

interface AddData {
  attributes: [];
  name: string;
  initiative: number;
  icon?: string | null;
  portrait?: { [fase: string]: CharacterPortrait };
  x?: number;
  y?: number;
}

interface UpdateData {
  name?: string;
}

type ItemKey = string;

export default class CharactersDAO extends ListDAO<Character, AddData, UpdateData, ItemKey> {
  getName(): string {
    return 'characters';
  }

  keyToString(key: ItemKey): string {
    return key;
  }

  reader(data: { id: string }): Character {
    const tmp = ListDAO.reader(data);
    return {
      attributes: [],
      initiative: 0,
      name: 'ななしさん',
      x: 0,
      y: 0,
      ...tmp,
      portrait: {
        default: {},
        ...(tmp as any).portrait,
      },
    };
  }
}
