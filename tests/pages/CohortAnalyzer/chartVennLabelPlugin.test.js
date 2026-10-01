import {
  vennCohortLabelFitPlugin,
  buildVennCohortSetLabel,
  flattenVennNodeValue,
  hexToRgba,
} from '../../../src/pages/CohortAnalyzer/vennDiagram/ChartVennConfig';

function makeContext() {
  return {
    font: '',
    fillStyle: '',
    textAlign: '',
    textBaseline: '',
    save: jest.fn(),
    restore: jest.fn(),
    fillText: jest.fn(),
    measureText: jest.fn((text) => ({ width: String(text).length * 8 })),
  };
}

function chartWithSets(sets, labels) {
  const ctx = makeContext();
  return {
    config: { type: 'venn' },
    data: { labels },
    options: {
      scales: {
        y: {
          ticks: {
            color: '#123456',
            font: { family: 'Nunito', weight: 600, size: 16 },
          },
        },
      },
    },
    chartArea: { width: 600, height: 400 },
    width: 600,
    height: 400,
    ctx,
    getDatasetMeta: () => ({
      controller: {
        _cachedMeta: {
          _layout: { sets },
        },
      },
    }),
  };
}

describe('vennCohortLabelFitPlugin', () => {
  it('should format set labels and flatten nested node values', () => {
    expect(buildVennCohortSetLabel('', 3)).toBe(' (3)');
    expect(buildVennCohortSetLabel('Alpha', 2, 2)).toBe('Al… (2)');
    expect(buildVennCohortSetLabel('Alpha', 2, 2, false)).toBe('Al…');
    expect(flattenVennNodeValue(null)).toEqual([]);
    expect(flattenVennNodeValue('')).toEqual([]);
    expect(flattenVennNodeValue(['A', ['B']])).toEqual(['A', 'B']);
    expect(hexToRgba('#112233')).toBe('rgba(17, 34, 51, 1)');
  });

  it('ignores non-Venn and incomplete chart states', () => {
    expect(() => vennCohortLabelFitPlugin.afterDatasetsDraw(null)).not.toThrow();
    expect(() =>
      vennCohortLabelFitPlugin.afterDatasetsDraw({
        config: { type: 'bar' },
        data: { labels: ['A'] },
      }),
    ).not.toThrow();
    expect(() =>
      vennCohortLabelFitPlugin.afterDatasetsDraw({
        config: { type: 'venn' },
        data: { labels: ['A'] },
        getDatasetMeta: () => ({}),
      }),
    ).not.toThrow();
    expect(() =>
      vennCohortLabelFitPlugin.afterDatasetsDraw({
        config: { type: 'venn' },
        data: { labels: ['A'] },
        getDatasetMeta: () => ({ controller: { _cachedMeta: { _layout: { sets: [] } } } }),
      }),
    ).not.toThrow();
    expect(() =>
      vennCohortLabelFitPlugin.afterDatasetsDraw({
        config: { type: 'venn' },
        data: { labels: ['A'] },
        options: {},
        chartArea: null,
        getDatasetMeta: () => ({
          controller: { _cachedMeta: { _layout: { sets: [{ cx: 1, cy: 1, r: 1, text: {} }] } } },
        }),
      }),
    ).not.toThrow();
  });

  it('wraps and draws two-set labels with start/end alignment', () => {
    const chart = chartWithSets(
      [
        {
          cx: 180,
          cy: 200,
          r: 100,
          text: { x: 80, y: 100 },
          align: 'end',
          verticalAlign: 'bottom',
        },
        {
          cx: 420,
          cy: 200,
          r: 100,
          text: { x: 520, y: 100 },
          align: 'start',
          verticalAlign: 'top',
        },
      ],
      [
        'A very long first cohort name that should wrap',
        'Second cohort name',
      ],
    );

    vennCohortLabelFitPlugin.afterDatasetsDraw(chart);

    expect(chart.ctx.save).toHaveBeenCalled();
    expect(chart.ctx.restore).toHaveBeenCalled();
    expect(chart.ctx.fillText).toHaveBeenCalled();
    expect(chart.ctx.fillStyle).toBe('#123456');
  });

  it('draws three-set labels using centered and fallback vertical layouts', () => {
    const chart = chartWithSets(
      [
        {
          cx: 300,
          cy: 200,
          text: { x: 300, y: 40 },
          align: 'center',
          verticalAlign: 'middle',
        },
        {
          cx: 220,
          cy: 220,
          text: { x: 100, y: 360 },
          align: 'end',
        },
        {
          cx: 380,
          cy: 220,
          text: { x: 500, y: 360 },
          align: 'start',
          verticalAlign: 'bottom',
        },
      ],
      ['Top', '', 'Third cohort'],
    );
    chart.options.scales.y.ticks.font.size = 'invalid';

    vennCohortLabelFitPlugin.afterDatasetsDraw(chart);

    expect(chart.ctx.fillText).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Number),
      expect.any(Number),
    );
  });

  it('wraps overlong tokens and uses numeric tick fonts', () => {
    const chart = chartWithSets(
      [{ cx: NaN, cy: NaN, text: {}, align: 'center', verticalAlign: 'top' }],
      ['Supercalifragilisticexpialidocious extra words'],
    );
    chart.options.scales.y.ticks.font = 16;
    chart.options.scales.y.ticks.color = 12;
    chart.ctx.measureText = jest.fn(() => ({ width: 400 }));
    vennCohortLabelFitPlugin.afterDatasetsDraw(chart);
    expect(chart.ctx.fillText).toHaveBeenCalled();
  });
});
