/**
 * Card title truncation — short-title, narrow, and start...end branches.
 */

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import StudiesCard from '../../../src/pages/globalSearch/Cards/studies/StudiesCard';
import SamplesCard from '../../../src/pages/globalSearch/Cards/samples/SamplesCard';
import ModelsCard from '../../../src/pages/globalSearch/Cards/models/ModelsCard';
import FilesCard from '../../../src/pages/globalSearch/Cards/files/FilesCard';
import AboutCard from '../../../src/pages/globalSearch/Cards/AboutCard';
import ValueCard from '../../../src/pages/globalSearch/Cards/ValueCard';
import { enableTitleTruncationMocks } from '../../helpers/globalSearchCardTestUtils';

jest.mock('@bento-core/util', () => ({
  prepareLinks: (properties) => properties,
}));

jest.mock('../../../src/bento/studiesData', () => ({
  studyDownloadLinks: {},
  openDoubleLink: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(() => jest.fn()),
}));

const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

const triggerLongTitleTruncation = (cardEl) => {
  const helper = enableTitleTruncationMocks({
    containerWidth: 400,
    measuredTitleWidth: 220,
  });
  helper.setCardWidth(cardEl);
  helper.triggerResize();
  return helper;
};

const triggerNarrowTruncation = (cardEl) => {
  const helper = enableTitleTruncationMocks({
    containerWidth: 40,
    measuredTitleWidth: 4000,
  });
  helper.setCardWidth(cardEl);
  helper.triggerResize();
  return helper;
};

