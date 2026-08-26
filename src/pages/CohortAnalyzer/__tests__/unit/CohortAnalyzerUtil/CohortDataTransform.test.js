import client from '../../../../../utils/graphqlClient';
import { getJoinedCohortData } from '../../../CohortAnalyzerUtil/CohortDataTransform';

jest.mock('../../../../../utils/graphqlClient', () => ({
  __esModule: true,
  default: { query: jest.fn() },
}));

jest.mock('../../../../../bento/cohortAnalyzerPageData', () => ({
  analyzer_query: [{ query: 'PARTICIPANTS' }, { query: 'DIAGNOSIS' }, { query: 'TREATMENT' }],
  responseKeys: ['participants', 'diagnosis', 'treatmentOverview'],
}));

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('CohortDataTransform', () => {
  const state = {
    'cohort-a': {
      cohortName: 'Cohort A',
      participants: [{ participant_pk: 'pk1', participant: { id: 'pk1', participant_id: 'P1' } }],
    },
  };

  beforeEach(() => {
    client.query.mockReset();
    client.query.mockResolvedValue({
      data: {
        participants: [
          { id: 'pk1', participant_id: 'P1', participant: { id: 'pk1', participant_id: 'P1' } },
        ],
      },
    });
  });

  it('fetches participant rows for nodeIndex 0', async () => {
    const setRowData = jest.fn();
    const setQueryVariable = jest.fn();
    const setCohortData = jest.fn();

    await getJoinedCohortData({
      nodeIndex: 0,
      selectedCohorts: ['cohort-a'],
      state,
      generalInfo: {},
      searchValue: '',
      setQueryVariable,
      setRowData,
      location: {},
      setCohortData,
    });
    await flushPromises();

    expect(client.query).toHaveBeenCalled();
    expect(setQueryVariable).toHaveBeenCalled();
    expect(setRowData).toHaveBeenCalled();
  });

  it('filters row data by search value', async () => {
    const setRowData = jest.fn();

    await getJoinedCohortData({
      nodeIndex: 0,
      selectedCohorts: ['cohort-a'],
      state,
      generalInfo: {},
      searchValue: 'NO_MATCH',
      setQueryVariable: jest.fn(),
      setRowData,
      location: {},
      setCohortData: jest.fn(),
    });
    await flushPromises();

    expect(setRowData).toHaveBeenCalledWith([]);
  });

  it('clears row data when no participant pks and no navigation cohort', async () => {
    const setRowData = jest.fn();
    client.query.mockResolvedValueOnce({ data: { participants: [] } });

    await getJoinedCohortData({
      nodeIndex: 0,
      selectedCohorts: [],
      state: {},
      generalInfo: {},
      searchValue: '',
      setQueryVariable: jest.fn(),
      setRowData,
      location: {},
      setCohortData: jest.fn(),
    });
    await flushPromises();

    expect(setRowData).toHaveBeenCalledWith([]);
  });

  describe('treatmentOverview participant filter', () => {
    const treatmentState = {
      'Example Cohort 1': {
        cohortName: 'Example Cohort 1',
        participants: [
          { id: '2d1c334a-6239-51d5-9699-37c73b77aa80', participant_id: 'PBBPGL', study_id: 'phs002790' },
          { id: 'c6dc811c-0833-5eb8-800a-a053a7c197ea', participant_id: 'PBBWJX', study_id: 'phs002790' },
        ],
      },
    };

    const treatmentRows = [
      {
        id: null,
        participant_id: 'PBBWJX',
        study_id: 'phs002790',
        treatment_id: '158aee77-db56-5f46-8440-0facce60144f',
        treatment_type: ['Surgery'],
        treatment_agent: ['Resection'],
      },
    ];

    const runTreatmentFetch = async (overrides = {}) => {
      const setQueryVariable = jest.fn();
      const setRowData = jest.fn();
      const setCohortData = jest.fn();
      client.query.mockResolvedValueOnce({ data: { treatmentOverview: treatmentRows } });

      await getJoinedCohortData({
        nodeIndex: 2,
        selectedCohorts: ['Example Cohort 1'],
        state: treatmentState,
        generalInfo: {},
        searchValue: '',
        setQueryVariable,
        setRowData,
        location: {},
        setCohortData,
        ...overrides,
      });
      await flushPromises();
      return { setQueryVariable, setRowData, setCohortData };
    };

    it('sends participant UUIDs on pid and leaves participant_ids empty', async () => {
      const { setQueryVariable } = await runTreatmentFetch();

      const variables = setQueryVariable.mock.calls[0][0];
      expect(variables.pid).toEqual([
        '2d1c334a-6239-51d5-9699-37c73b77aa80',
        'c6dc811c-0833-5eb8-800a-a053a7c197ea',
      ]);
      // The backend ANDs pid with participant_ids, so only one may be populated.
      expect(variables.id).toEqual([]);
      expect(client.query).toHaveBeenCalledWith(
        expect.objectContaining({ variables: expect.objectContaining({ pid: expect.any(Array) }) }),
      );
    });

    it('falls back to display participant_ids when a participant has no UUID', async () => {
      const { setQueryVariable } = await runTreatmentFetch({
        state: {
          'Example Cohort 1': {
            cohortName: 'Example Cohort 1',
            participants: [
              { id: '2d1c334a-6239-51d5-9699-37c73b77aa80', participant_id: 'PBBPGL' },
              { participant_id: 'PBBWJX' },
            ],
          },
        },
      });

      const variables = setQueryVariable.mock.calls[0][0];
      expect(variables.pid).toEqual([]);
      expect(variables.id).toEqual(['PBBPGL', 'PBBWJX']);
    });

    it('keeps the cohort participant UUID when merging treatment rows', async () => {
      const { setCohortData } = await runTreatmentFetch();

      const merged = setCohortData.mock.calls[0][0]['Example Cohort 1'].participants;
      const participant = merged.find((p) => p.participant_id === 'PBBWJX');
      expect(participant.id).toBe('c6dc811c-0833-5eb8-800a-a053a7c197ea');
      expect(participant.treatment_type).toEqual(['Surgery']);
    });

    it('tags treatment rows with their cohort and filters by selected treatment type', async () => {
      const { setRowData } = await runTreatmentFetch({
        generalInfo: { 'Example Cohort 1 (2)': ['Surgery'] },
      });

      const rows = setRowData.mock.calls[0][0];
      expect(rows).toHaveLength(1);
      expect(rows[0].participant_id).toBe('PBBWJX');
      expect(rows[0].cohort).toEqual([{ color: '#F0D571', cohort: 'Example Cohort 1' }]);
    });
  });
});
