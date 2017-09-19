export default class Vec2 {
  static getScreen(e) {
    const {
      touches,
      screenX,
      screenY,
    } = e;

    if (touches && touches.length >= 1) {
      return Vec2.getScreen(touches[0]);
    }

    return new Vec2(
      screenX,
      screenY,
    );
  }

  static getLayer(e) {
    const {
      touches,
      layerX,
      layerY,
    } = e;

    if (touches && touches.length >= 1) {
      return Vec2.getLayer(touches[0]);
    }

    return new Vec2(
      layerX,
      layerY,
    );
  }

  static getPage(e) {
    const {
      touches,
      pageX,
      pageY,
    } = e;

    if (touches && touches.length >= 1) {
      return Vec2.getPage(touches[0]);
    }

    return new Vec2(
      pageX,
      pageY,
    );
  }

  static getOffset(e: HTMLElement) {
    return new Vec2(
      e.offsetLeft,
      e.offsetTop,
    );
  }

  static getScroll(e: HTMLElement) {
    return new Vec2(
      e.scrollLeft,
      e.scrollTop,
    );
  }

  constructor(x, y) {
    this.v = [x, y];
  }

  get x() {
    return this.v[0];
  }
  get y() {
    return this.v[1];
  }

  map(handler) {
    return new Vec2(...this.v.map(handler));
  }
  reduce(...args) {
    return this.v.reduce(...args);
  }
  add(v) {
    if (!(v instanceof Vec2)) return this.add(new Vec2(v, v));
    return this.map((a, i) => a + v.v[i]);
  }
  sub(v) {
    if (!(v instanceof Vec2)) return this.sub(new Vec2(v, v));
    return this.map((a, i) => a - v.v[i]);
  }
  mul(v) {
    if (!(v instanceof Vec2)) return this.mul(new Vec2(v, v));
    return this.map((a, i) => a * v.v[i]);
  }
  div(v) {
    if (!(v instanceof Vec2)) return this.div(new Vec2(v, v));
    return this.map((a, i) => a / v.v[i]);
  }
  len() {
    return Math.sqrt(this.reduce((a, b) => a + (b ** 2), 0));
  }

  toObject() {
    const [x, y] = this.v;
    return { x, y };
  }
  toSizeObject() {
    const [width, height] = this.v;
    return { width, height };
  }
  toString() {
    return `Vec2(${this.v.join(',')})`;
  }
}

export class Rect {
  constructor(pos: Vec2, size: Vec2) {
    this.pos = pos;
    this.size = size;
  }

  isInside(pos: Vec2) {
    const d1 = pos.sub(this.pos);
    const d2 = d1.sub(this.size);

    return d1.x > 0 && d1.y > 0 && d2.x < 0 && d2.y < 0;
  }
}
