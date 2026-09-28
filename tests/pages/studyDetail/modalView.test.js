import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ModalView from '../../../src/pages/studyDetail/overview/modal/ModalView';
import { studyDetail } from '../../fixtures/studies/studyDetail';

jest.mock('../../../src/pages/studyDetail/overview/tabs/TabsView', () => ({ data, isModalView }) => (
  <div>Tabs {data.study_id} {isModalView ? 'modal' : 'page'}</div>
));

describe('Study profile ModalView', () => {
  beforeAll(() => {
    global.MutationObserver = class MutationObserver {
      observe() {}

      disconnect() {}
    };
    document.createRange = () => ({
      setStart: () => {},
      setEnd: () => {},
      commonAncestorContainer: document.body,
    });
  });

  it('should open and close the enlarged study profile', () => {
    render(<ModalView data={studyDetail} />);

    expect(screen.queryByText(/Study Profile:/)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /See Enlarged View/i }));
    expect(screen.getByText(/Study Profile:/)).toBeInTheDocument();
    expect(screen.getByText('Tabs phs002790 modal')).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Study Profile:/).parentElement.querySelector('button'));
    expect(screen.queryByText('Tabs phs002790 modal')).not.toBeInTheDocument();
  });
});
