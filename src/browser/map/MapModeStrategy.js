import Vec2 from '../utilities/Vec2';

export type MouseTouchEvent = MouseEvent | TouchEvent;

export default class MapModeStrategy {
  c: any;
  mode: string;
  shapeType: ?string;
  constructor(c: any) {
    this.c = c;

    if (c.mapControl) {
      this.mode = c.mapControl.mode;
      this.shapeType = c.mapControl.shapeType;
    }
  }

  page2map(e: MouseTouchEvent) {
    const page = Vec2.getPage(e);
    const s = this.c.scale * 50;

    return page
      .add(Vec2.getScroll(this.c.$refs.container.parentElement))
      .sub(new Vec2(0, 56))
      .div(s)
      .sub(2);
  }

  onShapeTouch() {}
  onCharacterTouch() {}
  onMapTouch() {}
  onMapMove() {}
  onMapDrag() {}
  onMoveEnd() {
    this.c.deselectEntity();
  }
}
