jest.mock('../../../src/components/CohortSelectorState/CohortStateContext', () => {
  const React = require('react');
  return { CohortStateContext: React.createContext({ state: {}, dispatch: jest.fn() }) };
});
jest.mock('@bento-core/tool-tip/dist/ToolTip', () => ({ children }) => children);
jest.mock('../../../src/components/EllipsisText', () => ({
  MiddleEllipsisText: ({ text }) => <span>{text}</span>,
}));
jest.mock('../../../src/pages/CohortAnalyzer/customCheckbox/CustomCheckbox', () => () => (
  <input type="checkbox" aria-label="cohort checkbox" />
));
jest.mock('../../../src/pages/CohortAnalyzer/CohortAnalyzerUtil/CohortAnalyzerUtil', () => ({
  handlePopup: jest.fn(),
  resetSelection: jest.fn(),
  sortBy: jest.fn(),
  sortByReturn: (type, keys) => keys,
}));

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CohortStateContext } from '../../../src/components/CohortSelectorState/CohortStateContext';
import { CohortSelector } from '../../../src/pages/CohortAnalyzer/CohortSelector/CohortSelector';
import {
  handlePopup,
  resetSelection,
  sortBy,
} from '../../../src/pages/CohortAnalyzer/CohortAnalyzerUtil/CohortAnalyzerUtil';

const mockAnalyzer = {
  selectedCohorts: ['cohort-a'],
  setSelectedCohorts: jest.fn(),
  setDeleteInfo: jest.fn(),
  deleteInfo: { showDeleteConfirmation: false },
  setNodeIndex: jest.fn(),
  setRowData: jest.fn(),
  cohortList: ['cohort-a'],
  setCohortList: jest.fn(),
  handleCheckbox: jest.fn(),
};

jest.mock('../../../src/pages/CohortAnalyzer/context/CohortAnalyzerContext', () => ({
  useCohortAnalyzer: () => mockAnalyzer,
}));

const cohortState = {
  'cohort-a': {
    cohortId: 'cohort-a',
    cohortName: 'Alpha',
    participants: [{ id: 'p1' }],
  },
};

function renderSelector(handleDemoClick) {
  return render(
    <CohortStateContext.Provider value={{ state: cohortState, dispatch: jest.fn() }}>
      <CohortSelector handleDemoClick={handleDemoClick} />
    </CohortStateContext.Provider>,
  );
}

describe('CohortSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should list cohorts and sort or reset selection', () => {
    renderSelector(jest.fn());
    expect(screen.getByText(/Cohort Selector/)).toBeInTheDocument();
    expect(screen.getByText(/Alpha \(1\)/)).toBeInTheDocument();
    fireEvent.click(screen.getByText('Sort Alphabetically'));
    expect(sortBy).toHaveBeenCalledWith('alphabet', mockAnalyzer.cohortList, mockAnalyzer.setCohortList, cohortState);
    fireEvent.click(screen.getByText('Sort by Count'));
    expect(sortBy).toHaveBeenCalledWith('count', mockAnalyzer.cohortList, mockAnalyzer.setCohortList, cohortState);
    fireEvent.click(screen.getByAltText('sortIcon'));
    expect(resetSelection).toHaveBeenCalled();
  });

  it('should open delete confirmation from a cohort trash icon', () => {
    renderSelector();
    fireEvent.click(screen.getAllByAltText('Trashcan')[1]);
    expect(handlePopup).toHaveBeenCalled();
  });

  it('should run the example-cohorts action when provided', () => {
    const handleDemoClick = jest.fn();
    renderSelector(handleDemoClick);
    fireEvent.click(screen.getByRole('button', { name: /add example cohorts/i }));
    expect(handleDemoClick).toHaveBeenCalled();
  });
});
