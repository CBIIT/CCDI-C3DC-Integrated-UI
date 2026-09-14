import React from 'react';
import { useQuery } from '@apollo/client';
import CircularProgress from '@material-ui/core/CircularProgress';
import StatsView from './StatsView';
import { Typography } from '../../components/Wrappers/Wrappers';
import { GET_GLOBAL_STATS_DATA_QUERY } from '../../bento/globalStatsData';

const globalStatsController = () => {
  const { loading, error, data } = useQuery(GET_GLOBAL_STATS_DATA_QUERY, {
    fetchPolicy: 'no-cache',
  });

  if (loading) return <CircularProgress />;
  if (error) {
    return (
      <Typography variant="h5" color="error" size="sm">
        {error && `An error has occurred in loading stats component: ${error}`}
      </Typography>
    );
  }

  return <StatsView data={(data && data.searchParticipants) || {}} />;
};

export default globalStatsController;
