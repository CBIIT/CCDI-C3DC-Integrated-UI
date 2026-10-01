import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useQuery } from '@apollo/client';
import GlobalStatsController from '../../src/components/Stats/GlobalStatsController';
import { GET_GLOBAL_STATS_DATA_QUERY } from '../../src/bento/globalStatsData';

jest.mock('@apollo/client', () => ({
  useQuery: jest.fn(),
}));

jest.mock('../../src/components/Wrappers/Wrappers', () => ({
  Typography: ({ children }) => <div>{children}</div>,
}));

jest.mock('../../src/components/Stats/StatsView', () => ({ data }) => (
  <div>Stats: {data.numberOfStudies}</div>
));

describe('GlobalStatsController', () => {
  describe('Rendering', () => {
    it('should show a progress indicator while loading', () => {
      useQuery.mockReturnValue({ loading: true });

      render(<GlobalStatsController />);

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should request global stats without a cache and render the result', () => {
      useQuery.mockReturnValue({
        loading: false,
        data: { searchParticipants: { numberOfStudies: 9 } },
      });

      render(<GlobalStatsController />);

      expect(useQuery).toHaveBeenCalledWith(GET_GLOBAL_STATS_DATA_QUERY, {
        fetchPolicy: 'no-cache',
      });
      expect(screen.getByText('Stats: 9')).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('should render an API error', () => {
      useQuery.mockReturnValue({
        loading: false,
        error: new Error('stats unavailable'),
      });

      render(<GlobalStatsController />);

      expect(screen.getByText(/stats unavailable/i)).toBeInTheDocument();
    });

    it('should render empty stats when the response has no search payload', () => {
      useQuery.mockReturnValue({ loading: false, data: {} });

      render(<GlobalStatsController />);

      expect(screen.getByText('Stats:')).toBeInTheDocument();
    });
  });
});
