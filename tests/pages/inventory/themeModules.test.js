jest.mock('../../../src/themes', () => ({
  __esModule: true,
  default: { light: { overrides: {} } },
  overrides: {},
}));

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import WidgetTheme from '../../../src/pages/inventory/widget/WidgetTheme';
import FilterTheme from '../../../src/pages/inventory/sideBar/FilterThemeConfig';
import NewFilterTheme from '../../../src/pages/inventory/sideBar/NewFilterThemeConfig';
import { themeConfig } from '../../../src/pages/inventory/tabs/tableConfig/Theme';
import { customTheme } from '../../../src/pages/inventory/tabs/wrapperConfig/Theme';

describe('Explore theme modules', () => {
  it('should wrap children in widget and facet theme providers', () => {
    render(
      <WidgetTheme>
        <FilterTheme>
          <NewFilterTheme>
            <div>themed</div>
          </NewFilterTheme>
        </FilterTheme>
      </WidgetTheme>,
    );
    expect(screen.getByText('themed')).toBeInTheDocument();
  });

  it('should export table and wrapper theme objects', () => {
    expect(themeConfig).toBeDefined();
    expect(customTheme).toBeDefined();
  });
});
