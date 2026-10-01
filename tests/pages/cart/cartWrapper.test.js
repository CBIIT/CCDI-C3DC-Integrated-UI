jest.mock('../../../src/utils/graphqlClient', () => ({
  query: jest.fn(),
}));

jest.mock('@bento-core/paginated-table', () => ({
  ...jest.requireActual('@bento-core/paginated-table'),
  Wrapper: ({ children, section }) => (
    <div>
      Wrapper {section}
      {children}
    </div>
  ),
}));

jest.mock('@bento-core/cart', () => {
  const React = require('react');
  return {
    CartContext: React.createContext(null),
    setCartConfig: jest.fn((config) => ({ type: 'SET_CART_CONFIG', payload: config })),
  };
});

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CartContext, setCartConfig } from '@bento-core/cart';
import CartWrapper from '../../../src/pages/cart/cartWrapper';
import { cartFileIds } from '../../fixtures/cart/cartFiles';

describe('CartWrapper', () => {
  beforeAll(() => {
    global.MutationObserver = class MutationObserver {
      observe() {}

      disconnect() {}
    };
  });
  describe('Side effects', () => {
    it('should dispatch cart download config and render children', async () => {
      const dispatch = jest.fn();
      const queryVariables = { file_ids: cartFileIds };

      render(
        <CartContext.Provider value={{ context: { dispatch } }}>
          <CartWrapper classes={{}} queryVariables={queryVariables}>
            <span>table</span>
          </CartWrapper>
        </CartContext.Provider>,
      );

      expect(screen.getByText('Wrapper myFiles')).toBeInTheDocument();
      expect(screen.getByText('table')).toBeInTheDocument();
      await waitFor(() => {
        expect(setCartConfig).toHaveBeenCalledWith(expect.objectContaining({
          queryVariables,
          manifestFileName: expect.any(String),
        }));
      });
      expect(dispatch).toHaveBeenCalled();
    });
  });
});
