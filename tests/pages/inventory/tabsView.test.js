const mockNavigate = jest.fn();
const mockDispatch = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('react-redux', () => ({
  connect: (map) => (Comp) => (props) => {
    const mapped = map({
      inventoryReducer: { exploreMode: 'participants', tabParticipants: 0, tabFiles: 1 },
    });
    return require('react').createElement(Comp, { ...mapped, ...props });
  },
  useDispatch: () => mockDispatch,
}));

jest.mock('@bento-core/util', () => ({
  generateQueryStr: () => '?tab_participants=1',
}));

jest.mock('../../../src/bento/dashTemplate', () => ({ queryParams: ['tab_participants'] }));
jest.mock('../../../src/bento/dashboardTabData', () => ({
  tabResponsiveBreakpoints: {},
}));
jest.mock('../../../src/pages/inventory/tabs/TabPanel', () => () => <div>Panel</div>);
jest.mock('../../../src/components/CohortModal/CohortModal', () => () => <div>Modal</div>);
jest.mock('../../../src/components/CohortModal/CohortModalContext', () => {
  const React = require('react');
  return {
    CohortModalContext: React.createContext({
      showCohortModal: false,
      setShowCohortModal: jest.fn(),
    }),
  };
});
jest.mock('@bento-core/tab', () => ({
  Tabs: ({ handleTabChange, tabItems }) => (
    <div>
      <span>{tabItems[0].count}</span>
      <button type="button" onClick={(e) => handleTabChange(e, 1)}>Switch tab</button>
    </div>
  ),
}));
const mockInventoryTemplate = {
  mode: 'participants',
  basePath: '/exploreParticipants',
  tabItems: [{ name: 'Participants', count: 'numberOfParticipants', tableID: 'p' }],
};

jest.mock('../../../src/pages/inventory/useInventoryTemplate', () => ({
  useInventoryTemplate: () => mockInventoryTemplate,
}));
jest.mock('../../../src/components/Inventory/InventoryState', () => ({
  changeTab: (p, f, a) => ({ type: 'change_tab', p, f, a }),
}));

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import TabsView from '../../../src/pages/inventory/tabs/TabsView';

describe('TabsView', () => {
  it('should format tab counts and dispatch tab changes', () => {
    render(
      <MemoryRouter>
        <TabsView dashboardStats={{ numberOfParticipants: 1200 }} />
      </MemoryRouter>,
    );
    expect(screen.getByText('(1,200)')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Switch tab'));
    expect(mockNavigate).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'change_tab', p: 1, f: 0, a: 'not-facet' });
  });
});
