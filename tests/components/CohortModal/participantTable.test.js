jest.mock('@bento-core/tool-tip', () => ({ children }) => children);

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import ParticipantTable from '../../../src/components/CohortModal/components/CohortDetails/components/ParticipantList/components/ParticipantTable';
import { CohortModalContext } from '../../../src/components/CohortModal/CohortModalContext';
import { confirmationTypes } from '../../../src/components/CohortModal/components/shared/ConfirmationModal';

const theme = createMuiTheme();

const participants = [
  { participant_id: 'P-200', study_id: 'phs002' },
  { participant_id: 'P-100', study_id: 'phs001' },
];

function renderTable(props = {}) {
  const setShowConfirmation = jest.fn();
  const setConfirmModalProps = jest.fn();
  const onDeleteParticipant = jest.fn();
  const onDeleteCohort = jest.fn();

  const utils = render(
    <ThemeProvider theme={theme}>
      <CohortModalContext.Provider value={{ setShowConfirmation, setConfirmModalProps }}>
        <ParticipantTable
          participants={participants}
          onDeleteParticipant={onDeleteParticipant}
          onDeleteCohort={onDeleteCohort}
          searchText=""
          {...props}
        />
      </CohortModalContext.Provider>
    </ThemeProvider>,
  );

  return { ...utils, setShowConfirmation, setConfirmModalProps, onDeleteParticipant };
}

describe('ParticipantTable', () => {
  beforeEach(() => {
    global.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

  it('should sort by participant id then reverse', () => {
    renderTable();
    expect(screen.getAllByText(/P-/).map((el) => el.textContent)).toEqual(['P-100', 'P-200']);
    fireEvent.click(screen.getByText('Participant ID'));
    expect(screen.getAllByText(/P-/).map((el) => el.textContent)).toEqual(['P-200', 'P-100']);
  });

  it('should filter by search text', () => {
    renderTable({ searchText: '200' });
    expect(screen.getByText('P-200')).toBeInTheDocument();
    expect(screen.queryByText('P-100')).not.toBeInTheDocument();
  });

  it('should show empty copy when nothing matches', () => {
    renderTable({ searchText: 'zzz' });
    expect(screen.getByText('No matching Participant ID')).toBeInTheDocument();
  });

  it('should show No Data when there are no participants', () => {
    renderTable({ participants: [] });
    expect(screen.getByText('No Data')).toBeInTheDocument();
  });

  it('should confirm cohort deletion from the header trash icon', () => {
    const { setShowConfirmation, setConfirmModalProps } = renderTable();
    fireEvent.click(screen.getByAltText('delete cohort icon'));
    expect(setShowConfirmation).toHaveBeenCalledWith(true);
    expect(setConfirmModalProps).toHaveBeenCalledWith(expect.objectContaining({
      deletionType: confirmationTypes.DELETE_SINGLE_COHORT,
    }));
  });

  it('should delete a participant when more than one remains', () => {
    const { onDeleteParticipant } = renderTable();
    fireEvent.click(screen.getAllByAltText('delete participant icon')[0]);
    expect(onDeleteParticipant).toHaveBeenCalled();
  });
});
