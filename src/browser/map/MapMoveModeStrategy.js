import Vec2 from '../utilities/Vec2';
import MapModeStrategy, { MouseTouchEvent } from './MapModeStrategy';

export default class MapMoveModeStrategy extends MapModeStrategy {
  onEntityTouch(e: MouseTouchEvent, entity: Object, type: string) {
    e.preventDefault();

    const {
      id, x, y,
    } = entity;

    this.c.selectEntity({
      id,
      type,
      offset: this.page2map(e).sub(new Vec2(x, y)),
    });
  }

  onShapeTouch(e: MouseTouchEvent, shape: Object) {
    this.onEntityTouch(e, shape, 'shape');
  }
  onCharacterTouch(e: MouseTouchEvent, character: Object) {
    this.onEntityTouch(e, character, 'character');
  }
  onMapDrag(e: MouseTouchEvent) {
    if (e.buttons !== 1 || this.c.mapControl.selected) return;

    const pos = new Vec2(e.pageX, e.pageY);
    if (!this.scrollOffset) {
      this.scrollOffset = pos;
      return;
    }

    const d = this.scrollOffset.sub(pos);
    this.scrollOffset = pos;

    const scrollable = this.c.$refs.container;
    scrollable.scrollLeft += d.v[0];
    scrollable.scrollTop += d.v[1];
  }
  onMapMove(e: MouseTouchEvent) {
    const {
      selected,
    } = this.c.mapControl;
    if (!selected) return;

    const {
      id,
      type,
      offset,
    } = selected;
    const pos = this.page2map(e).sub(offset);

    if (type === 'shape') this.c.moveShape({ ...pos.toObject(), id });
    else if (type === 'character') this.c.moveCharacter({ ...pos.toObject(), id });
  }
  onMoveEnd(e: MouseTouchEvent) {
    this.scrollOffset = null;

    const {
      selected,
    } = this.c.mapControl;
    if (!selected) return;

    const {
      id,
      type,
    } = selected;

    if (type === 'shape') this.c.alignShape(id);
    else if (type === 'character') this.c.alignCharacter(id);

    super.onMoveEnd(e);
  }
}
