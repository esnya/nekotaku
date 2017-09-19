import { align } from '../utilities/entity';
import Vec2, { Rect } from '../utilities/Vec2';
import MapModeStrategy, { MouseTouchEvent } from './MapModeStrategy';
import getShapeCreateStrategy from './ShapeCreateStrategy';

export default class MapCreateModeStrategy extends MapModeStrategy {
  constructor(c: any) {
    super(c);
    this.scs = getShapeCreateStrategy(this.shapeType);
  }

  onMapTouch(e: MouseTouchEvent) {
    const pos = this.page2map(e);
    const { width, height } = this.c.map;
    if (!(new Rect(new Vec2(0, 0), new Vec2(width, height))).isInside(pos)) return;

    e.preventDefault();

    const {
      style,
      shapeType,
    } = this.c.mapControl;
    const offset = pos.map(a => align(a, 0.5));

    this.c.createShape({
      ...style,
      ...this.scs.onCreate(offset.x, offset.y),
      type: shapeType,
      offset,
    });
  }
  onMapMove(e: MouseTouchEvent) {
    const { selected } = this.c.mapControl;
    if (!selected) return;

    const { id, offset } = this.c.mapControl.selected;
    const shape = this.c.shapes.find(s => s.id === id);
    if (!shape) return;

    e.preventDefault();

    const pos = this.page2map(e);

    const update = this.scs.onMove(shape, pos, offset);
    if (update) {
      this.c.updateShape({
        ...update,
        id,
      });
    }
  }
}
