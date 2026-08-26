import client from '../../../utils/graphqlClient';
import { analyzer_query, responseKeys } from '../../../bento/cohortAnalyzerPageData';
import { generateQueryVariable, getIdsFromCohort, getDisplayIdsFromCohort, getAllIds, filterAllParticipantWithDiagnosisName, filterAllParticipantWithTreatmentType, addCohortColumn } from './CohortAnalyzerUtil';

const DEFAULT_QUERY_LIMIT = 10000;

// The backend's `terms` filter rejects null values, so we strip any null/undefined
// entries from id / participant_pk lists before firing the query. This is our last
// line of defense — upstream helpers (generateQueryVariable, getIdsFromCohort,
// getAllIds) should already have filtered them out, but we normalize here so no
// code path can regress.
// Note: `id` holds display participant_ids for diagnosis/treatment overview;
// `pid` holds internal participant UUIDs for treatmentOverview; `participant_pk`
// holds internal UUIDs for participantOverview / manifest.
const sanitizeQueryVariables = (variables = {}) => {
    if (!variables) return variables;
    const next = { ...variables };
    ['id', 'pid', 'participant_pk'].forEach((key) => {
        if (Array.isArray(next[key])) {
            next[key] = next[key].filter((value) => value != null);
        }
    });
    return next;
};

const withDisplayParticipantFilterIds = (displayIds, participantPks = []) => ({
    id: displayIds,
    participant_pk: participantPks,
    first: DEFAULT_QUERY_LIMIT,
});

const withInternalParticipantFilterIds = (participantPks) => ({
    id: participantPks,
    participant_pk: participantPks,
    first: DEFAULT_QUERY_LIMIT,
});

/**
 * treatmentOverview accepts participant UUIDs on `pid` and display participant_ids
 * on `participant_ids` (bound to `$id`). Prefer `pid`, but only when we hold a UUID
 * for every selected participant: the backend ANDs the two filters, so a partial
 * UUID list would silently drop participants that only have a display id (e.g.
 * cohorts built from flat treatment rows, which carry no participant UUID).
 * The unused list is left empty, which the backend treats as "no filter".
 */
const withTreatmentParticipantFilterIds = (participantPks = [], displayIds = []) => {
    const canFilterByPid = participantPks.length > 0
        && participantPks.length >= displayIds.length;
    return {
        pid: canFilterByPid ? participantPks : [],
        id: canFilterByPid ? [] : displayIds,
        participant_pk: participantPks,
        first: DEFAULT_QUERY_LIMIT,
    };
};

const hasParticipantFilter = (queryVariables) => (
    (queryVariables.pid || []).length > 0 || (queryVariables.id || []).length > 0
);


