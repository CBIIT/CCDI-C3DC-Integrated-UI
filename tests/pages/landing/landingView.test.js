/**
 * Unit tests for the Integrated Home page view.
 *
 * The view receives static fixture props and performs no network requests.
 * Structure follows tests/TEST_STRUCTURE.md.
 */

import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LandingView from '../../../src/pages/landing/landingView';
import { landingPageData } from '../../../src/bento/landingPageData';
import { defaultLandingStatsData } from '../../fixtures/landing/landingViewProps';

function renderLandingView(statsData = defaultLandingStatsData) {
  return render(
    <MemoryRouter>
      <LandingView statsData={statsData} />
    </MemoryRouter>,
  );
}

describe('LandingView', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { container } = renderLandingView();
      expect(container).toBeInTheDocument();
    });

    it('should render the hero title and description', () => {
      renderLandingView();

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'Access and Visualize Data Sets within the C3DC Community',
      );
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
        'Get to know C3DC by selecting available Information below',
      );
    });
  });

  describe('Hero stats', () => {
    it('should render diagnoses, participants, and studies from props', () => {
      renderLandingView();

      expect(screen.getByText('Diagnoses')).toBeInTheDocument();
      expect(screen.getByText('Participants')).toBeInTheDocument();
      expect(screen.getAllByText('Studies')).toHaveLength(2);
      expect(screen.getByText('25')).toBeInTheDocument();
      expect(screen.getByText('12.4')).toBeInTheDocument();
      expect(screen.getByText('K')).toBeInTheDocument();
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('should provide alt text for stat and heartbeat images', () => {
      renderLandingView();

      expect(screen.getByRole('img', { name: 'Diagnoses Icon' })).toBeInTheDocument();
      expect(screen.getByRole('img', { name: 'Participants Icon' })).toBeInTheDocument();
      expect(screen.getByRole('img', { name: 'Studies Icon' })).toBeInTheDocument();
      expect(screen.getByRole('img', { name: 'Heartbeat Line Animation' })).toBeInTheDocument();
      expect(screen.getByRole('img', { name: 'Heartbeat Tracker Animation' })).toBeInTheDocument();
    });
  });

  describe('Home tiles', () => {
    it('should render all configured tile titles and descriptions', () => {
      renderLandingView();

      [
        landingPageData.tile1,
        landingPageData.tile2,
        landingPageData.tile3,
        landingPageData.tile4,
      ].forEach((tile) => {
        expect(screen.getByRole('heading', { name: tile.titleText })).toBeInTheDocument();
        expect(screen.getByText(tile.descriptionText)).toBeInTheDocument();
      });
    });

    it('should link each tile action to its configured destination', () => {
      renderLandingView();

      [
        landingPageData.tile1,
        landingPageData.tile2,
        landingPageData.tile3,
        landingPageData.tile4,
      ].forEach((tile) => {
        expect(
          screen.getByRole('link', { name: tile.callToActionText }),
        ).toHaveAttribute('href', tile.callToActionLink);
      });
    });
  });

  describe('Edge cases', () => {
    it('should render zero-valued stats without dropping their labels', () => {
      renderLandingView({
        numberOfDiseases: { num: 0, char: '' },
        numberOfParticipants: { num: 0, char: '' },
        numberOfStudies: { num: 0, char: '' },
      });

      expect(screen.getAllByText('0')).toHaveLength(3);
      expect(screen.getByText('Diagnoses')).toBeInTheDocument();
      expect(screen.getByText('Participants')).toBeInTheDocument();
      expect(screen.getAllByText('Studies')).toHaveLength(2);
    });
  });
});

