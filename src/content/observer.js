(() => {
  function visible(element) {
    const style = window.getComputedStyle(element);
    return style.display !== "none" && style.visibility !== "hidden";
  }

  function findComposers() {
    const composers = Array.from(document.querySelectorAll("[contenteditable=\"true\"]"))
      .filter(visible);
    const footerComposers = composers.filter((composer) => composer.closest("footer"));
    return (footerComposers.length > 0 ? footerComposers : composers).slice(-2);
  }

  function scan() {
    findComposers().forEach((composer) => {
      window.BeepitComposer.processComposer(composer);
    });
  }

  function start() {
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

    const observer = new MutationObserver(scheduleScan);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  window.BeepitObserver = { start };
})();
