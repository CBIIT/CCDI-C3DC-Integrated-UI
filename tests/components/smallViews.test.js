jest.mock('@bento-core/tool-tip', () => ({ title, children }) => (
  <div>
    <span>{title}</span>
    {children}
  </div>
));

jest.mock('recharts', () => {
  const React = require('react');
  return {
    ResponsiveContainer: ({ children }) => <div>{children}</div>,
    PieChart: ({ children }) => <div>{children}</div>,
    Pie: ({ activeShape, onMouseEnter, children }) => (
      <div onMouseEnter={() => onMouseEnter({}, 1)}>
        {activeShape({
          cx: 10,
          cy: 10,
          innerRadius: 4,
          outerRadius: 20,
          startAngle: 0,
          endAngle: 90,
          fill: '#137E87',
          payload: { name: 'A' },
          value: 4,
        })}
        {children}
      </div>
    ),
    Cell: () => <span />,
    Sector: () => <span data-testid="sector" />,
  };
});

jest.mock('echarts', () => ({
  registerMap: jest.fn(),
  init: () => ({
    setOption: (option) => {
      option.tooltip.formatter({ data: [0, 0, 'NCI', 4] });
      option.series.symbolSize([0, 0, 'NCI', 4]);
      option.series.symbolSize([0, 0, 'Zero', 0]);
    },
    resize: jest.fn(),
    dispose: jest.fn(),
  }),
}));

import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CustomCheckBox from '../../src/components/CustomCheckbox/CustomCheckbox';
import CustomIconView from '../../src/components/CustomIcon/CustomIconView';
import ToolTipIconView from '../../src/components/ToolTipIcon/ToolTipIconView';
import DonutChart from '../../src/components/common/DonutChart';
import MapView from '../../src/components/common/mapGenerator';

describe('small shared views', () => {
  it('should toggle the custom checkbox icon', () => {
    const handleCheckbox = jest.fn();
    const { rerender } = render(
      <CustomCheckBox selectedItems={[]} item="p1" handleCheckbox={handleCheckbox} />,
    );
    fireEvent.click(screen.getByAltText('checkbox p1'));
    expect(handleCheckbox).toHaveBeenCalledWith('p1', expect.any(Object));
    rerender(<CustomCheckBox selectedItems={['p1']} item="p1" handleCheckbox={handleCheckbox} />);
    expect(screen.getByAltText('checkbox p1')).toBeInTheDocument();
  });

  it('should render the custom icon with a default alt', () => {
    render(<CustomIconView imgSrc="/logo.svg" />);
    expect(screen.getByAltText('Logo alt text')).toHaveAttribute('src', '/logo.svg');
  });

  it('should render tooltip defaults and a custom icon', () => {
    const { rerender } = render(
      <ToolTipIconView tooltipConfig={{}} classes={null} />,
    );
    expect(screen.getByText('add')).toBeInTheDocument();

    rerender(
      <ToolTipIconView
        tooltipConfig={{
          icon: '/tip.svg',
          alt: 'tip',
          arrow: true,
          maxWidth: '120px',
          title: 'Help',
          placement: 'bottom',
          clsName: 'tip-class',
        }}
        classes={{ customTooltip: 'tip', customArrow: 'arrow' }}
      />,
    );
    expect(screen.getByText('Help')).toBeInTheDocument();
    expect(screen.getByAltText('tip')).toHaveAttribute('src', '/tip.svg');
  });

  it('should draw even and odd donut slices and handle hover', () => {
    const data = [{ name: 'A', value: 2 }, { name: 'B', value: 1 }];
    const { rerender } = render(
      <DonutChart data={data} innerRadiusP={40} outerRadiusP={70} paddingSpace={2} textColor="#000" />,
    );
    expect(screen.getByText('4')).toBeInTheDocument();
    fireEvent.mouseEnter(screen.getByText('4'));
    rerender(
      <DonutChart data={[{ name: 'Only', value: 1 }]} innerRadiusP={40} outerRadiusP={70} paddingSpace={2} textColor="#111" />,
    );
    expect(screen.getByText('Participants')).toBeInTheDocument();
  });

  it('should register the map svg and resize the chart', async () => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ text: () => Promise.resolve('<svg></svg>') })
      .mockRejectedValueOnce(new Error('missing map'));
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { unmount } = render(<MapView mapData={{ title: 'Sites', data: [[1, 2, 'NCI', 4], [1, 2, 'Zero', 0]] }} />);
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(global.fetch).toHaveBeenCalledWith('./map.svg');
    fireEvent(window, new Event('resize'));
    unmount();

    render(<MapView mapData={{ title: 'Sites', data: [] }} />);
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(error).toHaveBeenCalled();
    error.mockRestore();
  });
});
