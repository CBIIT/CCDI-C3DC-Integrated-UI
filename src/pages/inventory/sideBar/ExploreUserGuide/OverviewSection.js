import React from 'react';
import figure1 from '../../../../assets/explore/Figure1.jpg';

const OverviewSection = ({ classes }) => (
  <>
    <div id="Overview" className={classes.sectionTitle}>
      Overview
    </div>
    <div className={classes.contentContainer}>
      <p>The <a href="/exploreParticipants">CCDI Hub Explore Dashboard</a> is a tool that allows for the exploration of participant-level, diagnoses, studies, samples, and files information for CCDI-managed data sets. The Explore Dashboard enables researchers to find CCDI data within a single study or across multiple studies and create synthetic cohorts based on filtered search (i.e., demographics, diagnosis, samples, etc.). Upon interaction with these filters (Figure 1A), users can review the open-access information through visual summaries (Figure 1B) and browse the row level data in tabs organized by participants, diagnosis, studies, samples, and files (Figure 1C) to determine which data sets are applicable to their research questions. Users can then add desired files to the cart (Figure 1D), from which they can download a manifest for the selected data or take the manifest directly into the CGC. To access the controlled data, users must request them at the <a className={classes.link} href="https://dbgap.ncbi.nlm.nih.gov/aa/wga.cgi?page=login" target="_blank" rel="noopener noreferrer">controlled-access login page on dbGaP</a>. Note that bulk downloads are only possible through Command Line Interface (CLI) client as described in Appendices B and C.</p>
      <div className={classes.figureContainer}>
        <img src={figure1} style={{ width: '40%' }} alt="Figure1" />
      </div>
      <div className={classes.figureText}>
        Figure 1: CCDI Hub Explore Dashboard and Cart features
      </div>
      <p>Step-by-step instructions for finding and exporting data are included below.</p>
    </div>
  </>
);

export default OverviewSection;
