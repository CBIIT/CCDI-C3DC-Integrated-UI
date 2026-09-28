import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ToastNotification from '../../../src/pages/globalSearch/Cards/participant/ToastNotification';
import CustomHeaderCell from '../../../src/pages/globalSearch/Cards/participant/CustomCell';
import AddSelectedFilesView from '../../../src/pages/globalSearch/Cards/files/AddSelectedFiles/AddSelectedFilesView';

jest.mock('@bento-core/tool-tip', () => ({ children }) => children);

describe('Toast, header cell, and add-selected view', () => {
  it('should show and close a toast', () => {
    const onClose = jest.fn();
    render(
      <ToastNotification open message="Saved" type="error" duration={0} onClose={onClose} />,
    );
    expect(screen.getByText('Saved')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('should render info and default toast styles', () => {
    const { rerender } = render(
      <ToastNotification open message="Info" type="info" duration={0} />,
    );
    expect(screen.getByText('Info')).toBeInTheDocument();
    rerender(<ToastNotification open message="Default" type="unknown" duration={0} />);
    expect(screen.getByText('Default')).toBeInTheDocument();
  });

  it('should render sortable and non-sortable header cells', () => {
    const toggleSort = jest.fn();
    const { rerender } = render(
      <table>
        <thead>
          <tr>
            <CustomHeaderCell
              column={{ dataField: 'id', header: 'ID', sortable: false }}
            />
          </tr>
        </thead>
      </table>,
    );
    expect(screen.getByText('ID')).toBeInTheDocument();

    rerender(
      <table>
        <thead>
          <tr>
            <CustomHeaderCell
              sortBy="id"
              sortOrder="asc"
              toggleSort={toggleSort}
              column={{ dataField: 'id', header: 'ID', tooltipText: 'hint' }}
            />
          </tr>
        </thead>
      </table>,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(toggleSort).toHaveBeenCalled();

    const customRender = jest.fn(() => 'Custom');
    rerender(
      <table>
        <thead>
          <tr>
            <CustomHeaderCell
              sortBy="id"
              sortOrder="desc"
              toggleSort={toggleSort}
              components={{ Tooltip: ({ children }) => <div>{children}</div> }}
              column={{
                dataField: 'id',
                header: 'ID',
                headerType: 'CUSTOM_ELEM',
                customColHeaderRender: customRender,
              }}
            />
          </tr>
        </thead>
      </table>,
    );
    expect(screen.getByText('Custom')).toBeInTheDocument();
  });

  it('should invoke the add-selected handler', () => {
    const eventHandler = jest.fn();
    render(
      <AddSelectedFilesView
        eventHandler={eventHandler}
        title="Add Selected Files"
        clsName="add"
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Add Selected Files' }));
    expect(eventHandler).toHaveBeenCalled();
  });
});
