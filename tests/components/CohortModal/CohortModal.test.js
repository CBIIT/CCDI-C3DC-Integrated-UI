jest.mock('@bento-core/tool-tip', () => ({ children }) => children);

jest.mock('use-reducer-logger', () => ({
  __esModule: true,
  default: (reducer) => reducer,
}));

jest.mock('../../../src/utils/graphqlClient', () => ({
  __esModule: true,
  default: { query: jest.fn() },
}));

jest.mock('../../../src/components/CohortModal/components/CohortList/CohortList', () => () => (
  <div>Cohort list</div>
));
jest.mock('../../../src/components/CohortModal/components/CohortDetails/CohortDetails', () => () => (
  <div>Cohort details</div>
));

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CohortModal from '../../../src/components/CohortModal/CohortModal';
import { CohortModalContext } from '../../../src/components/CohortModal/CohortModalContext';
import { CohortStateContext } from '../../../src/components/CohortSelectorState/CohortStateContext';

const theme = createMuiTheme();

function renderModal(contextOverrides = {}, modalProps = {}) {
  const clearCurrentCohortChanges = jest.fn();
  const clearPendingNewCohort = jest.fn();
  const setShowConfirmation = jest.fn();
  const onCloseModal = jest.fn();

  const utils = render(
    <ThemeProvider theme={theme}>
      <CohortStateContext.Provider value={{ state: {}, dispatch: jest.fn() }}>
        <CohortModalContext.Provider
          value={{
            clearCurrentCohortChanges,
            clearPendingNewCohort,
            showConfirmation: false,
            setShowConfirmation,
            confirmModalProps: { handleConfirm: jest.fn(), deletionType: '' },
            currentCohortChanges: null,
            selectedCohort: null,
            pendingNewCohort: null,
            alert: { type: '', message: '' },
            clearAlert: jest.fn(),
            ...contextOverrides,
          }}
        >
          <CohortModal open onCloseModal={onCloseModal} {...modalProps} />
        </CohortModalContext.Provider>
      </CohortStateContext.Provider>
    </ThemeProvider>,
  );

  return { ...utils, clearCurrentCohortChanges, clearPendingNewCohort, onCloseModal };
}

describe('CohortModal', () => {
  it('should render the title, list, and details when open', () => {
    renderModal();
    expect(screen.getByText('View of All Cohorts')).toBeInTheDocument();
    expect(screen.getByText('Cohort list')).toBeInTheDocument();
    expect(screen.getByText('Cohort details')).toBeInTheDocument();
    expect(screen.getByAltText('close icon')).toBeInTheDocument();
  });

  it('should clear draft state when closed', () => {
    const { rerender, clearCurrentCohortChanges, clearPendingNewCohort } = renderModal();
    rerender(
      <ThemeProvider theme={theme}>
        <CohortStateContext.Provider value={{ state: {}, dispatch: jest.fn() }}>
          <CohortModalContext.Provider
            value={{
              clearCurrentCohortChanges,
              clearPendingNewCohort,
              showConfirmation: false,
              setShowConfirmation: jest.fn(),
              confirmModalProps: { handleConfirm: jest.fn(), deletionType: '' },
              currentCohortChanges: null,
              selectedCohort: null,
              pendingNewCohort: null,
              alert: { type: '', message: '' },
              clearAlert: jest.fn(),
            }}
          >
            <CohortModal open={false} />
          </CohortModalContext.Provider>
        </CohortStateContext.Provider>
      </ThemeProvider>,
    );

    expect(clearCurrentCohortChanges).toHaveBeenCalled();
    expect(clearPendingNewCohort).toHaveBeenCalled();
  });

  it('should close from the close icon when there are no unsaved changes', () => {
    const { onCloseModal } = renderModal();
    fireEvent.click(screen.getByAltText('close icon'));
    expect(onCloseModal).toHaveBeenCalled();
  });
});
