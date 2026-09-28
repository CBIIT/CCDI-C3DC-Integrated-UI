import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StatsView from '../../src/components/Stats/StatsView';

jest.mock('@bento-core/stats-bar', () => ({ stats }) => (
  <div>
    {stats.map((stat) => (
      <div key={stat.name}>
        <span>{stat.name}</span>
        <span>{stat.val}</span>
      </div>
    ))}
  </div>
));

describe('StatsView', () => {
  describe('Rendering', () => {
    it('should render only numeric stats from the configured API fields', () => {
      render(
        <StatsView
          data={{
            numberOfStudies: 12,
            numberOfParticipants: 3456,
            numberOfSamples: 'not-a-number',
          }}
        />,
      );

      expect(screen.getByText('Studies')).toBeInTheDocument();
      expect(screen.getByText('12')).toBeInTheDocument();
      expect(screen.getByText('Participants')).toBeInTheDocument();
      expect(screen.getByText('3456')).toBeInTheDocument();
      expect(screen.queryByText('Samples')).not.toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('should render no stats when data is omitted', () => {
      const { container } = render(<StatsView />);
      expect(container).not.toHaveTextContent('Studies');
    });
  });
});
