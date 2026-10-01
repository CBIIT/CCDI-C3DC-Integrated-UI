jest.mock('@bento-core/tool-tip/dist/ToolTip', () => ({ children }) => children);

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CohortAnalyzerHeader from '../../../src/pages/CohortAnalyzer/components/CohortAnalyzerHeader';
import VennCategoryRadios from '../../../src/pages/CohortAnalyzer/components/VennCategoryRadios';

const classes = {
  vennToolbarRow: '',
  vennToolbarLeading: '',
  vennToolbarTitle: '',
  vennToolbarSpacer: '',
  vennToolbarTrailing: '',
  vennHeaderDivider: '',
};

describe('CohortAnalyzerHeader', () => {
  it('should expand and download the venn diagram when cohorts exist', () => {
    const onExpandVenn = jest.fn();
    const handleDownload = jest.fn();
    render(
      <CohortAnalyzerHeader
        classes={classes}
        selectedCohorts={['c1']}
        nodeIndex={0}
        setNodeIndex={jest.fn()}
        setRowData={jest.fn()}
        handleDownload={handleDownload}
        onExpandVenn={onExpandVenn}
      />,
    );
    expect(screen.getByText('Venn Diagram')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Expand Venn diagram'));
    expect(onExpandVenn).toHaveBeenCalled();
    fireEvent.click(screen.getByLabelText('Download Venn diagram'));
    expect(handleDownload).toHaveBeenCalled();
  });

  it('should disable download when no cohorts are selected', () => {
    render(
      <CohortAnalyzerHeader
        classes={classes}
        selectedCohorts={[]}
        nodeIndex={0}
        setNodeIndex={jest.fn()}
        setRowData={jest.fn()}
        handleDownload={jest.fn()}
      />,
    );
    expect(screen.getByLabelText('Download Venn diagram')).toBeDisabled();
  });
});

describe('VennCategoryRadios', () => {
  it('should change the matching category', () => {
    const setNodeIndex = jest.fn();
    const setRowData = jest.fn();
    render(
      <VennCategoryRadios
        selectedCohorts={['c1']}
        nodeIndex={0}
        setNodeIndex={setNodeIndex}
        setRowData={setRowData}
      />,
    );
    fireEvent.click(screen.getByLabelText('Diagnosis'));
    expect(setRowData).toHaveBeenCalledWith([]);
    expect(setNodeIndex).toHaveBeenCalledWith(1);
  });
});
