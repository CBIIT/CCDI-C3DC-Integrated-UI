jest.mock('@bento-core/kmplot', () => ({
  KaplanMeierChart: () => <div>KM chart</div>,
}));
jest.mock('@bento-core/risk-table', () => () => <div>Risk table</div>);

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HistogramPopupModalSurvivalTab } from '../../../src/pages/CohortAnalyzer/HistogramPanel/popup/HistogramPopupModalSurvivalTab';

describe('HistogramPopupModalSurvivalTab', () => {
  it('should show empty state when there is no display data', () => {
    render(
      <HistogramPopupModalSurvivalTab
        survivalModalHasNoDisplayData
        chartHeight={300}
        survivalAnalysisContainerRef={{ current: null }}
        kmChartRef={{ current: null }}
        riskTableRef={{ current: null }}
        filteredKmPlotData={[]}
        kmLoading={false}
        kmError={null}
        cohortColors={[]}
        cohorts={[]}
        timeIntervals={[]}
      />,
    );
    expect(screen.getByText('No data available.')).toBeInTheDocument();
  });

  it('should render km and risk charts when data exists', () => {
    render(
      <HistogramPopupModalSurvivalTab
        survivalModalHasNoDisplayData={false}
        chartHeight={300}
        survivalAnalysisContainerRef={{ current: null }}
        kmChartRef={{ current: null }}
        riskTableRef={{ current: null }}
        filteredKmPlotData={[{ time: 1 }]}
        kmLoading={false}
        kmError={null}
        cohortColors={['#000']}
        cohorts={[{ name: 'A' }]}
        timeIntervals={[0]}
      />,
    );
    expect(screen.getByText('KM chart')).toBeInTheDocument();
    expect(screen.getByText('Risk table')).toBeInTheDocument();
  });
});
