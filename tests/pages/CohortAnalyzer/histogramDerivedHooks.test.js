import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useBesideStripHistogramMetrics } from '../../../src/pages/CohortAnalyzer/HistogramPanel/hooks/useBesideStripHistogramMetrics';
import {
  useFilteredHistogramGraphData,
  useFilteredKmPlotData,
  useKmCohortColors,
  useRiskTableCohortsShape,
} from '../../../src/pages/CohortAnalyzer/HistogramPanel/hooks/useHistogramDerivedData';
import { useSurvivalBesideVennCardStyle } from '../../../src/pages/CohortAnalyzer/HistogramPanel/hooks/useSurvivalBesideVennCardStyle';

function Probe({
  graphData,
  expandedChart = null,
  besideDatasetForColumn = 'sexAtBirth',
  besidePanelDragState = null,
}) {
  const selectedDatasets = ['sexAtBirth', 'survivalAnalysis'];
  const filtered = useFilteredHistogramGraphData(
    graphData,
    selectedDatasets,
    expandedChart,
  );
  const km = useFilteredKmPlotData(
    [
      { group: 'cohort 1', id: 1 },
      { group_id: 'c2', id: 2 },
      { group: '3', id: 3 },
      { group: 'other', id: 4 },
    ],
    ['p1'],
    ['p2'],
    [],
  );
  const colors = useKmCohortColors(['p1'], ['p2'], []);
  const risk = useRiskTableCohortsShape(
    {
      cohorts: [
        {
          cohort: 'c1',
          survivalData: [{ group: '0 Months', subjects: 1.6 }],
        },
        {
          cohort: 'c2',
          survivalData: [{ group: '0 Months', subjects: 0 }],
        },
        {
          cohort: 'c3',
          survivalData: [],
        },
      ],
      timeIntervals: [0, 6],
    },
    ['p1'],
    ['p2'],
    [],
    'Alpha',
    '',
    '',
  );
  const metrics = useBesideStripHistogramMetrics({
    besideDatasetForColumn,
    filteredData: filtered,
    histogramCardSizes: { sexAtBirth: { plotHeight: 310 } },
    defaultPlotHeightPx: 240,
  });
  const style = useSurvivalBesideVennCardStyle({
    survivalCardSize: { height: 500 },
    besideCardDrag: { draggable: true },
    allInputsEmpty: false,
    besidePanelDragState,
  });
  return (
    <div>
      <span>bars:{(filtered.sexAtBirth || []).length}</span>
      <span>km:{km.map((row) => row.id).join(',')}</span>
      <span>colors:{colors.length}</span>
      <span>risk:{risk.cohorts.map((row) => row.name).join(',')}</span>
      <span>risk-value:{risk.cohorts[0].data['0 Months']}</span>
      <span>
        sums:{metrics.besideHistogramBarSums.valueA},
        {metrics.besideHistogramBarSums.valueB},
        {metrics.besideHistogramBarSums.valueC}
      </span>
      <span>height:{metrics.besideStripPlotHeight}</span>
      <span>cursor:{style.cursor || 'none'}</span>
      <span>pointer:{style.pointerEvents || 'normal'}</span>
    </div>
  );
}

const graphData = {
  sexAtBirth: [
    { name: 'A', valueA: 1 },
    { name: 'B', valueB: 2 },
    { name: 'C', valueC: 3 },
    { name: 'D', valueA: 4 },
    { name: 'E', valueB: 5 },
    { name: 'F', valueC: 6 },
    { name: 'G', valueA: 7 },
    { name: 'OtherFew', valueA: 8 },
    { name: 'OtherMany', valueA: 9 },
  ],
};

describe('histogram derived hooks', () => {
  it('filters chart/KM/risk data and computes beside metrics', () => {
    render(<Probe graphData={graphData} />);
    expect(screen.getByText('bars:6')).toBeInTheDocument();
    expect(screen.getByText('km:1,2')).toBeInTheDocument();
    expect(screen.getByText('colors:2')).toBeInTheDocument();
    expect(screen.getByText('risk:Alpha,Cohort B')).toBeInTheDocument();
    expect(screen.getByText('risk-value:2')).toBeInTheDocument();
    expect(screen.getByText('height:310')).toBeInTheDocument();
    expect(screen.getByText('cursor:grab')).toBeInTheDocument();
  });

  it('uses expanded limits and handles no beside dataset', () => {
    render(
      <Probe
        graphData={graphData}
        expandedChart="sexAtBirth"
        besideDatasetForColumn={null}
        besidePanelDragState={{ kind: 'venn', width: 400, height: 300 }}
      />,
    );
    expect(screen.getByText('bars:8')).toBeInTheDocument();
    expect(screen.getByText('sums:0,0,0')).toBeInTheDocument();
    expect(screen.getByText('height:240')).toBeInTheDocument();
    expect(screen.getByText('pointer:none')).toBeInTheDocument();
  });

  it('returns original graph data when there are no chart rows', () => {
    render(<Probe graphData={{}} besideDatasetForColumn={null} />);
    expect(screen.getByText('bars:0')).toBeInTheDocument();
  });
});
