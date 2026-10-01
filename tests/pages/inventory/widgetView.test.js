jest.mock('@bento-core/widgets', () => ({
  WidgetGenerator: () => ({
    Widget: (props) => require('react').createElement('div', null, `${props.title} ${props.chartType}`),
  }),
}));

jest.mock('@bento-core/tool-tip', () => ({ children }) => children);
jest.mock('../../../src/components/ToolTipIcon/ToolTipIconView', () => () => <span>tip</span>);
jest.mock('../../../src/components/Wrappers/Wrappers', () => ({
  Typography: ({ children }) => <div>{children}</div>,
}));
jest.mock('../../../src/pages/inventory/widget/WidgetTheme', () => ({ children }) => children);
jest.mock('../../../src/bento/dashTemplate', () => ({
  WIDGET_DATASET_LIMIT: 2,
}));
const mockTemplate = {
  widgetConfig: [
    {
      type: 'donut',
      dataName: 'sex',
      title: 'Sex',
      sliceTitle: 'Participants',
      countType: 'discrete',
    },
  ],
  widgetToolTipConfig: {
    Sex: { plural: 'sexes' },
  },
};

jest.mock('../../../src/pages/inventory/useInventoryTemplate', () => ({
  useInventoryTemplate: () => mockTemplate,
}));

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import WidgetView from '../../../src/pages/inventory/widget/WidgetView';

const theme = createMuiTheme({
  custom: { drawerWidth: 240 },
  palette: {
    widgetBackground: { contrastText: '#000', main: '#fff' },
  },
});

describe('WidgetView', () => {
  it('should collapse widgets and toggle a chart type', () => {
    render(
      <ThemeProvider theme={theme}>
        <WidgetView
          data={{
            sex: [
              { group: 'Female', subjects: 2 },
              { group: 'Male', subjects: 1 },
              { group: 'Other', subjects: 1 },
            ],
          }}
        />
      </ThemeProvider>,
    );
    expect(screen.getByText('Sex donut')).toBeInTheDocument();
    fireEvent.click(screen.getByText('COLLAPSE VIEW'));
    expect(screen.getByText('OPEN VIEW')).toBeInTheDocument();
  });
});
