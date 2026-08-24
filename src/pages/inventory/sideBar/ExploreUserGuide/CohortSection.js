import React from 'react';
import figure8 from '../../../../assets/explore/Figure8.png';
import figure9 from '../../../../assets/explore/Figure9.png';
import figure10 from '../../../../assets/explore/Figure10.png';

const CohortSection = ({ classes }) => (
  <div>
    <div id="Creating and Managing Cohorts" className={classes.sectionTitle}>
      Creating and Managing Cohorts
    </div>
    <div className={classes.contentContainer}>
      <p>
        From the CCDI Hub Explore Dashboard Participant table, you can group participants into cohorts to find files of interest or you can add files directly to the cart (read more in next section). To create a cohort:
      </p>

      <ol>
        <li>Using the process described above, apply any filters of interest from the lefthand facet menu.</li>
        <li>Navigate to the Participants table. On the results tables of the Explore Dashboard, you can select a row of metadata using the checkbox at the start of the row. Multiple rows can be selected within a table, even across pages of the table. Use the checkbox at the top of the checkbox column to select or deselect all rows.</li>
        <li>
          After selecting desired rows, select the “CREATE COHORT” button to add the selected participants to a cohort (Figure 8). A "View of All Cohorts” pop-up window will open if at least one participant row is selected.
          <div className={classes.figureContainer}><img src={figure8} style={{ width: '70%' }} alt="Figure 8" /></div>
          <div className={classes.figureText}>Figure 8: Cohort creation and management</div>
        </li>
        <li>From the "View of All Cohorts" window, you can view and delete all cohorts and see details about a selected cohort, which will be your newly created cohort, by default (Figure 9).</li>
        <li>In the selected cohort view, you can view current cohort attributes as well as change the name, add a description, search by participant ID, and delete participants from the list (Figure 9). You can also download the cohort manifest in JSON or CSV format.</li>
        <li>
          Click the “DOWNLOAD SELECTED COHORT” button to download a manifest json or csv file for the selected cohort (Figure 9).
          <div className={classes.figureContainer}><img src={figure9} style={{ width: '40%' }} alt="Figure 9" /></div>
          <div className={classes.figureText}>Figure 9: View of All Cohorts</div>
        </li>
        <li>Click the X button in the top right to return to the Participant table.</li>
      </ol>

      <p>Once a cohort exists, you can easily add more Participants to a cohort by selecting at least one new participant, clicking the “ADD PARTICIPANTS TO EXISTING COHORT” button, and selecting the preferred cohort from the dropdown menu (Figure 10). Clicking the “VIEW ALL COHORTS” button from the Participant table will re-open the “View of All Cohorts” pop-up window described above.</p>
      <div className={classes.figureContainer}>
        <img src={figure10} style={{ width: '80%' }} alt="Figure 10" />
      </div>
      <div className={classes.figureText}>Figure 10: Add Participants to Existing Cohort button</div>

      <p>A user can create up to 20 cohorts to exist at any time – cohorts will be stored until a user deletes their browser history. An individual cohort can contain a maximum of 5,000 participants.</p>
    </div>
  </div>
);

export default CohortSection;
