jest.mock('../../../../../src/pages/cart/customComponent/exportButton/exportButton', () => (
  (props) => <div>Export view {JSON.stringify(props.filesId)}</div>
));

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import ExportButtonController from '../../../../../src/pages/cart/customComponent/exportButton/exportButtonController';
import { cartFileIds } from '../../../../fixtures/cart/cartFiles';

describe('ExportButtonController', () => {
  describe('Rendering', () => {
    it('should pass cart file IDs from Redux into the export view', () => {
      const store = createStore(() => ({
        cartReducer: { filesId: cartFileIds },
      }));

      render(
        <Provider store={store}>
          <ExportButtonController />
        </Provider>,
      );

      expect(screen.getByText(`Export view ${JSON.stringify(cartFileIds)}`)).toBeInTheDocument();
    });
  });
});
