jest.mock('../../../src/components/CohortModal/utils', () => ({
  downloadCohortManifest: jest.fn(() => Promise.resolve()),
  downloadCohortMetadata: jest.fn(() => Promise.resolve()),
}));

import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DownloadSelectedCohort from '../../../src/pages/CohortAnalyzer/downloadCohort/DownloadSelectedCohorts';
import {
  downloadCohortManifest,
  downloadCohortMetadata,
} from '../../../src/components/CohortModal/utils';

describe('DownloadSelectedCohort', () => {
  it('should download manifest and metadata from the results menu', async () => {
    render(
      <DownloadSelectedCohort
        isSelected
        queryVariable={{ participant_pk: ['pk-1'] }}
      />,
    );
    fireEvent.click(screen.getByText('Download Results'));
    fireEvent.click(screen.getByText('Manifest CSV'));
    await act(async () => { await Promise.resolve(); });
    expect(downloadCohortManifest).toHaveBeenCalled();
    fireEvent.click(screen.getByText('Download Results'));
    fireEvent.click(screen.getByText('Metadata JSON'));
    await act(async () => { await Promise.resolve(); });
    expect(downloadCohortMetadata).toHaveBeenCalled();
  });

  it('should not open the menu when nothing is selected', () => {
    render(<DownloadSelectedCohort isSelected={false} queryVariable={{}} />);
    fireEvent.click(screen.getByText('Download Results'));
    expect(screen.queryByText('Manifest CSV')).not.toBeInTheDocument();
  });
});
