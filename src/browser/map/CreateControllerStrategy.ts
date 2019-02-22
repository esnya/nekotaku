

import ControllerStrategy from './ControllerStrategy';
import getShapeCreateStrategy, { ShapeCreateStrategy } from './ShapeCreateStrategy';
import Point from './Point';
import store from '../store';
import shapeDAO from '../dao/shapeDAO';

export default class EraseControllerStrategy extends ControllerStrategy {
  private shapeStrategy?: ShapeCreateStrategy;

  onTouchMap(location: Point, event: Event): void {
    event.preventDefault();

    const shapeType = store.state.mapShapeType;

    const shapeStrategy = getShapeCreateStrategy(shapeType)
    this.shapeStrategy = shapeStrategy;
    if (!this.shapeStrategy) throw new Error(`Invalid shape type ${shapeType}`);

    const shape = {
      type: shapeType,
      x: 0,
      y: 0,
      ...store.state.mapStyle,
      ...shapeStrategy.onCreate(location, { x: 0, y: 0 }),
    };

    shapeDAO.add(shape).then((id) => {
      this.select('shape', { id }, location);
    });
  }

  onMove(location: Point): void {
    if (!this.selectedId || !this.shapeStrategy) return;
    const shape = this.shapeStrategy.onMove(location, this.offset);
    shapeDAO.update(shape, this.selectedId);
  }

  onStop(): void {
    this.deselect();
  }
}
