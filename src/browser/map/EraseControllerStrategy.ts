

import ControllerStrategy from './ControllerStrategy';
import Point from './Point';
import Entity from './Entity';
import shapeDAO from '../dao/shapeDAO';

export default class EraseControllerStrategy extends ControllerStrategy {
  onTouchShape(location: Point, shape: Entity) {
    shapeDAO.remove(shape.id);
  }
}
