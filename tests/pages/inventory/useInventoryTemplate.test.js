jest.mock('react-redux', () => ({
  useSelector: (selector) => selector({
    inventoryReducer: { exploreMode: 'files' },
  }),
}));

jest.mock('../../../src/bento/dashTemplate', () => ({
  facetsParticipantsConfig: [{ datafield: 'sex_at_birth' }],
  facetsExploreFilesConfig: [{ datafield: 'file_type' }],
  facetSectionVariables: {},
  facetSectionVariablesExploreFiles: {},
  participantWidgetConfig: [],
  participantWidgetToolTipConfig: {},
  filesWidgetConfig: [{ type: 'donut', dataName: 'file_type' }],
  filesWidgetToolTipConfig: {},
  queryParams: [],
}));

jest.mock('../../../src/bento/dashboardTabData', () => ({
  exploreParticipantsTabs: [{ name: 'Participants' }],
  exploreFilesTabs: [{ name: 'Files' }],
}));

import { EXPLORE_FILES_PATH } from '../../../src/components/Inventory/InventoryState';
import { useInventoryTemplate } from '../../../src/pages/inventory/useInventoryTemplate';

describe('useInventoryTemplate', () => {
  it('should return the files template from Redux exploreMode', () => {
    let template;
    function Probe() {
      template = useInventoryTemplate();
      return null;
    }
    require('@testing-library/react').render(require('react').createElement(Probe));
    expect(template.basePath).toBe(EXPLORE_FILES_PATH);
    expect(template.mode).toBe('files');
  });
});
