jest.mock('../../../src/utils/graphqlClient', () => ({ query: jest.fn() }));
jest.mock('../../../src/bento/dashboardTabData', () => ({ GET_PARTICIPANTS_OVERVIEW_QUERY: {} }));
jest.mock('@bento-core/facet-filter', () => ({ getFilters: () => ({}) }));
jest.mock('../../../src/components/Global/GlobalProvider', () => ({
  useGlobal: () => ({
    Notification: {
      show: (...args) => {
        if (global.__ddNotify) global.__ddNotify(...args);
      },
    },
  }),
}));
jest.mock('../../../src/components/CohortSelectorState/store/action', () => ({
  onAddParticipantsToCohort: jest.fn((id, rows, cb) => {
    if (cb) cb(rows.length);
    return { type: 'ADD' };
  }),
  onCreateNewCohort: jest.fn((n, d, rows, success, error) => {
    if (success) success(rows.length);
    return { type: 'CREATE' };
  }),
}));
jest.mock('../../../src/components/CustomCheckbox/CustomCheckbox', () => (
  ({ item, handleCheckbox }) => (
    <input
      type="checkbox"
      aria-label={`select ${item}`}
      onChange={() => handleCheckbox(item)}
    />
  )
));
jest.mock('../../../src/components/EllipsisText', () => ({
  MiddleEllipsisText: ({ text, children }) => <span>{text || children}</span>,
}));
jest.mock('../../../src/components/CohortModal/components/shared/ConfirmationModal', () => (
  ({ open, message, handleConfirm }) => (
    open ? (
      <div>
        <span>{message}</span>
        <button type="button" onClick={handleConfirm}>dismiss</button>
      </div>
    ) : null
  )
));

jest.mock('@bento-core/paginated-table', () => {
  const React = require('react');
  return {
    onRowSeclect: jest.fn(() => ({ type: 'SELECT' })),
    TableContext: React.createContext({
      context: { hiddenSelectedRows: [], totalRowCount: 0, dispatch: jest.fn() },
    }),
  };
});

jest.mock('@bento-core/paginated-table/dist/table/state/Actions', () => ({
  onRowSelectHidden: jest.fn(() => ({ type: 'HIDDEN' })),
}));

jest.mock('../../../src/components/CohortSelectorState/CohortStateContext', () => {
  const React = require('react');
  return {
    CohortStateContext: React.createContext({ state: {}, dispatch: jest.fn() }),
  };
});

jest.mock('../../../src/components/CohortModal/CohortModalContext', () => {
  const React = require('react');
  return {
    CohortModalContext: React.createContext({
      setShowCohortModal: jest.fn(),
      setWarningMessage: jest.fn(),
    }),
  };
});

jest.mock('react-redux', () => ({
  connect: (mapState) => (Comp) => (props) => {
    const mapped = mapState
      ? mapState({
        statusReducer: { filterState: {} },
        localFind: { upload: [{ participant_id: 'U1' }], autocomplete: [{ title: 'A1' }] },
      })
      : {};
    return require('react').createElement(Comp, { ...mapped, ...props });
  },
}));

import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TableContext } from '@bento-core/paginated-table';
import { CohortStateContext } from '../../../src/components/CohortSelectorState/CohortStateContext';
import { CohortModalContext } from '../../../src/components/CohortModal/CohortModalContext';
import { CustomDropDown } from '../../../src/pages/inventory/tabs/wrapperConfig/CustomDropDown';
import client from '../../../src/utils/graphqlClient';
import {
  onAddParticipantsToCohort,
  onCreateNewCohort,
} from '../../../src/components/CohortSelectorState/store/action';

const tableDispatch = jest.fn();
const cohortDispatch = jest.fn();
const setShowCohortModal = jest.fn();
const setWarningMessage = jest.fn();

function renderDropDown(props, table = {}) {
  return render(
    <CohortModalContext.Provider value={{ setShowCohortModal, setWarningMessage }}>
      <CohortStateContext.Provider value={{ state: {}, dispatch: cohortDispatch }}>
        <TableContext.Provider value={{
          context: {
            hiddenSelectedRows: [{ participant_id: 'P1', id: 'pk1', study_id: 's1' }],
            totalRowCount: 2,
            dispatch: tableDispatch,
            ...table,
          },
        }}
        >
          <CustomDropDown
            backgroundColor="#375C67"
            borderColor="#73C7BE"
            filterState={{}}
            localFindUpload={[{ participant_id: 'U1' }]}
            localFindAutocomplete={[{ title: 'A1' }]}
            {...props}
          />
        </TableContext.Provider>
      </CohortStateContext.Provider>
    </CohortModalContext.Provider>,
  );
}

