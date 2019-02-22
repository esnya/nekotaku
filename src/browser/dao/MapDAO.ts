import ObjectDAO from '@/browser/dao/ObjectDAO';
import ObjectDataType from '@/types/data/ObjectDataType';
import DataWithId from '@/types/data/DataWithId';

export interface Map extends ObjectDataType {
  grid: boolean;
  width: number;
  height: number;
  backgroundImage?: string | null;
}

export interface UpdateData {
  grid?: boolean;
  width?: number;
  height?: number;
  backgroundImage?: string | null;
}

export class MapDAO extends ObjectDAO<Map, UpdateData> {
  getName(): string {
    return 'maps';
  }

  reader(data: DataWithId): Map {
    return {
      ...ObjectDAO.reader(data),
      grid: true,
      width: 10,
      height: 10,
      ...data,
    };
  }
}
