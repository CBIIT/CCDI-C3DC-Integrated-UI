import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContactUsSection from '../../../src/pages/inventory/sideBar/ExploreUserGuide/ContactUsSection';
import { USER_GUIDE_SECTION_ANALYZING_COHORTS } from '../../../src/pages/inventory/sideBar/userGuideConstants';
import { customTheme } from '../../../src/pages/inventory/tabs/DefaultTabTheme';

describe('Explore user guide extras', () => {
  it('should render the contact mailbox link', () => {
    render(<ContactUsSection classes={{ sectionTitle: '', contentContainer: '' }} />);
    expect(screen.getByRole('link', { name: /CCDI mailbox/i })).toHaveAttribute('href', expect.stringContaining('mailto:'));
  });

  it('should export the analyzer section id and tab theme', () => {
    expect(USER_GUIDE_SECTION_ANALYZING_COHORTS).toBe('Cohort Analyzer');
    expect(customTheme.MuiTabs.root.borderBottom).toContain('#71767A');
  });
});
