/**
 * FederationResourceView — topics, data-access infographic, nav/scroll.
 */

import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FederationResourceView from '../../../../src/pages/resource/FederationResourcePage/FederationResourceView';
import {
  clickTopicNav,
  triggerResourceScroll,
  triggerResourceScrollAbsolute,
  triggerResourceScrollToTop,
  toggleMobileSection,
} from '../shared/resourceViewTestUtils';
import { minimalFederationResourceData } from '../../../fixtures/resource/resourceDataViewProps';
import { multiTopicFederationData } from '../../../fixtures/resource/resourceInteractionData';

function renderFederationView(data = minimalFederationResourceData) {
  return render(
    <MemoryRouter>
      <FederationResourceView data={data} />
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
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 1024,
  });
});

describe('FederationResourceView', () => {
  describe('Rendering', () => {
    it('should render title, intro, API access link, and topics', () => {
      renderFederationView();
      expect(screen.getByText('CCDI Data Federation Resource')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /API Access/i })).toHaveAttribute(
        'href',
        'https://cbiit.github.io/ccdi-federation-api-aggregation/',
      );
      expect(screen.getByText(/Federation intro for unit test/i)).toBeInTheDocument();
      expect(screen.getAllByText('Federation Overview').length).toBeGreaterThan(0);
    });

    it('should show the data-access infographic when a topic id includes Data_Access', () => {
      renderFederationView({
        ...multiTopicFederationData,
        CCDI_Federation_Data_Access: 'https://example.com/fed-access.png',
      });
      expect(
        screen.getByAltText(/CCDI Federation Service ecosystem/i),
      ).toHaveAttribute('src', 'https://example.com/fed-access.png');
    });
  });

  describe('Navigation interactions', () => {
    it('should highlight a topic and collapse mobile sections', () => {
      renderFederationView(multiTopicFederationData);
      expect(clickTopicNav('Topic B')).toHaveClass('selected');
      const mobileHeader = toggleMobileSection();
      expect(mobileHeader.className).not.toContain('sectionCollapse');
      toggleMobileSection();
      expect(document.querySelector('.mciTitleMobile').className).toContain('sectionCollapse');
      triggerResourceScroll('FederationBody');
      expect(document.getElementById('leftNav').className).toContain('navListSticky');
      triggerResourceScrollAbsolute('FederationBody', 50);
      expect(document.getElementById('leftNav').className).toContain('navListAbsolute');
      triggerResourceScrollToTop('FederationBody');
      expect(document.getElementById('leftNav').className).toBe('navList');
    });

    it('should use tablet and mobile footer indexes on scroll', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 900,
      });
      const { unmount } = renderFederationView(multiTopicFederationData);
      triggerResourceScroll('FederationBody');
      expect(document.getElementById('leftNav').className).toContain('navListSticky');
      unmount();

      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      });
      renderFederationView(multiTopicFederationData);
      triggerResourceScroll('FederationBody');
      expect(document.getElementById('leftNav').className).toContain('navListSticky');
    });
  });

  describe('Edge cases', () => {
    it('should render when federationContent is missing', () => {
      expect(() => renderFederationView({})).not.toThrow();
      expect(screen.getByText('CCDI Data Federation Resource')).toBeInTheDocument();
    });
  });
});
