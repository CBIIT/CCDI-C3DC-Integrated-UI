jest.mock('../../../src/store', () => ({ dispatch: jest.fn() }));
jest.mock('../../../src/utils/graphqlClient', () => ({ query: jest.fn() }));
jest.mock('../../../src/pages/inventory/sideBar/BentoFilterUtils', () => ({
  getAllParticipantIds: jest.fn(),
  buildParticipantAutocompleteUrlParams: () => ({ p_id: 'P1', p_syn: '' }),
  getParticipantSearchSuggestions: jest.fn(),
}));
jest.mock('../../../src/bento/dashTemplate', () => ({
  resetIcon: { src: 'a', srcActive: 'b', srcActiveHover: 'c', size: 10, alt: 'reset' },
  sectionLabel: {},
  facetsConfig: [],
  queryParams: [],
  facetSectionVariables: { Demographics: { hasSearch: true } },
}));
jest.mock('../../../src/pages/inventory/useInventoryTemplate', () => ({
  useInventoryTemplate: () => ({
    facetsConfig: [],
    facetSectionVariables: { Demographics: { hasSearch: true } },
    queryParams: [],
    basePath: '/exploreParticipants',
  }),
}));
jest.mock('@bento-core/util', () => ({ generateQueryStr: () => '' }));
jest.mock('@bento-core/local-find', () => {
  const generators = {};
  global.__bentoFacetGenerators = generators;
  return {
    resetAllData: jest.fn(),
    chunkSplit: (arr) => [arr],
    SearchView: () => <div>Search view</div>,
    SearchBoxGenerator: (opts) => {
      generators.search = opts;
      return { SearchBox: () => <div>Search box</div> };
    },
    UploadModalGenerator: (opts) => {
      generators.upload = opts;
      return { UploadModal: () => <div>Upload</div> };
    },
  };
});
jest.mock('@bento-core/facet-filter', () => ({
  FacetFilter: ({ CustomFacetSection, CustomFacetView }) => (
    <div>
      Legacy facet filter
      {CustomFacetSection ? <CustomFacetSection section={{ name: 'Demographics' }} expanded /> : null}
      {CustomFacetView ? <CustomFacetView facet={{ label: 'Sex' }} facetClasses="section" /> : null}
    </div>
  ),
  ClearAllFiltersBtn: ({ Component }) => (
    <Component onClearAllFilters={jest.fn()} disable={false} />
  ),
}));
jest.mock('../../../src/pages/inventory/sideBar/FilterThemeConfig', () => ({ children }) => children);

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import BentoFacetFilter from '../../../src/pages/inventory/sideBar/BentoFacetFilter';
import {
  getAllParticipantIds,
  getParticipantSearchSuggestions,
} from '../../../src/pages/inventory/sideBar/BentoFilterUtils';

describe('BentoFacetFilter', () => {
  it('should render the legacy facet filter', () => {
    render(
      <MemoryRouter>
        <BentoFacetFilter searchData={{}} activeFilters={{}} />
      </MemoryRouter>,
    );
    expect(screen.getByText('Legacy facet filter')).toBeInTheDocument();
  });

  it('should update the browser URL and return suggestions from the generated search box', async () => {
    const navigate = jest.fn();
    global.__bentoFacetGenerators.search.functions.updateBrowserUrl({}, navigate, []);
    expect(navigate).toHaveBeenCalledWith(expect.stringContaining('/exploreParticipants'));

    getParticipantSearchSuggestions.mockResolvedValueOnce(['P1']);
    await expect(global.__bentoFacetGenerators.search.functions.getSuggestions()).resolves.toEqual(['P1']);
    getParticipantSearchSuggestions.mockRejectedValueOnce(new Error('fail'));
    await expect(global.__bentoFacetGenerators.search.functions.getSuggestions()).resolves.toEqual([]);
  });

  it('should match uploaded participant ids through the generated upload modal', async () => {
    const navigate = jest.fn();
    global.__bentoFacetGenerators.upload.functions.updateBrowserUrl(
      {},
      navigate,
      'ids.txt',
      'P1,\nP2\r',
      [{ participant_id: 'P1' }],
      ['P2'],
    );
    expect(navigate).toHaveBeenCalled();

    getAllParticipantIds.mockResolvedValueOnce([{ participant_id: 'P1' }]);
    const result = await global.__bentoFacetGenerators.upload.functions.searchMatches(['P1', 'P9']);
    expect(result.matched).toEqual([{ participant_id: 'P1' }]);
    expect(result.unmatched).toContain('P9');

    getAllParticipantIds.mockImplementationOnce(() => { throw new Error('boom'); });
    await expect(global.__bentoFacetGenerators.upload.functions.searchMatches(['P1'])).resolves.toEqual({
      matched: [],
      unmatched: [],
    });

    getAllParticipantIds.mockRejectedValueOnce(new Error('rejected'));
    await expect(global.__bentoFacetGenerators.upload.functions.searchMatches(['P1'])).resolves.toEqual({
      matched: [],
      unmatched: ['P1'],
    });
  });

  it('should clear all filters and show the local-find search panel', () => {
    render(
      <MemoryRouter>
        <BentoFacetFilter searchData={{}} activeFilters={{}} />
      </MemoryRouter>,
    );
    expect(screen.getByText('Search view')).toBeInTheDocument();
    expect(screen.getByText('Sex')).toBeInTheDocument();
    const clear = screen.getByRole('button', { name: /reset|clear/i });
    fireEvent.mouseEnter(clear);
    fireEvent.mouseLeave(clear);
    fireEvent.click(clear);
    expect(screen.getByText(/Clear all filtered selections/i)).toBeInTheDocument();
  });
});
