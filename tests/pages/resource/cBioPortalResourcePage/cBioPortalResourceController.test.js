/**
 * CBioPortalResourceController — axios GET resourceData.yaml then view.
 */

jest.mock('axios');
jest.mock('../../../../src/utils/env', () => ({
  __esModule: true,
  default: {
    REACT_APP_STATIC_CONTENT_URL: 'https://static.example.com',
  },
}));

import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import CBioPortalResourceController from '../../../../src/pages/resource/cBioPortalResourcePage/cBioPortalResourceController';
import { createDedicatedYamlAxiosMock } from '../../../helpers/resourceYamlApiMocks';
import { minimalCBioPortalResourceData } from '../../../fixtures/resource/resourceDataViewProps';

if (typeof global.MutationObserver === 'undefined') {
  global.MutationObserver = class MutationObserver {
    disconnect() {}
    observe() {}
    takeRecords() { return []; }
  };
}

beforeEach(() => {
  window.scrollTo = jest.fn();
  for (let i = 0; i < 3; i += 1) {
    document.body.appendChild(document.createElement('footer'));
  }
  axios.get.mockImplementation(
    createDedicatedYamlAxiosMock({ '/resourceData.yaml': minimalCBioPortalResourceData }),
  );
});

afterEach(() => {
  document.querySelectorAll('footer').forEach((el) => el.remove());
  jest.clearAllMocks();
});

describe('CBioPortalResourceController', () => {
  describe('Mocked axios (resourceData.yaml)', () => {
    it('should fetch YAML and always render the cBioPortal view', async () => {
      render(
        <MemoryRouter>
          <CBioPortalResourceController />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByText('CCDI cBioPortal')).toBeInTheDocument();
      });
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringMatching(/^https:\/\/static\.example\.com\/resourceData\.yaml\?ts=\d+$/),
      );
      expect(screen.getByText(/cBioPortal intro for unit test/i)).toBeInTheDocument();
    });
  });
});
