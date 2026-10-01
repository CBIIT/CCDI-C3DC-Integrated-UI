import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Anchor from '../../src/utils/Anchor';

const classes = { link: 'link-class' };

describe('src/utils/Anchor', () => {
  it('should render an external anchor for scheme URLs', () => {
    render(
      <Anchor link="https://example.com/path" text="Example" classes={classes} />,
    );
    const a = screen.getByRole('link', { name: 'Example' });
    expect(a).toHaveAttribute('href', 'https://example.com/path');
    expect(a).toHaveAttribute('target', '_blank');
  });

  it('should render an internal router link for path URLs', () => {
    render(
      <MemoryRouter>
        <Anchor link="/about" text="About" classes={classes} />
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
  });
});
