(() => {
  function isTextarea(composer) {
    return composer instanceof HTMLTextAreaElement;
  }

  function getText(composer) {
    if (isTextarea(composer)) {
      return composer.value;
    }

    return (composer.textContent || "").replace(/\u00a0/g, " ");
  }

  function getCaretOffset(composer) {
    if (isTextarea(composer)) {
      return composer.selectionStart || 0;
    }

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !composer.contains(selection.anchorNode)) {
      return getText(composer).length;
    }

    const range = selection.getRangeAt(0).cloneRange();
    range.selectNodeContents(composer);
    range.setEnd(selection.anchorNode, selection.anchorOffset);
    return range.toString().length;
  }

  function getSelectionOffsets(composer) {
    if (isTextarea(composer)) {
      return { start: composer.selectionStart || 0, end: composer.selectionEnd || 0 };
    }

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !composer.contains(selection.anchorNode)) {
      const offset = getText(composer).length;
      return { start: offset, end: offset };
    }

    const range = selection.getRangeAt(0).cloneRange();
    const beforeStart = range.cloneRange();
    beforeStart.selectNodeContents(composer);
    beforeStart.setEnd(selection.anchorNode, selection.anchorOffset);
    const beforeEnd = range.cloneRange();
    beforeEnd.selectNodeContents(composer);
    beforeEnd.setEnd(selection.focusNode, selection.focusOffset);
    const start = Math.min(beforeStart.toString().length, beforeEnd.toString().length);
    const end = Math.max(beforeStart.toString().length, beforeEnd.toString().length);
    return { start, end };
  }

  function setCaretOffset(composer, offset) {
    if (isTextarea(composer)) {
      composer.setSelectionRange(offset, offset);
      return;
    }

    const selection = window.getSelection();
    const range = document.createRange();
    let remaining = offset;
    const walker = document.createTreeWalker(composer, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();

    while (node) {
      if (remaining <= node.nodeValue.length) {
        range.setStart(node, remaining);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        return;
      }
      remaining -= node.nodeValue.length;
      node = walker.nextNode();
    }

    range.selectNodeContents(composer);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  function rangeAtOffsets(composer, startOffset, endOffset) {
    const range = document.createRange();
    const walker = document.createTreeWalker(composer, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    let position = 0;
    let startNode = null;
    let endNode = null;
    let startInNode = 0;
    let endInNode = 0;

    while (node) {
      const nextPosition = position + node.nodeValue.length;
      if (!startNode && startOffset <= nextPosition) {
        startNode = node;
        startInNode = Math.max(0, startOffset - position);
      }
      if (endOffset <= nextPosition) {
        endNode = node;
        endInNode = Math.max(0, endOffset - position);
        break;
      }
      position = nextPosition;
      node = walker.nextNode();
    }

    if (!startNode || !endNode) {
      return null;
    }

    range.setStart(startNode, startInNode);
    range.setEnd(endNode, endInNode);
    return range;
  }

  function replaceRange(composer, startOffset, endOffset, replacement) {
    if (isTextarea(composer)) {
      composer.focus();
      composer.setRangeText(replacement, startOffset, endOffset, "preserve");
      return true;
    }

    const range = rangeAtOffsets(composer, startOffset, endOffset);
    if (!range) {
      return false;
    }

    composer.focus();
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    if (document.execCommand("insertText", false, replacement)) {
      return true;
    }

    range.deleteContents();
    range.insertNode(document.createTextNode(replacement));
    composer.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: replacement }));
    return true;
  }

  function sanitizeComposer(composer) {
    if (window.BeepitProcessing || !window.BeepitCurrentSettings.enabled) {
      return;
    }

    const originalText = getText(composer);
    const censoredText = window.BeepitCensor.censorText(originalText, window.BeepitCurrentSettings.blockedWords);
    const matches = window.BeepitMatcher.findMatches(originalText, window.BeepitCurrentSettings.blockedWords)
      .map((match) => {
        const start = Math.min(...match.sourceIndexes);
        const end = Math.max(...match.sourceIndexes) + 1;
        return { start, end, replacement: censoredText.slice(start, end) };
      })
      .filter((match) => match.replacement !== originalText.slice(match.start, match.end))
      .sort((left, right) => right.start - left.start);

    if (matches.length === 0) {
      return;
    }

    window.BeepitProcessing = true;
    try {
      const caretOffset = getCaretOffset(composer);
      matches.forEach((match) => replaceRange(composer, match.start, match.end, match.replacement));
      setCaretOffset(composer, caretOffset);
    } finally {
      window.BeepitProcessing = false;
    }
  }

  function scheduleSanitize(composer) {
    if (composer.dataset.beepitSanitizeScheduled === "true") {
      return;
    }

    composer.dataset.beepitSanitizeScheduled = "true";
    window.setTimeout(() => {
      composer.dataset.beepitSanitizeScheduled = "false";
      sanitizeComposer(composer);
    }, 0);
  }

  function processComposer(composer) {
    if (composer.dataset.beepitAttached === "true") {
      return;
    }

    composer.dataset.beepitAttached = "true";
    composer.addEventListener("compositionend", () => scheduleSanitize(composer));
    sanitizeComposer(composer);
  }

  window.BeepitComposer = { processComposer, sanitizeComposer, scheduleSanitize };
})();
