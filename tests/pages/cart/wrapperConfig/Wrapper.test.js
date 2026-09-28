jest.mock('../../../../src/utils/graphqlClient', () => ({
  query: jest.fn(),
}));

import { types, btnTypes } from '@bento-core/paginated-table';
import { wrapperConfig } from '../../../../src/pages/cart/wrapperConfig/Wrapper';
import { tooltipContent } from '../../../../src/bento/fileCentricCartWorkflowData';

describe('cart wrapperConfig', () => {
  describe('Rendering', () => {
    it('should define outer layout, header actions, table, and footer sections', () => {
      const [outerLayout, headerButtons, tableSection, footer] = wrapperConfig;

      expect(outerLayout.items).toEqual(expect.arrayContaining([
        expect.objectContaining({ type: types.ICON, clsName: 'cart_icon' }),
        expect.objectContaining({ type: types.TEXT, text: 'Cart >' }),
        expect.objectContaining({ type: types.TEXT, text: 'Selected Files' }),
      ]));
      expect(headerButtons.items[0]).toMatchObject({
        title: 'DOWNLOAD MANIFEST',
        type: types.BUTTON,
        role: btnTypes.DOWNLOAD_MANIFEST,
        tooltipCofig: tooltipContent,
      });
      expect(tableSection).toEqual({ container: 'paginatedTable', paginatedTable: true });
      expect(footer.items[0]).toMatchObject({
        clsName: 'manifest_comments',
        type: types.TEXT_INPUT,
      });
    });
  });
});
