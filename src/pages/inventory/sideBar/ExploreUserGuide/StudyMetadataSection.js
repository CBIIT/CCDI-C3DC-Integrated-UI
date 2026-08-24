import React from 'react';
import figure11 from '../../../../assets/explore/Figure11.png';
import figure12 from '../../../../assets/explore/Figure12.png';
import figure13 from '../../../../assets/explore/Figure13.jpg';

const StudyMetadataSection = ({ classes }) => (
  <div>
    <div id='Downloading Metadata from the Studies tab' className={classes.sectionTitle}>
      Downloading Metadata from the Studies tab
    </div>
    <div className={classes.contentContainer}>
      <p>
        From the CCDI Hub Explore Dashboard, you can download all open metadata for each study from the “Studies” tab to further filter data and build cohorts. For instance, additional filtering by diagnosis of interest can generate a set of participants and the resulting manifest can be uploaded into the CGC. As an example, the following steps guide you on how to download the metadata for the CCDI Molecular Characterization Initiative:
      </p>
      <ol>
        <li>Using the process described above, open the “STUDY” set of filters from the lefthand menu, expand the “STUDY NAME” category, and scroll down to find “Molecular Characterization Initiative.”</li>
        <li>Select the checkbox corresponding to “Molecular Characterization Initiative” and see the Dashboard reload, filtered for this study’s details.</li>
        <li>Navigate to “Studies” in the results tables and locate the “Manifest” column.</li>
        <li>
          Click the “Download study manifest” icon in the “Manifest” column to download the metadata for this study (Figure 11).
          <div className={classes.figureContainer}><img src={figure11} style={{ width: '90%' }} alt='Figure 11' /></div>
          <div className={classes.figureText}>Figure 11: Download metadata manifest for a given study</div>
        </li>
        <li>
          Open the resulting file on your local machine to browse the resulting metadata tables (Figure 12).
          <div className={classes.figureContainer}><img src={figure12} style={{ width: '80%' }} alt='Figure 12' /></div>
          <div className={classes.figureText}>Figure 12: Study metadata export file browsable on local machine</div>
        </li>
      </ol>
      <p>Note the full study manifest can also be downloaded from the associated study details page accessible from the Studies list in the application menu. Links to the CCDI cBioPortal Cancer Data Explorer are also available from this page for studies with related data available through the CCDI cBioPortal. </p>
      <p>Appendix A details the process for generating a DRS manifest from the downloaded study metadata tables to be compatible with the CGC.</p>
      <div className={classes.figureContainer}><img src={figure13} style={{ width: '80%' }} alt='Figure 13' /></div>
      <div className={classes.figureText}>Figure 13: Studies listing and Study Details page</div>
    </div>
  </div>
);

export default StudyMetadataSection;
