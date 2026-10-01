import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import ConfirmationModal, {
  confirmationTypes,
} from '../../../src/components/CohortModal/components/shared/ConfirmationModal';

const theme = createMuiTheme();

function renderModal(props) {
  const setOpen = jest.fn();
  const utils = render(
    <ThemeProvider theme={theme}>
      <ConfirmationModal
        open
        setOpen={setOpen}
        handleConfirm={jest.fn()}
        deletionType={confirmationTypes.DELETE_SINGLE_COHORT}
        {...props}
      />
    </ThemeProvider>,
  );
  return { ...utils, setOpen };
}

describe('ConfirmationModal', () => {
  it('should render confirm and cancel for a single-cohort deletion', () => {
    renderModal();
    expect(screen.getByText(/delete this cohort/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
  });

  it('should call handleConfirm and close when Confirm is clicked', () => {
    const handleConfirm = jest.fn();
    const { setOpen } = renderModal({ handleConfirm });
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(handleConfirm).toHaveBeenCalled();
    expect(setOpen).toHaveBeenCalledWith(false);
  });

  it('should close without confirming when Cancel is clicked', () => {
    const handleConfirm = jest.fn();
    const { setOpen } = renderModal({ handleConfirm });
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(handleConfirm).not.toHaveBeenCalled();
    expect(setOpen).toHaveBeenCalledWith(false);
  });

  it('should render a custom message with Ok', () => {
    const { setOpen } = renderModal({ message: 'Cohort limit reached.' });
    expect(screen.getByText('Cohort limit reached.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Ok' }));
    expect(setOpen).toHaveBeenCalledWith(false);
  });

  it('should show unsaved-changes copy for CLEAR_UNSAVED_CHANGES', () => {
    renderModal({ deletionType: confirmationTypes.CLEAR_UNSAVED_CHANGES });
    expect(screen.getByText(/lose all unsaved changes/i)).toBeInTheDocument();
  });

  it('should omit undo copy for delete-all-participants', () => {
    renderModal({ deletionType: confirmationTypes.DELETE_ALL_PARTICIPANTS });
    expect(screen.getByText(/delete all participants/i)).toBeInTheDocument();
    expect(screen.queryByText(/cannot be undone/i)).not.toBeInTheDocument();
  });
});
