import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DataAvailabilityCell from '../../../src/pages/studies/tableConfig/DataAvailabilityCell';
import DataAvailabilityHeader from '../../../src/pages/studies/tableConfig/DataAvailabilityHeader';
import {
  configColumn,
  CustomCellView,
} from '../../../src/pages/studies/tableConfig/Column';

const mockOpenDoubleLink = jest.fn();

jest.mock('../../../src/bento/studiesData', () => ({
  studyDownloadLinks: {
    phs001: 'https://example.org/manifests/My%20Manifest.xlsx',
  },
  openDoubleLink: (...args) => mockOpenDoubleLink(...args),
}));

jest.mock('@bento-core/table', () => ({
  cellTypes: { CUSTOM_ELEM: 'CUSTOM_ELEM' },
  headerTypes: { CUSTOM_ELEM: 'CUSTOM_ELEM' },
}));

beforeAll(() => {
  global.MutationObserver = class MutationObserver {
    observe() {}

    disconnect() {}
  };
  document.createRange = () => ({
    setStart: () => {},
    setEnd: () => {},
    commonAncestorContainer: document.body,
  });
});

describe('Studies data availability', () => {
  it('should render icons only for available data while preserving empty slots', () => {
    const { container } = render(
      <DataAvailabilityCell
        customCellData={{
          fields: ['study_files', 'participant_files', 'sample_files', 'publications'],
          width: '420px',
        }}
        study_files={2}
        participant_files={3}
        sample_files={0}
        publications={1}
      />,
    );

    expect(screen.getByRole('img', { name: 'Participant Files' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Study Files' })).toBeInTheDocument();
    expect(screen.queryByRole('img', { name: 'Sample Files' })).not.toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Publications' })).toBeInTheDocument();
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(1);
    expect(container.querySelector('[style*="width: 420px"]')).toBeInTheDocument();
  });

  it('should render empty availability slots when configuration is missing', () => {
    const { container } = render(<DataAvailabilityCell />);

    expect(screen.queryAllByRole('img')).toHaveLength(0);
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(4);
  });

  it('should show the count and label in an icon tooltip', async () => {
    render(
      <DataAvailabilityCell
        customCellData={{ fields: ['study_files', 'participant_files'] }}
        study_files={0}
        participant_files={12}
      />,
    );

    fireEvent.mouseOver(screen.getByRole('img', { name: 'Participant Files' }));
    expect(await screen.findByText('12')).toBeInTheDocument();
    expect(await screen.findByText('Participant File(s)')).toBeInTheDocument();
  });

  it('should explain all availability icons from the column header', async () => {
    render(<DataAvailabilityHeader />);

    expect(screen.getByText('Data Availability')).toBeInTheDocument();
    fireEvent.mouseOver(screen.getByRole('img', { name: 'Info' }));

    expect(await screen.findByText('View available data counts:')).toBeInTheDocument();
    expect(screen.getByText('Participant Files')).toBeInTheDocument();
    expect(screen.getByText('Sample Files')).toBeInTheDocument();
    expect(screen.getByText('Study Files')).toBeInTheDocument();
    expect(screen.getByText('Publications')).toBeInTheDocument();
  });
});

describe('Studies table column renderers', () => {
  beforeEach(() => {
    mockOpenDoubleLink.mockClear();
  });

  it('should transform configured cell content', () => {
    render(
      <CustomCellView
        cellStyle="TRANSFORM"
        dataField="description"
        description="value"
        dataFormatter={(value) => `<strong>${value.toUpperCase()}</strong>`}
      />,
    );

    expect(screen.getByText('VALUE')).toBeInTheDocument();
  });

  it('should expand and collapse lists longer than five values', () => {
    const { container } = render(
      <CustomCellView
        cellStyle="EXPAND"
        dataField="values"
        values={['one', 'two', 'three', 'four', 'five', 'six']}
      />,
    );

    expect(screen.queryByText('six')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Read More'));
    expect(container).toHaveTextContent('six');
    fireEvent.click(screen.getByText('Read Less'));
    expect(container).not.toHaveTextContent('six');
  });

  it('should render short lists without an expansion action', () => {
    const { container } = render(
      <CustomCellView
        cellStyle="EXPAND"
        dataField="values"
        values={['one', 'two']}
      />,
    );

    expect(container).toHaveTextContent('one');
    expect(container).toHaveTextContent('two');
    expect(screen.queryByText('Read More')).not.toBeInTheDocument();
  });

  it('should link a study ID to dbGaP', () => {
    render(
      <CustomCellView cellStyle="DBGAP" dataField="study_id" study_id="phs001" />,
    );

    expect(screen.getByRole('link', { name: 'phs001' })).toHaveAttribute(
      'href',
      expect.stringContaining('study_id=phs001'),
    );
  });

  it('should download the configured study manifest', () => {
    const { container } = render(
      <CustomCellView
        cellStyle="STUDY_DOWNLOAD"
        dataField="study_id"
        study_id="phs001"
      />,
    );

    fireEvent.click(container.querySelector('svg'));
    expect(mockOpenDoubleLink).toHaveBeenCalledWith(
      'https://example.org/manifests/My%20Manifest.xlsx',
      'My Manifest.xlsx',
    );
  });

  it('should use the default manifest filename when no URL is configured', () => {
    const { container } = render(
      <CustomCellView
        cellStyle="STUDY_DOWNLOAD"
        dataField="study_id"
        study_id="phs999"
      />,
    );

    fireEvent.click(container.querySelector('svg'));
    expect(mockOpenDoubleLink).toHaveBeenCalledWith(
      undefined,
      'phs999_CCDI_DCC_Study_Manifest.xlsx',
    );
  });

  it('should add missing custom cell and header renderers without replacing existing ones', () => {
    const existingRenderer = jest.fn();
    const columns = configColumn([
      { id: 'custom', cellType: 'CUSTOM_ELEM', headerType: 'CUSTOM_ELEM' },
      { id: 'existing', cellType: 'CUSTOM_ELEM', customCellRender: existingRenderer },
      { id: 'plain', cellType: 'TEXT' },
    ]);

    expect(columns[0].customCellRender).toEqual(expect.any(Function));
    expect(columns[0].customColHeaderRender).toEqual(expect.any(Function));
    expect(columns[1].customCellRender).toBe(existingRenderer);
    expect(columns[2]).toEqual({ id: 'plain', cellType: 'TEXT' });

    render(columns[0].customCellRender({
      cellStyle: 'DBGAP',
      dataField: 'study_id',
      study_id: 'phs002',
    }));
    render(columns[0].customColHeaderRender({}));
    expect(screen.getByRole('link', { name: 'phs002' })).toBeInTheDocument();
  });
});
