import React from 'react';
import figure13 from '../../../../assets/explore/Figure13.jpg';
import figure14 from '../../../../assets/explore/Figure14.jpg';
import figure15 from '../../../../assets/explore/Figure15.jpg';

const AnalyzingCohortsSection = ({ classes }) => (
  <div>
    <div id="Cohort Analyzer" className={classes.sectionTitle}>
      Cohort Analyzer
    </div>
    <div className={classes.contentContainer}>
      <p>
        The Cohort Analyzer offers a powerful method to explore how various
        clinical attributes overlap and differ across multiple groups. The
        Cohort Analyzer is designed to compare up to three cohorts and visualize
        their intersections through an interactive Venn diagram, corresponding
        histograms, survival analysis visualizations, and a data table. This
        feature leverages cohorts created on the Explore Participants page,
        enabling users to analyze key relationships and distinctions based
        between datasets effectively. By visualizing the shared and unique data
        points using a Venn diagram, users can identify common patterns or
        variations in key clinical variables such as diagnosis, treatment, and
        participant characteristics.
      </p>
      <div className={classes.figureContainer}>
        <img
          src={figure13}
          className={`${classes.figureImage} ${classes.figureImageNarrow}`}
          alt="C3DC Cohort Analyzer landing page with three example cohorts"
        />
      </div>
      <div className={classes.figureText}>
        Figure 13: C3DC Cohort Analyzer landing page
      </div>

      <p>
        Users can toggle comparisons using radio buttons to explore comparisons
        between participant IDs, diagnoses and treatments. Users may export
        results in CSV or JSON formats or export cohort selections into the C3DC
        Explore Dashboard or CCDI Hub Explore Dashboard for additional analysis
        or to find files associated with cohort.
      </p>

      <div className={classes.sectionSubTitle}>Customizable Properties</div>
      <p>
        The radio buttons allow users to select different properties for
        comparison. The Venn diagram of Participant ID shows the number of
        participants shared between different sets, while the Venn diagrams of
        Diagnosis or Treatment display the number of unique values under each
        category.
      </p>

      <div className={classes.sectionSubTitle}>
        Enhanced Analytical Capabilities
      </div>
      <p>
        Users will be able to visualize overlaps and unique attributes within
        each cohort. In addition, users can:
      </p>
      <ul>
        <li>
          Investigate specific sections of the Venn diagram to view
          participant-level details from the corresponding table view.
        </li>
        <li>
          Export results, including the data table, histograms, and Venn
          diagram, for further analysis or integration into other platforms.
        </li>
        <li>
          Use advanced filters to refine cohort comparisons, such as narrowing
          by treatment or specific diagnosis.
        </li>
        <li>
          Download results: The cohort results can be downloadable as a CSV with
          individual high-level metadata or a JSON file with comprehensive
          metadata, including CPI synonyms.
        </li>
        <li>
          Build in Explore Dashboard: Export analyses into a pre-filtered view
          within the Explore Dashboard for streamlined review and exploration.
        </li>
        <li>
          “Add Example Cohorts” button allows user to explore cohort analyzer
          features easily by adding 3 mock cohorts.
        </li>
      </ul>

      <div className={classes.sectionSubTitle}>Cohort Analyzer Tutorial</div>
      <p>
        To start using the Cohort Analyzer, users will first need to select the
        cohorts they want to analyze. As cohorts are added, the system will
        automatically keep track of the cohorts on the left side Cohort
        Selector.
      </p>
      <p>
        Select the first cohort by clicking the checkbox in the Cohort Selector
        sidebar. The Venn diagram and table update to display cohort information
        based on the selected radio button (Participant ID, Diagnosis, or
        Treatment). By default, histograms for Sex at Birth, Race, and Treatment
        Outcome, as well as a Kaplan–Meier survival plot with accompanying risk
        table, are displayed. Users can also click the Add Chart to show an
        additional histogram for Treatment Type. The corresponding Table View
        shows the list of participants in the selected Cohort.
      </p>
      <div className={classes.figureContainer}>
        <img
          src={figure14}
          className={classes.figureImage}
          alt="Cohort Analyzer summary and table views with one cohort selected"
        />
      </div>
      <div className={classes.figureText}>Figure 14: One Cohort Selected</div>

      <p>
        Select another cohort in the Cohort Selector to see the results update.
        This time, if there are common participants between both cohorts, the
        diagram will show the shared participants in the intersection between
        the two. Clicking the Diagnosis radio button shows a Venn diagram of
        unique and shared diagnosis values between two cohorts. In the Table
        View with none of the Venn diagram selected, it will display all
        participants and their respective cohort. Selecting part of the Venn
        diagram will update the table content accordingly. With a section
        selected, a user can also create an entirely new cohort with these
        filtered participants by clicking the “Create New Cohort” button in the
        Table View.
      </p>
      <p>
        Note that the number in parentheses by the cohort&apos;s name in the
        Venn diagram represents the count of unique records for that radio
        button selection. The number inside the Venn diagram sections are the
        count of unique values for that radio button selection. Finally, the
        count next to a cohort in the Cohort Selection side bar indicates the
        total participants in the cohort.
      </p>
      <div className={classes.figureContainer}>
        <img
          src={figure15}
          className={`${classes.figureImage} ${classes.figureImageNarrow}`}
          alt="Cohort Analyzer with two cohorts selected"
        />
      </div>
      <div className={classes.figureText}>Figure 15: Two Cohorts Selected</div>
    </div>
  </div>
);

export default AnalyzingCohortsSection;
