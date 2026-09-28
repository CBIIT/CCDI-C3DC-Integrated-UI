const mockDispatch = jest.fn();
let mockLayoutState = {
  topRowOrder: ['venn', 'survival'],
  uiFlags: { survivalBesideFromSelection: true },
  stripOrder: ['sexAtBirth', 'race'],
};

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector) =>
    selector({ cohortAnalyzerLayout: mockLayoutState }),
}));

import React from 'react';
import { act, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useBesidePanelDnD } from '../../../src/pages/CohortAnalyzer/hooks/useBesidePanelDnD';
import {
  CA_PANEL_DRAG_MIME,
  encodePanelDragPayload,
} from '../../../src/pages/CohortAnalyzer/store/panelDnD';

let latest;

function dataTransfer(payload) {
  return {
    setData: jest.fn(),
    getData: jest.fn((type) => (type === CA_PANEL_DRAG_MIME ? payload : '')),
    setDragImage: jest.fn(),
    effectAllowed: '',
    dropEffect: '',
  };
}

function Probe({ enabled = true }) {
  latest = useBesidePanelDnD(enabled);
  return (
    <div>
      <span>drag:{latest.besidePanelDragging ? latest.besidePanelDragging.kind : 'none'}</span>
      <span>target:{latest.besideDropTarget || 'none'}</span>
      {latest.vennHeaderGrab}
    </div>
  );
}

describe('useBesidePanelDnD', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.requestAnimationFrame = (callback) => {
      callback();
      return 1;
    };
    mockLayoutState = {
      topRowOrder: ['venn', 'survival'],
      uiFlags: { survivalBesideFromSelection: true },
      stripOrder: ['sexAtBirth', 'race'],
    };
  });

  it('starts, targets, and ends a top-row panel drag', () => {
    const card = document.createElement('div');
    card.id = 'cohort-analyzer-venn-card';
    card.getBoundingClientRect = () => ({ width: 444, height: 333 });
    document.body.appendChild(card);
    render(<Probe />);

    const transfer = dataTransfer('');
    act(() => latest.vennBesideDrag.onDragStart({ dataTransfer: transfer }));
    expect(transfer.setData).toHaveBeenCalledTimes(2);
    expect(transfer.setDragImage).toHaveBeenCalled();
    expect(screen.getByText('drag:venn')).toBeInTheDocument();

    const over = {
      preventDefault: jest.fn(),
      dataTransfer: transfer,
    };
    act(() => latest.handleBesideColumnDragOver('survival')(over));
    expect(screen.getByText('target:survival')).toBeInTheDocument();
    expect(latest.besideColumnDropTargetStyle).toBeDefined();

    act(() => latest.vennBesideDrag.onDragEnd());
    expect(screen.getByText('drag:none')).toBeInTheDocument();
    card.remove();
  });

  it('swaps Venn and survival after a top-row drop', () => {
    render(<Probe />);
    const payload = encodePanelDragPayload({ kind: 'venn', dataset: null });
    const event = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
      dataTransfer: dataTransfer(payload),
    };
    act(() => latest.handleBesidePanelDrop('survival')(event));
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ payload: ['survival', 'venn'] }),
    );
  });

  it('promotes a histogram into the beside slot', () => {
    render(<Probe />);
    const payload = encodePanelDragPayload({ kind: 'histogram', dataset: 'race' });
    const event = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
      dataTransfer: dataTransfer(payload),
    };
    act(() => latest.handleBesidePanelDrop('venn')(event));
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({ besideStripPanelId: 'race' }),
      }),
    );
  });

  it('omits draggable descriptors when handles are disabled', () => {
    render(<Probe enabled={false} />);
    expect(latest.vennBesideDrag).toBeUndefined();
    expect(latest.survivalBesideDrag).toBeUndefined();
  });

  it('clears column targeting when leaving the beside row', () => {
    render(<Probe />);
    act(() => {
      latest.besidePanelDraggingRef.current = {
        kind: 'venn',
        width: 400,
        height: 300,
      };
    });
    const over = {
      preventDefault: jest.fn(),
      dataTransfer: dataTransfer(''),
    };
    act(() => latest.handleBesideColumnDragOver('survival')(over));
    expect(screen.getByText('target:survival')).toBeInTheDocument();
    const row = document.createElement('div');
    const child = document.createElement('span');
    row.appendChild(child);
    act(() => latest.handleBesideRowDragLeave({
      relatedTarget: child,
      currentTarget: row,
    }));
    expect(screen.getByText('target:survival')).toBeInTheDocument();
    act(() => latest.handleBesideRowDragLeave({
      relatedTarget: document.body,
      currentTarget: row,
    }));
    expect(screen.getByText('target:none')).toBeInTheDocument();
  });

  it('ignores invalid and same-panel drops', () => {
    render(<Probe />);
    const invalidEvent = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
      dataTransfer: dataTransfer('not-json'),
    };
    act(() => latest.handleBesidePanelDrop('venn')(invalidEvent));
    const samePayload = encodePanelDragPayload({ kind: 'venn', dataset: null });
    act(() => latest.handleBesidePanelDrop('venn')({
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
      dataTransfer: dataTransfer(samePayload),
    }));
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('should ignore a histogram drop without a dataset and survival drag start', () => {
    const card = document.createElement('div');
    card.id = 'cohort-analyzer-survival-card';
    card.getBoundingClientRect = () => ({ width: 200, height: 180 });
    document.body.appendChild(card);
    render(<Probe />);
    const transfer = dataTransfer('');
    act(() => latest.survivalBesideDrag.onDragStart({ dataTransfer: transfer }));
    expect(screen.getByText('drag:survival')).toBeInTheDocument();
    act(() => latest.handleBesidePanelDrop('venn')({
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
      dataTransfer: {
        getData: () => encodePanelDragPayload({ kind: 'histogram' }),
        setData: jest.fn(),
        setDragImage: jest.fn(),
      },
    }));
    card.remove();
  });
});
