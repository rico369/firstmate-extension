/**
 * Gmail Flow - Background Tints
 * DOM-level background override that beats Gmail's inline styles
 */
(function () {
  if (window.GmailFlowTints) return;
  window.GmailFlowTints = true;

  let observer = null;
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

  const BACKGROUND_SELECTORS = [
    'html',
    'body',
    '.nH',
    '.nH .nH',
    '.nH .nH .nH',
    '.nH .nH .no',
    '.Tm.aeJ',
    '.aoP',
    '.ao9',
    '.Nr.aeJ',
    '.Bk',
    '.aeJ',
    '.Cp',
    '.TRS',
    '.ip',
    '.AO',
    '.aJ8',
    '.yW',
    '.zF',
    '.adn',
    '.adn .gs',
    '.iP',
    '.h7',
    '.n6',
    '.bog',
    '[role="main"]',
    '[role="navigation"]',
    '.gb_g',
    '.gb_h',
    '.gb_Cd',
    '.gb_bd',
  ];

  const TEXT_SELECTORS = [
    '.bog',
    '.bog span',
    '.n6',
    '.n6 span',
    '.yW span',
    '.yW b',
    '.a3s',
    '.a3s .gmail_extra',
    '.a3s .gmail_quote',
    '.zF',
    '.y6',
    '.y6 span',
    '.gD',
    '.gF',
    '.gF span',
    '.bA4',
    '.bA4 span',
    '.gI',
    '[role="link"]',
    '[role="gridcell"]',
    '[role="listitem"]',
    '.TC',
    '.adn .gs .gB',
    '.iY .gs .gB',
  ];

  function applyTint() {
    if (!activeSettings) return;
    const tint = activeSettings.backgroundTint || 'none';
    const colors = TINTS[tint];
    if (!colors) return;

    BACKGROUND_SELECTORS.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        if (el.closest('.gmail-flow-panel') || el.closest('#gf-settings-panel')) return;
        el.style.setProperty('background-color', colors.bg, 'important');
        el.style.setProperty('background', colors.bg, 'important');
      });
    });

    const textColor = activeSettings.tintTextColor || colors.text;
    TEXT_SELECTORS.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        if (el.closest('.gmail-flow-panel') || el.closest('#gf-settings-panel')) return;
        el.style.setProperty('color', textColor, 'important');
      });
    });

    document.documentElement.style.setProperty('--gf-bg-tint', colors.bg);
    document.documentElement.style.setProperty('--gf-text-tint', textColor);
  }

  function remove() {
    if (observer) { observer.disconnect(); observer = null; }
    activeSettings = null;
    BACKGROUND_SELECTORS.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        el.style.removeProperty('background-color');
        el.style.removeProperty('background');
      });
    });
    TEXT_SELECTORS.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        el.style.removeProperty('color');
      });
    });
    document.documentElement.style.removeProperty('--gf-bg-tint');
    document.documentElement.style.removeProperty('--gf-text-tint');
  }

  function apply(settings) {
    if (!settings.backgroundTint || settings.backgroundTint === 'none') {
      remove();
      return;
    }
    activeSettings = settings;
    applyTint();

    if (!observer) {
      observer = new MutationObserver(() => {
        requestAnimationFrame(applyTint);
      });
      observer.observe(document.body, { childList: true, subtree: true });
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
