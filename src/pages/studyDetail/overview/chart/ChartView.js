import React from 'react';
import { withStyles } from '@material-ui/core';
import styles from './ChartStyle';

const DEFAULT_COLORS = [
  '#4555AB',
  '#9FD1D6',
  '#137E87',
  '#99A4E4',
  '#CB2809',
  '#DFC798',
  '#CECECE',
  '#E8A87C',
  '#6B7280',
];

const ChartView = ({
  data,
  classes,
  categoryHeader = 'CATEGORY',
  valueHeaderLines = ['Number of', 'Participants'],
  isModalView = false,
  chartId = 'study-profile-chart',
}) => {
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  const maxSubjects = Math.max(...data.map((entry) => entry.subjects), 1);

  return (
    <div
      id={chartId}
      className={isModalView ? classes.chartWrapperModal : classes.chartWrapper}
    >
      <div className={classes.chartHeader}>
        <span className={classes.categoryHeader}>{categoryHeader}</span>
        <span className={classes.barHeader} aria-hidden="true" />
        <span className={classes.valueHeader}>
          {valueHeaderLines.map((line) => (
            <span key={line} className={classes.valueHeaderLine}>{line}</span>
          ))}
        </span>
      </div>
      <div className={isModalView ? classes.chartBodyModal : classes.chartBody}>
        {data.map((entry, index) => {
          const barWidth = (entry.subjects / maxSubjects) * 100;

          return (
            <div key={`${entry.group}-${index}`} className={classes.chartRow}>
              <div className={classes.rowLabel}>{entry.group}</div>
              <div className={classes.rowBarTrack}>
                <div
                  className={classes.rowBar}
                  style={{
                    width: `${barWidth}%`,
                    backgroundColor: DEFAULT_COLORS[index % DEFAULT_COLORS.length],
                  }}
                />
              </div>
              <div className={classes.rowValue}>
                {entry.subjects.toLocaleString('en-US')}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default withStyles(styles)(ChartView);
