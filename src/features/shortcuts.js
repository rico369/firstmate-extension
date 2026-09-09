(() => {
  const NS = (window.GmailFlowFeatures = window.GmailFlowFeatures || {});

  let flowModeActive = false;
  let flowModeOverlay = null;

  function createFlowOverlay() {
    if (flowModeOverlay) return flowModeOverlay;
    flowModeOverlay = document.createElement("div");
    flowModeOverlay.id = "gf-flow-overlay";
    flowModeOverlay.setAttribute("role", "dialog");
    flowModeOverlay.setAttribute("aria-label", "Flow Mode - Process one email at a time");
    flowModeOverlay.innerHTML = `
      <div class="gf-flow-header">
        <span class="gf-flow-title">Flow Mode</span>
        <span class="gf-flow-hint">A = Archive · R = Reply · D = Delete · Esc = Exit</span>
        <button class="gf-flow-close" aria-label="Exit Flow Mode">✕</button>
      </div>
      <div class="gf-flow-content"></div>
      <div class="gf-flow-nav">
        <button class="gf-flow-prev" aria-label="Previous email">← Prev</button>
        <span class="gf-flow-count"></span>
        <button class="gf-flow-next" aria-label="Next email">Next →</button>
      </div>
    `;
    document.documentElement.appendChild(flowModeOverlay);

    flowModeOverlay.querySelector(".gf-flow-close").addEventListener("click", exitFlowMode);
    flowModeOverlay.querySelector(".gf-flow-prev").addEventListener("click", () => navigateFlow(-1));
    flowModeOverlay.querySelector(".gf-flow-next").addEventListener("click", () => navigateFlow(1));

    return flowModeOverlay;
  }

  function exitFlowMode() {
    flowModeActive = false;
    if (flowModeOverlay) {
      flowModeOverlay.classList.remove("gf-flow-active");
    }
    document.documentElement.classList.remove("gf-flow-mode");
  }

  function navigateFlow(direction) {
    const event = new KeyboardEvent("keydown", {
      key: direction > 0 ? "j" : "k",
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(event);
  }

  function enterFlowMode() {
    flowModeActive = true;
    createFlowOverlay();
    flowModeOverlay.classList.add("gf-flow-active");
    document.documentElement.classList.add("gf-flow-mode");
  }

  function handleFlowModeKeys(event) {
    if (!flowModeActive) return;

    switch (event.key) {
      case "Escape":
        event.preventDefault();
        exitFlowMode();
        break;
      case "a":
        event.preventDefault();
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "e", bubbles: true }));
        break;
      case "r":
        event.preventDefault();
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "r", bubbles: true }));
        break;
      case "d":
        event.preventDefault();
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "#", bubbles: true }));
        break;
    }
  }

  function setupShortcuts(settings) {
    document.removeEventListener("keydown", handleFlowModeKeys);
    document.addEventListener("keydown", handleFlowModeKeys);

    document.addEventListener("keydown", (event) => {
      if (event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA") return;
      if (event.ctrlKey || event.metaKey || event.altKey) return;

      const key = (settings.flowModeKey || "f").toLowerCase();
      if (event.key.toLowerCase() === key && !flowModeActive) {
        event.preventDefault();
        enterFlowMode();
      }
    });
  }

  NS.shortcuts = {
    apply(settings) {
      setupShortcuts(settings);
    },
    enterFlowMode,
    exitFlowMode,
    isActive: () => flowModeActive,
  };
})();
