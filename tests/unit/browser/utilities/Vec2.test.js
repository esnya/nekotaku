import { expect } from 'chai';
import Vec2, { Rect } from '@/browser/utilities/Vec2';


describe('Vec2', () => {
  it('should be vec2', () => {
    expect((new Vec2(1, 2).v)).to.deep.equal([1, 2]);
  });

  it('should maps', () => {
    expect((new Vec2(1, 2)).map(a => a * 2).v).to.deep.equal([2, 4]);
  });

  it('should reduces', () => {
    expect((new Vec2(2, 3)).reduce((a, b) => a + b)).to.equal(5);
  });

  it('should calcs', () => {
    const a = new Vec2(1, 3);
    const b = new Vec2(2, 4);

    expect(a.add(b).v).to.deep.equal([3, 7]);
    expect(a.add(2).v).to.deep.equal([3, 5]);

    expect(b.sub(a).v).to.deep.equal([1, 1]);
    expect(a.sub(2).v).to.deep.equal([-1, 1]);

    expect(a.mul(b).v).to.deep.equal([2, 12]);
    expect(a.mul(2).v).to.deep.equal([2, 6]);

    expect(a.div(b).v).to.deep.equal([1 / 2, 3 / 4]);
    expect(a.div(2).v).to.deep.equal([0.5, 1.5]);

    expect(a.len()).to.equal(Math.sqrt(10));
  });

  it('should exposes as ...', () => {
    const a = new Vec2(1, 3);

    expect(a.x).to.equal(1);
    expect(a.y).to.equal(3);
    expect(a.toObject()).to.deep.equal({ x: 1, y: 3 });
    expect(a.toSizeObject()).to.deep.equal({ width: 1, height: 3 });
    expect(a.toString()).to.equal('Vec2(1,3)');
  });

  it('should generates from ...', () => {
    expect(Vec2.getScreen({ screenX: 1, screenY: 2 }).v).to.deep.equal([1, 2]);
    expect(Vec2.getScreen({ touches: [{ screenX: 1, screenY: 2 }] }).v).to.deep.equal([1, 2]);

    expect(Vec2.getLayer({ layerX: 1, layerY: 2 }).v).to.deep.equal([1, 2]);
    expect(Vec2.getLayer({ touches: [{ layerX: 1, layerY: 2 }] }).v).to.deep.equal([1, 2]);

    expect(Vec2.getPage({ pageX: 1, pageY: 2 }).v).to.deep.equal([1, 2]);
    expect(Vec2.getPage({ touches: [{ pageX: 1, pageY: 2 }] }).v).to.deep.equal([1, 2]);

    expect(Vec2.getOffset({ offsetLeft: 1, offsetTop: 2 }).v).to.deep.equal([1, 2]);
    expect(Vec2.getScroll({ scrollLeft: 1, scrollTop: 2 }).v).to.deep.equal([1, 2]);
  });

  it('should be Rect', () => {
    const r = new Rect(new Vec2(1, 2), new Vec2(3, 4));

    expect(r.isInside(new Vec2(2, 4))).to.true;
    expect(r.isInside(new Vec2(0, 4))).to.false;
    expect(r.isInside(new Vec2(2, 6))).to.false;
  });
});
