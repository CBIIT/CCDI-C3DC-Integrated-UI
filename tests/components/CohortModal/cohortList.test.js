jest.mock('@bento-core/tool-tip', () => ({ children }) => children);

jest.mock('use-reducer-logger', () => ({
  __esModule: true,
  default: (reducer) => reducer,
}));

jest.mock('../../../src/components/EllipsisText', () => ({
  MiddleEllipsisText: ({ text }) => <span>{text}</span>,
}));

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CohortList from '../../../src/components/CohortModal/components/CohortList/CohortList';
import { CohortModalContext } from '../../../src/components/CohortModal/CohortModalContext';
import { CohortStateContext } from '../../../src/components/CohortSelectorState/CohortStateContext';
import { confirmationTypes } from '../../../src/components/CohortModal/components/shared/ConfirmationModal';

const theme = createMuiTheme();

const alpha = {
  cohortId: 'alpha',
  cohortName: 'Alpha Cohort',
  cohortDescription: '',
  lastUpdated: '2026-01-02T00:00:00.000Z',
  participants: [{ id: '1', participant_id: 'P1', study_id: 'S1' }],
};

const beta = {
  cohortId: 'beta',
  cohortName: 'Beta Cohort',
  cohortDescription: '',
  lastUpdated: '2026-01-01T00:00:00.000Z',
  participants: [{ id: '2', participant_id: 'P2', study_id: 'S2' }],
};

function renderList({
  state = { alpha, beta },
  selectedCohort = 'alpha',
  unSavedChanges = false,
  pendingNewCohort = null,
} = {}) {
  const dispatch = jest.fn();
  const setSelectedCohort = jest.fn();
  const setShowConfirmation = jest.fn();
  const setConfirmModalProps = jest.fn();
  const clearCurrentCohortChanges = jest.fn();
  const clearAlert = jest.fn();
  const showAlert = jest.fn();
  const clearPendingNewCohort = jest.fn();
  const closeModal = jest.fn();

  const utils = render(
    <ThemeProvider theme={theme}>
      <CohortStateContext.Provider value={{ state, dispatch }}>
        <CohortModalContext.Provider
          value={{
            selectedCohort,
            setSelectedCohort,
            clearCurrentCohortChanges,
            setShowConfirmation,
            setConfirmModalProps,
            clearAlert,
            showAlert,
            pendingNewCohort,
            clearPendingNewCohort,
          }}
        >
          <CohortList unSavedChanges={unSavedChanges} closeModal={closeModal} />
        </CohortModalContext.Provider>
      </CohortStateContext.Provider>
    </ThemeProvider>,
  );

  return {
    ...utils,
    dispatch,
    setSelectedCohort,
    setShowConfirmation,
    setConfirmModalProps,
    closeModal,
    clearPendingNewCohort,
    clearCurrentCohortChanges,
    clearAlert,
    showAlert,
  };
}

