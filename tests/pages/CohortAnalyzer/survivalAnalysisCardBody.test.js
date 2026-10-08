jest.mock('@bento-core/tool-tip/dist/ToolTip', () => ({ children }) => children);
jest.mock('@bento-core/kmplot', () => ({
  KaplanMeierChart: () => <div>KM chart</div>,
}));
jest.mock('@bento-core/risk-table', () => () => <div>Risk table</div>);
jest.mock('../../../src/pages/CohortAnalyzer/HistogramPanel/utils/histogramSurvivalDownloads', () => ({
  downloadKaplanMeierChart: jest.fn(),
  downloadRiskTable: jest.fn(),
  downloadSurvivalCombined: jest.fn(),
}));

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SurvivalAnalysisCardBody } from '../../../src/pages/CohortAnalyzer/HistogramPanel/survival/SurvivalAnalysisCardBody';
import {
  downloadKaplanMeierChart,
  downloadRiskTable,
  downloadSurvivalCombined,
} from '../../../src/pages/CohortAnalyzer/HistogramPanel/utils/histogramSurvivalDownloads';

const classes = { headerCloseButton: '' };

describe('SurvivalAnalysisCardBody', () => {
  it('should expand, download, and remove the survival card when data exists', () => {
    const setExpandedChart = jest.fn();
    const setActiveTab = jest.fn();
    const setShowDownloadDropdown = jest.fn();
    const handleRemoveHistogramDataset = jest.fn();
    render(
      <SurvivalAnalysisCardBody
        besideVenn={false}
        classes={classes}
        c1Name="A"
        allInputsEmpty={false}
        kmChartRef={{ current: null }}
        survivalAnalysisContainerRef={{ current: { clientHeight: 400 } }}
        riskTableRef={{ current: null }}
        filteredKmPlotData={[{ time: 1 }]}
        kmLoading={false}
        kmError={null}
        cohortColors={['#000']}
        cohorts={[{ name: 'A' }]}
        timeIntervals={[0]}
        showDownloadDropdown={false}
        setShowDownloadDropdown={setShowDownloadDropdown}
        dropdownRef={{ current: null }}
        setExpandedChart={setExpandedChart}
        setActiveTab={setActiveTab}
        handleRemoveHistogramDataset={handleRemoveHistogramDataset}
      />,
    );
    expect(screen.getByText('Overall Survival')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Expand survival chart'));
    expect(setExpandedChart).toHaveBeenCalledWith('survivalAnalysis');
    fireEvent.click(screen.getByLabelText('Survival chart download options'));
    expect(setShowDownloadDropdown).toHaveBeenCalled();
    fireEvent.click(screen.getByLabelText('Remove survival chart from layout'));
    expect(handleRemoveHistogramDataset).toHaveBeenCalledWith('survivalAnalysis');
  });

  it('should show empty state when there is no km data', () => {
    render(
      <SurvivalAnalysisCardBody
        besideVenn={false}
        classes={classes}
        allInputsEmpty={false}
        kmChartRef={{ current: null }}
        survivalAnalysisContainerRef={{ current: null }}
        riskTableRef={{ current: null }}
        filteredKmPlotData={[]}
        kmLoading={false}
        kmError={null}
        cohortColors={[]}
        cohorts={[]}
        timeIntervals={[]}
        showDownloadDropdown={false}
        setShowDownloadDropdown={jest.fn()}
        dropdownRef={{ current: null }}
        setExpandedChart={jest.fn()}
        setActiveTab={jest.fn()}
        handleRemoveHistogramDataset={jest.fn()}
      />,
    );
    expect(screen.getByText('No data available.')).toBeInTheDocument();
  });

  it('should execute every survival download action beside Venn', () => {
    const setShowDownloadDropdown = jest.fn();
    const kmChartRef = { current: document.createElement('div') };
    const riskTableRef = { current: document.createElement('div') };
    const survivalAnalysisContainerRef = { current: document.createElement('div') };
    render(
      <SurvivalAnalysisCardBody
        besideVenn
        classes={classes}
        c1Name="Alpha"
        c2Name="Beta"
        allInputsEmpty={false}
        kmChartRef={kmChartRef}
        survivalAnalysisContainerRef={survivalAnalysisContainerRef}
        riskTableRef={riskTableRef}
        filteredKmPlotData={[{ time: 1 }]}
        kmLoading={false}
        kmError={null}
        cohortColors={['#000']}
        cohorts={[{ name: 'Alpha' }]}
        timeIntervals={[0]}
        showDownloadDropdown
        setShowDownloadDropdown={setShowDownloadDropdown}
        dropdownRef={{ current: null }}
        setExpandedChart={jest.fn()}
        setActiveTab={jest.fn()}
        handleRemoveHistogramDataset={jest.fn()}
        vennHeaderGrab={<span>drag handle</span>}
        besideCardDrag={{ draggable: true }}
      />,
    );
    fireEvent.keyDown(screen.getByLabelText(/Drag to swap with Venn/i), { key: 'Enter' });
    fireEvent.keyDown(screen.getByLabelText(/Drag to swap with Venn/i), { key: ' ' });
    fireEvent.click(screen.getByText('Kaplan Meier Plot'));
    fireEvent.click(screen.getByText('Risk Table'));
    fireEvent.click(screen.getByText('Download Both'));
    expect(downloadKaplanMeierChart).toHaveBeenCalledWith(kmChartRef);
    expect(downloadRiskTable).toHaveBeenCalledWith(riskTableRef);
    expect(downloadSurvivalCombined).toHaveBeenCalled();
  });

  it('should disable actions while all inputs are empty', () => {
    render(
      <SurvivalAnalysisCardBody
        besideVenn={false}
        classes={classes}
        allInputsEmpty
        kmChartRef={{ current: null }}
        survivalAnalysisContainerRef={{ current: null }}
        riskTableRef={{ current: null }}
        filteredKmPlotData={[]}
        kmLoading
        kmError={new Error('failed')}
        cohortColors={[]}
        cohorts={[]}
        timeIntervals={[]}
        showDownloadDropdown={false}
        setShowDownloadDropdown={jest.fn()}
        dropdownRef={{ current: null }}
        setExpandedChart={jest.fn()}
        setActiveTab={jest.fn()}
        handleRemoveHistogramDataset={jest.fn()}
      />,
    );
    expect(screen.getByLabelText('Expand survival chart')).toBeDisabled();
    expect(screen.getByLabelText('Survival chart download options')).toBeDisabled();
  });

  it('should measure and resize survival content across viewport tiers', () => {
    const body = document.createElement('div');
    Object.defineProperty(body, 'clientHeight', { value: 420 });
    const originalRect = HTMLElement.prototype.getBoundingClientRect;
    HTMLElement.prototype.getBoundingClientRect = () => ({
      width: 700,
      height: 520,
      top: 0,
      left: 0,
      right: 700,
      bottom: 520,
    });
    global.ResizeObserver = class {
      constructor(callback) {
        this.callback = callback;
      }

      observe() {
        this.callback();
      }

      disconnect() {}
    };
    Object.defineProperty(window, 'innerWidth', { value: 900, writable: true });
    render(
      <SurvivalAnalysisCardBody
        besideVenn={false}
        classes={classes}
        chartPreviewMode
        allInputsEmpty={false}
        survivalCardSize={{ height: 9999 }}
        kmChartRef={{ current: null }}
        survivalAnalysisContainerRef={{ current: body }}
        riskTableRef={{ current: null }}
        filteredKmPlotData={[]}
        kmLoading={false}
        kmError={null}
        cohortColors={[]}
        cohorts={[]}
        timeIntervals={[]}
        showDownloadDropdown={false}
        setShowDownloadDropdown={jest.fn()}
        dropdownRef={{ current: null }}
        setExpandedChart={jest.fn()}
        setActiveTab={jest.fn()}
        handleRemoveHistogramDataset={jest.fn()}
      />,
    );
    Object.defineProperty(window, 'innerWidth', { value: 1900, writable: true });
    fireEvent(window, new Event('resize'));
    expect(screen.getByText('KM chart')).toBeInTheDocument();
    HTMLElement.prototype.getBoundingClientRect = originalRect;
  });
});
