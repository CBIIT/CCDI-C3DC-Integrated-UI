jest.mock('@bento-core/tool-tip', () => ({ children }) => children);

jest.mock('use-reducer-logger', () => ({
  __esModule: true,
  default: (reducer) => reducer,
}));

jest.mock('../../../src/components/EllipsisText', () => ({
  EndEllipsisText: ({ text }) => <span>{text}</span>,
}));

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

if (typeof global.MutationObserver === 'undefined') {
  global.MutationObserver = class MutationObserver {
    disconnect() {}
    observe() {}
    takeRecords() { return []; }
  };
}
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CohortMetadata from '../../../src/components/CohortModal/components/CohortDetails/components/CohortMetadata';
import { CohortModalContext } from '../../../src/components/CohortModal/CohortModalContext';
import { CohortStateContext } from '../../../src/components/CohortSelectorState/CohortStateContext';

const theme = createMuiTheme();

const cohort = {
  cohortId: 'c1',
  cohortName: 'Alpha',
  cohortDescription: 'desc',
  participants: [{ id: '1', participant_id: 'P1', study_id: 'S1' }],
};

describe('CohortMetadata', () => {
  it('should edit name and description and push changes after debounce', async () => {
    const setCurrentCohortChanges = jest.fn();
    render(
      <ThemeProvider theme={theme}>
        <CohortStateContext.Provider value={{ state: { c1: cohort } }}>
          <CohortModalContext.Provider
            value={{
              selectedCohort: 'c1',
              currentCohortChanges: null,
              setCurrentCohortChanges,
              pendingNewCohort: null,
            }}
          >
            <CohortMetadata />
          </CohortModalContext.Provider>
        </CohortStateContext.Provider>
      </ThemeProvider>,
    );

    expect(screen.getByText(/PARTICIPANTS IDs \(1\)/)).toBeInTheDocument();
    fireEvent.click(screen.getByText('Alpha'));
    fireEvent.change(screen.getByDisplayValue('Alpha'), { target: { name: 'cohortName', value: 'Renamed' } });
    fireEvent.focus(screen.getByDisplayValue('desc'));
    fireEvent.change(screen.getByDisplayValue('desc'), { target: { name: 'cohortDescription', value: 'updated' } });
    await waitFor(() => {
      expect(setCurrentCohortChanges).toHaveBeenCalledWith(expect.objectContaining({
        cohortName: 'Renamed',
        cohortDescription: 'updated',
      }));
    });
  });
});
