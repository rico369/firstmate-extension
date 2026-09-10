/**
 * Gmail Flow - Shared helpers
 * Deduplicated row detection, unread check, and utility functions
 */
(function () {
  if (window.GmailFlowHelpers) return;

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

  function escapeHtml(text) {
    if (!text) return "";
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  window.GmailFlowHelpers = {
    ROW_SELECTORS,
    getMailRows,
    rowText,
    isUnread,
    escapeHtml,
  };
})();
