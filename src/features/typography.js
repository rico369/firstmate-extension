/**
 * Gmail Flow - Typography Engine
 * DOM-level font override that actually beats Gmail's inline styles
 */
(function () {
  if (window.GmailFlowTypography) return;
  window.GmailFlowTypography = true;

  let observer = null;
  let activeSettings = null;

  const TARGETED_SELECTORS = [
    '.a3s',
    '.gs .a3s',
    '.ii.gt',
    '.a3s .gmail_extra',
    '.a3s .gmail_quote',
    '.a3s [style*="font-family"]',
    '.a3s [style*="font-size"]',
    '.gB',
    '.gE',
    '.gE .gF',
    '.hi',
    '.iY .gs',
    '.gs',
  ];

  function stripInlineStyles(el) {
    if (!el || !el.style) return;
    const computed = window.getComputedStyle(el);
    const importantProps = ['fontFamily', 'fontSize', 'lineHeight', 'letterSpacing', 'wordSpacing'];
    importantProps.forEach(prop => {
      el.style.removeProperty(prop.replace(/([A-Z])/g, '-$1').toLowerCase());
    });
    el.removeAttribute('style');
  }

  function applyFontToElement(el, settings) {
    if (!el || !el.style) return;
    const fontStack = `"${settings.fontFamily}", system-ui, sans-serif`;
    el.style.setProperty('font-family', fontStack, 'important');
    el.style.setProperty('font-size', `${settings.fontSize}px`, 'important');
    el.style.setProperty('line-height', String(settings.lineHeight), 'important');
    el.style.setProperty('letter-spacing', `${settings.letterSpacing}px`, 'important');
    el.style.setProperty('word-spacing', `${settings.wordSpacing}px`, 'important');
    el.style.setProperty('text-align', 'left', 'important');
  }

  function applyTypography() {
    if (!activeSettings || activeSettings.enhancedTypography === false) return;

    const fontStack = `"${activeSettings.fontFamily}", system-ui, sans-serif`;

    TARGETED_SELECTORS.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        applyFontToElement(el, activeSettings);
      });
    });

    document.querySelectorAll('.a3s *').forEach(el => {
      const computed = window.getComputedStyle(el);
      const tag = el.tagName.toLowerCase();
      if (tag === 'br' || tag === 'hr' || tag === 'img' || tag === 'table') return;
      if (el.closest('.gmail-flow-panel') || el.closest('#gf-settings-panel')) return;

      el.style.setProperty('font-family', fontStack, 'important');
      if (tag !== 'span' || el.style.fontSize) {
        el.style.setProperty('font-size', `${activeSettings.fontSize}px`, 'important');
      }
      el.style.setProperty('line-height', String(activeSettings.lineHeight), 'important');
      el.style.setProperty('letter-spacing', `${activeSettings.letterSpacing}px`, 'important');
      el.style.setProperty('word-spacing', `${activeSettings.wordSpacing}px`, 'important');
    });

    const widthMap = { narrow: '520px', comfortable: '680px', wide: '860px', full: '100%' };
    const maxWidth = widthMap[activeSettings.textWidth] || '680px';
    document.querySelectorAll('.nH .nH .no, .a3s, .gs .a3s, .iY .gs').forEach(el => {
      el.style.setProperty('max-width', maxWidth, 'important');
      el.style.setProperty('margin', '0 auto', 'important');
    });

    document.querySelectorAll('.ha h2, .bog, .bog span').forEach(el => {
      el.style.setProperty('font-size', `${activeSettings.fontSize + 2}px`, 'important');
      el.style.setProperty('font-weight', '600', 'important');
      el.style.setProperty('line-height', '1.3', 'important');
    });
  }

  function remove() {
    if (observer) { observer.disconnect(); observer = null; }
    activeSettings = null;
    document.querySelectorAll('[data-gf-font]').forEach(el => {
      el.removeAttribute('data-gf-font');
    });
  }

  function apply(settings) {
    if (settings.enhancedTypography === false) {
      remove();
      return;
    }
    activeSettings = settings;
    applyTypography();

    if (!observer) {
      observer = new MutationObserver(() => {
        requestAnimationFrame(applyTypography);
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  window.GmailFlowTypography = { apply, remove };
})();
