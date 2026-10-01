jest.mock('../../src/pages/dashTemplate/sideBar/BentoFilterUtils', () => ({
  onClearAllAndSelectFacetValue: jest.fn(),
}), { virtual: true });

import {
  navigatedToDashboard,
  convertCRDCLinksToValue,
  removeSquareBracketsFromString,
} from '../../src/utils/utils';
import { onClearAllAndSelectFacetValue } from '../../src/pages/dashTemplate/sideBar/BentoFilterUtils';

describe('src/utils/utils', () => {
  describe('navigatedToDashboard', () => {
    it('should clear filters and select the study facet', () => {
      navigatedToDashboard('phs001');
      expect(onClearAllAndSelectFacetValue).toHaveBeenCalledWith('study', 'phs001');
    });
  });

  describe('convertCRDCLinksToValue', () => {
    it('should convert CRDCLinks arrays to counts for the first key when none is provided', () => {
      const data = {
        files: [{ id: 1, CRDCLinks: ['a', 'b'] }],
      };
      expect(convertCRDCLinksToValue(data)).toEqual({
        files: [{ id: 1, CRDCLinks: 2, links: ['a', 'b'] }],
      });
    });

    it('should convert CRDCLinks arrays for a named key', () => {
      const data = {
        files: [{ id: 1, CRDCLinks: ['a'] }],
        extra: true,
      };
      expect(convertCRDCLinksToValue(data, 'files')).toEqual({
        extra: true,
        files: [{ id: 1, CRDCLinks: 1, links: ['a'] }],
      });
    });
  });

  describe('removeSquareBracketsFromString', () => {
    it('should strip square brackets from a list string', () => {
      expect(removeSquareBracketsFromString('[Gemtuzumab, Bicalutamide]')).toBe(
        'Gemtuzumab, Bicalutamide',
      );
    });
  });
});
