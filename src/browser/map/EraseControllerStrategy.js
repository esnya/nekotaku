/* eslint class-methods-use-this: off */

import ControllerStrategy from './ControllerStrategy';

export default class EraseControllerStrategy extends ControllerStrategy {
  onTouchShape(location: Object, shape: Object) {
    this.models.shapes.remove(this.roomId, shape.id);
  }
}
