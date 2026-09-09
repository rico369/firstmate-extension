(() => {
  const NS = (window.GmailUXFeatures = window.GmailUXFeatures || {});

  function hideElement(el) {
    if (!el || el.classList.contains("gux-hidden")) return;
    el.classList.add("gux-hidden");
  }

  function showElement(el) {
    if (!el) return;
    el.classList.remove("gux-hidden");
  }

  function applyCleanup(settings) {
    const maybeSidebars = document.querySelectorAll(
      '[aria-label*="Side panel"], [aria-label*="side panel"], [aria-label*="Google apps"]'
    );
    maybeSidebars.forEach((el) => {
      if (settings.hideSidebar) hideElement(el);
      else showElement(el);
    });

    // Hide right utility rail by targeting known accessible tool labels.
    const tools = document.querySelectorAll(
      '[aria-label*="Calendar"], [aria-label*="Keep"], [aria-label*="Tasks"], [aria-label*="Contacts"]'
    );
    tools.forEach((tool) => {
      const panelLike = tool.closest('[aria-label*="Side panel"], [aria-label*="side panel"], [role="tablist"]');
      if (!panelLike) return;
      if (settings.hideSidebar) hideElement(panelLike);
      else showElement(panelLike);
    });

    const navRoots = document.querySelectorAll('[role="navigation"], nav, [aria-label*="Main menu"]');
    navRoots.forEach((root) => {
      const items = root.querySelectorAll('[aria-label], [role="link"], [role="treeitem"]');
      items.forEach((item) => {
        const label = `${item.getAttribute("aria-label") || ""} ${item.textContent || ""}`.toLowerCase();
        if (!label) return;

        const isMeet = label.includes("meet");
        const isSpaces = label.includes("spaces");
        if (!isMeet && !isSpaces) return;

        const container = item.closest('[role="treeitem"], [role="link"], li, div');
        const target = container || item;

        if ((isMeet && settings.hideMeet) || (isSpaces && settings.hideSpaces)) hideElement(target);
        else showElement(target);
      });
    });
  }

  function applyDensity(settings) {
    document.documentElement.classList.toggle("gux-compact-mode", Boolean(settings.compactSpacing));
    document.documentElement.classList.toggle("gux-spacious-mode", Boolean(settings.increaseSpacing));
    document.documentElement.classList.toggle("gux-large-font", Boolean(settings.largeFontMode));
  }

  function applyVisualCalm(settings) {
    document.documentElement.classList.toggle("gux-reduce-contrast", Boolean(settings.reduceContrast));
    document.documentElement.classList.toggle("gux-muted-colors", Boolean(settings.mutedColors));
    document.documentElement.classList.toggle("gux-low-stimulation", Boolean(settings.lowStimulationMode));
  }

  NS.cleanup = {
    apply(settings) {
      applyCleanup(settings);
      applyDensity(settings);
      applyVisualCalm(settings);
    },
  };
})();
