/**
 * MCIResourceController — axios GET mciData.yaml then MCIResourceView.
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
import MCIResourceController from '../../../../src/pages/resource/MCIResourcePage/MCIResourceController';
import { createDedicatedYamlAxiosMock } from '../../../helpers/resourceYamlApiMocks';
import { defaultMciViewData } from '../../../fixtures/resource/mciViewProps';

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
    createDedicatedYamlAxiosMock({ '/mciData.yaml': defaultMciViewData }),
  );
});

afterEach(() => {
  document.querySelectorAll('footer').forEach((el) => el.remove());
  jest.clearAllMocks();
});

describe('MCIResourceController', () => {
  describe('Mocked axios (mciData.yaml)', () => {
    it('should fetch mciData.yaml and render MCI content', async () => {
      render(
        <MemoryRouter>
          <MCIResourceController />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByText('Molecular Characterization Initiative')).toBeInTheDocument();
      });
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringMatching(/^https:\/\/static\.example\.com\/mciData\.yaml\?ts=\d+$/),
      );
      expect(screen.getByText(/Unit test intro for MCI resource page/i)).toBeInTheDocument();
    });
  });
});
