import React from 'react';
import figure2 from '../../../../assets/explore/Figure2.jpg';
import figure3 from '../../../../assets/explore/Figure3.jpg';
import figure4 from '../../../../assets/explore/Figure4.jpg';
import figure5 from '../../../../assets/explore/Figure5.jpg';
import figure6 from '../../../../assets/explore/Figure6.jpg';

const FindDataSection = ({ classes }) => (
  <div>
    <div id="Finding Participants, Studies, Samples, and Files" className={classes.sectionTitle}>
      Finding Participants, Studies, Samples, and Files
    </div>
    <div className={classes.contentContainer}>
      <p>
        The CCDI Hub Explore Dashboard provides row-level metadata for CCDI study participants (Explore Participants page) and their data objects (Explore Files) for review with a filtered search, select visualizations, and an exportable table of results. To find and filter information on the C3DC Explore Dashboard:
      </p>

      <ul>
        <li>
          Available facets to filter are displayed in the left panel (Figure 2A). On the <strong>Explore Participants</strong> page, faceted filtering may be done by uploading a list of participant IDs (in “DEMOGRAPHICS” Figure 2B), text searches (“DIAGNOSIS,” “DIAGNOSIS ANATOMIC SITE” Figure 2C), numerical sliders for age properties (e.g. “AGE AT DIAGNOSIS”, Figure 2D), or checkbox selections for the remaining properties. You can apply multiple filtering criteria at the same time in a search. You can view and clear your current selection(s) in the query summary above the visualization widgets (Figure 2E).
          <div className={classes.figureContainer}>
            <img src={figure2} className={classes.figureImage} alt="C3DC Explore Participants facets and query controls labeled A through E" />
          </div>
          <div className={classes.figureText}>Figure 2: Full facet list in C3DC Explore Participants page with highlights of various facet types and query display/clear function</div>
        </li>

        <li>
          Filtering your search will update the C3DC Explore Dashboard’s visualizations and the results tables (Figure 3). Please note that for the Diagnosis and Anatomic Site visualizations, only the top 20 values will be displayed when there are &gt; 20 values returned from the faceted filer set. Users can easily switch the visual summaries between pie charts and histograms; each visual summary can be downloaded as a PNG file. Each results table will be updated with information on the studies and participants that meet the filter criteria. Information displayed in each table is described below:
          <ol className={classes.alphaList}>
            <li>“Participants”: Characteristics of a participant in the Explore Dashboard. Participants belong to a study, and they may have one or more samples, diagnoses, or files associated with them. Participant mappings from the <a href="https://ccdi.cancer.gov/ccdi-participant-index" target="_blank" rel="noopener noreferrer">CCDI Participant Index (CPI)</a> have a summary of these mappings available from the table, and full mapping details are available by clicking on the adjacent icon.</li>
            <li>“Studies”: Studies that are a part of the Explore Dashboard. Participants, diagnosis, samples, and files all belong to a CCDI study.</li>
            <li>“Diagnosis”: Age, anatomic site, classification, and other attributes of each participant’s diagnosis are included here.</li>
            <li>“Genetic Analysis”: Analysis ID, Gene Symbol(s) of implicated genes, and reported status and significance are part of the genetic analysis summary.</li>
            <li>“Treatments”: This tab includes treatment IDs, age at start and end of treatments, and treatment type and agent.</li>
            <li>“Treatment Responses”: This tab includes response ID, the response, and the age at which a response was recorded.</li>
            <li>“Survival”: This tab includes survival ID, last known survival status, and age at last known survival status.</li>
            <li>“Samples”: Samples available from participants within the Explore Dashboard. Samples belong to a participant and can be associated with one or more files.</li>
          </ol>
          <div className={classes.figureContainer}>
            <img src={figure3} className={classes.figureImage} alt="C3DC Explore Participants visualizations and results tables" />
          </div>
          <div className={classes.figureText}>Figure 3: C3DC Explore Participants visualizations and results tables</div>
        </li>

        <li>
          Visible columns in each table can be customized by clicking the “View columns” button in the upper righthand corner of the table and selecting or deselecting available columns (Figure 4). Note that some fields cannot be unselected and will always be displayed.
          <div className={classes.figureContainer}>
            <img src={figure4} className={classes.figureImage} alt="Displayed Columns menu in a C3DC results table" />
          </div>
          <div className={classes.figureText}>Figure 4: Interface for selecting and deselecting columns in table and downloads</div>
        </li>

        <li>
          Users can download the table contents of the Participants, Studies, Diagnosis, Genetic Analyses, Treatments, Treatment Responses, Survival, and Sample tables by selecting the “Download Data” button under the table tab headers (Figure 5). Users can download filtered data in CSV with high-level metadata or JSON format with comprehensive clinical metadata (including CPI synonyms).
          <div className={classes.figureContainer}>
            <img src={figure5} className={classes.figureImage} alt="Download Data menu showing CSV and JSON formats" />
          </div>
          <div className={classes.figureText}>Figure 5: Download Data buttons feature two different download formats, CSV or JSON</div>
        </li>

        <li>
          Users can show, hide, and copy the URL used to construct your filtered view using the toggle (Show/Hide Query URL) and copy buttons above the visualization widgets (Figure 6).
          <div className={classes.figureContainer}>
            <img src={figure6} className={classes.figureImage} alt="Toggle, clear query, and copy query URL controls" />
          </div>
          <div className={classes.figureText}>Figure 6: Toggle button, clear and copy query URL features</div>
        </li>
      </ul>

      <p>
        Similarly, users can toggle to <strong>Explore Files</strong> and apply the same types of filters on the corresponding file data. Row-level data are limited to a single “Files” view, including various annotations to describe that given file. Files may belong to a study and may be associated with one or more participants or samples. Files may also be of many types, including sequencing, proteomics, imaging files, etc. File paths to images are provided in the downloadable study manifest described in the <a href="#Downloading Metadata from the Studies tab">Downloading Metadata from the Studies table</a> section. File attributes, including but not limited to file name, can be searched in this tab.
      </p>
    </div>
  </div>
);

export default FindDataSection;
