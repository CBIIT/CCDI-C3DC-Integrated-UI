jest.mock('use-reducer-logger', () => ({
  __esModule: true,
  default: (reducer) => reducer,
}));

jest.mock('@bento-core/tool-tip', () => ({ children }) => children);

jest.mock('../../../src/utils/graphqlClient', () => ({ query: jest.fn() }));

import DEFAULT_CONFIG from '../../../src/components/CohortModal/config';
import { confirmationTypes } from '../../../src/components/CohortModal/components/shared/ConfirmationModal';
import { CohortList, CohortDetails } from '../../../src/components/CohortModal/components';
import CohortListDefault from '../../../src/components/CohortModal/components/CohortList';
import CohortDetailsDefault from '../../../src/components/CohortModal/components/CohortDetails';
import ParticipantList from '../../../src/components/CohortModal/components/CohortDetails/components/ParticipantList';
import {
  ActionButtons,
  CohortMetadata,
  ParticipantList as ParticipantListNamed,
} from '../../../src/components/CohortModal/components/CohortDetails/components';
import {
  ParticipantTable,
  SearchBar,
} from '../../../src/components/CohortModal/components/CohortDetails/components/ParticipantList/components';

describe('Cohort modal config', () => {
  it('should expose the default modal title and confirmation types', () => {
    expect(DEFAULT_CONFIG.config.title).toBe('View of All Cohorts');
    expect(confirmationTypes.DELETE_SINGLE_COHORT).toBeDefined();
  });

  it('should re-export the cohort modal feature components', () => {
    expect(CohortList).toBe(CohortListDefault);
    expect(CohortDetails).toBe(CohortDetailsDefault);
    expect(ParticipantList).toBe(ParticipantListNamed);
    expect(ActionButtons).toBeDefined();
    expect(CohortMetadata).toBeDefined();
    expect(ParticipantTable).toBeDefined();
    expect(SearchBar).toBeDefined();
  });
});
