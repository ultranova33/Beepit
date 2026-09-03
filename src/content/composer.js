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

    composer.textContent = censoredText;
    setCaretOffset(composer, censoredCaretOffset);
    composer.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: null }));
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

  function processComposer(composer) {
    if (composer.dataset.beepitAttached === "true") {
      return;
    }

    composer.dataset.beepitAttached = "true";
    composer.addEventListener("input", () => window.setTimeout(() => sanitizeComposer(composer), 0));
    composer.addEventListener("compositionend", () => window.setTimeout(() => sanitizeComposer(composer), 0));
    sanitizeComposer(composer);
  }

  window.BeepitComposer = { processComposer, sanitizeComposer };
})();
