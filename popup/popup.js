const STORAGE_KEYS = {
  ACCOUNT_MAPPINGS: "accountMappings",
  DEFAULT_COLOR: "defaultColor",
  FOCUS_MODE: "focusModeEnabled",
};

const DEFAULT_SETTINGS = {
  // Bonus: keep this config object easy to extend.
  accountMappings: {},
  defaultColor: "gray",
  focusModeEnabled: false,
};

const COLOR_OPTIONS = ["red", "blue", "green", "yellow", "purple", "orange", "teal", "pink", "gray"];

const dom = {
  rows: document.getElementById("mappingRows"),
  defaultColor: document.getElementById("defaultColor"),
  addBtn: document.getElementById("addMapping"),
  saveBtn: document.getElementById("saveMappings"),
  focusModeEnabled: document.getElementById("focusModeEnabled"),
  status: document.getElementById("status"),
};

function makeColorOptions(selectedColor) {
  return COLOR_OPTIONS.map((color) => {
    const selected = color === selectedColor ? "selected" : "";
    return `<option value="${color}" ${selected}>${color}</option>`;
  }).join("");
}

function buildDefaultColorSelect(selectedColor) {
  dom.defaultColor.innerHTML = makeColorOptions(selectedColor);
}

function createMappingRow(email = "", color = "gray") {
  const row = document.createElement("div");
  row.className = "row";
  row.innerHTML = `
    <input type="email" placeholder="account1@gmail.com" value="${email}" />
    <select>${makeColorOptions(color)}</select>
    <button class="delete" type="button" title="Delete mapping">x</button>
  `;

  row.querySelector(".delete").addEventListener("click", () => {
    row.remove();
  });

  dom.rows.appendChild(row);
}

function collectMappings() {
  const mappings = {};
  const rows = dom.rows.querySelectorAll(".row");
  rows.forEach((row) => {
    const emailInput = row.querySelector('input[type="email"]');
    const colorSelect = row.querySelector("select");
    const email = (emailInput.value || "").trim().toLowerCase();
    const color = colorSelect.value;
    if (email && color) {
      mappings[email] = color;
    }
  });
  return mappings;
}

function flashStatus(message, isError = false) {
  dom.status.textContent = message;
  dom.status.style.color = isError ? "#b3261e" : "#1e8e3e";
  window.setTimeout(() => {
    dom.status.textContent = "";
  }, 1800);
}

function loadSettings() {
  chrome.storage.sync.get(DEFAULT_SETTINGS, (result) => {
    const accountMappings = result.accountMappings || {};
    const defaultColor = result.defaultColor || "gray";
    const focusModeEnabled = Boolean(result.focusModeEnabled);

    dom.focusModeEnabled.checked = focusModeEnabled;
    buildDefaultColorSelect(defaultColor);
    dom.rows.innerHTML = "";

    const entries = Object.entries(accountMappings);
    if (entries.length === 0) {
      createMappingRow("", defaultColor);
      return;
    }
    entries.forEach(([email, color]) => createMappingRow(email, color));
  });
}

function saveSettings() {
  const accountMappings = collectMappings();
  const defaultColor = dom.defaultColor.value || DEFAULT_SETTINGS.defaultColor;
  const focusModeEnabled = Boolean(dom.focusModeEnabled.checked);
  chrome.storage.sync.set(
    {
      [STORAGE_KEYS.ACCOUNT_MAPPINGS]: accountMappings,
      [STORAGE_KEYS.DEFAULT_COLOR]: defaultColor,
      [STORAGE_KEYS.FOCUS_MODE]: focusModeEnabled,
    },
    () => {
      if (chrome.runtime.lastError) {
        flashStatus(chrome.runtime.lastError.message || "Save failed", true);
        return;
      }
      flashStatus("Saved");
    }
  );
}

dom.addBtn.addEventListener("click", () => createMappingRow("", dom.defaultColor.value || "gray"));
dom.saveBtn.addEventListener("click", saveSettings);

loadSettings();
