/**
 * FederationResourceController — axios GET resourceData.yaml then FederationResourceView.
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
import FederationResourceController from '../../../../src/pages/resource/FederationResourcePage/FederationResourceController';
import { createDedicatedYamlAxiosMock } from '../../../helpers/resourceYamlApiMocks';
import { minimalFederationResourceData } from '../../../fixtures/resource/resourceDataViewProps';

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
    createDedicatedYamlAxiosMock({ '/resourceData.yaml': minimalFederationResourceData }),
  );
});

afterEach(() => {
  document.querySelectorAll('footer').forEach((el) => el.remove());
  jest.clearAllMocks();
});

describe('FederationResourceController', () => {
  describe('Mocked axios (resourceData.yaml)', () => {
    it('should fetch YAML and render federation page content', async () => {
      render(
        <MemoryRouter>
          <FederationResourceController />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByText('CCDI Data Federation Resource')).toBeInTheDocument();
      });
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringMatching(/^https:\/\/static\.example\.com\/resourceData\.yaml\?ts=\d+$/),
      );
      expect(screen.getByText(/Federation intro for unit test/i)).toBeInTheDocument();
    });

    it('should still render the view shell when axios rejects', async () => {
      axios.get.mockRejectedValue(new Error('network'));
      render(
        <MemoryRouter>
          <FederationResourceController />
        </MemoryRouter>,
      );
      await waitFor(() => {
        expect(screen.getByText('CCDI Data Federation Resource')).toBeInTheDocument();
      });
    });
  });
});
