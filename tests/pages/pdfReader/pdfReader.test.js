import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PdfReader from '../../../src/pages/pdfReader/pdfReader';
import { pdfList } from '../../../src/bento/aboutPageData';

describe('PdfReader', () => {
  const originalHref = window.location.href;

  afterEach(() => {
    window.history.replaceState({}, '', originalHref);
  });

  describe('Rendering', () => {
    it('should embed the release notes PDF for /release-notes-pdf', () => {
      window.history.replaceState({}, '', '/release-notes-pdf');
      render(<PdfReader />);

      const frame = screen.getByTitle('C3DC Release Notes PDF');
      expect(frame).toHaveAttribute('src', pdfList['release-notes-pdf']);
    });

    it('should embed the user guide PDF for /user-guide', () => {
      window.history.replaceState({}, '', '/user-guide');
      render(<PdfReader />);

      expect(screen.getByTitle('C3DC Release Notes PDF')).toHaveAttribute(
        'src',
        pdfList['user-guide'],
      );
    });
  });

  describe('Edge cases', () => {
    it('should render an empty iframe src for unknown PDF routes', () => {
      window.history.replaceState({}, '', '/unknown-pdf');
      render(<PdfReader />);

      expect(screen.getByTitle('C3DC Release Notes PDF').getAttribute('src') || '').toBe('');
    });
  });
});
