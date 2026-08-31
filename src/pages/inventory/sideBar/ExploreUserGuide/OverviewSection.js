import React from 'react';
import figure1 from '../../../../assets/explore/Figure1.jpg';

const OverviewSection = ({ classes }) => (
  <>
    <div id="Overview" className={classes.sectionTitle}>
      Overview
    </div>
    <div className={classes.contentContainer}>
      <p>
        The C3DC Explore Dashboard in an open-access application which helps researchers find and use deidentified, participant-level clinical data from childhood cancer studies. These data have been harmonized to standard common data elements (CDEs) to facilitate efficient and effective data integration and analysis of participant data across studies. In the C3DC Explore Dashboard users can filter the harmonized data using facets based on properties and values defined in the <a href="https://github.com/CBIIT/c3dc-model" target="_blank" rel="noopener noreferrer">C3DC Data Model</a>. Upon interaction with these filters (Figure 1A), users can review clinical information through visual summaries (Figure 1B) and browse the row-level data in tabs organized by studies and participants as well as diagnosis, treatment, treatment response, survival data, and genetic analysis (Figure 1C) to determine which data sets are applicable to their research questions. Users can then download tabular metadata in the format of CSV or JSON (Figure 1D) or add files to the cart to create a data manifest. Users can also build and manage synthetic cohorts, which can be compared in the C3DC Cohort Analyzer.
      </p>
      <div className={classes.figureContainer}>
        <img src={figure1} className={classes.figureImage} alt="C3DC Explore Dashboard features labeled A through D" />
      </div>
      <div className={classes.figureText}>Figure 1: C3DC Explore Dashboard Features</div>
      <p>Step-by-step instructions for finding and exporting data are included below.</p>
    </div>
  </>
);

export default OverviewSection;
