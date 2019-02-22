import ListDAOBase, { ListItemBase } from '@/browser/dao/ListDAOBase';
import Room, { RoomAddData } from '@/models/Room';

export type ItemKey = string;

export default class RoomsDAO extends ListDAOBase<Room, RoomAddData, void, ItemKey> {
  getName(): string {
    return 'rooms';
  }

  async getListPath(): Promise<string> {
    return this.getName();
  }

  async getItemPath(key: ItemKey): Promise<string> {
    return `${this.getName()}/${key}`;
  }

  reader(data: { id: string }): Room {
    return {
      createdAt: 0,
      updatedAt: 0,
      channels: ['メイン'],
      characterAttributes: [],
      dice: 'DiceBot',
      title: '新しい卓',
      ...data,
    };
  }
}
