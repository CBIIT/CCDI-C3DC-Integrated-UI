import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LineBreaksRenderer from '../../src/utils/LineBreaksRenderer';

describe('LineBreaksRenderer', () => {
  it('should keep allowed br tags when sanitizing', () => {
    render(<LineBreaksRenderer htmlContent="line one<br/>line two" classes="copy" />);
    const span = screen.getByText(/line one/);
    expect(span.innerHTML).toMatch(/line one/i);
    expect(span.innerHTML).toMatch(/<br/i);
  });

  it('should strip disallowed tags when sanitizing', () => {
    render(<LineBreaksRenderer htmlContent="<script>alert(1)</script>safe" />);
    expect(screen.getByText('safe')).toBeInTheDocument();
  });

  it('should skip sanitization when sanitize is false', () => {
    const { container } = render(
      <LineBreaksRenderer htmlContent="<b>raw</b>" sanitize={false} />,
    );
    expect(container.querySelector('b')).toHaveTextContent('raw');
  });
});
