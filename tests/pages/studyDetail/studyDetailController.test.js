import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useQuery } from '@apollo/client';
import StudyDetailController from '../../../src/pages/studyDetail/studyDetailController';
import { GET_STUDY_DETAIL_DATA_QUERY } from '../../../src/bento/studyDetailData';
import { studyDetail } from '../../fixtures/studies/studyDetail';

jest.mock('@apollo/client', () => ({
  useQuery: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useParams: () => ({ studyId: 'phs002790' }),
}));

jest.mock('../../../src/components/Wrappers/Wrappers', () => ({
  Typography: ({ children }) => <div>{children}</div>,
}));

jest.mock('../../../src/pages/studyDetail/studyDetailView', () => ({ data }) => (
  <div>Study detail: {data.study_id}</div>
));

describe('StudyDetailController', () => {
  describe('Rendering', () => {
    it('should show a progress indicator while loading', () => {
      useQuery.mockReturnValue({ loading: true });

      render(<StudyDetailController />);

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should request and render the selected study', () => {
      useQuery.mockReturnValue({
        loading: false,
        error: undefined,
        data: { studyDetails: studyDetail },
      });

      render(<StudyDetailController />);

      expect(useQuery).toHaveBeenCalledWith(GET_STUDY_DETAIL_DATA_QUERY, {
        variables: { study_id: 'phs002790' },
      });
      expect(screen.getByText('Study detail: phs002790')).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('should render an API error', () => {
      useQuery.mockReturnValue({
        loading: false,
        error: new Error('service unavailable'),
      });

      render(<StudyDetailController />);

      expect(screen.getByText(/service unavailable/i)).toBeInTheDocument();
    });

    it('should render a wrong-data message when study details are absent', () => {
      useQuery.mockReturnValue({ loading: false, data: {} });

      render(<StudyDetailController />);

      expect(screen.getByText('Recieved wrong data')).toBeInTheDocument();
    });
  });
});
