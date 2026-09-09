/**
 * Gmail Flow - DOM Surgery
 * Aggressive element removal/reshaping via MutationObserver
 */
(function () {
  if (window.GmailFlowSurgery) return;
  window.GmailFlowSurgery = true;

  let surgeryObserver = null;
  let mutationsDisabled = false;

  const SURGERY_SELECTORS = {
    classic: {
      rightSidebar: ['.nH .no', '.n3zAf', '.gb_g.gb_Ra.gb_xf', '[role="complementary"]'],
      topBanner: ['.nH .if', '.nH .n1KgP', '.gb_Hd.gb_f', '.gb_Wg.gb_f'],
      promoTabs: ['[role="tab"][data-tab-id="promotions"]', '[role="tab"][data-tab-id="promotions"]'],
      meetTab: ['[role="tab"][data-tab-id="meet"]', '.Rs.Fwd .aUP'],
      spacesTab: ['[role="tab"][data-tab-id="spaces"]'],
      allTabs: ['[role="tab"]'],
      chatWidget: ['.at.tS', '.cM', '.gW', '.T-I-atl', '.T-I-KE'],
      composeArea: ['.AD', '.nH .AD'],
      leftNavItems: ['.n3zEo', '.TN'], 
      searchBox: ['.gb_jf', '.gb_gd'],
      helpButton: ['.gb_R', '.gb_Q'],
      settingsGear: ['.T-I-atl[act="20"]', '.T-I-atl[act="9"]'],
      aboutMe: ['.gb_Ba'],
      upgradeButton: ['.T-I-atl[act="25"]'],
      emptyPromo: ['.bog', '.n6'],
      promotionalCards: ['.Yl3Y2b', '.zA.zE', '.AO.aeW'],
      categories: ['.aKk'],
      tabsContainer: ['.aKk.Lb'],
    },
    structured: {
      rightPanel: ['#gmail-ro:gpif0', '#gmail-ro:gpif0 > div:first-child'],
      chatPanel: ['div[data-hovercard-id="chat"]', '[aria-label="Chat"]'],
      meetPanel: ['[aria-label="Meet"]'],
    }
  };

  let activeSurgeryStyle = null;

  function removeSurgeryStyles() {
    if (activeSurgeryStyle) {
      activeSurgeryStyle.remove();
      activeSurgeryStyle = null;
    }
  }

  function applySurgeryStyles(settings) {
    removeSurgeryStyles();
    
    const lines = [];
    
    if (settings.aggressiveRightSidebar) {
      lines.push('.nH .no, .n3zAf, [role="complementary"] { display: none !important; }');
    }
    if (settings.removeTopBanner) {
      lines.push('.nH .if, .nH .n1KgP, .gb_Hd, .gb_Wg { display: none !important; }');
      lines.push('.gb_xf { display: none !important; }');
    }
    if (settings.removePromoTab) {
      lines.push('[role="tab"][data-tab-id="promotions"] { display: none !important; }');
    }
    if (settings.removeMeetTab) {
      lines.push('[role="tab"][data-tab-id="meet"] { display: none !important; }');
      lines.push('.Rs.Fwd .aUP { display: none !important; }');
    }
    if (settings.removeSpacesTab) {
      lines.push('[role="tab"][data-tab-id="spaces"] { display: none !important; }');
    }
    if (settings.removeChatWidget) {
      lines.push('.at.tS, .cM, .gW, .T-I-atl, .T-I-KE { display: none !important; }');
    }
    if (settings.removeComposeArea) {
      lines.push('.AD, .nH .AD { display: none !important; }');
    }
    if (settings.removeLeftNav) {
      lines.push('.n3zEo, .TN { display: none !important; }');
    }
    if (settings.removeSearch) {
      lines.push('.gb_jf, .gb_gd { display: none !important; }');
    }
    if (settings.removeHelp) {
      lines.push('.gb_R, .gb_Q { display: none !important; }');
    }
    if (settings.removeSettingsGear) {
      lines.push('.T-I-atl[act="20"], .T-I-atl[act="9"] { display: none !important; }');
    }
    if (settings.removeAboutMe) {
      lines.push('.gb_Ba { display: none !important; }');
    }
    if (settings.removeUpgrade) {
      lines.push('.T-I-atl[act="25"] { display: none !important; }');
    }
    if (settings.removePromotionalCards) {
      lines.push('.Yl3Y2b, .zA.zE, .AO.aeW { display: none !important; }');
    }
    if (settings.removeCategories) {
      lines.push('.aKk, .aKk.Lb { display: none !important; }');
    }
    if (settings.removeInboxLabels) {
      lines.push('.bog, .n6 { color: transparent !important; }');
      lines.push('.bog span, .n6 span { color: transparent !important; }');
    }
    if (settings.simplifyEmailList) {
      lines.push('.zA { padding: 4px 0 !important; margin: 0 !important; }');
      lines.push('.yW { padding: 0 !important; }');
      lines.push('.zE { padding: 2px 8px !important; }');
      lines.push('.yP, .yW { min-height: 24px !important; }');
      lines.push('.yW span, .yP span { padding: 0 !important; }');
    }
    if (settings.removeFooter) {
      lines.push('.nH .nH .Bk { display: none !important; }');
      lines.push('.nH .nH .n1KgP { display: none !important; }');
    }

    if (lines.length > 0) {
      activeSurgeryStyle = document.createElement('style');
      activeSurgeryStyle.id = 'gmail-flow-surgery';
      activeSurgeryStyle.textContent = lines.join('\n');
      document.head.appendChild(activeSurgeryStyle);
    }
  }

  function remove() {
    if (surgeryObserver) {
      surgeryObserver.disconnect();
      surgeryObserver = null;
    }
    mutationsDisabled = false;
    removeSurgeryStyles();
    document.body.classList.remove('gmail-flow-surgery-active');
  }

  function apply(settings) {
    if (settings.aggressiveSurgery === false) {
      remove();
      return;
    }
    mutationsDisabled = true;
    applySurgeryStyles(settings);
    document.body.classList.add('gmail-flow-surgery-active');
    
    if (settings.simplifyEmailList) {
      startEmailSurgery();
    }
  }

  function startEmailSurgery() {
    if (surgeryObserver) return;
    surgeryObserver = new MutationObserver(() => {
      if (!mutationsDisabled) return;
      requestAnimationFrame(performSurgery);
    });
    surgeryObserver.observe(document.body, { childList: true, subtree: true });
  }

  function performSurgery() {
    const rows = document.querySelectorAll('.zA:not(.gmail-flow-surgery-processed)');
    rows.forEach(row => {
      row.classList.add('gmail-flow-surgery-processed');
      const avatars = row.querySelectorAll('.yP img, .yW img');
      avatars.forEach(a => {
        const parent = a.closest('.yP') || a.closest('.yW');
        if (parent) {
          parent.style.display = 'none';
        }
      });
      const snippets = row.querySelectorAll('.y6 span:not(.bog)');
      snippets.forEach(s => {
        s.style.display = 'none';
      });
      const checkboxes = row.querySelectorAll('.oZ-x.J-J5-Ji input, .oZ-x.J-J5-Ji [role="checkbox"]');
      checkboxes.forEach(cb => {
        cb.style.margin = '0';
        cb.style.padding = '0';
      });
    });
  }

  function getSurgeryOptions() {
    return [
      { key: 'aggressiveRightSidebar', label: 'Remove right sidebar' },
      { key: 'removeTopBanner', label: 'Remove top banner / header' },
      { key: 'removePromoTab', label: 'Remove Promotions tab' },
      { key: 'removeMeetTab', label: 'Remove Meet tab' },
      { key: 'removeSpacesTab', label: 'Remove Spaces tab' },
      { key: 'removeChatWidget', label: 'Remove chat widget' },
      { key: 'removeComposeArea', label: 'Remove compose area' },
      { key: 'removeLeftNav', label: 'Remove left navigation' },
      { key: 'removeSearch', label: 'Remove search bar' },
      { key: 'removeHelp', label: 'Remove help button' },
      { key: 'removeSettingsGear', label: 'Remove settings gear' },
      { key: 'removeAboutMe', label: 'Remove profile picture' },
      { key: 'removeUpgrade', label: 'Remove upgrade button' },
      { key: 'removePromotionalCards', label: 'Remove promotional cards' },
      { key: 'removeCategories', label: 'Remove category tabs' },
      { key: 'removeInboxLabels', label: 'Remove email labels' },
      { key: 'simplifyEmailList', label: 'Simplify email list layout' },
      { key: 'removeFooter', label: 'Remove footer elements' },
    ];
  }

  window.GmailFlowSurgery = { apply, remove, getSurgeryOptions };
})();
