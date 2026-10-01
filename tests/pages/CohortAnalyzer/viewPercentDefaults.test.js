import {
  defaultVennOuterHeightPx,
  defaultVennOuterPx,
  defaultHistogramPlotHeightPx,
  defaultHistogramStripDropSlotWidthPx,
  defaultHistogramCardOuterMinHeightPx,
  defaultVennModalSlotPx,
  defaultModalKmChartHeightPx,
  defaultModalHistogramDatasetChartHeightPx,
  vennChartSlotDimensionsFromOuterPx,
  chartVennFallbackCanvasDimensionsPx,
} from '../../../src/pages/CohortAnalyzer/config/cohortAnalyzerViewPercentDefaults';

describe('cohort analyzer view percent defaults', () => {
  const originalInnerWidth = window.innerWidth;
  const originalInnerHeight = window.innerHeight;

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: originalInnerWidth });
    Object.defineProperty(window, 'innerHeight', { configurable: true, writable: true, value: originalInnerHeight });
  });

  it('should use compact values when window is unavailable', () => {
    const realWindow = global.window;
    try {
      delete global.window;
      expect(defaultVennOuterHeightPx()).toBe(400);
      expect(defaultVennOuterPx().width).toBeGreaterThan(0);
      expect(defaultHistogramPlotHeightPx()).toBeGreaterThan(0);
      expect(defaultHistogramStripDropSlotWidthPx()).toBe(320);
      expect(defaultVennModalSlotPx().slotWidth).toBeGreaterThan(0);
      expect(defaultModalKmChartHeightPx()).toBeGreaterThan(0);
      expect(defaultModalHistogramDatasetChartHeightPx()).toBeGreaterThan(0);
    } finally {
      global.window = realWindow;
    }
  });

  it('should scale from the current viewport', () => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: 1900 });
    Object.defineProperty(window, 'innerHeight', { configurable: true, writable: true, value: 900 });
    expect(defaultVennOuterHeightPx()).toBe(580);
    expect(defaultVennOuterPx().height).toBe(580);
    expect(defaultHistogramPlotHeightPx()).toBeGreaterThan(0);
    expect(defaultHistogramStripDropSlotWidthPx()).toBeGreaterThan(0);
    expect(defaultHistogramCardOuterMinHeightPx(100)).toBeGreaterThan(100);
    expect(defaultVennModalSlotPx().slotHeight).toBeGreaterThan(0);
    expect(defaultModalKmChartHeightPx()).toBeGreaterThanOrEqual(260);
    expect(defaultModalHistogramDatasetChartHeightPx()).toBeGreaterThanOrEqual(460);
    expect(vennChartSlotDimensionsFromOuterPx(800, 500).slotWidth).toBeGreaterThan(200);
    expect(chartVennFallbackCanvasDimensionsPx(2).width).toBeLessThan(chartVennFallbackCanvasDimensionsPx(3).width);
  });

  it('should use compact Venn height on narrower screens', () => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: 1200 });
    expect(defaultVennOuterHeightPx()).toBe(400);
  });
});
