(() => {
  function visible(element) {
    const style = window.getComputedStyle(element);
    return style.display !== "none" && style.visibility !== "hidden" && style.opacity !== "0";
  }

  function isMessageComposer(element) {
    if (!visible(element) || element.disabled || element.getAttribute("aria-hidden") === "true") {
      return false;
    }

    const label = `${element.getAttribute("aria-label") || ""} ${element.getAttribute("placeholder") || ""}`.toLowerCase();
    if (/search|username|email|password|comment/.test(label)) {
      return false;
    }

    if (/message|reply|dm|chat/.test(label)) {
      return true;
    }

    return element.matches("textarea, [contenteditable=\"true\"], [role=\"textbox\"]") &&
      Boolean(element.closest('[role="dialog"], main, section'));
  }

  function findComposers() {
    return Array.from(document.querySelectorAll("textarea, [contenteditable=\"true\"], [role=\"textbox\"]"))
      .filter(isMessageComposer);
  }

  function composerFromEvent(event) {
    const path = typeof event.composedPath === "function" ? event.composedPath() : [event.target];
    return path.find((element) => element instanceof Element && isMessageComposer(element)) || null;
  }

  function scan() {
    findComposers().forEach((composer) => window.BeepitComposer.processComposer(composer));
  }

  function start() {
    if (window.BeepitInstagramObserverStarted) {
      return;
    }

    window.BeepitInstagramObserverStarted = true;
    scan();

    let scanScheduled = false;
    const scheduleScan = () => {
      if (scanScheduled) {
        return;
      }

      scanScheduled = true;
      window.setTimeout(() => {
        scanScheduled = false;
        scan();
      }, 100);
    };

    new MutationObserver(scheduleScan).observe(document.body, { childList: true, subtree: true });
  }

  window.BeepitInstagramObserver = { start, findComposers, composerFromEvent, isMessageComposer };
})();