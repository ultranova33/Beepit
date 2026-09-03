(() => {
  const form = document.querySelector("#settings-form");
  const enabled = document.querySelector("#enabled");
  const words = document.querySelector("#words");
  const status = document.querySelector("#status");

  window.BeepitSettings.getSettings().then((settings) => {
    enabled.checked = settings.enabled;
    words.value = settings.blockedWords.join("\n");
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const blockedWords = [...new Set(words.value.split(/\r?\n/).map((word) => word.trim()).filter(Boolean))];

    window.BeepitSettings.saveSettings({
      enabled: enabled.checked,
      blockedWords
    }).then(() => {
      status.textContent = "Settings saved.";
      window.setTimeout(() => { status.textContent = ""; }, 2500);
    });
  });
})();
