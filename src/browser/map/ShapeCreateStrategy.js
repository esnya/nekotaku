

import { snap } from './utilities';

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

  onMove(location: Object, offset: Object) {
    const sx = snap(location.x - offset.x);
    const sy = snap(location.y - offset.y);

    const x = offset.x + sx / 2;
    const y = offset.y + sy / 2;

    const rx = sx;
    const ry = sy;

    return {
      x, y, rx, ry,
    };
  }
}
class CircleCreateStrategy extends ShapeCreateStrategy {
  onCreate(location: Object) {
    this.x = snap(location.x);
    this.y = snap(location.y);
    return {
      x: this.x,
      y: this.y,
      radius: 0.5,
    };
  }

  onMove(location: Object) {
    const { x, y } = this;
    const length = Math.sqrt(((location.x - x) ** 2) + ((location.y - y) ** 2));
    const radius = Math.max(snap(length), 0.5);
    return { radius };
  }
}
class RectCreateStrategy extends ShapeCreateStrategy {
  onCreate(location) {
    const x = snap(location.x);
    const y = snap(location.y);

    return {
      x: x + 0.25,
      y: y + 0.25,
      width: 0.5,
      height: 0.5,
    };
  }

  onMove(location: Object, offset: Object) {
    const width = Math.max(snap(location.x - offset.x), 0.5);
    const height = Math.max(snap(location.y - offset.y), 0.5);
    const x = offset.x + width / 2;
    const y = offset.y + height / 2;

    return {
      width,
      height,
      x,
      y,
    };
  }
}

class TextCreateStrategy extends ShapeCreateStrategy {
  onCreate(location) {
    return {
      x: snap(location.x),
      y: snap(location.y),
      text: prompt('テキスト'),
      fontSize: 30,
    };
  }
}

class PloyCreateStrategy extends ShapeCreateStrategy {
  onCreate(location) {
    this.points = [[0, 0]];
    return {
      x: snap(location.x),
      y: snap(location.y),
      points: this.points,
    };
  }

  onMove(location: Object, offset: Object) {
    const rx = location.x - offset.x;
    const ry = location.y - offset.y;
    this.points.push([rx, ry]);
    return {
      points: this.points,
    };
  }
}

const Constructors = {
  circle: CircleCreateStrategy,
  line: LineCreateStrategy,
  polyline: PloyCreateStrategy,
  rect: RectCreateStrategy,
  ruler: LineCreateStrategy,
  text: TextCreateStrategy,
};
export default function getShapeCreateStrategy(shapeType: string) {
  if (!(shapeType in Constructors)) throw new Error(`Invalid shape type: ${shapeType}`);
  const Constructor = Constructors[shapeType];
  return new Constructor();
}
