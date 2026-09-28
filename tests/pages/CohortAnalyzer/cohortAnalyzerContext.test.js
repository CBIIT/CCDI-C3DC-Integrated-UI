jest.mock('../../../src/components/CohortSelectorState/CohortStateContext', () => {
  const React = require('react');
  return {
    CohortStateContext: React.createContext({
      state: { c1: { cohortName: 'Alpha' } },
      dispatch: jest.fn(),
    }),
  };
});

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  CohortAnalyzerProvider,
  useCohortAnalyzer,
} from '../../../src/pages/CohortAnalyzer/context/CohortAnalyzerContext';

function Probe() {
  const {
    selectedCohorts,
    handleCheckbox,
    resetVennWorkspaceUi,
    nodeIndex,
    rowData,
  } = useCohortAnalyzer();
  return (
    <div>
      <span>selected:{selectedCohorts.join(',')}</span>
      <span>node:{nodeIndex}</span>
      <span>rows:{rowData.length}</span>
      <button type="button" onClick={(e) => handleCheckbox('c1', e)}>toggle</button>
      <button type="button" onClick={resetVennWorkspaceUi}>reset</button>
    </div>
  );
}

describe('CohortAnalyzerProvider', () => {
  it('should toggle selection and reset venn workspace ui', () => {
    render(
      <CohortAnalyzerProvider>
        <Probe />
      </CohortAnalyzerProvider>,
    );
    fireEvent.click(screen.getByText('toggle'));
    expect(screen.getByText('selected:c1')).toBeInTheDocument();
    fireEvent.click(screen.getByText('toggle'));
    expect(screen.getByText('selected:')).toBeInTheDocument();
    fireEvent.click(screen.getByText('reset'));
    expect(screen.getByText('node:0')).toBeInTheDocument();
  });
});
