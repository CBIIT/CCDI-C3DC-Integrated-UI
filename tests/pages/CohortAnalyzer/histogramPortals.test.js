jest.mock('@bento-core/tool-tip/dist/ToolTip', () => ({ children }) => children);
jest.mock('../../../src/pages/CohortAnalyzer/HistogramPanel/chart/HistogramDatasetChart', () => ({
  HistogramDatasetChart: () => <div>Beside dataset chart</div>,
  DEFAULT_CHART_TYPE: 'verticalBar',
  CHART_TYPE_KEYS: {
    PIE: 'pie',
    VERTICAL_BAR: 'verticalBar',
    HORIZONTAL_BAR: 'horizontalBar',
    LINE: 'line',
  },
}));
jest.mock('../../../src/pages/CohortAnalyzer/HistogramPanel/survival/SurvivalAnalysisCardBody', () => ({
  SurvivalAnalysisCardBody: ({ besideVenn }) => (
    <div>{besideVenn ? 'Beside survival body' : 'Inline survival body'}</div>
  ),
}));

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HistogramBesideVennHistogramPortal } from '../../../src/pages/CohortAnalyzer/HistogramPanel/strip/HistogramBesideVennHistogramPortal';
import {
  HistogramSurvivalBesideVennPortal,
  SurvivalHistogramInlineLegacy,
} from '../../../src/pages/CohortAnalyzer/HistogramPanel/survival/HistogramSurvivalLayoutFragments';

const rows = [{ name: 'Female', valueA: 2, valueB: 0, valueC: 0 }];
const classes = {
  headerCloseButton: '',
  chartContentWrapper: '',
  chartPlotArea: '',
};

function portalProps(target, overrides = {}) {
  return {
    survivalSelected: false,
    besideDatasetForColumn: 'sexAtBirth',
    survivalBesideVennTarget: target,
    chartRef: { current: {} },
    histogramCardSizes: { sexAtBirth: { width: 420, plotHeight: 230 } },
    allInputsEmpty: false,
    beginStripChartDrag: jest.fn(),
    endStripChartDrag: jest.fn(),
    setDragOverDataset: jest.fn(),
    captureHistogramDragCardSize: jest.fn(),
    clearHistogramDragSize: jest.fn(),
    getChartTitle: () => 'Sex at Birth',
    data: { sexAtBirth: rows },
    filteredData: { sexAtBirth: rows },
    viewType: { sexAtBirth: 'count' },
    chartVisualByPanelId: {},
    besideHistogramBarSums: { valueA: 2, valueB: 0, valueC: 0 },
    besideStripPlotHeight: 230,
    defaultPlotHeightPx: 240,
    besideColumnPlotHeightPx: 250,
    cellHover: { current: null },
    handleMouseEnter: jest.fn(),
    handleMouseLeave: jest.fn(),
    classes,
    setExpandedChart: jest.fn(),
    setActiveTab: jest.fn(),
    downloadChart: jest.fn(),
    handleRemoveHistogramDataset: jest.fn(),
    handleHistogramCardResizeStart: jest.fn(),
    c1Name: 'Alpha',
    c2Name: '',
    c3Name: '',
    draggingDataset: null,
    chartTypeMenuDataset: null,
    setChartTypeMenuDataset: jest.fn(),
    chartTypeMenuRef: { current: null },
    setChartVisualForPanel: jest.fn(),
    reportStripHeaderHeight: jest.fn(),
    ...overrides,
  };
}

