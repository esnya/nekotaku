import Character, { CharacterAdd, CharacterUpdate } from '@/models/Character';
import Model from '@/models/Model';
import RoomChildDAO from './RoomChildDAO';

export class CharacterDAO extends RoomChildDAO<CharacterAdd, CharacterUpdate, Character> {
  getCollectionName(): string {
    return 'characters';
  }

  read(value: Model): Character {
    return {
      attributes: [],
      iconSize: 1,
      initiative: 0,
      name: 'ななしさん',
      x: 0,
      y: 0,
      ...value,
    };
  }
}
export default new CharacterDAO();
