jest.mock('../../../src/bento/studiesData', () => ({
  studyDownloadLinks: { phs123456: 'https://example.org/manifest.xlsx' },
  openDoubleLink: jest.fn(),
}));

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import StudiesCard from '../../../src/pages/globalSearch/Cards/studies/StudiesCard';
import { openDoubleLink } from '../../../src/bento/studiesData';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('StudiesCard actions', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    openDoubleLink.mockClear();
    window.open = jest.fn();
  });

  it('should view the study, download a manifest, and open cBioPortal', () => {
    render(
      <MemoryRouter>
        <StudiesCard
          data={{
            study_id: 'phs123456',
            study_name: 'Test Study',
            study_phase: 'Active',
            num_of_participants: 10,
            num_of_files: 20,
            consent_codes: ['GRU'],
          }}
        />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: /AVAILABLE ACTIONS/i }));
    fireEvent.click(screen.getByText('VIEW STUDY'));
    expect(mockNavigate).toHaveBeenCalledWith('/studies/phs123456');
    fireEvent.click(screen.getByText('DOWNLOAD MANIFEST'));
    expect(openDoubleLink).toHaveBeenCalled();
    fireEvent.click(screen.getByText('CCDI CBioPortal'));
    expect(window.open).toHaveBeenCalledWith('https://cbioportal.ccdi.cancer.gov/', '_blank');
    fireEvent.mouseDown(document.body);
    expect(screen.queryByText('VIEW STUDY')).not.toBeInTheDocument();
  });

  it('should warn when a study has no download link', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <MemoryRouter>
        <StudiesCard
          data={{
            study_id: 'phs-missing',
            study_name: 'Missing Manifest',
            consent_codes: [],
          }}
        />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole('button', { name: /AVAILABLE ACTIONS/i }));
    fireEvent.click(screen.getByText('DOWNLOAD MANIFEST'));
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});
