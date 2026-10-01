import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HeaderDesktop from '../../src/components/ResponsiveHeader/HeaderDesktop';

jest.mock('../../src/components/ResponsiveHeader/components/LogoDesktop', () => () => (
  <div>Desktop logo</div>
));
jest.mock('../../src/components/ResponsiveHeader/components/SearchBarDesktop', () => () => (
  <div>Desktop search</div>
));
jest.mock('../../src/components/ResponsiveHeader/components/NavbarDesktop', () => () => (
  <div>Desktop navbar</div>
));
jest.mock('../../src/components/ResponsiveHeader/components/CartDesktop', () => () => (
  <div>Desktop cart</div>
));

describe('HeaderDesktop', () => {
  function renderHeader(path = '/') {
    return render(
      <MemoryRouter initialEntries={[path]}>
        <HeaderDesktop />
      </MemoryRouter>,
    );
  }

  describe('Rendering', () => {
    it('should render government branding and all desktop header sections', () => {
      renderHeader();

      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('img', { name: 'US Flag logo' })).toBeInTheDocument();
      expect(
        screen.getByText('An official website of the United States government'),
      ).toBeInTheDocument();
      expect(screen.getByText('Desktop logo')).toBeInTheDocument();
      expect(screen.getByText('Desktop search')).toBeInTheDocument();
      expect(screen.getByText('Desktop navbar')).toBeInTheDocument();
      expect(screen.getByText('Desktop cart')).toBeInTheDocument();
    });

    it('should hide the desktop search on the site-search route', () => {
      renderHeader('/sitesearch?keyword=cancer');

      expect(screen.queryByText('Desktop search')).not.toBeInTheDocument();
      expect(screen.getByText('Desktop navbar')).toBeInTheDocument();
      expect(screen.getByText('Desktop cart')).toBeInTheDocument();
    });
  });
});
