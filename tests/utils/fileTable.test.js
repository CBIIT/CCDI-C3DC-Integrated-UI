import { FileDisableRowSelection, FileOnRowsSelect } from '../../src/utils/fileTable';

describe('fileTable', () => {
  describe('FileDisableRowSelection', () => {
    it('should allow selection when the cart is empty', () => {
      expect(FileDisableRowSelection({ file_id: 'f1' }, [])).toBe(true);
      expect(FileDisableRowSelection({ file_id: 'f1' }, null)).toBe(true);
    });

    it('should disable selection when the file is already in the cart', () => {
      expect(FileDisableRowSelection({ file_id: 'f1' }, ['f1'])).toBe(false);
    });

    it('should allow selection when a different file is in the cart', () => {
      expect(FileDisableRowSelection({ file_id: 'f2' }, ['f1'])).toBe(true);
    });
  });

  describe('FileOnRowsSelect', () => {
    it('should map selected row indexes to file ids', () => {
      const data = [{ file_id: 'a' }, { file_id: 'b' }];
      expect(FileOnRowsSelect(data, [{ dataIndex: 1 }, { dataIndex: 0 }])).toEqual(['b', 'a']);
    });
  });
});
