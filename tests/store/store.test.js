jest.mock('../../src/utils/graphqlClient', () => ({
  __esModule: true,
  default: { query: jest.fn() },
}));

import hubReducer, {
  initialState,
  RECIEVE_STATS,
  REQUEST_STATS,
  READY_STATS,
  STATS_QUERY_ERR,
} from '../../src/store/StatsState';

describe('hub stats reducer', () => {
  it('should return the initial state and ignore unknown actions', () => {
    expect(hubReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
    expect(hubReducer(initialState, { type: 'OTHER' })).toBe(initialState);
  });

  it('should store received stats, errors, and loading flags', () => {
    const received = hubReducer(initialState, {
      type: RECIEVE_STATS,
      payload: { data: [{ n: 1 }] },
    });
    expect(received.isFetched).toBe(true);
    expect(received.data).toEqual([{ n: 1 }]);

    const failed = hubReducer(received, { type: STATS_QUERY_ERR, error: 'nope' });
    expect(failed.hasError).toBe(true);
    expect(failed.error).toBe('nope');

    const ready = hubReducer(initialState, { type: READY_STATS });
    expect(ready.isFetched).toBe(true);
    expect(ready.isLoading).toBe(false);

    const loading = hubReducer(initialState, { type: REQUEST_STATS });
    expect(loading.isLoading).toBe(true);
  });
});

describe('redux store', () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    jest.resetModules();
  });

  it('should create the test store and accept an injected reducer', () => {
    jest.resetModules();
    process.env.NODE_ENV = 'production';
    const store = require('../../src/store').default;
    expect(store.getState().layout).toBeDefined();
    store.injectReducer('extraSlice', (state = { n: 1 }) => state);
    expect(store.getState().extraSlice).toEqual({ n: 1 });
  });

  it('should create the development store with the logger middleware', () => {
    jest.resetModules();
    process.env.NODE_ENV = 'development';
    const store = require('../../src/store').default;
    expect(store.getState().stats).toBeDefined();
    expect(store.getState().cohortAnalyzerLayout).toBeDefined();
  });
});
