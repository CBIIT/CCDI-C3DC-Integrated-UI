import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ConsentCodesRow from '../../../src/pages/globalSearch/Cards/ConsentCodesRow';

const classes = {
  propertyLine: 'propertyLine',
  keyAndValueRow: 'keyAndValueRow',
  consentCodesRow: 'consentCodesRow',
  key: 'key',
  consentCodesContainer: 'consentCodesContainer',
  treatmentTextContainer: 'treatmentTextContainer',
  clickableText: 'clickableText',
  consentCodeItem: 'consentCodeItem',
  consentCodeLink: 'consentCodeLink',
  consentExternalIcon: 'consentExternalIcon',
  expandToggle: 'expandToggle',
  expandIcon: 'expandIcon',
};

describe('ConsentCodesRow', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: 500 });
  });

  it('should render nothing when there are no codes', () => {
    const { container } = render(<ConsentCodesRow consentCodes="" classes={classes} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should expand truncated consent codes', () => {
    const codes = Array.from({ length: 20 }, (_, i) => `CODE${i}`);
    render(
      <ConsentCodesRow
        consentCodes={codes}
        classes={classes}
      />,
    );
    expect(screen.getByText('CONSENT CODES:')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /CODE0/ })).toBeInTheDocument();
    fireEvent.click(document.querySelector('.expandToggle'));
    expect(screen.getByRole('link', { name: /CODE19/ })).toBeInTheDocument();
    fireEvent.keyDown(document.querySelector('[role="button"]'), { key: 'Enter' });
    fireEvent.keyDown(document.querySelector('[role="button"]'), { key: ' ' });
    fireEvent.click(screen.getByRole('link', { name: /CODE0/ }));
  });

  it('should truncate a single over-long consent code', () => {
    render(
      <ConsentCodesRow
        consentCodes={['VERYLONGCONSENTCODETHATWILLNOTFITINTOTHIRTYFIVECHARS']}
        classes={classes}
      />,
    );
    expect(screen.getByText('CONSENT CODES:')).toBeInTheDocument();
    expect(document.querySelector('.expandToggle')).toBeInTheDocument();
  });

  it('should not truncate a short consent list', () => {
    window.innerWidth = 1400;
    render(
      <ConsentCodesRow consentCodes={['GRU']} classes={classes} />,
    );
    expect(document.querySelector('.expandToggle')).not.toBeInTheDocument();
    fireEvent.resize(window);
    expect(screen.getByRole('link', { name: /GRU/ })).toBeInTheDocument();
  });
});