const getJoinedCohortData = async ({
    nodeIndex,
    selectedCohorts,
    state,
    generalInfo = {},
    searchValue = "",
    setQueryVariable,
    setRowData,
    location,
    setCohortData
}) => {
    function transformData(data, type) {
        // Guard against null/undefined entries: GraphQL can legitimately return
        // null items in a list (e.g. if a nullable child field can't be resolved),
        // and destructuring a null row would throw before we got to any data.
        const rows = Array.isArray(data) ? data.filter((row) => row != null) : [];

        // Nested-participant fallback for any overview that still returns it
        // (legacy). Prefer flat top-level participant_id when present.
        const pickParticipantPk = (participant) => {
            if (!participant) return undefined;
            if (participant.id != null) return participant.id;
            if (participant.participant_pk != null) return participant.participant_pk;
            return participant.participant_id;
        };

        if (type === "treatment") {
            // Flat TreatmentOverViewResult — no nested participant, and its
            // top-level `id` is a (usually null) treatment id. Cohorts join on the
            // display participant_id. Deliberately emit no `id` / `participant_pk`:
            // merging a row into cohort state must not overwrite the participant
            // UUID, which is the value we send as the `pid` filter.
            return rows
                .filter((row) => row.participant_id != null)
                .map(({ id, treatment_id, participant_id, study_id, ...rest }) => ({
                    participant_id,
                    study_id,
                    treatment_pk: treatment_id != null ? treatment_id : id,
                    treatment_id,
                    ...rest,
                }));
        } else if (type === "diagnosis") {
            return rows
                .filter((row) => row.participant != null || row.participant_id != null)
                .map((row) => {
                    if (row.participant != null) {
                        const { participant, id, diagnosis_id, ...rest } = row;
                        const pk = pickParticipantPk(participant);
                        return {
                            id: pk,
                            participant_pk: pk,
                            participant_id: participant.participant_id,
                            study_id: participant.study_id,
                            diagnosis_pk: diagnosis_id != null ? diagnosis_id : id,
                            diagnosis_id,
                            ...rest,
                        };
                    }
                    const { id, diagnosis_id, participant_id, study_id, ...rest } = row;
                    return {
                        id: participant_id,
                        participant_pk: participant_id,
                        participant_id,
                        study_id,
                        diagnosis_pk: diagnosis_id != null ? diagnosis_id : id,
                        diagnosis_id,
                        ...rest,
                    };
                });
        } else {
            return rows.map(({ id, participant_id, ...rest }) => ({
                participant_pk: id,
                participant_id: participant_id,
                id: id,
                ...rest,
            }));
        }

    }

    function matchCohortParticipant(existing, incoming) {
        if (incoming.participant_id != null && existing.participant_id === incoming.participant_id) {
            return true;
        }
        const existingKey = existing.id != null ? existing.id : existing.participant_pk;
        const incomingKey = incoming.id != null ? incoming.id : incoming.participant_pk;
        return existingKey != null && existingKey === incomingKey;
    }

    function updatedCohortContent(newParticipantsData) {
        const newState = { ...state };
        selectedCohorts.forEach(cohortId => {
            const existingParticipants = newState[cohortId].participants || [];

            const updatedParticipants = existingParticipants.map(participant => {
                const matchingNewParticipant = newParticipantsData.find(
                    (newParticipant) => matchCohortParticipant(participant, newParticipant)
                );

                if (matchingNewParticipant) {
                    return {
                        ...participant, ...matchingNewParticipant

                    };
                }

                return participant;
            })
            newState[cohortId] = {
                ...newState[cohortId],
                participants: updatedParticipants,
            };

        });
        setCohortData(newState);
    }

    function updatedCohortContentAllowDuplication(newParticipantsData) {
        const newState = { ...state };
        selectedCohorts.forEach(cohortId => {
            const existingParticipants = newState[cohortId].participants || [];


            let finalResponse = [];
            newParticipantsData.forEach((participant) => {
                const matchingExistingParticipants = existingParticipants.find(
                    (existingParticipant) => matchCohortParticipant(existingParticipant, participant)
                );

                if (matchingExistingParticipants) {
                    finalResponse.push({
                        ...matchingExistingParticipants, ...participant
                    })
                }

            })

            newState[cohortId] = {
                ...newState[cohortId],
                participants: finalResponse,
            };

        });
        setCohortData(newState);
    }

    async function getJoinedCohort(isReset = false) {
        let queryVariables = generateQueryVariable(selectedCohorts, state);
        if (Object.keys(generalInfo).length > 0) {
            const participantIds = isReset ? getIdsFromCohort(state, selectedCohorts) : getAllIds(generalInfo);
            queryVariables = withInternalParticipantFilterIds(participantIds);
        } else {
            // participantOverview filters by internal participant id (`id` arg).
            queryVariables = {
                ...queryVariables,
                id: queryVariables.participant_pk || [],
            };
        }
        queryVariables = sanitizeQueryVariables(queryVariables);
        setQueryVariable(queryVariables);
        let { data } = await client.query({
            query: analyzer_query[nodeIndex],
            variables: queryVariables,
        });
        data = { [responseKeys[nodeIndex]]: transformData(data[responseKeys[nodeIndex]], "participants") }
        if (queryVariables.id.length > 0) {
            if (searchValue !== "") {
                let filteredRowData = data[responseKeys[nodeIndex]].filter((a, b) => a.participant_id.includes(searchValue))
                setRowData(addCohortColumn(filteredRowData, state, selectedCohorts));
            } else {
                setRowData(addCohortColumn(data[responseKeys[nodeIndex]], state, selectedCohorts, "participant"));
                updatedCohortContent(data[responseKeys[nodeIndex]])

            }
        } else {
            if (!location || !location.state || !location.state.cohort || !location.state.cohort.cohortId) {
                setRowData([]);
            }

        }
    }

    async function getJoinedCohortByD(selectedCohortSection = null) {
        let queryVariables = generateQueryVariable(selectedCohorts, state);
        if (Object.keys(generalInfo).length > 0) {
            queryVariables = withDisplayParticipantFilterIds(
                getDisplayIdsFromCohort(state, selectedCohorts),
                getIdsFromCohort(state, selectedCohorts),
            );
        }
        queryVariables = sanitizeQueryVariables(queryVariables);
        setQueryVariable(queryVariables);
        let { data } = await client.query({
            query: analyzer_query[nodeIndex],
            variables: queryVariables,
        });
        data = { [responseKeys[nodeIndex]]: transformData(data[responseKeys[nodeIndex]], "diagnosis") }
        if (queryVariables.id.length > 0) {
            if (searchValue !== "") {

                let filteredRowData = data[responseKeys[nodeIndex]].filter((a, b) => a.participant_id.includes(searchValue))

                if (JSON.stringify(selectedCohortSection) !== "{}") {
                    filteredRowData = filterAllParticipantWithDiagnosisName(generalInfo, filteredRowData)
                }
                setRowData(addCohortColumn(filteredRowData, state, selectedCohorts));

            } else {


                if (JSON.stringify(selectedCohortSection) !== "{}") {

                    let filterRowData = filterAllParticipantWithDiagnosisName(generalInfo, data[responseKeys[nodeIndex]])
                    setRowData(addCohortColumn(filterRowData, state, selectedCohorts));
                } else {
                    setRowData(addCohortColumn(data[responseKeys[nodeIndex]], state, selectedCohorts));
                    updatedCohortContent(data[responseKeys[nodeIndex]])
                }

            }
        } else {
            if (location && location.state && location.state.cohort && location.state.cohort.cohortId) {

            } else {
                setRowData([]);
            }

        }
    }

    async function getJoinedCohortByT(selectedCohortSection = null) {
        // Selection-scoped and unscoped loads use the same participant set; the
        // Venn selection is applied client-side by filterAllParticipantWithTreatmentType.
        let queryVariables = withTreatmentParticipantFilterIds(
            getIdsFromCohort(state, selectedCohorts),
            getDisplayIdsFromCohort(state, selectedCohorts),
        );
        queryVariables = sanitizeQueryVariables(queryVariables);
        setQueryVariable(queryVariables);
        let { data } = await client.query({
            query: analyzer_query[nodeIndex],
            variables: queryVariables,
        });
        data = { [responseKeys[nodeIndex]]: transformData(data[responseKeys[nodeIndex]], "treatment") }

        if (hasParticipantFilter(queryVariables)) {
            if (searchValue !== "") {
                let filteredRowData = data[responseKeys[nodeIndex]].filter((a, b) => a.participant_id.includes(searchValue))
                if (JSON.stringify(selectedCohortSection) !== "{}") {
                    filteredRowData = filterAllParticipantWithTreatmentType(generalInfo, filteredRowData)
                }
                setRowData(addCohortColumn(filteredRowData, state, selectedCohorts));
            } else {


                if (JSON.stringify(selectedCohortSection) !== "{}") {

                    let filterRowData = filterAllParticipantWithTreatmentType(generalInfo, data[responseKeys[nodeIndex]])
                    setRowData(addCohortColumn(filterRowData, state, selectedCohorts));
                    //updatedCohortContent(filterRowData)

                } else {
                    setRowData(addCohortColumn(data[responseKeys[nodeIndex]], state, selectedCohorts));
                    updatedCohortContentAllowDuplication(data[responseKeys[nodeIndex]])
                }

            }
        } else {
            if (location && location.state && location.state.cohort && location.state.cohort.cohortId) {

            } else {
                setRowData([]);
            }

        }
    }

    // Belt-and-suspenders: if a caller passes a nodeIndex that has no matching
    // query (e.g. someone shrinks `analyzer_query` again), don't call Apollo with
    // `query: undefined` — that surfaces as an opaque Apollo Invariant #26.
    if (!analyzer_query[nodeIndex]) {
        setRowData([]);
        return;
    }

    if (nodeIndex === 0) {
        getJoinedCohort();
    } else if (nodeIndex === 1) {

        getJoinedCohortByD(generalInfo);
    } else if (nodeIndex === 2) {
        getJoinedCohortByT(generalInfo)
    }

};

export { getJoinedCohortData };
