jest.mock('@bento-core/tool-tip', () => ({ children }) => children);

jest.mock('../../../src/pages/globalSearch/Cards/participant/WrapperService', () => ({
  getFilesID: jest.fn(),
}));

import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CPIFilesView, { ToolTipView } from '../../../src/pages/globalSearch/Cards/participant/CPIFilesView/CPIFilesView';
import { getFilesID } from '../../../src/pages/globalSearch/Cards/participant/WrapperService';

describe('CPIFilesView', () => {
  beforeEach(() => {
    global.MutationObserver = class MutationObserver {
      observe() {}

      disconnect() {}
    };
    getFilesID.mockReset();
  });

  it('should confirm adding all files for a participant', async () => {
    getFilesID.mockReturnValue(() => Promise.resolve({ fileIDsFromList: ['f1', 'f1'] }));
    const addFiles = jest.fn();
    const setOpenSnackbar = jest.fn();
    const onOptionClick = jest.fn();

    render(
      <CPIFilesView
        title="ADD ALL FILES FOR PARTICIPANT"
        btnType="ADD_ALL_FILES"
        clsName="add_all_button"
        section="header"
        addFiles={addFiles}
        setAlterDisplay={jest.fn()}
        setOpenSnackbar={setOpenSnackbar}
        client={{}}
        cartFiles={[]}
        participantIds={[{ data_type: 'internal', p_id: 'p1' }, { data_type: 'external' }]}
        rowID="pid-1"
        onOptionClick={onOptionClick}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /ADD ALL FILES FOR PARTICIPANT/i }));
    expect(onOptionClick).toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.getByText(/Are you sure to add All Files/i)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Yes'));
    expect(addFiles).toHaveBeenCalledWith(['f1']);
    expect(setOpenSnackbar).toHaveBeenCalledWith(true);
  });

  it('should show the cart-full alert when the limit would be exceeded', async () => {
    getFilesID.mockReturnValue(() => Promise.resolve({
      fileIDsFromList: new Array(10).fill('new-file'),
    }));
    const setAlterDisplay = jest.fn();
    render(
      <CPIFilesView
        title="ADD SELECTED FILES FOR PARTICIPANT"
        btnType="ADD_SELECTED_FILES"
        clsName="add_selected_button"
        section="header"
        addFiles={jest.fn()}
        setAlterDisplay={setAlterDisplay}
        setOpenSnackbar={jest.fn()}
        client={{}}
        cartFiles={new Array(200000).fill('x')}
        participantIds={['p1']}
        rowID="pid-1"
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /ADD SELECTED FILES FOR PARTICIPANT/i }));
    await waitFor(() => {
      expect(setAlterDisplay).toHaveBeenCalledWith(true);
    });
  });

  it('should disable selected-file add when nothing is selected and render a tooltip', () => {
    render(
      <>
        <CPIFilesView
          title="ADD SELECTED FILES FOR PARTICIPANT"
          btnType="ADD_SELECTED_FILES"
          clsName="add_selected_button"
          participantIds={[]}
          cartFiles={[]}
        />
        <ToolTipView
          section="header"
          tooltipCofig={{
            src: 'icon.svg',
            alt: 'hint',
            tooltipText: 'Add files',
          }}
        />
      </>,
    );
    expect(screen.getByRole('button', { name: /ADD SELECTED FILES FOR PARTICIPANT/i })).toBeDisabled();
    expect(screen.getByAltText('hint')).toBeInTheDocument();
  });
});
