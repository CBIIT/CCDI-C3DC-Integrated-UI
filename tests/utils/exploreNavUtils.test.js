import {
  exploreNavTo,
  EXPLORE_FILES_PATH,
  EXPLORE_PARTICIPANTS_PATH,
} from '../../src/utils/exploreNavUtils';

describe('exploreNavTo', () => {
  it('should keep search when switching between explore inventory routes', () => {
    expect(exploreNavTo(EXPLORE_FILES_PATH, {
      pathname: EXPLORE_PARTICIPANTS_PATH,
      search: '?sex_at_birth=Female',
    })).toBe(`${EXPLORE_FILES_PATH}?sex_at_birth=Female`);
  });

  it('should drop search when arriving from a non-explore page', () => {
    expect(exploreNavTo(EXPLORE_PARTICIPANTS_PATH, {
      pathname: '/',
      search: '?q=1',
    })).toBe(EXPLORE_PARTICIPANTS_PATH);
  });

  it('should return the target path when it is not an explore inventory route', () => {
    expect(exploreNavTo('/studies', {
      pathname: EXPLORE_PARTICIPANTS_PATH,
      search: '?tab=1',
    })).toBe('/studies');
  });
});
