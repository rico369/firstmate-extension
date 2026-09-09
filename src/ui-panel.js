(() => {
  const NS = (window.GmailFlow = window.GmailFlow || {});

  const PROFILES = {
    zen: { label: "Zen", icon: "🧘", description: "Muted, spacious, calm" },
    speed: { label: "Speed", icon: "⚡", description: "Compact, keyboard-first, fast" },
    night: { label: "Night", icon: "🌙", description: "Dark, warm, easy on eyes" },
    focus: { label: "Focus", icon: "🎯", description: "Inbox only, no distractions" },
  };

  const FIELD_DEFS = [
    { key: "hideSidebar", label: "Hide sidebar", type: "toggle", section: "simplify" },
    { key: "hideMeet", label: "Hide Meet", type: "toggle", section: "simplify" },
    { key: "hideSpaces", label: "Hide Spaces", type: "toggle", section: "simplify" },
    { key: "hidePromotions", label: "Hide Promotions tab", type: "toggle", section: "simplify" },
    { key: "hideSocial", label: "Hide Social tab", type: "toggle", section: "simplify" },
    { key: "compactSpacing", label: "Compact spacing", type: "toggle", section: "simplify" },
    { key: "increaseSpacing", label: "Spacious spacing", type: "toggle", section: "simplify" },
    { key: "largeFontMode", label: "Larger font", type: "toggle", section: "simplify" },
    { key: "contentWidth", label: "Content width", type: "range", min: 600, max: 1400, step: 20, section: "simplify" },

    { key: "reduceContrast", label: "Reduce contrast", type: "toggle", section: "visual" },
    { key: "mutedColors", label: "Muted colors", type: "toggle", section: "visual" },
    { key: "lowStimulationMode", label: "Low stimulation", type: "toggle", section: "visual" },
    { key: "calmMode", label: "Calm mode", type: "toggle", section: "visual" },
    { key: "darkMode", label: "Dark mode", type: "toggle", section: "visual" },
    { key: "animationsReduced", label: "Reduce animations", type: "toggle", section: "visual" },

    { key: "showEmailAge", label: "Show email age", type: "toggle", section: "awareness" },
    { key: "showPriorityBadges", label: "Show priority badges", type: "toggle", section: "awareness" },
    { key: "highlightUnreadOnly", label: "Highlight unread only", type: "toggle", section: "awareness" },
    { key: "dimReadEmails", label: "Dim read emails", type: "toggle", section: "awareness" },
    { key: "highlightImportantSenders", label: "Highlight important senders", type: "toggle", section: "awareness" },
    { key: "highlightKeywords", label: "Highlight keywords", type: "text", section: "awareness" },

    { key: "groupByDate", label: "Group by date", type: "toggle", section: "organization" },
    { key: "enableAccountColorBar", label: "Account color bar", type: "toggle", section: "organization" },
  ];

  let panelEl = null;
  let buttonEl = null;
  let isOpen = false;
  let currentSettings = {};

  function sectionTitle(section) {
    const map = {
      simplify: "Simplify",
      visual: "Visual Calm",
      awareness: "Time & Priority",
      organization: "Organization",
      account: "Account",
    };
    return map[section] || section;
  }

  function emitSettingsPatch(patch) {
    window.dispatchEvent(new CustomEvent("gflow:settings:patch", { detail: patch }));
  }

  function emitProfileApply(profileName) {
    window.dispatchEvent(new CustomEvent("gflow:profile:apply", { detail: profileName }));
  }

  function createProfileBar(settings) {
    const bar = document.createElement("div");
    bar.className = "gf-profile-bar";
    bar.innerHTML = `<div class="gf-profile-buttons"></div>`;
    const buttons = bar.querySelector(".gf-profile-buttons");

    Object.entries(PROFILES).forEach(([key, profile]) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `gf-profile-btn ${settings.activeProfile === key ? "active" : ""}`;
      btn.innerHTML = `<span class="gf-profile-icon">${profile.icon}</span><span class="gf-profile-label">${profile.label}</span>`;
      btn.title = profile.description;
      btn.addEventListener("click", () => emitProfileApply(key));
      buttons.appendChild(btn);
    });

    return bar;
  }

  function createToggleField(def, value) {
    const row = document.createElement("label");
    row.className = "gf-field gf-field-toggle";
    row.innerHTML = `
      <span>${def.label}</span>
      <input type="checkbox" ${value ? "checked" : ""} data-key="${def.key}" />
    `;
    return row;
  }

  function createRangeField(def, value) {
    const row = document.createElement("div");
    row.className = "gf-field gf-field-range";
    row.innerHTML = `
      <label>${def.label}</label>
      <div class="gf-range-wrap">
        <input type="range" min="${def.min}" max="${def.max}" step="${def.step}" value="${value}" data-key="${def.key}" />
        <output>${value}px</output>
      </div>
    `;
    return row;
  }

  function createTextField(def, value) {
    const row = document.createElement("div");
    row.className = "gf-field gf-field-text";
    const text = Array.isArray(value) ? value.join(", ") : "";
    row.innerHTML = `
      <label>${def.label}</label>
      <input
        type="text"
        placeholder="interview, offer, deadline"
        value="${escapeHtml(text)}"
        data-key="${def.key}"
      />
    `;
    return row;
  }

  function createAccountMappingEditor(settings) {
    const wrap = document.createElement("div");
    wrap.className = "gf-account-map";
    wrap.innerHTML = `
      <div class="gf-subtitle">Email to color</div>
      <div class="gf-account-map-rows"></div>
      <button type="button" class="gf-add-map-btn">+ Add</button>
    `;

    const rowsEl = wrap.querySelector(".gf-account-map-rows");
    const addButton = wrap.querySelector(".gf-add-map-btn");
    const mappings = settings.accountMappings || {};

    const createRow = (email = "", color = "gray") => {
      const row = document.createElement("div");
      row.className = "gf-map-row";
      row.innerHTML = `
        <input type="email" placeholder="account@email.com" value="${escapeHtml(email)}" />
        <input type="text" placeholder="red / #4f46e5" value="${escapeHtml(color)}" />
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
      rowsEl.querySelectorAll(".gf-map-row").forEach((row) => {
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
    sectionEl.className = "gf-section";
    sectionEl.innerHTML = `<h3>${sectionTitle(section)}</h3>`;

    FIELD_DEFS.filter((f) => f.section === section).forEach((def) => {
      const value = settings[def.key];
      let field;
      if (def.type === "toggle") field = createToggleField(def, value);
      else if (def.type === "range") field = createRangeField(def, value);
      else field = createTextField(def, value);
      sectionEl.appendChild(field);
    });

    if (section === "organization") {
      sectionEl.appendChild(createAccountMappingEditor(settings));
    }

    return sectionEl;
  }

  function renderPanel(settings) {
    if (!panelEl) return;
    currentSettings = settings;
    panelEl.innerHTML = "";

    panelEl.appendChild(createProfileBar(settings));

    panelEl.insertAdjacentHTML(
      "beforeend",
      `
        <header class="gf-panel-header">
          <div>
            <h2>Gmail Flow</h2>
            <p>Email that works with your brain</p>
          </div>
          <button type="button" id="gf-close-panel" aria-label="Close settings">✕</button>
        </header>
      `
    );

    panelEl.appendChild(buildSection("simplify", settings));
    panelEl.appendChild(buildSection("visual", settings));
    panelEl.appendChild(buildSection("awareness", settings));
    panelEl.appendChild(buildSection("organization", settings));

    panelEl.querySelector("#gf-close-panel").addEventListener("click", () => {
      isOpen = false;
      panelEl.classList.remove("open");
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
    buttonEl.id = "gf-floating-button";
    buttonEl.type = "button";
    buttonEl.textContent = "Flow";
    buttonEl.setAttribute("aria-label", "Open Gmail Flow settings");
    buttonEl.addEventListener("click", () => {
      isOpen = !isOpen;
      panelEl.classList.toggle("open", isOpen);
    });
    document.documentElement.appendChild(buttonEl);
  }

  function ensurePanel() {
    if (panelEl) return;
    panelEl = document.createElement("aside");
    panelEl.id = "gf-settings-panel";
    panelEl.setAttribute("aria-label", "Gmail Flow settings panel");
    document.documentElement.appendChild(panelEl);
  }

  function registerKeyboardShortcut() {
    window.addEventListener("keydown", (event) => {
      if (!event.shiftKey || event.key.toLowerCase() !== "s") return;
      const tag = (event.target && event.target.tagName ? event.target.tagName : "").toLowerCase();
      if (tag === "input" || tag === "textarea") return;
      event.preventDefault();
      isOpen = !isOpen;
      panelEl.classList.toggle("open", isOpen);
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
