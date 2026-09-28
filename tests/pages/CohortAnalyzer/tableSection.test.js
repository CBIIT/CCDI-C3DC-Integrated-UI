jest.mock('../../../src/pages/CohortAnalyzer/CohortAnalyzerTableSection/ButtonWithTooltip', () => ({
  ButtonWithTooltip: ({ children, onClick, disabled }) => (
    <button type="button" disabled={disabled} onClick={onClick}>{children}</button>
  ),
}));
jest.mock('@bento-core/paginated-table', () => ({
  TableView: () => <div>Participant table</div>,
}));
jest.mock('../../../src/pages/CohortAnalyzer/CreateNewCohortButton/CreateNewCohortButton', () => ({
  CreateNewCohortButton: () => <div>Create new</div>,
}));
jest.mock('../../../src/pages/CohortAnalyzer/downloadCohort/DownloadSelectedCohorts', () => () => (
  <div>Download results</div>
));

const mockAnalyzer = {
  selectedCohortSection: ['seg'],
  queryVariable: { id: ['p1'] },
  selectedCohorts: ['c1'],
  rowData: [{ id: 'p1' }],
  refreshTableContent: true,
};

jest.mock('../../../src/pages/CohortAnalyzer/context/CohortAnalyzerContext', () => ({
  useCohortAnalyzer: () => mockAnalyzer,
}));

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CohortAnalyzerTableSection } from '../../../src/pages/CohortAnalyzer/CohortAnalyzerTableSection/CohortAnalyzerTableSection';

const classes = {
  cohortCountSection: '',
  exploreButton: 'explore',
  exploreButtonFaded: 'faded',
  leftAlignedText: '',
  tableSectionOuterContainer: '',
  rightSideTableContainer: '',
};

describe('CohortAnalyzerTableSection', () => {
  it('should render the table and build in explore when cohorts are selected', () => {
    const handleBuildInExplore = jest.fn();
    render(
      <CohortAnalyzerTableSection
        classes={classes}
        questionIcon="q.svg"
        handleClick={jest.fn()}
        handleBuildInExplore={handleBuildInExplore}
        themeConfig={{}}
        initTblState={{}}
      />,
    );
    expect(screen.getByText('Participant table')).toBeInTheDocument();
    fireEvent.click(screen.getByText(/BUILD IN/));
    expect(handleBuildInExplore).toHaveBeenCalled();
  });
});
