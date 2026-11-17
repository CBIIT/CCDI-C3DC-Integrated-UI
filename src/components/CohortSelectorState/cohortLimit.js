export const MAX_COHORT_COUNT = 20;

export const COHORT_LIMIT_MESSAGE = 'You have reached the max capacity of 20 cohorts.';

export const COHORT_LIMIT_TOAST_OPTIONS = {
  width: 'max-content',
  nowrap: true,
};

export const hasReachedCohortLimit = (cohortState) => {
  if (!cohortState || typeof cohortState !== 'object') {
    return false;
  }
  return Object.keys(cohortState).length >= MAX_COHORT_COUNT;
};
