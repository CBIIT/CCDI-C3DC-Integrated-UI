import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CustomCategoryAxisTick from '../../../src/pages/CohortAnalyzer/HistogramPanel/chart/CustomCategoryAxisTick';
import CustomXAxisTick from '../../../src/pages/CohortAnalyzer/HistogramPanel/chart/CustomXAxisTick';

describe('custom histogram axis ticks', () => {
  it('wraps long category labels and shows their tooltip on hover', () => {
    const { container } = render(
      <svg>
        <CustomCategoryAxisTick
          x={100}
          y={50}
          payload={{ value: 'A very long category label with several words' }}
          width={45}
          fontSize={12}
          maxLines={2}
        />
      </svg>,
    );
    const rect = container.querySelector('rect');
    rect.getBoundingClientRect = () => ({
      left: 20,
      top: 30,
      width: 40,
      height: 20,
    });
    fireEvent.mouseEnter(rect);
    expect(
      screen.getAllByText('A very long category label with several words').length,
    ).toBeGreaterThan(0);
    fireEvent.mouseLeave(rect);
  });

  it('formats special category labels without truncating short values', () => {
    const { container } = render(
      <svg>
        <CustomCategoryAxisTick
          x={0}
          y={0}
          payload={{ value: 'OtherFew' }}
          width={200}
          fontSize={8}
        />
      </svg>,
    );
    expect(container.textContent).toContain('Other Few');
    expect(container.querySelector('rect')).toBeNull();
  });

  it('truncates X-axis words and opens a portal tooltip', () => {
    const { container } = render(
      <svg>
        <CustomXAxisTick
          x={20}
          y={30}
          payload={{ value: 'Extremely long diagnosis category' }}
          width={40}
          fontSize={12}
        />
      </svg>,
    );
    const rect = container.querySelector('rect');
    rect.getBoundingClientRect = () => ({
      left: 10,
      top: 80,
      width: 40,
      height: 20,
    });
    fireEvent.mouseEnter(rect);
    expect(
      screen.getAllByText('Extremely long diagnosis category').length,
    ).toBeGreaterThan(0);
    fireEvent.mouseLeave(rect);
  });

  it('splits short X-axis labels and formats OtherMany', () => {
    const { container } = render(
      <svg>
        <CustomXAxisTick
          x={0}
          y={0}
          payload={{ value: 'OtherMany' }}
          width={200}
          fontSize={8}
        />
      </svg>,
    );
    expect(container.textContent).toContain('Other');
    expect(container.textContent).toContain('Many');
  });
});
