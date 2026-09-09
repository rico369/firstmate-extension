const STORAGE_KEY = "gmailFlowSettings";

const DEFAULT_SETTINGS = {
  activeProfile: "zen",
  showEmailAge: true,
  showPriorityBadges: true,
  darkMode: false,
  fontFamily: "Atkinson Hyperlegible",
  fontSize: 16,
  lineHeight: 1.5,
  letterSpacing: 0,
  wordSpacing: 0,
  textWidth: "comfortable",
  backgroundTint: "none",
  enhancedTypography: true,
  readingMode: false,
};

const dom = {
  profileBtns: document.querySelectorAll(".profile-btn"),
  showEmailAge: document.getElementById("showEmailAge"),
  showPriorityBadges: document.getElementById("showPriorityBadges"),
  darkMode: document.getElementById("darkMode"),
  fontFamily: document.getElementById("fontFamily"),
  fontSize: document.getElementById("fontSize"),
  fontSizeOutput: document.getElementById("fontSizeOutput"),
  lineHeight: document.getElementById("lineHeight"),
  lineHeightOutput: document.getElementById("lineHeightOutput"),
  letterSpacing: document.getElementById("letterSpacing"),
  letterSpacingOutput: document.getElementById("letterSpacingOutput"),
  wordSpacing: document.getElementById("wordSpacing"),
  wordSpacingOutput: document.getElementById("wordSpacingOutput"),
  backgroundTint: document.getElementById("backgroundTint"),
  readingMode: document.getElementById("readingMode"),
  status: document.getElementById("status"),
};

function flashStatus(message, isError = false) {
  dom.status.textContent = message;
  dom.status.style.color = isError ? "#b3261e" : "#1e8e3e";
  window.setTimeout(() => {
    dom.status.textContent = "";
  }, 1800);
}

function loadSettings() {
  chrome.storage.sync.get({ [STORAGE_KEY]: DEFAULT_SETTINGS }, (result) => {
    const settings = result[STORAGE_KEY] || DEFAULT_SETTINGS;

    dom.profileBtns.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.profile === settings.activeProfile);
    });

    dom.showEmailAge.checked = Boolean(settings.showEmailAge);
    dom.showPriorityBadges.checked = Boolean(settings.showPriorityBadges);
    dom.darkMode.checked = Boolean(settings.darkMode);
    dom.readingMode.checked = Boolean(settings.readingMode);

    if (dom.fontFamily) dom.fontFamily.value = settings.fontFamily || "Atkinson Hyperlegible";
    if (dom.fontSize) {
      dom.fontSize.value = settings.fontSize || 16;
      if (dom.fontSizeOutput) dom.fontSizeOutput.textContent = `${settings.fontSize || 16}px`;
    }
    if (dom.lineHeight) {
      dom.lineHeight.value = settings.lineHeight || 1.5;
      if (dom.lineHeightOutput) dom.lineHeightOutput.textContent = `${settings.lineHeight || 1.5}`;
    }
    if (dom.letterSpacing) {
      dom.letterSpacing.value = settings.letterSpacing || 0;
      if (dom.letterSpacingOutput) dom.letterSpacingOutput.textContent = `${settings.letterSpacing || 0}px`;
    }
    if (dom.wordSpacing) {
      dom.wordSpacing.value = settings.wordSpacing || 0;
      if (dom.wordSpacingOutput) dom.wordSpacingOutput.textContent = `${settings.wordSpacing || 0}px`;
    }
    if (dom.backgroundTint) dom.backgroundTint.value = settings.backgroundTint || "none";
  });
}

function saveSettings(patch) {
  chrome.storage.sync.get({ [STORAGE_KEY]: DEFAULT_SETTINGS }, (result) => {
    const current = result[STORAGE_KEY] || DEFAULT_SETTINGS;
    const next = { ...current, ...patch };
    chrome.storage.sync.set({ [STORAGE_KEY]: next }, () => {
      if (chrome.runtime.lastError) {
        flashStatus(chrome.runtime.lastError.message || "Save failed", true);
        return;
      }
      flashStatus("Saved");
    });
  });
}

dom.profileBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    dom.profileBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    saveSettings({ activeProfile: btn.dataset.profile });
  });
});

dom.showEmailAge.addEventListener("change", () => {
  saveSettings({ showEmailAge: dom.showEmailAge.checked });
});

dom.showPriorityBadges.addEventListener("change", () => {
  saveSettings({ showPriorityBadges: dom.showPriorityBadges.checked });
});

dom.darkMode.addEventListener("change", () => {
  saveSettings({ darkMode: dom.darkMode.checked });
});

dom.readingMode.addEventListener("change", () => {
  saveSettings({ readingMode: dom.readingMode.checked });
});

if (dom.fontFamily) {
  dom.fontFamily.addEventListener("change", () => {
    saveSettings({ fontFamily: dom.fontFamily.value, enhancedTypography: true });
  });
}

if (dom.fontSize) {
  dom.fontSize.addEventListener("input", () => {
    const val = Number(dom.fontSize.value);
    if (dom.fontSizeOutput) dom.fontSizeOutput.textContent = `${val}px`;
    saveSettings({ fontSize: val, enhancedTypography: true });
  });
}

if (dom.lineHeight) {
  dom.lineHeight.addEventListener("input", () => {
    const val = Number(dom.lineHeight.value);
    if (dom.lineHeightOutput) dom.lineHeightOutput.textContent = val;
    saveSettings({ lineHeight: val, enhancedTypography: true });
  });
}

if (dom.letterSpacing) {
  dom.letterSpacing.addEventListener("input", () => {
    const val = Number(dom.letterSpacing.value);
    if (dom.letterSpacingOutput) dom.letterSpacingOutput.textContent = `${val}px`;
    saveSettings({ letterSpacing: val, enhancedTypography: true });
  });
}

if (dom.wordSpacing) {
  dom.wordSpacing.addEventListener("input", () => {
    const val = Number(dom.wordSpacing.value);
    if (dom.wordSpacingOutput) dom.wordSpacingOutput.textContent = `${val}px`;
    saveSettings({ wordSpacing: val, enhancedTypography: true });
  });
}

if (dom.backgroundTint) {
  dom.backgroundTint.addEventListener("change", () => {
    saveSettings({ backgroundTint: dom.backgroundTint.value });
  });
}

loadSettings();
