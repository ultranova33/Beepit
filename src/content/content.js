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
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const composer = target.closest("[contenteditable=\"true\"]");
    if (!composer || !composer.isContentEditable) {
      return;
    }

    window.BeepitComposer.processComposer(composer);
    if (event.type === "paste") {
      window.setTimeout(() => window.BeepitComposer.sanitizeComposer(composer), 0);
    }
  }

  document.addEventListener("input", handleComposerEvent, true);
  document.addEventListener("paste", handleComposerEvent, true);

  refreshSettings();
})();
