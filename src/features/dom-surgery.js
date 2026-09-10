/**
 * Gmail Flow - DOM Surgery
 * Simplified presets instead of 18 individual toggles
 */
(function () {
  if (window.GmailFlowSurgery) return;
  window.GmailFlowSurgery = true;

  let activeStyle = null;

  const SURGERY_PRESETS = {
    none: '',
    minimal: `
      .nH .n3zAf, [role="complementary"] { display: none !important; }
      [role="tab"][data-tab-id="meet"] { display: none !important; }
      [role="tab"][data-tab-id="spaces"] { display: none !important; }
    `,
    moderate: `
      .nH .n3zAf, [role="complementary"] { display: none !important; }
      [role="tab"][data-tab-id="meet"] { display: none !important; }
      [role="tab"][data-tab-id="spaces"] { display: none !important; }
      [role="tab"][data-tab-id="promotions"] { display: none !important; }
      .gb_R, .gb_Q, .gb_Ba { display: none !important; }
      .T-I-atl[act="25"] { display: none !important; }
    `,
    aggressive: `
      .nH .n3zAf, [role="complementary"] { display: none !important; }
      [role="tab"][data-tab-id="meet"] { display: none !important; }
      [role="tab"][data-tab-id="spaces"] { display: none !important; }
      [role="tab"][data-tab-id="promotions"] { display: none !important; }
      .gb_R, .gb_Q, .gb_Ba { display: none !important; }
      .T-I-atl[act="25"] { display: none !important; }
      .at.tS, .cM, .gW, .T-I-KE { display: none !important; }
      .nH .if, .nH .n1KgP, .gb_Hd, .gb_Wg { display: none !important; }
      .n3zEo, .TN { display: none !important; }
      .gb_jf, .gb_gd { display: none !important; }
      .Yl3Y2b, .zA.zE, .AO.aeW { display: none !important; }
      .aKk, .aKk.Lb { display: none !important; }
      .nH .nH .Bk { display: none !important; }
      .zA { padding: 4px 0 !important; margin: 0 !important; }
      .yW { padding: 0 !important; }
    `,
  };

  function remove() {
    if (activeStyle) { activeStyle.remove(); activeStyle = null; }
    document.body.classList.remove('gmail-flow-surgery-active');
  }

  function apply(settings) {
    const mode = settings.surgeryMode || 'none';
    const css = SURGERY_PRESETS[mode] || SURGERY_PRESETS.none;
    if (!css) { remove(); return; }

    if (!activeStyle) {
      activeStyle = document.createElement('style');
      activeStyle.id = 'gmail-flow-surgery';
      document.head.appendChild(activeStyle);
    }
    activeStyle.textContent = css;
    document.body.classList.add('gmail-flow-surgery-active');
  }

  function getPresets() {
    return [
      { id: 'none', label: 'None', desc: 'Keep all Gmail elements' },
      { id: 'minimal', label: 'Minimal', desc: 'Remove sidebar, Meet, Spaces' },
      { id: 'moderate', label: 'Moderate', desc: 'Remove clutter + tabs + help' },
      { id: 'aggressive', label: 'Aggressive', desc: 'Strip everything non-essential' },
    ];
  }

  window.GmailFlowSurgery = { apply, remove, getPresets };
})();
