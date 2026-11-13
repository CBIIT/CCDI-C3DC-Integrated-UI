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
  // Get next new cohort id
  const cohortId = getNextNewCohortId(cohortState);

  // Convert value to string if it is not null
  const asString = (value) => (value != null ? String(value) : "");

  // Convert row to participant object
  const toParticipant = (row) => {
    if (!row || typeof row !== "object") return null;
    const id = row.id != null ? asString(row.id) : asString(row.participant_pk);
    const participant_id = asString(row.participant_id);
    const study_id = asString(row.study_id).trim()
      ? asString(row.study_id)
      : asString(row.dbgap_accession);
    if (!id || !participant_id || !study_id) return null;
    return { id, participant_id, study_id };
  };

  // Track seen IDs to filter out duplicates
  const seenIds = new Set();

  // Map to participants and filter out duplicates
  const participants = (Array.isArray(rowData) ? rowData : [])
    .map(toParticipant)
    .filter(Boolean)
    .filter((participant) => {
      // Remove duplicates id participants by tracking seen IDs
      if (seenIds.has(participant.id)) return false;
      seenIds.add(participant.id);
      return true;
    });

  // Return cohort object
  return {
    cohortId,
    cohortName: cohortId,
    cohortDescription: '',
    participants,
    lastUpdated: new Date().toISOString(),
  };
};
