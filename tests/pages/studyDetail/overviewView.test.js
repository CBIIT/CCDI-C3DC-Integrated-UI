import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import OverviewView from '../../../src/pages/studyDetail/overview/overviewView';
import { studyDetail } from '../../fixtures/studies/studyDetail';

jest.mock('@bento-core/tool-tip/dist/ToolTip', () => ({ children }) => (
  <span>{children}</span>
));

jest.mock('../../../src/pages/studyDetail/overview/tabs/TabsView', () => ({ data }) => (
  <div>Profile tabs for {data.study_id}</div>
));

jest.mock('../../../src/bento/studiesData', () => ({
  studyDownloadLinks: {
    phs002790: 'https://example.org/manifest.xlsx',
  },
  studycBioPortalLinks: {
    phs002790: 'https://cbioportal.ccdi.cancer.gov/study/summary?id=phs002790',
    phs000463: 'https://cbioportal.ccdi.cancer.gov/study/summary?id=openpedcan_v15',
    phs999: 'https://cbioportal.ccdi.cancer.gov/study/summary?id=other-study',
    invalid: 'not-a-url',
  },
  studyClinicalDataLinks: {
    phs002790: [
      'https://example.org/files/very-long-clinical-data-file-name-that-should-be-truncated.xlsx',
    ],
    phs000463: [
      'https://example.org/files/short.xlsx',
    ],
  },
}));

describe('OverviewView', () => {
  describe('Rendering', () => {
    it('should render study metadata, counts, downloads, and publications', () => {
      render(<OverviewView data={studyDetail} />);

      expect(screen.getByText('dbGaP Accession')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /phs002790/i })).toHaveAttribute(
        'href',
        expect.stringContaining('study_id=phs002790'),
      );
      expect(screen.getAllByText(studyDetail.study_name).length).toBeGreaterThan(0);
      expect(screen.getByText(studyDetail.study_description)).toBeInTheDocument();
      expect(screen.getByText('1,234')).toBeInTheDocument();
      expect(screen.getByText('2,345')).toBeInTheDocument();
      expect(screen.getByText('3,456')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Study Manifest/i })).toHaveAttribute(
        'href',
        'https://example.org/manifest.xlsx',
      );
      expect(screen.getByText(/Source File -/)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Molecular Characterization Initiative/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /PMID:12345678/i })).toHaveAttribute(
        'href',
        'https://pubmed.ncbi.nlm.nih.gov/12345678',
      );
      expect(screen.getByText('Profile tabs for phs002790')).toBeInTheDocument();
    });
  });

  describe('Consent codes and publications', () => {
    it('should parse JSON consent codes and show N/A when there are no publications', () => {
      render(
        <OverviewView
          data={{
            ...studyDetail,
            consent_codes: '["GRU","MDS"]',
            pubmed_ids: '[]',
          }}
        />,
      );

      expect(screen.getByRole('link', { name: /GRU/ })).toHaveAttribute(
        'href',
        'https://www.ncbi.nlm.nih.gov/gap/docs/submissionguide/#consentgloss',
      );
      expect(screen.getByRole('link', { name: /MDS/ })).toBeInTheDocument();
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    it('should parse semicolon-separated consent codes and pubmed IDs', () => {
      render(
        <OverviewView
          data={{
            ...studyDetail,
            consent_codes: 'GRU; HMB',
            pubmed_ids: '111;222',
          }}
        />,
      );

      expect(screen.getByRole('link', { name: /PMID:111/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /PMID:222/i })).toBeInTheDocument();
    });

    it('should hide consent and download sections when those values are absent', () => {
      render(
        <OverviewView
          data={{
            ...studyDetail,
            study_id: 'unknown-study',
            consent_codes: null,
            pubmed_ids: '',
          }}
        />,
      );

      expect(screen.queryByText('Consent Codes:')).not.toBeInTheDocument();
      expect(screen.queryByText('File Downloads:')).not.toBeInTheDocument();
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    it('should recover consent codes and pubmed IDs from malformed bracketed strings', () => {
      render(
        <OverviewView
          data={{
            ...studyDetail,
            consent_codes: '[GRU; MDS]',
            pubmed_ids: '[123;456]',
          }}
        />,
      );

      expect(screen.getByRole('link', { name: /GRU/ })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /MDS/ })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /PMID:123/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /PMID:456/i })).toBeInTheDocument();
    });

    it('should parse JSON pubmed IDs and quoted consent codes', () => {
      render(
        <OverviewView
          data={{
            ...studyDetail,
            consent_codes: '[[GRU]]',
            pubmed_ids: '["999"]',
          }}
        />,
      );

      expect(screen.getByRole('link', { name: /GRU/ })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /PMID:999/i })).toBeInTheDocument();
    });

    it('should label known and unknown cBioPortal study links', () => {
      const { rerender } = render(
        <OverviewView data={{ ...studyDetail, study_id: 'phs000463' }} />,
      );
      expect(screen.getByRole('link', { name: /Open Pediatric Cancer Project v15/i })).toBeInTheDocument();
      expect(screen.getByText(/Source File - short.xlsx/)).toBeInTheDocument();

      rerender(<OverviewView data={{ ...studyDetail, study_id: 'phs999' }} />);
      expect(screen.getByRole('link', { name: /other-study/i })).toBeInTheDocument();

      rerender(<OverviewView data={{ ...studyDetail, study_id: 'invalid' }} />);
      expect(screen.getByRole('link', { name: /View Study/i })).toBeInTheDocument();
    });
  });
});
