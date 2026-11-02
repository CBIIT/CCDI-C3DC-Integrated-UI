import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import '@testing-library/jest-dom';
import PdfReader from '../../../src/pages/pdfReader/pdfReader';
import { pdfList } from '../../../src/bento/aboutPageData';

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route path="*" element={<PdfReader />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('PdfReader', () => {
  describe('Rendering', () => {
    it('should embed the release notes PDF for /release-notes-pdf', () => {
      renderAt('/release-notes-pdf');

      const frame = screen.getByTitle('C3DC Release Notes PDF');
      expect(frame).toHaveAttribute('src', pdfList['release-notes-pdf']);
    });

    it('should embed the user guide PDF for /user-guide', () => {
      renderAt('/user-guide');

      const frame = screen.getByTitle('C3DC User Guide PDF');
      expect(frame).toHaveAttribute('src', pdfList['user-guide']);
    });

    it('should embed the release notes PDF when the path has a trailing slash', () => {
      renderAt('/release-notes-pdf/');

      const frame = screen.getByTitle('C3DC Release Notes PDF');
      expect(frame).toHaveAttribute('src', pdfList['release-notes-pdf']);
    });
  });

  describe('Edge cases', () => {
    it('should redirect unknown PDF routes to home', () => {
      renderAt('/unknown-pdf');

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.queryByTitle(/PDF/)).not.toBeInTheDocument();
    });
  });
});
