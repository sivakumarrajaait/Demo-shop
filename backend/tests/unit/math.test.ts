import { multiply } from '../../math';

describe('multiply()', () => {
  it('should return the correct product', () => {
    expect(multiply(2, 3)).toBe(6);
    expect(multiply(0, 100)).toBe(0);
    expect(multiply(-4, 5)).toBe(-20);
  });
});
