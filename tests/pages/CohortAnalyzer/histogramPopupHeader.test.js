import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HistogramPopupModalHeader } from '../../../src/pages/CohortAnalyzer/HistogramPanel/popup/HistogramPopupModalHeader';
import { CA_EXPANDED_CHART_MODAL_TAB_VENN } from '../../../src/pages/CohortAnalyzer/HistogramPanel/histogramConstants';

describe('HistogramPopupModalHeader', () => {
  it('should switch histogram tabs and close', () => {
    const setActiveTab = jest.fn();
    const setExpandedChart = jest.fn();
    const downloadChart = jest.fn();
    render(
      <HistogramPopupModalHeader
        activeTab="sexAtBirth"
        setActiveTab={setActiveTab}
        setExpandedChart={setExpandedChart}
        data={{ sexAtBirth: {} }}
        titles={{ sexAtBirth: 'Sex at Birth', survivalAnalysis: 'Survival' }}
        downloadChart={downloadChart}
        survivalModalHasNoDisplayData={false}
        showDownloadDropdown={false}
        setShowDownloadDropdown={jest.fn()}
        dropdownRef={{ current: null }}
        downloadKaplanMeierChart={jest.fn()}
        downloadRiskTable={jest.fn()}
        downloadBoth={jest.fn()}
        kmChartRef={{}}
        riskTableRef={{}}
        vennModalCanDownload
        handleVennDownload={jest.fn()}
        showChartTypeMenu={false}
        setShowChartTypeMenu={jest.fn()}
        chartTypeMenuRef={{ current: null }}
        chartVisualByPanelId={{}}
        onSetChartVisual={jest.fn()}
      />,
    );
    fireEvent.click(screen.getByText('Venn Diagrams'));
    expect(setActiveTab).toHaveBeenCalledWith(CA_EXPANDED_CHART_MODAL_TAB_VENN);
    fireEvent.click(screen.getByText('Survival'));
    expect(setActiveTab).toHaveBeenCalledWith('survivalAnalysis');
    fireEvent.click(screen.getByAltText('download'));
    expect(downloadChart).toHaveBeenCalledWith('sexAtBirth', true);
  });

  it('should download the expanded venn when enabled', () => {
    const handleVennDownload = jest.fn();
    const { container } = render(
      <HistogramPopupModalHeader
        activeTab={CA_EXPANDED_CHART_MODAL_TAB_VENN}
        setActiveTab={jest.fn()}
        setExpandedChart={jest.fn()}
        data={{}}
        titles={{}}
        downloadChart={jest.fn()}
        survivalModalHasNoDisplayData={false}
        showDownloadDropdown={false}
        setShowDownloadDropdown={jest.fn()}
        dropdownRef={{ current: null }}
        downloadKaplanMeierChart={jest.fn()}
        downloadRiskTable={jest.fn()}
        downloadBoth={jest.fn()}
        kmChartRef={{}}
        riskTableRef={{}}
        vennModalCanDownload
        handleVennDownload={handleVennDownload}
        showChartTypeMenu={false}
        setShowChartTypeMenu={jest.fn()}
        chartTypeMenuRef={{ current: null }}
        chartVisualByPanelId={{}}
        onSetChartVisual={jest.fn()}
      />,
    );
    const vennDownload = container.querySelector('img[alt=""]');
    fireEvent.click(vennDownload.closest('button') || vennDownload.parentElement);
    expect(handleVennDownload).toHaveBeenCalled();
  });

  it('should run survival download menu actions', () => {
    const downloadKaplanMeierChart = jest.fn();
    const downloadRiskTable = jest.fn();
    const downloadBoth = jest.fn();
    render(
      <HistogramPopupModalHeader
        activeTab="survivalAnalysis"
        setActiveTab={jest.fn()}
        setExpandedChart={jest.fn()}
        data={{}}
        titles={{ survivalAnalysis: 'Survival' }}
        downloadChart={jest.fn()}
        survivalModalHasNoDisplayData={false}
        showDownloadDropdown
        setShowDownloadDropdown={jest.fn()}
        dropdownRef={{ current: null }}
        downloadKaplanMeierChart={downloadKaplanMeierChart}
        downloadRiskTable={downloadRiskTable}
        downloadBoth={downloadBoth}
        kmChartRef={{ current: 'km' }}
        riskTableRef={{ current: 'risk' }}
        vennModalCanDownload={false}
        handleVennDownload={jest.fn()}
        showChartTypeMenu={false}
        setShowChartTypeMenu={jest.fn()}
        chartTypeMenuRef={{ current: null }}
        chartVisualByPanelId={{}}
        onSetChartVisual={jest.fn()}
      />,
    );
    fireEvent.click(screen.getByText('Kaplan-Meier'));
    fireEvent.click(screen.getByText('Risk Table'));
    fireEvent.click(screen.getByText('Download Both'));
    expect(downloadKaplanMeierChart).toHaveBeenCalled();
    expect(downloadRiskTable).toHaveBeenCalled();
    expect(downloadBoth).toHaveBeenCalled();
  });

  it('should select a chart type and close the modal', () => {
    const onSetChartVisual = jest.fn();
    const setShowChartTypeMenu = jest.fn();
    const setExpandedChart = jest.fn();
    render(
      <HistogramPopupModalHeader
        activeTab="race"
        setActiveTab={jest.fn()}
        setExpandedChart={setExpandedChart}
        data={{ race: [] }}
        titles={{ race: 'Race' }}
        downloadChart={jest.fn()}
        survivalModalHasNoDisplayData={false}
        showDownloadDropdown={false}
        setShowDownloadDropdown={jest.fn()}
        dropdownRef={{ current: null }}
        downloadKaplanMeierChart={jest.fn()}
        downloadRiskTable={jest.fn()}
        downloadBoth={jest.fn()}
        kmChartRef={{}}
        riskTableRef={{}}
        vennModalCanDownload={false}
        handleVennDownload={jest.fn()}
        showChartTypeMenu
        setShowChartTypeMenu={setShowChartTypeMenu}
        chartTypeMenuRef={{ current: null }}
        chartVisualByPanelId={{ race: 'verticalBar' }}
        onSetChartVisual={onSetChartVisual}
      />,
    );
    fireEvent.click(screen.getByLabelText('Pie chart'));
    expect(onSetChartVisual).toHaveBeenCalledWith('race', 'pie');
    expect(setShowChartTypeMenu).toHaveBeenCalledWith(false);
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[buttons.length - 1]);
    expect(setExpandedChart).toHaveBeenCalledWith(null);
  });
});
