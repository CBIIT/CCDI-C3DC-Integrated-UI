const mockDestroy = jest.fn();
const mockGetElementsAtEventForMode = jest.fn(() => []);

jest.mock('chartjs-chart-venn', () => ({
  VennDiagramChart: jest.fn(() => ({
    destroy: mockDestroy,
    getElementsAtEventForMode: mockGetElementsAtEventForMode,
  })),
  extractSets: jest.fn((input) => ({
    labels: input.map((item) => item.label),
    datasets: [
      {
        data: input.map((item, index) => ({
          label: item.label,
          values: item.values,
          sets: [`region-${index}`],
        })),
      },
    ],
  })),
}));

import React, { createRef } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { VennDiagramChart, extractSets } from 'chartjs-chart-venn';
import ChartVenn from '../../../src/pages/CohortAnalyzer/vennDiagram/ChartVenn';

const cohorts = [
  {
    cohortName: 'Alpha',
    participants: [
      { id: 'p1', diagnosis: 'Glioma', treatment_type: ['Surgery'] },
      { id: 'p2', diagnosis: 'Glioma', treatment_type: ['Radiation'] },
    ],
  },
  {
    cohortName: 'Beta',
    participants: [
      { id: 'p3', diagnosis: 'Sarcoma', treatment_type: ['Surgery'] },
    ],
  },
];

function setup(overrides = {}) {
  const props = {
    intersection: 0,
    cohortData: cohorts,
    setSelectedChart: jest.fn((updater) => {
      if (typeof updater === 'function') updater([]);
    }),
    setSelectedCohortSections: jest.fn(),
    selectedCohortSection: [],
    selectedCohort: [],
    setGeneralInfo: jest.fn(),
    containerRef: createRef(),
    canvasRef: createRef(),
    slotWidth: 500,
    slotHeight: 360,
    ...overrides,
  };
  return { ...render(<ChartVenn {...props} />), props };
}

describe('ChartVenn rendering', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetElementsAtEventForMode.mockReturnValue([]);
    global.ResizeObserver = class {
      constructor(callback) {
        this.callback = callback;
      }

      observe() {}

      disconnect() {}
    };
  });

  it('shows loading for no cohorts and builds a chart when cohorts exist', () => {
    const { rerender, props } = setup({ cohortData: [] });
    expect(screen.getByText('Loading....')).toBeInTheDocument();

    rerender(<ChartVenn {...props} cohortData={cohorts} />);
    expect(document.querySelector('#canvas')).toBeInTheDocument();
    expect(VennDiagramChart).toHaveBeenCalled();
    expect(extractSets).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ label: 'Alpha (2)', values: ['p1', 'p2'] }),
      ]),
    );
  });

  it('selects and deselects regions from chart clicks', () => {
    mockGetElementsAtEventForMode.mockReturnValue([{ datasetIndex: 0, index: 0 }]);
    const { props } = setup();
    const config = VennDiagramChart.mock.calls[VennDiagramChart.mock.calls.length - 1][1];

    act(() => config.options.onClick({ clientX: 1, clientY: 1 }));
    expect(props.setSelectedChart).toHaveBeenCalled();
    expect(props.setSelectedCohortSections).toHaveBeenCalledWith(['Alpha (2)']);
  });

  it('flattens non-participant values and reports selected general info', () => {
    const { rerender, props } = setup({
      intersection: 2,
      selectedCohortSection: [],
    });
    expect(extractSets).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ values: ['Surgery', 'Radiation'] }),
      ]),
    );
    rerender(
      <ChartVenn
        {...props}
        intersection={2}
        selectedCohortSection={['Alpha (2)']}
      />,
    );
    expect(props.setGeneralInfo).toHaveBeenCalledWith(
      expect.objectContaining({ 'Alpha (2)': expect.any(Array) }),
    );

    rerender(
      <ChartVenn
        {...props}
        intersection={2}
        selectedCohortSection={['Alpha (2)']}
        expandedView
      />,
    );
    expect(mockDestroy).toHaveBeenCalled();
  });

  it('uses intersection colors and preview labels without participant counts', () => {
    extractSets.mockImplementationOnce((input) => ({
      labels: input.map((item) => item.label),
      datasets: [
        {
          data: input.map((item, index) => ({
            label: item.label,
            values: item.values,
            sets: index === 0 ? ['a', 'b'] : ['b'],
          })),
        },
      ],
    }));
    setup({ chartPreviewMode: true, selectedCohortSection: ['Alpha'] });
    const config = VennDiagramChart.mock.calls[VennDiagramChart.mock.calls.length - 1][1];
    expect(config.data.datasets[0].backgroundColor[0]).toMatch(/^rgba\(/);
    expect(config.options.scales.x.ticks.display).toBe(false);
  });

  it('should rebuild on viewport resize and skip empty click hits', () => {
    mockGetElementsAtEventForMode.mockReturnValue([]);
    setup({ slotWidth: undefined, slotHeight: undefined, expandedView: false });
    fireEvent(window, new Event('resize'));
    const config = VennDiagramChart.mock.calls[VennDiagramChart.mock.calls.length - 1][1];
    act(() => config.options.onClick({ clientX: 1, clientY: 1 }));
  });

  it('should deselect a selected region on a wide viewport', () => {
    mockGetElementsAtEventForMode.mockReturnValue([{ datasetIndex: 0, index: 0 }]);
    const originalWidth = window.innerWidth;
    Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: 1920 });
    const { props } = setup({
      selectedCohortSection: ['Alpha (2)'],
      selectedCohort: ['Alpha'],
      cohortData: [
        ...cohorts,
        { cohortName: 'Gamma', participants: [{ diagnosis: 'X' }] },
      ],
    });
    const config = VennDiagramChart.mock.calls[VennDiagramChart.mock.calls.length - 1][1];
    act(() => config.options.onClick({ clientX: 2, clientY: 2 }));
    expect(props.setSelectedCohortSections).toHaveBeenCalled();
    Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: originalWidth });
  });
});
