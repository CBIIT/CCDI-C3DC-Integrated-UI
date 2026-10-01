jest.mock('../../../../../../src/utils/graphqlClient', () => ({
  query: jest.fn(),
}));

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import gql from 'graphql-tag';
import client from '../../../../../../src/utils/graphqlClient';
import { getDataTest, getManifestData } from '../../../../../../src/pages/cart/customComponent/exportButton/util/TableService';

const MANIFEST_QUERY = gql`
  query ManifestRows($file_ids: [String]) {
    cohortManifest {
      guid
    }
  }
`;

function Harness({ filesId }) {
  const { data } = getManifestData(MANIFEST_QUERY, filesId);
  return <div>{data ? JSON.stringify(data) : 'pending'}</div>;
}

describe('TableService getManifestData', () => {
  beforeAll(() => {
    global.MutationObserver = class MutationObserver {
      observe() {}

      disconnect() {}
    };
  });
  beforeEach(() => {
    client.query.mockReset();
  });

  describe('Side effects', () => {
    it('should query file IDs and expose the response', async () => {
      client.query.mockResolvedValue({
        data: { cohortManifest: [{ guid: 'g1' }] },
      });

      render(<Harness filesId={['id1']} />);

      expect(await screen.findByText(/cohortManifest/)).toBeInTheDocument();
      expect(client.query).toHaveBeenCalledWith({
        query: MANIFEST_QUERY,
        variables: { file_ids: ['id1'] },
      });
    });
  });

  describe('Edge cases', () => {
    it('should keep pending state when the query returns no data', async () => {
      client.query.mockResolvedValue({});
      render(<Harness filesId={[]} />);
      await waitFor(() => {
        expect(client.query).toHaveBeenCalled();
      });
      expect(screen.getByText('pending')).toBeInTheDocument();
      expect(getDataTest).toBe('');
    });
  });
});
