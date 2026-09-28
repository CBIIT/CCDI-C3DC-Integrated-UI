import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import NavigateAwayModal from '../../../src/pages/CohortAnalyzer/components/navigateAwayModal';

describe('NavigateAwayModal', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should confirm and persist the hide preference', () => {
    const onConfirm = jest.fn();
    const setOpen = jest.fn();
    render(<NavigateAwayModal open onConfirm={onConfirm} setOpen={setOpen} />);
    fireEvent.click(screen.getByLabelText(/do not show this notice/i));
    fireEvent.click(screen.getByText('Confirm'));
    expect(localStorage.getItem('hideNavigateModal')).toBe('true');
    expect(onConfirm).toHaveBeenCalled();
    expect(setOpen).toHaveBeenCalledWith(false);
  });

  it('should close without confirming', () => {
    const onConfirm = jest.fn();
    const setOpen = jest.fn();
    render(<NavigateAwayModal open onConfirm={onConfirm} setOpen={setOpen} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(onConfirm).not.toHaveBeenCalled();
    expect(setOpen).toHaveBeenCalledWith(false);
  });
});
