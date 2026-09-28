jest.mock('@bento-core/cart', () => ({
  formatCartAddMessage: (count, already) => `${count} added ${already} existing`,
}));

import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import SnackbarView from '../../../src/pages/globalSearch/Cards/participant/Snackbar/Snackbar';
import SnackbarRedux from '../../../src/pages/globalSearch/Cards/participant/Snackbar/SnackbarRedux';

describe('Snackbar', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should portal an open toast and auto-close it', () => {
    const onClose = jest.fn();
    render(<SnackbarView open count={2} alreadyInCartCount={1} onClose={onClose} />);
    expect(screen.getByRole('status')).toHaveTextContent('2 added 1 existing');
    jest.advanceTimersByTime(3000);
    expect(onClose).toHaveBeenCalled();
  });

  it('should not render when closed', () => {
    render(<SnackbarView open={false} count={1} onClose={jest.fn()} />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('should map cart counts from Redux', () => {
    const store = createStore(() => ({
      cartReducer: { count: 4, alreadyInCartCount: 1 },
    }));
    render(
      <Provider store={store}>
        <SnackbarRedux open onClose={jest.fn()} />
      </Provider>,
    );
    expect(screen.getByRole('status')).toHaveTextContent('4 added 1 existing');
  });
});
