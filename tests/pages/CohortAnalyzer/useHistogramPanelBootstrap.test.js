const mockDispatch = jest.fn();
let mockLayout = {
  stripOrder: ['sexAtBirth'],
  topRowOrder: ['venn', 'survival'],
  besideStripPanelId: 'sexAtBirth',
};

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector) => selector({ cohortAnalyzerLayout: mockLayout }),
}));

import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useHistogramPanelBootstrap } from '../../../src/pages/CohortAnalyzer/HistogramPanel/hooks/useHistogramPanelBootstrap';

let latest;
const mockSetSelectedDatasets = jest.fn();
const mockSetActiveTab = jest.fn();
const mockSetExpandedChart = jest.fn();
const mockSetChartTypeMenuDataset = jest.fn();
const mockSetShowDownloadDropdown = jest.fn();
const mockSetHistogramCardSizes = jest.fn();
const mockSetSurvivalCardSize = jest.fn();

function Probe({
  selectedDatasets,
  onClose,
  inlineAddChartOpen = true,
  chartTypeMenuDataset = null,
  showDownloadDropdown = false,
  reduxSurvivalSize = null,
}) {
  const chartTypeMenuRef = React.useRef(null);
  const dropdownRef = React.useRef(null);
  latest = useHistogramPanelBootstrap({
    selectedDatasets,
    setSelectedDatasets: mockSetSelectedDatasets,
    setActiveTab: mockSetActiveTab,
    setExpandedChart: mockSetExpandedChart,
    inlineAddChartOpen,
    inlineAddChartNonce: 1,
    onInlineAddChartClose: onClose,
    reduxHistogramSizes: { sexAtBirth: { width: 400 } },
    reduxSurvivalSize,
    chartTypeMenuDataset,
    setChartTypeMenuDataset: mockSetChartTypeMenuDataset,
    chartTypeMenuRef,
    showDownloadDropdown,
    setShowDownloadDropdown: mockSetShowDownloadDropdown,
    dropdownRef,
    histogramCardSizes: {},
    setHistogramCardSizes: mockSetHistogramCardSizes,
    setSurvivalCardSize: mockSetSurvivalCardSize,
  });
  return (
    <div>
      <div ref={chartTypeMenuRef}>chart menu</div>
      <div ref={dropdownRef}>download menu</div>
      <span>{latest.survivalSelected ? 'survival-on' : 'survival-off'}</span>
      <button type="button" onClick={() => latest.finalizeInlineAddChart('verticalBar', 'race')}>
        add race
      </button>
      <button type="button" onClick={() => latest.finalizeInlineAddChart(null, 'survivalAnalysis')}>
        add survival
      </button>
      <button type="button" onClick={() => latest.handleRemoveHistogramDataset('sexAtBirth')}>
        remove sex
      </button>
      <button type="button" onClick={() => latest.handleRemoveHistogramDataset('survivalAnalysis')}>
        remove survival
      </button>
    </div>
  );
}

