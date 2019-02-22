import ObjectDAO from '@/browser/dao/ObjectDAO';
import Room, { RoomUpdateData } from '@/types/data/Room';
import DataWithId from '@/types/data/DataWithId';

export default class RoomDAO extends ObjectDAO<Room, RoomUpdateData> {
  getName(): string {
    return 'rooms';
  }

  reader(data: DataWithId): Room {
    return {
      ...ObjectDAO.reader(data),
      channels: [],
      characterAttributes: [],
      dice: 'DiceBot',
      title: '新しい卓',
      ...data,
    };
  }
}
