const mockNavigate = jest.fn();
const mockDispatch = jest.fn();
const mockStoreDispatch = jest.fn();

const mockReduxState = {
  inventoryReducer: { importFromData: [] },
  statusReducer: { filterState: { sex_at_birth: ['Female'] } },
  localFind: {
    autocomplete: [{ type: 'participantIds', title: 'P1' }],
    upload: [],
  },
};

jest.mock('react-redux', () => ({
  connect: (map) => (Comp) => (props) => {
    const mapped = map(mockReduxState);
    return require('react').createElement(Comp, { ...mapped, ...props });
  },
  useDispatch: () => mockDispatch,
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../../../src/store', () => ({
  dispatch: (...args) => mockStoreDispatch(...args),
}));

jest.mock('@bento-core/util', () => ({
  generateQueryStr: () => '',
}));

jest.mock('@bento-core/facet-filter', () => ({
  clearAllFilters: () => ({ type: 'CLEAR_ALL' }),
  clearFacetSection: (section) => ({ type: 'CLEAR_SECTION', section }),
  clearSliderSection: (section) => ({ type: 'CLEAR_SLIDER', section }),
  toggleCheckBox: (payload) => ({ type: 'TOGGLE', payload }),
}));

jest.mock('@bento-core/local-find', () => ({
  resetAllData: () => ({ type: 'RESET_ALL' }),
  resetUploadData: () => ({ type: 'RESET_UPLOAD' }),
  updateAutocompleteData: (data) => ({ type: 'AUTO', data }),
}));

jest.mock('../../../src/components/Inventory/InventoryState', () => ({
  updateImportfrom: (url, data) => ({ type: 'IMP', url, data }),
}));

jest.mock('../../../src/pages/inventory/sideBar/BentoFilterUtils', () => ({
  buildParticipantAutocompleteUrlParams: () => ({ p_id: '', p_syn: '' }),
}));

const mockQueryBarTemplate = {
  basePath: '/exploreParticipants',
  queryParams: ['sex_at_birth', 'age_at_diagnosis', 'age_at_diagnosis_unknownAges', 'import_from', 'u', 'p_id'],
};

jest.mock('../../../src/pages/inventory/useInventoryTemplate', () => ({
  useInventoryTemplate: () => mockQueryBarTemplate,
}));

jest.mock('../../../src/bento/dashTemplate', () => ({
  facetsExploreFilesConfig: [],
  facetsParticipantsConfig: [
    { datafield: 'sex_at_birth', apiForFiltering: 'sex' },
    { datafield: 'age_at_diagnosis', apiForFiltering: 'age' },
  ],
}));

const mockFns = {};
jest.mock('@bento-core/query-bar', () => ({
  QueryBarGenerator: (cfg) => {
    Object.assign(mockFns, cfg.functions);
    const React = require('react');
    return {
      QueryBar: () => React.createElement('div', null,
        React.createElement('button', { type: 'button', onClick: () => cfg.functions.clearAll() }, 'clearAll'),
        React.createElement('button', { type: 'button', onClick: () => cfg.functions.clearImportFrom() }, 'clearImportFrom'),
        React.createElement('button', { type: 'button', onClick: () => cfg.functions.clearUpload() }, 'clearUpload'),
        React.createElement('button', { type: 'button', onClick: () => cfg.functions.clearAutocomplete() }, 'clearAutocomplete'),
        React.createElement('button', { type: 'button', onClick: () => cfg.functions.deleteAutocompleteItem({ title: 'P1' }) }, 'deleteItem'),
        React.createElement('button', { type: 'button', onClick: () => cfg.functions.resetFacetSection({ datafield: 'sex_at_birth' }) }, 'resetSection'),
        React.createElement('button', { type: 'button', onClick: () => cfg.functions.resetFacetSlider({ datafield: 'age_at_diagnosis' }) }, 'resetSlider'),
        React.createElement('button', { type: 'button', onClick: () => cfg.functions.resetFacetSlider({ isUnknownAges: true, parentDatafield: 'age_at_diagnosis' }) }, 'resetUnknownSlider'),
        React.createElement('button', { type: 'button', onClick: () => cfg.functions.resetUnknownAges({ parentDatafield: 'age_at_diagnosis' }) }, 'resetUnknownAges'),
        React.createElement('button', { type: 'button', onClick: () => cfg.functions.resetFacetCheckbox({ datafield: 'sex_at_birth', items: ['Female'] }, 'Female') }, 'resetCheckbox'),
      ),
    };
  },
}));

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import QueryBarView from '../../../src/pages/inventory/filterQueryBar/QueryBarView';

describe('QueryBarView', () => {
  it('should invoke clear and reset handlers', () => {
    render(
      <MemoryRouter>
        <QueryBarView data={{ sex: [] }} unknownAgesState={{ age_at_diagnosis: 'exclude' }} />
      </MemoryRouter>,
    );
    [
      'clearAll', 'clearImportFrom', 'clearUpload', 'clearAutocomplete',
      'deleteItem', 'resetSection', 'resetSlider', 'resetUnknownSlider',
      'resetUnknownAges', 'resetCheckbox',
    ].forEach((label) => {
      fireEvent.click(screen.getByText(label));
    });
    expect(mockNavigate).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalled();
  });
});
