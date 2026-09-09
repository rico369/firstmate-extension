(() => {
  const NS = (window.GmailUX = window.GmailUX || {});

  const FIELD_DEFS = [
    { key: "hideSidebar", label: "Hide right sidebar", type: "toggle", section: "simplify" },
    { key: "hideMeet", label: "Hide Meet", type: "toggle", section: "simplify" },
    { key: "hideSpaces", label: "Hide Spaces", type: "toggle", section: "simplify" },
    { key: "compactSpacing", label: "Compact spacing", type: "toggle", section: "simplify" },
    { key: "increaseSpacing", label: "Increase spacing", type: "toggle", section: "simplify" },
    { key: "largeFontMode", label: "Larger font mode", type: "toggle", section: "simplify" },
    { key: "contentWidth", label: "Content width", type: "range", min: 600, max: 1400, step: 20, section: "simplify" },

    { key: "reduceContrast", label: "Reduce contrast", type: "toggle", section: "calm" },
    { key: "mutedColors", label: "Muted colors", type: "toggle", section: "calm" },
    { key: "highlightUnreadOnly", label: "Highlight unread only", type: "toggle", section: "calm" },
    { key: "dimReadEmails", label: "Dim read emails", type: "toggle", section: "calm" },
    { key: "calmMode", label: "Calm mode", type: "toggle", section: "calm" },
    { key: "lowStimulationMode", label: "Low stimulation mode", type: "toggle", section: "calm" },

    { key: "groupByDate", label: "Group emails by date", type: "toggle", section: "organization" },
    { key: "bundleBySenderLabel", label: "Bundle by sender/label", type: "toggle", section: "organization" },
    { key: "highlightImportantSenders", label: "Highlight important senders", type: "toggle", section: "organization" },
    { key: "highlightKeywords", label: "Highlight keywords", type: "text", section: "organization" },

    { key: "pauseInbox", label: "Pause inbox", type: "toggle", section: "productivity" },
    { key: "hideInbox", label: "Hide inbox", type: "toggle", section: "productivity" },
    { key: "keyboardShortcutsEnabled", label: "Keyboard shortcuts enabled", type: "toggle", section: "productivity" },

    { key: "enableAccountColorBar", label: "Enable account color bar", type: "toggle", section: "account" },
  ];

  let panelEl = null;
  let buttonEl = null;
  let isOpen = false;
  let currentSettings = {};

  function sectionTitle(section) {
    const map = {
      simplify: "Simplify Interface",
      calm: "Visual Calm",
      organization: "Organization",
      productivity: "Productivity",
      account: "Account",
    };
    return map[section] || section;
  }

  function emitSettingsPatch(patch) {
    window.dispatchEvent(new CustomEvent("gux:settings:patch", { detail: patch }));
  }

  function emitPanelToggle(open) {
    window.dispatchEvent(new CustomEvent("gux:panel:toggled", { detail: { open } }));
  }

  function createToggleField(def, value) {
    const row = document.createElement("label");
    row.className = "gux-field gux-field-toggle";
    row.innerHTML = `
      <span>${def.label}</span>
      <input type="checkbox" ${value ? "checked" : ""} data-key="${def.key}" />
    `;
    return row;
  }

  function createRangeField(def, value) {
    const row = document.createElement("div");
    row.className = "gux-field gux-field-range";
    row.innerHTML = `
      <label>${def.label}</label>
      <div class="gux-range-wrap">
        <input type="range" min="${def.min}" max="${def.max}" step="${def.step}" value="${value}" data-key="${def.key}" />
        <output>${value}px</output>
      </div>
    `;
    return row;
  }

  function createTextField(def, value) {
    const row = document.createElement("div");
    row.className = "gux-field gux-field-text";
    const text = Array.isArray(value) ? value.join(", ") : "";
    row.innerHTML = `
      <label>${def.label}</label>
      <input
        type="text"
        placeholder="interview, offer"
        value="${text}"
        data-key="${def.key}"
      />
    `;
    return row;
  }

  function createAccountMappingEditor(settings) {
    const wrap = document.createElement("div");
    wrap.className = "gux-account-map";
    wrap.innerHTML = `
      <div class="gux-subtitle">Email to color</div>
      <div class="gux-account-map-rows"></div>
      <button type="button" class="gux-add-map-btn">+ Add mapping</button>
    `;

    const rowsEl = wrap.querySelector(".gux-account-map-rows");
    const addButton = wrap.querySelector(".gux-add-map-btn");
    const mappings = settings.accountMappings || {};

    const createRow = (email = "", color = "gray") => {
      const row = document.createElement("div");
      row.className = "gux-map-row";
      row.innerHTML = `
        <input type="email" placeholder="account@email.com" value="${email}" />
        <input type="text" placeholder="red / #4f46e5" value="${color}" />
        <button type="button" aria-label="Delete mapping">x</button>
      `;
      row.querySelector("button").addEventListener("click", () => row.remove());
      rowsEl.appendChild(row);
    };

    Object.entries(mappings).forEach(([email, color]) => createRow(email, color));
    if (rowsEl.children.length === 0) createRow("", settings.defaultColor || "gray");
    addButton.addEventListener("click", () => createRow("", settings.defaultColor || "gray"));

    wrap.addEventListener("input", () => {
      const nextMappings = {};
      rowsEl.querySelectorAll(".gux-map-row").forEach((row) => {
        const emailInput = row.querySelector('input[type="email"]');
        const colorInput = row.querySelector('input[type="text"]');
        const email = (emailInput.value || "").trim().toLowerCase();
        const color = (colorInput.value || "").trim();
        if (email && color) nextMappings[email] = color;
      });
      emitSettingsPatch({ accountMappings: nextMappings });
    });

    return wrap;
  }

  function buildSection(section, settings) {
    const sectionEl = document.createElement("section");
    sectionEl.className = "gux-section";
    sectionEl.innerHTML = `<h3>${sectionTitle(section)}</h3>`;

    FIELD_DEFS.filter((f) => f.section === section).forEach((def) => {
      const value = settings[def.key];
      let field;
      if (def.type === "toggle") field = createToggleField(def, value);
      else if (def.type === "range") field = createRangeField(def, value);
      else field = createTextField(def, value);
      sectionEl.appendChild(field);
    });

    if (section === "account") {
      sectionEl.appendChild(createAccountMappingEditor(settings));
    }

    return sectionEl;
  }

  function renderPanel(settings) {
    if (!panelEl) return;
    currentSettings = settings;
    panelEl.innerHTML = "";
    panelEl.insertAdjacentHTML(
      "beforeend",
      `
        <header class="gux-panel-header">
          <div>
            <h2>Gmail Calm UX</h2>
            <p>Low-stimulation, predictable inbox controls</p>
          </div>
          <div class="gux-header-actions">
            <button type="button" id="gux-calm-preset" aria-label="Apply calm preset">Preset</button>
            <button type="button" id="gux-close-panel" aria-label="Close settings">x</button>
          </div>
        </header>
      `
    );

    panelEl.appendChild(buildSection("simplify", settings));
    panelEl.appendChild(buildSection("calm", settings));
    panelEl.appendChild(buildSection("organization", settings));
    panelEl.appendChild(buildSection("productivity", settings));
    panelEl.appendChild(buildSection("account", settings));

    panelEl.querySelector("#gux-calm-preset").addEventListener("click", () => {
      window.dispatchEvent(new CustomEvent("gux:settings:preset"));
    });

    panelEl.querySelector("#gux-close-panel").addEventListener("click", () => {
      isOpen = false;
      panelEl.classList.remove("open");
      emitPanelToggle(false);
    });

    panelEl.querySelectorAll('input[type="checkbox"][data-key]').forEach((input) => {
      input.addEventListener("change", () => {
        emitSettingsPatch({ [input.dataset.key]: input.checked });
      });
    });

    panelEl.querySelectorAll('input[type="range"][data-key]').forEach((input) => {
      input.addEventListener("input", () => {
        const output = input.parentElement.querySelector("output");
        if (output) output.textContent = `${input.value}px`;
        emitSettingsPatch({ [input.dataset.key]: Number(input.value) });
      });
    });

    panelEl.querySelectorAll('input[type="text"][data-key]').forEach((input) => {
      input.addEventListener("change", () => {
        const raw = input.value || "";
        const list = raw
          .split(",")
          .map((v) => v.trim().toLowerCase())
          .filter(Boolean);
        emitSettingsPatch({ [input.dataset.key]: list });
      });
    });
  }

  function ensureButton() {
    if (buttonEl) return;
    buttonEl = document.createElement("button");
    buttonEl.id = "gux-floating-button";
    buttonEl.type = "button";
    buttonEl.textContent = "Calm Settings";
    buttonEl.setAttribute("aria-label", "Open Gmail Calm settings");
    buttonEl.addEventListener("click", () => {
      isOpen = !isOpen;
      panelEl.classList.toggle("open", isOpen);
      emitPanelToggle(isOpen);
    });
    document.documentElement.appendChild(buttonEl);
  }

  function ensurePanel() {
    if (panelEl) return;
    panelEl = document.createElement("aside");
    panelEl.id = "gux-settings-panel";
    panelEl.setAttribute("aria-label", "Gmail Calm settings panel");
    document.documentElement.appendChild(panelEl);
  }

  function registerKeyboardShortcut() {
    window.addEventListener("keydown", (event) => {
      if (!currentSettings.keyboardShortcutsEnabled) return;
      if (!event.shiftKey || event.key.toLowerCase() !== "s") return;
      const tag = (event.target && event.target.tagName ? event.target.tagName : "").toLowerCase();
      if (tag === "input" || tag === "textarea") return;
      event.preventDefault();
      isOpen = !isOpen;
      panelEl.classList.toggle("open", isOpen);
      emitPanelToggle(isOpen);
    });
  }

  NS.panel = {
    init(settings) {
      ensurePanel();
      ensureButton();
      renderPanel(settings);
      registerKeyboardShortcut();
    },
    refresh(settings) {
      renderPanel(settings);
    },
  };
})();
