import React from 'react';
import figure2 from '../../../../assets/explore/Figure2.png';
import figure3 from '../../../../assets/explore/Figure3.jpg';
import figure4 from '../../../../assets/explore/Figure4.jpg';
import figure5 from '../../../../assets/explore/Figure5.png';

const FindDataSection = ({ classes }) => (
  <div>
    <div id="Finding Participants, Studies, Samples, and Files" className={classes.sectionTitle}>
      Finding Participants, Studies, Samples, and Files
    </div>
    <div className={classes.contentContainer}>
      <p>
        The CCDI Hub Explore Dashboard provides row-level metadata for CCDI study participants and their data objects for review with a filtered search, select visualizations, and an exportable table of results. Here’s how to find and filter information on the Explore Dashboard:
      </p>

      <p><strong>To find and filter information on the Explore Dashboard:</strong></p>

      <ol>
        <li>
          The CCDI Hub is located at <a href="/">ccdi.cancer.gov</a>. From the CCDI Hub Home page, navigate to the Explore Dashboard by clicking “Explore” (Figure 2).
          <div className={classes.figureContainer}>
            <img src={figure2} style={{ width: '60%' }} alt="Figure 2" />
          </div>
          <div className={classes.figureText}>
            Figure 2: CCDI homepage with red box highlighting the “Explore” menu bar link
          </div>
        </li>

        <li>
          On the Explore Dashboard, you can filter row-level data and view them as visualizations (Figure 3). The Explore Dashboard is participant-centric, meaning that filtering criteria and results return de-identified information about a participant and their related studies, collected samples, or created files.
          <div className={classes.figureContainer}>
            <img src={figure3} style={{ width: '40%' }} alt="Figure 3" />
          </div>
          <div className={classes.figureText}>
            Figure 3: Explore Dashboard page with red boxes highlighting the search filters and results
          </div>
        </li>

        <li>
          Search criteria are displayed in the right panel (Figure 4A). Faceted filtering may be done by uploading a list of participant IDs (in “DEMOGRAPHICS” Figure 4B), text searches (“DIAGNOSIS,” “DIAGNOSIS ANATOMIC SITE,” and “SAMPLE ANATOMIC SITE” Figure 4C), numerical sliders (“AGE AT DIAGNOSIS,” “AGE AT TREATMENT START,” “AGE AT RESPONSE,” “AGE AT LAST KNOWN SURVIVAL STATUS,” and “AGE AT COLLECTION” Figure 4D), or checkbox selections for the remaining properties. You can apply multiple filtering criteria at the same time in a search. You can view and clear your current selection(s) in the query summary at the top of the widgets (Figure 4E).
          <div className={classes.figureContainer}>
            <img src={figure4} style={{ width: '90%' }} alt="Figure 4" />
          </div>
          <div className={classes.figureText}>
            Figure 4: Full facet list in Explore Dashboard with highlights of various facet types and query display/clear function
          </div>
        </li>

        <li>
          Filtering your search will update the Explore Dashboard’s visualizations and the results tables (Figure 5). Each results table will be updated with information on the participants, samples, studies, or files that meet the filtered criteria. Information displayed by default on each table is described below:
          <ol className={classes.alphaList}>
            <li>“Participants”: Characteristics of a participant in the Explore Dashboard. Participants belong to a study, and they may have one or more samples, diagnoses, or files associated with them. Participant mappings from the <a href="/ccdi-participant-index">CCDI Participant Index (CPI)</a> have a summary of these mappings available from this tab and full mapping details are available by clicking on the adjacent icon.</li>
            <li>“Studies”: Studies that are a part of the Explore Dashboard. Participants, diagnosis, samples, and files all belong to a CCDI study.</li>
            <li>“Samples”: Samples available from participants within the Explore Dashboard. Samples belong to a participant and can be associated with one or more files.</li>
            <li>“Files”: Files available from studies, participants, and samples within the Explore Dashboard. Files may belong to a study and may be associated with one or more participants or samples. Files may also be of many types, including sequencing, proteomics, imaging files, etc. DICOM imaging files are currently available for the Genomic Sequencing of Pediatric Rhabdomyosarcoma (phs000720) and Molecular Characterization Initiative (phs002790) studies and can be accessed directly from the <a className={classes.link} href="https://portal.imaging.datacommons.cancer.gov" target="_blank" rel="noopener noreferrer">Imaging Data Commons (IDC) Data Portal</a> and file paths to images are provided in the downloadable study manifest within Hub, described in the following section. File attributes, including but not limited to file name, can be searched in this tab
              <div className={classes.figureContainer}><img src={figure5} style={{ width: '70%' }} alt='Figure 5' /></div>
              <div className={classes.figureText}>Figure 5: Explore Dashboard visualizations and results tables with arrows pointing to the available informational tables</div>
            </li>
          </ol>
        </li>
      </ol>
    </div>
  </div>
);

export default FindDataSection;
