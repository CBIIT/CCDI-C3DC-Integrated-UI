import React from 'react';
import figure19 from '../../../../assets/explore/Figure19.jpg';
import figure20 from '../../../../assets/explore/Figure20.jpg';
import figure21 from '../../../../assets/explore/Figure21.jpg';
import figure22 from '../../../../assets/explore/Figure22.jpg';
import figure23 from '../../../../assets/explore/Figure23.jpg';
import figure24 from '../../../../assets/explore/Figure24.jpg';

const AnalyzingCohortsSection = ({ classes }) => (
  <div>
    <div id="Cohort Analyzer" className={classes.sectionTitle}>
      Cohort Analyzer
    </div>
    <div className={classes.contentContainer}>
      <div className={classes.figureContainer}>
        <img src={figure19} style={{ width: '80%' }} alt="Figure 19" />
      </div>
      <div className={classes.figureText}>Figure 19: Cohort Analyzer page</div>

      <div className={classes.figureContainer}>
        <img src={figure20} style={{ width: '80%' }} alt="Figure 20" />
      </div>
      <div className={classes.figureText}>Figure 20: One Cohort Selected: You have created and selected one cohort</div>

      <p>
        To start using the Cohort Analyzer, you will first need to select the cohorts you want to analyze. As you add cohorts, the system will automatically keep track of your cohorts on the left side Cohort Selector. This tool's functionality adapts based on the number of selected cohorts, ensuring a customized analysis. Select your first cohort by clicking the check box in the Cohort Selector sidebar. The Venn diagram and table will update to display the cohort information based on the participant ID or diagnosis based on the radio button selection. In this example, we are using the participant ID, thus the table will contain properties specific to the participant, as well as show to what cohorts the participant belongs (Figure 20).
      </p>

      <p>
        Select another cohort in the Cohort Selector to see the Venn diagram and table update again. This time, if there are common participants between both cohorts, the diagram will show the shared participants in the intersection between the two. In the table, with none of the Venn diagrams selected, it will display all participants and their respective cohort.
      </p>

      <div className={classes.figureContainer}><img src={figure21} style={{ width: '80%' }} alt='Figure 21' /></div>
      <div className={classes.figureText}>Figure 21: Two Cohorts Selected: You have selected two cohorts. Visualize shared and unique data points between these cohorts</div>

      <p>
        Select a third and final cohort. The Venn diagram and table will update once more with all the participant level data (Figure 22).
      </p>

      <div className={classes.figureContainer}><img src={figure22} style={{ width: '80%' }} alt='Figure 22' /></div>
      <div className={classes.figureText}>Figure 22: Three Cohorts Selected: You have selected three cohorts. Explore their intersections and unique attributes using the Venn diagram.</div>

      <p>
        Please note that the number in parentheses by the cohort's name in the Venn diagram represents the count of unique records for that radio button selection. The number inside the Venn diagram sections are the count of unique values for that radio button selection. Finally, the count next to your cohort in the Cohort Selection side bar indicates the total participants in your cohort. At this point, you can select one of these pieces on the Venn diagram to update the table to show only those participants and their respective data. In the example below, the center intersection was selected. The table updates, showing only participants that are found in all three cohorts. With this section selected, a user can also create an entirely new cohort with these filtered participants.
      </p>

      <div className={classes.figureContainer}><img src={figure23} style={{ width: '80%' }} alt='Figure 23' /></div>
      <div className={classes.figureText}>Figure 23: View the center intersection between all Cohorts selected (see dark green highlighted region)</div>

      <p>The user will see the intersections of all three cohorts. Additionally, the user will also see intersections between two cohorts. Clicking on the desired intersection will result in the table being updated accordingly with metadata for those selected participants.</p>

      <div className={classes.figureContainer}><img src={figure24} style={{ width: '80%' }} alt='Figure 24' /></div>
      <div className={classes.figureText}>Figure 24: View the specific intersections between selected Cohorts</div>

      <div className={classes.sectionSubTitle}>Customizable Properties</div>
      <p>The radio buttons allow users to select more than one property for comparison. Currently available properties include Participant ID and Diagnosis.</p>

      <div className={classes.sectionSubTitle}>Enhanced Analytical Capabilities</div>
      <p>Users will be able to visualize overlaps and unique attributes within each cohort. In addition, users can:</p>
      <ul>
        <li>Investigate specific sections of the Venn diagram to view participant-level details from the corresponding table view</li>
        <li>Export results, including the data table and Venn diagram, for further analysis or integration into other platforms</li>
        <li>Use advanced filters to refine cohort comparisons, such as narrowing by specific diagnosis</li>
        <li>Download results as CSV or JSON files</li>
        <li>Export your analysis into a pre-filtered view within the Explore Dashboard for streamlined review and exploration</li>
      </ul>
    </div>
  </div>
);

export default AnalyzingCohortsSection;
