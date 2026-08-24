import React from 'react';
import figure14 from '../../../../assets/explore/Figure14.png';
import figure15 from '../../../../assets/explore/Figure15.png';
import figure16 from '../../../../assets/explore/Figure16.png';

const CartManifestSection = ({ classes }) => (
  <div>
    <div id="Creating an Exportable File Manifest from the Cart" className={classes.sectionTitle}>
      Creating an Exportable File Manifest from the Cart
    </div>
    <div className={classes.contentContainer}>
      <p>In addition to the study-specific downloads, you can also export each row-level metadata element for CCDI participants, diagnoses, samples, or files based on your selections within the Explore Dashboard. Here’s how to create a manifest file of filtered information on the Explore Dashboard:</p>
      <ol>
        <li>On the results tables of the Explore Dashboard, you can select a row of metadata using the checkbox at the start of the row. Multiple rows can be selected within a table, even across pages of the table. Use the checkbox at the top of the checkbox column to select or deselect all rows.</li>
        <li>
          After selecting desired rows, add files for that element to the My Files shopping cart (Figure 14) by clicking either the “ADD ALL FILTERED FILES” or “ADD SELECTED FILES” button. Note that selection of items in each tab depends on the specific content of that tab. For example, selecting an item in the “Participants” tab means every file associated with a participant will be added to the My Files shopping cart, whereas selecting an item in the “Files” tab will add that single selected file to the cart.
          <div className={classes.figureContainer}><img src={figure14} style={{ width: '80%' }} alt='Figure 14' /></div>
          <div className={classes.figureText}>Figure 14: Selection checkboxes and buttons to add files to the cart for the “Participants” table</div>
        </li>
        <li>
          To navigate to the shopping cart, select “MY FILES” or the shopping cart icon on the menu bar (Figure 15).
          <div className={classes.figureContainer}><img src={figure15} style={{ width: '80%' }} alt='Figure 15' /></div>
          <div className={classes.figureText}>Figure 15: CCDI Hub menu bar with red box highlighting the My Files shopping cart</div>
        </li>
        <li>
          The shopping cart feature enables you to select and manage files. It’s a simple way to keep track of data and files during your session. Selecting the “DOWNLOAD MANIFEST” button from the “AVAILABLE EXPORT OPTIONS” dropdown menu (Figure 16) will produce a comma-separated values (CSV) file manifest of the items within the cart.
          <div className={classes.figureContainer}><img src={figure16} style={{ width: '90%' }} alt='Figure 16' /></div>
          <div className={classes.figureText}>Figure 16: The Explore Dashboard Cart page with red box highlighting the “Available Export Options” button</div>
        </li>
        <li>You can then download this manifest file locally or upload it in the CGC (Appendix C). Similarly, you can instead select the “EXPORT TO CANCER GENOMICS CLOUD” button from the “AVAILABLE EXPORT OPTIONS” dropdown menu to load the resulting manifest directly into your CGC account.</li>
      </ol>
      <p>Note that the Cart has a maximum capacity of 200,000 files, which may limit the ability to create very large manifests for use in the CGC. Should you need to create a manifest containing more than 100,000 files, you can either create manifests from the cart in batches (containing up to 100,000 files in each batch) or use the comprehensive metadata downloads from the Explore page “Studies” tab to create a manifest that can take all data for a given study into the CGC. Longer term solutions are being researched.</p>
    </div>
  </div>
);

export default CartManifestSection;