describe('histogram and survival portals', () => {
  let target;

  beforeEach(() => {
    target = document.createElement('div');
    document.body.appendChild(target);
  });

  afterEach(() => {
    target.remove();
  });

  it('renders and interacts with the histogram beside Venn', () => {
    const props = portalProps(target);
    const { rerender } = render(<HistogramBesideVennHistogramPortal {...props} />);

    expect(screen.getByText('Sex at Birth')).toBeInTheDocument();
    expect(screen.getByText('Beside dataset chart')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Chart type'));
    expect(props.setChartTypeMenuDataset).toHaveBeenCalled();

    rerender(
      <HistogramBesideVennHistogramPortal
        {...props}
        chartTypeMenuDataset="sexAtBirth"
      />,
    );
    fireEvent.click(screen.getByLabelText('Pie chart'));
    expect(props.setChartVisualForPanel).toHaveBeenCalledWith('sexAtBirth', 'pie');

    const actionImages = target.querySelectorAll('img');
    fireEvent.click(actionImages[1].parentElement);
    fireEvent.click(actionImages[2].parentElement);
    fireEvent.keyDown(screen.getByLabelText(/Drag Sex at Birth/i), { key: 'Enter' });
    fireEvent.keyDown(screen.getByLabelText(/Drag Sex at Birth/i), { key: ' ' });
    expect(props.setExpandedChart).toHaveBeenCalledWith('sexAtBirth');
    expect(props.downloadChart).toHaveBeenCalledWith('sexAtBirth', false);

    fireEvent.click(screen.getByLabelText('Remove Sex at Birth from layout'));
    fireEvent.mouseDown(screen.getByLabelText('Resize chart beside Venn'));
    expect(props.handleRemoveHistogramDataset).toHaveBeenCalledWith('sexAtBirth');
    expect(props.handleHistogramCardResizeStart).toHaveBeenCalled();
  });

  it('supports drag and empty-state branches', () => {
    const props = portalProps(target, {
      data: { sexAtBirth: [] },
      filteredData: { sexAtBirth: [] },
    });
    render(<HistogramBesideVennHistogramPortal {...props} />);
    expect(screen.getByText('No data available.')).toBeInTheDocument();

    const card = target.querySelector('[data-ca-histogram-strip-dataset]');
    const dataTransfer = {
      setData: jest.fn(),
      setDragImage: jest.fn(),
      effectAllowed: '',
    };
    fireEvent.dragStart(card, { dataTransfer });
    fireEvent.dragEnd(card);
    expect(props.beginStripChartDrag).toHaveBeenCalledWith('sexAtBirth');
    expect(props.endStripChartDrag).toHaveBeenCalled();
  });

  it('should collapse a dragged beside histogram and share a peer shell', () => {
    const reportStripHeaderHeight = jest.fn();
    const observers = [];
    global.ResizeObserver = class {
      constructor(callback) {
        this.callback = callback;
        observers.push(this);
      }
      observe() {}
      disconnect() {}
    };
    const { rerender, unmount } = render(
      <HistogramBesideVennHistogramPortal
        {...portalProps(target, {
          draggingDataset: 'sexAtBirth',
          reportStripHeaderHeight,
          besidePeerShellBox: { width: 500, height: 360 },
          besideColumnPlotHeightPx: 210,
          filteredData: {
            sexAtBirth: Array.from({ length: 6 }, (_, i) => ({ name: `n${i}`, valueA: 1, valueB: 0, valueC: 0 })),
          },
        })}
      />,
    );
    expect(reportStripHeaderHeight).toHaveBeenCalled();
    rerender(
      <HistogramBesideVennHistogramPortal
        {...portalProps(target, {
          histogramCardSizes: {},
          besidePeerShellBox: null,
          allInputsEmpty: true,
          getChartTitle: () => '',
        })}
      />,
    );
    unmount();
    delete global.ResizeObserver;
  });

  it('returns no histogram portal while survival is selected', () => {
    render(
      <HistogramBesideVennHistogramPortal
        {...portalProps(target)}
        survivalSelected
      />,
    );
    expect(screen.queryByText('Sex at Birth')).not.toBeInTheDocument();
  });

  it('should skip the beside histogram portal without a dataset or target', () => {
    const { unmount } = render(
      <HistogramBesideVennHistogramPortal
        {...portalProps(target, { besideDatasetForColumn: null })}
      />,
    );
    expect(screen.queryByText('Sex at Birth')).not.toBeInTheDocument();
    unmount();
    render(
      <HistogramBesideVennHistogramPortal
        {...portalProps(null)}
      />,
    );
    expect(screen.queryByText('Sex at Birth')).not.toBeInTheDocument();
  });

  it('renders survival beside Venn and its resize behavior', () => {
    const handleResize = jest.fn();
    const onDragStart = jest.fn();
    render(
      <HistogramSurvivalBesideVennPortal
        selectedDatasets={['survivalAnalysis']}
        survivalBesideVennTarget={target}
        besideCardDrag={{
          id: 'survival-card',
          draggable: true,
          onDragStart,
          onDragEnd: jest.fn(),
        }}
        survivalBesideVennCardStyle={{ height: 400 }}
        survivalAnalysisBodyProps={{}}
        allInputsEmpty={false}
        handleSurvivalCardResizeStart={handleResize}
      />,
    );
    expect(screen.getByText('Beside survival body')).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByLabelText('Resize survival analysis card'));
    expect(handleResize).toHaveBeenCalledWith(
      expect.anything(),
      { fillColumnWidth: true },
    );
  });

  it('renders legacy inline survival only in its supported layout', () => {
    const handleResize = jest.fn();
    const { rerender } = render(
      <SurvivalHistogramInlineLegacy
        selectedDatasets={['survivalAnalysis']}
        survivalBesideVennTarget={undefined}
        survivalCardSize={{ width: 9000, height: 10 }}
        survivalAnalysisBodyProps={{}}
        allInputsEmpty={false}
        handleSurvivalCardResizeStart={handleResize}
        stripOrder={[]}
        topRowOrder={['venn', 'survival']}
      />,
    );
    expect(screen.getByText('Inline survival body')).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByLabelText('Resize survival analysis card'));
    expect(handleResize).toHaveBeenCalled();

    rerender(
      <SurvivalHistogramInlineLegacy
        selectedDatasets={['survivalAnalysis']}
        survivalBesideVennTarget={target}
        survivalAnalysisBodyProps={{}}
        allInputsEmpty
        handleSurvivalCardResizeStart={handleResize}
      />,
    );
    expect(screen.queryByText('Inline survival body')).not.toBeInTheDocument();
  });
});
