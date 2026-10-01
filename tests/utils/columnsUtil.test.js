import updateColumns, { hasMultiStudyParticipants } from '../../src/utils/columnsUtil';

describe('columnsUtil', () => {
  describe('updateColumns', () => {
    it('should hide view columns that are marked viewColumns false', () => {
      const columns = [
        { label: 'Case ID', options: { viewColumns: true } },
        { label: 'Study', options: { viewColumns: true } },
      ];
      const next = updateColumns(columns, [
        { header: 'Study', viewColumns: false },
      ]);
      expect(next[1].options.viewColumns).toBe(false);
      expect(next[0].options.viewColumns).toBe(true);
    });

    it('should ignore column list entries without a matching label', () => {
      const columns = [{ label: 'Case ID', options: { viewColumns: true } }];
      const next = updateColumns(columns, [{ header: 'Missing', viewColumns: false }]);
      expect(next[0].options.viewColumns).toBe(true);
    });
  });

  describe('hasMultiStudyParticipants', () => {
    it('should return false for an empty table', () => {
      expect(hasMultiStudyParticipants([])).toBe(false);
    });

    it('should return true when any rows exist', () => {
      expect(hasMultiStudyParticipants([{ id: 1 }])).toBe(true);
    });
  });
});
