(() => {
  const vowels = new Set(["a", "e", "i", "o", "u"]);

  function censorText(text, blockedWords, replacementCharacter = "#") {
    const characters = Array.from(text);
    const matches = window.BeepitMatcher.findMatches(text, blockedWords);
    const indexesToReplace = new Set();

    matches.forEach((match) => {
      match.sourceIndexes.forEach((sourceIndex) => {
        const normalized = window.BeepitNormalize.normalizeCharacter(characters[sourceIndex]);
        if (vowels.has(normalized)) {
          indexesToReplace.add(sourceIndex);
        }
      });
    });

    return characters.map((character, index) => indexesToReplace.has(index) ? replacementCharacter : character).join("");
  }

  window.BeepitCensor = { censorText };
})();
