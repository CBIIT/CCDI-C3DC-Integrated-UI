import LayoutReducer, {
  initialState,
  TOGGLE_SIDEBAR,
  toggleSidebar,
} from '../../src/components/Layout/LayoutState';

describe('LayoutState', () => {
  describe('Actions', () => {
    it('should create a sidebar toggle action', () => {
      expect(toggleSidebar()).toEqual({ type: TOGGLE_SIDEBAR });
    });
  });

  describe('Reducer', () => {
    it('should return the initial state by default', () => {
      expect(LayoutReducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
    });

    it('should toggle whether the sidebar is open', () => {
      const closed = LayoutReducer(initialState, toggleSidebar());
      expect(closed.isSidebarOpened).toBe(false);
      expect(LayoutReducer(closed, toggleSidebar()).isSidebarOpened).toBe(true);
    });
  });
});
