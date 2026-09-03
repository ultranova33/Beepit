(() => {
  function normalizedWord(word) {
    return window.BeepitNormalize.normalizeForMatching(word)
      .map((part) => part.value)
      .join("");
  }

  function findMatches(text, blockedWords) {
    const normalizedText = window.BeepitNormalize.normalizeForMatching(text);
    const normalizedValues = normalizedText.map((part) => part.value).join("");
    const matches = [];

    const candidates = blockedWords
      .map((word) => ({ word, normalized: normalizedWord(word) }))
      .filter((candidate) => candidate.normalized.length > 0)
      .sort((left, right) => right.normalized.length - left.normalized.length);

    for (let start = 0; start < normalizedValues.length; start += 1) {
      const candidate = candidates.find((entry) => normalizedValues.startsWith(entry.normalized, start));
      if (!candidate) {
        continue;
      }

      const end = start + candidate.normalized.length - 1;
      matches.push({ start, end, sourceIndexes: normalizedText.slice(start, end + 1).flatMap((part) => part.sourceIndexes) });
      start = end;
    }

    return matches;
  }

  window.BeepitMatcher = { findMatches };
})();
