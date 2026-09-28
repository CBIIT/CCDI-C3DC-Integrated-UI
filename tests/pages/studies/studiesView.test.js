import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useApolloClient } from '@apollo/client';
import StudiesView from '../../../src/pages/studies/studiesView';
import { table, GET_NUMBER_OF_STUDIES } from '../../../src/bento/studiesData';
import {
  applyStudiesTableLayout,
  resetStudiesTableColumnWidths,
  syncStudiesTableHeaderPadding,
} from '../../../src/pages/studies/studiesTableLayout';

const mockTableView = jest.fn(() => (
  <div>
    Studies table
    <div id="addScrollContainer" />
    <div id="tableContainer">
      <div className="MuiTableHead-root" />
    </div>
  </div>
));

jest.mock('@apollo/client', () => ({
  useApolloClient: jest.fn(),
}));

jest.mock('@bento-core/paginated-table', () => ({
  TableView: (props) => mockTableView(props),
}));

jest.mock('../../../src/pages/studies/studiesTableLayout', () => ({
  applyStudiesTableLayout: jest.fn(),
  syncStudiesTableHeaderPadding: jest.fn(),
  resetStudiesTableColumnWidths: jest.fn(),
}));

describe('StudiesView', () => {
  beforeEach(() => {
    mockTableView.mockClear();
    applyStudiesTableLayout.mockClear();
    resetStudiesTableColumnWidths.mockClear();
    syncStudiesTableHeaderPadding.mockClear();
    global.MutationObserver = class MutationObserver {
      observe() {}

      disconnect() {}
    };
    window.requestAnimationFrame = (callback) => {
      callback();
      return 1;
    };
    window.cancelAnimationFrame = jest.fn();
  });

  describe('Rendering and data requests', () => {
    it('should show loading and then render fetched studies', async () => {
      const rows = [{ study_id: 'phs002790' }, { study_id: 'phs003111' }];
      const query = jest
        .fn()
        .mockResolvedValueOnce({ data: { [table.paginationAPIField]: rows } })
        .mockResolvedValueOnce({ data: { numberOfStudies: 2 } });
      useApolloClient.mockReturnValue({ query });

      render(<StudiesView />);

      expect(screen.getByText('Loading studies...')).toBeInTheDocument();
      expect(await screen.findByText('Studies table')).toBeInTheDocument();
      expect(query).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          query: table.api,
          variables: expect.objectContaining({ first: 10000, offset: 0 }),
        }),
      );
      expect(query).toHaveBeenNthCalledWith(2, {
        query: GET_NUMBER_OF_STUDIES,
        variables: {},
      });
      expect(mockTableView).toHaveBeenCalledWith(
        expect.objectContaining({
          server: false,
          tblRows: rows,
          totalRowCount: 2,
        }),
      );
      const tableProps = mockTableView.mock.calls[0][0];
      expect(tableProps.initState({ persisted: true })).toEqual(
        expect.objectContaining({
          persisted: true,
          title: 'Studies Table',
          query: table.api,
          rowsPerPage: 50,
          page: 0,
        }),
      );
      expect(applyStudiesTableLayout).toHaveBeenCalled();
      expect(syncStudiesTableHeaderPadding).toHaveBeenCalled();

      window.dispatchEvent(new Event('resize'));
      expect(resetStudiesTableColumnWidths).toHaveBeenCalled();
      expect(window.cancelAnimationFrame).toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    it('should use the count query when the listing is empty', async () => {
      const query = jest
        .fn()
        .mockResolvedValueOnce({ data: {} })
        .mockResolvedValueOnce({ data: { numberOfStudies: 5 } });
      useApolloClient.mockReturnValue({ query });

      render(<StudiesView />);

      expect(await screen.findByText('Studies table')).toBeInTheDocument();
      expect(mockTableView).toHaveBeenCalledWith(
        expect.objectContaining({ tblRows: [], totalRowCount: 5 }),
      );
    });

    it('should stop loading without rendering a table when requests fail', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      useApolloClient.mockReturnValue({
        query: jest.fn().mockRejectedValue(new Error('network failure')),
      });

      render(<StudiesView />);

      await waitFor(() => {
        expect(screen.queryByText('Loading studies...')).not.toBeInTheDocument();
      });
      expect(consoleError).toHaveBeenCalledWith(
        'Error fetching studies:',
        expect.any(Error),
      );
      expect(screen.getByText('Studies table')).toBeInTheDocument();
      expect(mockTableView).toHaveBeenCalledWith(
        expect.objectContaining({ tblRows: [], totalRowCount: 0 }),
      );
      consoleError.mockRestore();
    });
  });
});
