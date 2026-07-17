import { useContext, useMemo } from 'react';
import { CohortStateContext } from '../../../components/CohortSelectorState/CohortStateContext';
import { CohortModalContext } from '../CohortModalContext';
import { hasUnsavedChanges as checkUnsavedChanges } from '../utils';
import { IGNORED_FIELDS } from '../../../bento/cohortModalData';

/**
 * Custom hook for detecting unsaved changes in the cohort modal
 * @returns {Object} Unsaved changes state and utilities
 */
export const useUnsavedChanges = () => {
  const { state } = useContext(CohortStateContext) || {};
  const { currentCohortChanges, selectedCohort, pendingNewCohort } = useContext(CohortModalContext) || {};

  const unSavedChanges = useMemo(() => {
    // A draft from CREATE NEW COHORT is never persisted until Save Changes.
    if (pendingNewCohort && selectedCohort === pendingNewCohort.cohortId) {
      return true;
    }

    if (!currentCohortChanges || !state || !selectedCohort || !state[selectedCohort]) {
      return false;
    }
    
    return checkUnsavedChanges(currentCohortChanges, state[selectedCohort], IGNORED_FIELDS);
  }, [currentCohortChanges, state, selectedCohort, pendingNewCohort]);

  return {
    unSavedChanges,
    ignoredFields: IGNORED_FIELDS
  };
};