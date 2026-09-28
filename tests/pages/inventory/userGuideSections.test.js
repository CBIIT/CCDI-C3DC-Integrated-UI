import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import OverviewSection from '../../../src/pages/inventory/sideBar/ExploreUserGuide/OverviewSection';
import FindDataSection from '../../../src/pages/inventory/sideBar/ExploreUserGuide/FindDataSection';
import StudyMetadataSection from '../../../src/pages/inventory/sideBar/ExploreUserGuide/StudyMetadataSection';
import CartManifestSection from '../../../src/pages/inventory/sideBar/ExploreUserGuide/CartManifestSection';
import CohortSection from '../../../src/pages/inventory/sideBar/ExploreUserGuide/CohortSection';
import AnalyzingCohortsSection from '../../../src/pages/inventory/sideBar/ExploreUserGuide/AnalyzingCohortsSection';
import AdditionalSearchFeaturesSection from '../../../src/pages/inventory/sideBar/ExploreUserGuide/AdditionalSearchFeaturesSection';
import FullGuideSection from '../../../src/pages/inventory/sideBar/ExploreUserGuide/FullGuideSection';

const classes = new Proxy({}, { get: () => '' });

describe('Explore user guide sections', () => {
  it('should render section titles', () => {
    render(
      <>
        <OverviewSection classes={classes} />
        <FindDataSection classes={classes} />
        <StudyMetadataSection classes={classes} />
        <CartManifestSection classes={classes} />
        <CohortSection classes={classes} />
        <AnalyzingCohortsSection classes={classes} />
        <AdditionalSearchFeaturesSection classes={classes} />
        <FullGuideSection classes={classes} />
      </>,
    );
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText(/C3DC Data Model/i)).toBeInTheDocument();
  });
});
