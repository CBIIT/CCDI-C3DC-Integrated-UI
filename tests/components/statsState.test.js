import dashboardReducer, {
  fetchDataForStats,
  initialState,
  READY_STATS,
  RECIEVE_STATS,
  REQUEST_STATS,
  STATS_QUERY_ERR,
} from '../../src/components/Stats/StatsState';
import client from '../../src/utils/graphqlClient';

jest.mock('../../src/utils/graphqlClient', () => ({
  query: jest.fn(),
}));

describe('StatsState', () => {
  describe('Reducer', () => {
    it('should return the initial state by default', () => {
      expect(dashboardReducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
    });

    it('should store received stats', () => {
      const next = dashboardReducer(initialState, {
        type: RECIEVE_STATS,
        payload: { data: { numberOfStudies: 4 } },
      });

      expect(next).toEqual(expect.objectContaining({
        isFetched: true,
        isLoading: false,
        hasError: false,
        data: { numberOfStudies: 4 },
      }));
    });

    it('should store query errors and mark stats as ready or loading', () => {
      const errorState = dashboardReducer(initialState, {
        type: STATS_QUERY_ERR,
        error: 'network',
      });
      expect(errorState.hasError).toBe(true);
      expect(errorState.error).toBe('network');

      expect(dashboardReducer(errorState, { type: READY_STATS })).toEqual(
        expect.objectContaining({ isFetched: true, isLoading: false }),
      );
      expect(dashboardReducer(initialState, { type: REQUEST_STATS }).isLoading).toBe(true);
    });
  });

  describe('fetchDataForStats', () => {
    const dispatch = jest.fn((action) => (
      typeof action === 'function' ? action(dispatch, () => ({
        stats: { isFetched: false },
        login: { isSignedIn: false },
      })) : action
    ));

    beforeEach(() => {
      dispatch.mockClear();
      client.query.mockReset();
    });

    it('should fetch stats through the public service when they are not cached', async () => {
      client.query.mockResolvedValue({ data: { numberOfStudies: 7 } });
      await fetchDataForStats()(dispatch, () => ({
        stats: { isFetched: false },
        login: { isSignedIn: false },
      }));

      expect(client.query).toHaveBeenCalledWith(expect.objectContaining({
        context: { clientName: 'publicService' },
      }));
      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: RECIEVE_STATS,
        payload: { data: { numberOfStudies: 7 } },
      }));
    });

    it('should use the authenticated client and record query failures', async () => {
      client.query.mockRejectedValue(new Error('timeout'));
      await fetchDataForStats()(dispatch, () => ({
        stats: { isFetched: false },
        login: { isSignedIn: true },
      }));

      expect(client.query).toHaveBeenCalledWith(expect.objectContaining({
        context: { clientName: '' },
      }));
      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: STATS_QUERY_ERR,
      }));
    });

    it('should skip the network when stats are already fetched', () => {
      const result = fetchDataForStats()(dispatch, () => ({
        stats: { isFetched: true },
      }));

      expect(client.query).not.toHaveBeenCalled();
      expect(result).toEqual({ type: READY_STATS });
    });
  });
});
