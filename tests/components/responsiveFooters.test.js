import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FooterTablet from '../../src/components/ResponsiveFooter/FooterTablet';
import FooterMobile from '../../src/components/ResponsiveFooter/FooterMobile';
import FooterData from '../../src/bento/globalFooterData';

const variants = [
  ['tablet', FooterTablet, 'email_tablet'],
  ['mobile', FooterMobile, 'email_mobile'],
];

describe.each(variants)('%s footer', (name, Component, emailId) => {
  describe('Rendering', () => {
    it('should render configured navigation, contact, and social links', () => {
      render(<Component />);

      FooterData.link_sections.forEach((section) => {
        expect(screen.getByText(section.title)).toBeInTheDocument();
      });
      expect(screen.getAllByText('Contact Us')).not.toHaveLength(0);
      FooterData.followUs_links.forEach((item) => {
        expect(screen.getByRole('img', { name: item.description })).toBeInTheDocument();
      });
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });
  });

  describe('Email updates', () => {
    it('should reject an invalid email address', () => {
      const { container } = render(<Component />);
      const input = document.getElementById(emailId);

      fireEvent.change(input, { target: { value: 'invalid-address' } });
      fireEvent.submit(container.querySelector('form'));

      expect(screen.getByText('Enter a valid email address')).toBeInTheDocument();
    });

    it('should submit a valid email address to GovDelivery', () => {
      const submit = jest
        .spyOn(HTMLFormElement.prototype, 'submit')
        .mockImplementation(() => {});
      const { container } = render(<Component />);
      const form = container.querySelector('form');

      fireEvent.change(document.getElementById(emailId), {
        target: { value: 'researcher@example.org' },
      });
      fireEvent.submit(form);

      expect(form).toHaveAttribute(
        'action',
        'https://public.govdelivery.com/accounts/USNIHNCI/subscribers/qualify',
      );
      expect(form).toHaveAttribute('method', 'post');
      expect(submit).toHaveBeenCalledTimes(1);
      submit.mockRestore();
    });
  });
});

describe('FooterMobile navigation sections', () => {
  it('should expand and collapse a footer section', () => {
    const { container } = render(<FooterMobile />);
    const aboutButton = screen.getByRole('button', { name: 'About' });
    const dropdown = container.querySelector('#link_0Dropdown');
    const arrow = container.querySelector('#link_0Arrow');

    expect(dropdown).not.toHaveClass('show');
    fireEvent.click(aboutButton);
    expect(dropdown).toHaveClass('show');
    expect(arrow).toHaveClass('rotate');

    fireEvent.click(aboutButton);
    expect(dropdown).not.toHaveClass('show');
    expect(arrow).not.toHaveClass('rotate');
  });
});
