jest.mock('../../../src/utils/graphqlClient', () => ({
  __esModule: true,
  default: {
    query: (...args) => global.__caQuery(...args),
  },
}));

jest.mock('../../../src/bento/cohortAnalyzerPageData', () => ({
  analyzer_query: ['Q0', 'Q1', 'Q2'],
  responseKeys: ['participants', 'diagnoses', 'treatments'],
}));

jest.mock('../../../src/pages/CohortAnalyzer/CohortAnalyzerUtil/CohortAnalyzerUtil', () => ({
  generateQueryVariable: (...args) => global.__genVars(...args),
  getIdsFromCohort: (...args) => global.__ids(...args),
  getDisplayIdsFromCohort: (...args) => global.__displayIds(...args),
  getAllIds: (...args) => global.__allIds(...args),
  filterAllParticipantWithDiagnosisName: (info, rows) => rows.filter((row) => row.keepDx),
  filterAllParticipantWithTreatmentType: (info, rows) => rows.filter((row) => row.keepTx),
  addCohortColumn: (rows) => rows.map((row) => ({ ...row, cohort: true })),
}));

import { getJoinedCohortData } from '../../../src/pages/CohortAnalyzer/CohortAnalyzerUtil/CohortDataTransform';

const state = {
  c1: {
    participants: [{ participant_id: 'P1', id: 'uuid-1' }],
  },
};

function harness(overrides = {}) {
  const calls = {
    setQueryVariable: jest.fn(),
    setRowData: jest.fn(),
    setCohortData: jest.fn(),
  };
  getJoinedCohortData({
    nodeIndex: 0,
    selectedCohorts: ['c1'],
    state,
    generalInfo: {},
    searchValue: '',
    location: {},
    ...calls,
    ...overrides,
  });
  return calls;
}

async function flush() {
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
}

describe('getJoinedCohortData', () => {
  beforeEach(() => {
    global.__genVars = jest.fn(() => ({ participant_pk: ['uuid-1', null], id: ['P1'] }));
    global.__ids = jest.fn(() => ['uuid-1']);
    global.__displayIds = jest.fn(() => ['P1']);
    global.__allIds = jest.fn(() => ['uuid-1', null]);
    global.__caQuery = jest.fn(() => Promise.resolve({
      data: {
        participants: [
          { id: 'uuid-1', participant_id: 'P1', site: 'A' },
          null,
        ],
        diagnoses: [
          {
            id: 'dx-1',
            diagnosis_id: null,
            participant: { id: 'uuid-1', participant_id: 'P1', study_id: 'S1' },
            keepDx: true,
          },
          {
            id: 'dx-2',
            diagnosis_id: 'DX2',
            participant_id: 'P1',
            study_id: 'S1',
            keepDx: true,
          },
          { id: 'skip' },
          null,
        ],
        treatments: [
          { id: null, treatment_id: 'T1', participant_id: 'P1', study_id: 'S1', keepTx: true },
          { id: 't-id', treatment_id: null, participant_id: 'P2', study_id: 'S1', keepTx: false },
          { participant_id: null },
          null,
        ],
      },
    }));
  });

  it('should clear rows when the node has no query', async () => {
    const calls = harness({ nodeIndex: 9 });
    expect(calls.setRowData).toHaveBeenCalledWith([]);
    expect(global.__caQuery).not.toHaveBeenCalled();
  });

  it('should join participant rows, search them, and ignore an empty id list', async () => {
    const calls = harness();
    await flush();
    expect(calls.setRowData).toHaveBeenCalled();
    expect(calls.setCohortData).toHaveBeenCalled();
    const variables = calls.setQueryVariable.mock.calls[0][0];
    expect(variables.id).toEqual(['uuid-1']);
    expect(variables.participant_pk).toEqual(['uuid-1']);

    const searched = harness({ searchValue: 'P1' });
    await flush();
    expect(searched.setRowData.mock.calls[0][0][0].participant_id).toBe('P1');

    global.__genVars = jest.fn(() => ({ participant_pk: [], id: [] }));
    const empty = harness({ location: { state: { cohort: { cohortId: 'c1' } } } });
    await flush();
    expect(empty.setRowData).not.toHaveBeenCalled();

    const cleared = harness({ location: {} });
    await flush();
    expect(cleared.setRowData).toHaveBeenCalledWith([]);

    const scoped = harness({ generalInfo: { reset: false } });
    await flush();
    expect(global.__allIds).toHaveBeenCalled();
  });

  it('should transform nested and flat diagnosis rows', async () => {
    const calls = harness({ nodeIndex: 1, generalInfo: { section: 'venn' }, searchValue: 'P1' });
    await flush();
    expect(calls.setRowData.mock.calls[0][0].every((row) => row.keepDx)).toBe(true);

    const unfiltered = harness({ nodeIndex: 1, generalInfo: {} });
    await flush();
    expect(unfiltered.setCohortData).toHaveBeenCalled();

    global.__ids = jest.fn(() => []);
    global.__displayIds = jest.fn(() => ['P1', 'P2']);
    const displayOnly = harness({ nodeIndex: 1, generalInfo: { section: 'venn' } });
    await flush();
    expect(displayOnly.setQueryVariable.mock.calls[0][0].id).toEqual(['P1', 'P2']);

    global.__displayIds = jest.fn(() => []);
    const none = harness({ nodeIndex: 1, location: { state: { cohort: { cohortId: 'c1' } } } });
    await flush();
    expect(none.setRowData).not.toHaveBeenCalled();

    const cleared = harness({ nodeIndex: 1, location: null });
    await flush();
    expect(cleared.setRowData).toHaveBeenCalledWith([]);
  });

  it('should transform treatment rows and allow duplicate cohort matches', async () => {
    const calls = harness({ nodeIndex: 2, generalInfo: { section: 'venn' }, searchValue: 'P1' });
    await flush();
    expect(calls.setRowData.mock.calls[0][0][0].treatment_pk).toBe('T1');

    const plain = harness({ nodeIndex: 2, generalInfo: {} });
    await flush();
    expect(plain.setCohortData).toHaveBeenCalled();

    global.__ids = jest.fn(() => []);
    global.__displayIds = jest.fn(() => []);
    const cleared = harness({ nodeIndex: 2, location: undefined });
    await flush();
    expect(cleared.setRowData).toHaveBeenCalledWith([]);

    global.__caQuery = jest.fn(() => Promise.resolve({
      data: { treatments: null, diagnoses: null, participants: null },
    }));
    const missing = harness({ nodeIndex: 2, generalInfo: {} });
    await flush();
    expect(missing.setRowData).toHaveBeenCalled();
  });
});
