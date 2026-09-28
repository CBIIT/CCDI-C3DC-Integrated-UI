jest.mock('../../../src/pages/inventory/sideBar/ExploreUserGuide/OverviewSection', () => () => <div>Overview body</div>);
jest.mock('../../../src/pages/inventory/sideBar/ExploreUserGuide/FindDataSection', () => () => <div>Find data</div>);
jest.mock('../../../src/pages/inventory/sideBar/ExploreUserGuide/StudyMetadataSection', () => () => <div>Study metadata</div>);
jest.mock('../../../src/pages/inventory/sideBar/ExploreUserGuide/CartManifestSection', () => () => <div>Cart manifest</div>);
jest.mock('../../../src/pages/inventory/sideBar/ExploreUserGuide/CohortSection', () => () => <div>Cohort section</div>);
jest.mock('../../../src/pages/inventory/sideBar/ExploreUserGuide/AnalyzingCohortsSection', () => () => <div>Analyzer</div>);
jest.mock('../../../src/pages/inventory/sideBar/ExploreUserGuide/AdditionalSearchFeaturesSection', () => () => <div>Additional</div>);
jest.mock('../../../src/pages/inventory/sideBar/ExploreUserGuide/ContactUsSection', () => () => <div>Contact Information</div>);
jest.mock('../../../src/pages/inventory/sideBar/ExploreUserGuide/FullGuideSection', () => () => <div>Full guide</div>);

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserGuideModal from '../../../src/pages/inventory/sideBar/UserGuideModal';

describe('UserGuideModal', () => {
  it('should render topics and close from the header button', () => {
    const onClose = jest.fn();
    render(<UserGuideModal open onClose={onClose} />);
    expect(screen.getByText('USER GUIDE TOPICS')).toBeInTheDocument();
    expect(screen.getAllByText('Contact Information').length).toBeGreaterThan(0);
    fireEvent.click(screen.getByLabelText('close'));
    expect(onClose).toHaveBeenCalled();
  });

  it('should select a nav topic', () => {
    render(<UserGuideModal open onClose={jest.fn()} />);
    fireEvent.click(screen.getByText('Overview'));
    expect(screen.getByText('Overview body')).toBeInTheDocument();
  });
});
