import {
  getConsentCodesMaxLength,
  parseConsentCodes,
} from '../../../src/pages/globalSearch/Cards/utils/consentCodes';

describe('parseConsentCodes', () => {
  it('should parse arrays, bracketed strings, and comma lists', () => {
    expect(parseConsentCodes(null)).toEqual([]);
    expect(parseConsentCodes(['GRU', ' HMB ', ''])).toEqual(['GRU', 'HMB']);
    expect(parseConsentCodes('[GRU,MDS]')).toEqual(['GRU', 'MDS']);
    expect(parseConsentCodes('[GRU] extra [HMB]')).toEqual(['GRU', 'HMB']);
    expect(parseConsentCodes('GRU, HMB')).toEqual(['GRU', 'HMB']);
    expect(parseConsentCodes('   ')).toEqual([]);
    expect(parseConsentCodes(['[GRU]', null, '[]'])).toEqual(['GRU']);
    expect(parseConsentCodes('[  ]')).toEqual([]);
  });
});

describe('getConsentCodesMaxLength', () => {
  const originalWidth = window.innerWidth;

  afterEach(() => {
    window.innerWidth = originalWidth;
  });

  it('should scale the max length with viewport width', () => {
    window.innerWidth = 500;
    expect(getConsentCodesMaxLength()).toBe(35);
    window.innerWidth = 800;
    expect(getConsentCodesMaxLength()).toBe(55);
    window.innerWidth = 1100;
    expect(getConsentCodesMaxLength()).toBe(75);
    window.innerWidth = 1400;
    expect(getConsentCodesMaxLength()).toBe(95);
  });
});
