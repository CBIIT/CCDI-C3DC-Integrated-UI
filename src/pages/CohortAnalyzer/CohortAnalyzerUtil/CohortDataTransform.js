import client from '../../../utils/graphqlClient';
import { analyzer_query, responseKeys } from '../../../bento/cohortAnalyzerPageData';
import { generateQueryVariable, getIdsFromCohort, getAllIds, filterAllParticipantWithDiagnosisName, filterAllParticipantWithTreatmentType, addCohortColumn } from './CohortAnalyzerUtil';

const DEFAULT_QUERY_LIMIT = 10000;

// The backend's `terms` filter rejects null values, so we strip any null/undefined
// entries from id / participant_pk lists before firing the query. This is our last
// line of defense — upstream helpers (generateQueryVariable, getIdsFromCohort,
// getAllIds) should already have filtered them out, but we normalize here so no
// code path can regress.
const sanitizeQueryVariables = (variables = {}) => {
    if (!variables) return variables;
    const next = { ...variables };
    if (Array.isArray(next.id)) {
        next.id = next.id.filter((pk) => pk != null);
    }
    if (Array.isArray(next.participant_pk)) {
        next.participant_pk = next.participant_pk.filter((pk) => pk != null);
    } else if (Array.isArray(next.id)) {
        // Keep cohortManifest / cohortMetadata in sync when only `id` was set.
        next.participant_pk = [...next.id];
    }
    return next;
};

const withParticipantFilterIds = (participantIds) => ({
    id: participantIds,
    participant_pk: participantIds,
    first: DEFAULT_QUERY_LIMIT,
});


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

        // The overview endpoints don't always expose a primary key on the
        // nested `participant` object — treatmentOverview per Postman only
        // returns `participant.participant_id`. Fall back through id → pk →
        // display id so cohort matching still lines up.
        const pickParticipantPk = (participant) => {
            if (!participant) return undefined;
            if (participant.id != null) return participant.id;
            if (participant.participant_pk != null) return participant.participant_pk;
            return participant.participant_id;
        };

        if (type === "treatment") {
            return rows
                .filter((row) => row.participant != null)
                .map(({ participant, id, treatment_id, ...rest }) => {
                    const pk = pickParticipantPk(participant);
                    return {
                        id: pk,
                        participant_pk: pk,
                        participant_id: participant.participant_id,
                        study_id: participant.study_id,
                        // Prefer the domain-level treatment_id when the backend
                        // provides it — the top-level `id` on treatmentOverview
                        // is not always populated.
                        treatment_pk: treatment_id != null ? treatment_id : id,
                        treatment_id,
                        ...rest,
                    };
                });
        } else if (type === "diagnosis") {
            return rows
                .filter((row) => row.participant != null)
                .map(({ participant, id, diagnosis_id, ...rest }) => {
                    const pk = pickParticipantPk(participant);
                    return {
                        id: pk,
                        participant_pk: pk,
                        participant_id: participant.participant_id,
                        study_id: participant.study_id,
                        // Prefer diagnosis_id — the top-level `id` on
                        // diagnosisOverview is not always populated.
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

    function updatedCohortContent(newParticipantsData) {
        const newState = { ...state };
        selectedCohorts.forEach(cohortId => {
            const existingParticipants = newState[cohortId].participants || [];

            const updatedParticipants = existingParticipants.map(participant => {
                // Match by `id` (what the cohort state stores) with a
                // participant_pk fallback for any legacy row shape.
                const key = participant.id != null ? participant.id : participant.participant_pk;
                const matchingNewParticipant = newParticipantsData.find(
                    newParticipant => (newParticipant.id != null ? newParticipant.id : newParticipant.participant_pk) === key
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
                const key = participant.id != null ? participant.id : participant.participant_pk;
                const matchingExistingParticipants = existingParticipants.find(
                    existingParticipant => (existingParticipant.id != null ? existingParticipant.id : existingParticipant.participant_pk) === key
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
            queryVariables = withParticipantFilterIds(participantIds);
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
            queryVariables = withParticipantFilterIds(getIdsFromCohort(state, selectedCohorts));
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
        let queryVariables = generateQueryVariable(selectedCohorts, state);
        if (Object.keys(generalInfo).length > 0) {
            queryVariables = withParticipantFilterIds(getIdsFromCohort(state, selectedCohorts));
        }
        queryVariables = sanitizeQueryVariables(queryVariables);
        setQueryVariable(queryVariables);
        let { data } = await client.query({
            query: analyzer_query[nodeIndex],
            variables: queryVariables,
        });
        data = { [responseKeys[nodeIndex]]: transformData(data[responseKeys[nodeIndex]], "treatment") }

        if (queryVariables.id.length > 0) {
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