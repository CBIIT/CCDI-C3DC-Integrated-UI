import React from "react";
import search_icon from '../../../assets/icons/Search_Icon.svg';

export const triggerNotification = (count, Notification) => {
    if (count > 1) {
        Notification.show(" " + count + ' Participants added ', 5000,);
    } else {
        Notification.show(" " + count + ' Participant added ', 5000,);
    }

};

export const filterAllParticipantWithDiagnosisName = (generalInfo, allParticipants) => {
    let finalIds = [];

    Object.keys(generalInfo).forEach((section) => {
        allParticipants.forEach((part) => {
            if (generalInfo[section].includes(part.diagnosis)) {
                finalIds = [...finalIds, part]
            }
        })
    });
    return finalIds;
}

export const filterAllParticipantWithTreatmentType = (generalInfo, allParticipants) => {
    let finalIds = [];
    Object.keys(generalInfo).forEach((section) => {
        allParticipants.forEach((part) => {
            if (generalInfo[section].includes(part.treatment_type)) {
                finalIds = [...finalIds, part]
            }
        })
    });
    return finalIds;
}


// Participants are stored in cohort state under `id`; keep `participant_pk` as a
// fallback so any legacy state shape still works. Filter out null/undefined so we
// never emit `[null]` to the backend (its terms filter rejects nulls).
const getParticipantPk = (participant) => {
    if (!participant) return null;
    return participant.id != null ? participant.id : participant.participant_pk;
};

export const getIdsFromCohort = (data, selectedCohorts) => {
    const allParticipantPKs = [];

    Object.keys(data).forEach((cohortKey) => {
        if (selectedCohorts.includes(cohortKey)) {
            if (data[cohortKey].participants) {
                data[cohortKey].participants.forEach((participant) => {
                    const pk = getParticipantPk(participant);
                    if (pk != null) allParticipantPKs.push(pk);
                });
            }
        }
    });
    return allParticipantPKs;
}

/** Display participant_id values for diagnosis/treatment overview `participant_ids`. */
export const getDisplayIdsFromCohort = (data, selectedCohorts) => {
    const displayIds = [];

    Object.keys(data).forEach((cohortKey) => {
        if (selectedCohorts.includes(cohortKey)) {
            if (data[cohortKey].participants) {
                data[cohortKey].participants.forEach((participant) => {
                    if (participant.participant_id != null) {
                        displayIds.push(participant.participant_id);
                    }
                });
            }
        }
    });
    return displayIds;
}

export const getAllIds = (generalInfo) => {
    let finalIds = [];
    Object.keys(generalInfo).forEach((section) => {
        (generalInfo[section] || []).forEach((id) => {
            if (id != null) finalIds.push(id);
        });
    })
    return finalIds;
}

export const addCohortColumn = (rowD, state, selectedCohorts, type = "other") => {
    let finalRowData = rowD.map((row) => {
        if (type === "other") {

            let cohortName = getCohortName(row.participant_pk, state, selectedCohorts);
            return {
                ...row,
                cohort: cohortName
            };
        } else {

            let cohortName = getCohortName(row.id, state, selectedCohorts);

            return {
                ...row,
                cohort: cohortName
            };
        }

    });
    return finalRowData;
}

const getCohortName = (pk, state, selectedCohorts) => {
    const cohortNames = selectedCohorts
        .filter(cohortKey =>
            state[cohortKey].participants.some((participant) => (
                getParticipantPk(participant) === pk
                || participant.participant_id === pk
            ))
        ).map(cohortKey => state[cohortKey].cohortName);
    let finalResponse = [];
    const baseColorArray = ["#F0D571", "#A4E9CB", "#A3CCE8"];
    selectedCohorts.forEach((cohort, index) => {
        let indexOfHashKey = cohortNames.map(name => name.toLowerCase()).indexOf(cohort.toLowerCase());
        if (indexOfHashKey >= 0) {
            finalResponse.push({ color: baseColorArray[index], "cohort": cohortNames[indexOfHashKey] })
        }
    })
    return finalResponse;
}

