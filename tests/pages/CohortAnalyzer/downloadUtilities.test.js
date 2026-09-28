const mockToPng = jest.fn();
const mockAddImage = jest.fn();
const mockPdfSave = jest.fn();

jest.mock('html-to-image', () => ({
  toPng: (...args) => mockToPng(...args),
}));
jest.mock('jspdf', () => ({
  jsPDF: jest.fn(() => ({
    internal: {
      pageSize: {
        getWidth: () => 600,
        getHeight: () => 800,
      },
    },
    addImage: mockAddImage,
    save: mockPdfSave,
  })),
}));

import {
  downloadChartAreaAsPdf,
  downloadChartAreaAsPng,
  downloadJsonPayload,
} from '../../../src/pages/CohortAnalyzer/downloads/cohortAnalyzerDownloadAll';
import {
  downloadKaplanMeierChart,
  downloadRiskTable,
  downloadSurvivalCombined,
} from '../../../src/pages/CohortAnalyzer/HistogramPanel/utils/histogramSurvivalDownloads';
import { createHistogramModalSurvivalDownloads } from '../../../src/pages/CohortAnalyzer/HistogramPanel/utils/histogramModalSurvivalDownloads';
import {
  beginSurvivalRiskTableDownloadCapture,
  SURVIVAL_RISK_TABLE_DOWNLOAD_ATTR,
} from '../../../src/pages/CohortAnalyzer/HistogramPanel/utils/survivalRiskTableDownloadCapture';

const flush = async () => {
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
};

