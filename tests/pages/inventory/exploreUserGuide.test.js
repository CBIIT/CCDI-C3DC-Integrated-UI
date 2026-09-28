import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExploreUserGuide from '../../../src/pages/inventory/sideBar/ExploreUserGuide';
import { UserGuideProvider } from '../../../src/pages/inventory/sideBar/UserGuideContext';

jest.mock('../../../src/pages/inventory/sideBar/UserGuideModal', () => ({ open }) => (
  open ? <div>Guide modal open</div> : null
));

describe('ExploreUserGuide', () => {
  it('should open the user guide from the sidebar button', () => {
    render(
      <UserGuideProvider>
        <ExploreUserGuide />
      </UserGuideProvider>,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Guide modal open')).toBeInTheDocument();
  });
});
