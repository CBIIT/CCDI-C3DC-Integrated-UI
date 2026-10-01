import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Layout from '../../src/components/Layout/LayoutView';

jest.mock('../../src/components/ResponsiveFooter/', () => () => <div>Footer</div>);
jest.mock('../../src/components/ResponsiveHeader/', () => () => <div>Header</div>);
jest.mock('../../src/components/OverlayWindow/OverlayWindow', () => () => <div>Overlay</div>);
jest.mock('../../src/components/ScrollButton/ScrollButtonView', () => () => <div>Scroll</div>);
jest.mock('../../src/pages/landing/landingController', () => () => <div>Home Page</div>);
jest.mock('../../src/pages/about/AboutView', () => () => <div>About Page</div>);
jest.mock('../../src/pages/pdfReader/pdfReader', () => () => <div>PDF Reader Page</div>);
jest.mock('../../src/pages/dmn/DataModelNavigator', () => () => <div>Data Model Page</div>);
jest.mock('../../src/pages/error/Error', () => () => <div>Error Page</div>);
jest.mock('../../src/pages/globalSearch/searchController', () => () => <div>Search Page</div>);
jest.mock('../../src/pages/inventory/inventoryController', () => () => <div>Inventory Page</div>);
jest.mock('../../src/pages/cart/cartController', () => () => <div>Cart Page</div>);
jest.mock('../../src/pages/studies/studiesView', () => () => <div>Studies Page</div>);
jest.mock('../../src/pages/studyDetail/studyDetailController', () => () => <div>Study Detail Page</div>);
jest.mock('../../src/pages/CohortAnalyzer/controllers/CohortAnalyzerController', () => () => (
  <div>Cohort Analyzer Page</div>
));

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Layout />
    </MemoryRouter>,
  );
}

describe('Layout routes', () => {
  describe('Rendering', () => {
    it('should mount shared chrome around routed pages', () => {
      renderAt('/');

      expect(screen.getByText('Header')).toBeInTheDocument();
      expect(screen.getByText('Footer')).toBeInTheDocument();
      expect(screen.getByText('Overlay')).toBeInTheDocument();
      expect(screen.getByText('Scroll')).toBeInTheDocument();
    });
  });

  describe('Product routes', () => {
    it.each([
      ['/', 'Home Page'],
      ['/home', 'Home Page'],
      ['/about', 'About Page'],
      ['/data-model', 'Data Model Page'],
      ['/release-notes-pdf', 'PDF Reader Page'],
      ['/user-guide', 'PDF Reader Page'],
      ['/sitesearch?keyword=aml', 'Search Page'],
      ['/exploreParticipants', 'Inventory Page'],
      ['/exploreFiles', 'Inventory Page'],
      ['/fileCentricCart', 'Cart Page'],
      ['/cohortAnalyzer', 'Cohort Analyzer Page'],
      ['/studies', 'Studies Page'],
      ['/studies/phs002790', 'Study Detail Page'],
      ['/unknown-route', 'Error Page'],
    ])('should render %s', (path, page) => {
      renderAt(path);
      expect(screen.getByText(page)).toBeInTheDocument();
    });
  });
});
