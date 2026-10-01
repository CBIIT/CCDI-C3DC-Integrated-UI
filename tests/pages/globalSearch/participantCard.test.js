jest.mock('../../../src/pages/globalSearch/Cards/participant/CPIModal', () => () => (
  <div>CPI modal</div>
));

jest.mock('../../../src/pages/globalSearch/Cards/participant/WrapperService', () => ({
  getFilesID: jest.fn(() => () => Promise.resolve({ fileIDsFromList: ['file-a'] })),
}));

jest.mock('../../../src/components/CohortSelectorState/store/action', () => ({
  onAddParticipantsToCohort: jest.fn((id, rows, success, error) => {
    if (global.__cohortAddMode === 'zero' && success) success(0);
    else if (global.__cohortAddMode === 'error' && error) error(new Error('fail'));
    else if (success) success(1);
    return { type: 'ADD' };
  }),
}));

jest.mock('@bento-core/cart', () => ({
  formatCartAddMessage: () => 'added files',
  getCartAddCounts: (cartFiles, ids) => ({
    addedCount: (cartFiles || []).includes(ids[0]) ? 0 : 1,
    alreadyInCartCount: (cartFiles || []).includes(ids[0]) ? 1 : 0,
  }),
}));

jest.mock('../../../src/components/CohortSelectorState/CohortStateContext', () => {
  const React = require('react');
  return { CohortStateContext: React.createContext({ state: {}, dispatch: () => {} }) };
});

import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { CohortStateContext } from '../../../src/components/CohortSelectorState/CohortStateContext';
import ParticipantCard from '../../../src/pages/globalSearch/Cards/participant/ParticipantCard';
import { getFilesID } from '../../../src/pages/globalSearch/Cards/participant/WrapperService';
import { participantSearchCard } from '../../fixtures/globalSearch/globalSearchApiResponses';
import { mockTitleTruncation } from '../../helpers/mockTitleTruncation';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

function renderCard(overrides = {}, extraProps = {}) {
  const dispatch = jest.fn((action) => {
    if (typeof action === 'function') {
      action(dispatch);
    }
  });
  return {
    dispatch,
    ...render(
      <MemoryRouter>
        <CohortStateContext.Provider value={{
          state: { c1: { cohortName: 'Cohort One', cohortDescription: '' } },
          dispatch,
        }}
        >
          <ParticipantCard
            data={{ ...participantSearchCard, ...overrides }}
            addFiles={jest.fn()}
            client={{ query: jest.fn() }}
            cartFiles={[]}
            {...extraProps}
          />
        </CohortStateContext.Provider>
      </MemoryRouter>,
    ),
  };
}

