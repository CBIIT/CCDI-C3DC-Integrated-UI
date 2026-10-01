jest.mock('@bento-core/tool-tip', () => ({ children }) => children);

jest.mock('use-reducer-logger', () => ({
  __esModule: true,
  default: (reducer) => reducer,
}));

jest.mock('../../../src/components/CohortModal/components/CohortDetails/components/ParticipantList/components/SearchBar', () => ({
  __esModule: true,
  default: ({ onSearchChange, onSearchBlur }) => (
    <input
      aria-label="Search participants by ID"
      onChange={(e) => onSearchChange(e.target.value)}
      onBlur={(e) => onSearchBlur(e.target.value)}
    />
  ),
}));

jest.mock('../../../src/components/CohortModal/components/CohortDetails/components/ParticipantList/components/ParticipantTable', () => ({
  __esModule: true,
  default: ({ onDeleteParticipant, onDeleteCohort, participants }) => (
    <div>
      <button type="button" onClick={() => onDeleteParticipant(participants[0].participant_id)}>
        delete-participant
      </button>
      <button type="button" onClick={onDeleteCohort}>delete-cohort</button>
    </div>
  ),
}));

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import ParticipantList from '../../../src/components/CohortModal/components/CohortDetails/components/ParticipantList/ParticipantList';
import { CohortModalContext } from '../../../src/components/CohortModal/CohortModalContext';
import { CohortStateContext } from '../../../src/components/CohortSelectorState/CohortStateContext';

const theme = createMuiTheme();

const cohort = {
  cohortId: 'c1',
  lastUpdated: '2026-01-15T12:00:00.000Z',
  participants: [{ id: '1', participant_id: 'P1', study_id: 'S1' }],
};

function renderList(overrides = {}) {
  const dispatch = jest.fn();
  const setLocalCohort = jest.fn();
  const setCurrentCohortChanges = jest.fn();
  const handleSave = jest.fn();
  const closeModal = jest.fn();
  const clearPendingNewCohort = jest.fn();
  const clearCurrentCohortChanges = jest.fn();
  const setSelectedCohort = jest.fn();

  const utils = render(
    <ThemeProvider theme={theme}>
      <CohortStateContext.Provider value={{ state: { c1: cohort }, dispatch }}>
        <CohortModalContext.Provider
          value={{
            selectedCohort: 'c1',
            currentCohortChanges: null,
            setCurrentCohortChanges,
            clearCurrentCohortChanges,
            pendingNewCohort: null,
            clearPendingNewCohort,
            setSelectedCohort,
            ...overrides,
          }}
        >
          <ParticipantList
            localCohort={{ ...cohort }}
            setLocalCohort={setLocalCohort}
            handleSave={handleSave}
            closeModal={closeModal}
          />
        </CohortModalContext.Provider>
      </CohortStateContext.Provider>
    </ThemeProvider>,
  );

  return {
    ...utils,
    dispatch,
    setLocalCohort,
    handleSave,
    closeModal,
    clearPendingNewCohort,
  };
}

describe('ParticipantList', () => {
  it('should save and cancel', () => {
    const { handleSave, closeModal } = renderList();
    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(handleSave).toHaveBeenCalled();
    expect(closeModal).toHaveBeenCalled();
  });

  it('should remove a participant from local state', () => {
    const { setLocalCohort } = renderList();
    fireEvent.click(screen.getByRole('button', { name: 'delete-participant' }));
    expect(setLocalCohort).toHaveBeenCalledWith(expect.objectContaining({
      participants: [],
    }));
  });

  it('should discard a pending new cohort instead of dispatching delete', () => {
    const { dispatch, clearPendingNewCohort } = renderList({
      selectedCohort: 'New Cohort',
      pendingNewCohort: { cohortId: 'New Cohort', lastUpdated: cohort.lastUpdated },
    });
    fireEvent.click(screen.getByRole('button', { name: 'delete-cohort' }));
    expect(clearPendingNewCohort).toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('should dispatch delete for a persisted cohort', () => {
    const { dispatch } = renderList();
    fireEvent.click(screen.getByRole('button', { name: 'delete-cohort' }));
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'DELETE_SINGLE_COHORT',
    }));
  });
});
