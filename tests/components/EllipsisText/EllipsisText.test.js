import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { MiddleEllipsisText, EndEllipsisText } from '../../../src/components/EllipsisText';

const theme = createMuiTheme();

function installMetrics({ containerWidth, charWidth, scrollWider = false }) {
  const saved = ['offsetWidth', 'scrollWidth', 'clientWidth'].map((name) => [
    name,
    Object.getOwnPropertyDescriptor(HTMLElement.prototype, name),
  ]);
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    configurable: true,
    get() {
      if (String(this.className || '').includes('measureSpan')) {
        return (this.textContent || '').length * charWidth;
      }
      return containerWidth;
    },
  });
  Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
    configurable: true,
    get() { return scrollWider ? containerWidth + 40 : containerWidth; },
  });
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
    configurable: true,
    get() { return containerWidth; },
  });
  return () => {
    saved.forEach(([name, descriptor]) => {
      if (descriptor) Object.defineProperty(HTMLElement.prototype, name, descriptor);
      else delete HTMLElement.prototype[name];
    });
  };
}

describe('EllipsisText', () => {
  beforeEach(() => {
    global.ResizeObserver = class {
      constructor(callback) { this.callback = callback; }

      observe(target) {
        this.callback([{ target, contentRect: { width: 120 } }]);
      }

      unobserve() {}

      disconnect() {}
    };
  });

  it('should render full text in middle mode', () => {
    render(
      <ThemeProvider theme={theme}>
        <MiddleEllipsisText text="Short" />
      </ThemeProvider>,
    );
    expect(screen.getByText('Short')).toBeInTheDocument();
  });

  it('should render end-mode text', () => {
    render(
      <ThemeProvider theme={theme}>
        <EndEllipsisText text="A reasonably long name" />
      </ThemeProvider>,
    );
    expect(screen.getByText('A reasonably long name')).toBeInTheDocument();
  });

  it('should leave empty text unchanged', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <MiddleEllipsisText text="" />
      </ThemeProvider>,
    );
    expect(container.textContent).toBe('');
  });

  it('should keep text that fits and report that it is not truncated', () => {
    const restore = installMetrics({ containerWidth: 200, charWidth: 1 });
    const onTruncate = jest.fn();
    const { container } = render(
      <ThemeProvider theme={theme}>
        <MiddleEllipsisText text="Fits" onTruncate={onTruncate} className="label" />
      </ThemeProvider>,
    );
    expect(container.querySelector('[class*="displaySpan"]').textContent).toBe('Fits');
    expect(onTruncate).toHaveBeenCalledWith(false);
    restore();
  });

  it('should insert a middle ellipsis when the title is wider than the container', () => {
    const restore = installMetrics({ containerWidth: 120, charWidth: 8 });
    const onTruncate = jest.fn();
    const text = 'CohortNameThatIsMuchTooLongForTheAvailableWidth';
    render(
      <ThemeProvider theme={theme}>
        <MiddleEllipsisText text={text} onTruncate={onTruncate} />
      </ThemeProvider>,
    );
    const shown = screen.getByText(/\.\.\./);
    expect(shown.textContent.startsWith('Cohor')).toBe(true);
    expect(shown.textContent.endsWith('idth')).toBe(true);
    expect(onTruncate).toHaveBeenCalledWith(true);
    restore();
  });

  it('should fall back to a leading ellipsis when even the minimum split does not fit', () => {
    const restore = installMetrics({ containerWidth: 20, charWidth: 50 });
    const onTruncate = jest.fn();
    render(
      <ThemeProvider theme={theme}>
        <MiddleEllipsisText text="ABCDEFGHIJKLMNOP" onTruncate={onTruncate} />
      </ThemeProvider>,
    );
    expect(screen.getByText('A...')).toBeInTheDocument();
    expect(onTruncate).toHaveBeenCalledWith(true);
    restore();
  });

  it('should skip truncation when the container has no width', () => {
    const restore = installMetrics({ containerWidth: 0, charWidth: 10 });
    render(
      <ThemeProvider theme={theme}>
        <MiddleEllipsisText text="Still fully visible" />
      </ThemeProvider>,
    );
    expect(screen.getByText('Still fully visible')).toBeInTheDocument();
    restore();
  });

  it('should report overflow for end-mode text', () => {
    const restore = installMetrics({ containerWidth: 40, charWidth: 1, scrollWider: true });
    const onTruncate = jest.fn();
    render(
      <ThemeProvider theme={theme}>
        <EndEllipsisText text="Overflowing end mode label" onTruncate={onTruncate} />
      </ThemeProvider>,
    );
    expect(onTruncate).toHaveBeenCalledWith(true);
    expect(screen.getByText('Overflowing end mode label')).toBeInTheDocument();
    restore();
  });
});
