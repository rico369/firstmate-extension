/**
 * Gmail Flow - Background Tints
 * Color overlays for different neurodivergent needs
 */
(function () {
  if (window.GmailFlowTints) return;
  window.GmailFlowTints = true;

  let tintTag = null;

  const TINTS = {
    cream:      { label: 'Cream',      bg: '#FDF6E3', text: '#333' },
    lavender:   { label: 'Lavender',   bg: '#E8E0F0', text: '#2D2B55' },
    sage:       { label: 'Sage',       bg: '#E8F0E8', text: '#1A3A1A' },
    blush:      { label: 'Blush',      bg: '#FDE8E8', text: '#5C2020' },
    sky:        { label: 'Sky',        bg: '#E0F0FF', text: '#0A2A4A' },
    amber:      { label: 'Amber',      bg: '#FFF8E1', text: '#4A3600' },
    mint:       { label: 'Mint',       bg: '#E0F8F0', text: '#1A4A4A' },
    rose:       { label: 'Rose',       bg: '#FFF0F5', text: '#4A1A2A' },
    dusk:       { label: 'Dusk',       bg: '#E8E0F0', text: '#1A1A3A' },
    moonlight:  { label: 'Moonlight',  bg: '#F0F8FF', text: '#1A2A3A' },
    charcoal:   { label: 'Charcoal',   bg: '#1E1E2E', text: '#CDD6F4' },
    oled:       { label: 'OLED Black', bg: '#000000', text: '#E0E0E0' },
    midnight:   { label: 'Midnight',   bg: '#0A0A1A', text: '#B0B8D0' },
    none:       { label: 'None',       bg: null, text: null }
  };

  function remove() {
    if (tintTag) { tintTag.remove(); tintTag = null; }
    document.documentElement.style.removeProperty('--gf-bg-tint');
    document.documentElement.style.removeProperty('--gf-text-tint');
    document.body.classList.remove('gmail-flow-tint-active');
  }

  function inject(settings) {
    const tint = settings.backgroundTint || 'none';
    const colors = TINTS[tint] || TINTS.none;
    if (!colors.bg) { remove(); return; }

    const textColor = settings.tintTextColor || colors.text;

    const lines = [];
    lines.push(`.gmail-flow-tint-active {`);
    lines.push(`  background-color: ${colors.bg} !important;`);
    lines.push(`  color: ${textColor} !important;`);
    lines.push(`}`);
    lines.push(`.gmail-flow-tint-active .nH .nH {`);
    lines.push(`  background-color: ${colors.bg} !important;`);
    lines.push(`}`);
    lines.push(`.gmail-flow-tint-active .nH .nH .no {`);
    lines.push(`  background-color: ${colors.bg} !important;`);
    lines.push(`}`);
    lines.push(`.gmail-flow-tint-active .aJ8 {`);
    lines.push(`  background-color: ${colors.bg} !important;`);
    lines.push(`}`);
    lines.push(`.gmail-flow-tint-active .Cp {`);
    lines.push(`  background-color: ${colors.bg} !important;`);
    lines.push(`}`);
    lines.push(`.gmail-flow-tint-active .TRS {`);
    lines.push(`  background-color: ${colors.bg} !important;`);
    lines.push(`}`);
    lines.push(`.gmail-flow-tint-active .ip {`);
    lines.push(`  background-color: ${colors.bg} !important;`);
    lines.push(`}`);
    lines.push(`.gmail-flow-tint-active .AO {`);
    lines.push(`  background-color: ${colors.bg} !important;`);
    lines.push(`}`);
    lines.push(`.gmail-flow-tint-active .Tm.aeJ {`);
    lines.push(`  background-color: ${colors.bg} !important;`);
    lines.push(`}`);
    lines.push(`.gmail-flow-tint-active .Bk {`);
    lines.push(`  background-color: ${colors.bg} !important;`);
    lines.push(`}`);
    lines.push(`.gmail-flow-tint-active .aeJ {`);
    lines.push(`  background-color: ${colors.bg} !important;`);
    lines.push(`}`);
    lines.push(`.gmail-flow-tint-active .yW {`);
    lines.push(`  background-color: ${colors.bg} !important;`);
    lines.push(`}`);
    lines.push(`.gmail-flow-tint-active .yW span {`);
    lines.push(`  color: ${textColor} !important;`);
    lines.push(`}`);
    lines.push(`.gmail-flow-tint-active .yW b {`);
    lines.push(`  color: ${textColor} !important;`);
    lines.push(`}`);
    lines.push(`.gmail-flow-tint-active .zF {`);
    lines.push(`  background-color: ${colors.bg} !important;`);
    lines.push(`}`);
    lines.push(`.gmail-flow-tint-active .bog {`);
    lines.push(`  color: ${textColor} !important;`);
    lines.push(`}`);
    lines.push(`.gmail-flow-tint-active .bog span {`);
    lines.push(`  color: ${textColor} !important;`);
    lines.push(`}`);
    lines.push(`.gmail-flow-tint-active .a3s {`);
    lines.push(`  color: ${textColor} !important;`);
    lines.push(`}`);
    lines.push(`.gmail-flow-tint-active .a3s .gmail_extra {`);
    lines.push(`  color: ${textColor} !important;`);
    lines.push(`}`);
    lines.push(`.gmail-flow-tint-active .a3s .gmail_quote {`);
    lines.push(`  color: ${textColor} !important;`);
    lines.push(`}`);
    lines.push(`.gmail-flow-tint-active .adn {`);
    lines.push(`  background-color: ${colors.bg} !important;`);
    lines.push(`}`);
    lines.push(`.gmail-flow-tint-active .adn .gs {`);
    lines.push(`  background-color: ${colors.bg} !important;`);
    lines.push(`  color: ${textColor} !important;`);
    lines.push(`}`);
    lines.push(`.gmail-flow-tint-active .iY .gs .gB {`);
    lines.push(`  background-color: ${colors.bg} !important;`);
    lines.push(`  color: ${textColor} !important;`);
    lines.push(`}`);
    lines.push(`.gmail-flow-tint-active .iP {`);
    lines.push(`  background-color: ${colors.bg} !important;`);
    lines.push(`}`);
    lines.push(`.gmail-flow-tint-active .n6 {`);
    lines.push(`  color: ${textColor} !important;`);
    lines.push(`}`);
    lines.push(`.gmail-flow-tint-active .n6 span {`);
    lines.push(`  color: ${textColor} !important;`);
    lines.push(`}`);

    if (!tintTag) {
      tintTag = document.createElement('style');
      tintTag.id = 'gmail-flow-tint';
      document.head.appendChild(tintTag);
    }
    tintTag.textContent = lines.join('\n');

    document.body.classList.add('gmail-flow-tint-active');
    document.documentElement.style.setProperty('--gf-bg-tint', colors.bg);
    document.documentElement.style.setProperty('--gf-text-tint', textColor);
  }

  function apply(settings) {
    if (!settings.backgroundTint || settings.backgroundTint === 'none') {
      remove();
      return;
    }
    inject(settings);
  }

  function getTints() { return Object.entries(TINTS).map(([k, v]) => ({ id: k, label: v.label })); }

  window.GmailFlowTints = { apply, remove, getTints };
})();
