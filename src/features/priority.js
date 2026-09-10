(() => {
  const NS = (window.GmailFlowFeatures = window.GmailFlowFeatures || {});
  const { getMailRows, rowText, isUnread } = window.GmailFlowHelpers;

  const PRIORITY_KEYWORDS = {
    urgent: ["urgent", "asap", "immediately", "critical", "emergency", "deadline"],
    high: ["action required", "please respond", "follow up", "waiting for", "overdue", "late"],
    medium: ["review", "update", "meeting", "schedule", "confirm", "approval"],
  };

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
      case "urgent": return "\u{1F534}";
      case "high": return "\u{1F7E0}";
      case "medium": return "\u{1F7E1}";
      default: return "";
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
