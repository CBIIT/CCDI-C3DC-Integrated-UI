import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import SamplesCard from '../../../src/pages/globalSearch/Cards/samples/SamplesCard';
import ModelsCard from '../../../src/pages/globalSearch/Cards/models/ModelsCard';
import { mockTitleTruncation } from '../../helpers/mockTitleTruncation';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('SamplesCard and ModelsCard', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('should render sample fields and navigate to the participant explorer', () => {
    render(
      <MemoryRouter>
        <SamplesCard
          data={{
            sample_id: 'S1',
            participant_id: 'P1',
            study_id: 'phs1',
            sample_anatomic_site_str: 'Blood',
            sample_tumor_status: 'Tumor',
            diagnosis_str: 'Leukemia',
            tumor_spatial_extent: 'Localized',
            diagnosis_category_str: 'Hematologic',
          }}
        />
      </MemoryRouter>,
    );
    expect(screen.getByText('S1')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /VIEW IN EXPLORE/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/exploreParticipants?p_id=P1&tab=2');
  });

  it('should render model properties and navigate to the data model', () => {
    render(
      <MemoryRouter>
        <ModelsCard
          data={{
            property: 'age_at_diagnosis',
            value: '4',
            property_description: 'Age in days',
            node: 'diagnosis',
            category_type: 'clinical',
          }}
        />
      </MemoryRouter>,
    );
    expect(screen.getByText('age_at_diagnosis')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /GO TO DATA MODEL NAVIGATOR/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/data-model');
  });

  it('should expand a long diagnosis category and resize the card', () => {
    const restore = mockTitleTruncation();
    const longCategory = 'Hematologic neoplasm category '.repeat(8);
    render(
      <MemoryRouter>
        <SamplesCard
          data={{
            sample_id: 'very-long-sample-identifier-for-truncation',
            participant_id: '',
            diagnosis_category_str: longCategory,
          }}
        />
      </MemoryRouter>,
    );
    fireEvent.resize(window);
    const expander = document.querySelector('[class*="expandToggle"]');
    if (expander) {
      fireEvent.click(expander);
    }
    expect(screen.getByText(/Diagnosis Category/i)).toBeInTheDocument();
    restore();
  });
});
