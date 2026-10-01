import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useUserGuide } from '../../../src/pages/inventory/sideBar/UserGuideContext';

describe('useUserGuide', () => {
  it('should throw when used outside the provider', () => {
    function Probe() {
      useUserGuide();
      return null;
    }
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow('useUserGuide must be used within UserGuideProvider');
    spy.mockRestore();
  });
});
