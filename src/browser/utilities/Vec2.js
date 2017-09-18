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

  static getOffset(e: HTMLElement) {
    return new Vec2(
      e.offsetLeft,
      e.offsetTop,
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
