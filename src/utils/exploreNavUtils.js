import {
  EXPLORE_FILES_PATH,
  EXPLORE_PARTICIPANTS_PATH,
} from '../components/Inventory/InventoryState';

const EXPLORE_INVENTORY_PATHS = new Set([
  EXPLORE_PARTICIPANTS_PATH,
  EXPLORE_FILES_PATH,
]);

/**
 * `to` value for NavLink/navigate when the destination is an Explore inventory route.
 * Preserves `location.search` only when the user is already on Participants or Files,
 * so filters stay when switching between those two; coming from other pages keeps a clean URL.
 *
 * @param {string} targetPath — must be EXPLORE_PARTICIPANTS_PATH or EXPLORE_FILES_PATH
 * @param {{ pathname: string, search: string }} location — from useLocation()
 * @returns {string}
 */
export function exploreNavTo(targetPath, location) {
  const { pathname, search } = location;
  if (!EXPLORE_INVENTORY_PATHS.has(targetPath)) {
    return targetPath;
  }
  if (!EXPLORE_INVENTORY_PATHS.has(pathname)) {
    return targetPath;
  }
  return `${targetPath}${search}`;
}

export { EXPLORE_PARTICIPANTS_PATH, EXPLORE_FILES_PATH };
