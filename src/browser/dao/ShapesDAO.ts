import ListDAO, { ListItemDataType } from '@/browser/dao/ListDAO';

export interface Shape extends ListItemDataType {
  type: string;
  x: number;
  y: number;
}

interface AddData {
  type: string;
  x: number;
  y: number;
}

interface UpdateData {
  x?: number;
  y?: number;
}

export type ItemKey = string;

export default class ShapesDAO extends ListDAO<Shape, AddData, UpdateData, ItemKey> {
  getName(): string {
    return 'shapes';
  }

  keyToString(key: ItemKey): string {
    return key;
  }

  reader(data: { id: string }): Shape {
    return {
      ...ListDAO.reader(data),
      type: 'line',
      x: 0,
      y: 0,
      ...data,
    };
  }
}
