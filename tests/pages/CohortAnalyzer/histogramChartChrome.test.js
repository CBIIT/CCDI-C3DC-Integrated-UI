import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CustomChartTooltip from '../../../src/pages/CohortAnalyzer/HistogramPanel/chart/CustomChartTooltip';
import CustomXAxisTick from '../../../src/pages/CohortAnalyzer/HistogramPanel/chart/CustomXAxisTick';
import CustomCategoryAxisTick from '../../../src/pages/CohortAnalyzer/HistogramPanel/chart/CustomCategoryAxisTick';

describe('histogram chart chrome', () => {
  it('should hide the value tooltip without a hovered cell', () => {
    const { container } = render(
      <CustomChartTooltip active payload={[{ dataKey: 'a' }]} label="A" cellHoverRef={{ current: null }} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('should show a percentage value for the hovered series', () => {
    render(
      <CustomChartTooltip
        active
        payload={[{ dataKey: 'c1', payload: { c1: 12.34 } }]}
        label="OtherFew"
        viewType="percentage"
        cellHoverRef={{ current: 'c1' }}
      />,
    );
    expect(screen.getByText('Other Few')).toBeInTheDocument();
    expect(screen.getByText('12.3%')).toBeInTheDocument();
  });

  it('should truncate long x-axis labels', () => {
    const { container } = render(
      <svg>
        <CustomXAxisTick x={10} y={20} width={20} payload={{ value: 'A very long diagnosis name' }} />
      </svg>,
    );
    expect(container.querySelector('text')).toBeTruthy();
  });

  it('should wrap category axis labels', () => {
    const { container } = render(
      <svg>
        <CustomCategoryAxisTick x={10} y={20} width={40} payload={{ value: 'OtherMany' }} />
      </svg>,
    );
    expect(container.textContent).toContain('Other');
  });
});
