jest.mock('../../../src/pages/CohortAnalyzer/downloads/cohortAnalyzerDownloadAll', () => ({
  buildRawCohortChartTabularRows: jest.fn(() => [['h'], ['r']]),
  formatRowsAsTsv: jest.fn(() => 'tsv'),
  formatRowsAsCsv: jest.fn(() => 'csv'),
  downloadTextFile: jest.fn(),
  downloadJsonPayload: jest.fn(),
  downloadChartAreaAsPng: jest.fn(() => Promise.resolve()),
  downloadChartAreaAsPdf: jest.fn(() => Promise.resolve()),
}));

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  downloadChartAreaAsPdf,
  downloadChartAreaAsPng,
  downloadJsonPayload,
  downloadTextFile,
} from '../../../src/pages/CohortAnalyzer/downloads/cohortAnalyzerDownloadAll';
import { CohortAnalyzerDownloadAllDropdown } from '../../../src/pages/CohortAnalyzer/components/CohortAnalyzerDownloadAllDropdown';

const classes = {
  downloadAllDropdownRoot: '',
  downloadAllTrigger: '',
  downloadAllTriggerLabel: '',
  downloadAllChevron: '',
  downloadAllMenu: '',
  downloadAllMenuItem: '',
};

describe('CohortAnalyzerDownloadAllDropdown', () => {
  it('should export json and csv payloads', () => {
    render(
      <CohortAnalyzerDownloadAllDropdown
        classes={classes}
        disabled={false}
        chartAreaRef={{ current: document.createElement('div') }}
        getExportPayload={() => ({ charts: [] })}
      />,
    );
    fireEvent.click(screen.getByText('DOWNLOAD ALL'));
    fireEvent.click(screen.getByRole('menuitem', { name: 'JSON' }));
    expect(downloadJsonPayload).toHaveBeenCalled();
    fireEvent.click(screen.getByText('DOWNLOAD ALL'));
    fireEvent.click(screen.getByRole('menuitem', { name: 'CSV' }));
    expect(downloadTextFile).toHaveBeenCalled();
  });

  it('should export TSV, PNG, and PDF formats', () => {
    const chartArea = document.createElement('div');
    render(
      <CohortAnalyzerDownloadAllDropdown
        classes={classes}
        disabled={false}
        chartAreaRef={{ current: chartArea }}
        getExportPayload={() => ({ histogram: { fetchedData: {} } })}
      />,
    );
    ['TSV', 'PNG', 'PDF'].forEach((label) => {
      fireEvent.click(screen.getByText('DOWNLOAD ALL'));
      fireEvent.click(screen.getByRole('menuitem', { name: label }));
    });
    expect(downloadTextFile).toHaveBeenCalledWith(
      'tsv',
      expect.stringContaining('.tsv'),
      expect.any(String),
    );
    expect(downloadChartAreaAsPng).toHaveBeenCalledWith(
      chartArea,
      expect.stringContaining('.png'),
    );
    expect(downloadChartAreaAsPdf).toHaveBeenCalledWith(
      chartArea,
      expect.stringContaining('.pdf'),
    );
  });

  it('should keep the menu closed while disabled', () => {
    render(
      <CohortAnalyzerDownloadAllDropdown
        classes={classes}
        disabled
        chartAreaRef={{ current: null }}
        getExportPayload={() => ({})}
      />,
    );
    fireEvent.click(screen.getByText('DOWNLOAD ALL'));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});
