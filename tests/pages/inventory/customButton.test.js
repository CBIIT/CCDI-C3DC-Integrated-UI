jest.mock('../../../src/components/Global/GlobalProvider', () => ({
  useGlobal: () => ({ Notification: { show: (...args) => global.__cohortBtnNotify(...args) } }),
}));

jest.mock('../../../src/components/CohortSelectorState/store/action', () => ({
  onCreateNewCohort: (...args) => ({ type: 'CREATE', args }),
}));

jest.mock('../../../src/components/CohortModal/components/shared/ConfirmationModal', () => ({ open, message, setOpen, handleDelete }) => (
  open ? (
    <div>
      <span>{message}</span>
      <button type="button" onClick={setOpen}>close-popup</button>
      <button type="button" onClick={handleDelete}>confirm-popup</button>
    </div>
  ) : null
));

jest.mock('@bento-core/paginated-table', () => ({
  onRowSeclect: (rows) => ({ type: 'SELECT', rows }),
  TableContext: require('react').createContext({
    context: { hiddenSelectedRows: ['p1'], dispatch: jest.fn() },
  }),
}));

jest.mock('@bento-core/paginated-table/dist/table/state/Actions', () => ({
  onRowSelectHidden: (rows) => ({ type: 'HIDDEN', rows }),
}));

jest.mock('../../../src/components/CohortSelectorState/CohortStateContext', () => {
  const React = require('react');
  return {
    CohortStateContext: React.createContext({
      state: {},
      dispatch: jest.fn(),
    }),
  };
});

jest.mock('../../../src/components/CohortModal/CohortModalContext', () => {
  const React = require('react');
  return {
    CohortModalContext: React.createContext({
      setShowCohortModal: jest.fn(),
    }),
  };
});

import React, { useContext } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TableContext } from '@bento-core/paginated-table';
import { CohortStateContext } from '../../../src/components/CohortSelectorState/CohortStateContext';
import { CohortModalContext } from '../../../src/components/CohortModal/CohortModalContext';
import { CustomButton } from '../../../src/pages/inventory/tabs/wrapperConfig/customButton';