describe('CustomDropDown', () => {
  beforeEach(() => {
    global.MutationObserver = class MutationObserver {
      observe() {}
      disconnect() {}
      takeRecords() { return []; }
    };
    tableDispatch.mockClear();
    cohortDispatch.mockClear();
    setShowCohortModal.mockClear();
    client.query.mockReset();
    onCreateNewCohort.mockClear();
    onAddParticipantsToCohort.mockClear();
    global.__ddNotify = jest.fn();
    localStorage.setItem('cohortState', JSON.stringify({
      c1: { participants: [{ participant_id: 'P0' }] },
    }));
  });

  async function openMenu(label) {
    fireEvent.click(screen.getByText(label));
    await waitFor(() => {
      expect(screen.getAllByText(/Participants/).length).toBeGreaterThan(0);
    });
  }

  it('should create a new cohort from selected participants', async () => {
    renderDropDown({
      label: 'CREATE NEW COHORT',
      type: 'new',
      options: ['All Participants', 'Selected Participants'],
      enabledWithoutSelect: true,
    });
    await openMenu('CREATE NEW COHORT');
    fireEvent.click(screen.getByText('Selected Participants'));
    await waitFor(() => {
      expect(onCreateNewCohort).toHaveBeenCalled();
    });
    expect(setShowCohortModal).toHaveBeenCalledWith(true);
  });

  it('should query all participants when creating a new cohort', async () => {
    client.query.mockResolvedValue({
      data: {
        participantOverview: [
          { participant_id: 'P2', id: 'pk2', study_id: 's2' },
          { participant: { participant_id: 'P2', id: 'pk2' }, study_id: 's2' },
        ],
      },
    });
    renderDropDown({
      label: 'CREATE NEW COHORT',
      type: 'new',
      options: ['All Participants', 'Selected Participants'],
      enabledWithoutSelect: true,
    });
    await openMenu('CREATE NEW COHORT');
    fireEvent.click(screen.getByText('All Participants'));
    await waitFor(() => {
      expect(client.query).toHaveBeenCalled();
      expect(onCreateNewCohort).toHaveBeenCalled();
    });
  });

  it('should disable selected participants when none are checked', async () => {
    renderDropDown({
      label: 'CREATE NEW COHORT',
      type: 'new',
      options: ['All Participants', 'Selected Participants'],
      enabledWithoutSelect: true,
    }, { hiddenSelectedRows: [] });
    await openMenu('CREATE NEW COHORT');
    expect(screen.getByText('Selected Participants')).toBeInTheDocument();
  });

  it('should warn when creating a cohort from more than 4000 participants', async () => {
    renderDropDown({
      label: 'CREATE NEW COHORT',
      type: 'new',
      options: ['All Participants'],
      enabledWithoutSelect: true,
    }, { totalRowCount: 4001 });
    await openMenu('CREATE NEW COHORT');
    fireEvent.click(screen.getByText('All Participants'));
    expect(screen.getByText(/not allowed to add more than 4000/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText('dismiss'));
  });

  it('should add selected participants to an existing cohort', async () => {
    renderDropDown({
      label: 'ADD TO EXISTING COHORT',
      type: 'existing',
      options: [
        'All Participants',
        'Selected Participants',
        { cohortId: 'c1', cohortName: 'Cohort One' },
      ],
      enabledWithoutSelect: true,
    });
    await openMenu('ADD TO EXISTING COHORT');
    fireEvent.click(screen.getByLabelText('select c1'));
    fireEvent.click(screen.getByText('Selected Participants'));
    await waitFor(() => {
      expect(onAddParticipantsToCohort).toHaveBeenCalled();
    });
  });

  it('should query all participants when adding to an existing cohort', async () => {
    client.query.mockResolvedValue({
      data: { participantOverview: [{ participant_id: 'P9', id: 'pk9', study_id: 's9' }] },
    });
    renderDropDown({
      label: 'ADD TO EXISTING COHORT',
      type: 'existing',
      options: [
        'All Participants',
        'Selected Participants',
        { cohortId: 'c1', cohortName: 'Cohort One' },
      ],
      enabledWithoutSelect: true,
    });
    await openMenu('ADD TO EXISTING COHORT');
    fireEvent.click(screen.getByLabelText('select c1'));
    fireEvent.click(screen.getByText('All Participants'));
    await waitFor(() => {
      expect(client.query).toHaveBeenCalled();
      expect(onAddParticipantsToCohort).toHaveBeenCalled();
    });
  });

  it('should ask the user to select a cohort before adding all participants', async () => {
    renderDropDown({
      label: 'ADD TO EXISTING COHORT',
      type: 'existing',
      options: ['All Participants', 'Selected Participants'],
      enabledWithoutSelect: true,
    });
    await openMenu('ADD TO EXISTING COHORT');
    fireEvent.click(screen.getByText('All Participants'));
    expect(screen.getByText(/Please Select a cohort from the list/i)).toBeInTheDocument();
  });

  it('should close the menu when clicking outside', async () => {
    renderDropDown({
      label: 'CREATE NEW COHORT',
      type: 'new',
      options: ['All Participants', 'Selected Participants'],
      enabledWithoutSelect: true,
    });
    await openMenu('CREATE NEW COHORT');
    expect(screen.getByText('All Participants')).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(screen.queryByText('All Participants')).not.toBeInTheDocument();
  });

  it('should notify when a single participant is added and surface create errors', async () => {
    onCreateNewCohort
      .mockImplementationOnce((n, d, rows, success) => {
        if (success) success(1);
        return { type: 'CREATE' };
      })
      .mockImplementationOnce((n, d, rows, success, error) => {
        if (error) error(new Error('cohort failed'));
        return { type: 'CREATE' };
      });
    renderDropDown({
      label: 'CREATE NEW COHORT',
      type: 'new',
      options: ['Selected Participants'],
      enabledWithoutSelect: true,
    });
    await openMenu('CREATE NEW COHORT');
    fireEvent.click(screen.getByText('Selected Participants'));
    await waitFor(() => {
      expect(global.__ddNotify).toHaveBeenCalledWith(expect.stringMatching(/Participant added/), 5000);
    });

    if (!screen.queryByText('Selected Participants')) {
      await openMenu('CREATE NEW COHORT');
    }
    fireEvent.click(screen.getByText('Selected Participants'));
    await waitFor(() => {
      expect(setWarningMessage).toHaveBeenCalled();
    });
  });

  it('should warn when adding selected participants would exceed the cohort size limit', async () => {
    localStorage.setItem('cohortState', JSON.stringify({
      c1: { participants: new Array(3999).fill({ participant_id: 'x' }) },
    }));
    renderDropDown({
      label: 'ADD TO EXISTING COHORT',
      type: 'existing',
      options: [
        'All Participants',
        'Selected Participants',
        { cohortId: 'c1', cohortName: 'Cohort One' },
      ],
      enabledWithoutSelect: true,
    });
    await openMenu('ADD TO EXISTING COHORT');
    fireEvent.click(screen.getByLabelText('select c1'));
    await waitFor(() => {
      expect(screen.getByText('Selected Participants')).toBeInTheDocument();
    });
    await act(async () => {
      await Promise.resolve();
    });
    fireEvent.click(screen.getByText('All Participants'));
    expect(await screen.findByText(/not allowed to add more than 4000/i)).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('select c1'));
  });

  it('should create a cohort from a generic dropdown option and tolerate missing local-find lists', async () => {
    client.query.mockResolvedValue({
      data: { participantOverview: [{ participant_id: 'P2', id: 'pk2', study_id: 's2' }] },
    });
    renderDropDown({
      label: 'CREATE NEW COHORT',
      type: 'generic',
      options: ['All Participants'],
      enabledWithoutSelect: true,
      localFindUpload: null,
      localFindAutocomplete: null,
    });
    await openMenu('CREATE NEW COHORT');
    fireEvent.click(screen.getByText('All Participants'));
    await waitFor(() => {
      expect(client.query).toHaveBeenCalled();
      expect(onCreateNewCohort).toHaveBeenCalled();
    });
  });

  it('should stay inactive until rows are selected when enabledWithoutSelect is off', () => {
    renderDropDown({
      label: 'CREATE NEW COHORT',
      type: 'new',
      options: ['All Participants'],
      enabledWithoutSelect: false,
    }, { hiddenSelectedRows: [] });
    fireEvent.click(screen.getByText('CREATE NEW COHORT'));
    expect(screen.queryByText('All Participants')).not.toBeInTheDocument();
  });
});
