import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useSelector } from 'react-redux';
import InventoryController from '../../../src/pages/inventory/inventoryController';

let inventoryViewProps;

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('../../../src/pages/inventory/InventoryRouteSync', () => () => (
  <div>Route synchronization</div>
));
jest.mock('../../../src/pages/inventory/inventoryCover', () => () => (
  <div>Inventory cover</div>
));
jest.mock('../../../src/pages/inventory/inventoryView', () => (props) => {
  inventoryViewProps = props;
  return <div>Inventory view</div>;
});
jest.mock('../../../src/components/CohortSelectorState/CohortStateContext', () => ({
  CohortStateProvider: ({ children }) => <div>{children}</div>,
}));
jest.mock('../../../src/components/CohortModal/CohortModalContext', () => ({
  CohortModalProvider: ({ children }) => <div>{children}</div>,
}));

describe('InventoryController', () => {
  describe('Rendering', () => {
    it('should render route, cover, and inventory content from Redux state', () => {
      const state = {
        inventoryReducer: {
          activeFilters: { diagnosis: ['Leukemia'] },
          dashData: { participants: 42 },
        },
        statusReducer: {
          unknownAgesState: { age_at_diagnosis: 'exclude' },
        },
      };
      useSelector.mockImplementation((selector) => selector(state));

      render(<InventoryController />);

      expect(screen.getByText('Route synchronization')).toBeInTheDocument();
      expect(screen.getByText('Inventory cover')).toBeInTheDocument();
      expect(screen.getByText('Inventory view')).toBeInTheDocument();
      expect(inventoryViewProps).toEqual({
        activeFilters: state.inventoryReducer.activeFilters,
        dashData: state.inventoryReducer.dashData,
        unknownAgesState: state.statusReducer.unknownAgesState,
      });
    });
  });
});
