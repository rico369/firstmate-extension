(() => {
  const NS = (window.GmailUXFeatures = window.GmailUXFeatures || {});

  function applyContentWidth(widthPx) {
    const safeWidth = Math.min(1400, Math.max(600, Number(widthPx) || 960));
    document.documentElement.style.setProperty("--gux-content-width", `${safeWidth}px`);
  }

  function applyCalmMode(settings) {
    document.documentElement.classList.toggle("gux-calm-mode", Boolean(settings.calmMode));
  }

  function applyInboxVisibility(settings) {
    document.documentElement.classList.toggle("gux-hide-inbox", Boolean(settings.hideInbox));
  }

  function applyPauseInbox(settings) {
    document.documentElement.classList.toggle("gux-pause-inbox", Boolean(settings.pauseInbox));
  }

  NS.focus = {
    apply(settings) {
      applyContentWidth(settings.contentWidth);
      applyCalmMode(settings);
      applyInboxVisibility(settings);
      applyPauseInbox(settings);
    },
  };
})();
