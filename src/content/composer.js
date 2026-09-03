(() => {
  function getText(composer) {
    return composer.innerText || composer.textContent || "";
  }

  function getCaretOffset(composer) {
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

  function replaceComposerText(composer, originalText, censoredText, originalCaretOffset) {
    const beforeCaret = originalText.slice(0, originalCaretOffset);
    const censoredCaretOffset = window.BeepitCensor.censorText(
      beforeCaret,
      window.BeepitCurrentSettings.blockedWords
    ).length;

    composer.focus();
    const selection = window.getSelection();
    const replacementRange = document.createRange();
    replacementRange.selectNodeContents(composer);
    selection.removeAllRanges();
    selection.addRange(replacementRange);

    const replaced = document.execCommand("insertText", false, censoredText);
    if (!replaced || getText(composer) !== censoredText) {
      composer.textContent = censoredText;
    }

    setCaretOffset(composer, censoredCaretOffset);
  }

  function sanitizeComposer(composer) {
    if (window.BeepitProcessing || !window.BeepitCurrentSettings.enabled) {
      return;
    }

    const originalText = getText(composer);
    const censoredText = window.BeepitCensor.censorText(
      originalText,
      window.BeepitCurrentSettings.blockedWords
    );

    if (originalText === censoredText) {
      return;
    }

    window.BeepitProcessing = true;
    try {
      replaceComposerText(composer, originalText, censoredText, getCaretOffset(composer));
    } finally {
      window.BeepitProcessing = false;
    }
  }

  function handleBeforeInput(composer, event) {
    if (!window.BeepitCurrentSettings.enabled || window.BeepitProcessing) {
      return false;
    }

    if (event.inputType !== "insertText" && event.inputType !== "insertFromPaste") {
      return false;
    }

    const insertedText = event.data;
    if (typeof insertedText !== "string") {
      return false;
    }

    const currentText = getText(composer);
    const selection = getSelectionOffsets(composer);
    const proposedText = currentText.slice(0, selection.start) + insertedText + currentText.slice(selection.end);
    const censoredText = window.BeepitCensor.censorText(
      proposedText,
      window.BeepitCurrentSettings.blockedWords
    );

    if (censoredText === proposedText) {
      return false;
    }

    event.preventDefault();
    window.BeepitProcessing = true;
    try {
      replaceComposerText(composer, currentText, censoredText, selection.start + insertedText.length);
    } finally {
      window.BeepitProcessing = false;
    }
    return true;
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
    composer.addEventListener("input", () => scheduleSanitize(composer));
    composer.addEventListener("compositionend", () => scheduleSanitize(composer));
    sanitizeComposer(composer);
  }

  window.BeepitComposer = { processComposer, sanitizeComposer, scheduleSanitize, handleBeforeInput };
})();
