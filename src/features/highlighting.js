(() => {
  const NS = (window.GmailFlowFeatures = window.GmailFlowFeatures || {});
  const { getMailRows, rowText, isUnread } = window.GmailFlowHelpers;

  NS.highlighting = {
    apply(settings) {
      const rows = getMailRows();
      document.documentElement.classList.toggle("gf-highlight-unread-only", Boolean(settings.highlightUnreadOnly));
      rows.forEach((row) => {
        const unread = isUnread(row);
        const text = rowText(row);
        const important = (row.getAttribute("aria-label") || "").toLowerCase().includes("important") || text.includes("important");
        const keywordMatch = (settings.highlightKeywords || []).some(kw => kw && text.includes(kw));

        row.toggleAttribute("data-gf-unread", unread);
        row.toggleAttribute("data-gf-read", !unread);
        row.toggleAttribute("data-gf-important", important && settings.highlightImportantSenders);
        row.toggleAttribute("data-gf-keyword", keywordMatch);

        if (settings.highlightUnreadOnly) row.toggleAttribute("data-gf-muted", !unread);
        else if (settings.dimReadEmails) row.toggleAttribute("data-gf-muted", !unread);
        else row.removeAttribute("data-gf-muted");
      });
    },
  };
})();
