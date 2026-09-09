(() => {
  const NS = (window.GmailFlowFeatures = window.GmailFlowFeatures || {});

  function hideElement(el) {
    if (!el || el.classList.contains("gf-hidden")) return;
    el.classList.add("gf-hidden");
  }

  function showElement(el) {
    if (!el) return;
    el.classList.remove("gf-hidden");
  }

  function applyCleanup(settings) {
    const maybeSidebars = document.querySelectorAll(
      '[aria-label*="Side panel"], [aria-label*="side panel"], [aria-label*="Google apps"]'
    );
    maybeSidebars.forEach((el) => {
      if (settings.hideSidebar) hideElement(el);
      else showElement(el);
    });

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

    const tabs = document.querySelectorAll('[role="tab"]');
    tabs.forEach((tab) => {
      const label = (tab.getAttribute("aria-label") || tab.textContent || "").toLowerCase();
      const isPromo = label.includes("promotions") || label.includes("promotional");
      const isSocial = label.includes("social");
      if (isPromo && settings.hidePromotions) hideElement(tab.closest('[role="tablist"]') || tab);
      else if (isSocial && settings.hideSocial) hideElement(tab.closest('[role="tablist"]') || tab);
    });
  }

  function applyDensity(settings) {
    const html = document.documentElement;
    html.classList.toggle("gf-compact-mode", Boolean(settings.compactSpacing));
    html.classList.toggle("gf-spacious-mode", Boolean(settings.increaseSpacing));
    html.classList.toggle("gf-large-font", Boolean(settings.largeFontMode));
    html.classList.toggle("gf-reduced-motion", Boolean(settings.animationsReduced));
    html.classList.toggle("gf-dark-mode", Boolean(settings.darkMode));
  }

  function applyVisualCalm(settings) {
    const html = document.documentElement;
    html.classList.toggle("gf-reduce-contrast", Boolean(settings.reduceContrast));
    html.classList.toggle("gf-muted-colors", Boolean(settings.mutedColors));
    html.classList.toggle("gf-low-stimulation", Boolean(settings.lowStimulationMode));
    html.classList.toggle("gf-calm-mode", Boolean(settings.calmMode));
  }

  NS.cleanup = {
    apply(settings) {
      applyCleanup(settings);
      applyDensity(settings);
      applyVisualCalm(settings);
    },
  };
})();
