import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import ValueCard from '../../../src/pages/globalSearch/Cards/ValueCard';

jest.mock('@bento-core/util', () => ({
  prepareLinks: (properties) => properties,
}));

describe('ValueCard', () => {
  it('should render the model value and property fields', () => {
    render(
      <MemoryRouter>
        <ValueCard
          data={{
            value: 'short',
            node_name: 'diagnosis',
            property_name: 'age',
            property_description: 'Age in days',
          }}
          index={0}
        />
      </MemoryRouter>,
    );
    expect(screen.getByText(/MODEL:/)).toBeInTheDocument();
    expect(screen.getByText('diagnosis')).toBeInTheDocument();
  });
});
