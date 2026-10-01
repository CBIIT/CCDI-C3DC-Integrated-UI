const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));
jest.mock('@bento-core/tool-tip/dist/ToolTip', () => ({ children }) => children);
jest.mock('../../../src/pages/CohortAnalyzer/HistogramPanel/chart/HistogramDatasetChart', () => ({
  HistogramDatasetChart: () => <div>Dataset chart</div>,
  DEFAULT_CHART_TYPE: 'verticalBar',
  CHART_TYPE_KEYS: {
    PIE: 'pie',
    VERTICAL_BAR: 'verticalBar',
    HORIZONTAL_BAR: 'horizontalBar',
    LINE: 'line',
  },
}));

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HistogramStripChartRow } from '../../../src/pages/CohortAnalyzer/HistogramPanel/strip/HistogramStripChartRow';

const classes = { headerCloseButton: '' };
const rows = [{ name: 'Female', valueA: 1, valueB: 0, valueC: 0 }];

function renderRow(overrides = {}) {
  return render(
    <HistogramStripChartRow
      dataset="sexAtBirth"
      classes={classes}
      data={{ sexAtBirth: rows }}
      filteredData={{ sexAtBirth: rows }}
      viewType={{ sexAtBirth: 'count' }}
      setViewType={jest.fn()}
      chartVisualByPanelId={{}}
      histogramCardSizes={{}}
      defaultPlotHeightPx={240}
      defaultDropSlotWidthPx={280}
      defaultHistogramCardOuterMinHeightPx={() => 280}
      estimateHistogramCardDropSize={() => ({ width: 280, height: 280 })}
      draggingDataset={null}
      beginStripChartDrag={jest.fn()}
      endStripChartDrag={jest.fn()}
      dragOverDataset={null}
      setDragOverDataset={jest.fn()}
      draggingCardDimensions={null}
      histogramDragSizeRef={{ current: null }}
      captureHistogramDragCardSize={jest.fn()}
      clearHistogramDragSize={jest.fn()}
      handleStripChartDragOver={jest.fn()}
      handleStripChartDrop={jest.fn()}
      handleHistogramCardResizeStart={jest.fn()}
      chartRef={{ current: {} }}
      allInputsEmpty={false}
      getChartTitle={() => 'Sex at Birth'}
      chartTypeMenuDataset={null}
      setChartTypeMenuDataset={jest.fn()}
      chartTypeMenuRef={{ current: null }}
      cellHover={{ current: null }}
      handleMouseEnter={jest.fn()}
      handleMouseLeave={jest.fn()}
      downloadChart={jest.fn()}
      setExpandedChart={jest.fn()}
      setActiveTab={jest.fn()}
      handleRemoveHistogramDataset={jest.fn()}
      c1Name="A"
      c2Name="B"
      c3Name="C"
      besidePanelDraggingRef={{ current: null }}
      {...overrides}
    />,
  );
}

