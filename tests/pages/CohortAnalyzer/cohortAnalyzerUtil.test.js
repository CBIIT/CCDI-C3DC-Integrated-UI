import {
  triggerNotification,
  filterAllParticipantWithDiagnosisName,
  normalizeTreatmentTypeValues,
  filterAllParticipantWithTreatmentType,
  getIdsFromCohort,
  getDisplayIdsFromCohort,
  getAllIds,
  addCohortColumn,
  resetSelection,
  sortBy,
  sortByReturn,
  handleDelete,
  generateQueryVariable,
  handlePopup,
  SearchBox,
} from '../../../src/pages/CohortAnalyzer/CohortAnalyzerUtil/CohortAnalyzerUtil';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

const state = {
  a: {
    cohortName: 'Alpha',
    participants: [
      { id: 'u1', participant_id: 'P1' },
      { participant_pk: 'u2', participant_id: 'P2' },
      { participant_id: 'P3' },
    ],
  },
  b: {
    participants: [{ id: 'u4', participant_id: 'P4' }],
  },
  empty: {},
};

describe('CohortAnalyzerUtil', () => {
  it('should notify for one or many participants', () => {
    const Notification = { show: jest.fn() };
    triggerNotification(1, Notification);
    triggerNotification(3, Notification);
    expect(Notification.show).toHaveBeenNthCalledWith(1, ' 1 Participant added ', 5000);
    expect(Notification.show).toHaveBeenNthCalledWith(2, ' 3 Participants added ', 5000);
  });

  it('should filter diagnosis and treatment values', () => {
    expect(filterAllParticipantWithDiagnosisName(
      { s1: ['AML'] },
      [{ diagnosis: 'AML' }, { diagnosis: 'ALL' }],
    )).toEqual([{ diagnosis: 'AML' }]);

    expect(normalizeTreatmentTypeValues(null)).toEqual([]);
    expect(normalizeTreatmentTypeValues('')).toEqual([]);
    expect(normalizeTreatmentTypeValues(['Chemo', ['Radiation']])).toEqual(['Chemo', 'Radiation']);
    expect(filterAllParticipantWithTreatmentType(null, [{ treatment_type: 'Chemo' }])).toEqual([]);
    expect(filterAllParticipantWithTreatmentType({ s: ['Chemo'] }, null)).toEqual([]);
    expect(filterAllParticipantWithTreatmentType(
      { s: ['Chemo'] },
      [{ treatment_type: 'Chemo' }, { treatment_type: ['Radiation'] }],
    )).toEqual([{ treatment_type: 'Chemo' }]);
  });

  it('should collect participant ids and display ids', () => {
    expect(getIdsFromCohort(state, ['a', 'missing'])).toEqual(['u1', 'u2']);
    expect(getIdsFromCohort(state, ['empty'])).toEqual([]);
    expect(getDisplayIdsFromCohort(state, ['a'])).toEqual(['P1', 'P2', 'P3']);
    expect(getDisplayIdsFromCohort(state, ['empty'])).toEqual([]);
    expect(getAllIds({ s: ['x', null, 'y'] })).toEqual(['x', 'y']);
    expect(getAllIds({ s: null })).toEqual([]);
  });

  it('should attach cohort colors for display and participant keys', () => {
    expect(addCohortColumn(null, state, ['a'])).toEqual([]);
    const other = addCohortColumn(
      [{ participant_id: 'P1' }, { participant_pk: 'u2' }],
      state,
      ['a', 'b'],
    );
    expect(other[0].cohort[0].cohort).toBe('Alpha');
    const byId = addCohortColumn([{ id: 'u1' }], state, ['a'], 'participant');
    expect(byId[0].cohort[0].color).toBe('#F0D571');
    expect(addCohortColumn([{ id: 'missing' }], {}, ['a'], 'participant')[0].cohort).toEqual([]);
  });

  it('should sort, reset, and generate query variables', () => {
    const setSelected = jest.fn();
    const setNode = jest.fn();
    const setRows = jest.fn();
    resetSelection(setSelected, setNode, setRows);
    expect(setSelected).toHaveBeenCalledWith([]);

    const setList = jest.fn();
    expect(sortBy('alphabet', ['b', 'a'], setList, state)).toEqual(['a', 'b']);
    expect(sortBy('count', ['b', 'a'], setList, state)[0]).toBe('b');
    expect(sortBy('other', ['b'], setList, state)).toEqual(['b']);
    expect(sortByReturn('alphabet', ['b', 'a'], state, ['a'])[0]).toBe('a');
    expect(sortByReturn('count', ['b', 'a'], state, []).length).toBe(2);

    expect(generateQueryVariable(['a'], state).participant_pk).toEqual(['u1', 'u2']);
    expect(generateQueryVariable(['a'], state).id).toEqual(['P1', 'P2', 'P3']);
  });

  it('should delete one cohort or all cohorts and toggle the popup', () => {
    const dispatch = jest.fn((action) => action);
    const setList = jest.fn((fn) => (typeof fn === 'function' ? fn(['a', 'b']) : fn));
    const setSelected = jest.fn((fn) => (typeof fn === 'function' ? fn(['a']) : fn));
    const setInfo = jest.fn();
    const setRows = jest.fn();
    handleDelete('a', setList, setSelected, dispatch, jest.fn(() => ({ type: 'one' })), jest.fn(), setInfo, setRows);
    handleDelete(null, setList, setSelected, dispatch, jest.fn(), jest.fn(() => ({ type: 'all' })), setInfo, setRows);

    handlePopup('a', {}, setInfo, { showDeleteConfirmation: false });
    handlePopup(null, state, setInfo, { showDeleteConfirmation: false });
    expect(setInfo).toHaveBeenCalledWith(expect.objectContaining({ deleteType: 'delete ALL cohorts?' }));
  });

  it('should render the participant search box', () => {
    const handleSearchValue = jest.fn();
    render(SearchBox({ inputStyleContainer: '', inputStyle: '' }, handleSearchValue, '', { current: null }));
    fireEvent.change(screen.getByPlaceholderText('Search Participant ID'), { target: { value: 'P1' } });
    expect(handleSearchValue).toHaveBeenCalled();
  });
});
