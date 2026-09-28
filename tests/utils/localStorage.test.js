import {
  storeInLocalStorage,
  getFromLocalStorage,
  deleteFromLocalStorage,
} from '../../src/utils/localStorage';

describe('src/utils/localStorage', () => {
  let store;

  beforeEach(() => {
    store = {};
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: {
        getItem: jest.fn((key) => (Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null)),
        setItem: jest.fn((key, value) => {
          store[key] = String(value);
        }),
        removeItem: jest.fn((key) => {
          delete store[key];
        }),
      },
      writable: true,
    });
  });

  it('should serialize values with JSON.stringify', () => {
    storeInLocalStorage('k', { a: 1 });
    expect(window.localStorage.setItem).toHaveBeenCalledWith('k', JSON.stringify({ a: 1 }));
    expect(getFromLocalStorage('k')).toEqual({ a: 1 });
  });

  it('should return an empty object when the key is missing', () => {
    expect(getFromLocalStorage('missing')).toEqual({});
  });

  it('should remove the key', () => {
    store.k = '"x"';
    deleteFromLocalStorage('k');
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('k');
  });
});
