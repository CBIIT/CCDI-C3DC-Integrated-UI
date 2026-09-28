import { getEnvBoolean } from '../../src/utils/env';

describe('getEnvBoolean', () => {
  it('should return false for the string false', () => {
    expect(getEnvBoolean('false', true)).toBe(false);
  });

  it('should return the boolean env value when provided', () => {
    expect(getEnvBoolean(true, false)).toBe(true);
    expect(getEnvBoolean(false, true)).toBe(false);
  });

  it('should merge window.injectedEnv over process env', () => {
    window.injectedEnv = { REACT_APP_FROM_WINDOW: 'yes' };
    jest.resetModules();
    const env = require('../../src/utils/env').default;
    expect(env.REACT_APP_FROM_WINDOW).toBe('yes');
    delete window.injectedEnv;
    jest.resetModules();
  });

  it('should fall back to the default when the env value is not a boolean', () => {
    expect(getEnvBoolean(undefined, true)).toBe(true);
    expect(getEnvBoolean('true', false)).toBe(false);
  });
});
