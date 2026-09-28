import {
  convertToCSV,
  createFileName,
  downloadJson,
  formatManifestCellValue,
} from '../../../../../../src/pages/cart/customComponent/exportButton/util/downloadJson';

describe('downloadJson utilities', () => {
  describe('createFileName', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    function mockNow({ date, month, hours, minutes, seconds }) {
      jest.spyOn(global, 'Date').mockImplementation(() => ({
        getFullYear: () => 2026,
        getDate: () => date,
        getMonth: () => month,
        getHours: () => hours,
        getMinutes: () => minutes,
        getSeconds: () => seconds,
      }));
    }

    it('should pad single-digit date and time values', () => {
      mockNow({ date: 5, month: 0, hours: 3, minutes: 4, seconds: 7 });
      expect(createFileName('manifest')).toBe('manifest 2026-01-05 03-04-07.csv');
    });

    it('should keep two-digit date and time values', () => {
      mockNow({ date: 15, month: 10, hours: 12, minutes: 11, seconds: 10 });
      expect(createFileName('manifest')).toBe('manifest 2026-11-15 12-11-10.csv');
    });
  });

  describe('formatManifestCellValue', () => {
    it('should format guid URIs, arrays, and empty values', () => {
      expect(formatManifestCellValue('guid', 'abc123')).toBe(
        'drs://nci-crdc.datacommons.io/abc123',
      );
      expect(formatManifestCellValue('label', ['a', null, ' b ', ''])).toBe('a; b ');
      expect(formatManifestCellValue('label', null)).toBe('');
      expect(formatManifestCellValue('label', 12)).toBe('12');
    });
  });

  describe('convertToCSV', () => {
    const keysToInclude = ['guid', 'label'];
    const header = ['drs_id', 'name'];

    it('should prefix guid values and quote comments that contain commas', () => {
      const csv = convertToCSV(
        [{ guid: 'abc123', label: 'my,file' }, { guid: '', label: 'second' }],
        'Exported, from test',
        keysToInclude,
        header,
      );

      expect(csv).toMatch(/^drs_id,name\r\n/);
      expect(csv).toContain('drs://nci-crdc.datacommons.io/abc123');
      expect(csv).toContain('"my,file"');
      expect(csv).toContain('"Exported, from test"');
      expect(csv).toContain('second');
    });

    it('should stringify a JSON array string input', () => {
      const csv = convertToCSV(
        JSON.stringify([{ guid: 'x', label: 'y' }]),
        'ok',
        keysToInclude,
        header,
      );
      expect(csv).toContain('drs://nci-crdc.datacommons.io/x');
    });
  });

  describe('downloadJson', () => {
    it('should create an anchor, trigger download, and tear it down', () => {
      window.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
      const clickSpy = jest.fn();
      const mockLink = document.createElement('a');
      mockLink.click = clickSpy;
      jest.spyOn(document, 'createElement').mockReturnValue(mockLink);
      jest.spyOn(document.body, 'appendChild').mockImplementation(() => {});
      jest.spyOn(document.body, 'removeChild').mockImplementation(() => {});

      downloadJson(
        { filesManifestInList: [{ guid: 'g1' }] },
        'comment line',
        'cart-manifest',
        { keysToInclude: ['guid'], header: ['drs_id'] },
      );

      expect(window.URL.createObjectURL).toHaveBeenCalled();
      expect(clickSpy).toHaveBeenCalled();
      document.createElement.mockRestore();
      document.body.appendChild.mockRestore();
      document.body.removeChild.mockRestore();
    });
  });
});
