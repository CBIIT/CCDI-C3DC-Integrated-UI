import custodianUtils from '../../src/utils/custodianUtilFuncs';

describe('src/utils/custodianUtilFuncs', () => {
  describe('getAuthenticatorName', () => {
    it('should map known IDPs to display names', () => {
      expect(custodianUtils.getAuthenticatorName('google')).toBe('Google');
      expect(custodianUtils.getAuthenticatorName('nih')).toBe('NIH');
      expect(custodianUtils.getAuthenticatorName('login.gov')).toBe('Login.gov');
    });

    it('should pass through unknown IDP strings', () => {
      expect(custodianUtils.getAuthenticatorName('custom-idp')).toBe('custom-idp');
    });
  });

  describe('capitalizeFirstLetter', () => {
    it('should handle special-case membership strings', () => {
      expect(custodianUtils.capitalizeFirstLetter('non-member')).toBe('Non-Member');
      expect(custodianUtils.capitalizeFirstLetter('nih')).toBe('NIH');
      expect(custodianUtils.capitalizeFirstLetter('esi')).toBe('ESI');
      expect(custodianUtils.capitalizeFirstLetter('google')).toBe('Google');
    });

    it('should title-case multi-word strings', () => {
      expect(custodianUtils.capitalizeFirstLetter('hello world')).toBe('Hello World');
    });
  });

  describe('getNodeLevelLabel', () => {
    it('should return a string label', () => {
      expect(typeof custodianUtils.getNodeLevelLabel()).toBe('string');
    });
  });
});
