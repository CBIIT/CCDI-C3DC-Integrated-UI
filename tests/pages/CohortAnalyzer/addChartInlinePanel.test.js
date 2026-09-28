import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddChartInlinePanel from '../../../src/pages/CohortAnalyzer/components/AddChartInlinePanel';

describe('AddChartInlinePanel', () => {
  it('should close and pick a catalog data type', () => {
    const onClose = jest.fn();
    const onCompleteWithChartType = jest.fn();
    render(
      <AddChartInlinePanel
        step={1}
        setStep={jest.fn()}
        selectedCatalogId={null}
        setSelectedCatalogId={jest.fn()}
        onClose={onClose}
        onCompleteWithChartType={onCompleteWithChartType}
        existingStripKeys={[]}
        selectedDatasets={[]}
      />,
    );
    expect(screen.getByText('Choose one:')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalled();
    fireEvent.click(screen.getByText('Sex at Birth'));
    expect(screen.getByText('Sex at Birth')).toBeInTheDocument();
  });

  it('should complete a chart type on step 2', () => {
    const onCompleteWithChartType = jest.fn();
    render(
      <AddChartInlinePanel
        step={2}
        setStep={jest.fn()}
        selectedCatalogId="sexAtBirth"
        setSelectedCatalogId={jest.fn()}
        onClose={jest.fn()}
        onCompleteWithChartType={onCompleteWithChartType}
        existingStripKeys={[]}
        selectedDatasets={[]}
      />,
    );
    fireEvent.click(screen.getByText('Bar Chart'));
    expect(onCompleteWithChartType).toHaveBeenCalled();
  });

  it('should add survival directly and support keyboard selection', () => {
    const onCompleteWithChartType = jest.fn();
    const setSelectedCatalogId = jest.fn();
    const setStep = jest.fn();
    render(
      <AddChartInlinePanel
        step={1}
        setStep={setStep}
        selectedCatalogId={null}
        setSelectedCatalogId={setSelectedCatalogId}
        onClose={jest.fn()}
        onCompleteWithChartType={onCompleteWithChartType}
        existingStripKeys={[]}
        selectedDatasets={[]}
      />,
    );
    fireEvent.click(screen.getByText('Survival Analysis'));
    expect(onCompleteWithChartType).toHaveBeenCalledWith(
      null,
      'survivalAnalysis',
    );
    fireEvent.keyDown(screen.getByText('Race').closest('[role="option"]'), {
      key: 'Enter',
    });
    expect(setSelectedCatalogId).toHaveBeenCalledWith('race');
    expect(setStep).toHaveBeenCalledWith(2);
  });

  it('should mark charts already in the layout as displayed', () => {
    render(
      <AddChartInlinePanel
        step={1}
        setStep={jest.fn()}
        selectedCatalogId="race"
        setSelectedCatalogId={jest.fn()}
        onCompleteWithChartType={jest.fn()}
        existingStripKeys={['race']}
        selectedDatasets={['survivalAnalysis']}
      />,
    );
    expect(screen.getAllByText('Displayed')).toHaveLength(2);
    expect(screen.getByText('Race').closest('[role="option"]')).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    fireEvent.click(screen.getByText('Race').closest('[role="option"]'));
  });

  it('should omit Close, ignore Space on displayed rows, and guard invalid step 2 picks', () => {
    const setStep = jest.fn();
    const onCompleteWithChartType = jest.fn();
    const { rerender } = render(
      <AddChartInlinePanel
        step={1}
        setStep={setStep}
        selectedCatalogId={null}
        setSelectedCatalogId={jest.fn()}
        onCompleteWithChartType={onCompleteWithChartType}
        existingStripKeys={['race']}
        selectedDatasets={[]}
      />,
    );
    expect(screen.queryByLabelText('Close')).not.toBeInTheDocument();
    fireEvent.keyDown(screen.getByText('Race').closest('[role="option"]'), { key: ' ' });
    expect(setStep).not.toHaveBeenCalled();

    fireEvent.keyDown(screen.getByText('Sex at Birth').closest('[role="option"]'), { key: ' ' });
    expect(setStep).toHaveBeenCalledWith(2);

    rerender(
      <AddChartInlinePanel
        step={2}
        setStep={setStep}
        selectedCatalogId="not-a-catalog"
        setSelectedCatalogId={jest.fn()}
        onCompleteWithChartType={onCompleteWithChartType}
        existingStripKeys={[]}
        selectedDatasets={[]}
      />,
    );
    expect(screen.getByText('Choose chart type:')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Bar Chart'));
    fireEvent.keyDown(screen.getByText('Bar Chart').closest('[role="option"]'), { key: ' ' });
    expect(onCompleteWithChartType).not.toHaveBeenCalled();
  });
});