describe('CustomButton', () => {
  beforeEach(() => {
    global.__cohortBtnNotify = jest.fn();
  });

  function renderCreate({
    rows = ['p1'],
    state = {},
    dispatch = jest.fn(),
    label = 'CREATE',
  } = {}) {
    return render(
      <CohortStateContext.Provider value={{ state, dispatch }}>
        <CohortModalContext.Provider value={{ setShowCohortModal: jest.fn() }}>
          <TableContext.Provider value={{ context: { hiddenSelectedRows: rows, dispatch: jest.fn() } }}>
            <CustomButton
              label={label}
              type="NEW"
              backgroundColor="#000"
              hoverColor="#111"
              borderColor="#222"
            />
          </TableContext.Provider>
        </CohortModalContext.Provider>
      </CohortStateContext.Provider>,
    );
  }

  it('should open the cohort modal for VIEW when cohorts exist', () => {
    const setShowCohortModal = jest.fn();
    render(
      <CohortModalContext.Provider value={{ setShowCohortModal }}>
        <CustomButton
          label="VIEW ALL COHORTS"
          type="VIEW"
          cohortsAvailable
          backgroundColor="#000"
          hoverColor="#111"
          borderColor="#222"
        />
      </CohortModalContext.Provider>,
    );
    fireEvent.click(screen.getByText('VIEW ALL COHORTS'));
    expect(setShowCohortModal).toHaveBeenCalledWith(true);
  });

  it('should warn when creating a twenty-first cohort', () => {
    const twenty = {};
    for (let i = 0; i < 20; i += 1) twenty[`c${i}`] = {};
    render(
      <CohortStateContext.Provider value={{ state: twenty, dispatch: jest.fn() }}>
        <CohortModalContext.Provider value={{ setShowCohortModal: jest.fn() }}>
          <TableContext.Provider value={{ context: { hiddenSelectedRows: ['p1'], dispatch: jest.fn() } }}>
            <CustomButton
              label="CREATE"
              type="NEW"
              backgroundColor="#000"
              hoverColor="#111"
              borderColor="#222"
            />
          </TableContext.Provider>
        </CohortModalContext.Provider>
      </CohortStateContext.Provider>,
    );
    fireEvent.click(screen.getByText('CREATE'));
    expect(screen.getByText(/20 cohorts/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText('close-popup'));
    expect(screen.queryByText(/20 cohorts/i)).not.toBeInTheDocument();
  });

  it('should ignore clicks when no participants are selected', () => {
    const dispatch = jest.fn();
    renderCreate({ rows: [], dispatch });
    fireEvent.click(screen.getByText('CREATE'));
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('should ignore a VIEW click when no cohorts are available', () => {
    const setShowCohortModal = jest.fn();
    render(
      <CohortModalContext.Provider value={{ setShowCohortModal }}>
        <CustomButton
          label="VIEW ALL COHORTS"
          type="VIEW"
          cohortsAvailable={false}
          backgroundColor="#000"
          hoverColor="#111"
          borderColor="#222"
        />
      </CohortModalContext.Provider>,
    );
    fireEvent.click(screen.getByText('VIEW ALL COHORTS'));
    expect(setShowCohortModal).not.toHaveBeenCalled();
  });

  it('should warn when more than 4000 participants are selected', () => {
    renderCreate({ rows: Array.from({ length: 4001 }, (_, i) => `p${i}`) });
    fireEvent.click(screen.getByText('CREATE'));
    expect(screen.getByText(/4000 participants/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText('confirm-popup'));
  });

  it('should create a cohort and notify for one or many participants', () => {
    const setShowCohortModal = jest.fn();
    const dispatch = jest.fn((action) => {
      action.args[3](action.args[2].length);
    });
    const { rerender } = render(
      <CohortStateContext.Provider value={{ state: { c1: {} }, dispatch }}>
        <CohortModalContext.Provider value={{ setShowCohortModal }}>
          <TableContext.Provider value={{ context: { hiddenSelectedRows: ['p1'], dispatch: jest.fn() } }}>
            <CustomButton label="CREATE" type="NEW" backgroundColor="#000" hoverColor="#111" borderColor="#222" />
          </TableContext.Provider>
        </CohortModalContext.Provider>
      </CohortStateContext.Provider>,
    );
    fireEvent.click(screen.getByText('CREATE'));
    expect(global.__cohortBtnNotify).toHaveBeenCalledWith(expect.stringContaining('Participant added'), 5000);
    expect(setShowCohortModal).toHaveBeenCalledWith(true);

    global.__cohortBtnNotify.mockClear();
    rerender(
      <CohortStateContext.Provider value={{ state: null, dispatch }}>
        <CohortModalContext.Provider value={{ setShowCohortModal }}>
          <TableContext.Provider value={{ context: { hiddenSelectedRows: ['p1', 'p2'], dispatch: jest.fn() } }}>
            <CustomButton label="CREATE" type="NEW" backgroundColor="#000" hoverColor="#111" borderColor="#222" />
          </TableContext.Provider>
        </CohortModalContext.Provider>
      </CohortStateContext.Provider>,
    );
    fireEvent.click(screen.getByText('CREATE'));
    expect(global.__cohortBtnNotify).toHaveBeenCalledWith(expect.stringContaining('Participants added'), 5000);
  });

  it('should alert when cohort creation fails and tolerate a non-array selection', () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    const dispatch = jest.fn((action) => action.args[4]('failed'));
    renderCreate({ rows: { length: 1 }, state: 'not-an-object', dispatch, label: 'CREATE' });
    fireEvent.click(screen.getByText('CREATE'));
    expect(alertSpy).toHaveBeenCalledWith('failed');
    alertSpy.mockRestore();
  });
});