describe('Global Search — card title truncation branches', () => {
  beforeEach(() => {
    global.MutationObserver = class {
      observe() {}
      disconnect() {}
      takeRecords() { return []; }
    };
  });

  describe('StudiesCard', () => {
    it('should keep a short study id when the measured title fits', () => {
      const studyId = `phsSTUDY-${'A'.repeat(40)}`;
      const { container } = renderWithRouter(
        <StudiesCard data={{ study_id: studyId, consent_codes: [] }} />,
      );
      Object.defineProperty(container.firstChild, 'offsetWidth', {
        configurable: true,
        value: 800,
      });
      fireEvent(window, new Event('resize'));
      expect(screen.getByRole('link', { name: studyId })).toBeInTheDocument();
    });

    it('should produce a start...end study title when the long-truncation branch applies', () => {
      const longId = `phsSTUDY-${'A'.repeat(40)}-MID-${'B'.repeat(40)}-END`;
      const { container } = renderWithRouter(
        <StudiesCard data={{ study_id: longId, consent_codes: [] }} />,
      );
      const truncation = triggerLongTitleTruncation(container.firstChild);
      const link = container.querySelector('a[href*="/studies/"]');
      expect(link.textContent).toMatch(/\.\.\./);
      truncation.restore();
    });

    it('should use a short prefix ellipsis when the card is very narrow', () => {
      const longId = `phsSTUDY-${'A'.repeat(80)}`;
      const { container } = renderWithRouter(
        <StudiesCard data={{ study_id: longId, consent_codes: [] }} />,
      );
      const truncation = triggerNarrowTruncation(container.firstChild);
      expect(container.querySelector('a').textContent).toMatch(/\.\.\.$/);
      truncation.restore();
    });
  });

  describe('SamplesCard', () => {
    it('should produce a start...end sample id when the long-truncation branch applies', () => {
      const longSample = `SMP-${'X'.repeat(80)}-END`;
      const { container } = renderWithRouter(
        <SamplesCard data={{ sample_id: longSample, participant_id: 'P1' }} />,
      );
      const truncation = triggerLongTitleTruncation(container.firstChild);
      expect(container.textContent).toMatch(/SMP.*\.\.\./);
      truncation.restore();
    });
  });

  describe('ModelsCard', () => {
    it('should produce a start...end model value when the long-truncation branch applies', () => {
      const longValue = `model-${'Z'.repeat(80)}-end`;
      const { container } = renderWithRouter(
        <ModelsCard data={{ value: longValue, property: 'age' }} />,
      );
      const truncation = triggerLongTitleTruncation(container.firstChild);
      expect(container.textContent).toMatch(/model-.*\.\.\./);
      truncation.restore();
    });
  });

  describe('FilesCard', () => {
    it('should produce a start...end file title with a participant', () => {
      const longName = `file_${'Q'.repeat(60)}.cram`;
      const { container } = renderWithRouter(
        <FilesCard
          data={{
            id: 'f1',
            file_name: longName,
            participant_id: 'P1',
            sample_id: 'S1',
            data_category: '[Genomics]',
            file_description: 'BAM',
            file_type: 'bam',
            file_size: 1024,
          }}
          addFiles={jest.fn()}
          cartFiles={[]}
        />,
      );
      const truncation = triggerLongTitleTruncation(container.firstChild);
      expect(container.textContent).toMatch(/file_.*\.\.\./);
      truncation.restore();
    });

    it('should produce a start...end file title without a participant', () => {
      const { container } = renderWithRouter(
        <FilesCard
          data={{
            id: 'f1',
            file_name: `nopart_${'P'.repeat(60)}.bam`,
            participant_id: '',
            sample_id: '',
            data_category: '[Genomics]',
            file_description: 'BAM',
            file_type: 'bam',
            file_size: 1024,
          }}
          addFiles={jest.fn()}
          cartFiles={[]}
        />,
      );
      const truncation = triggerLongTitleTruncation(container.firstChild);
      expect(container.textContent).toMatch(/nopart_.*\.\.\./);
      truncation.restore();
    });

    it('should expand a long sample id and update the max length on resize', () => {
      Object.defineProperty(window, 'innerWidth', {
        configurable: true,
        writable: true,
        value: 800,
      });
      const longSample = `[${'SAMPLE-LONG-'.repeat(12)}SAMPLE-END]`;
      const { container } = renderWithRouter(
        <FilesCard
          data={{
            id: 'f1',
            file_name: 'a.bam',
            sample_id: longSample,
            participant_id: 'P1',
            data_category: '[Genomics]',
            file_description: 'BAM',
            file_type: 'bam',
            file_size: 1024,
          }}
          addFiles={jest.fn()}
          cartFiles={[]}
        />,
      );
      const expandToggles = container.querySelectorAll('[class*="expandToggle"]');
      const sampleToggle = expandToggles[expandToggles.length - 1];
      fireEvent.click(sampleToggle);
      expect(container.textContent).toMatch(/SAMPLE-END/);

      Object.defineProperty(window, 'innerWidth', {
        configurable: true,
        writable: true,
        value: 1500,
      });
      fireEvent(window, new Event('resize'));
      expect(container.textContent).toMatch(/Sample:/);
    });
  });

  describe('AboutCard', () => {
    it('should truncate a long about title and skip highlighting empty fragments', () => {
      const longTitle = `About ${'C'.repeat(80)} Hub`;
      const { container } = renderWithRouter(
        <AboutCard
          searchText="(cancer)"
          data={{ title: longTitle, text: [], page: '/about' }}
          index={0}
        />,
      );
      const truncation = triggerLongTitleTruncation(container.firstChild);
      expect(container.textContent).toMatch(/About .*\.\.\./);
      truncation.restore();
    });
  });

  describe('ValueCard', () => {
    it('should truncate a long model value', () => {
      const longValue = `val-${'Z'.repeat(80)}-end`;
      const { container } = renderWithRouter(
        <ValueCard data={{ value: longValue, node_name: 'diagnosis' }} index={0} />,
      );
      const truncation = triggerLongTitleTruncation(container.firstChild);
      expect(container.textContent).toMatch(/val-.*\.\.\./);
      truncation.restore();
    });
  });
});
