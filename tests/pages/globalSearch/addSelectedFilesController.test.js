jest.mock('../../../src/pages/globalSearch/table/ContextProvider', () => {
  const React = require('react');
  return { TableContext: React.createContext({ context: { selectedRows: [], dispatch: () => {} } }) };
}, { virtual: true });

jest.mock('../../../src/pages/globalSearch/Cards/WrapperService', () => ({
  getFilesID: jest.fn(),
}), { virtual: true });

jest.mock('../../../src/pages/globalSearch/table/state/Actions', () => ({
  onRowSeclect: (rows) => ({ type: 'SELECT', rows }),
}), { virtual: true });

jest.mock('@bento-core/cart', () => ({
  onAddCartFiles: (files) => ({ type: 'ADD', files }),
}));

jest.mock('@bento-core/tool-tip', () => ({ children }) => children);

import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { TableContext } from '../../../src/pages/globalSearch/table/ContextProvider';
import { getFilesID } from '../../../src/pages/globalSearch/Cards/WrapperService';
import AddSelectedFilesController from '../../../src/pages/globalSearch/Cards/files/AddSelectedFiles/AddSelectedFilesController';
import AddSelectedFilesView, { ToolTipView } from '../../../src/pages/globalSearch/Cards/files/AddSelectedFiles/AddSelectedFilesView';

describe('AddSelectedFilesController', () => {
  beforeEach(() => {
    getFilesID.mockReset();
    global.MutationObserver = class MutationObserver {
      observe() {}

      disconnect() {}
    };
  });

  it('should add unique selected files and clear the table selection', async () => {
    getFilesID.mockReturnValue(() => Promise.resolve({ fileIds: ['a', 'a', 'b'] }));
    const store = createStore(() => ({}));
    const addDispatch = jest.spyOn(store, 'dispatch');
    const tableDispatch = jest.fn();
    render(
      <Provider store={store}>
        <TableContext.Provider value={{ context: { selectedRows: ['row-1'], dispatch: tableDispatch } }}>
          <AddSelectedFilesController
            clsName="add"
            section="files"
            addFileQuery={{}}
            responseKeys={['fileIds']}
            dataKey="file_id"
            setOpenSnackbar={jest.fn()}
            setAlterDisplay={jest.fn()}
            client={{}}
            cartFiles={[]}
            title="Add Selected Files"
          />
        </TableContext.Provider>
      </Provider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Add Selected Files' }));
    await waitFor(() => {
      expect(addDispatch).toHaveBeenCalled();
      expect(tableDispatch).toHaveBeenCalled();
    });
  });

  it('should show the cart-full alert when the cart is already at the limit', async () => {
    getFilesID.mockReturnValue(() => Promise.resolve({ fileIds: ['a'] }));
    const setAlterDisplay = jest.fn();
    render(
      <Provider store={createStore(() => ({}))}>
        <TableContext.Provider value={{ context: { selectedRows: ['row-1'], dispatch: jest.fn() } }}>
          <AddSelectedFilesController
            clsName="add"
            section="files"
            addFileQuery={{}}
            responseKeys={['fileIds']}
            dataKey="file_id"
            setOpenSnackbar={jest.fn()}
            setAlterDisplay={setAlterDisplay}
            client={{}}
            cartFiles={new Array(200000).fill('x')}
            title="Add Selected Files"
          />
        </TableContext.Provider>
      </Provider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Add Selected Files' }));
    await waitFor(() => {
      expect(setAlterDisplay).toHaveBeenCalledWith(true);
    });
  });

  it('should add files when duplicates keep the cart under the limit', async () => {
    getFilesID.mockReturnValue(() => Promise.resolve({ fileIds: ['keep', 'dup'] }));
    const store = createStore(() => ({}));
    const addDispatch = jest.spyOn(store, 'dispatch');
    const tableDispatch = jest.fn();
    const cartFiles = new Array(199998).fill('old').concat(['dup']);
    render(
      <Provider store={store}>
        <TableContext.Provider value={{ context: { selectedRows: ['row-1'], dispatch: tableDispatch } }}>
          <AddSelectedFilesController
            clsName="add"
            section="files"
            addFileQuery={{}}
            responseKeys={['fileIds']}
            dataKey="file_id"
            setOpenSnackbar={jest.fn()}
            setAlterDisplay={jest.fn()}
            client={{}}
            cartFiles={cartFiles}
            title="Add Selected Files"
          />
        </TableContext.Provider>
      </Provider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Add Selected Files' }));
    await waitFor(() => {
      expect(addDispatch).toHaveBeenCalled();
    });
  });

  it('should show the cart-full alert when adding unique files would exceed the limit', async () => {
    getFilesID.mockReturnValue(() => Promise.resolve({ fileIds: ['new-a', 'new-b'] }));
    const setAlterDisplay = jest.fn();
    render(
      <Provider store={createStore(() => ({}))}>
        <TableContext.Provider value={{ context: { selectedRows: ['row-1'], dispatch: jest.fn() } }}>
          <AddSelectedFilesController
            clsName="add"
            section="files"
            addFileQuery={{}}
            responseKeys={['fileIds']}
            dataKey="file_id"
            setOpenSnackbar={jest.fn()}
            setAlterDisplay={setAlterDisplay}
            client={{}}
            cartFiles={new Array(199999).fill('old')}
            title="Add Selected Files"
          />
        </TableContext.Provider>
      </Provider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Add Selected Files' }));
    await waitFor(() => {
      expect(setAlterDisplay).toHaveBeenCalledWith(true);
    });
  });

  it('should treat a missing response key as an empty file list', async () => {
    getFilesID.mockReturnValue(() => Promise.resolve({}));
    const addDispatch = jest.fn();
    const store = createStore(() => ({}));
    jest.spyOn(store, 'dispatch').mockImplementation(addDispatch);
    render(
      <Provider store={store}>
        <TableContext.Provider value={{ context: { selectedRows: ['row-1'], dispatch: jest.fn() } }}>
          <AddSelectedFilesController
            clsName="add"
            section="files"
            addFileQuery={{}}
            responseKeys={['fileIds']}
            dataKey="file_id"
            setOpenSnackbar={jest.fn()}
            setAlterDisplay={jest.fn()}
            client={{}}
            cartFiles={[]}
            title="Add Selected Files"
          />
        </TableContext.Provider>
      </Provider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Add Selected Files' }));
    await waitFor(() => {
      expect(addDispatch).toHaveBeenCalled();
    });
  });

  it('should disable the button with no rows selected and render a tooltip', () => {
    render(
      <>
        <AddSelectedFilesView
          eventHandler={jest.fn()}
          title="Add Selected Files"
          clsName="add"
          disabled
          tooltipCofig={{ src: 'icon.svg', alt: 'hint', tooltipText: 'help' }}
          classes={{ customTooltip: 'tip', customArrow: 'arrow' }}
        />
        <ToolTipView
          section="files"
          classes={{ customTooltip: 'tip', customArrow: 'arrow' }}
          tooltipCofig={{ icon: 'icon.svg', alt: 'files', files: 'section hint' }}
        />
      </>,
    );
    expect(screen.getByRole('button', { name: 'Add Selected Files' })).toBeDisabled();
    expect(screen.getByAltText('hint')).toBeInTheDocument();
    expect(screen.getByAltText('files')).toBeInTheDocument();
  });
});
