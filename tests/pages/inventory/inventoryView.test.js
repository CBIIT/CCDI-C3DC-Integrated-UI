jest.mock('../../../src/bento/dashTemplate', () => ({
  resetIcon: { src: 'a', srcActive: 'b', srcActiveHover: 'c', size: 10, alt: 'reset' },
  queryParams: ['sex_at_birth'],
  sectionLabel: { Demographics: 'Demographics' },
}));

jest.mock('@bento-core/facet-filter', () => ({
  ClearAllFiltersBtn: ({ Component }) => (
    <Component onClearAllFilters={jest.fn()} disable={false} />
  ),
}));

jest.mock('@bento-core/util', () => ({
  generateQueryStr: () => '',
}));

jest.mock('@bento-core/local-find', () => ({
  resetAllData: () => ({ type: 'RESET_ALL' }),
}));

jest.mock('../../../src/store', () => ({
  dispatch: jest.fn(),
}));

const mockInventoryTemplate = {
  facetsConfig: [
    { section: 'Demographics', datafield: 'sex_at_birth', type: 'checkbox' },
    { section: 'Diagnosis', datafield: 'age_at_diagnosis', type: 'slider' },
  ],
  basePath: '/exploreParticipants',
};

jest.mock('../../../src/pages/inventory/useInventoryTemplate', () => ({
  useInventoryTemplate: () => mockInventoryTemplate,
}));

jest.mock('../../../src/pages/inventory/sideBar/NewBentoFacetFilter', () => () => <div>Facet filter</div>);
jest.mock('../../../src/pages/inventory/widget/WidgetView', () => () => <div>Widgets</div>);
jest.mock('../../../src/components/Stats/StatsView', () => () => <div>Stats</div>);
jest.mock('../../../src/pages/inventory/tabs/TabsView', () => () => <div>Tabs</div>);
jest.mock('../../../src/pages/inventory/filterQueryBar/QueryBarView', () => () => <div>Query bar</div>);
jest.mock('../../../src/pages/inventory/sideBar/ExploreUserGuide.js', () => () => <div>Guide</div>);
jest.mock('../../../src/pages/inventory/sideBar/UserNotesButton.js', () => () => <div>Notes</div>);
jest.mock('../../../src/pages/inventory/switchNav/switchNav.js', () => () => <div>Switch</div>);

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import InventoryView from '../../../src/pages/inventory/inventoryView';

describe('InventoryView', () => {
  it('should show a spinner when dashboard data is missing', () => {
    render(
      <MemoryRouter>
        <InventoryView dashData={null} activeFilters={{}} />
      </MemoryRouter>,
    );
    expect(document.querySelector('.MuiCircularProgress-root')).toBeTruthy();
  });

  it('should render explore chrome and clear filters', () => {
    render(
      <MemoryRouter initialEntries={['/exploreParticipants?sex_at_birth=Female']}>
        <InventoryView
          dashData={{ numberOfParticipants: 2 }}
          activeFilters={{ sex_at_birth: ['Female'], age_at_diagnosis: [0, 10] }}
          unknownAgesState={{ age_at_diagnosis: 'exclude' }}
        />
      </MemoryRouter>,
    );
    expect(screen.getByText('Widgets')).toBeInTheDocument();
    expect(screen.getByText('Demographics')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'reset' }));
    expect(mockNavigate).toHaveBeenCalled();
    fireEvent.click(screen.getByText('Demographics'));
    expect(screen.getByAltText('vector')).toBeInTheDocument();
    fireEvent.click(screen.getByAltText('close'));
  });
});
