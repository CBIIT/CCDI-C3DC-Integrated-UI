import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import AboutCard from '../../../src/pages/globalSearch/Cards/AboutCard';

describe('AboutCard', () => {
  describe('Rendering', () => {
    it('should highlight matching text and link to the about page', () => {
      render(
        <MemoryRouter>
          <AboutCard
            searchText="cancer"
            data={{
              title: 'About CCDI',
              text: ['Childhood $cancer$ research.', 'More detail,'],
              page: '/about',
            }}
            index={0}
          />
        </MemoryRouter>,
      );

      expect(screen.getByText('ABOUT')).toBeInTheDocument();
      expect(screen.getByText('About CCDI')).toBeInTheDocument();
      expect(screen.getByText('cancer')).toBeInTheDocument();
      expect(screen.getByRole('link')).toHaveAttribute('href', '/about');
    });
  });

  describe('Edge cases', () => {
    it('should render external page URLs and skip highlighting when search text is empty', () => {
      render(
        <AboutCard
          searchText="  "
          data={{
            title: 'External',
            text: ['Plain text.'],
            page: 'https://example.org/about',
          }}
          index={1}
        />,
      );
      expect(screen.getByRole('link')).toHaveAttribute('href', 'https://example.org/about');
    });
  });
});
