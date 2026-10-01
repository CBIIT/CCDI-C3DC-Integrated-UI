/**
 * PMTLResourceController — axios GET pmtlData.yaml then PMTLResourceView.
 */

jest.mock('axios');
jest.mock('../../../../src/utils/env', () => ({
  __esModule: true,
  default: {
    REACT_APP_STATIC_CONTENT_URL: 'https://static.example.com',
  },
}));

jest.mock('../../../../src/components/common/mapGenerator', () => (
  function MapViewMock() {
    return <div data-testid="map-view-mock" />;
  }
));

jest.mock('../../../../src/components/common/DonutChart', () => (
  function DonutChartMock() {
    return <div data-testid="donut-chart-mock" />;
  }
));

import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import PMTLResourceController from '../../../../src/pages/resource/PMTLResourcePage/PMTLResourceController';
import { createDedicatedYamlAxiosMock } from '../../../helpers/resourceYamlApiMocks';
import { defaultPmtlViewData } from '../../../fixtures/resource/pmtlViewProps';

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
    createDedicatedYamlAxiosMock({ '/pmtlData.yaml': defaultPmtlViewData }),
  );
});

afterEach(() => {
  document.querySelectorAll('footer').forEach((el) => el.remove());
  jest.clearAllMocks();
});

describe('PMTLResourceController', () => {
  describe('Mocked axios (pmtlData.yaml)', () => {
    it('should fetch pmtlData.yaml and render PMTL content', async () => {
      render(
        <MemoryRouter>
          <PMTLResourceController />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByText('Pediatric Molecular Target Lists')).toBeInTheDocument();
      });
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringMatching(/^https:\/\/static\.example\.com\/pmtlData\.yaml\?ts=\d+$/),
      );
      expect(screen.getByText(/Unit test intro for PMTL resource page/i)).toBeInTheDocument();
    });
  });
});
