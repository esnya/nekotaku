import * as ObjectEvent from '@/constants/ObjectEvent';
import Callback from '@/browser/dao/Callback';
import DAO from '@/browser/dao/DAO';
import ObjectDataType from '@/types/data/ObjectDataType';
import Unsubscriber from './Unsubscriber';
import backend from '@/browser/backend';
import router from '../router';
import DataWithId from '@/types/data/DataWithId';

export default abstract class ObjectDAO<Data, UpdateData> implements DAO {
  get roomId(): string {
    const id = router.currentRoute.params.roomId;
    if (!id) throw new Error('Not joined room');
    return id;
  }

  abstract getName(): string;
  abstract reader(data: DataWithId): Data;

  async getPath(): Promise<string> {
    return `${this.getName()}/${this.roomId}`;
  }
  async getSubscribePath(): Promise<string> {
    return this.getPath();
  }

  writer(data: UpdateData): {} {
    return {
      ...data,
      updatedAt: Date.now(),
    };
  }

  async subscribe(
    onValue: Callback<Data>,
  ): Promise<Unsubscriber> {
    const path = await this.getSubscribePath();
    const callback = (data: any) => onValue(this.reader(data));
    const unsubscribe = await backend.subscribe(path, ObjectEvent.Value, callback);
    return unsubscribe;
  }

  async update(data: UpdateData): Promise<void> {
    const path = await this.getPath();
    await backend.update(path, this.writer(data));
  }

  async remove(): Promise<void> {
    const path = await this.getPath();
    await backend.remove(path);
  }

  static reader(data: DataWithId): ObjectDataType {
    return {
      createdAt: 0,
      updatedAt: 0,
      ...data,
    }
  }
}
