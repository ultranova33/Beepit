(() => {
  const vowels = new Set(["a", "e", "i", "o", "u"]);

  function censorText(text, blockedWords) {
    const characters = Array.from(text);
    const matches = window.BeepitMatcher.findMatches(text, blockedWords);
    const replacements = new Map();

    matches.forEach((match) => {
      let vowelIndex = 0;
      match.sourceIndexes.forEach((sourceIndex) => {
        const normalized = window.BeepitNormalize.normalizeCharacter(characters[sourceIndex]);
        if (normalized === "s") {
          replacements.set(sourceIndex, "$");
        } else if (normalized === "a") {
          replacements.set(sourceIndex, "@");
        } else if (vowels.has(normalized)) {
          replacements.set(sourceIndex, vowelIndex % 2 === 0 ? "#" : "*");
          vowelIndex += 1;
        }
      });
    });

    return characters.map((character, index) => replacements.get(index) || character).join("");
  }

  window.BeepitCensor = { censorText };
})();
