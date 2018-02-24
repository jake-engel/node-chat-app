const isRealString = (str) => {
  const spaceString = '+'.repeat(str.length);
  return typeof str === 'string' && str.trim().length > 0 && str !== spaceString;
};

module.exports = { isRealString };
