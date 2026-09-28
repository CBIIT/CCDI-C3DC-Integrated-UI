import colors from '../../src/utils/colors';

describe('colors', () => {
  it('should expose the same palette for odd and even series', () => {
    expect(colors.odd).toEqual(colors.even);
    expect(colors.even.length).toBeGreaterThan(0);
    expect(colors.even[0]).toMatch(/^#/);
  });
});
