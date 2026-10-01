import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AboutView from '../../src/pages/about/AboutView';
import DataModelNavigator from '../../src/pages/dmn/DataModelNavigator';

describe('Static content pages', () => {
  describe('AboutView', () => {
    it('should render the page sections, images, and contact link', () => {
      render(<AboutView />);

      expect(screen.getByText(/About the Childhood Cancer/i)).toBeInTheDocument();
      expect(screen.getByText('Childhood Cancer Data Initiative')).toBeInTheDocument();
      expect(screen.getByText('Citing the C3DC')).toBeInTheDocument();
      expect(screen.getByText('Questions for C3DC?')).toBeInTheDocument();
      expect(screen.getAllByRole('img', { name: 'about_img' })).toHaveLength(2);
      expect(
        screen.getByRole('link', {
          name: 'ncichildhoodcancerdatainitiative@mail.nih.gov',
        }),
      ).toHaveAttribute(
        'href',
        'mailto:ncichildhoodcancerdatainitiative@mail.nih.gov',
      );
    });

    it('should mark external resource links to open in a new tab', () => {
      render(<AboutView />);

      expect(
        screen.getByRole('link', { name: /NCI’s Childhood Cancer Data Initiative/i }),
      ).toHaveAttribute('target', '_blank');
    });
  });

  describe('DataModelNavigator', () => {
    it('should embed the configured data model navigator with restricted permissions', () => {
      render(<DataModelNavigator />);

      const frame = screen.getByTitle('Data Model Navigator');
      expect(frame).toHaveAttribute('src', expect.stringContaining('data-model-navigator'));
      expect(frame).toHaveAttribute(
        'sandbox',
        'allow-popups allow-scripts allow-same-origin allow-downloads',
      );
    });
  });
});
