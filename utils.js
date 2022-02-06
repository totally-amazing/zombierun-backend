exports.convertFirstLetterCase = (string) => {
  const isFirstUpperCase = /[A-Z]/.test(string[0]);
  const firstLetter = isFirstUpperCase
    ? string[0].toLowerCase()
    : string[0].toUpperCase();
  const leftLetters = string.slice(1);

  return firstLetter + leftLetters;
};
