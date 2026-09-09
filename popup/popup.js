const STORAGE_KEY = "gmailFlowSettings";

const DEFAULT_SETTINGS = {
  activeProfile: "zen",
  showEmailAge: true,
  showPriorityBadges: true,
  darkMode: false,
};

const dom = {
  profileBtns: document.querySelectorAll(".profile-btn"),
  showEmailAge: document.getElementById("showEmailAge"),
  showPriorityBadges: document.getElementById("showPriorityBadges"),
  darkMode: document.getElementById("darkMode"),
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

loadSettings();