describe('HistogramStripChartRow', () => {
  it('should expand, download, and remove a histogram card', () => {
    const setExpandedChart = jest.fn();
    const setActiveTab = jest.fn();
    const downloadChart = jest.fn();
    const handleRemoveHistogramDataset = jest.fn();
    const setViewType = jest.fn();
    const handleHistogramCardResizeStart = jest.fn();
    const { container } = renderRow({
      setExpandedChart,
      setActiveTab,
      downloadChart,
      handleRemoveHistogramDataset,
      setViewType,
      handleHistogramCardResizeStart,
    });
    expect(screen.getByText('Sex at Birth')).toBeInTheDocument();
    expect(screen.getByText('Dataset chart')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Remove Sex at Birth from layout'));
    expect(handleRemoveHistogramDataset).toHaveBeenCalledWith('sexAtBirth');
    fireEvent.click(screen.getByLabelText('Chart type'));
    fireEvent.click(screen.getByDisplayValue('percentage'));
    expect(setViewType).toHaveBeenCalledWith({ sexAtBirth: 'percentage' });
    const images = container.querySelectorAll('img');
    fireEvent.click(images[1].parentElement);
    fireEvent.click(images[2].parentElement);
    expect(setExpandedChart).toHaveBeenCalledWith('sexAtBirth');
    expect(setActiveTab).toHaveBeenCalledWith('sexAtBirth');
    expect(downloadChart).toHaveBeenCalledWith('sexAtBirth', false);
    fireEvent.mouseDown(screen.getByLabelText('Resize Sex at Birth card'));
    expect(handleHistogramCardResizeStart).toHaveBeenCalled();
  });

  it('should show empty state when the dataset has no rows', () => {
    renderRow({
      data: { sexAtBirth: [] },
      filteredData: { sexAtBirth: [] },
    });
    expect(screen.getByText('No data available.')).toBeInTheDocument();
  });

  it('changes chart type and supports drag lifecycle', () => {
    const setChartTypeMenuDataset = jest.fn();
    const beginStripChartDrag = jest.fn();
    const endStripChartDrag = jest.fn();
    const captureHistogramDragCardSize = jest.fn();
    const setDragOverDataset = jest.fn();
    const { container } = renderRow({
      chartTypeMenuDataset: 'sexAtBirth',
      setChartTypeMenuDataset,
      beginStripChartDrag,
      endStripChartDrag,
      captureHistogramDragCardSize,
      setDragOverDataset,
    });
    fireEvent.click(screen.getByLabelText('Pie chart'));
    expect(mockDispatch).toHaveBeenCalled();
    expect(setChartTypeMenuDataset).toHaveBeenCalledWith(null);

    const card = container.querySelector('[data-ca-histogram-strip-dataset]');
    const dataTransfer = {
      setData: jest.fn(),
      setDragImage: jest.fn(),
      effectAllowed: '',
    };
    fireEvent.dragStart(card, { dataTransfer });
    fireEvent.dragEnd(card);
    expect(captureHistogramDragCardSize).toHaveBeenCalled();
    expect(beginStripChartDrag).toHaveBeenCalledWith('sexAtBirth');
    expect(endStripChartDrag).toHaveBeenCalled();
  });

  it('renders a drop slot and collapsed drag source', () => {
    const handleStripChartDragOver = jest.fn();
    const handleStripChartDrop = jest.fn();
    const { container } = renderRow({
      draggingDataset: 'race',
      dragOverDataset: 'sexAtBirth',
      draggingCardDimensions: { width: 350, height: 300 },
      handleStripChartDragOver,
      handleStripChartDrop,
      besidePanelDraggingRef: {
        current: { kind: 'venn', width: 420, height: 330 },
      },
    });
    const slots = container.querySelectorAll('[data-ca-histogram-strip-dataset="sexAtBirth"]');
    expect(slots.length).toBe(2);
    fireEvent.dragOver(slots[0]);
    fireEvent.drop(slots[0]);
    expect(handleStripChartDragOver).toHaveBeenCalled();
    expect(handleStripChartDrop).toHaveBeenCalled();
  });

  it('should measure headers, preview empty charts, and ignore disabled drags', () => {
    const reportStripHeaderHeight = jest.fn();
    const manyRows = Array.from({ length: 6 }, (_, i) => ({
      name: `row${i}`,
      valueA: i,
      valueB: 0,
      valueC: 0,
    }));
    const observers = [];
    global.ResizeObserver = class {
      constructor(callback) {
        this.callback = callback;
        observers.push(this);
      }
      observe() {}
      disconnect() {}
    };
    const { container, rerender, unmount } = renderRow({
      reportStripHeaderHeight,
      filteredData: { sexAtBirth: manyRows },
      data: { sexAtBirth: manyRows },
      histogramCardSizes: { sexAtBirth: { width: 360, plotHeight: 200 } },
      chartPreviewMode: true,
    });
    expect(reportStripHeaderHeight).toHaveBeenCalled();
    fireEvent.keyDown(screen.getByLabelText(/Drag to reorder/i), { key: 'Enter' });
    fireEvent.keyDown(screen.getByLabelText(/Drag to reorder/i), { key: ' ' });
    expect(container.querySelector('[data-ca-chart-title-text]')).toBeInTheDocument();

    rerender(
      <HistogramStripChartRow
        dataset="sexAtBirth"
        classes={classes}
        data={{ sexAtBirth: [] }}
        filteredData={{}}
        viewType={{ sexAtBirth: 'count' }}
        setViewType={jest.fn()}
        chartVisualByPanelId={{}}
        histogramCardSizes={{}}
        defaultPlotHeightPx={240}
        defaultDropSlotWidthPx={280}
        defaultHistogramCardOuterMinHeightPx={() => 280}
        estimateHistogramCardDropSize={() => ({ width: 280, height: 280 })}
        draggingDataset="sexAtBirth"
        beginStripChartDrag={jest.fn()}
        endStripChartDrag={jest.fn()}
        dragOverDataset={null}
        setDragOverDataset={jest.fn()}
        draggingCardDimensions={null}
        histogramDragSizeRef={{ current: { width: 310, height: 250 } }}
        captureHistogramDragCardSize={jest.fn()}
        clearHistogramDragSize={jest.fn()}
        handleStripChartDragOver={jest.fn()}
        handleStripChartDrop={jest.fn()}
        handleHistogramCardResizeStart={jest.fn()}
        chartRef={{ current: {} }}
        allInputsEmpty
        getChartTitle={() => ''}
        chartTypeMenuDataset={null}
        setChartTypeMenuDataset={jest.fn()}
        chartTypeMenuRef={{ current: null }}
        cellHover={{ current: null }}
        handleMouseEnter={jest.fn()}
        handleMouseLeave={jest.fn()}
        downloadChart={jest.fn()}
        setExpandedChart={jest.fn()}
        setActiveTab={jest.fn()}
        handleRemoveHistogramDataset={jest.fn()}
        c1Name="A"
        c2Name="B"
        c3Name="C"
        besidePanelDraggingRef={{ current: { kind: 'histogram' } }}
      />,
    );
    unmount();
    delete global.ResizeObserver;
  });

  it('should size a histogram drop slot from the dragged card when top-row snap is incomplete', () => {
    const estimateHistogramCardDropSize = jest.fn(() => ({ width: 260, height: 240 }));
    const { container, rerender } = renderRow({
      draggingDataset: 'race',
      dragOverDataset: 'sexAtBirth',
      estimateHistogramCardDropSize,
      besidePanelDraggingRef: { current: { kind: 'histogram' } },
    });
    expect(container.querySelectorAll('[data-ca-histogram-strip-dataset="sexAtBirth"]').length).toBe(2);
    expect(estimateHistogramCardDropSize).toHaveBeenCalledWith('race');
    rerender(
      <HistogramStripChartRow
        dataset="sexAtBirth"
        classes={classes}
        data={{ sexAtBirth: rows }}
        filteredData={{ sexAtBirth: rows }}
        viewType={{ sexAtBirth: 'count' }}
        setViewType={jest.fn()}
        chartVisualByPanelId={{}}
        histogramCardSizes={{}}
        defaultPlotHeightPx={240}
        defaultDropSlotWidthPx={280}
        defaultHistogramCardOuterMinHeightPx={() => 280}
        estimateHistogramCardDropSize={estimateHistogramCardDropSize}
        draggingDataset={null}
        beginStripChartDrag={jest.fn()}
        endStripChartDrag={jest.fn()}
        dragOverDataset="sexAtBirth"
        setDragOverDataset={jest.fn()}
        draggingCardDimensions={{ width: 333, height: 222 }}
        histogramDragSizeRef={{ current: null }}
        captureHistogramDragCardSize={jest.fn()}
        clearHistogramDragSize={jest.fn()}
        handleStripChartDragOver={jest.fn()}
        handleStripChartDrop={jest.fn()}
        handleHistogramCardResizeStart={jest.fn()}
        chartRef={{ current: {} }}
        allInputsEmpty={false}
        getChartTitle={() => 'Sex at Birth'}
        chartTypeMenuDataset={null}
        setChartTypeMenuDataset={jest.fn()}
        chartTypeMenuRef={{ current: null }}
        cellHover={{ current: null }}
        handleMouseEnter={jest.fn()}
        handleMouseLeave={jest.fn()}
        downloadChart={jest.fn()}
        setExpandedChart={jest.fn()}
        setActiveTab={jest.fn()}
        handleRemoveHistogramDataset={jest.fn()}
        c1Name="A"
        c2Name="B"
        c3Name="C"
        besidePanelDraggingRef={{ current: { kind: 'venn' } }}
      />,
    );
    expect(container.querySelectorAll('[data-ca-histogram-strip-dataset="sexAtBirth"]').length).toBe(2);
  });
});
