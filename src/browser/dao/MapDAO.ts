import ObjectDAO, { ObjectDataType } from '@/browser/dao/ObjectDAO';
import { DataType } from './DAO';

export interface Map extends ObjectDataType {
  grid: boolean;
  width: number;
  height: number;
  backgroundImage?: string | null;
}

export interface UpdateData {
}

export class MapDAO extends ObjectDAO<Map, UpdateData> {
  getName(): string {
    return 'maps';
  }

  reader(data: DataType): Map {
    return {
      grid: true,
      width: 10,
      height: 10,
      ...ObjectDAO.reader(data),
    };
  }
}
