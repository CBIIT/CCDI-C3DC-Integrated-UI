jest.mock('../../../src/bento/dashTemplate', () => ({
  facetsParticipantsConfig: [],
  facetsExploreFilesConfig: [],
  facetSectionVariables: {},
  facetSectionVariablesExploreFiles: {},
  participantWidgetConfig: [],
  participantWidgetToolTipConfig: {},
  filesWidgetConfig: [],
  filesWidgetToolTipConfig: {},
  queryParams: [],
}));
jest.mock('../../../src/bento/dashboardTabData', () => ({
  exploreParticipantsTabs: [],
  exploreFilesTabs: [],
}));

import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import InventoryRouteSync from '../../../src/pages/inventory/InventoryRouteSync';
import { SYNC_INVENTORY_EXPLORE_MODE } from '../../../src/components/Inventory/InventoryState';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

describe('InventoryRouteSync', () => {
  it('should dispatch explore mode from the files pathname', () => {
    const dispatch = jest.fn();
    useDispatch.mockReturnValue(dispatch);
    render(
      <MemoryRouter initialEntries={['/exploreFiles']}>
        <InventoryRouteSync />
      </MemoryRouter>,
    );
    expect(dispatch).toHaveBeenCalledWith({
      type: SYNC_INVENTORY_EXPLORE_MODE,
      payload: { exploreMode: 'files' },
    });
  });
});
