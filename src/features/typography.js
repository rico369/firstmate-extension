/**
 * Gmail Flow - Typography Engine
 * Aggressive font replacement + spacing controls
 */
(function () {
  if (window.GmailFlowTypography) return;
  window.GmailFlowTypography = true;

  let styleTag = null;

  function remove() {
    if (styleTag) { styleTag.remove(); styleTag = null; }
  }

  function inject(settings) {
    const fontSize = settings.fontSize || 16;
    const fontFamily = settings.fontFamily || 'Atkinson Hyperlegible';
    const fontStack = `"${fontFamily}", system-ui, sans-serif`;
    const lineHeight = settings.lineHeight || 1.5;
    const letterSpacing = settings.letterSpacing || 0;
    const wordSpacing = settings.wordSpacing || 0;
    const textWidth = settings.textWidth || 'comfortable';

    const widthMap = {
      narrow: '520px',
      comfortable: '680px',
      wide: '860px',
      full: '100%'
    };
    const maxWidth = widthMap[textWidth] || '680px';

    const lines = [];
    lines.push(`.gmail-flow-font-active * {`);
    lines.push(`  font-family: ${fontStack} !important;`);
    lines.push(`  font-size: ${fontSize}px !important;`);
    lines.push(`  line-height: ${lineHeight} !important;`);
    lines.push(`  letter-spacing: ${letterSpacing}px !important;`);
    lines.push(`  word-spacing: ${wordSpacing}px !important;`);
    lines.push(`  text-align: left !important;`);
    lines.push(`}`);

    lines.push(`.gmail-flow-font-active .nH .nH .no {`);
    lines.push(`  max-width: ${maxWidth} !important;`);
    lines.push(`  padding-left: 16px !important;`);
    lines.push(`  padding-right: 16px !important;`);
    lines.push(`  margin: 0 auto !important;`);
    lines.push(`}`);

    lines.push(`.gmail-flow-font-active .a3s {`);
    lines.push(`  font-size: ${fontSize}px !important;`);
    lines.push(`  line-height: ${lineHeight} !important;`);
    lines.push(`  max-width: ${maxWidth} !important;`);
    lines.push(`}`);

    lines.push(`.gmail-flow-font-active .gs .a3s {`);
    lines.push(`  font-size: ${fontSize}px !important;`);
    lines.push(`  line-height: ${lineHeight} !important;`);
    lines.push(`}`);

    lines.push(`.gmail-flow-font-active .ha h2,`);
    lines.push(`.gmail-flow-font-active .bog {`);
    lines.push(`  font-size: ${fontSize + 2}px !important;`);
    lines.push(`  font-weight: 600 !important;`);
    lines.push(`  line-height: 1.3 !important;`);
    lines.push(`}`);

    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'gmail-flow-typography';
      document.head.appendChild(styleTag);
    }
    styleTag.textContent = lines.join('\n');

    document.body.classList.add('gmail-flow-font-active');
  }

  function apply(settings) {
    if (settings.enhancedTypography === false) {
      remove();
      return;
    }
    inject(settings);
  }

  function checkMutations() {
    if (!document.body.classList.contains('gmail-flow-font-active')) return;
    const letters = document.querySelectorAll('.gmail-flow-typography');
    if (letters.length > 1) {
      for (let i = 1; i < letters.length; i++) letters[i].remove();
    }
  }

  const observer = new MutationObserver(() => {
    requestAnimationFrame(checkMutations);
  });
  observer.observe(document.body, { childList: true, subtree: true });

  window.GmailFlowTypography = { apply, remove };
})();
