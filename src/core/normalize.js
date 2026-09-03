(() => {
  const confusables = {
    "0": "o",
    "1": "i",
    "2": "z",
    "3": "e",
    "4": "a",
    "5": "s",
    "6": "g",
    "7": "t",
    "8": "b",
    "9": "g",
    "@": "a",
    "$": "s",
    "!": "i"
  };

  const separatorPattern = /[\s\p{P}\p{S}_]+/u;
  const combiningMarkPattern = /\p{M}/u;
  const letterOrNumberPattern = /[\p{L}\p{N}]/u;

  function normalizeCharacter(character) {
    return (confusables[character] || character)
      .normalize("NFKD")
      .split("")
      .filter((part) => !combiningMarkPattern.test(part))
      .join("")
      .toLowerCase();
  }

  function normalizeForMatching(text) {
    const characters = Array.from(text);
    const normalized = [];
    let previous = "";

    characters.forEach((character, characterIndex) => {
      const normalizedCharacter = normalizeCharacter(character);
      if (!normalizedCharacter || (separatorPattern.test(character) && !confusables[character])) {
        return;
      }

      for (const part of Array.from(normalizedCharacter)) {
        if (part === previous) {
          normalized[normalized.length - 1].sourceIndexes.push(characterIndex);
        } else {
          normalized.push({ value: part, sourceIndexes: [characterIndex] });
          previous = part;
        }
      }
    });

    return normalized;
  }

  function isWordCharacter(character) {
    return Boolean(character && letterOrNumberPattern.test(character));
  }

  window.BeepitNormalize = { normalizeCharacter, normalizeForMatching, isWordCharacter };
})();
