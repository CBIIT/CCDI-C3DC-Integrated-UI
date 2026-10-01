import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from '../../src/components/ResponsiveFooter';

jest.mock('../../src/components/ResponsiveFooter/FooterDesktop', () => () => (
  <div>Desktop footer</div>
));
jest.mock('../../src/components/ResponsiveFooter/FooterTablet', () => () => (
  <div>Tablet footer</div>
));
jest.mock('../../src/components/ResponsiveFooter/FooterMobile', () => () => (
  <div>Mobile footer</div>
));

describe('ResponsiveFooter', () => {
  it('should mount all breakpoint variants for CSS to select', () => {
    render(<Footer />);

    expect(screen.getByText('Desktop footer')).toBeInTheDocument();
    expect(screen.getByText('Tablet footer')).toBeInTheDocument();
    expect(screen.getByText('Mobile footer')).toBeInTheDocument();
  });
});
