jest.mock('../../../src/components/CohortSelector/CohortContext.js', () => {
  const React = require('react');
  return { CohortContext: React.createContext({ state: { participants: [] }, dispatch: () => {} }) };
}, { virtual: true });

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CohortContext } from '../../../src/components/CohortSelector/CohortContext.js';
import CohortComponent from '../../../src/pages/inventory/CohortComponent';

describe('CohortComponent', () => {
  it('should add and remove participants', () => {
    const dispatch = jest.fn();
    render(
      <CohortContext.Provider value={{
        state: { cohort: 'C1', participants: [{ id: 1, name: 'Pat' }] },
        dispatch,
      }}
      >
        <CohortComponent />
      </CohortContext.Provider>,
    );
    expect(screen.getByText('Cohort: C1')).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText('Add participant'), { target: { value: 'New' } });
    fireEvent.click(screen.getByText('Add Participant'));
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'ADD_PARTICIPANT' }));
    fireEvent.click(screen.getByText('Remove'));
    expect(dispatch).toHaveBeenCalledWith({ type: 'REMOVE_PARTICIPANT', payload: 1 });
  });
});
