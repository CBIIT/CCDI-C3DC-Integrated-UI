import {
  buildDefaultCohortAnalyzerPanelRegistry,
  COHORT_ANALYZER_HISTOGRAM_TITLES,
  DEFAULT_COHORT_ANALYZER_SELECTED_DATASETS,
} from '../../../store/cohortAnalyzerDefaultPanelRegistry';

describe('cohortAnalyzerDefaultPanelRegistry', () => {
  describe('buildDefaultCohortAnalyzerPanelRegistry', () => {
    it('includes venn and survival panels', () => {
      const registry = buildDefaultCohortAnalyzerPanelRegistry();
      expect(registry.venn.kind).toBe('venn');
      expect(registry.survival.chartKey).toBe('survivalAnalysis');
    });

    it('includes histogram dataset panels except survival duplicate', () => {
      const registry = buildDefaultCohortAnalyzerPanelRegistry();
      expect(registry.sexAtBirth.label).toBe(COHORT_ANALYZER_HISTOGRAM_TITLES.sexAtBirth);
      expect(registry.race.kind).toBe('histogram');
    });
  });

  describe('DEFAULT_COHORT_ANALYZER_SELECTED_DATASETS', () => {
    it('lists the default chart set for Reset View', () => {
      expect(DEFAULT_COHORT_ANALYZER_SELECTED_DATASETS).toEqual([
        'sexAtBirth',
        'race',
        'response',
        'survivalAnalysis',
      ]);
    });
  });
});