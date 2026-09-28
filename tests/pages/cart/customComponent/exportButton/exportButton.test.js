jest.mock('../../../../../src/utils/graphqlClient', () => ({
  query: jest.fn(),
}));

jest.mock('@apollo/client', () => ({
  useQuery: jest.fn(),
}));

jest.mock('../../../../../src/pages/cart/customComponent/exportButton/util/downloadJson', () => {
  const actual = jest.requireActual('../../../../../src/pages/cart/customComponent/exportButton/util/downloadJson');
  return {
    ...actual,
    downloadJson: jest.fn(),
  };
});

jest.mock('@bento-core/tool-tip', () => ({ children }) => children);

import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useQuery } from '@apollo/client';
import client from '../../../../../src/utils/graphqlClient';
import { downloadJson } from '../../../../../src/pages/cart/customComponent/exportButton/util/downloadJson';
import ExportButton from '../../../../../src/pages/cart/customComponent/exportButton/exportButton';
import { cartFileIds, cartManifestRow } from '../../../../fixtures/cart/cartFiles';

describe('ExportButtonView', () => {
  let windowOpenSpy;

  beforeAll(() => {
    global.MutationObserver = class MutationObserver {
      observe() {}

      disconnect() {}
    };
    document.createRange = () => ({
      setStart: () => {},
      setEnd: () => {},
      commonAncestorContainer: document.body,
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    useQuery.mockImplementation((_doc, options) => {
      if (options && options.skip) {
        return { data: undefined };
      }
      return { data: { storeManifest: 'https://interop.example/stored-manifest-token' } };
    });
    client.query.mockResolvedValue({
      data: { filesManifestInList: [cartManifestRow] },
    });
    windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
  });

  afterEach(() => {
    windowOpenSpy.mockRestore();
  });

  describe('Rendering', () => {
    it('should disable the trigger when the cart has no files', async () => {
      render(<ExportButton filesId={[]} />);
      await waitFor(() => {
        expect(client.query).toHaveBeenCalledWith(expect.objectContaining({
          variables: { file_ids: [] },
        }));
      });
      expect(screen.getByRole('button', { name: /available export options/i })).toBeDisabled();
    });

    it('should enable the trigger after files load', async () => {
      render(<ExportButton filesId={cartFileIds} />);
      await waitFor(() => {
        expect(client.query).toHaveBeenCalled();
      });
      expect(screen.getByRole('button', { name: /available export options/i })).not.toBeDisabled();
    });
  });

  describe('Interactions', () => {
    async function openMenu() {
      render(<ExportButton filesId={cartFileIds} />);
      await waitFor(() => {
        expect(client.query).toHaveBeenCalled();
      });
      fireEvent.click(screen.getByRole('button', { name: /available export options/i }));
      expect(await screen.findByText('Download Manifest')).toBeInTheDocument();
    }

    it('should download a manifest from the dropdown', async () => {
      await openMenu();
      fireEvent.click(screen.getByText('Download Manifest'));
      expect(downloadJson).toHaveBeenCalledWith(
        expect.objectContaining({ filesManifestInList: [cartManifestRow] }),
        '',
        'CCDI Hub File Manifest',
        expect.objectContaining({
          keysToInclude: expect.arrayContaining(['guid', 'file_name']),
        }),
      );
    });

    it('should open Cancer Genomics Cloud with the stored manifest URL', async () => {
      await openMenu();
      fireEvent.click(screen.getByText('Export to Cancer Genomics Cloud'));
      expect(windowOpenSpy).toHaveBeenCalledWith(
        expect.stringContaining(encodeURIComponent('https://interop.example/stored-manifest-token')),
        '_blank',
      );
    });

    it('should close the menu on Tab and ignore clicks on the trigger', async () => {
      await openMenu();
      fireEvent.keyDown(screen.getByRole('menu'), { key: 'Tab' });
      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /available export options/i }));
      expect(await screen.findByRole('menu')).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: /available export options/i }));
    });
  });

  describe('Edge cases', () => {
    it('should skip storing a manifest when MY_CART returns no files', async () => {
      client.query.mockResolvedValue({ data: { filesManifestInList: [] } });
      render(<ExportButton filesId={cartFileIds} />);
      await waitFor(() => {
        expect(client.query).toHaveBeenCalled();
      });
      expect(useQuery).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ skip: true }),
      );
    });
  });
});
