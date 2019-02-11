import Callback from '@/browser/dao/Callback';
import DAO, { DataType } from '@/browser/dao/DAO';
import backend from '@/browser/backend';
import * as ObjectEvent from '@/constants/ObjectEvent';

export interface ObjectDataType extends DataType {
  id: string;
  createdAt: number;
  updatedAt: number;
}

export default abstract class ObjectDAO<Data, UpdateData> implements DAO {
  protected roomId: string;

  constructor(roomId: string) {
    this.roomId = roomId;
  }

  abstract getName(): string;
  abstract reader(data: DataType): Data;

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
  ): Promise<() => Promise<void>> {
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

  static reader(data: DataType): ObjectDataType {
    return {
      createdAt: 0,
      updatedAt: 0,
      ...data,
    }
  }
}
