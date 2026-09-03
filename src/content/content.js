(() => {
  window.BeepitCurrentSettings = { ...window.BeepitSettings.defaults };
  window.BeepitProcessing = false;

  function refreshSettings() {
    window.BeepitSettings.getSettings()
      .then((settings) => {
        window.BeepitCurrentSettings = settings;
      })
      .catch(() => {
        window.BeepitCurrentSettings = { ...window.BeepitSettings.defaults };
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
    window.BeepitComposer.scheduleSanitize(composer);
  }

  document.addEventListener("input", handleComposerEvent, true);
  document.addEventListener("paste", handleComposerEvent, true);

  window.BeepitObserver.start();
  refreshSettings();
})();
