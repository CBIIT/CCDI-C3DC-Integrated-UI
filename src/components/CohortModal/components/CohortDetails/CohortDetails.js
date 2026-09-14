import React, { useState, useEffect, useContext, useMemo, useCallback, memo } from 'react';
import { withStyles } from '@material-ui/core';
import { CohortStateContext } from '../../../../components/CohortSelectorState/CohortStateContext';
import { onMutateSingleCohort, onCreateNewCohort } from '../../../../components/CohortSelectorState/store/action';
import { CohortModalContext } from '../../CohortModalContext';
import CohortMetadata from './components/CohortMetadata';
import ParticipantList from './components/ParticipantList';
import ActionButtons from './components/ActionButtons';

/**
 * CohortDetails component for displaying and editing cohort information
 */

const CohortDetails = (props) => {
    const {
        classes,
        config,
        closeModal,
    } = props;

    const { state, dispatch } = useContext(CohortStateContext);
    const { 
        selectedCohort, 
        currentCohortChanges, 
        setCurrentCohortChanges, 
        showAlert, 
        clearCurrentCohortChanges,
        pendingNewCohort,
        clearPendingNewCohort,
        setSelectedCohort,
    } = useContext(CohortModalContext);

    const isPendingNewCohort = Boolean(
        pendingNewCohort
        && selectedCohort
        && pendingNewCohort.cohortId === selectedCohort
    );
    
    const activeCohort = isPendingNewCohort
        ? pendingNewCohort
        : state[selectedCohort];

    // Memoized matching cohort ID calculation
    const matchingCohortID = useMemo(() => {
        return currentCohortChanges && activeCohort && currentCohortChanges.cohortId === activeCohort.cohortId;
    }, [currentCohortChanges, activeCohort]);

    // Memoized initial cohort state - simple array spread is sufficient for participants
    const initialCohortState = useMemo(() => {
        if (!activeCohort) {
            return {
                cohortId: '',
                cohortName: '',
                cohortDescription: '',
                participants: [],
            };
        }
        return {
            cohortId: matchingCohortID ? currentCohortChanges.cohortId : activeCohort.cohortId,
            cohortName: matchingCohortID ? currentCohortChanges.cohortName : activeCohort.cohortName,
            cohortDescription: matchingCohortID ? currentCohortChanges.cohortDescription : activeCohort.cohortDescription,
            participants: matchingCohortID ? [...currentCohortChanges.participants] : [...activeCohort.participants],
        };
    }, [matchingCohortID, currentCohortChanges, activeCohort]);

    const [localCohort, setLocalCohort] = useState(initialCohortState);

    const handleSetCurrentCohortChanges = useCallback((nextLocalCohort) => {
        if (!nextLocalCohort.cohortId) return;
        setCurrentCohortChanges({
            cohortId: nextLocalCohort.cohortId,
            cohortName: nextLocalCohort.cohortName,
            cohortDescription: nextLocalCohort.cohortDescription,
            participants: nextLocalCohort.participants,
            searchText: nextLocalCohort.searchText,
        });
    }, [setCurrentCohortChanges]);

    const handleSaveExistingCohort = useCallback((nextLocalCohort) => {
        if (!nextLocalCohort.cohortId) return;
        dispatch(onMutateSingleCohort(
            nextLocalCohort.cohortId,
            {
                cohortName: nextLocalCohort.cohortName,
                cohortDescription: nextLocalCohort.cohortDescription,
                participants: nextLocalCohort.participants
            },
            () => {
                showAlert('success', 'Cohort updated successfully!');
                clearCurrentCohortChanges();        
            },
            (error) => {
                showAlert('error', `Failed to update cohort: ${error.message}`);
            }
        ));
    }, [dispatch, showAlert, clearCurrentCohortChanges]);

    const handleSavePendingNewCohort = useCallback((nextLocalCohort) => {
        const cohortName = (nextLocalCohort.cohortName || '').trim() || nextLocalCohort.cohortId;
        dispatch(onCreateNewCohort(
            cohortName,
            nextLocalCohort.cohortDescription || '',
            nextLocalCohort.participants || [],
            () => {
                clearPendingNewCohort();
                clearCurrentCohortChanges();
                setSelectedCohort(cohortName);
                showAlert('success', 'Cohort created successfully!');
            },
            (error) => {
                showAlert('error', `Failed to create cohort: ${error.message}`);
            },
        ));
    }, [dispatch, clearPendingNewCohort, clearCurrentCohortChanges, setSelectedCohort, showAlert]);

    // Memoized save handler to prevent unnecessary re-renders
    const handleSave = useCallback(() => {
        if (isPendingNewCohort) {
            handleSavePendingNewCohort(localCohort);
            return;
        }
        handleSaveExistingCohort(localCohort);
        handleSetCurrentCohortChanges({
            ...currentCohortChanges,
            ...localCohort,
        });
    }, [
        isPendingNewCohort,
        localCohort,
        currentCohortChanges,
        handleSavePendingNewCohort,
        handleSaveExistingCohort,
        handleSetCurrentCohortChanges,
    ]);

    // Update localCohort when selectedCohort changes (optimized)
    useEffect(() => {
        setLocalCohort(initialCohortState);
    }, [initialCohortState]);

    if (!activeCohort) {
        return null;
    }

    return (
        <div className={classes.cohortDetailsContainer}>
            <div className={classes.cohortDetailsSection}>
                <CohortMetadata
                    config={config}
                />
                <ParticipantList
                    localCohort={localCohort}
                    setLocalCohort={setLocalCohort}
                    handleSave={handleSave}
                    closeModal={closeModal}
                    config={config}
                />
                
            </div>
            <ActionButtons
                localCohort={localCohort}
            />
        </div>
    );
};

/**
 * Default styles for the component.
 */

const styles = () => ({
    cohortDetailsContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: 28,
        minWidth: '490px'
    },
    cohortDetailsSection: {
        flexGrow: 55,
        flexBasis: '0%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'normal',
        //width: '55%',
        //width: '55.191%',
        //height: '87.030%',
        maxWidth: '521px',
        height: '50%',
        minHeight: '435px',
        width: '100%',
        minWidth: '275px',
        //maxHeight: '718px',
        border: '1px solid #3388A6',
        borderRadius: '10px',
    },

});

export default memo(withStyles(styles, { withTheme: true })(CohortDetails));
