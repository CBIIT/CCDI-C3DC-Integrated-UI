import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { MemoryRouter } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBarDesktop from '../../src/components/ResponsiveHeader/components/SearchBarDesktop';
import SearchBarTablet from '../../src/components/ResponsiveHeader/components/SearchBarTablet';
import SearchBarMobile from '../../src/components/ResponsiveHeader/components/SearchBarMobile';
import LogoDesktop from '../../src/components/ResponsiveHeader/components/LogoDesktop';
import LogoTablet from '../../src/components/ResponsiveHeader/components/LogoTablet';
import LogoMobile from '../../src/components/ResponsiveHeader/components/LogoMobile';
import CartDesktop from '../../src/components/ResponsiveHeader/components/CartDesktop';
import { navBarCartData } from '../../src/bento/globalHeaderData';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const searchVariants = [
  ['desktop', SearchBarDesktop, 'search_desktop', false],
  ['tablet', SearchBarTablet, 'search_tablet', true],
  ['mobile', SearchBarMobile, 'search_mobile', true],
];

describe.each(searchVariants)('%s search bar', (name, Component, inputId, iconButton) => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('should navigate with trimmed text when Enter is pressed', () => {
    render(<Component />);
    const input = document.getElementById(inputId);

    fireEvent.change(input, { target: { value: '  leukemia  ' } });
    fireEvent.keyPress(input, { key: 'Enter', charCode: 13 });

    expect(mockNavigate).toHaveBeenCalledWith('/sitesearch?keyword=leukemia');
    expect(input).toHaveValue('');
  });

  it('should navigate from the search action and clear the input', () => {
    const { container } = render(<Component />);
    const input = document.getElementById(inputId);
    fireEvent.change(input, { target: { value: 'sarcoma' } });

    if (iconButton) {
      fireEvent.click(screen.getByRole('img', { name: 'searchIcon' }));
    } else {
      fireEvent.click(container.querySelector('.searchButton'));
    }

    expect(mockNavigate).toHaveBeenCalledWith('/sitesearch?keyword=sarcoma');
    expect(input).toHaveValue('');
  });

  it('should ignore non-Enter key presses', () => {
    render(<Component />);
    const input = document.getElementById(inputId);
    fireEvent.change(input, { target: { value: 'sarcoma' } });

    fireEvent.keyPress(input, { key: 'a', charCode: 97 });

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(input).toHaveValue('sarcoma');
  });
});

const logoVariants = [
  ['desktop', LogoDesktop],
  ['tablet', LogoTablet],
  ['mobile', LogoMobile],
];

describe.each(logoVariants)('%s logo', (name, Component) => {
  it('should link the portal logo to Home', () => {
    render(
      <MemoryRouter>
        <Component />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: 'logoPortal' })).toHaveAttribute('href', '/');
  });
});

describe('CartDesktop', () => {
  function renderCart(filesId) {
    const store = createStore(() => ({ cartReducer: { filesId } }));
    return render(
      <Provider store={store}>
        <MemoryRouter>
          <CartDesktop />
        </MemoryRouter>
      </Provider>,
    );
  }

  it('should show the formatted file count and link to the cart', () => {
    const filesId = Array.from({ length: 1234 }, (_, index) => `file-${index}`);
    renderCart(filesId);

    expect(screen.getByText('MY FILES')).toBeInTheDocument();
    expect(screen.getByText('1,234')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'cart_logo' })).toBeInTheDocument();
    expect(screen.getByText('MY FILES').closest('a')).toHaveAttribute(
      'href',
      '/fileCentricCart',
    );
  });

  it('should render the alternate count badge configuration', () => {
    const originalType = navBarCartData.cartLabelType;
    navBarCartData.cartLabelType = 'badge';

    const { container } = renderCart(['file-1', 'file-2']);

    expect(container.querySelector('.cartCounter')).toHaveTextContent('2');
    navBarCartData.cartLabelType = originalType;
  });
});
