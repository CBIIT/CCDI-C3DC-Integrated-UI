import { CA_LAYOUT_SLOT, CA_PANEL_KIND } from './cohortAnalyzerLayoutConstants';

/** Strip / survival chart labels — keep in sync with Histogram placeholders. */
export const COHORT_ANALYZER_HISTOGRAM_TITLES = {
  survivalAnalysis: 'Survival Analysis',
  sexAtBirth: 'Sex at Birth',
  race: 'Race',
  treatmentType: 'Treatment Type',
  response: 'Treatment Outcome',
};

/**
 * Default charts shown on first load / after “Reset View”
 * (positions come from Redux layout; this list is the item set).
 */
export const DEFAULT_COHORT_ANALYZER_SELECTED_DATASETS = [
  'sexAtBirth',
  'race',
  'response',
  'survivalAnalysis',
];

/** Baseline `panelRegistry` entries (Venn, survival, all known histogram keys). */
export function buildDefaultCohortAnalyzerPanelRegistry() {
  const patch = {
    [CA_LAYOUT_SLOT.VENN]: {
      kind: CA_PANEL_KIND.VENN,
      chartKey: CA_LAYOUT_SLOT.VENN,
      label: 'Venn diagram',
    },
    [CA_LAYOUT_SLOT.SURVIVAL]: {
      kind: CA_PANEL_KIND.SURVIVAL,
      chartKey: 'survivalAnalysis',
      label: COHORT_ANALYZER_HISTOGRAM_TITLES.survivalAnalysis,
    },
  };
  Object.keys(COHORT_ANALYZER_HISTOGRAM_TITLES).forEach((key) => {
    if (key === 'survivalAnalysis') return;
    patch[key] = {
      kind: CA_PANEL_KIND.HISTOGRAM,
      chartKey: key,
      label: COHORT_ANALYZER_HISTOGRAM_TITLES[key],
    };
  });
  return patch;
}
