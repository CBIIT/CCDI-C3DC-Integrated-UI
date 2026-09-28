import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import HeaderMobile from '../../src/components/ResponsiveHeader/HeaderMobile';
import HeaderTablet from '../../src/components/ResponsiveHeader/HeaderTablet';

jest.mock('../../src/components/ResponsiveHeader/components/LogoMobile', () => () => (
  <div>Mobile logo</div>
));
jest.mock('../../src/components/ResponsiveHeader/components/LogoTablet', () => () => (
  <div>Tablet logo</div>
));
jest.mock('../../src/components/ResponsiveHeader/components/SearchBarMobile', () => () => (
  <div>Mobile search</div>
));
jest.mock('../../src/components/ResponsiveHeader/components/SearchBarTablet', () => () => (
  <div>Tablet search</div>
));

const variants = [
  ['mobile', HeaderMobile, 'Mobile logo', 'Mobile search'],
  ['tablet', HeaderTablet, 'Tablet logo', 'Tablet search'],
];

beforeAll(() => {
  global.MutationObserver = class MutationObserver {
    observe() {}

    disconnect() {}
  };
});

describe.each(variants)('%s responsive header', (name, Component, logo, search) => {
  function renderHeader(path = '/') {
    return render(
      <MemoryRouter initialEntries={[path]}>
        <Component />
      </MemoryRouter>,
    );
  }

  describe('Rendering', () => {
    it('should render government branding, logo, search, and menu', () => {
      renderHeader();

      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('img', { name: 'US Flag logo' })).toBeInTheDocument();
      expect(
        screen.getByText('An official website of the United States government'),
      ).toBeInTheDocument();
      expect(screen.getByText(logo)).toBeInTheDocument();
      expect(screen.getByText(search)).toBeInTheDocument();
      expect(screen.getByText('Menu')).toBeInTheDocument();
    });

    it('should hide the header search on the site-search route', () => {
      renderHeader('/sitesearch?keyword=cancer');

      expect(screen.queryByText(search)).not.toBeInTheDocument();
    });
  });

  describe('Navigation menu', () => {
    it('should open and close the main menu', () => {
      const { container } = renderHeader();
      const overlay = container.querySelector('[style*="display: none"]');

      fireEvent.click(screen.getByText('Menu'));
      expect(overlay.style.display).toBe('block');
      expect(screen.getByText('MY FILES')).toBeInTheDocument();

      fireEvent.click(screen.getByRole('img', { name: 'menuClearButton' }));
      expect(overlay.style.display).toBe('none');
    });

    it('should drill into and return from the About submenu', async () => {
      renderHeader();
      fireEvent.click(screen.getByText('Menu'));

      const about = screen.getByText('About');
      Object.defineProperty(about, 'innerText', {
        configurable: true,
        value: 'About',
      });
      fireEvent.click(about);

      expect(await screen.findByText('Main Menu')).toBeInTheDocument();
      expect(screen.getByText('CCDI FAQs')).toBeInTheDocument();
      expect(screen.getByText('Release Notes')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Main Menu'));
      await waitFor(() => {
        expect(screen.queryByText('Main Menu')).not.toBeInTheDocument();
      });
      expect(screen.getByText('Explore Participants')).toBeInTheDocument();
    });

    it('should preserve explore query parameters and close after selection', () => {
      const { container } = renderHeader('/exploreParticipants?diagnosis=AML');
      const overlay = container.querySelector('[style*="display: none"]');
      fireEvent.click(screen.getByText('Menu'));

      expect(screen.getByText('Explore Files').closest('a')).toHaveAttribute(
        'href',
        '/exploreFiles?diagnosis=AML',
      );
      fireEvent.click(screen.getByText('Explore Files'));
      expect(overlay.style.display).toBe('none');
    });

    it('should close from submenu, cart, and backdrop selections', async () => {
      const { container } = renderHeader();
      const overlay = container.querySelector('[style*="display: none"]');

      fireEvent.click(screen.getByText('Menu'));
      const about = screen.getByText('About');
      Object.defineProperty(about, 'innerText', {
        configurable: true,
        value: 'About',
      });
      fireEvent.click(about);
      fireEvent.click(await screen.findByText('Release Notes'));
      expect(overlay.style.display).toBe('none');

      fireEvent.click(screen.getByText('Menu'));
      fireEvent.click(screen.getByText('Main Menu'));
      fireEvent.click(screen.getByText('MY FILES'));
      expect(overlay.style.display).toBe('none');

      fireEvent.click(screen.getByText('Menu'));
      fireEvent.click(container.querySelector('.greyContainer'));
      expect(overlay.style.display).toBe('none');
    });
  });
});
