import {
  getNextNewCohortId,
  buildPendingNewCohortFromRowData,
} from '../../../src/components/CohortModal/pendingCohortUtils';

describe('pendingCohortUtils', () => {
  describe('getNextNewCohortId', () => {
    it('should start at New Cohort when none exist', () => {
      expect(getNextNewCohortId({})).toBe('New Cohort');
    });

    it('should increment until an unused id is found', () => {
      expect(getNextNewCohortId({
        'New Cohort': {},
        'New Cohort 1': {},
      })).toBe('New Cohort 2');
    });
  });

  describe('buildPendingNewCohortFromRowData', () => {
    it('should normalize participant rows and skip incomplete ones', () => {
      const draft = buildPendingNewCohortFromRowData({}, [
        { id: 1, participant_id: 'P1', study_id: 'S1' },
        { participant_pk: 2, participant_id: 'P2', dbgap_accession: 'phs1' },
        { participant_id: 'missing-id' },
        null,
      ]);

      expect(draft.cohortId).toBe('New Cohort');
      expect(draft.cohortName).toBe('New Cohort');
      expect(draft.participants).toEqual([
        { id: '1', participant_id: 'P1', study_id: 'S1' },
        { id: '2', participant_id: 'P2', study_id: 'phs1' },
      ]);
      expect(draft.lastUpdated).toBeTruthy();
    });
  });
});