describe('Cohort Analyzer download utilities', () => {
  let originalCreateElement;
  let originalImage;
  let originalXmlSerializer;
  let consoleError;
  let alertSpy;
  let anchorClicks;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    anchorClicks = [];
    consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    URL.createObjectURL = jest.fn(() => `blob:${URL.createObjectURL.mock.calls.length}`);
    URL.revokeObjectURL = jest.fn();
    global.fetch = jest.fn(() =>
      Promise.resolve({ blob: () => Promise.resolve(new Blob(['image'])) }),
    );
    mockToPng.mockResolvedValue('data:image/png;base64,source');

    originalCreateElement = document.createElement.bind(document);
    document.createElement = (tagName) => {
      const element = originalCreateElement(tagName);
      if (tagName === 'canvas') {
        element.getContext = () => ({
          fillStyle: '',
          fillRect: jest.fn(),
          drawImage: jest.fn(),
          scale: jest.fn(),
        });
        element.toDataURL = () => 'data:image/png;base64,padded';
        element.toBlob = (callback) => callback(new Blob(['canvas']));
      }
      if (tagName === 'a') {
        element.click = jest.fn(() => anchorClicks.push(element.download));
      }
      return element;
    };

    originalImage = global.Image;
    const MockImage = class {
      constructor() {
        this.naturalWidth = 500;
        this.naturalHeight = 300;
        this.width = 500;
        this.height = 300;
      }

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
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    document.createElement = originalCreateElement;
    global.Image = originalImage;
    window.Image = originalImage;
    global.XMLSerializer = originalXmlSerializer;
    consoleError.mockRestore();
    alertSpy.mockRestore();
    document.body.innerHTML = '';
  });

  it('downloads JSON, padded PNG, and PDF chart-area exports', async () => {
    const chartArea = document.createElement('div');
    Object.defineProperties(chartArea, {
      scrollWidth: { value: 900 },
      scrollHeight: { value: 600 },
    });
    const excluded = document.createElement('button');
    excluded.setAttribute('data-chart-export-exclude', 'true');
    chartArea.appendChild(excluded);

    downloadJsonPayload({ cohorts: ['c1'] }, 'cohorts.json');
    await downloadChartAreaAsPng(chartArea, 'charts.png');
    await downloadChartAreaAsPdf(chartArea, 'charts.pdf');

    expect(anchorClicks).toEqual(
      expect.arrayContaining(['cohorts.json', 'charts.png']),
    );
    expect(mockToPng).toHaveBeenCalledTimes(2);
    const captureOptions = mockToPng.mock.calls[0][1];
    expect(captureOptions.width).toBe(900);
    expect(captureOptions.height).toBe(600);
    expect(captureOptions.filter(excluded)).toBe(false);
    expect(captureOptions.filter(document.createTextNode('text'))).toBe(true);
    expect(mockAddImage).toHaveBeenCalled();
    expect(mockPdfSave).toHaveBeenCalledWith('charts.pdf');
  });

  it('reports unavailable and failed chart-area exports', async () => {
    await downloadChartAreaAsPng(null);
    await downloadChartAreaAsPdf(null);
    expect(alertSpy).toHaveBeenCalledTimes(2);

    mockToPng.mockRejectedValue(new Error('capture failed'));
    await downloadChartAreaAsPng(document.createElement('div'));
    await downloadChartAreaAsPdf(document.createElement('div'));
    expect(consoleError).toHaveBeenCalledWith('PNG export failed', expect.any(Error));
    expect(consoleError).toHaveBeenCalledWith('PDF export failed', expect.any(Error));
  });

  it('captures a KM SVG and downloads its canvas', () => {
    const wrapper = document.createElement('div');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 640 360');
    wrapper.appendChild(svg);

    downloadKaplanMeierChart({ current: wrapper });

    expect(anchorClicks).toContain('kaplan_meier_chart.png');
    expect(URL.createObjectURL).toHaveBeenCalledTimes(2);
  });

  it('falls back to SVG geometry when viewBox is missing or incomplete', () => {
    const wrapper = document.createElement('div');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    Object.defineProperty(svg, 'width', { value: { baseVal: { value: 0 } } });
    Object.defineProperty(svg, 'height', { value: { baseVal: { value: 0 } } });
    svg.getBoundingClientRect = () => ({ width: 220, height: 110 });
    wrapper.appendChild(svg);
    downloadKaplanMeierChart({ current: wrapper });

    const boxed = document.createElement('div');
    const svg2 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg2.setAttribute('viewBox', '0 0');
    Object.defineProperty(svg2, 'width', { value: { baseVal: { value: 180 } } });
    Object.defineProperty(svg2, 'height', { value: { baseVal: { value: 90 } } });
    boxed.appendChild(svg2);
    downloadKaplanMeierChart({ current: boxed });
    expect(anchorClicks.filter((name) => name === 'kaplan_meier_chart.png').length).toBeGreaterThan(1);
  });

  it('downloads a combined survival image without a risk-table ref', async () => {
    downloadSurvivalCombined({ current: document.createElement('div') });
    await flush();
    expect(anchorClicks).toContain('survival_analysis_combined.png');
  });

  it('downloads risk-table and combined survival images and restores styles', async () => {
    const table = document.createElement('div');
    table.style.marginLeft = '14px';
    table.style.backgroundColor = 'white';
    const tbody = document.createElement('tbody');
    const td = document.createElement('td');
    td.style.color = 'red';
    const span = document.createElement('span');
    td.appendChild(span);
    tbody.appendChild(td);
    table.appendChild(tbody);
    const container = document.createElement('div');

    downloadRiskTable({ current: table });
    await flush();
    jest.runOnlyPendingTimers();
    downloadSurvivalCombined(
      { current: container },
      jest.fn(),
      { current: table },
    );
    await flush();
    jest.runOnlyPendingTimers();

    expect(anchorClicks).toEqual(
      expect.arrayContaining(['risk_table.png', 'survival_analysis_combined.png']),
    );
    expect(table.style.marginLeft).toBe('14px');
    expect(table.style.backgroundColor).toBe('white');
    expect(table.hasAttribute(SURVIVAL_RISK_TABLE_DOWNLOAD_ATTR)).toBe(false);
    expect(td.style.color).toBe('red');
    expect(span.style.color).toBe('');
  });

  it('handles missing survival refs and html-to-image failures', async () => {
    downloadRiskTable({ current: null });
    downloadSurvivalCombined({ current: null }, jest.fn(), { current: null });
    expect(consoleError).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalled();

    const table = document.createElement('div');
    mockToPng.mockRejectedValue(new Error('image failed'));
    downloadRiskTable({ current: table });
    downloadSurvivalCombined(
      { current: document.createElement('div') },
      jest.fn(),
      { current: table },
    );
    await flush();
    expect(alertSpy).toHaveBeenCalledWith(
      'Error downloading Risk table. Please check the console for details.',
    );
  });

  it('provides equivalent modal survival downloads', async () => {
    const setShowDownloadDropdown = jest.fn();
    const container = document.createElement('div');
    const table = document.createElement('div');
    table.style.height = '200px';
    const km = document.createElement('div');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 500 300');
    km.appendChild(svg);
    const downloads = createHistogramModalSurvivalDownloads({
      setShowDownloadDropdown,
      survivalAnalysisContainerRef: { current: container },
      riskTableRef: { current: table },
    });

    downloads.downloadKaplanMeierChart({ current: km });
    downloads.downloadRiskTable({ current: table });
    downloads.downloadBoth();
    await flush();
    jest.runOnlyPendingTimers();

    expect(setShowDownloadDropdown).toHaveBeenCalledWith(false);
    expect(anchorClicks).toEqual(
      expect.arrayContaining([
        'kaplan_meier_chart.png',
        'risk_table.png',
        'survival_analysis_combined.png',
      ]),
    );
    expect(table.style.height).toBe('200px');
  });

  it('handles unavailable and failed modal survival downloads', async () => {
    const setShowDownloadDropdown = jest.fn();
    const missing = createHistogramModalSurvivalDownloads({
      setShowDownloadDropdown,
      survivalAnalysisContainerRef: { current: null },
      riskTableRef: { current: null },
    });
    missing.downloadKaplanMeierChart({ current: null });
    missing.downloadKaplanMeierChart({ current: document.createElement('div') });
    missing.downloadRiskTable({ current: null });
    missing.downloadBoth();
    expect(consoleError).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith('Container not available for download.');

    const table = document.createElement('div');
    const failing = createHistogramModalSurvivalDownloads({
      setShowDownloadDropdown,
      survivalAnalysisContainerRef: { current: document.createElement('div') },
      riskTableRef: { current: table },
    });
    mockToPng.mockRejectedValue(new Error('modal image failed'));
    failing.downloadRiskTable({ current: table });
    failing.downloadBoth();
    await flush();
    expect(alertSpy).toHaveBeenCalledWith(
      'Error downloading Risk table. Please check the console for details.',
    );
    expect(alertSpy).toHaveBeenCalledWith(
      'Error downloading combined chart. Please check the console for details.',
    );
  });

  it('cleans up risk-table capture with and without a tbody', () => {
    expect(() => beginSurvivalRiskTableDownloadCapture(null)()).not.toThrow();

    const root = document.createElement('div');
    const cleanupWithoutBody = beginSurvivalRiskTableDownloadCapture(root);
    expect(root.getAttribute(SURVIVAL_RISK_TABLE_DOWNLOAD_ATTR)).toBe('true');
    cleanupWithoutBody();
    expect(root.hasAttribute(SURVIVAL_RISK_TABLE_DOWNLOAD_ATTR)).toBe(false);
  });
});
