import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LinkButton from '../../../../../src/pages/cart/customComponent/userGuideButton/linkButton';
import { linkStyles } from '../../../../../src/pages/cart/customComponent/userGuideButton/linkStyles';

describe('cart LinkButton', () => {
  describe('Rendering', () => {
    it('should open the user guide PDF in a new tab', () => {
      render(<LinkButton />);

      const link = screen.getByRole('link', { name: /USER GUIDE/i });
      expect(link).toHaveAttribute('href', '/user-guide.pdf');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('Styles', () => {
    it('should define hover styles for the guide button', () => {
      const styles = linkStyles({});
      expect(styles.linkBtn.backgroundColor).toBe('#FFFFFF');
      expect(styles.linkBtn['&:hover'].backgroundColor).toBe('#FFFFFF');
    });
  });
});
