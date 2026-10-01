import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddToCartDialogView from '../../../src/pages/globalSearch/Cards/participant/AddToCartDialog/AddToCartDialogView';
import AddToCartDialogController from '../../../src/pages/globalSearch/Cards/participant/AddToCartDialog/AddToCartDialogController';
import AddToCartDialogAlertView from '../../../src/pages/globalSearch/Cards/participant/AddToCartDialog/AddToCartDialogAlertView';

describe('Add to cart dialogs', () => {
  beforeAll(() => {
    global.MutationObserver = class MutationObserver {
      observe() {}

      disconnect() {}
    };
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should confirm adding files', () => {
    const onYesClick = jest.fn();
    const onNoClick = jest.fn();
    render(
      <AddToCartDialogView
        open
        numberOfFilesSelected={3}
        dialogText="Add"
        onYesClick={onYesClick}
        onNoClick={onNoClick}
      />,
    );
    fireEvent.click(screen.getByText('Yes'));
    fireEvent.click(screen.getByText('No'));
    expect(onYesClick).toHaveBeenCalled();
    expect(onNoClick).toHaveBeenCalled();
  });

  it('should show the cart-full alert and auto-close it', () => {
    const onClose = jest.fn();
    render(
      <AddToCartDialogAlertView
        open
        alertMessage="Cart is full"
        onClose={onClose}
      />,
    );
    expect(screen.getByText('Cart is full')).toBeInTheDocument();
    jest.advanceTimersByTime(4000);
    expect(onClose).toHaveBeenCalled();
  });

  it('should render the alert variant from the controller', () => {
    render(
      <AddToCartDialogController
        cartWillFull
        numberOfFilesSelected={1}
        onYesClick={jest.fn()}
        onNoClick={jest.fn()}
      />,
    );
    expect(screen.queryByText('Yes')).not.toBeInTheDocument();
  });

  it('should show the cart-full alert from the dialog view', () => {
    const onNoClick = jest.fn();
    render(
      <AddToCartDialogView
        open
        cartWillFull
        alertMessage="Too many files"
        onNoClick={onNoClick}
      />,
    );
    expect(screen.getByText('Too many files')).toBeInTheDocument();
  });

  it('should render a closed confirmation dialog from the controller', () => {
    render(
      <AddToCartDialogController
        numberOfFilesSelected={2}
        onYesClick={jest.fn()}
        onNoClick={jest.fn()}
      />,
    );
    expect(screen.queryByText('Yes')).not.toBeInTheDocument();
  });
});
