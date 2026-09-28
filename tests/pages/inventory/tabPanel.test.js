jest.mock('../../../src/pages/inventory/tabs/wrapperConfig/Wrapper', () => ({
  configWrapper: () => [],
  wrapperConfig: [],
}));
jest.mock('../../../src/pages/inventory/tabs/wrapperConfig/Theme', () => ({ customTheme: {} }));
jest.mock('../../../src/pages/inventory/tabs/tableConfig/Theme', () => ({ themeConfig: {} }));
jest.mock('../../../src/pages/inventory/tabs/tableConfig/Column', () => ({
  configColumn: (columns) => columns,
}));
jest.mock('../../../src/bento/dashTemplate', () => ({ queryParams: [] }));
jest.mock('../../../src/bento/dashboardTabData', () => ({ GET_FILENAMES_QUERY: { kind: 'filenames' } }));

const mockCaptured = { current: null };

jest.mock('@bento-core/paginated-table', () => {
  const React = require('react');
  return {
    TableContextProvider: ({ children }) => children,
    Wrapper: ({ children, activeFilters }) => (
      <div data-filters={JSON.stringify(activeFilters)}>{children}</div>
    ),
    TableView: (props) => {
      mockCaptured.current = props;
      return (
        <div>
          <div>Table {props.queryVariables.filename || 'ready'}</div>
          {props.onSearch && (
            <button type="button" onClick={() => props.onSearch('bam')}>Search files</button>
          )}
          {props.onSearchResultCount && (
            <button type="button" onClick={() => props.onSearchResultCount(3)}>Set count</button>
          )}
          {props.onColumnStateChange && (
            <button type="button" onClick={() => props.onColumnStateChange([{ id: 'c1' }])}>Set columns</button>
          )}
          {props.navigation && (
            <button type="button" onClick={() => props.navigation('/studies/x')}>Go</button>
          )}
        </div>
      );
    },
  };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import TabPanel from '../../../src/pages/inventory/tabs/TabPanel';

describe('TabPanel', () => {
  it('should merge unknown ages into table filters and search files', () => {
    render(
      <MemoryRouter>
        <TabPanel
          config={{
            name: 'Files',
            tableID: 'files-table',
            paginationAPIField: 'fileOverview',
            dataKey: 'id',
            count: 'numberOfFiles',
            columns: [],
            api: { kind: 'files' },
            enableRowSelection: true,
            tableMsg: {},
            defaultSortField: 'file_name',
            defaultSortDirection: 'asc',
            extendedViewConfig: {},
          }}
          tab={{ downloadFileName: 'files.csv' }}
          dashboardStats={{ numberOfFiles: 8 }}
          activeFilters={{ sex_at_birth: ['Female'] }}
          unknownAgesState={{ age_at_diagnosis: 'exclude' }}
          activeTab
        />
      </MemoryRouter>,
    );
    const filters = JSON.parse(document.querySelector('[data-filters]').getAttribute('data-filters'));
    expect(filters.age_at_diagnosis_unknownAges).toEqual(['exclude']);
    fireEvent.click(screen.getByText('Search files'));
    expect(screen.getByText('Table bam')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Set count'));
    fireEvent.click(screen.getByText('Set columns'));
    fireEvent.click(screen.getByText('Go'));
    expect(mockNavigate).toHaveBeenCalledWith('/studies/x');
  });
});
