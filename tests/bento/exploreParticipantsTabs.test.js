import {
  DEFERRED_EXPLORE_PARTICIPANT_TAB_NAMES,
  deferredExploreParticipantsTabs,
  deferredExploreParticipantTableProperties,
  exploreParticipantsTabs,
  exploreFilesTabs,
  GET_FILES_OVERVIEW_QUERY,
  GET_FILENAMES_QUERY,
  GET_PARTICIPANTS_OVERVIEW_QUERY,
} from '../../src/bento/dashboardTabData';

const queryBody = (document) => document.loc.source.body;

describe('explore participant table tabs', () => {
  it('should hide deferred tables from the visible exploreParticipants tabs', () => {
    const visibleNames = exploreParticipantsTabs.map((tab) => tab.name);

    expect(visibleNames).toEqual([
      'Participants',
      'Studies',
      'Genetic Analyses',
      'Samples',
    ]);

    DEFERRED_EXPLORE_PARTICIPANT_TAB_NAMES.forEach((name) => {
      expect(visibleNames).not.toContain(name);
    });
  });

  it('should retain deferred table configs for property inventory', () => {
    const deferredNames = deferredExploreParticipantsTabs.map((tab) => tab.name);
    expect(deferredNames.sort()).toEqual([...DEFERRED_EXPLORE_PARTICIPANT_TAB_NAMES].sort());

    expect(deferredExploreParticipantTableProperties.Diagnosis).toEqual(
      expect.arrayContaining(['diagnosis', 'diagnosis_classification_system']),
    );
    expect(deferredExploreParticipantTableProperties.Treatments).toEqual(
      expect.arrayContaining(['treatment_type', 'treatment_agent']),
    );
    expect(deferredExploreParticipantTableProperties['Treatment Responses']).toEqual(
      expect.arrayContaining(['response', 'response_category']),
    );
    expect(deferredExploreParticipantTableProperties.Survival).toEqual(
      expect.arrayContaining(['last_known_survival_status']),
    );
  });

  it('should keep exploreFiles limited to the Files table', () => {
    expect(exploreFilesTabs.map((tab) => tab.name)).toEqual(['Files']);
  });

  it('should send cause_of_death with the exploreFiles download query', () => {
    const fileQuery = queryBody(GET_FILES_OVERVIEW_QUERY);
    const filenameQuery = queryBody(GET_FILENAMES_QUERY);
    const participantQuery = queryBody(GET_PARTICIPANTS_OVERVIEW_QUERY);

    expect(exploreFilesTabs[0].api).toBe(GET_FILES_OVERVIEW_QUERY);
    expect(fileQuery).toContain('$cause_of_death: [String]');
    expect(fileQuery).toContain('cause_of_death: $cause_of_death');
    expect(filenameQuery).toContain('cause_of_death: $cause_of_death');
    expect(participantQuery).toContain('cause_of_death: $cause_of_death');
  });
});
