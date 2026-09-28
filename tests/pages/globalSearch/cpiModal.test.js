jest.mock('../../../src/pages/globalSearch/Cards/participant/ReduxAddFile', () => () => (
  <div>Add file button</div>
));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import CPIModal from '../../../src/pages/globalSearch/Cards/participant/CPIModal';

describe('CPIModal', () => {
  beforeAll(() => {
    global.MutationObserver = class MutationObserver {
      observe() {}

      disconnect() {}
    };
    window.URL.createObjectURL = jest.fn(() => 'blob:csv');
  });

  it('should list alternative identifiers and download a CSV', () => {
    const click = jest.fn();
    const onClose = jest.fn();
    jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(click);

    render(
      <MemoryRouter>
        <CPIModal
          open
          onClose={onClose}
          row={{
            participant_id: 'PART-1',
            id: 'pid-1',
            study_id: 'phs1',
            cpi_data: [{
              associated_id: 'alt-1',
              data_type: 'internal',
              p_id: 'p1',
              domain: 'CBIIT',
            }],
          }}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText('DOWNLOAD')).toBeInTheDocument();
    fireEvent.click(screen.getAllByText('DOWNLOAD')[0]);
    expect(click).toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /VIEW IN EXPLORE/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it('should close, select mapped identifiers, and open cart actions', () => {
    const onClose = jest.fn();
    render(
      <MemoryRouter>
        <CPIModal
          open
          onClose={onClose}
          row={{
            participant_id: 'PART-1',
            id: 'pid-1',
            study_id: 'phs1',
            cpi_data: [{
              associated_id: 'alt-1',
              data_type: 'internal',
              p_id: 'p1',
              domain: 'CBIIT',
              repository_of_synonym_id: 'repo',
              domain_description: 'desc, with comma',
              domain_category: 'cat',
              data_location: 'https://example.org',
            }, {
              associated_id: 'alt-2',
              data_type: 'external',
              p_id: 'p2',
            }],
          }}
        />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByLabelText('close'));
    expect(onClose).toHaveBeenCalled();

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    fireEvent.click(checkboxes[1]);
    fireEvent.click(checkboxes[0]);

    fireEvent.click(screen.getByRole('button', { name: /ADD TO OR GO TO CART/i }));
    expect(screen.getAllByText('Add file button').length).toBeGreaterThan(0);
    fireEvent.click(screen.getByText('GO TO CART'));
  });
});
