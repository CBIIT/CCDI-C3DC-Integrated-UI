import { SampleDisableRowSelection, SampleOnRowsSelect } from '../../src/utils/sampleFileTable';

describe('sampleFileTable', () => {
  describe('SampleDisableRowSelection', () => {
    it('should allow selection when the cart is empty', () => {
      expect(SampleDisableRowSelection({ files: [{ file_id: 'f1' }] }, [])).toBe(true);
    });

    it('should allow selection when any file is missing from the cart', () => {
      expect(SampleDisableRowSelection(
        { files: [{ file_id: 'f1' }, { file_id: 'f2' }] },
        ['f1'],
      )).toBe(true);
    });

    it('should disable selection when every file is already in the cart', () => {
      expect(SampleDisableRowSelection(
        { files: [{ file_id: 'f1' }, { file_id: 'f2' }] },
        ['f1', 'f2'],
      )).toBe(false);
    });

    it('should disable selection when the sample has no files and the cart is not empty', () => {
      expect(SampleDisableRowSelection({ files: [] }, ['f1'])).toBe(false);
    });
  });

  describe('SampleOnRowsSelect', () => {
    it('should collect file ids from selected sample rows', () => {
      const data = [
        { files: [{ file_id: 'a' }, { file_id: 'b' }] },
        { files: [{ file_id: 'c' }] },
        { files: [] },
      ];
      expect(SampleOnRowsSelect(data, [{ dataIndex: 0 }, { dataIndex: 1 }, { dataIndex: 2 }])).toEqual([
        'a',
        'b',
        'c',
      ]);
    });
  });
});
