describe('entity', () => {
  const {
    align,
    limit,
  } = require('./entity');

  it('should aligns', () => {
    expect(align(2)).toBe(2);
    expect(align(2.5)).toBe(2.5);
    expect(align(2.6)).toBe(2.5);
    expect(align(2.8)).toBe(3);
    expect(align(2.5, 1)).toBe(3);
  });

  it('should limits', () => {
    expect(limit(-1, 10)).toBe(0);
    expect(limit(12, 10)).toBe(10);
    expect(limit(5, 10)).toBe(5);
  });
});
