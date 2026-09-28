import React from 'react';
import { act, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useHistogramStripDnD } from '../../../src/pages/CohortAnalyzer/HistogramPanel/hooks/useHistogramStripDnD';
import { CA_PANEL_DRAG_MIME } from '../../../src/pages/CohortAnalyzer/store/panelDnD';

let latest;
const mockDispatch = jest.fn();
const mockDropComplete = jest.fn();

function transfer(payload, plain = '') {
  return {
    types: [CA_PANEL_DRAG_MIME, 'text/plain'],
    dropEffect: '',
    getData: jest.fn((type) => (type === CA_PANEL_DRAG_MIME ? payload : plain)),
  };
}

function Probe({ besidePanelDraggingRef = { current: null } }) {
  const chartRef = {
    current: {
      sexAtBirth: {
        getBoundingClientRect: () => ({ width: 300, height: 260 }),
      },
    },
  };
  latest = useHistogramStripDnD({
    chartRef,
    estimateHistogramCardDropSize: () => ({ width: 280, height: 240 }),
    stripOrder: ['sexAtBirth', 'race', 'response'],
    dispatch: mockDispatch,
    besidePanelDraggingRef,
    onTopRowDroppedOnStrip: mockDropComplete,
  });
  return (
    <div>
      <span>dragging:{latest.draggingDataset || 'none'}</span>
      <span>over:{latest.dragOverDataset || 'none'}</span>
    </div>
  );
}

describe('useHistogramStripDnD', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.requestAnimationFrame = (callback) => {
      callback();
      return 1;
    };
  });

  it('captures dimensions, starts, reorders, and clears a histogram drag', () => {
    render(<Probe />);
    const currentTarget = {
      getBoundingClientRect: () => ({ width: 320, height: 280 }),
    };
    act(() => {
      latest.captureHistogramDragCardSize({ currentTarget }, 'sexAtBirth');
      latest.beginStripChartDrag('sexAtBirth');
    });
    expect(screen.getByText('dragging:sexAtBirth')).toBeInTheDocument();
    expect(latest.histogramDragSizeRef.current).toEqual({ width: 320, height: 280 });

    const overEvent = {
      preventDefault: jest.fn(),
      dataTransfer: transfer('', 'sexAtBirth'),
    };
    act(() => latest.handleStripChartDragOver(overEvent, 'response'));
    expect(overEvent.dataTransfer.dropEffect).toBe('move');

    const dropEvent = {
      preventDefault: jest.fn(),
      dataTransfer: transfer('', 'sexAtBirth'),
    };
    act(() => latest.handleStripChartDrop(dropEvent, 'response'));
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: ['race', 'sexAtBirth', 'response'],
      }),
    );
    expect(screen.getByText('dragging:none')).toBeInTheDocument();
  });

  it('moves a Venn top-row panel into the strip and preserves its size', () => {
    const besidePanelDraggingRef = {
      current: { kind: 'venn', width: 410.4, height: 380.7 },
    };
    render(<Probe besidePanelDraggingRef={besidePanelDraggingRef} />);

    const event = {
      preventDefault: jest.fn(),
      dataTransfer: transfer('', 'venn'),
    };
    act(() => latest.handleStripChartDrop(event, 'race'));

    expect(mockDispatch).toHaveBeenCalledTimes(2);
    expect(mockDropComplete).toHaveBeenCalled();
  });

  it('tracks top-row dragover and handles a drop without a target', () => {
    const besidePanelDraggingRef = {
      current: { kind: 'survival', width: 500, height: 420 },
    };
    render(<Probe besidePanelDraggingRef={besidePanelDraggingRef} />);
    const event = {
      preventDefault: jest.fn(),
      dataTransfer: transfer('', 'survival'),
    };
    act(() => latest.handleStripChartDragOver(event, 'race'));
    expect(screen.getByText('over:race')).toBeInTheDocument();
    act(() => latest.handleStripChartDrop(event, null));
    expect(mockDropComplete).toHaveBeenCalled();
  });

  it('should ignore incomplete histogram drops and keep a top-row snap when MIME is missing', () => {
    render(<Probe besidePanelDraggingRef={{ current: { kind: 'venn' } }} />);
    const over = {
      preventDefault: jest.fn(),
      dataTransfer: { types: [], dropEffect: '', getData: () => '' },
    };
    act(() => latest.handleStripChartDragOver(over, 'race'));
    expect(over.dataTransfer.dropEffect).toBe('move');

    mockDispatch.mockClear();
    const { unmount } = render(<Probe besidePanelDraggingRef={{ current: null }} />);
    const drop = {
      preventDefault: jest.fn(),
      dataTransfer: transfer('', 'missing'),
    };
    act(() => latest.handleStripChartDrop(drop, 'race'));
    expect(mockDispatch).not.toHaveBeenCalled();

    act(() => latest.captureHistogramDragCardSize({}, 'sexAtBirth'));
    expect(latest.histogramDragSizeRef.current).toEqual({ width: 300, height: 260 });
    unmount();
  });
});
