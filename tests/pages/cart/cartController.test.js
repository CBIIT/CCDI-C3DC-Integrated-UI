jest.mock('../../../src/utils/graphqlClient', () => ({
  query: jest.fn(),
}));

jest.mock('@bento-core/cart', () => ({
  CartContextProvider: ({ children }) => children,
  onDeleteAllCartFile: jest.fn(() => ({ type: 'DELETE_ALL' })),
  onDeleteCartFile: jest.fn((id) => ({ type: 'DELETE', payload: id })),
}));

jest.mock('@bento-core/paginated-table', () => ({
  ...jest.requireActual('@bento-core/paginated-table'),
  TableContextProvider: ({ children }) => children,
}));

jest.mock('../../../src/pages/cart/cartView', () => jest.fn(() => <div>Cart view</div>));

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import CartController from '../../../src/pages/cart/cartController';
import CartView from '../../../src/pages/cart/cartView';
import { table } from '../../../src/bento/fileCentricCartWorkflowData';
import { onDeleteAllCartFile, onDeleteCartFile } from '@bento-core/cart';
import { cartFileIds } from '../../fixtures/cart/cartFiles';

function cartStore(filesId) {
  return createStore(() => ({
    cartReducer: { filesId },
  }));
}

describe('CartController', () => {
  beforeEach(() => {
    CartView.mockClear();
    onDeleteAllCartFile.mockClear();
    onDeleteCartFile.mockClear();
  });

  describe('Rendering', () => {
    it('should pass Redux cart file IDs and table config into CartView', () => {
      render(
        <Provider store={cartStore(cartFileIds)}>
          <CartController />
        </Provider>,
      );

      expect(screen.getByText('Cart view')).toBeInTheDocument();
      expect(CartView).toHaveBeenCalledWith(
        expect.objectContaining({
          filesId: cartFileIds,
          config: table,
        }),
        expect.anything(),
      );
    });
  });

  describe('Interactions', () => {
    it('should delete one file by row id and delete all files', () => {
      render(
        <Provider store={cartStore(cartFileIds)}>
          <CartController />
        </Provider>,
      );

      const props = CartView.mock.calls[0][0];
      props.deleteCartFile({ id: 'file-9' });
      props.deleteAllFiles();

      expect(onDeleteCartFile).toHaveBeenCalledWith('file-9');
      expect(onDeleteAllCartFile).toHaveBeenCalled();
    });
  });
});
