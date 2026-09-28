jest.mock('@apollo/client', () => ({
  useApolloClient: () => ({ query: jest.fn() }),
}));

jest.mock('../../../src/pages/globalSearch/Cards/participant/CPIFilesView/CPIFilesView', () => (props) => (
  <>
    <button type="button" onClick={() => props.setAlterDisplay(true)}>CPI files</button>
    <button type="button" onClick={() => props.setOpenSnackbar(true)}>Open snack</button>
  </>
));

jest.mock('../../../src/pages/globalSearch/Cards/participant/Snackbar/Snackbar', () => ({ open, onClose }) => (
  open ? <button type="button" onClick={onClose}>Snackbar open</button> : null
));

jest.mock('../../../src/pages/globalSearch/Cards/participant/AddToCartDialog/AddToCartDialogAlertView', () => ({ onClose }) => (
  <button type="button" onClick={onClose}>Alert</button>
));

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddFilesView, { btnTypes } from '../../../src/pages/globalSearch/Cards/participant/AddFiles';

describe('AddFilesView', () => {
  it('should export button types and close snackbar and cart-full alerts', () => {
    expect(btnTypes.ADD_ALL_FILES).toBe('ADD_ALL_FILES');
    render(<AddFilesView count={1} cartFiles={[]} />);
    fireEvent.click(screen.getByText('CPI files'));
    fireEvent.click(screen.getByText('Alert'));
    expect(screen.queryByText('Alert')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Open snack'));
    fireEvent.click(screen.getByText('Snackbar open'));
    expect(screen.queryByText('Snackbar open')).not.toBeInTheDocument();
  });
});
