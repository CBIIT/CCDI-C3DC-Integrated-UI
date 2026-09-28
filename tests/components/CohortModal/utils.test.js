jest.mock('../../../src/utils/graphqlClient', () => ({
  __esModule: true,
  default: {
    query: jest.fn(),
  },
}));

import {
  arrayToCSVDownload,
  objectToJsonDownload,
  hasUnsavedChanges,
  getManifestPayload,
  truncateSignedUrl,
  exportToCCDIHub,
  downloadCohortManifest,
  downloadCohortMetadata,
} from '../../../src/components/CohortModal/utils';
import client from '../../../src/utils/graphqlClient';
import {
  CCDI_HUB_BASE_URL,
  CCDI_INTEROP_SERVICE_URL,
} from '../../../src/bento/cohortModalData';

describe('cohort modal utils', () => {
  describe('hasUnsavedChanges', () => {
    it('should return false when either argument is missing', () => {
      expect(hasUnsavedChanges(null, {}, [])).toBe(false);
      expect(hasUnsavedChanges({}, null, [])).toBe(false);
    });

    it('should ignore listed fields when comparing', () => {
      expect(hasUnsavedChanges({ x: 1, cohortId: 'a' }, { x: 1, cohortId: 'b' }, ['cohortId'])).toBe(false);
    });

    it('should return true when shared keys differ', () => {
      expect(hasUnsavedChanges({ a: 1 }, { a: 2 }, [])).toBe(true);
    });
  });

  describe('getManifestPayload', () => {
    it('should return an empty array for missing input', () => {
      expect(getManifestPayload(null)).toEqual([]);
    });

    it('should group participants by study and skip missing accessions', () => {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      expect(getManifestPayload([
        { dbgap_accession: 'phs1', participant_id: 'P1' },
        { dbgap_accession: 'phs1', participant_id: 'P2' },
        { dbgap_accession: '', participant_id: 'P3' },
      ])).toEqual([
        { study_id: 'phs1', participant_id: ['P1', 'P2'] },
      ]);
      expect(warn).toHaveBeenCalled();
      warn.mockRestore();
    });
  });

  describe('truncateSignedUrl', () => {
    it('should keep the path through .json', () => {
      expect(truncateSignedUrl('https://cdn.example/file.json?sig=abc')).toBe(
        'https://cdn.example/file.json',
      );
    });

    it('should return the original value when there is no .json suffix', () => {
      expect(truncateSignedUrl('https://cdn.example/file')).toBe('https://cdn.example/file');
      expect(truncateSignedUrl(null)).toBe(null);
    });
  });

  describe('arrayToCSVDownload / objectToJsonDownload', () => {
    let createObjectURLSpy;
    let mockLink;

    beforeEach(() => {
      createObjectURLSpy = jest.fn(() => 'blob:mock');
      window.URL.createObjectURL = createObjectURLSpy;
      mockLink = { setAttribute: jest.fn(), click: jest.fn() };
      jest.spyOn(document, 'createElement').mockReturnValue(mockLink);
      jest.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink);
      jest.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should create a CSV blob and trigger download with Manifest filename', () => {
      arrayToCSVDownload([
        {
          participant_id: 'P1',
          study_id: 'phs001',
          sex_at_birth: 'F',
          race: ['White', 'Asian'],
          diagnosis: 'X',
        },
      ], 'my-cohort');

      expect(createObjectURLSpy).toHaveBeenCalled();
      expect(mockLink.click).toHaveBeenCalled();
      expect(mockLink.setAttribute).toHaveBeenCalledWith(
        'download',
        expect.stringMatching(/^Manifest_my-cohort_\d{4}-\d{2}-\d{2} \d{2}-\d{2}-\d{2}\.csv$/),
      );
    });

    it('should flatten nested participant fields and escape CSV special characters', () => {
      arrayToCSVDownload([
        {
          participant: {
            participant_id: 'P,1',
            sex_at_birth: 'F',
            race: 'A"B',
          },
          study_id: 'phs001',
          diagnosis: 'X',
        },
      ], 'csv-cohort');

      expect(createObjectURLSpy.mock.calls[0][0]).toBeInstanceOf(Blob);
      expect(mockLink.click).toHaveBeenCalled();
    });

    it('should stringify without __typename and use Metadata filename', () => {
      objectToJsonDownload(
        { foo: 1, nested: { __typename: 'T', bar: 2 } },
        'cid',
      );

      expect(createObjectURLSpy.mock.calls[0][0]).toBeInstanceOf(Blob);
      expect(mockLink.setAttribute).toHaveBeenCalledWith(
        'download',
        expect.stringMatching(/^Metadata_cid_\d{4}-\d{2}-\d{2} \d{2}-\d{2}-\d{2}\.json$/),
      );
    });
  });

  describe('exportToCCDIHub', () => {
    beforeEach(() => {
      global.fetch = jest.fn();
      window.open = jest.fn();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should show an error when there are no participants', async () => {
      const showAlert = jest.fn();
      await exportToCCDIHub([], { showAlert });
      expect(showAlert).toHaveBeenCalledWith('error', 'No participants available for export.');
    });

    it('should open the processed interop URL on success', async () => {
      const showAlert = jest.fn();
      const onLoadingStateChange = jest.fn();
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ data: { storeManifest: 'https://cdn.example/m.json?sig=1' } }),
      });

      const url = await exportToCCDIHub(
        [{ dbgap_accession: 'phs1', participant_id: 'P1' }],
        { showAlert, onLoadingStateChange },
      );

      expect(global.fetch).toHaveBeenCalledWith(
        CCDI_INTEROP_SERVICE_URL,
        expect.objectContaining({ method: 'POST' }),
      );
      expect(url).toBe(`${CCDI_HUB_BASE_URL}https://cdn.example/m.json`);
      expect(window.open).toHaveBeenCalledWith(url, '_blank');
      expect(showAlert).toHaveBeenCalledWith('success', 'CCDI Hub opened in new tab!');
      expect(onLoadingStateChange).toHaveBeenCalledWith(false);
    });

    it('should report GraphQL errors from the interop service', async () => {
      const showAlert = jest.fn();
      const err = jest.spyOn(console, 'error').mockImplementation(() => {});
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ errors: [{ message: 'boom' }] }),
      });

      const result = await exportToCCDIHub(
        [{ dbgap_accession: 'phs1', participant_id: 'P1' }],
        { showAlert },
      );
      expect(result).toBeNull();
      expect(showAlert).toHaveBeenCalledWith('error', expect.stringContaining('boom'));
      err.mockRestore();
    });

    it('should use the legacy URL constructor when interop is disabled', async () => {
      const showAlert = jest.fn();
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const url = await exportToCCDIHub(
        [{ dbgap_accession: 'phs1', participant_id: 'P1' }],
        { showAlert, useInteropService: false },
      );
      expect(window.open).toHaveBeenCalled();
      expect(url).toContain('P1');
      expect(showAlert).toHaveBeenCalledWith('success', 'CCDI Hub opened in new tab!');
      warn.mockRestore();
    });
  });

  describe('downloadCohortManifest / downloadCohortMetadata', () => {
    let mockLink;

    beforeEach(() => {
      window.URL.createObjectURL = jest.fn(() => 'blob:mock');
      mockLink = { setAttribute: jest.fn(), click: jest.fn() };
      jest.spyOn(document, 'createElement').mockReturnValue(mockLink);
      jest.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink);
      jest.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should query and download a manifest CSV', async () => {
      const showAlert = jest.fn();
      client.query.mockResolvedValue({
        data: {
          cohortManifest: [{
            participant_id: 'P1',
            study_id: 'S1',
            sex_at_birth: 'F',
            race: 'A',
            diagnosis: 'X',
          }],
        },
      });

      await downloadCohortManifest(
        [{ participant_pk: 'pk1' }, null, 'raw-id'],
        'cid',
        { showAlert, onLoadingStateChange: jest.fn() },
      );

      expect(client.query).toHaveBeenCalled();
      expect(mockLink.click).toHaveBeenCalled();
      expect(showAlert).toHaveBeenCalledWith('success', 'Manifest CSV downloaded successfully!');
    });

    it('should query and download metadata JSON', async () => {
      const showAlert = jest.fn();
      client.query.mockResolvedValue({
        data: { cohortMetadata: { foo: 1 } },
      });

      await downloadCohortMetadata([{ id: 'pk1' }], 'cid', { showAlert });
      expect(showAlert).toHaveBeenCalledWith('success', 'Metadata JSON downloaded successfully!');
    });

    it('should surface download errors', async () => {
      const showAlert = jest.fn();
      const err = jest.spyOn(console, 'error').mockImplementation(() => {});
      client.query.mockRejectedValue(new Error('network'));
      await expect(downloadCohortManifest([], 'cid', { showAlert })).rejects.toThrow('network');
      expect(showAlert).toHaveBeenCalledWith('error', 'Failed to download manifest. Please try again.');
      err.mockRestore();
    });
  });
});
