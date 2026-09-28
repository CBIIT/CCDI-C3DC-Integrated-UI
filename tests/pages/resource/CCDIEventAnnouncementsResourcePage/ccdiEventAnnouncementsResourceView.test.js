/**
 * CCDIEventAnnouncementsResourceView — topics, intro, nav, collapse.
 */

jest.mock('../../../../src/assets/about/Data_Usage_Policies_Header.png', () => 'header.png', { virtual: true });

import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CCDIEventAnnouncementsResourceView from '../../../../src/pages/resource/CCDIEventAnnouncementsResourcePage/CCDIEventAnnouncementsResourceView';
import {
  clickTopicNav,
  triggerResourceScroll,
  triggerResourceScrollAbsolute,
  toggleMobileSection,
} from '../shared/resourceViewTestUtils';
import { minimalCcdiEventAnnouncementsResourceData } from '../../../fixtures/resource/resourceDataViewProps';
import { multiTopicCcdiEventsData } from '../../../fixtures/resource/resourceInteractionData';

function renderEventsView(data = minimalCcdiEventAnnouncementsResourceData) {
  return render(
    <MemoryRouter>
      <CCDIEventAnnouncementsResourceView data={data} />
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

describe('CCDIEventAnnouncementsResourceView', () => {
  describe('Rendering', () => {
    it('should render header, intro, and topics', () => {
      renderEventsView();
      expect(screen.getByText('CCDI Events Announcements')).toBeInTheDocument();
      expect(screen.getByText(/CCDI events intro for unit test/i)).toBeInTheDocument();
      expect(screen.getAllByText('Announcements Topic').length).toBeGreaterThan(0);
    });

    it('should render a subtitle-only nav item', () => {
      renderEventsView({
        ...minimalCcdiEventAnnouncementsResourceData,
        ccdiEventAnnouncementsContent: [
          { id: 'event_sub', subtopic: 'Event Subtopic', content: 'Sub body' },
        ],
      });
      expect(screen.getByText('Event Subtopic')).toBeInTheDocument();
    });
  });

  describe('Navigation interactions', () => {
    it('should highlight a topic, toggle collapse, and switch sticky/absolute nav', () => {
      renderEventsView(multiTopicCcdiEventsData);
      expect(clickTopicNav('Events B')).toHaveClass('selected');
      const mobileHeader = toggleMobileSection();
      expect(mobileHeader.className).not.toContain('sectionCollapse');
      toggleMobileSection();
      expect(document.querySelector('.mciTitleMobile').className).toContain('sectionCollapse');
      triggerResourceScroll('CCDIEventArchiveBody');
      expect(document.getElementById('leftNav').className).toContain('navListSticky');
      triggerResourceScrollAbsolute('CCDIEventArchiveBody', 50);
      expect(document.getElementById('leftNav').className).toContain('navListAbsolute');
    });
  });
});
