import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import PropertyItem from '../../../src/pages/globalSearch/Cards/PropertyItem';

describe('PropertyItem', () => {
  describe('Rendering', () => {
    it('should render a label and value', () => {
      render(<PropertyItem label="Program ID" value="NCT1" index={0} />);
      expect(screen.getByText('Program ID:')).toBeInTheDocument();
      expect(screen.getByText('NCT1')).toBeInTheDocument();
    });

    it('should render external and internal links', () => {
      const { rerender } = render(
        <PropertyItem
          label="Docs"
          value="Guide"
          link="https://example.org/guide"
          index={0}
        />,
      );
      expect(screen.getByRole('link', { name: 'Guide' })).toHaveAttribute(
        'href',
        'https://example.org/guide',
      );

      rerender(
        <MemoryRouter>
          <PropertyItem label="Study" value="phs1" link="/studies/phs1" index={1} />
        </MemoryRouter>,
      );
      expect(screen.getByRole('link', { name: 'phs1' })).toHaveAttribute('href', '/studies/phs1');
    });

    it('should render a linked label', () => {
      render(
        <PropertyItem
          label="dbGaP"
          labelLink="https://www.ncbi.nlm.nih.gov"
          value="phs1"
          index={0}
        />,
      );
      expect(screen.getByRole('link', { name: 'dbGaP' })).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('should hide the row when the value is empty', () => {
      const { container } = render(<PropertyItem label="Empty" value="" index={0} />);
      expect(container).not.toHaveTextContent('Empty');
    });
  });
});
