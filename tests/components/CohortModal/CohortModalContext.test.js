import React, { useContext } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

if (typeof global.MutationObserver === 'undefined') {
  global.MutationObserver = class MutationObserver {
    disconnect() {}
    observe() {}
    takeRecords() { return []; }
  };
}
import {
  CohortModalContext,
  CohortModalProvider,
} from '../../../src/components/CohortModal/CohortModalContext';

function ConsumerProbe() {
  const {
    showCohortModal,
    setShowCohortModal,
    warningMessage,
    setWarningMessage,
    alert,
    showAlert,
    clearAlert,
    selectedCohort,
    setSelectedCohort,
    currentCohortChanges,
    setCurrentCohortChanges,
    clearCurrentCohortChanges,
    pendingNewCohort,
    setPendingNewCohort,
    clearPendingNewCohort,
    showConfirmation,
    setShowConfirmation,
  } = useContext(CohortModalContext);

  return (
    <div>
      <span data-testid="open-flag">{showCohortModal ? 'open' : 'closed'}</span>
      <span data-testid="warning">{warningMessage}</span>
      <span data-testid="alert">{alert.message}</span>
      <span data-testid="selected">{selectedCohort || ''}</span>
      <span data-testid="changes">{currentCohortChanges ? currentCohortChanges.cohortName : ''}</span>
      <span data-testid="pending">{pendingNewCohort ? pendingNewCohort.cohortId : ''}</span>
      <span data-testid="confirm">{showConfirmation ? 'yes' : 'no'}</span>
      <button type="button" onClick={() => setShowCohortModal(true)}>open-modal</button>
      <button type="button" onClick={() => setWarningMessage('stay')}>set-warning</button>
      <button type="button" onClick={() => showAlert('success', 'saved', 20)}>show-alert</button>
      <button type="button" onClick={clearAlert}>clear-alert</button>
      <button type="button" onClick={() => setSelectedCohort('c1')}>select</button>
      <button type="button" onClick={() => setCurrentCohortChanges({ cohortName: 'edited' })}>edit</button>
      <button type="button" onClick={clearCurrentCohortChanges}>clear-changes</button>
      <button type="button" onClick={() => setPendingNewCohort({ cohortId: 'New Cohort' })}>set-pending</button>
      <button type="button" onClick={clearPendingNewCohort}>clear-pending</button>
      <button type="button" onClick={() => setShowConfirmation(true)}>confirm</button>
    </div>
  );
}

describe('CohortModalContext', () => {
  it('should provide defaults and allow toggling showCohortModal', () => {
    render(
      <CohortModalProvider>
        <ConsumerProbe />
      </CohortModalProvider>,
    );

    expect(screen.getByTestId('open-flag')).toHaveTextContent('closed');
    fireEvent.click(screen.getByRole('button', { name: /open-modal/i }));
    expect(screen.getByTestId('open-flag')).toHaveTextContent('open');
  });

  it('should allow setting warning, selected cohort, pending draft, and confirmation', () => {
    render(
      <CohortModalProvider>
        <ConsumerProbe />
      </CohortModalProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: /set-warning/i }));
    fireEvent.click(screen.getByRole('button', { name: /^select$/i }));
    fireEvent.click(screen.getByRole('button', { name: /set-pending/i }));
    fireEvent.click(screen.getByRole('button', { name: /^confirm$/i }));
    fireEvent.click(screen.getByRole('button', { name: /^edit$/i }));

    expect(screen.getByTestId('warning')).toHaveTextContent('stay');
    expect(screen.getByTestId('selected')).toHaveTextContent('c1');
    expect(screen.getByTestId('pending')).toHaveTextContent('New Cohort');
    expect(screen.getByTestId('confirm')).toHaveTextContent('yes');
    expect(screen.getByTestId('changes')).toHaveTextContent('edited');

    fireEvent.click(screen.getByRole('button', { name: /clear-pending/i }));
    fireEvent.click(screen.getByRole('button', { name: /clear-changes/i }));
    expect(screen.getByTestId('pending')).toHaveTextContent('');
    expect(screen.getByTestId('changes')).toHaveTextContent('');
  });

  it('should auto-clear alerts after the requested duration', async () => {
    render(
      <CohortModalProvider>
        <ConsumerProbe />
      </CohortModalProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: /show-alert/i }));
    expect(screen.getByTestId('alert')).toHaveTextContent('saved');
    await waitFor(() => {
      expect(screen.getByTestId('alert')).toHaveTextContent('');
    });
  });
});
