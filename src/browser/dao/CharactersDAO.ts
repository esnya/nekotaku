import ListDAO, { ListItemDataType } from '@/browser/dao/ListDAO';

interface CharacterPortrait {
  image?: string | null;
}

interface Character extends ListItemDataType {
  attributes: string[];
  icon?: string | null;
  initiative: number;
  name: string;
  portrait: { [fase: string]: CharacterPortrait };
  x: number;
  y: number;
  z: number;
}

interface AddData {
}

interface UpdateData {
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
      z: 0,
      ...tmp,
      portrait: {
        default: {},
        ...(tmp as any).portrait,
      },
    };
  }
}
