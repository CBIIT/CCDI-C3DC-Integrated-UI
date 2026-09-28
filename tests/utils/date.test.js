import getDateInFormat from '../../src/utils/date';

describe('src/utils/date', () => {
  it('should format a valid ISO date as yyyy/m/d', () => {
    expect(getDateInFormat('2026-03-09T12:00:00.000Z')).toMatch(/^2026\/3\/9$/);
  });

  it('should use a custom separator when provided', () => {
    expect(getDateInFormat('2026-03-09T12:00:00.000Z', '-')).toMatch(/^3-9-2026$/);
  });

  it('should return an empty string for missing input', () => {
    expect(getDateInFormat('')).toBe('');
    expect(getDateInFormat(undefined)).toBe('');
  });
});
