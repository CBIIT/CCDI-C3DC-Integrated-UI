const mockSetExpandedChart = jest.fn();
const mockHistogramData = jest.fn(() => ({
  graphData: { sexAtBirth: [{ name: 'Female', valueA: 1 }] },
  fetchedData: {},
  viewType: { sexAtBirth: 'count' },
  setViewType: jest.fn(),
  activeTab: 'sexAtBirth',
  setActiveTab: jest.fn(),
  selectedDatasets: ['sexAtBirth', 'survivalAnalysis'],
  setSelectedDatasets: jest.fn(),
  expandedChart: null,
  setExpandedChart: mockSetExpandedChart,
  chartRef: { current: {} },
  downloadChart: jest.fn(),
}));
const mockBootstrap = jest.fn(() => ({
  stripOrder: ['sexAtBirth'],
  inlineAddStep: 1,
  setInlineAddStep: jest.fn(),
  inlineSelectedCatalogId: null,
  setInlineSelectedCatalogId: jest.fn(),
  finalizeInlineAddChart: jest.fn(),
  handleRemoveHistogramDataset: jest.fn(),
  survivalSelected: true,
}));
let mockLayout = {
  panelRegistry: {},
  besideStripPanelId: null,
  sizes: {},
  topRowOrder: ['venn', 'survival'],
  chartVisualByPanelId: {},
};

jest.mock('../../../src/pages/CohortAnalyzer/HistogramPanel/hooks/useHistogramData', () => ({
  useHistogramData: (...args) => mockHistogramData(...args),
}));
jest.mock('../../../src/pages/CohortAnalyzer/HistogramPanel/survival/useKmplot', () => () => ({
  data: [],
  loading: false,
  error: null,
}));
jest.mock('../../../src/pages/CohortAnalyzer/HistogramPanel/survival/useRiskTable', () => () => ({
  data: null,
}));
jest.mock('../../../src/pages/CohortAnalyzer/HistogramPanel/hooks/useHistogramPanelBootstrap', () => ({
  useHistogramPanelBootstrap: (...args) => mockBootstrap(...args),
}));
jest.mock('../../../src/pages/CohortAnalyzer/HistogramPanel/hooks/useHistogramStripDnD', () => ({
  useHistogramStripDnD: () => ({
    draggingDataset: null,
    beginStripChartDrag: jest.fn(),
    endStripChartDrag: jest.fn(),
    dragOverDataset: null,
    setDragOverDataset: jest.fn(),
    draggingCardDimensions: null,
    histogramDragSizeRef: { current: null },
    captureHistogramDragCardSize: jest.fn(),
    clearHistogramDragSize: jest.fn(),
    handleStripChartDragOver: jest.fn(),
    handleStripChartDrop: jest.fn(),
  }),
}));
jest.mock('../../../src/pages/CohortAnalyzer/HistogramPanel/hooks/useHistogramResizeHandlers', () => ({
  useHistogramResizeHandlers: () => ({
    handleHistogramCardResizeStart: jest.fn(),
    handleSurvivalCardResizeStart: jest.fn(),
  }),
}));
jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: (selector) => selector({
    cohortAnalyzerLayout: mockLayout,
  }),
}));
jest.mock('../../../src/pages/CohortAnalyzer/HistogramPanel/strip/HistogramStripChartRow', () => ({
  HistogramStripChartRow: (props) => (
    <div>
      <span>Strip {props.dataset}</span>
      <span>Title {props.getChartTitle(props.dataset)}</span>
      <button type="button" onClick={() => props.handleMouseEnter('valueA')}>Hover chart</button>
      <button type="button" onClick={props.handleMouseLeave}>Leave chart</button>
      <button
        type="button"
        onClick={() => {
          props.estimateHistogramCardDropSize(props.dataset);
          props.estimateHistogramCardDropSize(null);
          props.reportStripHeaderHeight(props.dataset, 88.2);
          props.reportStripHeaderHeight(null, 10);
          props.reportStripHeaderHeight(props.dataset, 0);
        }}
      >
        Measure strip
      </button>
    </div>
  ),
}));
jest.mock('../../../src/pages/CohortAnalyzer/HistogramPanel/strip/HistogramBesideVennHistogramPortal', () => ({
  HistogramBesideVennHistogramPortal: (props) => (
    <div>
      <span>Beside histogram</span>
      <button
        type="button"
        onClick={() => props.reportStripHeaderHeight(props.besideDatasetForColumn, 96)}
      >
        Measure beside
      </button>
    </div>
  ),
}));
jest.mock('../../../src/pages/CohortAnalyzer/HistogramPanel/survival/HistogramSurvivalLayoutFragments', () => ({
  HistogramSurvivalBesideVennPortal: () => <div>Beside survival</div>,
  SurvivalHistogramInlineLegacy: () => <div>Inline survival</div>,
}));
jest.mock('../../../src/pages/CohortAnalyzer/components/AddChartInlinePanel', () => () => (
  <div>Add chart panel</div>
));
jest.mock('../../../src/pages/CohortAnalyzer/HistogramPanel/popup/HistogramPopup', () => () => (
  <div>Expanded modal</div>
));
jest.mock('../../../src/pages/CohortAnalyzer/vennDiagram/VennDiagramContainer', () => () => (
  <div>Venn in strip</div>
));
jest.mock('../../../src/pages/CohortAnalyzer/HistogramPanel/survival/SurvivalAnalysisCardBody', () => ({
  SurvivalAnalysisCardBody: () => <div>Survival body</div>,
}));

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Histogram from '../../../src/pages/CohortAnalyzer/HistogramPanel/Histogram';

