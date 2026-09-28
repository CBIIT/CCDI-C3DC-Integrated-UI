import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CohortModalContext } from '../../../../src/components/CohortModal/CohortModalContext';
import { useModalState } from '../../../../src/components/CohortModal/hooks/useModalState';
import { confirmationTypes } from '../../../../src/components/CohortModal/components/shared/ConfirmationModal';

function Probe({ hasUnsaved, onClose, modalClosed }) {
  const { unSavedChangesCheck, closeModalWrapper } = useModalState(onClose, modalClosed);
  return (
    <>
      <button type="button" onClick={() => unSavedChangesCheck(hasUnsaved)}>check</button>
      <button type="button" onClick={closeModalWrapper}>force-close</button>
    </>
  );
}

describe('useModalState', () => {
  it('should close immediately when there are no unsaved changes', () => {
    const onClose = jest.fn();
    const modalClosed = jest.fn();
    const setSelectedCohort = jest.fn();
    const clearPendingNewCohort = jest.fn();
    const clearCurrentCohortChanges = jest.fn();

    render(
      <CohortModalContext.Provider value={{
        setSelectedCohort,
        clearPendingNewCohort,
        clearCurrentCohortChanges,
      }}
      >
        <Probe hasUnsaved={false} onClose={onClose} modalClosed={modalClosed} />
      </CohortModalContext.Provider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'check' }));
    expect(onClose).toHaveBeenCalled();
    expect(modalClosed).toHaveBeenCalled();
    expect(setSelectedCohort).toHaveBeenCalledWith(null);
    expect(clearPendingNewCohort).toHaveBeenCalled();
  });

  it('should open confirmation when unsaved changes exist', () => {
    const setConfirmModalProps = jest.fn();
    const setShowConfirmation = jest.fn();

    render(
      <CohortModalContext.Provider value={{ setConfirmModalProps, setShowConfirmation }}>
        <Probe hasUnsaved />
      </CohortModalContext.Provider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'check' }));
    expect(setShowConfirmation).toHaveBeenCalledWith(true);
    expect(setConfirmModalProps).toHaveBeenCalledWith(expect.objectContaining({
      deletionType: confirmationTypes.CLEAR_UNSAVED_CHANGES,
    }));
  });
});
