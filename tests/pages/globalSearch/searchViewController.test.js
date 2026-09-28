jest.mock('../../../src/pages/globalSearch/searchView', () => jest.fn(() => <div>Search view</div>));

jest.mock('../../../src/bento/siteWideConfig', () => ({
  PUBLIC_ACCESS: 'Metadata Only',
}));

jest.mock('@bento-core/authentication', () => ({
  accessLevelTypes: { METADATA_ONLY: 'Metadata Only' },
}));

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import SearchView from '../../../src/pages/globalSearch/searchView';
import SearchViewController from '../../../src/pages/globalSearch/searchViewController';

function loginStore(partial) {
  return createStore(() => ({
    login: { isSignedIn: false, role: null, acl: [], ...partial },
  }));
}

describe('SearchViewController', () => {
  beforeEach(() => {
    SearchView.mockClear();
  });

  describe('Rendering', () => {
    it('should pass public metadata-only access for unsigned users', () => {
      render(
        <Provider store={loginStore({})}>
          <SearchViewController match={{ params: { id: '' } }} />
        </Provider>,
      );

      expect(screen.getByText('Search view')).toBeInTheDocument();
      expect(SearchView).toHaveBeenCalledWith(
        expect.objectContaining({
          publicAccessEnabled: true,
          isAuthorized: false,
          isSignedIn: false,
        }),
        expect.anything(),
      );
    });

    it('should authorize admins and users with approved arms', () => {
      const { rerender } = render(
        <Provider store={loginStore({ isSignedIn: true, role: 'admin' })}>
          <SearchViewController match={{ params: { id: 'kw' } }} />
        </Provider>,
      );
      expect(SearchView).toHaveBeenCalledWith(
        expect.objectContaining({ isAuthorized: true, isSignedIn: true, searchparam: 'kw' }),
        expect.anything(),
      );

      SearchView.mockClear();
      rerender(
        <Provider store={loginStore({
          isSignedIn: true,
          role: 'user',
          acl: [{ accessStatus: 'approved' }],
        })}
        >
          <SearchViewController match={{ params: {} }} />
        </Provider>,
      );
      expect(SearchView).toHaveBeenCalledWith(
        expect.objectContaining({ isAuthorized: true }),
        expect.anything(),
      );
    });

    it('should not authorize signed-in users without approved access', () => {
      render(
        <Provider store={loginStore({ isSignedIn: true, role: 'user', acl: [{ accessStatus: 'pending' }] })}>
          <SearchViewController match={{ params: { id: 'kw' } }} />
        </Provider>,
      );
      expect(SearchView).toHaveBeenCalledWith(
        expect.objectContaining({ isAuthorized: false, isSignedIn: true }),
        expect.anything(),
      );
    });
  });
});
