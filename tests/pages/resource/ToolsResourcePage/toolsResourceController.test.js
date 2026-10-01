/**
 * ToolsResourceController — axios GET resourceData.yaml, js-yaml.safeLoad, view if toolsContent.
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
import yaml from 'js-yaml';
import ToolsResourceController from '../../../../src/pages/resource/ToolsResourcePage/ToolsResourceController';
import { createDedicatedYamlAxiosMock } from '../../../helpers/resourceYamlApiMocks';
import { minimalToolsResourceData } from '../../../fixtures/resource/resourceDataViewProps';

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
    createDedicatedYamlAxiosMock({ '/resourceData.yaml': minimalToolsResourceData }),
  );
});

afterEach(() => {
  document.querySelectorAll('footer').forEach((el) => el.remove());
  jest.clearAllMocks();
});

describe('ToolsResourceController', () => {
  describe('Mocked axios (resourceData.yaml)', () => {
    it('should request resourceData.yaml and render tools content', async () => {
      render(
        <MemoryRouter>
          <ToolsResourceController />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByText('Tools')).toBeInTheDocument();
      });
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringMatching(/^https:\/\/static\.example\.com\/resourceData\.yaml\?ts=\d+$/),
      );
      expect(screen.getByText(/Tools intro for unit test/i)).toBeInTheDocument();
    });

    it('should parse YAML with js-yaml.safeLoad', async () => {
      const safeLoadSpy = jest.spyOn(yaml, 'safeLoad');
      render(
        <MemoryRouter>
          <ToolsResourceController />
        </MemoryRouter>,
      );
      await waitFor(() => {
        expect(safeLoadSpy).toHaveBeenCalled();
      });
      safeLoadSpy.mockRestore();
    });

    it('should render an empty div when YAML has no toolsContent', async () => {
      axios.get.mockImplementation(
        createDedicatedYamlAxiosMock({ '/resourceData.yaml': { title: 'Tools' } }),
      );
      const { container } = render(
        <MemoryRouter>
          <ToolsResourceController />
        </MemoryRouter>,
      );
      await waitFor(() => {
        expect(axios.get).toHaveBeenCalled();
      });
      expect(screen.queryByText('Tools')).not.toBeInTheDocument();
      expect(container.querySelector('div').textContent).toBe('');
    });

    it('should keep the empty state when axios rejects', async () => {
      axios.get.mockRejectedValue(new Error('network'));
      const { container } = render(
        <MemoryRouter>
          <ToolsResourceController />
        </MemoryRouter>,
      );
      await waitFor(() => {
        expect(axios.get).toHaveBeenCalled();
      });
      expect(container.querySelector('div').textContent).toBe('');
    });
  });
});
