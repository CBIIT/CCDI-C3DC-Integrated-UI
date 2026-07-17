/**
 * Draft-cohort helpers for CREATE NEW COHORT (Cohort Analyzer).
 * Kept separate from `utils.js` so UI callers do not pull GraphQL client deps.
 */

/**
 * Next unused "New Cohort" / "New Cohort N" id matching the create-cohort reducer.
 * @param {Record<string, *>} cohortState
 * @returns {string}
 */
export const getNextNewCohortId = (cohortState = {}) => {
  let cohortId = 'New Cohort';
  let counter = 1;
  while (cohortState[cohortId]) {
    cohortId = `New Cohort ${counter}`;
    counter += 1;
  }
  return cohortId;
};

/**
 * Build a draft cohort for the modal (not persisted until Save Changes).
 * Participants are normalized to the shape required by the cohort reducer.
 * @param {Record<string, *>} cohortState
 * @param {Array} rowData
 * @returns {{ cohortId: string, cohortName: string, cohortDescription: string, participants: Array, lastUpdated: string }}
 */
export const buildPendingNewCohortFromRowData = (cohortState, rowData = []) => {
  const cohortId = getNextNewCohortId(cohortState);
  const participants = (Array.isArray(rowData) ? rowData : [])
    .map((row) => {
      if (!row || typeof row !== 'object') return null;
      const id = row.id != null ? String(row.id) : (row.participant_pk != null ? String(row.participant_pk) : '');
      const participant_id = row.participant_id != null ? String(row.participant_id) : '';
      const study_id = row.study_id != null && String(row.study_id).trim() !== ''
        ? String(row.study_id)
        : (row.dbgap_accession != null ? String(row.dbgap_accession) : '');
      if (!id || !participant_id || !study_id) return null;
      return { id, participant_id, study_id };
    })
    .filter(Boolean);

  return {
    cohortId,
    cohortName: cohortId,
    cohortDescription: '',
    participants,
    lastUpdated: new Date().toISOString(),
  };
};
