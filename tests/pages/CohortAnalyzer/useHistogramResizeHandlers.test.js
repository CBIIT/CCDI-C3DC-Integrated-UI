import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useHistogramResizeHandlers } from '../../../src/pages/CohortAnalyzer/HistogramPanel/hooks/useHistogramResizeHandlers';

const mockDispatch = jest.fn();
const mockSetHistogramCardSizes = jest.fn();
const mockSetSurvivalCardSize = jest.fn();

function Probe({ allInputsEmpty = false, besideHistogramDataset = 'sexAtBirth', sizes = {} }) {
  const { handleHistogramCardResizeStart, handleSurvivalCardResizeStart } =
    useHistogramResizeHandlers({
      allInputsEmpty,
      histogramCardSizes: sizes,
      setHistogramCardSizes: mockSetHistogramCardSizes,
      survivalCardSize: null,
      setSurvivalCardSize: mockSetSurvivalCardSize,
      dispatch: mockDispatch,
      defaultPlotHeightPx: 240,
      besideHistogramDataset,
    });

  return (
    <div>
      <div
        data-ca-histogram-strip-dataset="sexAtBirth"
        ref={(node) => {
          if (node) {
            node.getBoundingClientRect = () => ({ width: 400, height: 320 });
          }
        }}
      >
        <button
          type="button"
          onMouseDown={(event) => handleHistogramCardResizeStart(event, 'sexAtBirth')}
        >
          Resize histogram
        </button>
      </div>
      <div
        ref={(node) => {
          if (node) {
            node.getBoundingClientRect = () => ({ width: 500, height: 430 });
          }
        }}
      >
        <button
          type="button"
          onMouseDown={(event) => handleSurvivalCardResizeStart(event)}
        >
          Resize survival
        </button>
        <button
          type="button"
          onMouseDown={(event) =>
            handleSurvivalCardResizeStart(event, { fillColumnWidth: true })
          }
        >
          Resize survival height
        </button>
      </div>
    </div>
  );
}

describe('useHistogramResizeHandlers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('resizes and persists a histogram and its synchronized survival shell', () => {
    render(<Probe />);

    fireEvent.mouseDown(screen.getByText('Resize histogram'), {
      clientX: 100,
      clientY: 100,
    });
    fireEvent.mouseMove(document, { clientX: 180, clientY: 160 });
    fireEvent.mouseUp(document);

    expect(mockSetHistogramCardSizes).toHaveBeenCalled();
    expect(mockSetSurvivalCardSize).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledTimes(2);
    expect(document.body.style.userSelect).toBe('');
  });

  it('resizes survival in free and fill-column modes', () => {
    render(<Probe besideHistogramDataset={null} />);

    fireEvent.mouseDown(screen.getByText('Resize survival'), {
      clientX: 20,
      clientY: 20,
    });
    fireEvent.mouseMove(document, { clientX: 90, clientY: 80 });
    fireEvent.mouseUp(document);

    fireEvent.mouseDown(screen.getByText('Resize survival height'), {
      clientX: 20,
      clientY: 20,
    });
    fireEvent.mouseMove(document, { clientX: 20, clientY: 100 });
    fireEvent.mouseUp(document);

    expect(mockSetSurvivalCardSize).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledTimes(2);
  });

  it('does nothing while chart interactions are disabled', () => {
    render(<Probe allInputsEmpty />);
    act(() => {
      fireEvent.mouseDown(screen.getByText('Resize histogram'));
      fireEvent.mouseDown(screen.getByText('Resize survival'));
    });
    expect(mockSetHistogramCardSizes).not.toHaveBeenCalled();
    expect(mockSetSurvivalCardSize).not.toHaveBeenCalled();
  });

  it('should reuse stored histogram sizes and skip a missing card', () => {
    render(<Probe sizes={{ sexAtBirth: { width: 360, plotHeight: 180 } }} />);
    fireEvent.mouseDown(screen.getByText('Resize histogram'), { clientX: 10, clientY: 10 });
    fireEvent.mouseMove(document, { clientX: 40, clientY: 50 });
    fireEvent.mouseUp(document);
    expect(mockSetHistogramCardSizes).toHaveBeenCalled();

    const orphan = document.createElement('button');
    orphan.textContent = 'orphan';
    document.body.appendChild(orphan);
    fireEvent.mouseDown(orphan);
    orphan.remove();

    fireEvent.mouseDown(screen.getByText('Resize histogram'), { clientX: 10, clientY: 10 });
    fireEvent.mouseUp(document);
  });
});
