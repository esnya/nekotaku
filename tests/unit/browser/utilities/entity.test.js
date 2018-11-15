import { expect } from 'chai';
import { align, limit } from '@/browser/utilities/entity';

describe('entity', () => {
  it('should aligns', () => {
    expect(align(2)).to.equal(2);
    expect(align(2.5)).to.equal(2.5);
    expect(align(2.6)).to.equal(2.5);
    expect(align(2.8)).to.equal(3);
    expect(align(2.5, 1)).to.equal(3);
  });

  it('should limits', () => {
    expect(limit(-1, 10)).to.equal(0);
    expect(limit(12, 10)).to.equal(10);
    expect(limit(5, 10)).to.equal(5);
  });
});
