(() => {
  const NS = (window.GmailFlowFeatures = window.GmailFlowFeatures || {});

  const ROW_SELECTORS = [
    '[role="main"] [role="row"]',
    '[role="main"] tr[role="row"]',
    '[role="main"] div[role="row"]',
  ];

  const PRIORITY_KEYWORDS = {
    urgent: ["urgent", "asap", "immediately", "critical", "emergency", "deadline"],
    high: ["action required", "please respond", "follow up", "waiting for", "overdue", "late"],
    medium: ["review", "update", "meeting", "schedule", "confirm", "approval"],
  };

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
    return Boolean(explicitUnread || ariaLabel.includes("unread") || text.includes("unread"));
  }

  function isStarred(row) {
    return Boolean(
      row.querySelector('[aria-label*="starred"], [aria-label*="Starred"], [data-starred="true"]') ||
        row.getAttribute("aria-label")?.toLowerCase().includes("starred")
    );
  }

  function getPriority(row) {
    const text = rowText(row);
    const unread = isUnread(row);
    const starred = isStarred(row);

    if (starred && unread) return "urgent";
    if (starred) return "high";

    for (const [level, keywords] of Object.entries(PRIORITY_KEYWORDS)) {
      if (keywords.some((kw) => text.includes(kw))) return level;
    }

    if (unread) return "medium";
    return "low";
  }

  function getPriorityIcon(priority) {
    switch (priority) {
      case "urgent":
        return "🔴";
      case "high":
        return "🟠";
      case "medium":
        return "🟡";
      default:
        return "";
    }
  }

  function upsertPriorityBadge(row, settings) {
    if (!settings.showPriorityBadges) {
      const existing = row.querySelector(".gf-priority-badge");
      if (existing) existing.remove();
      return;
    }

    const priority = getPriority(row);
    if (priority === "low") {
      const existing = row.querySelector(".gf-priority-badge");
      if (existing) existing.remove();
      return;
    }

    let badge = row.querySelector(".gf-priority-badge");
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "gf-priority-badge";
      badge.setAttribute("aria-hidden", "true");
      row.appendChild(badge);
    }

    badge.textContent = getPriorityIcon(priority);
    badge.className = `gf-priority-badge gf-priority-${priority}`;
    badge.title = `${priority} priority`;
  }

  NS.priority = {
    apply(settings) {
      if (!settings.showPriorityBadges) {
        document.querySelectorAll(".gf-priority-badge").forEach((el) => el.remove());
        return;
      }
      const rows = getMailRows();
      rows.forEach((row) => upsertPriorityBadge(row, settings));
    },
  };
})();
