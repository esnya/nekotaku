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

  constructor(x, y) {
    this.v = [x, y];
  }

  map(handler) {
    return new Vec2(...this.v.map(handler));
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

  toObject() {
    const [x, y] = this.v;
    return { x, y };
  }
  toString() {
    return `Vec2(${this.v.join(',')})`;
  }
}
