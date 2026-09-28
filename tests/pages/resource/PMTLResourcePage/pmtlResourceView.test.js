/**
 * PMTLResourceView — nested topics, PMTL tables/map/search widgets, nav.
 */

jest.mock('../../../../src/components/common/mapGenerator', () => (
  function MapViewMock() {
    return <div data-testid="map-view-mock" />;
  }
));

jest.mock('../../../../src/components/common/DonutChart', () => (
  function DonutChartMock() {
    return <div data-testid="donut-chart-mock" />;
  }
));

import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PMTLResourceView from '../../../../src/pages/resource/PMTLResourcePage/PMTLResourceView';
import {
  clickTopicNav,
  clickSubtopicNav,
  triggerResourceScroll,
} from '../shared/resourceViewTestUtils';
import { defaultPmtlViewData, pmtlViewWithWidgetsData } from '../../../fixtures/resource/pmtlViewProps';
import { multiTopicPmtlData } from '../../../fixtures/resource/resourceInteractionData';

function renderPmtlView(data = defaultPmtlViewData) {
  return render(
    <MemoryRouter>
      <PMTLResourceView data={data} />
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

describe('PMTLResourceView', () => {
  describe('Rendering', () => {
    it('should render title, home breadcrumb, intro, and subsection', () => {
      renderPmtlView();
      expect(screen.getByText('Pediatric Molecular Target Lists')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Home/i, hidden: true })).toHaveAttribute('href', '/');
      expect(screen.getByText(/Unit test intro for PMTL resource page/i)).toBeInTheDocument();
      expect(screen.getAllByText('First Subsection').length).toBeGreaterThan(0);
    });

    it('should render table, disease, map, search, and annotation widgets', () => {
      renderPmtlView(pmtlViewWithWidgetsData);
      expect(screen.getAllByText('PMTL assay table').length).toBeGreaterThan(0);
      expect(screen.getAllByText('PMTL table footer.').length).toBeGreaterThan(0);
      expect(screen.getAllByText('PMTL disease').length).toBeGreaterThan(0);
      expect(screen.getAllByTestId('donut-chart-mock').length).toBeGreaterThan(0);
      expect(screen.getByTestId('map-view-mock')).toBeInTheDocument();
      expect(screen.getAllByText('Texas').length).toBeGreaterThan(0);
      expect(screen.getAllByText('PMTL gene search').length).toBeGreaterThan(0);
      expect(screen.getAllByText('PMTL annotation.').length).toBeGreaterThan(0);
    });
  });

  describe('Navigation interactions', () => {
    it('should highlight topic/subtopic, toggle collapse, and stick the nav', () => {
      renderPmtlView(multiTopicPmtlData);
      expect(clickTopicNav('PMTL Topic B')).toHaveClass('selected');
      expect(clickSubtopicNav('PMTL Sub A')).toHaveClass('selected');
      const mobileHeader = document.querySelector('.pmtlTitleMobile');
      fireEvent.click(mobileHeader);
      expect(mobileHeader.className).not.toContain('sectionCollapse');
      fireEvent.click(mobileHeader);
      expect(mobileHeader.className).toContain('sectionCollapse');
      triggerResourceScroll('PMTLBody');
      expect(document.getElementById('leftNav').className).toContain('navListSticky');
    });
  });

  describe('Edge cases', () => {
    it('should render when pmtlContent is missing', () => {
      expect(() => renderPmtlView({ introText: 'Intro only.' })).not.toThrow();
      expect(screen.getByText(/Intro only/i)).toBeInTheDocument();
    });
  });
});
