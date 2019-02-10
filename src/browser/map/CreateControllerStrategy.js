

import ControllerStrategy from './ControllerStrategy';
import getShapeCreateStrategy from './ShapeCreateStrategy';

export default class EraseControllerStrategy extends ControllerStrategy {
  async onTouchMap(location: Object, event: Event) {
    event.preventDefault();

    const {
      shapeType,
    } = this.store.state.mapControl;

    this.shapeStrategy = getShapeCreateStrategy(shapeType);
    if (!this.shapeStrategy) throw new Error(`Invalid shape type ${shapeType}`);

    const shape = {
      type: shapeType,
      ...this.store.state.mapControl.style,
      ...this.shapeStrategy.onCreate(location),
    };

    const id = await this.models.shapes.push(this.roomId, shape);

    this.select('shape', { id }, location);
  }

  onMove(location: Object) {
    if (!this.selectedId) return;
    const shape = this.shapeStrategy.onMove(location, this.offset);
    this.models.shapes.update(this.roomId, this.selectedId, shape);
  }

  onStom() {
    this.deselect();
  }
}
