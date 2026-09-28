/**
 * JSDOM reports 0 for offsetWidth. Card title truncation measures a hidden
 * span against the card width, so tests can force the ellipsis branches.
 */
export function mockTitleTruncation({ cardWidth = 80, titleWidth = 400 } = {}) {
  const previous = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    configurable: true,
    get() {
      if (this.style && this.style.visibility === 'hidden') {
        return titleWidth;
      }
      return cardWidth;
    },
  });
  return () => {
    if (previous) {
      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', previous);
    }
  };
}
