/**
 * CBioPortalResourceView — intro gated by cpiIntroText, nav, go-to-site links.
 */

import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CBioPortalResourceView from '../../../../src/pages/resource/cBioPortalResourcePage/cBioPortalResourceView';
import {
  clickTopicNav,
  triggerResourceScroll,
  triggerResourceScrollAbsolute,
  triggerResourceScrollToTop,
  toggleMobileSection,
} from '../shared/resourceViewTestUtils';
import { minimalCBioPortalResourceData } from '../../../fixtures/resource/resourceDataViewProps';
import { multiTopicCBioData } from '../../../fixtures/resource/resourceInteractionData';

function renderCbioView(data = minimalCBioPortalResourceData) {
  return render(
    <MemoryRouter>
      <CBioPortalResourceView data={data} />
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

describe('CBioPortalResourceView', () => {
  describe('Rendering', () => {
    it('should render title, go-to-site link, gated intro, and topics', () => {
      renderCbioView();
      expect(screen.getByText('CCDI cBioPortal')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Go to cBioPortal/i })).toHaveAttribute(
        'href',
        'https://cbioportal.ccdi.cancer.gov',
      );
      expect(screen.getByText(/cBioPortal intro for unit test/i)).toBeInTheDocument();
      expect(screen.getAllByText('cBioPortal Topic').length).toBeGreaterThan(0);
    });

    it('should hide intro HTML when cpiIntroText is missing', () => {
      renderCbioView({
        ...minimalCBioPortalResourceData,
        cpiIntroText: '',
      });
      expect(screen.queryByText(/cBioPortal intro for unit test/i)).not.toBeInTheDocument();
    });

    it('should render a subtitle-only nav item', () => {
      renderCbioView({
        ...minimalCBioPortalResourceData,
        cbioportalContent: [
          { id: 'cbio_sub', subtopic: 'cBio Subtopic', content: '<p>sub</p>' },
        ],
      });
      expect(screen.getByText('cBio Subtopic')).toBeInTheDocument();
    });
  });

  describe('Navigation interactions', () => {
    it('should highlight a topic, toggle collapse, and stick the nav', () => {
      renderCbioView(multiTopicCBioData);
      expect(clickTopicNav('cBio B')).toHaveClass('selected');
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
      const { unmount } = renderCbioView(multiTopicCBioData);
      triggerResourceScroll('FederationBody');
      expect(document.getElementById('leftNav').className).toContain('navListSticky');
      unmount();

      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      });
      renderCbioView(multiTopicCBioData);
      triggerResourceScroll('FederationBody');
      expect(document.getElementById('leftNav').className).toContain('navListSticky');
    });
  });
});
