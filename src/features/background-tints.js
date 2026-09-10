/**
 * Gmail Flow - Background Tints
 * 3-layer defense: CSS injection + setInterval re-apply + MutationObserver guard
 */
(function () {
  if (window.GmailFlowTints) return;
  window.GmailFlowTints = true;

  let styleTag = null;
  let observer = null;
  let intervalId = null;
  let activeSettings = null;

  const TINTS = {
    cream:      { bg: '#FDF6E3', text: '#333' },
    lavender:   { bg: '#E8E0F0', text: '#2D2B55' },
    sage:       { bg: '#E8F0E8', text: '#1A3A1A' },
    blush:      { bg: '#FDE8E8', text: '#5C2020' },
    sky:        { bg: '#E0F0FF', text: '#0A2A4A' },
    amber:      { bg: '#FFF8E1', text: '#4A3600' },
    mint:       { bg: '#E0F8F0', text: '#1A4A4A' },
    rose:       { bg: '#FFF0F5', text: '#4A1A2A' },
    dusk:       { bg: '#E8E0F0', text: '#1A1A3A' },
    moonlight:  { bg: '#F0F8FF', text: '#1A2A3A' },
    charcoal:   { bg: '#1E1E2E', text: '#CDD6F4' },
    oled:       { bg: '#000000', text: '#E0E0E0' },
    midnight:   { bg: '#0A0A1A', text: '#B0B8D0' },
  };

  const BG_SELECTORS = [
    'html', 'body',
    '.nH', '.nH .nH', '.nH .nH .nH', '.nH .nH .no',
    '.Tm.aeJ', '.aoP', '.ao9', '.Nr.aeJ',
    '.Bk', '.aeJ', '.Cp', '.TRS', '.ip', '.AO',
    '.aJ8', '.h7', '.n6',
    '[role="main"]', '[role="navigation"]',
    '.gb_g', '.gb_h', '.gb_Cd', '.gb_bd',
  ];

  const TEXT_SELECTORS = [
    '.bog', '.bog span',
    '.n6', '.n6 span',
    '.yW span', '.yW b',
    '.a3s', '.a3s .gmail_extra', '.a3s .gmail_quote',
    '.zF', '.y6', '.y6 span',
    '.gD', '.gF', '.gF span',
    '.bA4', '.bA4 span',
    '.gI', '[role="link"]',
    '[role="gridcell"]', '[role="listitem"]',
    '.TC', '.adn .gs .gB', '.iY .gs .gB',
  ];

  function buildCSS(settings) {
    const tint = settings.backgroundTint || 'none';
    const colors = TINTS[tint];
    if (!colors) return '';

    const textColor = settings.tintTextColor || colors.text;
    const bgSelector = BG_SELECTORS.join(',\n');
    const textSelector = TEXT_SELECTORS.join(',\n');

    return `
${bgSelector} {
  background-color: ${colors.bg} !important;
  background: ${colors.bg} !important;
}
${textSelector} {
  color: ${textColor} !important;
}`;
  }

  function injectStyleTag(css) {
    if (!styleTag || !styleTag.parentNode) {
      styleTag = document.getElementById('gmail-flow-tint');
      if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'gmail-flow-tint';
        (document.head || document.documentElement).appendChild(styleTag);
      }
    }
    if (styleTag.textContent !== css) {
      styleTag.textContent = css;
    }
  }

  function applyDomStyles(settings) {
    const tint = settings.backgroundTint || 'none';
    const colors = TINTS[tint];
    if (!colors) return;

    const textColor = settings.tintTextColor || colors.text;

    BG_SELECTORS.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        if (el.closest('#gf-settings-panel') || el.closest('.gmail-flow-panel')) return;
        el.style.setProperty('background-color', colors.bg, 'important');
        el.style.setProperty('background', colors.bg, 'important');
      });
    });

    TEXT_SELECTORS.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        if (el.closest('#gf-settings-panel') || el.closest('.gmail-flow-panel')) return;
        el.style.setProperty('color', textColor, 'important');
      });
    });
  }

  function applyAll() {
    if (!activeSettings || !activeSettings.backgroundTint || activeSettings.backgroundTint === 'none') return;
    const css = buildCSS(activeSettings);
    if (!css) return;
    injectStyleTag(css);
    applyDomStyles(activeSettings);
  }

  function remove() {
    if (styleTag) { styleTag.remove(); styleTag = null; }
    if (observer) { observer.disconnect(); observer = null; }
    if (intervalId) { clearInterval(intervalId); intervalId = null; }
    activeSettings = null;
  }

  function apply(settings) {
    if (!settings.backgroundTint || settings.backgroundTint === 'none') {
      remove();
      return;
    }
    activeSettings = settings;
    applyAll();

    if (!intervalId) {
      intervalId = setInterval(applyAll, 500);
    }

    if (!observer) {
      observer = new MutationObserver(() => {
        if (!styleTag || !styleTag.parentNode) {
          styleTag = null;
          applyAll();
        }
      });
      observer.observe(document.head || document.documentElement, { childList: true });
    }
  }

  function getTints() {
    return [
      { id: 'none', label: 'None' },
      ...Object.entries(TINTS).map(([k]) => ({ id: k, label: k.charAt(0).toUpperCase() + k.slice(1) })),
    ];
  }

  window.GmailFlowTints = { apply, remove, getTints };
})();
