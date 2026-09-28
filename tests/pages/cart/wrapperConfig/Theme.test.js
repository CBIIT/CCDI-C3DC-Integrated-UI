import { customTheme } from '../../../../src/pages/cart/wrapperConfig/Theme';
import { themeConfig } from '../../../../src/pages/cart/tableConfig/Theme';

describe('cart themes', () => {
  it('should export wrapper and table theme sections', () => {
    expect(customTheme.MuiContainer.root['&.container_outer_layout'].height).toBe('75px');
    expect(themeConfig.tblHeader).toBeDefined();
    expect(themeConfig.tblBody).toBeDefined();
    expect(themeConfig.tblPgn).toBeDefined();
    expect(themeConfig.tblContainer).toBeDefined();
  });
});
