(() => {
  const NS = (window.GmailFlowFeatures = window.GmailFlowFeatures || {});
  const { getMailRows } = window.GmailFlowHelpers;

  function parseEmailDate(row) {
    const timeEl = row.querySelector("span[title], span[data-hovercard-id], span[aria-label]");
    if (!timeEl) return null;
    const title = timeEl.getAttribute("title") || "";
    const date = new Date(title);
    if (!isNaN(date.getTime())) return date;
    const text = (timeEl.textContent || "").trim();
    const fallback = new Date(text);
    if (!isNaN(fallback.getTime())) return fallback;
    return null;
  }

  function formatAge(date) {
    if (!date) return "";
    const now = new Date();
    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMs / 3600000);
    const diffDay = Math.floor(diffMs / 86400000);
    if (diffMin < 1) return "just now";
    if (diffMin < 60) return `${diffMin}m`;
    if (diffHr < 24) return `${diffHr}h`;
    if (diffDay < 7) return `${diffDay}d`;
    if (diffDay < 30) return `${Math.floor(diffDay / 7)}w`;
    return `${Math.floor(diffDay / 30)}mo`;
  }

  function getAgeClass(date) {
    if (!date) return "";
    const diffHr = (Date.now() - date) / 3600000;
    const diffDay = diffHr / 24;
    if (diffHr < 2) return "gf-age-fresh";
    if (diffDay < 1) return "gf-age-recent";
    if (diffDay < 3) return "gf-age-aging";
    if (diffDay < 7) return "gf-age-stale";
    return "gf-age-old";
  }

  function upsertAgeBadge(row, settings) {
    if (!settings.showEmailAge) {
      const existing = row.querySelector(".gf-email-age");
      if (existing) existing.remove();
      return;
    }
    const date = parseEmailDate(row);
    const ageText = formatAge(date);
    if (!ageText) return;
    let badge = row.querySelector(".gf-email-age");
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "gf-email-age";
      badge.setAttribute("aria-hidden", "true");
      const firstCell = row.querySelector('[role="gridcell"], td, div');
      if (firstCell) firstCell.appendChild(badge);
      else row.appendChild(badge);
    }
    badge.textContent = ageText;
    badge.className = `gf-email-age ${getAgeClass(date)}`;
  }

  NS.timeAwareness = {
    apply(settings) {
      if (!settings.showEmailAge) {
        document.querySelectorAll(".gf-email-age").forEach((el) => el.remove());
        return;
      }
      const rows = getMailRows();
      rows.forEach((row) => upsertAgeBadge(row, settings));
    },
  };
})();
