import React from 'react';
import figure9 from '../../../../assets/explore/Figure9.jpg';
import figure10 from '../../../../assets/explore/Figure10.jpg';

const CartManifestSection = ({ classes }) => (
  <div>
    <div
      id="Creating an Exportable File Manifest from the Cart"
      className={classes.sectionTitle}
    >
      Creating an Exportable File Manifest from the Cart
    </div>
    <div className={classes.contentContainer}>
      <p>
        In addition to the study-specific downloads, users can also export each
        row-level metadata element based on their selections within the Explore
        Dashboard. Here’s how to create a manifest file of filtered information
        on the Explore Dashboard:
      </p>
      <ol>
        <li>
          On the Files tab of the Explore Files view, users can select a row
          using the checkbox at the start of the row. Multiple rows can be
          selected within a table, even across pages of the table. Use the
          checkbox at the top of the checkbox column to select or deselect all
          rows.
        </li>
        <li>
          After selecting desired rows, add files for that element to the My
          Files shopping cart by clicking either the “ADD ALL FILTERED FILES” or
          “ADD SELECTED FILES” button. Note that selection of items in each tab
          depends on the specific content of that tab. For example, selecting an
          item in the “Participants” tab means every file associated with a
          participant will be added to the My Files shopping cart, whereas
          selecting an item in the “Files” tab will add that single selected
          file to the cart.
        </li>
        <li>
          To navigate to the shopping cart, select “MY FILES” or the shopping
          cart icon on the menu bar (Figure 9).
          <div className={classes.figureContainer}>
            <img
              src={figure9}
              className={classes.figureImage}
              alt="C3DC menu bar with the My Files shopping cart highlighted"
            />
          </div>
          <div className={classes.figureText}>
            Figure 9: CCDI Hub menu bar with box highlighting the My Files
            shopping cart
          </div>
        </li>
        <li>
          The shopping cart feature enables users to select and manage files.
          It’s a simple way to keep track of data and files during a session.
          Selecting the “DOWNLOAD MANIFEST” button from the “AVAILABLE EXPORT
          OPTIONS” dropdown menu (Figure 10) will produce a comma-separated
          values (CSV) file manifest of the items within the cart.
          <div className={classes.figureContainer}>
            <img
              src={figure10}
              className={classes.figureImage}
              alt="My Files page with the Available Export Options menu open"
            />
          </div>
          <div className={classes.figureText}>
            Figure 10: The Explore Dashboard Cart page with red box highlighting
            the “Available Export Options” button
          </div>
        </li>
        <li>
          Users can then download this manifest file locally or upload it in the
          CGC (see full user guide for more information). Similarly, users can
          instead select the “EXPORT TO CANCER GENOMICS CLOUD” button from the
          “AVAILABLE EXPORT OPTIONS” dropdown menu to load the resulting
          manifest directly into their CGC account.
        </li>
      </ol>
      <p>
        Note that the Cart has a maximum capacity of 200,000 files, which may
        limit the ability to create very large manifests for use in the CGC.
        Should users need to create a manifest containing more than 200,000
        files, they can either create manifests from the cart in batches
        (containing up to 200,000 files in each batch) or use the comprehensive
        metadata downloads from the Explore page “Studies” tab to create a
        manifest that can take all data for a given study into the CGC.
      </p>
    </div>
  </div>
);

export default CartManifestSection;
