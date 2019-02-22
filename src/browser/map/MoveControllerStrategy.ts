

import { snap } from './utilities';
import ControllerStrategy from './ControllerStrategy';
import Point from './Point';
import Entity from './Entity';

export default class MoveControllerStrategy extends ControllerStrategy {
  onTouchCharacter(location: Point, character: Entity): void {
    this.select('character', character, location);
    this.updateSelected({ z: Date.now() });
  }

  onTouchShape(location: Point, shape: Entity): void {
    this.select('shape', shape, location);
    this.updateSelected({ z: Date.now() });
  }

  onMove(location: { x: number, y: number }): void {
    if (!this.selected) return;

    this.updateSelected({
      x: snap(location.x),
      y: snap(location.y),
    });
  }

  onStop(): void {
    this.deselect();
  }
}
