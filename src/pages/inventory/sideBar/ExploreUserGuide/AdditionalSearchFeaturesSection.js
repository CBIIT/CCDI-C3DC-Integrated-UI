import React from 'react';
import figure16 from '../../../../assets/explore/Figure16.jpg';

const AdditionalSearchFeaturesSection = ({ classes }) => (
  <div>
    <div id="Additional Search Features" className={classes.sectionTitle}>
      Additional Search Features
    </div>
    <div className={classes.contentContainer}>
      <p>
        For users who prefer text searching, the global search bar at the top of each page allows you to enter a query and report all findings in metadata and page text throughout the C3DC application. Search results are categorized as Participant, Studies, Samples, Files, Data Model, or About (Figure 16). Where applicable, you can link from these findings back to the Explore Dashboard or other pages with information relevant to your search.
      </p>
      <div className={classes.figureContainer}>
        <img src={figure16} className={classes.figureImage} alt="C3DC global search results for treatment" />
      </div>
      <div className={classes.figureText}>Figure 16: Global Search results</div>
    </div>
  </div>
);

export default AdditionalSearchFeaturesSection;
