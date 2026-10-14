import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DEFAULT_CONFIG_DONUT, DonutChartGenerator } from '@bento-core/widgets';

const exploreDonutConfig = {
  colors: {
    even: ['#0053A0', '#279BCC', '#62E5B6'],
    odd: ['#0053A0', '#279BCC', '#62E5B6'],
  },
  styles: {
    cellPadding: 2,
    textOverflowLength: 20,
    textColor: '#000000',
  },
};

function donutProps(data) {
  return {
    data,
    sliceTitle: 'Participants',
    width: 185,
    height: 210,
    innerRadius: 45,
    outerRadius: 80,
    cx: 90,
    cy: 98,
    titleLocation: 'bottom',
    titleAlignment: 'center',
  };
}

const { DonutChart } = DonutChartGenerator(exploreDonutConfig);

function renderDonut(data) {
  return render(<DonutChart {...donutProps(data)} />);
}

function highlightedName(name) {
  expect(screen.getAllByText(name).length).toBeGreaterThan(0);
}

describe('Donut chart default highlight', () => {
  describe('Rendering', () => {
    it('should highlight the slice with the most participants on the first paint', () => {
      renderDonut([
        { group: 'Small', subjects: 10 },
        { group: 'TARGET_OS', subjects: 282 },
        { group: 'Tiny', subjects: 1 },
      ]);

      highlightedName('TARGET_OS');
      expect(screen.getByText('282')).toBeInTheDocument();
      expect(screen.getByText('Participants')).toBeInTheDocument();
      expect(screen.queryByText('Small')).not.toBeInTheDocument();
      expect(screen.queryByText('Tiny')).not.toBeInTheDocument();
    });
  });

  describe('Current chart', () => {
    it('should highlight the largest slice of the chart that is currently displayed', () => {
      const { rerender } = renderDonut([
        { group: 'Small', subjects: 10 },
        { group: 'TARGET_OS', subjects: 282 },
        { group: 'Tiny', subjects: 1 },
      ]);

      rerender(
        <DonutChart {...donutProps([
          { group: 'A', subjects: 5 },
          { group: 'B', subjects: 40 },
          { group: 'C', subjects: 12 },
        ])}
        />,
      );

      highlightedName('B');
      expect(screen.getByText('40')).toBeInTheDocument();
      expect(screen.queryByText('TARGET_OS')).not.toBeInTheDocument();
      expect(screen.queryByText('A')).not.toBeInTheDocument();
      expect(screen.queryByText('C')).not.toBeInTheDocument();
    });

    it('should return to the largest slice after a hover when the chart data changes', () => {
      const { rerender } = renderDonut([
        { group: 'Small', subjects: 10 },
        { group: 'TARGET_OS', subjects: 282 },
        { group: 'Tiny', subjects: 1 },
      ]);
      const sectors = document.querySelectorAll('.recharts-pie-sector');
      fireEvent.mouseEnter(sectors[0]);

      highlightedName('Small');
      expect(screen.queryByText('TARGET_OS')).not.toBeInTheDocument();

      rerender(
        <DonutChart {...donutProps([
          { group: 'Low', subjects: 3 },
          { group: 'Mid', subjects: 8 },
          { group: 'High', subjects: 50 },
        ])}
        />,
      );

      highlightedName('High');
      expect(screen.getByText('50')).toBeInTheDocument();
      expect(screen.queryByText('Small')).not.toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('should highlight the only slice when the chart has one value', () => {
      renderDonut([{ group: 'Only', subjects: 7 }]);

      highlightedName('Only');
      expect(screen.getByText('7')).toBeInTheDocument();
    });

    it('should highlight the first slice when participant counts are tied', () => {
      renderDonut([
        { group: 'First', subjects: 20 },
        { group: 'Second', subjects: 20 },
        { group: 'Small', subjects: 3 },
      ]);

      highlightedName('First');
      expect(screen.getByText('20')).toBeInTheDocument();
      expect(screen.queryByText('Second')).not.toBeInTheDocument();
    });

    it('should show the empty chart when the current chart has no rows', () => {
      renderDonut([]);

      expect(screen.getByText('No data')).toBeInTheDocument();
      expect(screen.getByText('returned for')).toBeInTheDocument();
      expect(screen.getByText('this search')).toBeInTheDocument();
    });

    it('should choose the largest participant count from mapped or raw rows', () => {
      const { getLargestIndex } = DEFAULT_CONFIG_DONUT.functions;

      expect(getLargestIndex([
        { value: 4 },
        { value: 9 },
        { value: 1 },
      ])).toBe(1);
      expect(getLargestIndex([
        { subjects: 2 },
        { subjects: 11 },
      ])).toBe(1);
      expect(getLargestIndex([
        { subjects: 8 },
        { value: 8 },
      ])).toBe(0);
      expect(getLargestIndex([])).toBe(0);
      expect(getLargestIndex(undefined)).toBe(0);
      expect(getLargestIndex([
        { group: 'Missing' },
        { subjects: 3 },
      ])).toBe(1);
    });
  });
});
