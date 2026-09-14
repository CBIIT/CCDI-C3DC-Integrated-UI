import { buildVennCohortSetLabel, flattenVennNodeValue } from '../../../vennDiagram/ChartVennConfig';

describe('ChartVennConfig', () => {
  describe('flattenVennNodeValue', () => {
    it('wraps scalar values', () => {
      expect(flattenVennNodeValue('Surgery')).toEqual(['Surgery']);
    });

    it('flattens array values such as treatment_type', () => {
      expect(flattenVennNodeValue(['Surgery', ['Radiation']])).toEqual(['Surgery', 'Radiation']);
    });

    it('drops empty values', () => {
      expect(flattenVennNodeValue(null)).toEqual([]);
      expect(flattenVennNodeValue('')).toEqual([]);
    });
  });

  describe('buildVennCohortSetLabel', () => {
    it('includes participant count by default', () => {
      expect(buildVennCohortSetLabel('Cohort A', 12)).toBe('Cohort A (12)');
    });

    it('omits count when includeCount is false', () => {
      expect(buildVennCohortSetLabel('Cohort A', 0, undefined, false)).toBe('Cohort A');
    });

    it('truncates long names with ellipsis', () => {
      const long = 'A'.repeat(30);
      expect(buildVennCohortSetLabel(long, 1, 10)).toBe(`${'A'.repeat(10)}… (1)`);
    });

    it('handles empty cohort name', () => {
      expect(buildVennCohortSetLabel('', 0)).toBe(' (0)');
    });
  });
});
