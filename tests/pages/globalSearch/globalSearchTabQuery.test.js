jest.mock('../../../src/bento/sitesearch', () => ({
  queryCountAPI: jest.fn(),
  queryResultAPI: jest.fn(),
}));

import { queryCountAPI, queryResultAPI } from '../../../src/bento/sitesearch';
import { getAllQueryField, queryAllAPI } from '../../../src/pages/globalSearch/globalSearchTabQuery';
import { globalSearchCountsFixture } from '../../fixtures/globalSearch/globalSearchApiResponses';

describe('globalSearchTabQuery', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    queryCountAPI.mockResolvedValue(globalSearchCountsFixture);
  });

  describe('getAllQueryField', () => {
    it('should resolve the participants slice at offset 0', async () => {
      const result = await getAllQueryField('brain', 0, 10, true);
      expect(queryCountAPI).toHaveBeenCalledWith('brain', true);
      expect(result).toEqual({ datafieldValue: 'participants', offsetValue: 0 });
    });

    it('should move to studies after the participant bucket', async () => {
      const result = await getAllQueryField(
        'brain',
        globalSearchCountsFixture.participant_count,
        10,
        true,
      );
      expect(result.datafieldValue).toBe('studies');
      expect(result.offsetValue).toBe(0);
    });

    it('should keep a remainder offset inside a later bucket', async () => {
      queryCountAPI.mockResolvedValue({
        participant_count: 15,
        study_count: 20,
        sample_count: 0,
        file_count: 0,
        model_count: 0,
        about_count: 0,
      });
      const result = await getAllQueryField('brain', 10, 10, true);
      expect(result.datafieldValue).toBe('participants');
      expect(result.offsetValue).toBe(10);
    });

    it('should fall back to participants when offset is past all buckets', async () => {
      queryCountAPI.mockResolvedValue({
        participant_count: 0,
        study_count: 0,
        sample_count: 0,
        file_count: 0,
        model_count: 0,
        about_count: 0,
      });
      await expect(getAllQueryField('brain', 999, 10, true)).resolves.toEqual({
        datafieldValue: 'participants',
        offsetValue: 0,
      });
    });
  });

  describe('queryAllAPI', () => {
    it('should tag rows with the resolved datafield type', async () => {
      queryResultAPI.mockResolvedValue([{ id: 'r1' }]);
      const rows = await queryAllAPI('brain', 0, 10, true);
      expect(queryResultAPI).toHaveBeenCalledWith(
        'participants',
        { input: 'brain', first: 10, offset: 0 },
        true,
      );
      expect(rows).toEqual([{ id: 'r1', type: 'participants' }]);
    });
  });
});
