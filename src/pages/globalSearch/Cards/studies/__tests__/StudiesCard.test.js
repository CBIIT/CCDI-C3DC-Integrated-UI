import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import StudiesCard from '../StudiesCard';

describe('StudiesCard', () => {
  it('renders Study ID as a link to the study detail page', () => {
    render(
      <MemoryRouter>
        <StudiesCard
          data={{
            study_id: 'phs123456',
            study_name: 'Test Study',
            study_status: 'Active',
            num_of_participants: 10,
            num_of_files: 20,
          }}
        />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: 'phs123456' }).getAttribute('href')).toBe('/studies/phs123456');
  });
});
