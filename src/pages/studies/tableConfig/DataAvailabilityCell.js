import React from 'react';
import { Tooltip, makeStyles } from '@material-ui/core';
import participantFilesIcon from '../../../assets/icons/Participant_Files.svg';
import studyFilesIcon from '../../../assets/icons/Study_Files.svg';
import sampleFilesIcon from '../../../assets/icons/Sample_Files.svg';
import publicationsIcon from '../../../assets/icons/Publications.svg';

const useStyles = makeStyles(() => ({
  cell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    boxSizing: 'border-box',
    padding: '8px 0',
  },
  iconGroup: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '24px',
    flex: '0 0 auto',
    boxSizing: 'border-box',
  },
  iconWrapper: {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: '0 0 40px',
  },
  arrow: {
    '&:before': {
      border: '1px solid #598AC5',
    },
    color: 'white',
  },
  tooltip: {
    backgroundColor: 'white',
    border: '1px solid #598AC5',
    color: '#000000',
    fontFamily: 'Open Sans',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '20px',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
  },
  count: {
    color: '#19676D',
    fontWeight: 600,
    fontSize: '16px',
    marginRight: '4px',
  },
  label: {
    color: '#000000',
    fontSize: '14px',
  },
}));

const AVAILABILITY_ICONS = [
  {
    fieldIndex: 1,
    icon: participantFilesIcon,
    label: 'Participant File(s)',
    alt: 'Participant Files',
  },
  {
    fieldIndex: 0,
    icon: studyFilesIcon,
    label: 'Study File(s)',
    alt: 'Study Files',
  },
  {
    fieldIndex: 2,
    icon: sampleFilesIcon,
    label: 'Sample File(s)',
    alt: 'Sample Files',
  },
  {
    fieldIndex: 3,
    icon: publicationsIcon,
    label: 'Publication(s)',
    alt: 'Publications',
  },
];

/**
 * Data Availability icons for the Studies listing table.
 * Preserves empty slots for missing data types and centers the fixed-width
 * icon group under the column header at any viewport size.
 */
const DataAvailabilityCell = (props) => {
  const classes = useStyles();
  const fields = (props.customCellData && props.customCellData.fields) || [];
  const groupWidth = (props.customCellData && props.customCellData.width) || '400px';

  const icons = AVAILABILITY_ICONS.map((item) => {
    const fieldName = fields[item.fieldIndex];
    const count = fieldName ? (props[fieldName] || 0) : 0;
    return { ...item, count };
  });

  return (
    <div className={classes.cell}>
      <div className={classes.iconGroup} style={{ width: groupWidth }}>
        {icons.map((item) => {
          if (item.count === 0) {
            return <div key={item.alt} className={classes.iconWrapper} aria-hidden />;
          }

          return (
            <Tooltip
              key={item.alt}
              title={(
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span className={classes.count}>{item.count}</span>
                  <span className={classes.label}>{item.label}</span>
                </div>
              )}
              arrow
              placement="top"
              classes={{ arrow: classes.arrow, tooltip: classes.tooltip }}
            >
              <div className={classes.iconWrapper}>
                <img
                  src={item.icon}
                  alt={item.alt}
                  width="26"
                  height="26"
                  style={{ cursor: 'pointer' }}
                />
              </div>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
};

export default DataAvailabilityCell;
