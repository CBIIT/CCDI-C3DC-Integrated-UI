import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useDebounce } from '../../../../src/components/CohortModal/hooks/useDebounce';

function Probe({ value, delay }) {
  const debounced = useDebounce(value, delay);
  return <span data-testid="value">{debounced}</span>;
}

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useRealTimers();
  });
  it('should return the latest value after the delay', (done) => {
    const { rerender } = render(<Probe value="a" delay={1} />);
    expect(screen.getByTestId('value')).toHaveTextContent('a');
    rerender(<Probe value="b" delay={1} />);
    setTimeout(() => {
      expect(screen.getByTestId('value')).toHaveTextContent('b');
      done();
    }, 20);
  });
});
