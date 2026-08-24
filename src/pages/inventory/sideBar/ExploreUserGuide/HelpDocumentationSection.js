import React from 'react';
import figure17 from '../../../../assets/explore/Figure17.png';

const HelpDocumentationSection = ({ classes }) => (
  <div>
    <div id="Accessing Help Documentation" className={classes.sectionTitle}>
      Accessing Help Documentation
    </div>
    <div className={classes.contentContainer}>
      <p>The contents of this document are also available from a Help Browser, accessible from the top of the Explore Dashboard (Figure 17). From this browser, you can scroll or click through the available topics and readily navigate back to the main UI as needed.</p>
      <div className={classes.figureContainer}><img src={figure17} style={{ width: '80%' }} alt='Figure 17' /></div>
      <div className={classes.figureText}>Figure 17: In-page help text browser</div>
    </div>
  </div>
);

export default HelpDocumentationSection;