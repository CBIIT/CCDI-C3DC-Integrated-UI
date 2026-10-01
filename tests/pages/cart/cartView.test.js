import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CartView from '../../../src/pages/cart/cartView';

const mockTableView = jest.fn(() => <div>Cart table</div>);
let wrapperProps;

jest.mock('@bento-core/paginated-table', () => ({
  TableView: (props) => mockTableView(props),
}));

jest.mock('../../../src/pages/cart/cartWrapper', () => (props) => {
  wrapperProps = props;
  return <div>{props.children}</div>;
});

jest.mock('../../../src/pages/cart/tableConfig/Column', () => ({
  configColumn: jest.fn(() => ['configured column']),
}));

describe('CartView', () => {
  const config = {
    api: 'CART_QUERY',
    dataKey: 'files',
    columns: [{ dataField: 'file_name' }],
    tableMsg: 'No files',
    paginationAPIField: 'fileList',
    defaultSortField: 'file_name',
    defaultSortDirection: 'asc',
    extendedViewConfig: {},
  };

  beforeEach(() => {
    mockTableView.mockClear();
    wrapperProps = undefined;
  });

  describe('Rendering', () => {
    it('should pass cart file IDs to the wrapper and table', () => {
      render(<CartView config={config} filesId={['file-1', 'file-2']} />);

      expect(screen.getByText('Cart table')).toBeInTheDocument();
      expect(wrapperProps.queryVariables).toEqual({
        file_ids: ['file-1', 'file-2'],
      });
      expect(mockTableView).toHaveBeenCalledWith(
        expect.objectContaining({
          queryVariables: { file_ids: ['file-1', 'file-2'] },
          totalRowCount: 2,
        }),
      );
    });

    it('should configure the cart table state', () => {
      render(<CartView config={config} />);
      const tableProps = mockTableView.mock.calls[0][0];

      expect(tableProps.initState({ persisted: true })).toEqual(
        expect.objectContaining({
          persisted: true,
          title: 'myFiles',
          query: 'CART_QUERY',
          columns: ['configured column'],
          rowsPerPage: 50,
          page: 0,
        }),
      );
    });
  });
});
