
import { clearAllAndSelectFacet } from '@bento-core/facet-filter';
import {
  GET_IDS_BY_TYPE, GET_PARTICIPANT_IDS,
} from '../../../bento/localSearchData';
import store from '../../../store';
import client from '../../../utils/graphqlClient';

export const getFacetValues = (facet, facetValue) => ({[facet]: { [facetValue]: true }});

/**
* set filter item from Arm/Program details page (NUMBER OF CASES: button)
*/
export const onClearAllAndSelectFacetValue = (facet, facetValue) => {
  const filterValue = getFacetValues(facet, facetValue );
  store.dispatch(clearAllAndSelectFacet(filterValue));
}

let cachedIdsLists = null;

/**
 * Get list of all available ids for search (participant + associated synonym ids).
 * Cached per session so reopening the facet does not repeat the full idsLists fetch/parse.
 *
 * @async
 * @returns {Promise<object|array>} idsLists payload from GraphQL
 */
export async function getAllIds() {
  if (cachedIdsLists) {
    return cachedIdsLists;
  }
  const allids = await client
    .query({
      query: GET_IDS_BY_TYPE(),
      variables: {},
    })
    .then((result) => result.data.idsLists)
    .catch(() => null);
  if (allids) {
    cachedIdsLists = allids;
    return allids;
  }
  return [];
}

/** Max participant rows merged into autocomplete options (synonyms are always appended in full). */
const MAX_PARTICIPANT_AUTOCOMPLETE = 25000;

/** Pre-built autocomplete rows (participant + synonym); avoids remapping on every search open. */
let cachedParticipantSearchOptions = null;

/**
 * Participant local-find suggestions: participant IDs plus associated synonym rows.
 * Uses cached GraphQL idsLists and caches the mapped array for the session.
 * Participant list is capped so the merged array stays bounded; all synonym rows are kept.
 *
 * @async
 * @returns {Promise<Array<{ type: string, title: string, synonym?: string }>>}
 */
export async function getParticipantSearchSuggestions() {
  if (cachedParticipantSearchOptions) {
    return cachedParticipantSearchOptions;
  }
  const response = await getAllIds().catch(() => []);
  const participantSuggestions = Array.isArray(response && response.participantIds)
    ? response.participantIds.map((id) => ({ type: 'participantIds', title: id }))
    : [];
  const associatedRaw = response && response.associatedIds;
  const associatedIdsSuggestions = Array.isArray(associatedRaw)
    ? associatedRaw.map((item) => ({
      type: 'associatedIds',
      title: item.participant_id,
      synonym: item.associated_id,
    }))
    : [];
  const cappedParticipants = participantSuggestions.length > MAX_PARTICIPANT_AUTOCOMPLETE
    ? participantSuggestions.slice(0, MAX_PARTICIPANT_AUTOCOMPLETE)
    : participantSuggestions;
  cachedParticipantSearchOptions = cappedParticipants.concat(associatedIdsSuggestions);
  return cachedParticipantSearchOptions;
}

/**
 * URL sync for participant ID search vs synonym (associated) IDs — parallel p_id | p_syn segments.
 */
export function buildParticipantAutocompleteUrlParams(autocompleteItems) {
  if (!autocompleteItems || !autocompleteItems.length) {
    return { p_id: '', p_syn: '' };
  }
  const hasAssociated = autocompleteItems.some(
    (d) => d.type === 'associatedIds' && d.synonym,
  );
  const p_syn = autocompleteItems.map((d) => (
    d.type === 'associatedIds' && d.synonym
      ? encodeURIComponent(d.synonym)
      : ''
  )).join('|');
  return {
    p_id: autocompleteItems.map((d) => d.title).join('|'),
    p_syn: hasAssociated ? p_syn : '',
  };
}

export function parseParticipantAutocompleteFromUrl(participantIdPipe, pSynPipe) {
  if (!participantIdPipe) return [];
  const ids = participantIdPipe.split('|');
  const synParts = pSynPipe ? pSynPipe.split('|') : [];
  const syns = ids.map((_, i) => (synParts[i] != null ? synParts[i] : ''));
  return ids.map((title, i) => {
    const raw = syns[i];
    if (raw) {
      try {
        return { type: 'associatedIds', title, synonym: decodeURIComponent(raw) };
      } catch (e) {
        return { type: 'associatedIds', title, synonym: raw };
      }
    }
    return { type: 'participantIds', title };
  });
}

/**
 * Get list of matching ids for a list of ids
 *
 * @param {string[]} subjectIdsArray
 * @returns {Promise<string[]>}
 */
export async function getAllParticipantIds(participantIdsArray) {
  const allids = await client
    .query({
      query: GET_PARTICIPANT_IDS,
      variables: {
        participant_ids: participantIdsArray,
      },
    })
    .then((result) => result.data.findParticipantIdsInList)
    .catch(() => []);
  return allids;
}
