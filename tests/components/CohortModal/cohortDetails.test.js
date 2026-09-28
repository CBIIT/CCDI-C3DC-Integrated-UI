jest.mock('@bento-core/tool-tip', () => ({ children }) => children);

jest.mock('use-reducer-logger', () => ({
  __esModule: true,
  default: (reducer) => reducer,
}));

jest.mock('../../../src/components/EllipsisText', () => ({
  EndEllipsisText: ({ text }) => <span>{text}</span>,
}));

jest.mock('../../../src/components/CohortModal/components/CohortDetails/components/ParticipantList', () => ({
  __esModule: true,
  default: ({ handleSave, closeModal }) => (
    <div>
      <button type="button" onClick={handleSave}>Save Changes</button>
      <button type="button" onClick={closeModal}>Cancel</button>
    </div>
  ),
}));

jest.mock('../../../src/components/CohortModal/components/CohortDetails/components/ActionButtons', () => () => (
  <div>Actions</div>
));

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CohortDetails from '../../../src/components/CohortModal/components/CohortDetails/CohortDetails';
import { CohortModalContext } from '../../../src/components/CohortModal/CohortModalContext';
import { CohortStateContext } from '../../../src/components/CohortSelectorState/CohortStateContext';

const theme = createMuiTheme();

const cohort = {
  cohortId: 'c1',
  cohortName: 'Alpha',
  cohortDescription: 'desc',
  participants: [{ id: '1', participant_id: 'P1', study_id: 'S1' }],
  lastUpdated: '2026-01-01T00:00:00.000Z',
};

function renderDetails(overrides = {}) {
  const dispatch = jest.fn();
  const showAlert = jest.fn();
  const clearCurrentCohortChanges = jest.fn();
  const clearPendingNewCohort = jest.fn();
  const setSelectedCohort = jest.fn();
  const setCurrentCohortChanges = jest.fn();
  const closeModal = jest.fn();

  const utils = render(
    <ThemeProvider theme={theme}>
      <CohortStateContext.Provider value={{ state: { c1: cohort }, dispatch }}>
        <CohortModalContext.Provider
          value={{
            selectedCohort: 'c1',
            currentCohortChanges: null,
            setCurrentCohortChanges,
            showAlert,
            clearCurrentCohortChanges,
            pendingNewCohort: null,
            clearPendingNewCohort,
            setSelectedCohort,
            ...overrides,
          }}
        >
          <CohortDetails closeModal={closeModal} />
        </CohortModalContext.Provider>
      </CohortStateContext.Provider>
    </ThemeProvider>,
  );

  return { ...utils, dispatch, showAlert, closeModal };
}

describe('CohortDetails', () => {
  it('should render nothing when no cohort is active', () => {
    const { container } = renderDetails({ selectedCohort: null });
    expect(container).toBeEmptyDOMElement();
  });

  it('should save an existing cohort through mutate dispatch', () => {
    const { dispatch } = renderDetails();
    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'MUTATE_SINGLE_COHORT',
    }));
  });

  it('should create a pending new cohort on save', () => {
    const { dispatch } = renderDetails({
      selectedCohort: 'New Cohort',
      pendingNewCohort: {
        cohortId: 'New Cohort',
        cohortName: 'New Cohort',
        cohortDescription: '',
        participants: [{ id: '1', participant_id: 'P1', study_id: 'S1' }],
      },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'CREATE_NEW_COHORT',
    }));
  });
});
