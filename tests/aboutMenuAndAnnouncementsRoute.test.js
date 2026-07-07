import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { navbarSublists } from '../src/bento/globalHeaderData';
import Layout from '../src/components/Layout/LayoutView';

jest.mock('../src/components/ResponsiveFooter/', () => () => <div>Footer</div>);
jest.mock('../src/components/ResponsiveHeader/', () => () => <div>Header</div>);
jest.mock('../src/components/OverlayWindow/OverlayWindow', () => () => <div>Overlay</div>);
jest.mock('../src/components/ScrollButton/ScrollButtonView', () => () => <div>Scroll</div>);
jest.mock('../src/pages/landing/landingController', () => () => <div>Home Page</div>);
jest.mock('../src/pages/about/AboutView', () => () => <div>About Page</div>);
jest.mock('../src/pages/pdfReader/pdfReader', () => () => <div>PDF Reader Page</div>);
jest.mock('../src/pages/dmn/DataModelNavigator', () => () => <div>Data Model Page</div>);
jest.mock('../src/pages/error/Error', () => () => <div>Error Page</div>);
jest.mock('../src/pages/globalSearch/searchController', () => () => <div>Search Page</div>);
jest.mock('../src/pages/inventory/inventoryController', () => () => <div>Inventory Page</div>);
jest.mock('../src/pages/cart/cartController', () => () => <div>Cart Page</div>);
jest.mock('../src/pages/studies/studiesView', () => () => <div>Studies Page</div>);
jest.mock('../src/pages/studyDetail/studyDetailController', () => () => <div>Study Detail Page</div>);
jest.mock('../src/pages/CohortAnalyzer/controllers/CohortAnalyzerController', () => () => <div>Cohort Analyzer Page</div>);

describe('about menu and announcements route', () => {
  afterEach(() => {
    cleanup();
  });

  it('keeps only About, Release Notes, and User Guide in About submenu', () => {
    const aboutSubmenu = navbarSublists.About;
    expect(aboutSubmenu.map((item) => item.name)).toEqual([
      'About',
      'Release Notes',
      'User Guide',
    ]);
    expect(aboutSubmenu.some((item) => item.link === '/announcements')).toBe(false);
  });

  it('does not resolve /announcements and still resolves existing about pages', () => {
    render(
      <MemoryRouter initialEntries={['/announcements']}>
        <Layout />
      </MemoryRouter>,
    );
    expect(screen.getByText('Error Page')).toBeTruthy();
    cleanup();

    render(
      <MemoryRouter initialEntries={['/about']}>
        <Layout />
      </MemoryRouter>,
    );
    expect(screen.getByText('About Page')).toBeTruthy();
    cleanup();

    render(
      <MemoryRouter initialEntries={['/release-notes-pdf']}>
        <Layout />
      </MemoryRouter>,
    );
    expect(screen.getByText('PDF Reader Page')).toBeTruthy();
    cleanup();

    render(
      <MemoryRouter initialEntries={['/user-guide']}>
        <Layout />
      </MemoryRouter>,
    );
    expect(screen.getByText('PDF Reader Page')).toBeTruthy();
  });
});
