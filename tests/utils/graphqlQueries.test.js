jest.mock('@apollo/client', () => ({
  __esModule: true,
  default: (parts) => parts.join(''),
}));

import {
  GET_CASE_DETAIL_DATA_QUERY,
  LANDING_QUERY,
  STATS_QUERY,
} from '../../src/utils/graphqlQueries';

describe('graphqlQueries', () => {
  it('should export the unused legacy case, stats, and landing documents', () => {
    expect(GET_CASE_DETAIL_DATA_QUERY).toContain('subjectDetail');
    expect(STATS_QUERY).toContain('numberOfTrials');
    expect(LANDING_QUERY).toContain('numberOfCases');
  });
});
