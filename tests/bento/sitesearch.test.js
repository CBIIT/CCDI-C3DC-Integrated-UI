jest.mock('../../src/utils/graphqlClient', () => ({
  __esModule: true,
  default: {
    query: (...args) => global.__siteSearchQuery(...args),
  },
}));

import {
  getResultQueryByField,
  queryAutocompleteAPI,
  queryCountAPI,
  queryResultAPI,
  SEARCH_PAGE_RESULT_ABOUT,
  SEARCH_PAGE_RESULT_FILES,
  SEARCH_PAGE_RESULT_MODEL,
  SEARCH_PAGE_RESULT_PARTICIPANTS,
  SEARCH_PAGE_RESULT_SAMPLES,
  SEARCH_PAGE_RESULT_STUDIES,
} from '../../src/bento/sitesearch';

describe('sitesearch queries', () => {
  beforeEach(() => {
    global.__siteSearchQuery = jest.fn(() => Promise.resolve({
      data: {
        globalSearch: {
          participants: [{ id: 'p1' }],
          studies: [{ id: 's1' }],
        },
      },
    }));
  });

  it('should map each result field to its query', () => {
    expect(getResultQueryByField('all')).toBe(SEARCH_PAGE_RESULT_PARTICIPANTS);
    expect(getResultQueryByField('participants')).toBe(SEARCH_PAGE_RESULT_PARTICIPANTS);
    expect(getResultQueryByField('studies')).toBe(SEARCH_PAGE_RESULT_STUDIES);
    expect(getResultQueryByField('samples')).toBe(SEARCH_PAGE_RESULT_SAMPLES);
    expect(getResultQueryByField('files')).toBe(SEARCH_PAGE_RESULT_FILES);
    expect(getResultQueryByField('model')).toBe(SEARCH_PAGE_RESULT_MODEL);
    expect(getResultQueryByField('about_page')).toBe(SEARCH_PAGE_RESULT_ABOUT);
    expect(getResultQueryByField('unknown')).toBe(SEARCH_PAGE_RESULT_ABOUT);
  });

  it('should return autocomplete and count payloads', async () => {
    await expect(queryAutocompleteAPI('brain')).resolves.toEqual({
      participants: [{ id: 'p1' }],
      studies: [{ id: 's1' }],
    });
    await expect(queryCountAPI('brain')).resolves.toEqual({
      participants: [{ id: 'p1' }],
      studies: [{ id: 's1' }],
    });
    await expect(queryResultAPI('participants', { input: 'brain' })).resolves.toEqual([{ id: 'p1' }]);
    await expect(queryResultAPI('missing', { input: 'brain' })).resolves.toEqual([]);
  });

  it('should swallow query failures', async () => {
    global.__siteSearchQuery = jest.fn(() => Promise.reject(new Error('down')));
    await expect(queryAutocompleteAPI('x')).resolves.toEqual([]);
    await expect(queryCountAPI('x')).resolves.toBeUndefined();
    await expect(queryResultAPI('participants', { input: 'x' })).resolves.toEqual([]);
  });
});
