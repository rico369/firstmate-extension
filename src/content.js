(() => {
  const STORAGE_KEY = "gmailFlowSettings";

  const PROFILES = {
    zen: {
      label: "Zen",
      icon: "🧘",
      description: "Muted, spacious, calm",
      settings: {
        hideSidebar: true,
        hideMeet: true,
        hideSpaces: true,
        compactSpacing: false,
        increaseSpacing: true,
        largeFontMode: true,
        contentWidth: 1000,
        reduceContrast: true,
        mutedColors: true,
        lowStimulationMode: true,
        calmMode: true,
        hidePromotions: true,
        hideSocial: true,
        groupByDate: true,
        showEmailAge: true,
        showPriorityBadges: true,
        animationsReduced: true,
      },
    },
    speed: {
      label: "Speed",
      icon: "⚡",
      description: "Compact, keyboard-first, fast",
      settings: {
        hideSidebar: true,
        hideMeet: true,
        hideSpaces: true,
        compactSpacing: true,
        increaseSpacing: false,
        largeFontMode: false,
        contentWidth: 1200,
        reduceContrast: false,
        mutedColors: false,
        lowStimulationMode: false,
        calmMode: false,
        hidePromotions: false,
        hideSocial: false,
        groupByDate: false,
        showEmailAge: true,
        showPriorityBadges: true,
        animationsReduced: true,
      },
    },
    night: {
      label: "Night",
      icon: "🌙",
      description: "Dark, warm, easy on eyes",
      settings: {
        hideSidebar: true,
        hideMeet: true,
        hideSpaces: true,
        compactSpacing: false,
        increaseSpacing: false,
        largeFontMode: false,
        contentWidth: 1100,
        reduceContrast: true,
        mutedColors: true,
        lowStimulationMode: false,
        calmMode: true,
        darkMode: true,
        hidePromotions: true,
        hideSocial: false,
        groupByDate: true,
        showEmailAge: true,
        showPriorityBadges: false,
        animationsReduced: true,
      },
    },
    focus: {
      label: "Focus",
      icon: "🎯",
      description: "Inbox only, no distractions",
      settings: {
        hideSidebar: true,
        hideMeet: true,
        hideSpaces: true,
        compactSpacing: false,
        increaseSpacing: false,
        largeFontMode: false,
        contentWidth: 900,
        reduceContrast: false,
        mutedColors: false,
        lowStimulationMode: false,
        calmMode: false,
        hidePromotions: true,
        hideSocial: true,
        groupByDate: false,
        showEmailAge: false,
        showPriorityBadges: true,
        animationsReduced: true,
      },
    },
  };

  const DEFAULT_SETTINGS = {
    activeProfile: "zen",
    hideSidebar: true,
    hideMeet: true,
    hideSpaces: true,
    compactSpacing: false,
    increaseSpacing: true,
    largeFontMode: true,
    contentWidth: 1000,
    reduceContrast: true,
    mutedColors: true,
    lowStimulationMode: true,
    calmMode: true,
    darkMode: false,
    hidePromotions: true,
    hideSocial: true,
    groupByDate: true,
    showEmailAge: true,
    showPriorityBadges: true,
    animationsReduced: true,
    enableAccountColorBar: true,
    accountMappings: {},
    defaultColor: "gray",
    highlightKeywords: ["interview", "offer", "deadline", "urgent", "action required"],
    highlightImportantSenders: true,
    dimReadEmails: true,
    highlightUnreadOnly: false,
    flowModeKey: "f",
    focusTimerMinutes: 25,
    enableFocusTimer: false,
    // Typography
    enhancedTypography: true,
    fontFamily: "Atkinson Hyperlegible",
    fontSize: 16,
    lineHeight: 1.5,
    letterSpacing: 0,
    wordSpacing: 0,
    textWidth: "comfortable",
    // Background Tints
    backgroundTint: "none",
    tintTextColor: "#333",
    // DOM Surgery
    aggressiveSurgery: false,
    aggressiveRightSidebar: false,
    removeTopBanner: false,
    removePromoTab: false,
    removeMeetTab: false,
    removeSpacesTab: false,
    removeChatWidget: false,
    removeComposeArea: false,
    removeLeftNav: false,
    removeSearch: false,
    removeHelp: false,
    removeSettingsGear: false,
    removeAboutMe: false,
    removeUpgrade: false,
    removePromotionalCards: false,
    removeCategories: false,
    removeInboxLabels: false,
    simplifyEmailList: false,
    removeFooter: false,
    // Reading Mode
    readingMode: false,
    chunkLongEmails: false,
  };

  const COLOR_PALETTE = {
    red: "#EA4335",
    blue: "#4285F4",
    green: "#34A853",
    yellow: "#FBBC05",
    purple: "#A142F4",
    orange: "#F57C00",
    teal: "#009688",
    pink: "#E91E63",
    gray: "#5F6368",
  };

  const state = {
    settings: { ...DEFAULT_SETTINGS },
    activeEmail: "",
    debounceTimer: null,
    observer: null,
  };

  function normalizeEmail(value) {
    return (value || "").trim().toLowerCase();
  }

  function extractEmails(text) {
    if (!text) return [];
    const matches = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi);
    if (!matches) return [];
    return [...new Set(matches.map(normalizeEmail))];
  }

  function detectActiveEmail() {
    const candidates = [];
    const push = (text, score) => {
      extractEmails(text).forEach((email) => candidates.push({ email, score }));
    };

    const bannerNodes = document.querySelectorAll(
      'div[role="banner"] [aria-label], div[role="banner"] [title], header [aria-label], header [title]'
    );
    bannerNodes.forEach((node) => {
      push(node.getAttribute("aria-label"), 100);
      push(node.getAttribute("title"), 95);
      push(node.textContent, 80);
    });

    const accountNodes = document.querySelectorAll(
      '[aria-label*="Google Account"], a[href*="SignOutOptions"], [data-ogsr-up] [aria-label]'
    );
    accountNodes.forEach((node) => {
      push(node.getAttribute("aria-label"), 90);
      push(node.getAttribute("title"), 85);
    });

    push(document.title, 65);
    push(window.location.href, 5);

    if (candidates.length === 0) return "";
    candidates.sort((a, b) => b.score - a.score);
    return candidates[0].email;
  }

  function colorToHex(colorNameOrHex) {
    const value = (colorNameOrHex || "").trim().toLowerCase();
    if (!value) return COLOR_PALETTE.gray;
    if (value.startsWith("#")) return value;
    return COLOR_PALETTE[value] || COLOR_PALETTE.gray;
  }

  function getAccountColor(email) {
    const mappings = state.settings.accountMappings || {};
    return colorToHex(mappings[email] || state.settings.defaultColor);
  }

  function makeFaviconDataUrl(colorHex, initialChar) {
    const initial = (initialChar || "?").slice(0, 1).toUpperCase();
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="30" fill="${colorHex}" />
        <text x="32" y="39" text-anchor="middle"
          font-family="Arial, Helvetica, sans-serif"
          font-size="28" font-weight="700" fill="#fff">${initial}</text>
      </svg>
    `.trim();
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }

  function upsertFavicons(href) {
    if (!document.head) return;
    const existing = new Set();
    ['link[rel="icon"]', 'link[rel="shortcut icon"]', 'link[rel~="icon"]'].forEach((selector) => {
      document.querySelectorAll(selector).forEach((node) => existing.add(node));
    });

    if (existing.size === 0) {
      ["icon", "shortcut icon"].forEach((rel) => {
        const link = document.createElement("link");
        link.setAttribute("rel", rel);
        existing.add(link);
        document.head.appendChild(link);
      });
    }

    existing.forEach((node) => {
      node.setAttribute("href", href);
      node.setAttribute("type", "image/svg+xml");
      node.setAttribute("sizes", "any");
      node.setAttribute("data-gux-managed-favicon", "1");
    });
  }

  function upsertAccountBar(colorHex) {
    const id = "gux-account-color-bar";
    let bar = document.getElementById(id);
    if (!bar) {
      bar = document.createElement("div");
      bar.id = id;
      bar.setAttribute("aria-hidden", "true");
      document.documentElement.appendChild(bar);
    }
    bar.style.display = state.settings.enableAccountColorBar ? "block" : "none";
    if (state.settings.enableAccountColorBar) bar.style.backgroundColor = colorHex;
  }

  function applyAccountDifferentiation() {
    state.activeEmail = detectActiveEmail();
    const colorHex = getAccountColor(state.activeEmail);
    const initial = (state.activeEmail || "?").charAt(0).toUpperCase();
    upsertFavicons(makeFaviconDataUrl(colorHex, initial));
    upsertAccountBar(colorHex);
    document.documentElement.style.setProperty("--gux-account-color", colorHex);
  }

  function runFeatureModules() {
    const features = window.GmailFlowFeatures || {};
    if (features.cleanup && typeof features.cleanup.apply === "function") features.cleanup.apply(state.settings);
    if (features.focus && typeof features.focus.apply === "function") features.focus.apply(state.settings);
    if (features.highlighting && typeof features.highlighting.apply === "function") {
      features.highlighting.apply(state.settings);
    }
    if (features.timeAwareness && typeof features.timeAwareness.apply === "function") {
      features.timeAwareness.apply(state.settings);
    }
    if (features.priority && typeof features.priority.apply === "function") {
      features.priority.apply(state.settings);
    }
    if (features.shortcuts && typeof features.shortcuts.apply === "function") {
      features.shortcuts.apply(state.settings);
    }
    if (window.GmailFlowTypography && typeof window.GmailFlowTypography.apply === "function") {
      window.GmailFlowTypography.apply(state.settings);
    }
    if (window.GmailFlowTints && typeof window.GmailFlowTints.apply === "function") {
      window.GmailFlowTints.apply(state.settings);
    }
    if (window.GmailFlowSurgery && typeof window.GmailFlowSurgery.apply === "function") {
      window.GmailFlowSurgery.apply(state.settings);
    }
    if (window.GmailFlowReading && typeof window.GmailFlowReading.apply === "function") {
      window.GmailFlowReading.apply(state.settings);
    }
  }

  function applyAll() {
    applyAccountDifferentiation();
    runFeatureModules();
  }

  function scheduleApply(delay = 120) {
    window.clearTimeout(state.debounceTimer);
    state.debounceTimer = window.setTimeout(() => {
      applyAll();
    }, delay);
  }

  function patchHistory() {
    const push = history.pushState;
    history.pushState = function patchedPushState(...args) {
      const result = push.apply(this, args);
      scheduleApply(0);
      return result;
    };

    const replace = history.replaceState;
    history.replaceState = function patchedReplaceState(...args) {
      const result = replace.apply(this, args);
      scheduleApply(0);
      return result;
    };
  }

  function setupObserver() {
    if (state.observer) return;
    state.observer = new MutationObserver(() => scheduleApply(140));
    state.observer.observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["aria-label", "title", "href"],
    });
  }

  function loadSettings() {
    return new Promise((resolve) => {
      chrome.storage.sync.get({ [STORAGE_KEY]: DEFAULT_SETTINGS }, (result) => {
        const stored = result[STORAGE_KEY] || {};
        state.settings = { ...DEFAULT_SETTINGS, ...stored };
        resolve();
      });
    });
  }

  function persistSettings() {
    chrome.storage.sync.set({ [STORAGE_KEY]: state.settings });
  }

  function mergeSettings(patch) {
    const nextSettings = { ...state.settings, ...patch };
    if (patch.compactSpacing === true) nextSettings.increaseSpacing = false;
    if (patch.increaseSpacing === true) nextSettings.compactSpacing = false;
    state.settings = nextSettings;
    persistSettings();
    scheduleApply(0);
    if (window.GmailFlow && window.GmailFlow.panel) window.GmailFlow.panel.refresh(state.settings);
  }

  function applyProfile(profileName) {
    const profile = PROFILES[profileName];
    if (!profile) return;
    mergeSettings({ ...profile.settings, activeProfile: profileName });
  }

  function setupPanelEvents() {
    window.addEventListener("gflow:settings:patch", (event) => {
      mergeSettings(event.detail || {});
    });
    window.addEventListener("gflow:settings:preset", () => {
      applyProfile("zen");
    });
    window.addEventListener("gflow:profile:apply", (event) => {
      applyProfile(event.detail);
    });
  }

  function setupStorageListener() {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName !== "sync" || !changes[STORAGE_KEY]) return;
      const next = changes[STORAGE_KEY].newValue || DEFAULT_SETTINGS;
      state.settings = { ...DEFAULT_SETTINGS, ...next };
      scheduleApply(0);
      if (window.GmailFlow && window.GmailFlow.panel) window.GmailFlow.panel.refresh(state.settings);
    });
  }

  function setupEvents() {
    window.addEventListener("focus", () => scheduleApply(0));
    window.addEventListener("hashchange", () => scheduleApply(0));
    window.addEventListener("popstate", () => scheduleApply(0));
  }

  async function init() {
    await loadSettings();
    if (window.GmailFlow && window.GmailFlow.panel) window.GmailFlow.panel.init(state.settings);
    setupPanelEvents();
    setupStorageListener();
    patchHistory();
    setupObserver();
    setupEvents();
    scheduleApply(0);
    window.setInterval(() => scheduleApply(0), 3500);
  }

  window.GmailFlow = window.GmailFlow || {};
  window.GmailFlow.profiles = PROFILES;
  window.GmailFlow.applyProfile = applyProfile;
  window.GmailFlow.state = state;

  init();
})();
