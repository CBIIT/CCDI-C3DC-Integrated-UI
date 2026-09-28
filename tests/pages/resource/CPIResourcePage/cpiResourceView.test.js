/**
 * CPIResourceView — stats loading/error, nav, resize, CPI_Components image.
 */

import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CPIResourceView from '../../../../src/pages/resource/CPIResourcePage/CPIResourceView';
import {
  clickTopicNav,
  triggerResourceScroll,
  triggerResourceScrollAbsolute,
  toggleMobileSection,
} from '../shared/resourceViewTestUtils';
import {
  minimalCpiResourceData,
  minimalCpiStatsApiResponse,
} from '../../../fixtures/resource/cpiResourceFixtures';

function renderCpiView(extra = {}) {
  return render(
    <MemoryRouter>
      <CPIResourceView
        data={minimalCpiResourceData}
        cpiStats={minimalCpiStatsApiResponse}
        loadingCpiStats={false}
        cpiStatsError={false}
        {...extra}
      />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  window.scrollTo = jest.fn();
  for (let i = 0; i < 3; i += 1) {
    document.body.appendChild(document.createElement('footer'));
  }
});

afterEach(() => {
  document.querySelectorAll('footer').forEach((el) => el.remove());
});

describe('CPIResourceView', () => {
  describe('Rendering', () => {
    it('should render stats numbers and a subtitle nav item', () => {
      renderCpiView({
        data: {
          ...minimalCpiResourceData,
          cpiContent: [
            ...minimalCpiResourceData.cpiContent,
            { id: 'sub_only', subtopic: 'CPI Subtopic', content: 'Sub body' },
          ],
        },
      });
      expect(screen.getByText('CCDI Participant Index')).toBeInTheDocument();
      expect(screen.getByText(/4,242/)).toBeInTheDocument();
      expect(screen.getByText('CPI Subtopic')).toBeInTheDocument();
    });

    it('should show loading statistics copy while stats are in flight', () => {
      renderCpiView({ loadingCpiStats: true, cpiStats: null });
      expect(screen.getByText('Loading Statistics...')).toBeInTheDocument();
    });
  });

  describe('Navigation interactions', () => {
    it('should highlight topics, toggle collapse, and stick the nav', () => {
      renderCpiView();
      expect(clickTopicNav('Components Topic')).toHaveClass('selected');
      const mobileHeader = toggleMobileSection();
      expect(mobileHeader.className).not.toContain('sectionCollapse');
      triggerResourceScroll('FederationBody');
      expect(document.getElementById('leftNav').className).toContain('navListSticky');
      triggerResourceScrollAbsolute('FederationBody', 50);
      expect(document.getElementById('leftNav').className).toContain('navListAbsolute');
    });

    it('should switch to the mobile blur border on resize', () => {
      renderCpiView();
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      });
      fireEvent.resize(window);
      expect(screen.getAllByAltText('blurBorder').length).toBeGreaterThan(0);
    });
  });

  describe('Edge cases', () => {
    it('should render when cpiContent is missing', () => {
      expect(() =>
        renderCpiView({ data: { cpiIntroText: 'Intro only.' } }),
      ).not.toThrow();
      expect(screen.getByText(/Intro only/i)).toBeInTheDocument();
    });
  });
});
