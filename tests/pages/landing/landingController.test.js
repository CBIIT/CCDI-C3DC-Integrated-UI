/**
 * Unit tests for the Integrated Home page controller.
 *
 * Apollo is mocked so the suite verifies query configuration and all controller
 * states without making network requests.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useQuery } from '@apollo/client';
import LandingController, {
  formatNumbers,
} from '../../../src/pages/landing/landingController';
import { GLOBAL_STATS_BAR_QUERY } from '../../../src/bento/landingPageData';
import { rawLandingStatsData } from '../../fixtures/landing/landingViewProps';

jest.mock('@apollo/client', () => ({
  useQuery: jest.fn(),
}));

jest.mock('../../../src/pages/landing/landingView', () => function MockLandingView({
  statsData,
}) {
  return <div data-testid="landing-view">{JSON.stringify(statsData)}</div>;
});

jest.mock('../../../src/components/Wrappers/Wrappers', () => ({
  Typography: ({ children }) => <h5>{children}</h5>,
}));

describe('LandingController', () => {
  beforeEach(() => {
    useQuery.mockReset();
  });

  describe('Rendering', () => {
    it('should show a progress indicator while stats are loading', () => {
      useQuery.mockReturnValue({ loading: true, error: undefined, data: undefined });

      render(<LandingController />);

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should show an error message when the stats query fails', () => {
      useQuery.mockReturnValue({
        loading: false,
        error: new Error('stats unavailable'),
        data: undefined,
      });

      render(<LandingController />);

      expect(
        screen.getByText(/An error has occurred in loading stats component/),
      ).toHaveTextContent('stats unavailable');
      expect(screen.queryByTestId('landing-view')).not.toBeInTheDocument();
    });

    it('should render the Home view with formatted stats after loading', () => {
      useQuery.mockReturnValue({
        loading: false,
        error: undefined,
        data: rawLandingStatsData,
      });

      render(<LandingController />);

      expect(screen.getByTestId('landing-view')).toHaveTextContent(
        '"numberOfParticipants":{"num":12.4,"char":"K"}',
      );
    });
  });

  describe('Stats query', () => {
    it('should request global stats without using cached data', () => {
      useQuery.mockReturnValue({
        loading: false,
        error: undefined,
        data: rawLandingStatsData,
      });

      render(<LandingController />);

      expect(useQuery).toHaveBeenCalledWith(GLOBAL_STATS_BAR_QUERY, {
        fetchPolicy: 'no-cache',
      });
    });
  });

  describe('Number formatting', () => {
    it('should format billions, millions, thousands, and small values', () => {
      expect(formatNumbers({
        billions: 2150000000,
        millions: 1240000,
        thousands: 12450,
        small: 42,
      })).toEqual({
        billions: { num: 2.2, char: 'B' },
        millions: { num: 1.2, char: 'M' },
        thousands: { num: 12.5, char: 'K' },
        small: { num: 42, char: '' },
      });
    });

    it('should preserve zero as a non-abbreviated value', () => {
      expect(formatNumbers({ count: 0 })).toEqual({
        count: { num: 0, char: '' },
      });
    });
  });
});

