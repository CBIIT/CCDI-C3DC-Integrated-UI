import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SupportingDataView from '../../../src/pages/studyDetail/supportingData/supportingDataView';
import { studyDetail } from '../../fixtures/studies/studyDetail';

describe('SupportingDataView', () => {
  beforeAll(() => {
    global.MutationObserver = class MutationObserver {
      observe() {}

      disconnect() {}
    };
  });

  describe('Rendering', () => {
    it('should render repository labels, external links, and property tables', () => {
      render(<SupportingDataView data={studyDetail} />);

      expect(screen.getByText('Imaging Data Commons (IDC)')).toBeInTheDocument();
      expect(screen.getByText('The Cancer Imaging Archive (TCIA)')).toBeInTheDocument();
      expect(screen.getByText('collection name')).toBeInTheDocument();
      expect(screen.getByText('IDC collection')).toBeInTheDocument();
      expect(screen.getByText('Data unavailable at this time')).toBeInTheDocument();

      const idcLink = screen.getByText('Imaging Data Commons (IDC)')
        .closest('div')
        .querySelector('a');
      expect(idcLink).toHaveAttribute(
        'href',
        'https://portal.imaging.datacommons.cancer.gov/explore/',
      );
      fireEvent.click(idcLink);
    });
  });

  describe('Edge cases', () => {
    it('should treat missing supporting data as unavailable repositories', () => {
      render(<SupportingDataView data={{}} />);

      expect(screen.getAllByText('Data unavailable at this time')).toHaveLength(2);
    });
  });
});
