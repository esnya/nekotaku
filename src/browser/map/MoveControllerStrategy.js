

import ControllerStrategy from './ControllerStrategy';
import { snap } from './utilities';

export default class MoveControllerStrategy extends ControllerStrategy {
  onTouchCharacter(location: Object, character: Object) {
    this.select('character', character, location);
    this.updateSelected({ z: Date.now() });
  }

  onTouchShape(location: Object, shape: Object) {
    this.select('shape', shape, location);
    this.updateSelected({ z: Date.now() });
  }

  onMove(location: { x: number, y: number }) {
    if (!this.selected) return;

    this.updateSelected({
      x: snap(location.x),
      y: snap(location.y),
    });
  }

  onStop() {
    this.deselect();
  }
}
