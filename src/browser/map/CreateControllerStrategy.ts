

import ControllerStrategy from './ControllerStrategy';
import getShapeCreateStrategy, { ShapeCreateStrategy } from './ShapeCreateStrategy';
import Point from './Point';

export default class EraseControllerStrategy extends ControllerStrategy {
  private shapeStrategy?: ShapeCreateStrategy;

  onTouchMap(location: Point, event: Event): void {
    event.preventDefault();

    const {
      shapeType,
    } = this.store.state.mapControl;

    const shapeStrategy = getShapeCreateStrategy(shapeType)
    this.shapeStrategy = shapeStrategy;
    if (!this.shapeStrategy) throw new Error(`Invalid shape type ${shapeType}`);

    const shape = {
      type: shapeType,
      ...this.store.state.mapControl.style,
      ...shapeStrategy.onCreate(location, { x: 0, y: 0 }),
    };

    this.models.shapes.push(this.roomId, shape).then((id) => {
      this.select('shape', { id }, location);
    });
  }

  onMove(location: Point): void {
    if (!this.selectedId || !this.shapeStrategy) return;
    const shape = this.shapeStrategy.onMove(location, this.offset);
    this.models.shapes.update(this.roomId, this.selectedId, shape);
  }

  onStop(): void {
    this.deselect();
  }
}
