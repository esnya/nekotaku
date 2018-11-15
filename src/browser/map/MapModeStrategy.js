/* eslint class-methods-use-this: off */

import _ from 'lodash';
import Vec2 from '../utilities/Vec2';

export type MouseTouchEvent = MouseEvent | TouchEvent;

const Wait = 40;

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

    this.mapMove = _.throttle(e => this.onMapMove(e), Wait);
    this.mapDrag = _.throttle(e => this.onMapDrag(e), Wait);
  }

  page2map(e: MouseTouchEvent) {
    const page = Vec2.getPage(e);
    const s = this.c.scale * 50;

    return page
      .add(Vec2.getScroll(this.c.$refs.container))
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
