import {
  exploreBasePathFromPathname,
  EXPLORE_FILES_PATH,
  EXPLORE_PARTICIPANTS_PATH,
} from '../src/components/Inventory/InventoryState';

describe('inventory explore routing', () => {
  it('maps explore participants URL to the participants base path', () => {
    expect(exploreBasePathFromPathname('/exploreParticipants')).toBe(
      EXPLORE_PARTICIPANTS_PATH,
    );
  });

  it('maps explore files URL to the files base path', () => {
    expect(exploreBasePathFromPathname('/exploreFiles')).toBe(EXPLORE_FILES_PATH);
  });

  it('defaults unknown paths to participants explore (same as pathname sync)', () => {
    expect(exploreBasePathFromPathname('/')).toBe(EXPLORE_PARTICIPANTS_PATH);
  });
});
