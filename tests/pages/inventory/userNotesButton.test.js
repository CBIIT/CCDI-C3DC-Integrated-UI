import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserNotesButton from '../../../src/pages/inventory/sideBar/UserNotesButton';

describe('UserNotesButton', () => {
  it('should open and close the notes modal', () => {
    render(<UserNotesButton />);
    expect(screen.getByText('Notes to User')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('heading', { name: 'Notes to User' })).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('close'));
    expect(screen.queryByRole('heading', { name: 'Notes to User' })).not.toBeInTheDocument();
  });
});
