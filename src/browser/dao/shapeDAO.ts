import Shape, { ShapeAdd, ShapeUpdate } from '@/models/Shape';
import Model from '@/models/Model';
import RoomChildDAO from './RoomChildDAO';

export class ShapeDAO extends RoomChildDAO<ShapeAdd, ShapeUpdate, Shape> {
  getCollectionName(): string {
    return 'shapes';
  }

  read(value: Model): Shape {
    return {
      type: 'circle',
      x: 0,
      y: 0,
      r: 1,
      ...value,
    };
  }
}
export default new ShapeDAO();
