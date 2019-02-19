import { DataType, DataWithId } from './DAO';
import ListDAOBase, { ListItemBase } from '@/browser/dao/ListDAOBase';
import router from '../router';

export interface ListItemDataType extends DataType {}

export default abstract class ListDAO<Data extends ListItemBase, AddData, UpdateData, ItemKey>
  extends ListDAOBase<Data, AddData, UpdateData, ItemKey> {
  get roomId(): string {
    const id = router.currentRoute.params.roomId;
    if (!id) throw new Error('Not joined room');
    return id;
  }

  abstract getName(): string;
  abstract keyToString(key: ItemKey): string;

  async getListPath(): Promise<string> {
    return `${this.getName()}/${this.roomId}`;
  }

  async getItemPath(key: ItemKey): Promise<string> {
    return `${this.getName()}/${this.roomId}/${this.keyToString(key)}`;
  }

  static reader(data: DataWithId): ListItemDataType {
    return {
      createdAt: 0,
      updatedAt: 0,
      ...data,
    }
  }
}
