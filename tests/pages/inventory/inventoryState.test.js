jest.mock('../../../src/bento/dashTemplate', () => ({
  facetsParticipantsConfig: [{ datafield: 'sex_at_birth' }],
  facetsExploreFilesConfig: [{ datafield: 'file_type' }],
  facetSectionVariables: { Demographics: {} },
  facetSectionVariablesExploreFiles: { Files: {} },
  participantWidgetConfig: [{ type: 'donut', dataName: 'sex' }],
  participantWidgetToolTipConfig: { Sex: { plural: 'sexes' } },
  filesWidgetConfig: [{ type: 'donut', dataName: 'file_type' }],
  filesWidgetToolTipConfig: { Type: { plural: 'types' } },
  queryParams: ['sex_at_birth', 'tab'],
}));

jest.mock('../../../src/bento/dashboardTabData', () => ({
  exploreParticipantsTabs: [{ name: 'Participants' }],
  exploreFilesTabs: [{ name: 'Files' }],
}));

import InventoryReducer, {
  AFTER_INITIAL_LOADING,
  CHANGE_TAB,
  DATA_LOADING,
  DASHBOARD_DATA_CHANGED,
  EXPLORE_FILES_PATH,
  EXPLORE_PARTICIPANTS_PATH,
  FACET_VALUE_CHANGED,
  RESTORE_ACTION_TYPE,
  RETURN_2_PAGE,
  RETURN_QUERY_URL,
  SYNC_INVENTORY_EXPLORE_MODE,
  UPDATE_IMPORTFROM,
  afterInitialLoading,
  changeTab,
  exploreBasePathFromPathname,
  getFacetDatafields,
  inDataloading,
  initialState,
  restoreActionType,
  return2Page,
  returnQueryUrl,
  selectInventoryExploreTemplate,
  syncInventoryExploreModeFromPathname,
  syncUpDashboard,
  syncUpFacets,
  updateImportfrom,
} from '../../../src/components/Inventory/InventoryState';

describe('InventoryState', () => {
  describe('routing helpers', () => {
    it('should map files pathname to the files base path', () => {
      expect(exploreBasePathFromPathname(EXPLORE_FILES_PATH)).toBe(EXPLORE_FILES_PATH);
    });

    it('should default other paths to participants', () => {
      expect(exploreBasePathFromPathname('/')).toBe(EXPLORE_PARTICIPANTS_PATH);
    });

    it('should collect facet datafields', () => {
      expect(getFacetDatafields([{ datafield: 'a' }, { datafield: 'b' }])).toEqual(new Set(['a', 'b']));
    });
  });

  describe('selectInventoryExploreTemplate', () => {
    it('should select the participants template by default', () => {
      const template = selectInventoryExploreTemplate({
        inventoryReducer: { exploreMode: 'participants' },
      });
      expect(template.mode).toBe('participants');
      expect(template.basePath).toBe(EXPLORE_PARTICIPANTS_PATH);
      expect(template.tabItems[0].name).toBe('Participants');
    });

    it('should select the files template', () => {
      const template = selectInventoryExploreTemplate({
        inventoryReducer: { exploreMode: 'files' },
      });
      expect(template.mode).toBe('files');
      expect(template.basePath).toBe(EXPLORE_FILES_PATH);
      expect(template.facetsConfig[0].datafield).toBe('file_type');
    });
  });

  describe('reducer', () => {
    it('should apply loading, import, facet, dashboard, and tab actions', () => {
      let state = InventoryReducer(initialState, afterInitialLoading());
      expect(state.initialLoading).toBe(false);

      state = InventoryReducer(state, inDataloading(true));
      expect(state.isDataloading).toBe(true);

      state = InventoryReducer(state, updateImportfrom('/json', [{ id: 1 }]));
      expect(state.importFromURL).toBe('/json');
      expect(state.importFromData).toEqual([{ id: 1 }]);

      state = InventoryReducer(state, syncUpFacets({ race: ['White'] }));
      expect(state.activeFilters).toEqual({ race: ['White'] });

      state = InventoryReducer(state, syncUpDashboard({ sex_at_birth: ['Female'] }, { numberOfParticipants: 2 }));
      expect(state.dashData).toEqual({ numberOfParticipants: 2 });

      state = InventoryReducer(state, return2Page(true));
      expect(state.return_2_page).toBe(true);

      state = InventoryReducer(state, returnQueryUrl('?tab=1'));
      expect(state.return_query_url).toBe('?tab=1');

      state = InventoryReducer(state, changeTab(1, 2, 'not-facet'));
      expect(state.tabParticipants).toBe(1);
      expect(state.tabFiles).toBe(2);
      expect(state.action_type).toBe('not-facet');

      state = InventoryReducer(state, restoreActionType());
      expect(state.action_type).toBe('facet');

      state = InventoryReducer(state, syncInventoryExploreModeFromPathname(EXPLORE_FILES_PATH));
      expect(state.exploreMode).toBe('files');

      state = InventoryReducer(state, syncInventoryExploreModeFromPathname('/exploreParticipants'));
      expect(state.exploreMode).toBe('participants');
    });

    it('should return the current state for unknown actions', () => {
      expect(InventoryReducer(initialState, { type: 'UNKNOWN' })).toEqual(initialState);
    });

    it('should export the action type constants used by the reducer', () => {
      expect(AFTER_INITIAL_LOADING).toBe('Inventory/AFTER_INITIAL_LOADING');
      expect(DATA_LOADING).toBe('Inventory/DATA_LOADING');
      expect(UPDATE_IMPORTFROM).toBe('Inventory/UPDATE_IMPORTFROM');
      expect(FACET_VALUE_CHANGED).toBe('Inventory/FACET_VALUE_CHANGED');
      expect(DASHBOARD_DATA_CHANGED).toBe('Inventory/DASHBOARD_DATA_CHANGED');
      expect(RETURN_2_PAGE).toBe('return_2_page');
      expect(RETURN_QUERY_URL).toBe('return_query_url');
      expect(CHANGE_TAB).toBe('change_tab');
      expect(RESTORE_ACTION_TYPE).toBe('restore_action_type');
      expect(SYNC_INVENTORY_EXPLORE_MODE).toBe('Inventory/SYNC_INVENTORY_EXPLORE_MODE');
    });
  });
});
