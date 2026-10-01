jest.mock('../../../src/store', () => ({ dispatch: jest.fn() }));
jest.mock('../../../src/utils/graphqlClient', () => ({ query: jest.fn() }));
jest.mock('../../../src/pages/inventory/sideBar/BentoFilterUtils', () => ({
  getAllParticipantIds: jest.fn(),
  buildParticipantAutocompleteUrlParams: () => ({ p_id: 'P1', p_syn: '' }),
  getParticipantSearchSuggestions: jest.fn(),
}));
jest.mock('../../../src/bento/dashTemplate', () => ({
  resetIcon: {},
  sectionLabel: {},
}));
const mockFacetTemplate = {
  facetsConfig: [{ datafield: 'sex_at_birth', label: 'Sex' }],
  facetSectionVariables: { Demographics: { hasSearch: true } },
  queryParams: [],
  basePath: '/exploreParticipants',
};

jest.mock('../../../src/pages/inventory/useInventoryTemplate', () => ({
  useInventoryTemplate: () => mockFacetTemplate,
}));
jest.mock('@bento-core/util', () => ({ generateQueryStr: () => '' }));
jest.mock('@bento-core/local-find', () => {
  const generators = {};
  global.__newBentoFacetGenerators = generators;
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
  NewFacetFilter: ({ CustomFacetSection, CustomFacetView }) => (
    <div>
      New facet filter
      {CustomFacetSection ? <CustomFacetSection section={{ name: 'Demographics' }} expanded /> : null}
      {CustomFacetView ? <CustomFacetView facet={{ label: 'Sex' }} facetClasses="section" /> : null}
    </div>
  ),
}));
jest.mock('../../../src/pages/inventory/sideBar/NewFilterThemeConfig', () => ({ children }) => children);

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import NewBentoFacetFilter from '../../../src/pages/inventory/sideBar/NewBentoFacetFilter';
import {
  getAllParticipantIds,
  getParticipantSearchSuggestions,
} from '../../../src/pages/inventory/sideBar/BentoFilterUtils';

describe('NewBentoFacetFilter', () => {
  it('should hide the facet filter when no section is selected', () => {
    const { container } = render(
      <MemoryRouter>
        <NewBentoFacetFilter searchData={{}} activeFilters={{}} selectedSection={-1} />
      </MemoryRouter>,
    );
    expect(container).not.toHaveTextContent('New facet filter');
  });

  it('should render the facet filter for a selected section', () => {
    render(
      <MemoryRouter>
        <NewBentoFacetFilter searchData={{}} activeFilters={{}} selectedSection={0} />
      </MemoryRouter>,
    );
    expect(screen.getByText('New facet filter')).toBeInTheDocument();
  });

  it('should run generated search and upload helpers after render', async () => {
    render(
      <MemoryRouter>
        <NewBentoFacetFilter searchData={{}} activeFilters={{}} selectedSection={0} />
      </MemoryRouter>,
    );
    const navigate = jest.fn();
    global.__newBentoFacetGenerators.search.functions.updateBrowserUrl({}, navigate, []);
    expect(navigate).toHaveBeenCalled();

    getParticipantSearchSuggestions.mockResolvedValueOnce(['P1']);
    await expect(global.__newBentoFacetGenerators.search.functions.getSuggestions()).resolves.toEqual(['P1']);
    getParticipantSearchSuggestions.mockRejectedValueOnce(new Error('fail'));
    await expect(global.__newBentoFacetGenerators.search.functions.getSuggestions()).resolves.toEqual([]);

    global.__newBentoFacetGenerators.upload.functions.updateBrowserUrl(
      {},
      navigate,
      'ids.txt',
      'P1,\nP2',
      [{ participant_id: 'P1' }],
      ['P2'],
    );
    getAllParticipantIds.mockResolvedValueOnce([{ participant_id: 'P1' }]);
    const result = await global.__newBentoFacetGenerators.upload.functions.searchMatches(['P1', 'P9']);
    expect(result.matched).toEqual([{ participant_id: 'P1' }]);
    getAllParticipantIds.mockImplementationOnce(() => { throw new Error('boom'); });
    await expect(global.__newBentoFacetGenerators.upload.functions.searchMatches(['P1'])).resolves.toEqual({
      matched: [],
      unmatched: [],
    });
    expect(screen.getByText('Search view')).toBeInTheDocument();
    expect(screen.getByText('Sex')).toBeInTheDocument();
  });
});
