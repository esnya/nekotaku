

import ControllerStrategy from './ControllerStrategy';
import Point from './Point';
import Entity from './Entity';

export default class EraseControllerStrategy extends ControllerStrategy {
  onTouchShape(location: Point, shape: Entity) {
    this.models.shapes.remove(this.roomId, shape.id);
  }
}
