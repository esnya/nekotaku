import ListDAO from '@/browser/dao/ListDAO';
import Character, { CharacterAddData, CharacterUpdateData } from '@/models/Character';

type ItemKey = string;

export default class CharactersDAO
  extends ListDAO<Character, CharacterAddData, CharacterUpdateData, ItemKey> {
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
      iconSize: 1,
      ...tmp,
      portrait: {
        default: {},
        ...(tmp as any).portrait,
      },
    };
  }
}
