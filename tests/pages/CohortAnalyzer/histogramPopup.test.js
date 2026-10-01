const mockAnalyzer = {
  refreshTableContent: true,
  selectedCohorts: ['c1'],
  nodeIndex: 0,
  cohortData: { c1: { cohortName: 'Alpha', participants: [{ id: 'p1' }] } },
  setSelectedChart: jest.fn(),
  setRefreshSelectedChart: jest.fn(),
  setSelectedCohortSections: jest.fn(),
  selectedCohortSection: [],
  setGeneralInfo: jest.fn(),
  setAlert: jest.fn(),
  setNodeIndex: jest.fn(),
  setRowData: jest.fn(),
};

jest.mock('../../../src/pages/CohortAnalyzer/context/CohortAnalyzerContext', () => ({
  useCohortAnalyzer: () => mockAnalyzer,
}));
jest.mock('../../../src/pages/CohortAnalyzer/HistogramPanel/popup/HistogramPopupModalHeader', () => ({
  HistogramPopupModalHeader: ({
    setExpandedChart,
    setActiveTab,
    setShowDownloadDropdown,
    setShowChartTypeMenu,
    dropdownRef,
    chartTypeMenuRef,
    onSetChartVisual,
    activeTab,
    handleVennDownload,
  }) => (
    <div>
      <div ref={dropdownRef}>download ref</div>
      <div ref={chartTypeMenuRef}>chart type ref</div>
      <button type="button" onClick={() => setActiveTab('survivalAnalysis')}>Survival tab</button>
      <button type="button" onClick={() => setExpandedChart(null)}>Close modal</button>
      <button type="button" onClick={() => setShowDownloadDropdown(true)}>Open downloads</button>
      <button type="button" onClick={() => setShowChartTypeMenu(true)}>Open chart types</button>
      <button type="button" onClick={() => onSetChartVisual(activeTab, 'pie')}>Set pie</button>
      <button type="button" onClick={handleVennDownload}>Download Venn</button>
    </div>
  ),
}));
jest.mock('../../../src/pages/CohortAnalyzer/HistogramPanel/popup/HistogramPopupModalSurvivalTab', () => ({
  HistogramPopupModalSurvivalTab: ({ survivalAnalysisContainerRef }) => (
    <div
      ref={(node) => {
        survivalAnalysisContainerRef.current = node;
        if (node) Object.defineProperty(node, 'clientHeight', { value: 1000 });
      }}
    >
      Survival tab body
    </div>
  ),
}));
jest.mock('../../../src/pages/CohortAnalyzer/HistogramPanel/popup/HistogramPopupModalVennTab', () => ({
  HistogramPopupModalVennTab: ({ vennModalChartAreaRef, chartVennModalProps }) => (
    <div
      ref={(node) => {
        vennModalChartAreaRef.current = node;
        if (node) {
          node.getBoundingClientRect = () => ({ width: 640, height: 420 });
        }
      }}
    >
      <span>Venn tab body</span>
      <button type="button" onClick={() => chartVennModalProps.setSelectedChart(['p1'])}>
        Select Venn participants
      </button>
      <button
        type="button"
        onClick={() => chartVennModalProps.setSelectedCohortSections(['Alpha'])}
      >
        Select Venn section
      </button>
    </div>
  ),
}));
jest.mock('../../../src/pages/CohortAnalyzer/HistogramPanel/popup/HistogramPopupModalHistogramTab', () => ({
  HistogramPopupModalHistogramTab: ({ handleMouseEnter, handleMouseLeave }) => (
    <div>
      <span>Histogram tab body</span>
      <button type="button" onClick={() => handleMouseEnter('valueA')}>Hover modal bar</button>
      <button type="button" onClick={handleMouseLeave}>Leave modal bar</button>
    </div>
  ),
}));
jest.mock('../../../src/pages/CohortAnalyzer/HistogramPanel/utils/histogramModalSurvivalDownloads', () => ({
  createHistogramModalSurvivalDownloads: () => ({
    downloadKaplanMeierChart: jest.fn(),
    downloadRiskTable: jest.fn(),
    downloadBoth: jest.fn(),
  }),
}));

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExpandedChartModal from '../../../src/pages/CohortAnalyzer/HistogramPanel/popup/HistogramPopup';
import { CA_EXPANDED_CHART_MODAL_TAB_VENN } from '../../../src/pages/CohortAnalyzer/HistogramPanel/histogramConstants';

