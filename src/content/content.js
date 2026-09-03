(() => {
  window.BeepitCurrentSettings = { ...window.BeepitSettings.defaults };
  window.BeepitProcessing = false;

  function refreshSettings() {
    window.BeepitSettings.getSettings().then((settings) => {
      window.BeepitCurrentSettings = settings;
      window.BeepitObserver.start();
    });
  }

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "local") {
      return;
    }

    Object.keys(changes).forEach((key) => {
      window.BeepitCurrentSettings[key] = changes[key].newValue;
    });
  });

  function handleComposerEvent(event) {
    const path = typeof event.composedPath === "function" ? event.composedPath() : [event.target];
    const composer = path.find((element) => element instanceof Element && element.matches("[contenteditable=\"true\"]"));
    if (!composer) {
      return;
    }

    window.BeepitComposer.processComposer(composer);
    if (event.type === "beforeinput") {
      if (window.BeepitComposer.handleBeforeInput(composer, event)) {
        event.stopImmediatePropagation();
      }
      return;
    }
    window.BeepitComposer.scheduleSanitize(composer);
  }

  window.addEventListener("input", handleComposerEvent, true);
  window.addEventListener("beforeinput", handleComposerEvent, true);
  window.addEventListener("paste", handleComposerEvent, true);
  document.addEventListener("input", handleComposerEvent, true);
  document.addEventListener("beforeinput", handleComposerEvent, true);
  document.addEventListener("paste", handleComposerEvent, true);

  refreshSettings();
})();
