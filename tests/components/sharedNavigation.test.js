import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { initCart } from '@bento-core/cart';
import Header from '../../src/components/ResponsiveHeader';
import NavbarDesktop from '../../src/components/ResponsiveHeader/components/NavbarDesktop';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

jest.mock('@bento-core/cart', () => ({
  initCart: jest.fn(() => ({ type: 'INIT_CART' })),
}));

jest.mock('../../src/components/ResponsiveHeader/HeaderDesktop', () => () => (
  <div>Desktop header</div>
));
jest.mock('../../src/components/ResponsiveHeader/HeaderTablet', () => () => (
  <div>Tablet header</div>
));
jest.mock('../../src/components/ResponsiveHeader/HeaderMobile', () => () => (
  <div>Mobile header</div>
));

describe('Responsive header and desktop navbar', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
    initCart.mockClear();
  });

  describe('Rendering', () => {
    it('should render each responsive header and initialize the cart', () => {
      render(<Header />);

      expect(screen.getByText('Desktop header')).toBeInTheDocument();
      expect(screen.getByText('Tablet header')).toBeInTheDocument();
      expect(screen.getByText('Mobile header')).toBeInTheDocument();
      expect(initCart).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'INIT_CART' });
    });

    it('should render direct navigation links with their destinations', () => {
      render(
        <MemoryRouter initialEntries={['/home']}>
          <NavbarDesktop />
        </MemoryRouter>,
      );

      expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/home');
      expect(screen.getByRole('link', { name: 'Studies' })).toHaveAttribute('href', '/studies');
      expect(screen.getByRole('link', { name: 'CCDI Hub' })).toHaveAttribute(
        'target',
        '_blank',
      );
    });
  });

  describe('About menu', () => {
    it('should open and close the About submenu', () => {
      render(
        <MemoryRouter>
          <NavbarDesktop />
        </MemoryRouter>,
      );

      const aboutButton = screen.getByRole('button', { name: 'About' });
      Object.defineProperty(aboutButton, 'innerText', {
        configurable: true,
        value: 'About',
      });
      fireEvent.click(aboutButton);
      expect(screen.getByRole('link', { name: 'Release Notes' })).toBeVisible();
      expect(screen.getByRole('link', { name: 'User Guide' })).toBeVisible();

      fireEvent.click(aboutButton);
      expect(screen.queryByRole('link', { name: 'Release Notes' })).not.toBeInTheDocument();
    });

    it('should open the About submenu with the Enter key', () => {
      render(
        <MemoryRouter>
          <NavbarDesktop />
        </MemoryRouter>,
      );

      const aboutButton = screen.getByRole('button', { name: 'About' });
      Object.defineProperty(aboutButton, 'innerText', {
        configurable: true,
        value: 'About',
      });
      fireEvent.keyDown(aboutButton, { key: 'Enter' });
      expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
    });

    it('should close the About submenu after selecting an item', () => {
      render(
        <MemoryRouter>
          <NavbarDesktop />
        </MemoryRouter>,
      );
      const aboutButton = screen.getByRole('button', { name: 'About' });
      Object.defineProperty(aboutButton, 'innerText', {
        configurable: true,
        value: 'About',
      });
      fireEvent.click(aboutButton);

      fireEvent.click(screen.getByRole('link', { name: 'About' }));

      expect(
        screen.queryByRole('link', { name: 'Release Notes' }),
      ).not.toBeInTheDocument();
    });

    it('should close the About submenu when clicking outside it', () => {
      render(
        <MemoryRouter>
          <NavbarDesktop />
        </MemoryRouter>,
      );
      const aboutButton = screen.getByRole('button', { name: 'About' });
      Object.defineProperty(aboutButton, 'innerText', {
        configurable: true,
        value: 'About',
      });
      fireEvent.click(aboutButton);

      fireEvent.mouseDown(document.body);

      expect(
        screen.queryByRole('link', { name: 'Release Notes' }),
      ).not.toBeInTheDocument();
    });
  });
});
