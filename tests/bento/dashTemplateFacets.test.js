import {
  facetsParticipantsConfig,
  facetsExploreFilesConfig,
  queryParams,
} from '../../src/bento/dashTemplate';

const REMOVED_FACET_DATAFIELDS = [
  'treatment_agent',
  'response_category',
  'response_system',
];

const REMOVED_FACET_LABELS = [
  'Treatment Agent',
  'Response Category',
  'Response System',
];

const getDatafields = (facets) => facets.map((facet) => facet.datafield);
const getLabels = (facets) => facets.map((facet) => facet.label);

describe('dashTemplate explore facets', () => {
  it('should not expose removed facets on /exploreParticipants', () => {
    const datafields = getDatafields(facetsParticipantsConfig);
    const labels = getLabels(facetsParticipantsConfig);

    REMOVED_FACET_DATAFIELDS.forEach((datafield) => {
      expect(datafields).not.toContain(datafield);
    });
    REMOVED_FACET_LABELS.forEach((label) => {
      expect(labels).not.toContain(label);
    });
  });

  it('should not expose removed facets on /exploreFiles', () => {
    const datafields = getDatafields(facetsExploreFilesConfig);
    const labels = getLabels(facetsExploreFilesConfig);

    REMOVED_FACET_DATAFIELDS.forEach((datafield) => {
      expect(datafields).not.toContain(datafield);
    });
    REMOVED_FACET_LABELS.forEach((label) => {
      expect(labels).not.toContain(label);
    });
  });

  it('should keep other treatment and response facets available for participants', () => {
    const datafields = getDatafields(facetsParticipantsConfig);

    expect(datafields).toContain('treatment_type');
    expect(datafields).toContain('response');
    expect(datafields).toContain('age_at_response');
  });

  it('should not sync removed facets through explore query params', () => {
    REMOVED_FACET_DATAFIELDS.forEach((datafield) => {
      expect(queryParams).not.toContain(datafield);
    });
  });
});
