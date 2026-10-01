jest.mock('@bento-core/cart', () => ({
  formatCartAddMessage: (added, existing) => `added ${added} existing ${existing}`,
  getCartAddCounts: (cartFiles, ids) => ({
    addedCount: cartFiles.includes(ids[0]) ? 0 : 1,
    alreadyInCartCount: cartFiles.includes(ids[0]) ? 1 : 0,
  }),
}));

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import FilesCard from '../../../src/pages/globalSearch/Cards/files/FilesCard';
import { mockTitleTruncation } from '../../helpers/mockTitleTruncation';

describe('FilesCard', () => {
  it('should add a file to the cart', () => {
    const addFiles = jest.fn();
    render(
      <MemoryRouter>
        <FilesCard
          data={{
            id: 'file-1',
            file_name: 'sample.bam',
            data_category: '[Genomics]',
            participant_id: 'P1',
            file_description: 'BAM',
            study_id: 'phs1',
            file_type: 'bam',
            sample_id: 'S1',
            file_size: 1024,
          }}
          addFiles={addFiles}
          cartFiles={[]}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText('sample.bam')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Add to Cart/i }));
    expect(addFiles).toHaveBeenCalledWith(['file-1']);
  });

  const baseData = {
    id: 'file-1',
    file_name: 'sample.bam',
    data_category: '[Genomics]',
    participant_id: 'P1, P2',
    file_description: 'BAM',
    study_id: 'phs1',
    file_type: 'bam',
    sample_id: 'S1,S2',
    file_size: 0,
  };

  it('should show an info toast when the file is already in the cart', () => {
    render(
      <MemoryRouter>
        <FilesCard data={baseData} addFiles={jest.fn()} cartFiles={['file-1']} />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole('button', { name: /Add to Cart/i }));
    expect(screen.getByText('added 0 existing 1')).toBeInTheDocument();
  });

  it('should warn when the cart is full and skip add when addFiles is missing', () => {
    const { rerender } = render(
      <MemoryRouter>
        <FilesCard data={baseData} addFiles={jest.fn()} cartFiles={new Array(200000).fill('x')} />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole('button', { name: /Add to Cart/i }));
    expect(screen.getByText(/Cart limit reached/i)).toBeInTheDocument();

    rerender(
      <MemoryRouter>
        <FilesCard data={{ ...baseData, participant_id: '', file_size: 2048 }} />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole('button', { name: /Add to Cart/i }));
    expect(screen.getByText('sample.bam')).toBeInTheDocument();
  });

  it('should expand truncated participant and sample lists', () => {
    const restore = mockTitleTruncation();
    const longIds = Array.from({ length: 40 }, (_, i) => `PARTICIPANT-${i}`).join(',');
    render(
      <MemoryRouter>
        <FilesCard
          data={{ ...baseData, participant_id: longIds, sample_id: longIds }}
          addFiles={jest.fn()}
        />
      </MemoryRouter>,
    );
    const expanders = document.querySelectorAll('[class*="expandToggle"]');
    if (expanders.length) {
      fireEvent.click(expanders[0]);
    }
    expect(screen.getByText(/Participant:/i)).toBeInTheDocument();
    restore();
  });

  it('should format array participant ids in the explore link and show file size', () => {
    render(
      <MemoryRouter>
        <FilesCard
          data={{
            ...baseData,
            participant_id: 'P1, P2',
            file_size: 1500,
          }}
          addFiles={jest.fn()}
        />
      </MemoryRouter>,
    );
    expect(screen.getByRole('button', { name: 'sample.bam' })).toHaveAttribute(
      'href',
      '/exploreParticipants?p_id=P1|P2',
    );
    expect(screen.getByText(/1\.5 KB/i)).toBeInTheDocument();
  });

  it('should expand a long sample list after a tablet-width resize', () => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: 800 });
    const longIds = Array.from({ length: 40 }, (_, i) => `SAMPLE-${i}`).join(',');
    render(
      <MemoryRouter>
        <FilesCard
          data={{ ...baseData, sample_id: longIds }}
          addFiles={jest.fn()}
        />
      </MemoryRouter>,
    );
    fireEvent(window, new Event('resize'));
    const expanders = document.querySelectorAll('[class*="expandToggle"]');
    expect(expanders.length).toBeGreaterThan(0);
    fireEvent.click(expanders[expanders.length - 1]);
    fireEvent.click(expanders[expanders.length - 1]);
  });
});
