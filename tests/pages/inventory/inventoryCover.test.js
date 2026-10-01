const mockQuery = jest.fn(() => Promise.resolve({
  data: { searchParticipants: { numberOfParticipants: 3 } },
}));
const mockDispatch = jest.fn();
const mockNavigate = jest.fn();

jest.mock('@apollo/client', () => ({
  useApolloClient: () => ({ query: mockQuery }),
}));

jest.mock('../../../src/utils/graphqlClient', () => ({ query: jest.fn() }));
jest.mock('../../../src/store', () => ({
  dispatch: (...args) => mockDispatch(...args),
}));

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('@bento-core/facet-filter', () => ({
  updateFilterState: (state) => ({ type: 'FILTER', state }),
}));

jest.mock('@bento-core/local-find', () => ({
  updateUploadData: (data) => ({ type: 'UPLOAD', data }),
  updateAutocompleteData: (data) => ({ type: 'AUTO', data }),
  updateUploadMetadata: (data) => ({ type: 'META', data }),
  resetUploadData: () => ({ type: 'RESET_UPLOAD' }),
}));

jest.mock('../../../src/bento/dashboardTabData', () => ({ DASHBOARD_QUERY_NEW: {} }));
jest.mock('../../../src/bento/dashTemplate', () => ({
  queryParams: [
    'sex_at_birth', 'p_id', 'p_syn', 'u', 'u_fc', 'u_um', 'tab',
    'age_at_diagnosis', 'age_at_diagnosis_unknownAges', 'import_from',
  ],
}));

jest.mock('../../../src/pages/inventory/sideBar/BentoFilterUtils', () => ({
  parseParticipantAutocompleteFromUrl: (ids) => (
    ids ? ids.split('|').map((title) => ({ type: 'participantIds', title })) : []
  ),
}));

import React from 'react';
import { render, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import InventoryCover from '../../../src/pages/inventory/inventoryCover';

if (typeof global.MutationObserver === 'undefined') {
  global.MutationObserver = class {
    observe() {}
    disconnect() {}
    takeRecords() { return []; }
  };
}

if (!Object.getOwnPropertyDescriptor(URLSearchParams.prototype, 'size')) {
  Object.defineProperty(URLSearchParams.prototype, 'size', {
    get() { return Array.from(this.keys()).length; },
  });
}

const unknownAgesState = {};
const inventoryDefaults = {
  isDataloading: false,
  initialLoading: true,
  return_2_page: false,
  return_query_url: '',
  action_type: 'facet',
};

function renderCover(path, inventory = {}) {
  useSelector.mockImplementation((selector) => selector({
    inventoryReducer: {
      ...inventoryDefaults,
      ...inventory,
    },
    statusReducer: { unknownAgesState },
  }));
  return render(
    <MemoryRouter initialEntries={[path]}>
      <InventoryCover />
    </MemoryRouter>,
  );
}

describe('InventoryCover', () => {
  beforeEach(() => {
    mockQuery.mockClear();
    mockDispatch.mockClear();
    mockNavigate.mockClear();
    global.fetch = jest.fn();
    Object.keys(unknownAgesState).forEach((key) => {
      delete unknownAgesState[key];
    });
  });

  it('should parse URL filters and query the dashboard', async () => {
    renderCover('/exploreParticipants?sex_at_birth=Female&p_id=P1&age_at_diagnosis=0,10&age_at_diagnosis_unknownAges=exclude');
    await act(async () => {
      await Promise.resolve();
    });
    expect(mockQuery).toHaveBeenCalled();
    const vars = mockQuery.mock.calls[0][0].variables;
    expect(vars.sex_at_birth).toEqual(['Female']);
    expect(vars.participant_ids).toEqual(['P1']);
    expect(vars.age_at_diagnosis).toEqual([0, 10]);
    expect(vars.age_at_diagnosis_unknownAges).toEqual(['exclude']);
  });

  it('should restore the previous query when returning with an empty URL', () => {
    renderCover('/exploreParticipants', {
      return_2_page: true,
      return_query_url: '?sex_at_birth=Female',
    });
    expect(mockNavigate).toHaveBeenCalledWith('/exploreParticipants?sex_at_birth=Female');
  });

  it('should restore the previous query from a main-menu navigation', () => {
    useSelector.mockImplementation((selector) => selector({
      inventoryReducer: {
        ...inventoryDefaults,
        return_2_page: false,
        return_query_url: '?sex_at_birth=Male',
      },
      statusReducer: { unknownAgesState },
    }));
    render(
      <MemoryRouter initialEntries={[{ pathname: '/exploreParticipants', search: '', state: { navigationType: 'main_menu' } }]}>
        <InventoryCover />
      </MemoryRouter>,
    );
    expect(mockNavigate).toHaveBeenCalledWith('/exploreParticipants?sex_at_birth=Male');
  });

  it('should skip invalid age ranges and apply upload plus tab params', async () => {
    renderCover('/exploreParticipants?age_at_diagnosis=bad&u=P9|P10&u_fc=P9|P10&u_um=PX&tab=1');
    await act(async () => {
      await Promise.resolve();
    });
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockQuery).toHaveBeenCalled();
  });

  it('should import participant ids from import_from JSON', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve([{ participant_id: 'IMP1' }]),
    }));
    renderCover('/exploreParticipants?import_from=https://example.com/ids.json');
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(global.fetch).toHaveBeenCalledWith('https://example.com/ids.json');
  });

  it('should continue without import data when import_from fetch fails', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    global.fetch = jest.fn(() => Promise.reject(new Error('offline')));
    renderCover('/exploreParticipants?import_from=https://example.com/ids.json');
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('should skip the dashboard query when action_type is not facet', async () => {
    renderCover('/exploreParticipants?sex_at_birth=Female', { action_type: 'restore' });
    await act(async () => {
      await Promise.resolve();
    });
    expect(mockQuery).not.toHaveBeenCalled();
  });

  it('should update the URL when unknownAges filters change', async () => {
    unknownAgesState.age_at_diagnosis = 'exclude';
    const { unmount } = renderCover('/exploreParticipants?sex_at_birth=Female');
    await act(async () => {
      await Promise.resolve();
    });
    expect(mockNavigate).toHaveBeenCalled();
    unknownAgesState.age_at_diagnosis = 'include';
    unmount();
  });

  it('should apply upload ids without file-content metadata and skip empty dashboard results', async () => {
    mockQuery.mockResolvedValueOnce({ data: {} });
    renderCover('/exploreParticipants?u=P9|P10');
    await act(async () => {
      await Promise.resolve();
    });
    expect(mockQuery).toHaveBeenCalled();
  });

  it('should continue when import_from JSON is not an array', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve({ participant_id: 'IMP1' }),
    }));
    renderCover('/exploreParticipants?import_from=https://example.com/ids.json');
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(global.fetch).toHaveBeenCalled();
  });
});
