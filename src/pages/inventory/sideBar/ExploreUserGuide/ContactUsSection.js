import React from 'react';

const ContactUsSection = ({ classes }) => (
  <div>
    <div id="Contact Information" className={classes.sectionTitle}>
      Contact Information
    </div>
    <div className={classes.contentContainer}>
      <p>
        Please direct any questions or requests for further information to the{" "}
        <a href="mailto:NCIChildhoodCancerDataInitiative@mail.nih.gov">
          CCDI mailbox
        </a>
        .
      </p>
    </div>
  </div>
);

export default ContactUsSection;
