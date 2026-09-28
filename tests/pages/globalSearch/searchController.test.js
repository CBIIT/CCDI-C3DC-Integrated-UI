import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchController from '../../../src/pages/globalSearch/searchController';

jest.mock('../../../src/components/CohortSelectorState/CohortStateContext', () => ({
  CohortStateProvider: ({ children }) => (
    <div data-testid="cohort-state-provider">{children}</div>
  ),
}));

jest.mock('../../../src/pages/globalSearch/searchView', () => () => (
  <div>Global Search view</div>
));

describe('SearchController', () => {
  describe('Rendering', () => {
    it('should render the routed search view within cohort state', () => {
      render(<SearchController />);

      expect(screen.getByText('Global Search view')).toBeInTheDocument();
      expect(screen.getByTestId('cohort-state-provider')).toContainElement(
        screen.getByText('Global Search view'),
      );
    });
  });
});
