import reducer, {
  clampSurvivalPanelSize,
  isCohortAnalyzerLayoutPristine,
  migrateLayoutPayloadToV2,
  cohortAnalyzerLayoutInitialState,
} from '../../../src/pages/CohortAnalyzer/store/cohortAnalyzerLayoutReducer';
import {
  CA_LAYOUT_SET_TOP_ROW_ORDER,
  CA_LAYOUT_SET_STRIP_ORDER,
  CA_LAYOUT_SET_BESIDE_STRIP_PANEL,
  CA_LAYOUT_PROMOTE_BESIDE_STRIP,
  CA_LAYOUT_MOVE_TOP_ROW_INTO_STRIP,
  CA_LAYOUT_PATCH_VISIBILITY,
  CA_LAYOUT_SET_PANEL_SIZE,
  CA_LAYOUT_SET_PANEL_SIZE_FOR_ID,
  CA_LAYOUT_UPSERT_PANEL_REGISTRY,
  CA_LAYOUT_PATCH_UI_FLAGS,
  CA_LAYOUT_PATCH_CHART_VISUALS,
  CA_LAYOUT_SET_WORKSPACE_GRID,
  CA_LAYOUT_HYDRATE,
  CA_LAYOUT_RESET,
} from '../../../src/pages/CohortAnalyzer/store/cohortAnalyzerLayoutActionTypes';

