jest.mock('@bento-core/tool-tip', () => ({ children }) => children);

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import SwitchNav from '../../../src/pages/inventory/switchNav/switchNav';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('SwitchNav', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });

  it('should navigate to files when the files label is clicked', () => {
    render(
      <MemoryRouter initialEntries={['/exploreParticipants?sex_at_birth=Female']}>
        <SwitchNav />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByText('Explore files'));
    expect(mockNavigate).toHaveBeenCalledWith('/exploreFiles?sex_at_birth=Female');
  });

  it('should toggle from the switch control with keyboard', () => {
    render(
      <MemoryRouter initialEntries={['/exploreFiles']}>
        <SwitchNav />
      </MemoryRouter>,
    );
    const track = screen.getByRole('switch');
    expect(track).toHaveAttribute('aria-checked', 'true');
    fireEvent.keyDown(track, { key: 'Enter' });
    expect(mockNavigate).toHaveBeenCalledWith('/exploreParticipants');
    fireEvent.keyDown(track, { key: ' ' });
    expect(mockNavigate).toHaveBeenCalledTimes(2);
  });

  it('should go to participants from the participant label', () => {
    render(
      <MemoryRouter initialEntries={['/exploreFiles']}>
        <SwitchNav />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByText('Explore participant'));
    expect(mockNavigate).toHaveBeenCalledWith('/exploreParticipants');
  });
});
