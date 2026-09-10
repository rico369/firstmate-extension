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

  const FONT_LIST = [
    { id: "Atkinson Hyperlegible", label: "Atkinson Hyperlegible", desc: "Designed for low vision readers" },
    { id: "OpenDyslexic", label: "OpenDyslexic", desc: "Dyslexia-friendly with weighted bottoms" },
    { id: "Lexie Readable", label: "Lexie Readable", desc: "Clear, open letterforms" },
    { id: "Inter", label: "Inter", desc: "Clean sans-serif, great at small sizes" },
    { id: "JetBrains Mono", label: "JetBrains Mono", desc: "Monospace, clear character distinction" },
    { id: "Fira Code", label: "Fira Code", desc: "Monospace with ligatures" },
    { id: "Cascadia Code", label: "Cascadia Code", desc: "Modern monospace from Microsoft" },
    { id: "SF Mono", label: "SF Mono", desc: "Apple system monospace" },
    { id: "Comic Neue", label: "Comic Neue", desc: "Playful, casual, high readability" },
    { id: "Lexend", label: "Lexend", desc: "Designed to reduce visual stress" },
    { id: "Andika", label: "Andika", desc: "SIL International literacy font" },
    { id: "Literata", label: "Literata", desc: "Google Fonts, optimized for reading" },
    { id: "Merriweather", label: "Merriweather", desc: "Serif, designed for screens" },
    { id: "Source Serif 4", label: "Source Serif 4", desc: "Adobe serif, clear and readable" },
    { id: "Noto Serif", label: "Noto Serif", desc: "Google's universal serif" },
    { id: "system-ui", label: "System Default", desc: "Your OS default font" },
  ];

  const TINT_LIST = [
    { id: "none", label: "None" },
    { id: "cream", label: "Cream" },
    { id: "lavender", label: "Lavender" },
    { id: "sage", label: "Sage" },
    { id: "blush", label: "Blush" },
    { id: "sky", label: "Sky" },
    { id: "amber", label: "Amber" },
    { id: "mint", label: "Mint" },
    { id: "rose", label: "Rose" },
    { id: "dusk", label: "Dusk" },
    { id: "moonlight", label: "Moonlight" },
    { id: "charcoal", label: "Charcoal" },
    { id: "oled", label: "OLED Black" },
    { id: "midnight", label: "Midnight" },
  ];

  const TEXT_WIDTHS = [
    { id: "narrow", label: "Narrow" },
    { id: "comfortable", label: "Comfortable" },
    { id: "wide", label: "Wide" },
    { id: "full", label: "Full" },
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
      typography: "Typography",
      tints: "Background Tints",
      surgery: "DOM Surgery",
      reading: "Reading Mode",
    };
    return map[section] || section;
  }

  function escapeHtml(text) {
    if (!text) return "";
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
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
    const unit = def.unit || "px";
    row.innerHTML = `
      <label>${def.label}</label>
      <div class="gf-range-wrap">
        <input type="range" min="${def.min}" max="${def.max}" step="${def.step}" value="${value}" data-key="${def.key}" />
        <output>${value}${unit}</output>
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

  function createFontPicker(settings) {
    const wrap = document.createElement("div");
    wrap.className = "gf-section";
    wrap.innerHTML = `<h3>${sectionTitle("typography")}</h3>`;

    const fontGrid = document.createElement("div");
    fontGrid.className = "gf-font-grid";
    FONT_LIST.forEach(font => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `gf-font-btn ${settings.fontFamily === font.id ? "active" : ""}`;
      btn.innerHTML = `<span class="gf-font-name" style="font-family: '${font.id}', sans-serif">${font.label}</span><span class="gf-font-desc">${font.desc}</span>`;
      btn.addEventListener("click", () => {
        fontGrid.querySelectorAll('.gf-font-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        emitSettingsPatch({ fontFamily: font.id });
      });
      fontGrid.appendChild(btn);
    });
    wrap.appendChild(fontGrid);

    const fontSettings = [
      { key: "fontSize", label: "Font size", type: "range", min: 12, max: 28, step: 1, unit: "px" },
      { key: "lineHeight", label: "Line height", type: "range", min: 1.0, max: 2.5, step: 0.1, unit: "x" },
      { key: "letterSpacing", label: "Letter spacing", type: "range", min: 0, max: 3, step: 0.1, unit: "px" },
      { key: "wordSpacing", label: "Word spacing", type: "range", min: 0, max: 8, step: 0.5, unit: "px" },
    ];

    fontSettings.forEach(def => {
      const field = createRangeField(def, settings[def.key] || def.min);
      field.querySelector('input[type="range"]').addEventListener('input', (e) => {
        const output = e.target.parentElement.querySelector("output");
        if (output) output.textContent = `${e.target.value}${def.unit}`;
        emitSettingsPatch({ [def.key]: Number(e.target.value) });
      });
      wrap.appendChild(field);
    });

    const widthWrap = document.createElement("div");
    widthWrap.className = "gf-field gf-field-toggle";
    widthWrap.innerHTML = `<span>Reading width</span>`;
    const widthBtns = document.createElement("div");
    widthBtns.className = "gf-width-btns";
    TEXT_WIDTHS.forEach(w => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `gf-width-btn ${settings.textWidth === w.id ? "active" : ""}`;
      btn.textContent = w.label;
      btn.addEventListener("click", () => {
        widthBtns.querySelectorAll('.gf-width-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        emitSettingsPatch({ textWidth: w.id });
      });
      widthBtns.appendChild(btn);
    });
    widthWrap.appendChild(widthBtns);
    wrap.appendChild(widthWrap);

    return wrap;
  }

  function createTintPicker(settings) {
    const wrap = document.createElement("div");
    wrap.className = "gf-section";
    wrap.innerHTML = `<h3>${sectionTitle("tints")}</h3>`;

    const tintGrid = document.createElement("div");
    tintGrid.className = "gf-tint-grid";
    TINT_LIST.forEach(tint => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `gf-tint-btn ${settings.backgroundTint === tint.id ? "active" : ""}`;
      const tintColors = {
        cream: '#FDF6E3', lavender: '#E8E0F0', sage: '#E8F0E8', blush: '#FDE8E8',
        sky: '#E0F0FF', amber: '#FFF8E1', mint: '#E0F8F0', rose: '#FFF0F5',
        dusk: '#E8E0F0', moonlight: '#F0F8FF', charcoal: '#1E1E2E', oled: '#000000', midnight: '#0A0A1A'
      };
      const bg = tint.id === 'none' ? '#fff' : (tintColors[tint.id] || '#fff');
      btn.innerHTML = `<span class="gf-tint-swatch" style="background-color: ${bg}; border: 1px solid #ccc;"></span><span class="gf-tint-name">${tint.label}</span>`;
      btn.addEventListener("click", () => {
        tintGrid.querySelectorAll('.gf-tint-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        emitSettingsPatch({ backgroundTint: tint.id });
      });
      tintGrid.appendChild(btn);
    });
    wrap.appendChild(tintGrid);

    return wrap;
  }

  function createSurgeryPanel(settings) {
    const wrap = document.createElement("div");
    wrap.className = "gf-section";
    wrap.innerHTML = `<h3>${sectionTitle("surgery")}</h3>`;

    const presets = [
      { id: 'none', label: 'None', desc: 'Keep all Gmail elements' },
      { id: 'minimal', label: 'Minimal', desc: 'Remove sidebar, Meet, Spaces' },
      { id: 'moderate', label: 'Moderate', desc: 'Remove clutter + tabs + help' },
      { id: 'aggressive', label: 'Aggressive', desc: 'Strip everything non-essential' },
    ];

    const presetGrid = document.createElement("div");
    presetGrid.className = "gf-surgery-grid";
    presets.forEach(preset => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `gf-surgery-btn ${settings.surgeryMode === preset.id ? "active" : ""}`;
      btn.innerHTML = `<span class="gf-surgery-name">${preset.label}</span><span class="gf-surgery-desc">${preset.desc}</span>`;
      btn.addEventListener("click", () => {
        presetGrid.querySelectorAll('.gf-surgery-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        emitSettingsPatch({ surgeryMode: preset.id });
      });
      presetGrid.appendChild(btn);
    });
    wrap.appendChild(presetGrid);
    return wrap;
  }

  function createReadingPanel(settings) {
    const wrap = document.createElement("div");
    wrap.className = "gf-section";
    wrap.innerHTML = `<h3>${sectionTitle("reading")}</h3>`;

    const readingModeRow = document.createElement("label");
    readingModeRow.className = "gf-field gf-field-toggle";
    readingModeRow.innerHTML = `
      <span>Reading mode</span>
      <input type="checkbox" ${settings.readingMode ? "checked" : ""} data-key="readingMode" />
    `;
    readingModeRow.querySelector('input').addEventListener('change', (e) => {
      emitSettingsPatch({ readingMode: e.target.checked });
    });
    wrap.appendChild(readingModeRow);

    const chunkRow = document.createElement("label");
    chunkRow.className = "gf-field gf-field-toggle";
    chunkRow.innerHTML = `
      <span>Chunk long emails</span>
      <input type="checkbox" ${settings.chunkLongEmails ? "checked" : ""} data-key="chunkLongEmails" />
    `;
    chunkRow.querySelector('input').addEventListener('change', (e) => {
      emitSettingsPatch({ chunkLongEmails: e.target.checked });
    });
    wrap.appendChild(chunkRow);

    return wrap;
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

    panelEl.appendChild(createFontPicker(settings));
    panelEl.appendChild(createTintPicker(settings));
    panelEl.appendChild(buildSection("simplify", settings));
    panelEl.appendChild(buildSection("visual", settings));
    panelEl.appendChild(buildSection("awareness", settings));
    panelEl.appendChild(createReadingPanel(settings));
    panelEl.appendChild(createSurgeryPanel(settings));
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
        const key = input.dataset.key;
        const def = FONT_LIST.find(f => f.id === key) ||
                    [
                      { key: "fontSize", unit: "px" },
                      { key: "lineHeight", unit: "x" },
                      { key: "letterSpacing", unit: "px" },
                      { key: "wordSpacing", unit: "px" },
                      { key: "contentWidth", unit: "px" },
                    ].find(d => d.key === key);
        const unit = def ? (def.unit || "px") : "px";
        if (output) output.textContent = `${input.value}${unit}`;
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
