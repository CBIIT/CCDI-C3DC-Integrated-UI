import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FooterDesktop from '../../src/components/ResponsiveFooter/FooterDesktop';
import FooterData from '../../src/bento/globalFooterData';

describe('FooterDesktop', () => {
  describe('Rendering', () => {
    it('should render configured links and social media labels', () => {
      render(<FooterDesktop />);

      FooterData.link_sections.forEach((section) => {
        expect(screen.getByText(section.title)).toBeInTheDocument();
      });
      FooterData.followUs_links.forEach((item) => {
        expect(screen.getByRole('img', { name: item.description })).toBeInTheDocument();
      });
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });

    it('should mark external links to open safely in a new tab', () => {
      render(<FooterDesktop />);

      const link = screen.getByRole('link', { name: 'About CCDI' });
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('Email updates', () => {
    it('should show an error for an invalid email address', () => {
      const { container } = render(<FooterDesktop />);

      fireEvent.change(screen.getByLabelText('Enter your email address'), {
        target: { value: 'not-an-email' },
      });
      fireEvent.submit(container.querySelector('form'));

      expect(screen.getByText('Enter a valid email address')).toBeInTheDocument();
    });

    it('should submit the subscription form for a valid email address', () => {
      const submit = jest
        .spyOn(HTMLFormElement.prototype, 'submit')
        .mockImplementation(() => {});
      const { container } = render(<FooterDesktop />);

      fireEvent.change(screen.getByLabelText('Enter your email address'), {
        target: { value: 'researcher@example.org' },
      });
      fireEvent.submit(container.querySelector('form'));

      expect(submit).toHaveBeenCalledTimes(1);
      submit.mockRestore();
    });
  });
});