describe('ParticipantCard', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    global.__cohortAddMode = 'ok';
    getFilesID.mockReset();
    getFilesID.mockImplementation(() => () => Promise.resolve({ fileIDsFromList: ['file-a'] }));
    global.MutationObserver = class MutationObserver {
      observe() {}

      disconnect() {}
    };
  });

  it('should explore, add to cart, add to a cohort, and open CPI mapping', async () => {
    const addFiles = jest.fn();
    const setOpenSnackbar = jest.fn();
    const { dispatch } = renderCard(
      { cpi_data: [{ associated_id: 'x' }] },
      { addFiles, setOpenSnackbar },
    );

    fireEvent.click(screen.getByRole('button', { name: /AVAILABLE ACTIONS/i }));
    fireEvent.click(screen.getByText('VIEW IN EXPLORE DASHBOARD'));
    expect(mockNavigate).toHaveBeenCalledWith('/exploreParticipants?p_id=PART-1');
    fireEvent.click(screen.getByText('ADD TO CART'));
    await waitFor(() => {
      expect(addFiles).toHaveBeenCalledWith(['file-a']);
    });
    fireEvent.click(screen.getByText('ADD TO EXISTING COHORT'));
    fireEvent.click(screen.getByText('Cohort One'));
    expect(dispatch).toHaveBeenCalled();
    fireEvent.click(screen.getByText('VIEW CPI MAPPING'));
    expect(screen.getByText('CPI modal')).toBeInTheDocument();
  });

  it('should skip cart actions when required props are missing', () => {
    renderCard();
    fireEvent.click(screen.getByRole('button', { name: /AVAILABLE ACTIONS/i }));
    fireEvent.click(screen.getByText('ADD TO CART'));
    expect(screen.queryByText('CPI modal')).not.toBeInTheDocument();
  });

  it('should warn when the cart is already at the file limit', async () => {
    const setAlterDisplay = jest.fn();
    renderCard(
      {},
      {
        addFiles: jest.fn(),
        client: { query: jest.fn() },
        cartFiles: new Array(200000).fill('x'),
        setAlterDisplay,
      },
    );
    fireEvent.click(screen.getByRole('button', { name: /AVAILABLE ACTIONS/i }));
    fireEvent.click(screen.getByText('ADD TO CART'));
    await waitFor(() => {
      expect(screen.getByText(/Cart limit reached/i)).toBeInTheDocument();
    });
    expect(setAlterDisplay).toHaveBeenCalledWith(true);
  });

  it('should expand long treatment fields and close the actions menu on outside click', () => {
    const restore = mockTitleTruncation();
    const longText = 'Chemotherapy '.repeat(20);
    renderCard({
      treatment_type_str: longText,
      treatment_agent_str: longText,
      cpi_data: [],
    });
    fireEvent.click(screen.getByRole('button', { name: /AVAILABLE ACTIONS/i }));
    expect(screen.getByText('VIEW IN EXPLORE DASHBOARD')).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(screen.queryByText('VIEW IN EXPLORE DASHBOARD')).not.toBeInTheDocument();

    const truncated = screen.getAllByText(/\.\.\.$/);
    expect(truncated.length).toBeGreaterThan(0);
    fireEvent.click(truncated[0]);
    restore();
  });

  it('should show an info toast when files are already in the cart', async () => {
    renderCard({}, { addFiles: jest.fn(), client: { query: jest.fn() }, cartFiles: ['file-a'] });
    fireEvent.click(screen.getByRole('button', { name: /AVAILABLE ACTIONS/i }));
    fireEvent.click(screen.getByText('ADD TO CART'));
    await waitFor(() => {
      expect(screen.getByText('added files')).toBeInTheDocument();
    });
  });

  it('should alert when adding files would push the cart over the limit', async () => {
    const setAlterDisplay = jest.fn();
    getFilesID.mockImplementation(() => () => Promise.resolve({
      fileIDsFromList: ['n1', 'n2'],
    }));
    renderCard({}, {
      addFiles: jest.fn(),
      client: { query: jest.fn() },
      cartFiles: new Array(199999).fill('old'),
      setAlterDisplay,
    });
    fireEvent.click(screen.getByRole('button', { name: /AVAILABLE ACTIONS/i }));
    fireEvent.click(screen.getByText('ADD TO CART'));
    await waitFor(() => {
      expect(setAlterDisplay).toHaveBeenCalledWith(true);
    });
  });

  it('should warn when a file query returns more files than the cart can hold', async () => {
    const setAlterDisplay = jest.fn();
    getFilesID.mockImplementation(() => () => Promise.resolve({
      fileIDsFromList: Array.from({ length: 200001 }, (_, i) => `f${i}`),
    }));
    renderCard({}, {
      addFiles: jest.fn(),
      client: { query: jest.fn() },
      cartFiles: [],
      setAlterDisplay,
    });
    fireEvent.click(screen.getByRole('button', { name: /AVAILABLE ACTIONS/i }));
    fireEvent.click(screen.getByText('ADD TO CART'));
    await waitFor(() => {
      expect(screen.getByText(/Cart limit reached/i)).toBeInTheDocument();
    });
    expect(setAlterDisplay).toHaveBeenCalledWith(true);
  });

  it('should tell the user when a participant is already in the selected cohort', () => {
    global.__cohortAddMode = 'zero';
    renderCard();
    fireEvent.click(screen.getByRole('button', { name: /AVAILABLE ACTIONS/i }));
    fireEvent.click(screen.getByText('ADD TO EXISTING COHORT'));
    fireEvent.click(screen.getByText('Cohort One'));
    expect(screen.getByText(/already in Cohort One/i)).toBeInTheDocument();
  });

  it('should show an error when adding to a cohort fails', () => {
    global.__cohortAddMode = 'error';
    renderCard();
    fireEvent.click(screen.getByRole('button', { name: /AVAILABLE ACTIONS/i }));
    fireEvent.click(screen.getByText('ADD TO EXISTING COHORT'));
    fireEvent.click(screen.getByText('Cohort One'));
    expect(screen.getByText(/Failed to add participant to Cohort One/i)).toBeInTheDocument();
  });
});
