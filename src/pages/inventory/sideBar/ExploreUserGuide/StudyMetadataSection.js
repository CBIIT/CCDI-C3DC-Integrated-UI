import React from 'react';
import figure7 from '../../../../assets/explore/Figure7.jpg';
import figure8 from '../../../../assets/explore/Figure8.jpg';

const StudyMetadataSection = ({ classes }) => (
  <div>
    <div id="Downloading Metadata from the Studies tab" className={classes.sectionTitle}>
      Downloading Metadata from the Studies tab
    </div>
    <div className={classes.contentContainer}>
      <p>
        From the CCDI Explore Dashboard, users can download all open metadata for each study from the “Studies” table to further filter data and build cohorts. For instance, additional filtering by diagnosis of interest can generate a set of participants, and the resulting manifest can be uploaded into the CGC. As an example, the following steps explain how to download the metadata for the CCDI Molecular Characterization Initiative:
      </p>
      <ol>
        <li>Using the process described above, open the “STUDY” set of filters from the lefthand menu, expand the “Study Name” category, and scroll down to find “Molecular Characterization Initiative.”</li>
        <li>Select the checkbox corresponding to “Molecular Characterization Initiative” and see the Dashboard reload, filtered for this study’s details.</li>
        <li>Navigate to “Studies” in the results tables and locate the “Manifest” column.</li>
        <li>Click the “Download study manifest” icon in the “Manifest” column to download the metadata for this study.</li>
        <li>Open the resulting file on your local machine to browse the resulting metadata tables.</li>
      </ol>
      <div className={classes.figureContainer}>
        <img src={figure7} className={classes.figureImage} alt="Study manifest download icon for the Molecular Characterization Initiative" />
      </div>
      <div className={classes.figureText}>Figure 7: Download metadata manifest for a given study</div>

      <p>
        The full study manifest can also be downloaded from the associated Study Details page accessible from the Studies list in the application menu. Links to the CCDI cBioPortal Cancer Data Explorer are also available from this page for studies with related data available through the CCDI cBioPortal.
      </p>
      <div className={classes.figureContainer}>
        <img src={figure8} className={classes.figureImage} alt="C3DC Studies listing and Molecular Characterization Initiative Study Details page" />
      </div>
      <div className={classes.figureText}>Figure 8: Studies listing and Study Details page</div>
    </div>
  </div>
);

export default StudyMetadataSection;
