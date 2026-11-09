import {
  DEFERRED_EXPLORE_PARTICIPANT_TAB_NAMES,
  deferredExploreParticipantsTabs,
  deferredExploreParticipantTableProperties,
  exploreParticipantsTabs,
  exploreFilesTabs,
} from '../../src/bento/dashboardTabData';

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
});
