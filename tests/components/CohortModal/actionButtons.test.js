jest.mock('@bento-core/tool-tip', () => ({ children, title }) => (
  <div data-testid="tooltip" data-title={title}>{children}</div>
));

jest.mock('../../../src/components/CohortModal/utils', () => ({
  downloadCohortManifest: jest.fn(() => Promise.resolve()),
  downloadCohortMetadata: jest.fn(() => Promise.resolve()),
}));

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import ActionButtons from '../../../src/components/CohortModal/components/CohortDetails/components/ActionButtons';
import { CohortModalContext } from '../../../src/components/CohortModal/CohortModalContext';
import {
  downloadCohortManifest,
  downloadCohortMetadata,
} from '../../../src/components/CohortModal/utils';

const theme = createMuiTheme();

const localCohort = {
  cohortId: 'c1',
  participants: [{ id: '1', participant_id: 'P1', study_id: 'S1' }],
};

describe('ActionButtons', () => {
  it('should navigate to the cohort analyzer', () => {
    render(
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <CohortModalContext.Provider value={{ showAlert: jest.fn() }}>
            <ActionButtons localCohort={localCohort} />
          </CohortModalContext.Provider>
        </MemoryRouter>
      </ThemeProvider>,
    );

    expect(screen.getByLabelText(/Navigate to Cohort Analyzer page/i)).toBeInTheDocument();
  });

  it('should download manifest and metadata from the dropdown', async () => {
    render(
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <CohortModalContext.Provider value={{ showAlert: jest.fn() }}>
            <ActionButtons localCohort={localCohort} />
          </CohortModalContext.Provider>
        </MemoryRouter>
      </ThemeProvider>,
    );

    fireEvent.click(screen.getByLabelText(/Download cohort data/i));
    fireEvent.click(screen.getByText('Manifest CSV'));
    expect(downloadCohortManifest).toHaveBeenCalled();

    fireEvent.click(screen.getByLabelText(/Download cohort data/i));
    fireEvent.click(screen.getByText('Metadata JSON'));
    expect(downloadCohortMetadata).toHaveBeenCalled();
  });
});
