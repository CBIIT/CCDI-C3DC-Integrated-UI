import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import StatsBar from '@bento-core/stats-bar';
import { statsStyling, globalStatsData } from '../../bento/globalStatsData';

// // The package reads only selected statsGroup properties from its styles prop.
// const StyledStatsBar = withStyles({ statsGroup: statsStyling.statsGroup })(StatsBar);
const styles = {
  statsGroup: statsStyling.statsGroup,
};

// TODO - see if the variables `data` and `stats` can be merged to begin with
const StatsView = ({ data = {}, classes }) => {
  // Incorporate data into the stats array
  const stats = globalStatsData
    .filter((e) => typeof data[e.statAPI] === 'number')
    .map((e) => ({
      name: e.statTitle,
      val: data[e.statAPI],
      statIconSrc: e.statIconSrc,
      statIconAlt: e.statIconAlt,
    }));

  return (
    <StatsBar
      classes={classes}
      stats={stats}
      styles={statsStyling}
    />
  );
};

export default withStyles(styles)(StatsView);
