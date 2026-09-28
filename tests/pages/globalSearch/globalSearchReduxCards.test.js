import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { MemoryRouter } from 'react-router-dom';
import FilesCardRedux from '../../../src/pages/globalSearch/Cards/files/FilesCardRedux';
import ParticipantCardRedux from '../../../src/pages/globalSearch/Cards/participant/ParticipantCardRedux';
import ReduxAddFile from '../../../src/pages/globalSearch/Cards/participant/ReduxAddFile';

jest.mock('@apollo/client', () => ({
  useApolloClient: () => ({ query: jest.fn() }),
}));

jest.mock('../../../src/pages/globalSearch/Cards/files/FilesCard', () => (props) => (
  <div>Files {JSON.stringify(props.cartFiles)}</div>
));
jest.mock('../../../src/pages/globalSearch/Cards/participant/ParticipantCard', () => (props) => (
  <div>Participant {props.alertMessage ? 'ready' : ''}</div>
));
jest.mock('../../../src/pages/globalSearch/Cards/participant/AddFiles', () => () => (
  <div>Add files view</div>
));
jest.mock('../../../src/pages/globalSearch/Cards/participant/Snackbar/Snackbar', () => () => null);
jest.mock('../../../src/pages/globalSearch/Cards/participant/AddToCartDialog/AddToCartDialogAlertView', () => () => null);

jest.mock('@bento-core/cart', () => ({
  onAddCartFiles: (files) => ({ type: 'ADD', files }),
}));

function cartStore() {
  return createStore(() => ({
    cartReducer: { filesId: ['f1'], count: 1, alreadyInCartCount: 0 },
  }));
}

describe('Redux card wrappers', () => {
  it('should pass cart state into files, participant, and add-file views', () => {
    const store = cartStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <FilesCardRedux data={{}} />
          <ParticipantCardRedux data={{}} />
          <ReduxAddFile />
        </MemoryRouter>
      </Provider>,
    );
    expect(screen.getByText(/Files \["f1"\]/)).toBeInTheDocument();
    expect(screen.getByText('Participant ready')).toBeInTheDocument();
    expect(screen.getByText('Add files view')).toBeInTheDocument();
  });
});
