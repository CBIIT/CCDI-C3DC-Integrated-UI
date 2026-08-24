import React from 'react';
import figure18 from '../../../../assets/explore/Figure18.png';

const AdditionalSearchFeaturesSection = ({ classes }) => (
  <div>
    <div id="Additional Search Features" className={classes.sectionTitle}>
      Additional Search Features
    </div>
    <div className={classes.contentContainer}>
      <p>For users who prefer text searching, the global search bar at the top of each page allows you enter a query and report all findings in metadata and page text throughout the CCDI Hub. Search results are categorized as Participant, Studies, Samples, Files, Data Model, or About (Figure 18). Where applicable, you can link from these findings back to the Explore Dashboard or other pages with information relevant to your search.</p>
      <div className={classes.figureContainer}><img src={figure18} style={{ width: '80%' }} alt='Figure 18' /></div>
      <div className={classes.figureText}>Figure 18: Global Search results</div>
      <p>For users interested in the data model, you can browse the model nodes and properties by selecting “CCDI Data Model” from the About dropdown menu.</p>
    </div>
  </div>
);

export default AdditionalSearchFeaturesSection;