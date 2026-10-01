jest.mock('../../src/bento/siteWideConfig', () => ({
  LAST_VISITED_HASH_KEY: 'lastVisited',
}));

import React from 'react';
import { render } from '@testing-library/react';
import useVisitedPageSync from '../../src/utils/useVisitedPageSync';

function Probe() {
  useVisitedPageSync();
  return null;
}

describe('useVisitedPageSync', () => {
  beforeEach(() => {
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should persist the current hash when it is not the login page', () => {
    window.location.hash = '#/explore';
    render(<Probe />);
    expect(localStorage.setItem).toHaveBeenCalledWith('lastVisited', '#/explore');
  });

  it('should skip persisting the login hash', () => {
    window.location.hash = '#/user/login';
    render(<Probe />);
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });
});
