/**
 * CPIResourceController — resourceData.yaml plus participant statistics fetch.
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
import CPIResourceController from '../../../../src/pages/resource/CPIResourcePage/CPIResourceController';
import { createDedicatedYamlAxiosMock } from '../../../helpers/resourceYamlApiMocks';
import {
  CPI_PARTICIPANT_STATS_URL,
  minimalCpiResourceData,
  minimalCpiStatsApiResponse,
} from '../../../fixtures/resource/cpiResourceFixtures';
import {
  createCpiStatsFetchHttpErrorMock,
  createCpiStatsFetchSuccessMock,
} from '../../../helpers/cpiApiMocks';

if (typeof global.MutationObserver === 'undefined') {
  global.MutationObserver = class MutationObserver {
    disconnect() {}
    observe() {}
    takeRecords() { return []; }
  };
}

let originalFetch;

beforeEach(() => {
  originalFetch = global.fetch;
  window.scrollTo = jest.fn();
  for (let i = 0; i < 3; i += 1) {
    document.body.appendChild(document.createElement('footer'));
  }
  axios.get.mockImplementation(
    createDedicatedYamlAxiosMock({ '/resourceData.yaml': minimalCpiResourceData }),
  );
  global.fetch = createCpiStatsFetchSuccessMock(minimalCpiStatsApiResponse);
});

afterEach(() => {
  global.fetch = originalFetch;
  document.querySelectorAll('footer').forEach((el) => el.remove());
  jest.clearAllMocks();
});

describe('CPIResourceController', () => {
  describe('Mocked axios (resourceData.yaml) and fetch (participant statistics)', () => {
    it('should show loading then formatted statistics from the CPI API', async () => {
      render(
        <MemoryRouter>
          <CPIResourceController />
        </MemoryRouter>,
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText('CCDI Participant Index')).toBeInTheDocument();
      });

      expect(axios.get).toHaveBeenCalledWith(
        expect.stringMatching(/^https:\/\/static\.example\.com\/resourceData\.yaml\?ts=\d+$/),
      );
      expect(global.fetch).toHaveBeenCalledWith(CPI_PARTICIPANT_STATS_URL);

      await waitFor(() => {
        expect(screen.getByText(/4,242/)).toBeInTheDocument();
      });
      expect(screen.getByText(/CPI intro for unit test/i)).toBeInTheDocument();
      expect(
        screen.getByAltText(/Flow of data from submitters through CCDI Participant Index/i),
      ).toBeInTheDocument();
    });

    it('should show statistic unavailable when the stats API returns a non-200 status', async () => {
      global.fetch = createCpiStatsFetchHttpErrorMock(503);

      render(
        <MemoryRouter>
          <CPIResourceController />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByText('Statistic Temporarily Unavailable')).toBeInTheDocument();
      });
    });

    it('should show statistic unavailable when the stats fetch throws', async () => {
      global.fetch = jest.fn(() => Promise.reject(new Error('offline')));
      jest.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <MemoryRouter>
          <CPIResourceController />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByText('Statistic Temporarily Unavailable')).toBeInTheDocument();
      });
    });
  });
});
