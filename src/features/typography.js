/**
 * Gmail Flow - Typography Engine
 * 3-layer defense: CSS injection + setInterval re-apply + MutationObserver guard
 */
(function () {
  if (window.GmailFlowTypography) return;
  window.GmailFlowTypography = true;

  let styleTag = null;
  let observer = null;
  let intervalId = null;
  let activeSettings = null;

  const GMAIL_SELECTORS = [
    'tr.zA span.bog',
    'tr.zA span.yP',
    'tr.zA span.zF',
    'tr.zA span.y6',
    'tr.zA span.n6',
    '.a3s',
    '.gs .a3s',
    '.ii.gt div',
    '.a3s .gmail_extra',
    '.a3s .gmail_quote',
    '.hP',
    '.ha h2',
    '.hi',
    '.gB',
    '.gE',
    '.gE .gF',
    '.iY .gs',
    '.gs',
    '.bog',
    '.bog span',
    '[role="main"] span.bog',
    '[role="main"] span.yP',
    '[role="main"] span.zF',
    '[role="main"] span.y6',
  ];

  function buildCSS(settings) {
    const fontStack = `"${settings.fontFamily}", system-ui, sans-serif`;
    const selector = GMAIL_SELECTORS.join(',\n');
    return `
${selector} {
  font-family: ${fontStack} !important;
  font-size: ${settings.fontSize}px !important;
  line-height: ${settings.lineHeight} !important;
  letter-spacing: ${settings.letterSpacing}px !important;
  word-spacing: ${settings.wordSpacing}px !important;
  text-align: left !important;
}
.a3s * {
  font-family: ${fontStack} !important;
  letter-spacing: ${settings.letterSpacing}px !important;
  word-spacing: ${settings.wordSpacing}px !important;
  line-height: ${settings.lineHeight} !important;
}
.a3s {
  font-size: ${settings.fontSize}px !important;
}
.ha h2, .bog, .bog span {
  font-size: ${settings.fontSize + 2}px !important;
  font-weight: 600 !important;
  line-height: 1.3 !important;
}`;
  }

  function injectStyleTag(css) {
    if (!styleTag || !styleTag.parentNode) {
      styleTag = document.getElementById('gmail-flow-typography');
      if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'gmail-flow-typography';
        (document.head || document.documentElement).appendChild(styleTag);
      }
    }
    if (styleTag.textContent !== css) {
      styleTag.textContent = css;
    }
  }

  function applyDomStyles(settings) {
    const fontStack = `"${settings.fontFamily}", system-ui, sans-serif`;
    GMAIL_SELECTORS.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        if (el.closest('#gf-settings-panel') || el.closest('.gmail-flow-panel')) return;
        el.style.setProperty('font-family', fontStack, 'important');
        el.style.setProperty('font-size', `${settings.fontSize}px`, 'important');
        el.style.setProperty('line-height', String(settings.lineHeight), 'important');
        el.style.setProperty('letter-spacing', `${settings.letterSpacing}px`, 'important');
        el.style.setProperty('word-spacing', `${settings.wordSpacing}px`, 'important');
      });
    });
    document.querySelectorAll('.a3s *').forEach(el => {
      if (el.closest('#gf-settings-panel') || el.closest('.gmail-flow-panel')) return;
      const tag = el.tagName.toLowerCase();
      if (tag === 'br' || tag === 'hr' || tag === 'img') return;
      el.style.setProperty('font-family', fontStack, 'important');
      el.style.setProperty('line-height', String(settings.lineHeight), 'important');
      el.style.setProperty('letter-spacing', `${settings.letterSpacing}px`, 'important');
      el.style.setProperty('word-spacing', `${settings.wordSpacing}px`, 'important');
    });
  }

  function applyAll() {
    if (!activeSettings || activeSettings.enhancedTypography === false) return;
    const css = buildCSS(activeSettings);
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
    if (settings.enhancedTypography === false) {
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

  window.GmailFlowTypography = { apply, remove };
})();