describe('ExpandedChartModal', () => {
  it('should render histogram content and close from the overlay', () => {
    const setExpandedChart = jest.fn();
    const onSetChartVisual = jest.fn();
    render(
      <ExpandedChartModal
        activeTab="sexAtBirth"
        setActiveTab={jest.fn()}
        setExpandedChart={setExpandedChart}
        viewType={{ sexAtBirth: 'count' }}
        setViewType={jest.fn()}
        data={{ sexAtBirth: [{ name: 'Female', valueA: 1 }] }}
        titles={{ sexAtBirth: 'Sex at Birth' }}
        downloadChart={jest.fn()}
        kmPlotData={[]}
        kmLoading={false}
        kmError={null}
        kmChartRef={{ current: null }}
        riskTableRef={{ current: null }}
        cohorts={[]}
        timeIntervals={[]}
        c1={['p1']}
        c2={[]}
        c3={[]}
        containerRef={{ current: document.createElement('div') }}
        canvasRef={{ current: document.createElement('canvas') }}
        cohortParticipantState={mockAnalyzer.cohortData}
        onSetChartVisual={onSetChartVisual}
      />,
    );
    expect(screen.getByText('Histogram tab body')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Hover modal bar'));
    fireEvent.click(screen.getByText('Leave modal bar'));
    fireEvent.click(screen.getByText('Open downloads'));
    fireEvent.click(screen.getByText('Open chart types'));
    fireEvent.click(screen.getByText('Set pie'));
    expect(onSetChartVisual).toHaveBeenCalledWith('sexAtBirth', 'pie');
    fireEvent.mouseDown(document.body);
    fireEvent.click(screen.getByText('Close modal'));
    expect(setExpandedChart).toHaveBeenCalledWith(null);
  });

  it('should render the venn tab when selected', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 200;
    canvas.getContext = () => ({
      fillStyle: '',
      fillRect: jest.fn(),
      drawImage: jest.fn(),
    });
    const originalCreateElement = document.createElement.bind(document);
    document.createElement = (tagName) => {
      const element = originalCreateElement(tagName);
      if (tagName === 'canvas') {
        element.getContext = canvas.getContext;
        element.toDataURL = () => 'data:image/png;base64,test';
      }
      if (tagName === 'a') element.click = jest.fn();
      return element;
    };
    render(
      <ExpandedChartModal
        activeTab={CA_EXPANDED_CHART_MODAL_TAB_VENN}
        setActiveTab={jest.fn()}
        setExpandedChart={jest.fn()}
        viewType={{}}
        setViewType={jest.fn()}
        data={{}}
        titles={{}}
        downloadChart={jest.fn()}
        kmPlotData={[]}
        kmLoading={false}
        kmError={null}
        kmChartRef={{ current: null }}
        riskTableRef={{ current: null }}
        cohorts={[]}
        timeIntervals={[]}
        c1={[]}
        c2={[]}
        c3={[]}
        containerRef={{ current: document.createElement('div') }}
        canvasRef={{ current: canvas }}
        cohortParticipantState={mockAnalyzer.cohortData}
      />,
    );
    expect(screen.getByText('Venn tab body')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Select Venn participants'));
    fireEvent.click(screen.getByText('Select Venn section'));
    expect(mockAnalyzer.setSelectedChart).toHaveBeenCalledWith(['p1']);
    expect(mockAnalyzer.setRefreshSelectedChart).toHaveBeenCalled();
    expect(mockAnalyzer.setSelectedCohortSections).toHaveBeenCalledWith(['Alpha']);
    fireEvent.click(screen.getByText('Download Venn'));
    expect(mockAnalyzer.setAlert).toHaveBeenCalled();
    document.createElement = originalCreateElement;
  });

  it('should render survival content and empty Venn cohorts', () => {
    const { rerender } = render(
      <ExpandedChartModal
        activeTab="survivalAnalysis"
        setActiveTab={jest.fn()}
        setExpandedChart={jest.fn()}
        viewType={{}}
        setViewType={jest.fn()}
        data={{}}
        titles={{}}
        downloadChart={jest.fn()}
        kmPlotData={[{ group: 'c1', time: 1 }]}
        kmLoading={false}
        kmError={null}
        kmChartRef={{ current: null }}
        riskTableRef={{ current: null }}
        cohorts={[]}
        timeIntervals={[]}
        c1={['p1']}
        c2={[]}
        c3={[]}
        containerRef={{ current: null }}
        canvasRef={{ current: null }}
        cohortParticipantState={mockAnalyzer.cohortData}
      />,
    );
    expect(screen.getByText('Survival tab body')).toBeInTheDocument();
    mockAnalyzer.selectedCohorts = [];
    rerender(
      <ExpandedChartModal
        activeTab={CA_EXPANDED_CHART_MODAL_TAB_VENN}
        setActiveTab={jest.fn()}
        setExpandedChart={jest.fn()}
        viewType={{}}
        setViewType={jest.fn()}
        data={{}}
        titles={{}}
        downloadChart={jest.fn()}
        kmPlotData={[]}
        kmLoading={false}
        kmError={null}
        kmChartRef={{ current: null }}
        riskTableRef={{ current: null }}
        cohorts={[]}
        timeIntervals={[]}
        c1={[]}
        c2={[]}
        c3={[]}
        containerRef={{ current: null }}
        canvasRef={{ current: null }}
        cohortParticipantState={{}}
      />,
    );
    expect(screen.getByText('Venn tab body')).toBeInTheDocument();
    mockAnalyzer.selectedCohorts = ['c1'];
  });
});
