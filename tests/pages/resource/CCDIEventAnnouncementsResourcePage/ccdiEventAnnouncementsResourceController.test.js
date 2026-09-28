/**
 * CCDIEventAnnouncementsResourceController — YAML fetch; empty until content exists.
 */

jest.mock('axios');
jest.mock('../../../../src/assets/about/Data_Usage_Policies_Header.png', () => 'header.png', { virtual: true });
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
import CCDIEventAnnouncementsResourceController from '../../../../src/pages/resource/CCDIEventAnnouncementsResourcePage/CCDIEventAnnouncementsResourceController';
import { createDedicatedYamlAxiosMock } from '../../../helpers/resourceYamlApiMocks';
import { minimalCcdiEventAnnouncementsResourceData } from '../../../fixtures/resource/resourceDataViewProps';

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
    createDedicatedYamlAxiosMock({
      '/resourceData.yaml': minimalCcdiEventAnnouncementsResourceData,
    }),
  );
});

afterEach(() => {
  document.querySelectorAll('footer').forEach((el) => el.remove());
  jest.clearAllMocks();
});

describe('CCDIEventAnnouncementsResourceController', () => {
  describe('Mocked axios (resourceData.yaml)', () => {
    it('should fetch YAML and render event announcements when content exists', async () => {
      render(
        <MemoryRouter>
          <CCDIEventAnnouncementsResourceController />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByText('CCDI Events Announcements')).toBeInTheDocument();
      });
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringMatching(/^https:\/\/static\.example\.com\/resourceData\.yaml\?ts=\d+$/),
      );
      expect(screen.getByText(/CCDI events intro for unit test/i)).toBeInTheDocument();
    });

    it('should render an empty div when YAML has no ccdiEventAnnouncementsContent', async () => {
      axios.get.mockImplementation(
        createDedicatedYamlAxiosMock({ '/resourceData.yaml': {} }),
      );
      const { container } = render(
        <MemoryRouter>
          <CCDIEventAnnouncementsResourceController />
        </MemoryRouter>,
      );
      await waitFor(() => {
        expect(axios.get).toHaveBeenCalled();
      });
      expect(screen.queryByText('CCDI Events Announcements')).not.toBeInTheDocument();
      expect(container.querySelector('div').textContent).toBe('');
    });
  });
});
