import React from 'react';
import figure11 from '../../../../assets/explore/Figure11.jpg';
import figure12 from '../../../../assets/explore/Figure12.jpg';

const CohortSection = ({ classes }) => (
  <div>
    <div id="Creating and Managing Cohorts" className={classes.sectionTitle}>
      Creating and Managing Cohorts
    </div>
    <div className={classes.contentContainer}>
      <p>
        The Cohort Selector enables users to create a cohort with a size of up to 4,000 participants and to manage up to 20 cohorts. This feature offers flexibility to researchers, allowing them to create cohort groups according to their specific requirements.
      </p>
      <div className={classes.figureContainer}>
        <img src={figure11} className={classes.figureImage} alt="Cohort selection controls above the Explore Participants table" />
      </div>
      <div className={classes.figureText}>Figure 11: Cohort Selection features visible on the Explore Participants page &gt; Participants table</div>

      <p>Users can do the following:</p>
      <ul>
        <li>
          Create New Cohort:
          <ul>
            <li>
              Users can select participant IDs from the table or choose to add all participants based on the faceted results and create a new cohort.
              <ul>
                <li>Users can name and describe the cohort for easy reference.</li>
                <li>A user can add up to 4,000 participants in each cohort.</li>
              </ul>
            </li>
          </ul>
        </li>
        <li>
          Add Participants to Existing Cohort:
          <ul>
            <li>Select participants and add them to existing cohorts or remove them. Entire cohorts can also be deleted as needed.</li>
          </ul>
        </li>
        <li>
          View All Cohort(s): View a list of all created cohorts, making it easier to manage and analyze groups.
          <ul>
            <li><strong>Copy Cohort:</strong> Create a copy of an existing cohort and add or remove participants as needed. This action creates a new cohort with the same participants and settings, with “Copy” appended to the cohort name.</li>
            <li>
              <strong>Download Selected Cohort:</strong>
              <ul>
                <li>
                  Download the metadata of selected cohort in one of two formats.
                  <ul>
                    <li>Manifest CSV: a list of participant IDs and high-level metadata.</li>
                    <li>Metadata JSON: a JSON file containing all metadata information for the participants in the selected cohort, including CPI synonyms</li>
                  </ul>
                </li>
              </ul>
            </li>
            <li><strong>View Cohort Analyzer:</strong> Navigate to the Cohort Analyzer from the cohort list.</li>
          </ul>
        </li>
      </ul>

      <div className={classes.figureContainer}>
        <img src={figure12} className={`${classes.figureImage} ${classes.figureImageNarrow}`} alt="View of All Cohorts dialog showing two cohorts" />
      </div>
      <div className={classes.figureText}>Figure 12: View All Cohorts popup allows users to manage up to 20 cohorts</div>
    </div>
  </div>
);

export default CohortSection;
