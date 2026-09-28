/**
 * MCIResourceView — nested topics, tables/map/search widgets, nav.
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
import MCIResourceView from '../../../../src/pages/resource/MCIResourcePage/MCIResourceView';
import {
  clickTopicNav,
  clickSubtopicNav,
  triggerResourceScroll,
  toggleMobileSection,
} from '../shared/resourceViewTestUtils';
import { defaultMciViewData, mciViewWithWidgetsData } from '../../../fixtures/resource/mciViewProps';
import { multiTopicMciData } from '../../../fixtures/resource/resourceInteractionData';

function renderMciView(data = defaultMciViewData) {
  return render(
    <MemoryRouter>
      <MCIResourceView data={data} />
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

describe('MCIResourceView', () => {
  describe('Rendering', () => {
    it('should render title, home breadcrumb, intro, and subsection', () => {
      renderMciView();
      expect(screen.getByText('Molecular Characterization Initiative')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Home/i, hidden: true })).toHaveAttribute('href', '/');
      expect(screen.getByText(/Unit test intro for MCI resource page/i)).toBeInTheDocument();
      expect(screen.getAllByText('First Subsection').length).toBeGreaterThan(0);
    });

    it('should render table, disease, map, search, ecosystem, and annotation widgets', () => {
      renderMciView(mciViewWithWidgetsData);
      expect(screen.getAllByText('Assay table').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Table footer.').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Disease breakdown').length).toBeGreaterThan(0);
      expect(screen.getAllByTestId('donut-chart-mock').length).toBeGreaterThan(0);
      expect(screen.getByTestId('map-view-mock')).toBeInTheDocument();
      expect(screen.getAllByText('California').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Gene search').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Widget annotation.').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Workflow caption for unit test.').length).toBeGreaterThan(0);
      expect(screen.getByRole('link', { name: /here/i })).toHaveAttribute(
        'href',
        expect.stringContaining('MCI_JSON2TSV'),
      );
    });
  });

  describe('Navigation interactions', () => {
    it('should highlight topic/subtopic, toggle collapse, and stick the nav', () => {
      renderMciView(multiTopicMciData);
      expect(clickTopicNav('MCI Topic B')).toHaveClass('selected');
      expect(clickSubtopicNav('MCI Sub A')).toHaveClass('selected');
      const mobileHeader = toggleMobileSection('.mciTitleMobile');
      expect(mobileHeader.className).not.toContain('sectionCollapse');
      fireEvent.click(mobileHeader);
      expect(mobileHeader.className).toContain('sectionCollapse');
      triggerResourceScroll('MCIBody');
      expect(document.getElementById('leftNav').className).toContain('navListSticky');
    });
  });

  describe('Edge cases', () => {
    it('should render when mciContent is missing', () => {
      expect(() => renderMciView({ introText: 'Intro only.' })).not.toThrow();
      expect(screen.getByText(/Intro only/i)).toBeInTheDocument();
    });
  });
});