describe('Histogram panel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLayout = {
      panelRegistry: {},
      besideStripPanelId: null,
      sizes: {},
      topRowOrder: ['venn', 'survival'],
      chartVisualByPanelId: {},
    };
    mockHistogramData.mockImplementation(() => ({
      graphData: { sexAtBirth: [{ name: 'Female', valueA: 1 }] },
      fetchedData: {},
      viewType: { sexAtBirth: 'count' },
      setViewType: jest.fn(),
      activeTab: 'sexAtBirth',
      setActiveTab: jest.fn(),
      selectedDatasets: ['sexAtBirth', 'survivalAnalysis'],
      setSelectedDatasets: jest.fn(),
      expandedChart: null,
      setExpandedChart: mockSetExpandedChart,
      chartRef: { current: {} },
      downloadChart: jest.fn(),
    }));
    mockBootstrap.mockImplementation(() => ({
      stripOrder: ['sexAtBirth'],
      inlineAddStep: 1,
      setInlineAddStep: jest.fn(),
      inlineSelectedCatalogId: null,
      setInlineSelectedCatalogId: jest.fn(),
      finalizeInlineAddChart: jest.fn(),
      handleRemoveHistogramDataset: jest.fn(),
      survivalSelected: true,
    }));
  });

  it('should render strip rows and the inline add panel', () => {
    render(
      <Histogram
        c1={['p1']}
        c2={[]}
        c3={[]}
        c1Name="Alpha"
        inlineAddChartOpen
        onInlineAddChartClose={jest.fn()}
        onAllAddableChartsAddedChange={jest.fn()}
        onSurvivalBesideColumnActive={jest.fn()}
      />,
    );
    expect(screen.getByText('Strip sexAtBirth')).toBeInTheDocument();
    expect(screen.getByText('Add chart panel')).toBeInTheDocument();
    expect(screen.getByText('Beside histogram')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Hover chart'));
    fireEvent.click(screen.getByText('Leave chart'));
    fireEvent.click(screen.getByText('Measure strip'));
  });

  it('derives a beside histogram and renders remaining strip datasets', () => {
    mockHistogramData.mockImplementation(() => ({
      graphData: {
        sexAtBirth: [{ name: 'Female', valueA: 1 }],
        race: [{ name: 'Asian', valueA: 1 }],
      },
      fetchedData: {},
      viewType: { sexAtBirth: 'count', race: 'count' },
      setViewType: jest.fn(),
      activeTab: 'sexAtBirth',
      setActiveTab: jest.fn(),
      selectedDatasets: ['sexAtBirth', 'race'],
      setSelectedDatasets: jest.fn(),
      expandedChart: null,
      setExpandedChart: mockSetExpandedChart,
      chartRef: { current: {} },
      downloadChart: jest.fn(),
    }));
    mockBootstrap.mockReturnValue({
      stripOrder: ['sexAtBirth', 'race'],
      inlineAddStep: 1,
      setInlineAddStep: jest.fn(),
      inlineSelectedCatalogId: null,
      setInlineSelectedCatalogId: jest.fn(),
      finalizeInlineAddChart: jest.fn(),
      handleRemoveHistogramDataset: jest.fn(),
      survivalSelected: false,
    });
    render(
      <Histogram
        c1={['p1']}
        c2={[]}
        c3={[]}
        survivalBesideVennTarget={document.createElement('div')}
        onAllAddableChartsAddedChange={jest.fn()}
        onSurvivalBesideColumnActive={jest.fn()}
      />,
    );
    expect(screen.getByText('Strip race')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Measure beside'));
  });

  it('renders Venn, survival, and histogram panel tokens moved into the strip', () => {
    mockHistogramData.mockReturnValue({
      graphData: { race: [{ name: 'Asian', valueA: 1 }] },
      fetchedData: {},
      viewType: { race: 'count' },
      setViewType: jest.fn(),
      activeTab: 'race',
      setActiveTab: jest.fn(),
      selectedDatasets: ['race', 'survivalAnalysis'],
      setSelectedDatasets: jest.fn(),
      expandedChart: null,
      setExpandedChart: mockSetExpandedChart,
      chartRef: { current: {} },
      downloadChart: jest.fn(),
    });
    mockBootstrap.mockReturnValue({
      stripOrder: ['venn', 'race', 'survivalAnalysis'],
      inlineAddStep: 1,
      setInlineAddStep: jest.fn(),
      inlineSelectedCatalogId: null,
      setInlineSelectedCatalogId: jest.fn(),
      finalizeInlineAddChart: jest.fn(),
      handleRemoveHistogramDataset: jest.fn(),
      survivalSelected: true,
    });
    mockLayout.topRowOrder = [];
    render(
      <Histogram
        c1={['p1']}
        c2={[]}
        c3={[]}
        cohortParticipantState={{}}
        containerRef={{ current: null }}
        canvasRef={{ current: null }}
        onAllAddableChartsAddedChange={jest.fn()}
      />,
    );
    expect(screen.getByText('Venn in strip')).toBeInTheDocument();
    expect(screen.getByText('Strip race')).toBeInTheDocument();
    expect(screen.getByText('Survival body')).toBeInTheDocument();
    const dataTransfer = {
      setData: jest.fn(),
      setDragImage: jest.fn(),
      effectAllowed: '',
    };
    const survivalCard = screen
      .getByText('Survival body')
      .closest('[draggable="true"]');
    fireEvent.dragStart(survivalCard, { dataTransfer });
    fireEvent.dragEnd(survivalCard);
  });

  it('renders the expanded chart modal when a chart is expanded', () => {
    mockHistogramData.mockReturnValue({
      graphData: { sexAtBirth: [] },
      fetchedData: {},
      viewType: { sexAtBirth: 'count' },
      setViewType: jest.fn(),
      activeTab: 'sexAtBirth',
      setActiveTab: jest.fn(),
      selectedDatasets: ['sexAtBirth'],
      setSelectedDatasets: jest.fn(),
      expandedChart: 'sexAtBirth',
      setExpandedChart: mockSetExpandedChart,
      chartRef: { current: {} },
      downloadChart: jest.fn(),
    });
    mockBootstrap.mockReturnValue({
      stripOrder: ['sexAtBirth'],
      inlineAddStep: 1,
      setInlineAddStep: jest.fn(),
      inlineSelectedCatalogId: null,
      setInlineSelectedCatalogId: jest.fn(),
      finalizeInlineAddChart: jest.fn(),
      handleRemoveHistogramDataset: jest.fn(),
      survivalSelected: false,
    });
    render(
      <Histogram
        chartPreviewMode
        c1={[]}
        c2={[]}
        c3={[]}
        onAllAddableChartsAddedChange={jest.fn()}
      />,
    );
    expect(screen.getByText('Expanded modal')).toBeInTheDocument();
  });

  it('should use registry titles, persisted sizes, and export payloads', () => {
    const histogramExportRef = { current: null };
    mockLayout = {
      panelRegistry: { sexAtBirth: { label: 'Sex registry' }, race: { label: 'Race registry' } },
      besideStripPanelId: 'sexAtBirth',
      sizes: { sexAtBirth: { width: 410, plotHeight: 200 }, survival: { width: 500, height: 400 }, extra: { width: 1 } },
      topRowOrder: ['venn'],
      chartVisualByPanelId: {},
    };
    mockHistogramData.mockReturnValue({
      graphData: {
        sexAtBirth: [{ name: 'Female', valueA: 1 }],
        race: [{ name: 'Asian', valueA: 1 }],
      },
      fetchedData: {},
      viewType: { sexAtBirth: 'count', race: 'count' },
      setViewType: jest.fn(),
      activeTab: 'sexAtBirth',
      setActiveTab: jest.fn(),
      selectedDatasets: ['sexAtBirth', 'race'],
      setSelectedDatasets: jest.fn(),
      expandedChart: null,
      setExpandedChart: mockSetExpandedChart,
      chartRef: { current: {} },
      downloadChart: jest.fn(),
    });
    mockBootstrap.mockReturnValue({
      stripOrder: ['sexAtBirth', 'race'],
      inlineAddStep: 1,
      setInlineAddStep: jest.fn(),
      inlineSelectedCatalogId: null,
      setInlineSelectedCatalogId: jest.fn(),
      finalizeInlineAddChart: jest.fn(),
      handleRemoveHistogramDataset: jest.fn(),
      survivalSelected: false,
    });
    const { container } = render(
      <Histogram
        c1={['p1']}
        c2={[]}
        c3={[]}
        histogramExportRef={histogramExportRef}
        besidePanelDraggingRef={{ current: { kind: 'venn', width: 400, height: 300 } }}
        onSurvivalBesideColumnActive={jest.fn()}
      />,
    );
    expect(screen.getByText('Title Race registry')).toBeInTheDocument();
    expect(histogramExportRef.current.getChartExportPayload().chartTitles.sexAtBirth).toBe('Sex registry');
    const center = container.firstChild.children[2];
    fireEvent.dragLeave(center, { relatedTarget: center.firstChild });
    fireEvent.dragLeave(center, { relatedTarget: document.body });
  });
});
