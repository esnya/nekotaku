import ListDAOBase from '@/browser/dao/ListDAOBase';
import backend from '../backend';
import { DataType } from './DAO';

export interface ListItemDataType extends DataType {
  id: string;
  createdAt: number;
  updatedAt: number;
}

export default abstract class ListDAO<Data, AddData, UpdateData, ItemKey>
  extends ListDAOBase<Data, AddData, UpdateData, ItemKey> {
  protected roomId: string;

  constructor(roomId: string) {
    super();

    this.roomId = roomId;
  }

  abstract getName(): string;
  abstract keyToString(key: ItemKey): string;

  async getListPath(): Promise<string> {
    return `${this.getName()}/${this.roomId}`;
  }

  async getItemPath(key: ItemKey): Promise<string> {
    return `${this.getName()}/${this.roomId}/${this.keyToString(key)}`;
  }

  static reader(data: DataType): ListItemDataType {
    return {
      createdAt: 0,
      updatedAt: 0,
      ...data,
    }
  }
}
