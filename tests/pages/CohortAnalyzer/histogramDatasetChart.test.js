jest.mock('recharts', () => {
  const React = require('react');
  const Passthrough = ({ children }) => <div>{children}</div>;
  const Axis = ({ tick, tickFormatter }) => (
    <div>
      {typeof tick === 'function'
        ? tick({ x: 10, y: 10, payload: { value: 'Female' } })
        : null}
      {typeof tickFormatter === 'function' ? tickFormatter(12.345) : null}
    </div>
  );
  return {
    BarChart: Passthrough,
    Bar: Passthrough,
    XAxis: Axis,
    YAxis: Axis,
    CartesianGrid: () => null,
    Tooltip: ({ content }) =>
      content
        ? React.cloneElement(content, {
          active: true,
          label: 'Female',
          payload: [
            { dataKey: 'valueA', name: 'Alpha', value: 2 },
            { name: 'Female', value: 3 },
          ],
        })
        : null,
    ResponsiveContainer: Passthrough,
    Cell: ({ onMouseEnter, onMouseLeave }) => (
      <button
        type="button"
        onClick={() => {
          if (onMouseEnter) onMouseEnter();
          if (onMouseLeave) onMouseLeave();
        }}
      >
        chart cell
      </button>
    ),
    LineChart: Passthrough,
    Line: () => null,
    PieChart: Passthrough,
    Pie: ({ children, label, data }) => (
      <div>
        {children}
        {typeof label === 'function' && data && data[0]
          ? label({
            name: data[0].name,
            value: data[0].value,
            percent: 0.5,
            cx: 100,
            cy: 100,
            midAngle: 0,
            innerRadius: 20,
            outerRadius: 40,
          })
          : null}
      </div>
    ),
  };
});

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  HistogramDatasetChart,
  CHART_TYPE_KEYS,
} from '../../../src/pages/CohortAnalyzer/HistogramPanel/chart/HistogramDatasetChart';

const rows = [
  {
    name: 'Female',
    valueA: 2,
    valueB: 1,
    valueC: 0,
    colorA: '#aaa',
    colorB: '#bbb',
    colorC: '#ccc',
  },
];

describe('HistogramDatasetChart', () => {
  it('should render each chart type without crashing', () => {
    Object.values(CHART_TYPE_KEYS).forEach((chartType) => {
      const { unmount } = render(
        <HistogramDatasetChart
          rows={rows}
          viewType="count"
          chartType={chartType}
          valueA={2}
          valueB={1}
          valueC={0}
          compact={false}
          height={200}
          cellHover={{ current: null }}
          handleMouseEnter={jest.fn()}
          handleMouseLeave={jest.fn()}
        />,
      );
      screen.queryAllByText('chart cell').forEach((cell) => fireEvent.click(cell));
      unmount();
    });
  });

  it('should render percentage and empty pie data branches', () => {
    const { rerender } = render(
      <HistogramDatasetChart
        rows={rows}
        viewType="percentage"
        chartType={CHART_TYPE_KEYS.PIE}
        valueA={2}
        valueB={1}
        valueC={0}
        compact
        height={200}
        estimatedChartWidth={300}
        cellHover={{ current: 'valueA' }}
        handleMouseEnter={jest.fn()}
        handleMouseLeave={jest.fn()}
        expandedView
      />,
    );
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    rerender(
      <HistogramDatasetChart
        rows={[{ name: 'Empty', valueA: 0, valueB: 0, valueC: 0 }]}
        viewType="count"
        chartType={CHART_TYPE_KEYS.PIE}
        valueA={0}
        valueB={0}
        valueC={0}
        compact={false}
        height={200}
        cellHover={{ current: null }}
        handleMouseEnter={jest.fn()}
        handleMouseLeave={jest.fn()}
      />,
    );
  });

  it('should pick pie colors from the dominant series', () => {
    render(
      <HistogramDatasetChart
        rows={[
          { name: 'B', valueA: 1, valueB: 4, valueC: 0, colorA: '#a', colorB: '#b', colorC: '#c' },
          { name: 'C', valueA: 1, valueB: 1, valueC: 5, colorA: '#a', colorB: '#b', colorC: '#c' },
        ]}
        viewType="count"
        chartType={CHART_TYPE_KEYS.HORIZONTAL_BAR}
        valueA={1}
        valueB={4}
        valueC={5}
        compact
        height={120}
        estimatedChartWidth={null}
        cellHover={{ current: null }}
        handleMouseEnter={jest.fn()}
        handleMouseLeave={jest.fn()}
      />,
    );
    expect(screen.getAllByText('chart cell').length).toBeGreaterThan(0);
  });

  it('should render a preview shell and a pie with only the C series', () => {
    const { rerender } = render(
      <HistogramDatasetChart
        rows={[{ name: 'Empty', valueA: 0, valueB: 0, valueC: 0 }]}
        viewType="percentage"
        chartType={CHART_TYPE_KEYS.VERTICAL_BAR}
        valueA={0}
        valueB={0}
        valueC={0}
        compact={false}
        height={160}
        previewShell
        cellHover={{ current: null }}
        handleMouseEnter={jest.fn()}
        handleMouseLeave={jest.fn()}
      />,
    );
    expect(screen.getByText('12.3%')).toBeInTheDocument();
    rerender(
      <HistogramDatasetChart
        rows={[{ name: 'C', valueA: 0, valueB: 0, valueC: 4, colorA: '#a', colorB: '#b', colorC: '#c' }]}
        viewType="count"
        chartType={CHART_TYPE_KEYS.PIE}
        valueA={0}
        valueB={0}
        valueC={4}
        compact={false}
        height={180}
        estimatedChartWidth={200}
        cellHover={{ current: null }}
        handleMouseEnter={jest.fn()}
        handleMouseLeave={jest.fn()}
      />,
    );
    expect(screen.getAllByText('chart cell').length).toBeGreaterThan(0);
  });
});
