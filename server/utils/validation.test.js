const expect = require('expect');

const { isRealString } = require('./validation');

describe('isRealString', () => {
  it('should reject non-string values', () => {
    expect(isRealString(15)).toBe(false);
    expect(isRealString(false)).toBe(false);
  });

  it('should reject string only with spaces', () => {
    expect(isRealString('   ')).toBe(false);
  });

  it('should allow string with non-space characters', () => {
    expect(isRealString('   string w/ chars   ')).toBe(true);
  });
});