describe('useHistogramPanelBootstrap', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    let selectedValue = ['sexAtBirth'];
    let activeTabValue = 'sexAtBirth';
    let expandedValue = 'sexAtBirth';
    let chartMenuValue = 'sexAtBirth';
    mockSetSelectedDatasets.mockImplementation((update) => {
      selectedValue = typeof update === 'function' ? update(selectedValue) : update;
      return selectedValue;
    });
    mockSetActiveTab.mockImplementation((update) => {
      activeTabValue = typeof update === 'function' ? update(activeTabValue) : update;
      return activeTabValue;
    });
    mockSetExpandedChart.mockImplementation((update) => {
      expandedValue = typeof update === 'function' ? update(expandedValue) : update;
      return expandedValue;
    });
    mockSetChartTypeMenuDataset.mockImplementation((update) => {
      chartMenuValue = typeof update === 'function' ? update(chartMenuValue) : update;
      return chartMenuValue;
    });
    mockLayout = {
      stripOrder: ['sexAtBirth'],
      topRowOrder: ['venn', 'survival'],
      besideStripPanelId: 'sexAtBirth',
    };
  });

  it('adds a histogram and removes one from the strip', () => {
    const onClose = jest.fn();
    render(<Probe selectedDatasets={['sexAtBirth']} onClose={onClose} />);
    expect(screen.getByText('survival-off')).toBeInTheDocument();
    fireEvent.click(screen.getByText('add race'));
    expect(onClose).toHaveBeenCalled();
    expect(mockSetSelectedDatasets).toHaveBeenCalled();
    expect(mockSetActiveTab).toHaveBeenCalledWith('race');
    fireEvent.click(screen.getByText('remove sex'));
    expect(mockSetExpandedChart).toHaveBeenCalled();
    expect(mockSetShowDownloadDropdown).toHaveBeenCalledWith(false);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('adds and removes survival while updating top-row placement', () => {
    const onClose = jest.fn();
    render(<Probe selectedDatasets={['sexAtBirth']} onClose={onClose} />);
    mockDispatch.mockClear();
    fireEvent.click(screen.getByText('add survival'));
    expect(mockSetSelectedDatasets).toHaveBeenCalled();
    expect(mockDispatch.mock.calls.length).toBeGreaterThanOrEqual(3);
    expect(onClose).toHaveBeenCalled();

    mockDispatch.mockClear();
    mockLayout = {
      stripOrder: ['sexAtBirth', 'survivalAnalysis'],
      topRowOrder: ['venn'],
      besideStripPanelId: null,
    };
    const { unmount } = render(
      <Probe
        selectedDatasets={['sexAtBirth', 'survivalAnalysis']}
        onClose={onClose}
      />,
    );
    fireEvent.click(screen.getAllByText('remove survival')[1]);
    expect(mockDispatch).toHaveBeenCalled();
    unmount();
  });

  it('closes duplicate additions and synchronizes persisted sizes', () => {
    const onClose = jest.fn();
    render(
      <Probe
        selectedDatasets={['sexAtBirth', 'survivalAnalysis']}
        onClose={onClose}
        reduxSurvivalSize={{ width: 600, height: 500 }}
      />,
    );
    fireEvent.click(screen.getByText('add survival'));
    expect(onClose).toHaveBeenCalled();
    expect(mockSetHistogramCardSizes).toHaveBeenCalledWith({
      sexAtBirth: { width: 400 },
    });
    expect(mockSetSurvivalCardSize).toHaveBeenCalled();
  });

  it('closes menus after outside clicks', () => {
    render(
      <Probe
        selectedDatasets={['sexAtBirth']}
        onClose={jest.fn()}
        chartTypeMenuDataset="sexAtBirth"
        showDownloadDropdown
      />,
    );
    act(() => {
      document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });
    expect(mockSetChartTypeMenuDataset).toHaveBeenCalledWith(null);
    expect(mockSetShowDownloadDropdown).toHaveBeenCalledWith(false);
  });

  it('initializes an empty strip and beside selection from visible data', () => {
    mockLayout = {
      stripOrder: [],
      topRowOrder: ['venn'],
      besideStripPanelId: null,
    };
    render(
      <Probe
        selectedDatasets={['sexAtBirth', 'race']}
        onClose={jest.fn()}
        inlineAddChartOpen={false}
      />,
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ payload: ['sexAtBirth', 'race'] }),
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ payload: 'sexAtBirth' }),
    );
  });

  it('adds missing datasets around top-row tokens and clears stale beside state', () => {
    mockLayout = {
      stripOrder: ['venn', 'survivalAnalysis'],
      topRowOrder: [],
      besideStripPanelId: 'missing',
    };
    const { rerender } = render(
      <Probe
        selectedDatasets={['race', 'survivalAnalysis']}
        onClose={jest.fn()}
      />,
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: ['venn', 'race', 'survivalAnalysis'],
      }),
    );

    mockDispatch.mockClear();
    mockLayout = {
      stripOrder: [],
      topRowOrder: ['venn'],
      besideStripPanelId: 'race',
    };
    rerender(<Probe selectedDatasets={[]} onClose={jest.fn()} />);
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ payload: null }),
    );
  });

  it('ignores incomplete catalog selections and missing removals', () => {
    render(<Probe selectedDatasets={['sexAtBirth']} onClose={jest.fn()} />);
    mockDispatch.mockClear();
    act(() => {
      latest.finalizeInlineAddChart(null, 'race');
      latest.finalizeInlineAddChart('pie', 'not-a-catalog-entry');
      latest.handleRemoveHistogramDataset(null);
    });
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('should keep menus open for inside clicks and skip duplicate histogram adds', () => {
    mockLayout.stripOrder = ['sexAtBirth', 'race'];
    const onClose = jest.fn();
    render(
      <Probe
        selectedDatasets={['sexAtBirth']}
        onClose={onClose}
        chartTypeMenuDataset="sexAtBirth"
        showDownloadDropdown
      />,
    );
    mockSetChartTypeMenuDataset.mockClear();
    mockSetShowDownloadDropdown.mockClear();
    act(() => {
      screen.getByText('chart menu').dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });
    expect(mockSetChartTypeMenuDataset).not.toHaveBeenCalled();

    mockDispatch.mockClear();
    fireEvent.click(screen.getByText('add race'));
    expect(onClose).toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('should add survival onto an empty top row and remove a non-active histogram', () => {
    mockLayout = {
      stripOrder: ['sexAtBirth'],
      topRowOrder: ['survival'],
      besideStripPanelId: 'race',
    };
    render(
      <Probe
        selectedDatasets={['sexAtBirth', 'race']}
        onClose={jest.fn()}
        reduxSurvivalSize={null}
      />,
    );
    fireEvent.click(screen.getByText('add survival'));
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ payload: ['venn'] }),
    );

    mockDispatch.mockClear();
    act(() => {
      latest.setInlineSelectedCatalogId('treatmentType');
      latest.finalizeInlineAddChart('pie');
      latest.handleRemoveHistogramDataset('race');
    });
    expect(mockSetActiveTab).toHaveBeenCalled();
  });
});
