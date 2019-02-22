import * as ListEvent from '@/constants/ListEvent';
import Callback from '@/browser/dao/Callback';
import DAO from '@/browser/dao/DAO';
import Unsubscriber from './Unsubscriber';
import backend from '../backend';
import DataWithId from '@/types/data/DataWithId';

export interface ListItemBase {
  id: string;
}

export default abstract class ListDAOBase<
  Data extends ListItemBase,
  AddData,
  UpdateData,
  ItemKey,
> implements DAO {
  abstract getName(): string;
  abstract getListPath(): Promise<string>;
  abstract getItemPath(key: ItemKey): Promise<string>;
  abstract reader(data: DataWithId): Data;

  initializer(data: AddData): {} {
    return {
      ...data,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  }

  writer(data: UpdateData): {} {
    return {
      ...data,
      updatedAt: Date.now(),
    };
  }

  async subscribe(
    onAdded: Callback<Data>,
    onChanged: Callback<Data>,
    onRemoved: Callback<Data>,
  ): Promise<Unsubscriber> {
    const path = await this.getListPath();
    const unsubscribers = await Promise.all([
      backend.subscribe(path, ListEvent.ChildAdded, (data: any) => onAdded(this.reader(data))),
      backend.subscribe(path, ListEvent.ChildChanged, (data: any) => onChanged(this.reader(data))),
      backend.subscribe(path, ListEvent.ChildRemoved, (data: any) => onRemoved(this.reader(data))),
    ]);
    return async () => {
      await Promise.all(unsubscribers.map(u => u()));
    };
  }

  async addItem(data: AddData): Promise<string> {
    const path = await this.getListPath();
    const id = await backend.push(path, this.initializer(data));
    return id;
  }

  async updateItem(itemKey: ItemKey, data: UpdateData): Promise<void> {
    const path = await this.getItemPath(itemKey);
    await backend.update(path, this.writer(data));
  }

  async removeItem(itemKey: ItemKey): Promise<void> {
    const path = await this.getItemPath(itemKey);
    await backend.remove(path);
  }

  async removeAll(): Promise<void> {
    const path = await this.getListPath();
    await backend.remove(path);
  }
}
