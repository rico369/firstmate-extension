(() => {
  const NS = (window.GmailUXFeatures = window.GmailUXFeatures || {});

  const ROW_SELECTORS = [
    '[role="main"] [role="row"]',
    '[role="main"] tr[role="row"]',
    '[role="main"] div[role="row"]',
  ];

  function getMailRows() {
    const seen = new Set();
    ROW_SELECTORS.forEach((selector) => {
      document.querySelectorAll(selector).forEach((row) => {
        if (!row || seen.has(row)) return;
        const text = (row.textContent || "").trim();
        // Skip structural rows that contain no meaningful mail text.
        if (text.length < 8) return;
        seen.add(row);
      });
    });
    return Array.from(seen);
  }

  function rowText(row) {
    return (row.textContent || "").toLowerCase();
  }

  function isUnread(row) {
    const ariaLabel = `${row.getAttribute("aria-label") || ""} ${row.getAttribute("title") || ""}`.toLowerCase();
    const text = rowText(row);
    const explicitUnread = row.querySelector(
      '[aria-label*="Unread"], [aria-label*="unread"], [title*="Unread"], [title*="unread"]'
    );
    const hasUnreadClassHint = row.querySelector('[aria-label*="Unread"], [data-tooltip*="Unread"]');
    return Boolean(explicitUnread || hasUnreadClassHint || ariaLabel.includes("unread") || text.includes("unread"));
  }

  function isImportant(row) {
    const ariaLabel = (row.getAttribute("aria-label") || "").toLowerCase();
    const text = rowText(row);
    return ariaLabel.includes("important") || text.includes("important");
  }

  function hasKeyword(row, keywords) {
    if (!keywords || keywords.length === 0) return false;
    const text = rowText(row);
    return keywords.some((keyword) => keyword && text.includes(keyword));
  }

  NS.highlighting = {
    apply(settings) {
      const rows = getMailRows();
      document.documentElement.classList.toggle("gux-highlight-unread-only", Boolean(settings.highlightUnreadOnly));
      rows.forEach((row) => {
        const unread = isUnread(row);
        const important = isImportant(row);
        const keywordMatch = hasKeyword(row, settings.highlightKeywords || []);

        row.toggleAttribute("data-gux-unread", unread);
        row.toggleAttribute("data-gux-read", !unread);
        row.toggleAttribute("data-gux-important", important && settings.highlightImportantSenders);
        row.toggleAttribute("data-gux-keyword", keywordMatch);

        if (settings.highlightUnreadOnly) row.toggleAttribute("data-gux-muted", !unread);
        else if (settings.dimReadEmails) row.toggleAttribute("data-gux-muted", !unread);
        else row.removeAttribute("data-gux-muted");
      });
    },
  };
})();