export const resetSelection = (setSelectedCohorts, setNodeIndex, setRowData) => {
    setSelectedCohorts([]);
    setRowData([]);
    setNodeIndex(0);
}

export const sortBy = (type, cohortList, setCohortList, state) => {
    let listOfCohortsLocal = cohortList;
    if (type === "alphabet") {
        listOfCohortsLocal.sort((a, b) =>
            a.localeCompare(b))
        setCohortList(listOfCohortsLocal);
    } else if (type === "count") {
        listOfCohortsLocal.sort((a, b) =>
            state[a].participants.length - state[b].participants.length)
        setCohortList(listOfCohortsLocal);
    }

    return listOfCohortsLocal;
}

export const sortByReturn = (type, cohortList, state, selected) => {
    let listOfCohortsLocal = cohortList;
    if (type === "alphabet") {
        listOfCohortsLocal.sort((a, b) =>
            a.localeCompare(b))
    } else {
        listOfCohortsLocal.sort((a, b) =>
            state[a].participants.length - state[b].participants.length)

    }

    let reArranged = [];
    listOfCohortsLocal.forEach((cohort) => {
        if (!selected.includes(cohort)) {
            reArranged.push(cohort);
        }
    });
    reArranged = [...selected, ...reArranged];

    return reArranged;
}

const deleteCohort = (cohortId, dispatch, onDeleteSingleCohort) => {
    dispatch(onDeleteSingleCohort(cohortId, () => { }, () => { }));
}

const deleteAllCohort = (dispatch, onDeleteAllCohort) => {
    dispatch(onDeleteAllCohort(() => { }, () => { }));
}

export const handleDelete = (cohortId,
    setCohortList,
    setSelectedCohorts,
    dispatch, onDeleteSingleCohort,
    onDeleteAllCohort,
    setGeneralInfo,
    setRowData) => {
    if (cohortId) {
        setCohortList(prevCohortList => prevCohortList.filter(cohort => cohort !== cohortId))
        setSelectedCohorts(prevSelectedCohortList => prevSelectedCohortList.filter(cohort => cohort !== cohortId));
        deleteCohort(cohortId, dispatch, onDeleteSingleCohort);
    } else {
        setCohortList([]);
        setSelectedCohorts([]);
        setGeneralInfo({});
        setRowData([]);
        deleteAllCohort(dispatch, onDeleteAllCohort);
    }
}

export const SearchBox = (classes, handleSearchValue, searchValue, searchReference) => {
    return (
        <div className={classes.inputStyleContainer}>
               

            <input
                onChange={handleSearchValue}
                ref={searchReference}
                type="text"
                placeholder={"Search Participant ID"}
                name="search"
                id="participant-search"
                className={classes.inputStyle}
            />
            <label htmlFor="participant-search" aria-label="search">
            <img alt={"Search Icon"} src={search_icon} />
            </label>
           
        </div>
    )
}

// Diagnosis/treatment overview bind `$id` → `participant_ids`, which expects
// display `participant_id` values (UUIDs return empty). `participantOverview`
// still filters by internal id — callers remap `id` ← `participant_pk` for that
// path. `cohortManifest` / `cohortMetadata` use `participant_pk` (UUID).
export function generateQueryVariable(cohortNames, state) {
    const pks = [];
    const displayIds = [];
    cohortNames.forEach((cName) => {
        state[cName].participants.forEach((participant) => {
            const pk = getParticipantPk(participant);
            if (pk != null) {
                pks.push(pk);
            }
            if (participant.participant_id != null) {
                displayIds.push(participant.participant_id);
            }
        });
    });
    return {
        id: displayIds,
        participant_pk: pks,
        first: 10000,
    };
}

export const handlePopup = (cohortId, state, setDeleteInfo, deleteInfo) => {
    let deleteType = cohortId ? "delete this cohort?" : "delete ALL cohorts?";
    if (Object.keys(state).length > 0) {
        setDeleteInfo({ showDeleteConfirmation: !deleteInfo.showDeleteConfirmation, deleteType: deleteType, cohortId: cohortId });
    }
}