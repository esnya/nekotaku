import { align } from '../utilities/entity';
import Vec2 from '../utilities/Vec2';

class ShapeCreateStrategy {
  onCreate() {}
  onMove() {}
}

class LineCreateStrategy extends ShapeCreateStrategy {
  onCreate() {
    return {
      rx: 0,
      ry: 0,
    };
  }
  onMove(shape: Object, pos: Vec2, offset: Vec2) {
    const size = pos.sub(offset).map(a => align(a, 0.5));
    const [x, y] = offset.add(size.div(2)).v;
    const [rx, ry] = size.v;

    return {
      x, y, rx, ry,
    };
  }
}
class CircleCreateStrategy extends ShapeCreateStrategy {
  onCreate(x, y) {
    return {
      x,
      y,
      radius: 0.5,
    };
  }
  onMove(shape: Object, pos: Vec2) {
    const { x, y } = shape;
    const radius = Math.max(align(pos.sub(new Vec2(x, y)).len(), 0.5));
    return { radius };
  }
}
class RectCreateStrategy extends ShapeCreateStrategy {
  onCreate(x, y) {
    return {
      x: x + 0.5,
      y: y + 0.5,
      radius: 0.5,
      width: 1,
      height: 1,
    };
  }
  onMove(shape: Object, pos: Vec2, offset: Vec2) {
    const size = pos.sub(offset).map(a => Math.max(align(Math.abs(a), 1), 1));
    const rectPos = offset.add(size.div(2));

    return {
      ...size.toSizeObject(),
      ...rectPos.toObject(),
    };
  }
}

const Constructors = {
  line: LineCreateStrategy,
  circle: CircleCreateStrategy,
  rect: RectCreateStrategy,
  ruler: LineCreateStrategy,
};
export default function getShapeCreateStrategy(shapeType: string) {
  if (!(shapeType in Constructors)) throw new Error(`Invalid shape type: ${shapeType}`);
  const Constructor = Constructors[shapeType];
  return new Constructor();
}
