(() => {
  function visible(element) {
    const style = window.getComputedStyle(element);
    return style.display !== "none" && style.visibility !== "hidden";
  }

  function findComposers() {
    const footerComposers = Array.from(document.querySelectorAll("footer [contenteditable=\"true\"]"));
    if (footerComposers.length > 0) {
      return footerComposers.filter(visible);
    }

    return Array.from(document.querySelectorAll("[contenteditable=\"true\"][role=\"textbox\"]"))
      .filter(visible)
      .slice(-1);
  }

  function scan() {
    findComposers().forEach(window.BeepitComposer.processComposer);
  }

  function start() {
    scan();
    const observer = new MutationObserver(scan);
    observer.observe(document.body, { childList: true, subtree: true });
    window.setInterval(scan, 1500);
  }

  window.BeepitObserver = { start };
})();
