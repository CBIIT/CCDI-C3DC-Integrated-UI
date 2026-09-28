jest.mock('../../../src/utils/graphqlClient', () => ({
  query: jest.fn(),
}));

jest.mock('../../../src/store', () => ({
  dispatch: jest.fn(),
}));

jest.mock('@bento-core/facet-filter', () => ({
  clearAllAndSelectFacet: (value) => ({ type: 'CLEAR_SELECT', value }),
}));

jest.mock('../../../src/bento/localSearchData', () => ({
  GET_IDS_BY_TYPE: () => 'GET_IDS',
  GET_PARTICIPANT_IDS: 'GET_PIDS',
}));

import client from '../../../src/utils/graphqlClient';
import store from '../../../src/store';
import {
  buildParticipantAutocompleteUrlParams,
  getAllIds,
  getAllParticipantIds,
  getFacetValues,
  getParticipantSearchSuggestions,
  onClearAllAndSelectFacetValue,
  parseParticipantAutocompleteFromUrl,
} from '../../../src/pages/inventory/sideBar/BentoFilterUtils';

describe('BentoFilterUtils', () => {
  beforeEach(() => {
    client.query.mockReset();
    store.dispatch.mockReset();
  });

  it('should build a single-facet filter map', () => {
    expect(getFacetValues('sex_at_birth', 'Female')).toEqual({
      sex_at_birth: { Female: true },
    });
  });

  it('should dispatch clear-all-and-select', () => {
    onClearAllAndSelectFacetValue('sex_at_birth', 'Female');
    expect(store.dispatch).toHaveBeenCalledWith({
      type: 'CLEAR_SELECT',
      value: { sex_at_birth: { Female: true } },
    });
  });

  it('should return an empty array when getAllIds fails', async () => {
    client.query.mockRejectedValueOnce(new Error('network'));
    await expect(getAllIds()).resolves.toEqual([]);
  });

  it('should cache idsLists after a successful getAllIds call', async () => {
    client.query.mockResolvedValueOnce({
      data: {
        idsLists: {
          participantIds: ['P1'],
          associatedIds: [{ participant_id: 'P1', associated_id: 'SYN' }],
        },
      },
    });
    const first = await getAllIds();
    const second = await getAllIds();
    expect(first.participantIds).toEqual(['P1']);
    expect(second).toBe(first);
    expect(client.query).toHaveBeenCalledTimes(1);
  });

  it('should map participant and synonym suggestions', async () => {
    const suggestions = await getParticipantSearchSuggestions();
    expect(suggestions).toEqual([
      { type: 'participantIds', title: 'P1' },
      { type: 'associatedIds', title: 'P1', synonym: 'SYN' },
    ]);
    const again = await getParticipantSearchSuggestions();
    expect(again).toBe(suggestions);
  });

  it('should return participant ids from GraphQL and empty on failure', async () => {
    client.query.mockResolvedValueOnce({
      data: { findParticipantIdsInList: ['p1'] },
    });
    await expect(getAllParticipantIds(['p1'])).resolves.toEqual(['p1']);
    client.query.mockRejectedValueOnce(new Error('network'));
    await expect(getAllParticipantIds([])).resolves.toEqual([]);
  });

  describe('URL autocomplete params', () => {
    it('should return empty params without items', () => {
      expect(buildParticipantAutocompleteUrlParams([])).toEqual({ p_id: '', p_syn: '' });
    });

    it('should join participant ids without synonym segments', () => {
      expect(buildParticipantAutocompleteUrlParams([
        { type: 'participantIds', title: 'A' },
        { type: 'participantIds', title: 'B' },
      ])).toEqual({ p_id: 'A|B', p_syn: '' });
    });

    it('should encode synonym segments when associated ids are present', () => {
      expect(buildParticipantAutocompleteUrlParams([
        { type: 'associatedIds', title: 'A', synonym: 'x y' },
      ])).toEqual({ p_id: 'A', p_syn: encodeURIComponent('x y') });
    });

    it('should parse participant and associated ids from the URL', () => {
      expect(parseParticipantAutocompleteFromUrl('A|B', `${encodeURIComponent('syn')}|`)).toEqual([
        { type: 'associatedIds', title: 'A', synonym: 'syn' },
        { type: 'participantIds', title: 'B' },
      ]);
    });

    it('should keep raw synonym text when decodeURIComponent fails', () => {
      expect(parseParticipantAutocompleteFromUrl('A', '%E0%A4%A')).toEqual([
        { type: 'associatedIds', title: 'A', synonym: '%E0%A4%A' },
      ]);
    });

    it('should return an empty list without a participant pipe', () => {
      expect(parseParticipantAutocompleteFromUrl('')).toEqual([]);
    });
  });
});
