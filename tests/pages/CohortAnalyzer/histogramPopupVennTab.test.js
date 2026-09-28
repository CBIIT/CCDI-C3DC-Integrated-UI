jest.mock('../../../src/pages/CohortAnalyzer/vennDiagram/ChartVenn', () => () => <div>Venn chart</div>);
jest.mock('../../../src/pages/CohortAnalyzer/context/CohortAnalyzerContext', () => ({
  useCohortAnalyzer: () => ({
    selectedCohorts: ['c1'],
    nodeIndex: 0,
    setNodeIndex: jest.fn(),
    setRowData: jest.fn(),
  }),
}));
jest.mock('@bento-core/tool-tip/dist/ToolTip', () => ({ children }) => children);

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HistogramPopupModalVennTab } from '../../../src/pages/CohortAnalyzer/HistogramPanel/popup/HistogramPopupModalVennTab';

describe('HistogramPopupModalVennTab', () => {
  it('should render the expanded venn chart', () => {
    render(
      <HistogramPopupModalVennTab
        vennModalChartAreaRef={{ current: null }}
        vennModalShowsChart
        chartVennModalProps={{}}
        containerRef={{}}
        canvasRef={{}}
        vennModalSlot={{ slotWidth: 400, slotHeight: 300 }}
        vennModalShowsEmptyState={false}
      />,
    );
    expect(screen.getByText('Venn chart')).toBeInTheDocument();
  });

  it('should render the empty state when there is no chart', () => {
    render(
      <HistogramPopupModalVennTab
        vennModalChartAreaRef={{ current: null }}
        vennModalShowsChart={false}
        chartVennModalProps={{}}
        containerRef={{}}
        canvasRef={{}}
        vennModalSlot={{ slotWidth: 400, slotHeight: 300 }}
        vennModalShowsEmptyState
      />,
    );
    expect(screen.getByText('No data available.')).toBeInTheDocument();
  });
});
