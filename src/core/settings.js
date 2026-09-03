(() => {
  const defaults = {
    enabled: true,
    replacementCharacter: "#",
    blockedWords: ["fuck", "shit", "bitch", "asshole", "damn", "hell"]
  };

  function getSettings() {
    return new Promise((resolve) => {
      chrome.storage.local.get(defaults, (stored) => resolve({ ...defaults, ...stored }));
    });
  }

  function saveSettings(settings) {
    return new Promise((resolve) => chrome.storage.local.set(settings, resolve));
  }

  window.BeepitSettings = { defaults, getSettings, saveSettings };
})();