describe('cohortAnalyzerLayoutReducer', () => {
  it('should treat missing layout as pristine and clamp survival sizes', () => {
    expect(isCohortAnalyzerLayoutPristine(null)).toBe(true);
    expect(isCohortAnalyzerLayoutPristine({ userLayoutChanged: false })).toBe(true);
    expect(clampSurvivalPanelSize(null)).toBe(null);
    expect(clampSurvivalPanelSize({ width: 10, height: 10 }).width).toBeGreaterThan(10);
    expect(clampSurvivalPanelSize({}).width).toBeGreaterThan(0);
  });

  it('should migrate v1 and v2 payloads', () => {
    expect(migrateLayoutPayloadToV2(null).schemaVersion).toBe(2);
    const v2 = migrateLayoutPayloadToV2({
      schemaVersion: 2,
      topRowOrder: ['venn'],
      sizes: { survival: { width: 10, height: 10 } },
      chartVisualByDataset: { race: 'pie' },
    });
    expect(v2.topRowOrder).toEqual(['venn']);
    expect(v2.chartVisualByPanelId.race).toBe('pie');

    const v1 = migrateLayoutPayloadToV2({
      schemaVersion: 1,
      panelSizes: {
        venn: { width: 1, height: 1 },
        survival: { width: 20, height: 20 },
        histogram: { race: { width: 300 } },
      },
      panelVisibility: { venn: true },
      topRowPanelOrder: ['survival', 'venn'],
      histogramQueueOrder: ['race'],
      besideVennHistogramId: 'race',
      survivalBesideFromSelection: false,
      chartVisualByDataset: { race: 'line' },
    });
    expect(v1.stripOrder).toEqual(['race']);
    expect(v1.besideStripPanelId).toBe('race');
    expect(v1.uiFlags.survivalBesideFromSelection).toBe(false);
    expect(v1.sizes.race).toEqual({ width: 300 });
  });

  it('should apply layout actions and ignore invalid payloads', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(cohortAnalyzerLayoutInitialState);
    expect(reducer(cohortAnalyzerLayoutInitialState, { type: 'UNKNOWN' })).toBe(cohortAnalyzerLayoutInitialState);

    const reordered = reducer(cohortAnalyzerLayoutInitialState, {
      type: CA_LAYOUT_SET_TOP_ROW_ORDER,
      payload: ['survival', 'venn'],
    });
    expect(reordered.userLayoutChanged).toBe(true);

    const autoStrip = reducer(cohortAnalyzerLayoutInitialState, {
      type: CA_LAYOUT_SET_STRIP_ORDER,
      payload: ['race'],
    });
    expect(autoStrip.userLayoutChanged).toBe(false);
    const userStrip = reducer(autoStrip, {
      type: CA_LAYOUT_SET_STRIP_ORDER,
      payload: ['sexAtBirth'],
      meta: { userInitiated: true },
    });
    expect(userStrip.userLayoutChanged).toBe(true);

    expect(reducer(userStrip, { type: CA_LAYOUT_SET_BESIDE_STRIP_PANEL, payload: 'race' }).besideStripPanelId).toBe('race');
    expect(reducer(userStrip, { type: CA_LAYOUT_PROMOTE_BESIDE_STRIP, payload: {} })).toBe(userStrip);
    const promoted = reducer(userStrip, {
      type: CA_LAYOUT_PROMOTE_BESIDE_STRIP,
      payload: { stripOrder: ['race'], besideStripPanelId: 'race' },
    });
    expect(promoted.besideStripPanelId).toBe('race');

    expect(reducer(userStrip, { type: CA_LAYOUT_MOVE_TOP_ROW_INTO_STRIP, payload: { panel: 'histogram' } })).toBe(userStrip);
    const moved = reducer(userStrip, {
      type: CA_LAYOUT_MOVE_TOP_ROW_INTO_STRIP,
      payload: { panel: 'venn', insertBeforeDataset: 'sexAtBirth' },
    });
    expect(moved.stripOrder).toContain('venn');
    const alreadyMoved = reducer(moved, {
      type: CA_LAYOUT_MOVE_TOP_ROW_INTO_STRIP,
      payload: { panel: 'venn' },
    });
    expect(alreadyMoved).toBe(moved);

    expect(reducer(userStrip, { type: CA_LAYOUT_PATCH_VISIBILITY, payload: { race: false } }).visibility.race).toBe(false);
    expect(reducer(userStrip, { type: CA_LAYOUT_SET_PANEL_SIZE_FOR_ID, payload: {} })).toBe(userStrip);
    expect(reducer(userStrip, {
      type: CA_LAYOUT_SET_PANEL_SIZE_FOR_ID,
      payload: { panelId: 'survival', size: { width: 12, height: 12 } },
    }).sizes.survival.width).toBeGreaterThan(12);
    expect(reducer(userStrip, { type: CA_LAYOUT_SET_PANEL_SIZE, payload: {} })).toBe(userStrip);
    expect(reducer(userStrip, {
      type: CA_LAYOUT_SET_PANEL_SIZE,
      payload: { panel: 'histogram', dataset: 'race', size: { width: 320 } },
    }).sizes.race).toEqual({ width: 320 });
    expect(reducer(userStrip, {
      type: CA_LAYOUT_SET_PANEL_SIZE,
      payload: { panel: 'survival', size: { width: 40, height: 40 } },
    }).sizes.survival.height).toBeGreaterThan(40);
    expect(reducer(userStrip, {
      type: CA_LAYOUT_UPSERT_PANEL_REGISTRY,
      payload: { race: { kind: 'histogram' } },
    }).panelRegistry.race.kind).toBe('histogram');
    expect(reducer(userStrip, { type: CA_LAYOUT_PATCH_UI_FLAGS, payload: { x: true } }).uiFlags.x).toBe(true);
    expect(reducer(userStrip, { type: CA_LAYOUT_PATCH_CHART_VISUALS, payload: { race: 'pie' } }).chartVisualByPanelId.race).toBe('pie');
    expect(reducer(userStrip, { type: CA_LAYOUT_SET_WORKSPACE_GRID, payload: { a: 1 } }).workspaceGridLayout).toEqual({ a: 1 });
    expect(reducer(userStrip, { type: CA_LAYOUT_HYDRATE, payload: { schemaVersion: 2, stripOrder: ['race'] } }).stripOrder).toEqual(['race']);
    expect(reducer(userStrip, { type: CA_LAYOUT_RESET })).toEqual(cohortAnalyzerLayoutInitialState);
    expect(clampSurvivalPanelSize({ width: 9999, height: 9999 }).width).toBeLessThan(9999);
    expect(reducer(userStrip, {
      type: CA_LAYOUT_SET_PANEL_SIZE,
      payload: { panel: 'venn', size: { width: 410, height: 300 } },
    }).sizes.venn.width).toBe(410);
    expect(reducer(userStrip, {
      type: CA_LAYOUT_SET_PANEL_SIZE_FOR_ID,
      payload: { panelId: 'race', size: { width: 333 } },
    }).sizes.race).toEqual({ width: 333 });
    expect(migrateLayoutPayloadToV2({
      schemaVersion: 2,
      workspaceGridLayout: null,
      chartVisualByDataset: { race: 'line' },
      topRowOrder: 'bad',
      stripOrder: 'bad',
    }).chartVisualByPanelId.race).toBe('line');
  });
});
