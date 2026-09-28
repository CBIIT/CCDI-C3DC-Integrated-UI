import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { cellTypes, headerTypes } from '@bento-core/table';
import {
  configColumn,
  CustomCellView,
  CustomHeaderCellView,
} from '../../../../src/pages/cart/tableConfig/Column';

describe('cart table Column', () => {
  describe('Rendering', () => {
    it('should strip square brackets from participant and sample IDs', () => {
      const { rerender } = render(
        <CustomCellView dataField="participant_id" label="[PART-001]" />,
      );
      expect(screen.getByText('PART-001')).toBeInTheDocument();

      rerender(<CustomCellView dataField="sample_id" label="[S1]" />);
      expect(screen.getByText('S1')).toBeInTheDocument();
    });

    it('should render other fields as-is', () => {
      render(<CustomCellView dataField="file_name" label="readme.txt" />);
      expect(screen.getByText('readme.txt')).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('should leave empty labels unchanged', () => {
      const { container } = render(
        <CustomCellView dataField="participant_id" label="" />,
      );
      expect(container.textContent).toBe('');
    });

    it('should render an empty custom header', () => {
      const { container } = render(<CustomHeaderCellView />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('configColumn', () => {
    it('should wire custom cells, row delete, and bulk delete', () => {
      const deleteAllFiles = jest.fn();
      const deleteCartFile = jest.fn();
      const configured = configColumn({
        columns: [
          {
            dataField: 'participant_id',
            display: true,
            cellType: cellTypes.CUSTOM_ELEM,
          },
          {
            cellType: cellTypes.DELETE,
            headerType: headerTypes.DELETE,
            display: true,
          },
        ],
        deleteAllFiles,
        deleteCartFile,
      });

      render(configured[0].customCellRender({
        dataField: 'participant_id',
        label: '[X]',
      }));
      expect(screen.getByText('X')).toBeInTheDocument();

      configured[1].cellEventHandler({ id: 'row-1' });
      configured[1].headerEventHandler();
      expect(deleteCartFile).toHaveBeenCalledWith({ id: 'row-1' });
      expect(deleteAllFiles).toHaveBeenCalled();
    });

    it('should hide undisplayed columns and keep custom headers', () => {
      const configured = configColumn({
        columns: [
          { dataField: 'file_name', display: true },
          { dataField: 'hidden_field', display: false },
          {
            dataField: 'notes',
            display: true,
            headerType: headerTypes.CUSTOM_ELEM,
          },
        ],
        deleteAllFiles: jest.fn(),
        deleteCartFile: jest.fn(),
      });

      expect(configured).toHaveLength(2);
      expect(configured[0].customCellRender).toBeUndefined();

      const { container } = render(configured[1].customColHeaderRender({}));
      expect(container.firstChild).toBeNull();
    });
  });
});
