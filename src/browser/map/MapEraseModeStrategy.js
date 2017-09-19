import MapModeStrategy from './MapModeStrategy';

export default class MapEraseModeStrategy extends MapModeStrategy {
  onShapeTouch(e, shape) {
    e.preventDefault();
    this.c.removeShape(shape.id);
  }
}
