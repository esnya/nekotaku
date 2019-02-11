import ObjectDAO, { ObjectDataType } from '@/browser/dao/ObjectDAO';
import { DataType } from './DAO';

export interface Room extends ObjectDataType {
}

export interface UpdateData {
}

export class RoomDAO extends ObjectDAO<Room, UpdateData> {
  getName(): string {
    return 'rooms';
  }

  reader(data: DataType): Room {
    return ObjectDAO.reader(data);
  }
}
