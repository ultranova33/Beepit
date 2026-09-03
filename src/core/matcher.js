(() => {
  function normalizedWord(word) {
    return window.BeepitNormalize.normalizeForMatching(word)
      .map((part) => part.value)
      .join("");
  }

  function protectedRanges(text) {
    const ranges = [];
    const urlPattern = /(?:https?:\/\/|www\.)[^\s<>]+|(?:[a-z0-9-]+\.)+(?:com|org|net|edu|gov|io|dev|app|co|in|uk|me|ly|gg|ai)(?:\/[^\s<>]*)?/giu;
    let match;

    while ((match = urlPattern.exec(text)) !== null) {
      ranges.push({ start: match.index, end: match.index + match[0].length });
    }

    return ranges;
  }

  function overlapsProtectedRange(sourceIndexes, ranges) {
    if (!sourceIndexes.length) {
      return false;
    }

    const start = Math.min(...sourceIndexes);
    const end = Math.max(...sourceIndexes) + 1;
    return ranges.some((range) => start < range.end && end > range.start);
  }

  function findMatches(text, blockedWords) {
    const normalizedText = window.BeepitNormalize.normalizeForMatching(text);
    const normalizedValues = normalizedText.map((part) => part.value).join("");
    const matches = [];
    const protected = protectedRanges(text);

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
      const sourceIndexes = normalizedText.slice(start, end + 1).flatMap((part) => part.sourceIndexes);
      if (overlapsProtectedRange(sourceIndexes, protected)) {
        continue;
      }

      matches.push({
        start,
        end,
        sourceIndexes
      });
      start = end;
    }

    return matches;
  }

  window.BeepitMatcher = { findMatches };
})();
