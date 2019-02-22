

import { snap } from './utilities';
import Point from './Point';

export interface ShapeCreateStrategy {
  onCreate(location: Point, offset: Point): {};
  onMove(location: Point, offset: Point): {};
}

class LineCreateStrategy implements ShapeCreateStrategy {
  onCreate(): {} {
    return {
      rx: 0,
      ry: 0,
    };
  }

  onMove(location: Point, offset: Point): {} {
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
class CircleCreateStrategy implements ShapeCreateStrategy {
  private x: number = 0;
  private y: number = 0;

  onCreate(location: Point) {
    const x = snap(location.x);
    const y = snap(location.y);
    this.x = x;
    this.y = y;
    return {
      x,
      y,
      radius: 0.5,
    };
  }

  onMove(location: Point) {
    const { x, y } = this;
    const length = Math.sqrt(((location.x - x) ** 2) + ((location.y - y) ** 2));
    const radius = Math.max(snap(length), 0.5);
    return { radius };
  }
}
class RectCreateStrategy implements ShapeCreateStrategy {
  onCreate(location: Point) {
    const x = snap(location.x);
    const y = snap(location.y);

    return {
      x: x + 0.25,
      y: y + 0.25,
      width: 0.5,
      height: 0.5,
    };
  }

  onMove(location: Point, offset: Point) {
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

class TextCreateStrategy implements ShapeCreateStrategy {
  onCreate(location: Point) {
    return {
      x: snap(location.x),
      y: snap(location.y),
      text: prompt('テキスト'),
      fontSize: 30,
    };
  }

  onMove() {
    return {};
  }
}

class PloyCreateStrategy implements ShapeCreateStrategy {
  private points: number[][] = [];

  onCreate(location: Point) {
    this.points = [[0, 0]];
    return {
      x: snap(location.x),
      y: snap(location.y),
      points: this.points,
    };
  }

  onMove(location: Point, offset: Point) {
    const rx = location.x - offset.x;
    const ry = location.y - offset.y;
    this.points.push([rx, ry]);
    return {
      points: this.points,
    };
  }
}

export default function getShapeCreateStrategy(shapeType: string): ShapeCreateStrategy {
  switch (shapeType) {
    case 'circle':
      return new CircleCreateStrategy();
    case 'line':
    case 'ruler':
      return new LineCreateStrategy();
    case 'polyline':
      return new PloyCreateStrategy();
    case 'rect':
      return new RectCreateStrategy();
    case 'text':
      return new TextCreateStrategy();
    default:
      throw new Error(`Invalid shape type: ${shapeType}`);
  }
}
