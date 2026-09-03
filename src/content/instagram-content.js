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

  function handleComposerEvent(event) {
    const composer = window.BeepitInstagramObserver.composerFromEvent(event);
    if (!composer) {
      return;
    }

    window.BeepitComposer.processComposer(composer);
    window.BeepitComposer.scheduleSanitize(composer);
  }

  document.addEventListener("input", handleComposerEvent, true);
  document.addEventListener("paste", handleComposerEvent, true);
  window.BeepitInstagramObserver.start();
  refreshSettings();
})();