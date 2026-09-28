jest.mock('use-reducer-logger', () => ({
  __esModule: true,
  default: (reducer) => reducer,
}));

jest.mock('../../../../src/utils/graphqlClient', () => ({
  __esModule: true,
  default: { query: jest.fn() },
}));

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CohortModalContext } from '../../../../src/components/CohortModal/CohortModalContext';
import { CohortStateContext } from '../../../../src/components/CohortSelectorState/CohortStateContext';
import { useUnsavedChanges } from '../../../../src/components/CohortModal/hooks/useUnsavedChanges';

function Probe() {
  const { unSavedChanges } = useUnsavedChanges();
  return <span data-testid="dirty">{String(unSavedChanges)}</span>;
}

function renderHookView(modalValue, state) {
  return render(
    <CohortStateContext.Provider value={{ state }}>
      <CohortModalContext.Provider value={modalValue}>
        <Probe />
      </CohortModalContext.Provider>
    </CohortStateContext.Provider>,
  );
}

describe('useUnsavedChanges', () => {
  const cohort = {
    cohortId: 'c1',
    cohortName: 'Alpha',
    cohortDescription: '',
    participants: [],
  };

  it('should treat a pending new cohort as unsaved', () => {
    renderHookView({
      pendingNewCohort: { cohortId: 'c1' },
      selectedCohort: 'c1',
      currentCohortChanges: null,
    }, {});
    expect(screen.getByTestId('dirty')).toHaveTextContent('true');
  });

  it('should return false when required data is missing', () => {
    renderHookView({
      pendingNewCohort: null,
      selectedCohort: null,
      currentCohortChanges: null,
    }, {});
    expect(screen.getByTestId('dirty')).toHaveTextContent('false');
  });

  it('should compare draft changes against stored cohort data', () => {
    renderHookView({
      pendingNewCohort: null,
      selectedCohort: 'c1',
      currentCohortChanges: { ...cohort, cohortName: 'Renamed' },
    }, { c1: cohort });
    expect(screen.getByTestId('dirty')).toHaveTextContent('true');
  });
});
