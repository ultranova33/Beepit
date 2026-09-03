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
      window.BeepitComposer.sanitizeComposer(composer);
    });
  }

  function start() {
    scan();
    const observer = new MutationObserver(scan);
    observer.observe(document.body, { childList: true, subtree: true });
    window.setInterval(scan, 300);
  }

  window.BeepitObserver = { start };
})();
