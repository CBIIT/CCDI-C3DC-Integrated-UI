const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../../../src/pages/globalSearch/Cards', () => ({
  ParticipantCard: () => null,
  AboutCard: () => null,
  StudiesCard: () => null,
  SamplesCard: () => null,
  FilesCard: () => null,
  ModelsCard: () => null,
}));

let capturedSearchBarFunctions;
let capturedSearchResultsFunctions;

jest.mock('@bento-core/global-search', () => ({
  SearchBarGenerator: (opts) => {
    capturedSearchBarFunctions = opts.functions;
    return { SearchBar: () => <div>Search bar</div> };
  },
  SearchResultsGenerator: (opts) => {
    capturedSearchResultsFunctions = opts.functions;
    return {
      SearchResults: ({ searchText }) => <div>Results {searchText}</div>,
    };
  },
  countValues: jest.fn(() => 12),
}));

jest.mock('../../../src/bento/sitesearch', () => ({
  SEARCH_PAGE_KEYS: {
    private: ['gs_list', 'model_search'],
    public: [],
  },
  SEARCH_PAGE_DATAFIELDS: {
    private: ['autocomplete_list', 'node'],
    public: [],
  },
  queryCountAPI: jest.fn(() => Promise.resolve(
    require('../../fixtures/globalSearch/globalSearchApiResponses').globalSearchCountsFixture,
  )),
  queryAutocompleteAPI: jest.fn(() => Promise.resolve({})),
  queryResultAPI: jest.fn(() => Promise.resolve([])),
}));

jest.mock('../../../src/pages/globalSearch/globalSearchTabQuery', () => ({
  queryAllAPI: jest.fn(),
}));

import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import SearchView from '../../../src/pages/globalSearch/searchView';
import { queryAutocompleteAPI, queryCountAPI, queryResultAPI } from '../../../src/bento/sitesearch';
import { queryAllAPI } from '../../../src/pages/globalSearch/globalSearchTabQuery';

