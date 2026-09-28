import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import AlertManager from '../../../src/components/CohortModal/components/shared/AlertManager';
import { CohortModalContext } from '../../../src/components/CohortModal/CohortModalContext';

const theme = createMuiTheme();

describe('AlertManager', () => {
  it('should render nothing when there is no alert message', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <CohortModalContext.Provider value={{ alert: { type: '', message: '' }, clearAlert: jest.fn() }}>
          <AlertManager classes={{ alert: 'alert' }} />
        </CohortModalContext.Provider>
      </ThemeProvider>,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('should show an alert and clear it after timeout or close', () => {
    const clearAlert = jest.fn();
    render(
      <ThemeProvider theme={theme}>
        <CohortModalContext.Provider
          value={{ alert: { type: 'success', message: 'Saved' }, clearAlert }}
        >
          <AlertManager classes={{ alert: 'alert' }} />
        </CohortModalContext.Provider>
      </ThemeProvider>,
    );

    expect(screen.getByText('Saved')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText(/close/i));
    expect(clearAlert).toHaveBeenCalled();
  });
});
