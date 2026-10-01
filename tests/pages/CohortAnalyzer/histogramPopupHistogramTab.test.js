jest.mock('../../../src/pages/CohortAnalyzer/HistogramPanel/chart/HistogramDatasetChart', () => ({
  HistogramDatasetChart: () => <div>Dataset chart</div>,
  DEFAULT_CHART_TYPE: 'bar',
}));

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HistogramPopupModalHistogramTab } from '../../../src/pages/CohortAnalyzer/HistogramPanel/popup/HistogramPopupModalHistogramTab';

describe('HistogramPopupModalHistogramTab', () => {
  it('should switch count vs percentage and render a chart', () => {
    const setViewType = jest.fn();
    render(
      <HistogramPopupModalHistogramTab
        activeTab="sexAtBirth"
        data={{ sexAtBirth: [{ name: 'Female', c1: 1 }] }}
        viewType={{ sexAtBirth: 'count' }}
        setViewType={setViewType}
        chartVisualByPanelId={{}}
        valueA={1}
        valueB={0}
        valueC={0}
        modalHistogramDatasetChartHeight={200}
        cellHover={jest.fn()}
        handleMouseEnter={jest.fn()}
        handleMouseLeave={jest.fn()}
        c1Name="A"
        c2Name="B"
        c3Name="C"
      />,
    );
    fireEvent.click(screen.getByDisplayValue('percentage'));
    expect(setViewType).toHaveBeenCalled();
  });

  it('should show empty state when a dataset has no rows', () => {
    render(
      <HistogramPopupModalHistogramTab
        activeTab="sexAtBirth"
        data={{ sexAtBirth: [] }}
        viewType={{ sexAtBirth: 'count' }}
        setViewType={jest.fn()}
        chartVisualByPanelId={{}}
        valueA={0}
        valueB={0}
        valueC={0}
        modalHistogramDatasetChartHeight={200}
        cellHover={jest.fn()}
        handleMouseEnter={jest.fn()}
        handleMouseLeave={jest.fn()}
      />,
    );
    expect(screen.getByText('No data available.')).toBeInTheDocument();
  });
});