function renderSearch(path, props = {}) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="/sitesearch"
          element={(
            <SearchView
              isSignedIn={false}
              isAuthorized={false}
              publicAccessEnabled={false}
              {...props}
            />
          )}
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe('SearchView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    capturedSearchBarFunctions = undefined;
    capturedSearchResultsFunctions = undefined;
    global.MutationObserver = class MutationObserver {
      observe() {}

      disconnect() {}
    };
  });

  describe('Rendering', () => {
    it('should load tab counts from the keyword query param', async () => {
      renderSearch('/sitesearch?keyword=tumor');
      expect(screen.getByRole('heading', { name: /search results/i })).toBeInTheDocument();
      await waitFor(() => {
        expect(queryCountAPI).toHaveBeenCalledWith('tumor', true);
      });
      expect(screen.getByText('Results tumor')).toBeInTheDocument();
    });

    it('should skip counts when no keyword is present', async () => {
      renderSearch('/sitesearch');
      await waitFor(() => {
        expect(screen.getByText('Results')).toBeInTheDocument();
      });
      expect(queryCountAPI).not.toHaveBeenCalled();
    });
  });

  describe('Interactions', () => {
    it('should navigate when the search bar receives a new keyword', async () => {
      renderSearch('/sitesearch?keyword=alpha', { isSignedIn: true, isAuthorized: true });
      await waitFor(() => expect(capturedSearchBarFunctions.onChange).toBeDefined());
      capturedSearchBarFunctions.onChange('beta');
      expect(mockNavigate).toHaveBeenCalledWith('/sitesearch?keyword=beta');
    });

    it('should ignore empty or unchanged search values', async () => {
      renderSearch('/sitesearch?keyword=alpha');
      await waitFor(() => expect(capturedSearchBarFunctions.onChange).toBeDefined());
      capturedSearchBarFunctions.onChange('');
      capturedSearchBarFunctions.onChange('   ');
      capturedSearchBarFunctions.onChange('alpha');
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should assemble autocomplete suggestions for authorized users', async () => {
      queryAutocompleteAPI.mockResolvedValueOnce({
        gs_list: [{ autocomplete_list: 'PID1' }],
        model_search: [{ node: 'MODEL1' }],
      });
      renderSearch('/sitesearch', { isSignedIn: true, isAuthorized: true });
      await waitFor(() => expect(capturedSearchBarFunctions.getSuggestions).toBeDefined());
      let suggestions;
      await act(async () => {
        suggestions = await capturedSearchBarFunctions.getSuggestions({}, 'gene', '');
      });
      expect(queryAutocompleteAPI).toHaveBeenCalledWith('gene', false);
      expect(suggestions).toEqual(['GENE', 'PID1', 'MODEL1']);
    });

    it('should clear suggestions for blank input and no-op inactive tabs', async () => {
      renderSearch('/sitesearch?keyword=test', { isSignedIn: true, isAuthorized: false });
      await waitFor(() => expect(capturedSearchBarFunctions.getSuggestions).toBeDefined());
      await expect(capturedSearchBarFunctions.getSuggestions({}, '   ', '')).resolves.toEqual([]);
      await expect(capturedSearchBarFunctions.getSuggestions({}, null, 'clear')).resolves.toEqual([]);
      expect(() => capturedSearchResultsFunctions.onTabChange({}, 'inactive-2')).not.toThrow();
      capturedSearchResultsFunctions.onTabChange({}, '2');
    });

    it('should no-op inactive tabs for signed-in unauthorized users', async () => {
      renderSearch('/sitesearch?keyword=test', { isSignedIn: true, isAuthorized: false });
      await waitFor(() => expect(capturedSearchResultsFunctions.onTabChange).toBeDefined());
      expect(() => capturedSearchResultsFunctions.onTabChange({}, 'inactive-1')).not.toThrow();
    });

    it('should ignore non-string search values', async () => {
      renderSearch('/sitesearch?keyword=alpha');
      await waitFor(() => expect(capturedSearchBarFunctions.onChange).toBeDefined());
      capturedSearchBarFunctions.onChange(12);
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('getTabData', () => {
    it('should page a named tab through queryResultAPI', async () => {
      queryResultAPI.mockResolvedValue([{ id: 'p1' }, { id: 'p2' }]);
      renderSearch('/sitesearch?keyword=aml', { isAuthorized: true, publicAccessEnabled: true });
      await waitFor(() => expect(capturedSearchResultsFunctions.getTabData).toBeDefined());
      const rows = await capturedSearchResultsFunctions.getTabData('participants', 10, 1);
      expect(queryResultAPI).toHaveBeenCalledWith(
        'participants',
        { input: 'aml', first: 10, offset: 0 },
        true,
      );
      expect(rows).toEqual([{ id: 'p1' }, { id: 'p2' }]);
    });

    it('should fill the All tab from queryAllAPI until the page is full', async () => {
      queryAllAPI
        .mockResolvedValueOnce([{ id: 'a' }])
        .mockResolvedValueOnce([{ id: 'b' }]);
      renderSearch('/sitesearch?keyword=aml');
      await waitFor(() => expect(capturedSearchResultsFunctions.getTabData).toBeDefined());
      const rows = await capturedSearchResultsFunctions.getTabData('all', 2, 1);
      expect(queryAllAPI).toHaveBeenCalled();
      expect(rows).toEqual([{ id: 'a' }, { id: 'b' }]);
    });

    it('should return an empty page when result APIs yield no rows', async () => {
      queryResultAPI.mockResolvedValueOnce(null);
      queryAllAPI.mockResolvedValueOnce(null);
      renderSearch('/sitesearch?keyword=none');
      await waitFor(() => expect(capturedSearchResultsFunctions.getTabData).toBeDefined());
      await expect(capturedSearchResultsFunctions.getTabData('files', 10, 1)).resolves.toEqual([]);
      await expect(capturedSearchResultsFunctions.getTabData('all', 10, 1)).resolves.toEqual([]);
    });

    it('should keep filling the All tab while later pages still have room', async () => {
      const { countValues } = require('@bento-core/global-search');
      countValues.mockReturnValue(5);
      queryAllAPI
        .mockResolvedValueOnce([{ id: 'a' }])
        .mockResolvedValueOnce([{ id: 'b' }])
        .mockResolvedValueOnce([{ id: 'c' }]);
      renderSearch('/sitesearch?keyword=aml');
      await waitFor(() => expect(capturedSearchResultsFunctions.getTabData).toBeDefined());
      const rows = await capturedSearchResultsFunctions.getTabData('all', 3, 1);
      expect(rows).toHaveLength(3);
    });
  });

  describe('counts', () => {
    it('should clear counts when the count request fails', async () => {
      queryCountAPI.mockRejectedValueOnce(new Error('offline'));
      renderSearch('/sitesearch?keyword=fail');
      await waitFor(() => {
        expect(queryCountAPI).toHaveBeenCalled();
      });
      expect(screen.getByText('Results fail')).toBeInTheDocument();
    });

    it('should treat a null count payload as empty counts', async () => {
      queryCountAPI.mockResolvedValueOnce(null);
      renderSearch('/sitesearch?keyword=empty');
      await waitFor(() => {
        expect(queryCountAPI).toHaveBeenCalled();
      });
    });

    it('should cancel an in-flight count request on unmount', async () => {
      let resolveCount;
      queryCountAPI.mockImplementationOnce(() => new Promise((resolve) => {
        resolveCount = resolve;
      }));
      const { unmount } = renderSearch('/sitesearch?keyword=slow');
      unmount();
      await resolveCount({ participant_count: 1 });
    });

    it('should assemble public autocomplete suggestions', async () => {
      queryAutocompleteAPI.mockResolvedValueOnce({
        public_list: [{ public_field: 'PUB1' }],
      });
      const sitesearch = require('../../../src/bento/sitesearch');
      sitesearch.SEARCH_PAGE_KEYS.public = ['public_list'];
      sitesearch.SEARCH_PAGE_DATAFIELDS.public = ['public_field'];
      renderSearch('/sitesearch', { isSignedIn: false, isAuthorized: false, publicAccessEnabled: false });
      await waitFor(() => expect(capturedSearchBarFunctions.getSuggestions).toBeDefined());
      let suggestions;
      await act(async () => {
        suggestions = await capturedSearchBarFunctions.getSuggestions({}, 'gene', '');
      });
      expect(suggestions).toEqual(['GENE', 'PUB1']);
    });
  });
});