describe('CohortList', () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = jest.fn();
  });

  it('should render cohorts ordered by last updated', () => {
    renderList();
    const options = screen.getAllByRole('option');
    expect(options[0]).toHaveTextContent('Alpha Cohort');
    expect(options[1]).toHaveTextContent('Beta Cohort');
    expect(screen.getByText(/COHORTS \(2\/20\)/)).toBeInTheDocument();
  });

  it('should switch selection when there are no unsaved changes', () => {
    const { setSelectedCohort, clearAlert } = renderList();
    fireEvent.click(screen.getByRole('option', { name: /Beta Cohort/ }));
    expect(setSelectedCohort).toHaveBeenCalledWith('beta');
    expect(clearAlert).toHaveBeenCalled();
  });

  it('should confirm before switching when there are unsaved changes', () => {
    const { setShowConfirmation, setConfirmModalProps, setSelectedCohort } = renderList({
      unSavedChanges: true,
    });
    fireEvent.click(screen.getByRole('option', { name: /Beta Cohort/ }));
    expect(setShowConfirmation).toHaveBeenCalledWith(true);
    expect(setConfirmModalProps).toHaveBeenCalledWith(expect.objectContaining({
      deletionType: confirmationTypes.CLEAR_UNSAVED_CHANGES,
    }));
    expect(setSelectedCohort).not.toHaveBeenCalled();
  });

  it('should confirm before deleting a cohort', () => {
    const { setShowConfirmation } = renderList();
    fireEvent.click(screen.getByRole('button', { name: /Delete cohort Alpha Cohort/i }));
    expect(setShowConfirmation).toHaveBeenCalledWith(true);
  });

  it('should confirm before deleting all cohorts', () => {
    const { setConfirmModalProps } = renderList();
    fireEvent.click(screen.getByRole('button', { name: /Delete all cohorts/i }));
    expect(setConfirmModalProps).toHaveBeenCalledWith(expect.objectContaining({
      deletionType: confirmationTypes.DELETE_ALL_COHORTS,
    }));
  });

  it('should close the modal when no cohorts remain', () => {
    const { closeModal } = renderList({ state: {}, selectedCohort: null });
    expect(closeModal).toHaveBeenCalled();
  });

  it('should include a pending draft at the top of the list', () => {
    renderList({
      pendingNewCohort: {
        cohortId: 'New Cohort',
        cohortName: 'New Cohort',
        lastUpdated: '2026-01-03T00:00:00.000Z',
        participants: [],
      },
      selectedCohort: 'New Cohort',
    });
    expect(screen.getByRole('option', { name: /New Cohort/ })).toBeInTheDocument();
  });

  it('should duplicate a cohort via dispatch', () => {
    const { dispatch, showAlert, setSelectedCohort } = renderList();
    fireEvent.click(screen.getByRole('button', { name: /Duplicate cohort Alpha Cohort/i }));
    const action = dispatch.mock.calls[0][0];
    expect(action.type).toBe('CREATE_NEW_COHORT');
    expect(action.payload.cohortId).toBe('Alpha Cohort (Copy)');
    action.payload.success();
    expect(showAlert).toHaveBeenCalledWith('success', 'Cohort duplicated successfully!');
    expect(setSelectedCohort).toHaveBeenCalledWith('alpha cohort (copy)');
    action.payload.error({ message: 'taken' });
    expect(showAlert).toHaveBeenCalledWith('error', 'Failed to duplicate cohort: taken');
  });

  it('should number later copies and escape regex characters in the base name', () => {
    const { dispatch } = renderList({
      state: {
        first: { ...alpha, cohortId: 'first', cohortName: 'A+Cohort (Copy)' },
        second: { ...alpha, cohortId: 'second', cohortName: 'A+Cohort (Copy 4)' },
      },
      selectedCohort: 'first',
    });
    fireEvent.click(screen.getByRole('button', { name: /Duplicate cohort A\+Cohort \(Copy\)/i }));
    expect(dispatch.mock.calls[0][0].payload.cohortId).toBe('A+Cohort (Copy 5)');
  });

  it('should confirm a duplicate when there are unsaved changes', () => {
    const { setConfirmModalProps, dispatch } = renderList({ unSavedChanges: true });
    fireEvent.click(screen.getByRole('button', { name: /Duplicate cohort Alpha Cohort/i }));
    const { handleConfirm } = setConfirmModalProps.mock.calls[0][0];
    handleConfirm();
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'CREATE_NEW_COHORT',
    }));
  });

  it('should delete every cohort when the confirmation is accepted', () => {
    const { setConfirmModalProps, dispatch, clearCurrentCohortChanges } = renderList();
    fireEvent.click(screen.getByRole('button', { name: /Delete all cohorts/i }));
    setConfirmModalProps.mock.calls[0][0].handleConfirm();
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'DELETE_ALL_COHORT',
    }));
    expect(clearCurrentCohortChanges).toHaveBeenCalled();
  });

  it('should delete the selected cohort when the confirmation is accepted', () => {
    const { setConfirmModalProps, dispatch, clearCurrentCohortChanges } = renderList();
    fireEvent.click(screen.getByRole('button', { name: /Delete cohort Alpha Cohort/i }));
    setConfirmModalProps.mock.calls[0][0].handleConfirm();
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'DELETE_SINGLE_COHORT',
    }));
    expect(clearCurrentCohortChanges).toHaveBeenCalled();
  });

  it('should drop a pending draft without dispatching a delete', () => {
    const pending = {
      cohortId: 'draft',
      cohortName: 'Draft',
      lastUpdated: '2026-01-03T00:00:00.000Z',
      participants: [],
    };
    const { setConfirmModalProps, dispatch, clearPendingNewCohort, setSelectedCohort } = renderList({
      pendingNewCohort: pending,
      selectedCohort: 'draft',
    });
    fireEvent.click(screen.getByRole('button', { name: /Delete cohort Draft/i }));
    setConfirmModalProps.mock.calls[0][0].handleConfirm();
    expect(dispatch).not.toHaveBeenCalled();
    expect(clearPendingNewCohort).toHaveBeenCalled();
    expect(setSelectedCohort).toHaveBeenCalledWith('alpha');
  });

  it('should ignore a click on the cohort that is already selected', () => {
    const { setSelectedCohort } = renderList();
    fireEvent.click(screen.getByRole('option', { name: /Alpha Cohort/ }));
    expect(setSelectedCohort).not.toHaveBeenCalled();
  });

  it('should select the first cohort when the current selection is missing', () => {
    const { setSelectedCohort } = renderList({ selectedCohort: 'missing' });
    expect(setSelectedCohort).toHaveBeenCalledWith('alpha');
  });

  it('should clear a pending draft when switching to a saved cohort', () => {
    const { clearPendingNewCohort, setSelectedCohort } = renderList({
      pendingNewCohort: {
        cohortId: 'draft',
        cohortName: 'Draft',
        lastUpdated: '2026-01-03T00:00:00.000Z',
        participants: [],
      },
      selectedCohort: 'draft',
    });
    fireEvent.click(screen.getByRole('option', { name: /Beta Cohort/ }));
    expect(clearPendingNewCohort).toHaveBeenCalled();
    expect(setSelectedCohort).toHaveBeenCalledWith('beta');
  });

  it('should skip a cohort entry that has no name', () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    renderList({
      state: {
        alpha,
        broken: { cohortId: '', lastUpdated: '2026-01-04T00:00:00.000Z' },
      },
    });
    expect(console.warn).toHaveBeenCalled();
    expect(screen.queryByRole('option', { name: /Unnamed/ })).not.toBeInTheDocument();
  });

  it('should use a custom list heading from config', () => {
    renderList();
    expect(screen.getByText(/COHORTS \(2\/20\)/)).toBeInTheDocument();
  });
});
