const mockQuery = jest.fn();
const mockClient = { query: mockQuery };

jest.mock('@apollo/client', () => ({
  gql: (parts) => parts,
  useApolloClient: () => mockClient,
}));

import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useHistogramData } from '../../../src/pages/CohortAnalyzer/HistogramPanel/hooks/useHistogramData';

let latest;
const mockSetActiveTab = jest.fn();
const mockSetExpandedChart = jest.fn();
const EMPTY = [];
const DEFAULT_C1 = ['p1'];

function Probe({
  c1 = DEFAULT_C1,
  c2 = EMPTY,
  c3 = EMPTY,
  chartPreviewMode = false,
  layoutResetNonce = 0,
}) {
  latest = useHistogramData({
    c1,
    c2,
    c3,
    chartPreviewMode,
    expandedChart: null,
    setExpandedChart: mockSetExpandedChart,
    activeTab: 'sexAtBirth',
    setActiveTab: mockSetActiveTab,
    layoutResetNonce,
  });
  const sexRows = latest.graphData.sexAtBirth || [];
  return (
    <div>
      <span>rows:{sexRows.length}</span>
      <span>first-a:{sexRows[0] ? sexRows[0].valueA || 0 : 0}</span>
      <span>first-b:{sexRows[0] ? sexRows[0].valueB || 0 : 0}</span>
      <span>selected:{latest.selectedDatasets.join(',')}</span>
      <button type="button" onClick={() => latest.handleDatasetChange('race')}>
        Toggle race
      </button>
      <button type="button" onClick={() => latest.downloadChart('sexAtBirth', false)}>
        Download inline
      </button>
      <button type="button" onClick={() => latest.downloadChart('sexAtBirth', true)}>
        Download expanded
      </button>
    </div>
  );
}

describe('useHistogramData', () => {
  let originalCreateElement;
  let originalImage;
  let originalXmlSerializer;
  let consoleError;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    URL.createObjectURL = jest.fn(() => 'blob:test');
    URL.revokeObjectURL = jest.fn();
    originalCreateElement = document.createElement.bind(document);
    document.createElement = (tagName) => {
      const element = originalCreateElement(tagName);
      if (tagName === 'canvas') {
        element.getContext = () => ({
          fillStyle: '',
          fillRect: jest.fn(),
          scale: jest.fn(),
          drawImage: jest.fn(),
        });
        element.toBlob = (callback) => callback(new Blob(['chart']));
      }
      if (tagName === 'a') {
        element.click = jest.fn();
      }
      return element;
    };
    originalImage = global.Image;
    const MockImage = class {
      set src(value) {
        this.value = value;
        if (this.onload) this.onload();
      }
    };
    global.Image = MockImage;
    window.Image = MockImage;
    originalXmlSerializer = global.XMLSerializer;
    global.XMLSerializer = class {
      serializeToString() {
        return '<svg />';
      }
    };
  });

  afterEach(() => {
    document.createElement = originalCreateElement;
    global.Image = originalImage;
    window.Image = originalImage;
    global.XMLSerializer = originalXmlSerializer;
    consoleError.mockRestore();
    document.body.innerHTML = '';
  });

  it('fetches, flattens, and groups histogram API data', async () => {
    mockQuery.mockResolvedValue({
      data: {
        cohortCharts: [
          {
            property: 'sex_at_birth',
            cohorts: [
              {
                cohort: 'c1',
                participantsByGroup: [{ group: 'Female', subjects: 2 }],
              },
              {
                cohort: 'c2',
                participantsByGroup: [{ group: 'Female', subjects: 3 }],
              },
              { cohort: 'c3', participantsByGroup: null },
            ],
          },
        ],
      },
    });
    render(<Probe c2={['p2']} />);
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(screen.getByText('rows:1')).toBeInTheDocument();
    expect(screen.getByText('first-a:2')).toBeInTheDocument();
    expect(screen.getByText('first-b:3')).toBeInTheDocument();
    expect(mockQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: expect.objectContaining({
          c1: ['p1'],
          c2: ['p2'],
          charts: expect.any(Array),
        }),
      }),
    );
  });

  it('toggles selected datasets and restores defaults on reset', async () => {
    mockQuery.mockResolvedValue({ data: { cohortCharts: [] } });
    const { rerender } = render(<Probe />);
    await act(async () => {
      await Promise.resolve();
    });
    fireEvent.click(screen.getByText('Toggle race'));
    expect(latest.selectedDatasets).not.toContain('race');
    fireEvent.click(screen.getByText('Toggle race'));
    expect(latest.selectedDatasets).toContain('race');

    rerender(<Probe layoutResetNonce={1} />);
    expect(mockSetActiveTab).toHaveBeenCalledWith('sexAtBirth');
    expect(mockSetExpandedChart).toHaveBeenCalledWith(null);
  });

  it('skips network data in chart preview mode and handles request failures', async () => {
    mockQuery.mockRejectedValue(new Error('network failed'));
    const { rerender } = render(<Probe />);
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(consoleError).toHaveBeenCalledWith(
      'Failed to fetch chart data:',
      expect.any(Error),
    );

    mockQuery.mockClear();
    rerender(<Probe chartPreviewMode />);
    expect(screen.getByText('rows:0')).toBeInTheDocument();
  });

  it('downloads inline and expanded Recharts SVGs', async () => {
    mockQuery.mockResolvedValue({ data: { cohortCharts: [] } });
    const inlineRoot = document.createElement('div');
    inlineRoot.id = 'chart-sexAtBirth';
    const inlineSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    inlineSvg.setAttribute('class', 'recharts-surface');
    inlineSvg.getBoundingClientRect = () => ({ width: 300, height: 200 });
    inlineRoot.appendChild(inlineSvg);
    document.body.appendChild(inlineRoot);

    const expandedRoot = document.createElement('div');
    expandedRoot.id = 'expanded-chart-sexAtBirth';
    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'recharts-wrapper');
    const expandedSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    expandedSvg.getBoundingClientRect = () => ({ width: 400, height: 250 });
    wrapper.appendChild(expandedSvg);
    expandedRoot.appendChild(wrapper);
    document.body.appendChild(expandedRoot);

    render(<Probe />);
    await act(async () => {
      await Promise.resolve();
    });
    expect(document.getElementById('chart-sexAtBirth')).not.toBeNull();
    expect(document.querySelector('#chart-sexAtBirth svg.recharts-surface')).not.toBeNull();
    fireEvent.click(screen.getByText('Download inline'));
    fireEvent.click(screen.getByText('Download expanded'));
    expect(consoleError).not.toHaveBeenCalled();
    expect(URL.createObjectURL).toHaveBeenCalledTimes(4);
    expect(URL.revokeObjectURL).toHaveBeenCalledTimes(4);
  });
});
