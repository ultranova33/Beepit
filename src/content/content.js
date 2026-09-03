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

  refreshSettings();
})();
