const shuffle = require("../src/shuffle");

describe("shuffle should...", () => {
  // CODE HERE

  test('shuffle returns an array', () => {
    const botArray = ["bot1", "bot2", "bot3", "bot4"];
    const result = shuffle(botArray);
    expect(Array.isArray(result)).toBe(true);
  });

  test('returns an array of the same length as the argument sent in', () => {
    const botArray = ["bot1", "bot2", "bot3", "bot4"];
    const result = shuffle(botArray);
    expect(result.length).toBe(botArray.length);
  });

  test('all the same items are in the array', () => {
    const botArray = ["bot1", "bot2", "bot3", "bot4"];
    const result = shuffle(botArray);
    expect(result.sort()).toEqual(botArray.sort());
  });

  test('items have been shuffled around', () => {
    const botArray = ["bot1", "bot2", "bot3", "bot4"];
    const result = shuffle(botArray);
    expect(result).not.toEqual(botArray);
  });
});
