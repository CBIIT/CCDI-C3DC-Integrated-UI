import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StudyDetailView from '../../../src/pages/studyDetail/studyDetailView';
import {
  studyDetail,
  studyDetailWithoutSupportingData,
} from '../../fixtures/studies/studyDetail';

jest.mock('../../../src/pages/studyDetail/overview/overviewView', () => ({ data }) => (
  <div>Overview for {data.study_id}</div>
));

jest.mock(
  '../../../src/pages/studyDetail/supportingData/supportingDataView',
  () => ({ data }) => <div>Supporting data for {data.study_id}</div>,
);

describe('StudyDetailView', () => {
  describe('Rendering', () => {
    it('should render study links, participant count, and the overview', () => {
      render(<StudyDetailView data={studyDetail} />);

      expect(screen.getByText('Study Code phs002790')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'phs002790' })).toHaveAttribute(
        'href',
        expect.stringContaining('study_id=phs002790'),
      );
      expect(screen.getByRole('link', { name: '1,234' })).toHaveAttribute(
        'href',
        '/exploreParticipants?dbgap_accession=phs002790',
      );
      expect(screen.getByText('Overview for phs002790')).toBeInTheDocument();
    });
  });

  describe('Supporting data', () => {
    it('should switch between overview and supporting data', () => {
      render(<StudyDetailView data={studyDetail} />);

      fireEvent.click(screen.getByRole('button', { name: 'Supporting Data' }));
      expect(screen.getByText('Supporting data for phs002790')).toBeInTheDocument();
      expect(screen.queryByText('Overview for phs002790')).not.toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: 'Overview' }));
      expect(screen.getByText('Overview for phs002790')).toBeInTheDocument();
    });

    it('should hide the supporting-data tab when no records exist', () => {
      render(<StudyDetailView data={studyDetailWithoutSupportingData} />);

      expect(
        screen.queryByRole('button', { name: 'Supporting Data' }),
      ).not.toBeInTheDocument();
    });
  });
});
