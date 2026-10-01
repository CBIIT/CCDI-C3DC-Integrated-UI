jest.mock('../../../src/bento/studiesData', () => ({
  studyDownloadLinks: { phsTEST001: 'https://example.com/manifest.xlsx' },
  openDoubleLink: jest.fn(),
}));

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { cellTypes, headerTypes } from '@bento-core/table';
import {
  CustomCellView,
  configColumn,
} from '../../../src/pages/inventory/tabs/tableConfig/Column';
import { openDoubleLink } from '../../../src/bento/studiesData';

describe('Explore table Column', () => {
  it('should attach custom cell and header renderers', () => {
    const out = configColumn([
      { id: 'c1', cellType: cellTypes.CUSTOM_ELEM, dataField: 'x' },
      { id: 'c2', dataField: 'y' },
      { id: 'h1', headerType: headerTypes.CUSTOM_ELEM, dataField: 'x' },
    ]);
    expect(typeof out[0].customCellRender).toBe('function');
    expect(out[1].customCellRender).toBeUndefined();
    expect(typeof out[2].customColHeaderRender).toBe('function');
  });

  it('should render default, dbGaP, transform, expand, modal, download, and cohort cells', () => {
    const { unmount } = render(<CustomCellView dataField="study" study="phs001" />);
    expect(screen.getByText('phs001')).toBeInTheDocument();
    unmount();

    render(<CustomCellView dataField="dbgap_accession" cellStyle="DBGAP" dbgap_accession="phs002431" />);
    expect(screen.getByRole('link', { name: /phs002431/i })).toHaveAttribute('href', expect.stringContaining('phs002431'));
  });

  it('should toggle expand cells with more than five lines', () => {
    const lines = Array.from({ length: 7 }, (_, i) => `Line ${i + 1}`);
    render(<CustomCellView dataField="notes" cellStyle="EXPAND" notes={lines} />);
    fireEvent.click(screen.getByText(/read more/i));
    expect(screen.getByText(/read less/i)).toBeInTheDocument();
  });

  it('should render TRANSFORM html and short EXPAND lists', () => {
    const { unmount } = render(
      <CustomCellView
        dataField="html"
        cellStyle="TRANSFORM"
        html="<p>Formatted</p>"
        dataFormatter={(val) => `<strong>${val}</strong>`}
      />,
    );
    expect(screen.getByText('Formatted')).toBeInTheDocument();
    unmount();
    render(<CustomCellView dataField="notes" cellStyle="EXPAND" notes={['A', 'B']} />);
    expect(screen.queryByText(/read more/i)).not.toBeInTheDocument();
  });

  it('should open a modal for more than five ids and skip empty values', () => {
    const ids = Array.from({ length: 8 }, (_, i) => `ID-${i}`);
    const { unmount } = render(
      <CustomCellView
        dataField="sample_id"
        cellStyle="MODAL"
        header="Sample IDs"
        sample_id={`[${ids.join(', ')}]`}
      />,
    );
    fireEvent.click(screen.getByText(/view all/i));
    expect(screen.getByText('Sample IDs')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('close'));
    unmount();

    const { container } = render(
      <CustomCellView dataField="sample_id" cellStyle="MODAL" sample_id="" />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('should render array and scalar modal ids, external links, and study download', () => {
    const { unmount } = render(
      <CustomCellView dataField="ages" cellStyle="MODAL" ages={[1, 2, null]} />,
    );
    expect(screen.getByText('1')).toBeInTheDocument();
    unmount();

    render(<CustomCellView dataField="n" cellStyle="MODAL" n={7} />);
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('should render http and relative links', () => {
    const { unmount } = render(
      <CustomCellView
        label="NIH"
        linkAttr={{ rootPath: 'https://example.com/', linkField: 'id' }}
        id="abc"
      />,
    );
    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://example.com/abc');
    unmount();
    render(
      <CustomCellView
        label="Rel"
        linkAttr={{ rootPath: '/studies/' }}
      />,
    );
    expect(screen.getByRole('link')).toHaveAttribute('href', '/studies/Rel');
  });

  it('should trigger study manifest download and render cohort chips', () => {
    const { unmount } = render(
      <CustomCellView dataField="study_id" cellStyle="STUDY_DOWNLOAD" study_id="phsTEST001" />,
    );
    fireEvent.click(screen.getByTitle('Download study manifest'));
    expect(openDoubleLink).toHaveBeenCalled();
    unmount();

    const { container } = render(
      <CustomCellView
        dataField="cohort"
        label={[{ cohort: 'A', color: '#ff0000' }]}
      />,
    );
    expect(container.querySelectorAll('div').length).toBeGreaterThan(0);
    unmount();
    const empty = render(<CustomCellView dataField="cohort" label={null} />);
    expect(empty.container).toBeEmptyDOMElement();
  });
});
