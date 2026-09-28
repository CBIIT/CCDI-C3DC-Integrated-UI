jest.mock('@bento-core/paginated-table', () => ({
  btnTypes: {
    ADD_ALL_FILES: 'ADD_ALL_FILES',
    ADD_SELECTED_FILES: 'ADD_SELECTED_FILES',
    CUSTOM_ELEM: 'CUSTOM_ELEM',
  },
  types: { BUTTON: 'BUTTON', COHORT_ELEM: 'COHORT_ELEM' },
}));

jest.mock('../../../src/bento/dashboardTabData', () => ({
  tooltipContentAddAll: {},
  tooltipContent: {},
  tooltipContentAddToNewCohort: {},
  tooltipContentAddToExistingCohort: {},
  tooltipContentListAll: {},
}));

jest.mock('../../../src/bento/fileCentricCartWorkflowData', () => ({
  alertMessage: '',
}));

jest.mock('../../../src/pages/inventory/tabs/wrapperConfig/CustomDropDown', () => ({
  CustomDropDown: () => null,
}));

jest.mock('../../../src/pages/inventory/tabs/wrapperConfig/customButton', () => ({
  CustomButton: () => null,
}));

jest.mock('../../../src/components/CohortSelectorState/CohortStateContext', () => {
  const React = require('react');
  return {
    CohortStateContext: React.createContext({ state: { c1: { cohortId: 'c1' } } }),
  };
});

import React from 'react';
import { render } from '@testing-library/react';
import { configWrapper, wrapperConfig } from '../../../src/pages/inventory/tabs/wrapperConfig/Wrapper';
import { btnTypes } from '@bento-core/paginated-table';

describe('configWrapper', () => {
  it('should hide file cart actions on the Participants tab', () => {
    const out = configWrapper({ name: 'Participants' }, wrapperConfig);
    const header = out.find((c) => c.clsName === 'container_header');
    const roles = header.items.map((item) => item.role);
    expect(roles).not.toContain(btnTypes.ADD_ALL_FILES);
  });

  it('should keep header/footer for Files and drop them for other tabs', () => {
    const files = configWrapper({ name: 'Files', addAllFileQuery: 'q' }, wrapperConfig);
    expect(files.some((c) => c.clsName === 'container_header')).toBe(true);
    const other = configWrapper({ name: 'Studies' }, wrapperConfig);
    expect(other.some((c) => c.clsName === 'container_header')).toBe(false);
    expect(other.find((c) => c.paginatedTable).items).toEqual([]);
  });

  it('should attach file-query fields and render cohort toolbar elements', () => {
    const files = configWrapper({
      name: 'Files',
      addAllFileQuery: 'allQ',
      addSelectedFilesQuery: 'selQ',
      addFilesRequestVariableKey: 'ids',
      addAllFilesResponseKeys: ['a'],
      addFilesResponseKeys: ['b'],
    }, wrapperConfig);
    const header = files.find((c) => c.clsName === 'container_header');
    const all = header.items.find((item) => item.role === btnTypes.ADD_ALL_FILES);
    const selected = header.items.find((item) => item.role === btnTypes.ADD_SELECTED_FILES);
    expect(all.addFileQuery).toBe('allQ');
    expect(selected.addFileQuery).toBe('selQ');
    expect(all.responseKeys).toEqual(['a']);
    expect(selected.responseKeys).toEqual(['b']);
    expect(all.dataKey).toBe('ids');

    const cohortItems = header.items.filter((item) => item.CohortViewElem);
    const Toolbar = () => (
      <div>
        {cohortItems.map((item) => (
          <div key={item.title}>{item.CohortViewElem()}</div>
        ))}
      </div>
    );
    render(<Toolbar />);
  });
});
