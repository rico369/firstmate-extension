(() => {
  const NS = (window.GmailUXFeatures = window.GmailUXFeatures || {});

  const ROW_SELECTORS = [
    '[role="main"] [role="row"]',
    '[role="main"] tr[role="row"]',
    '[role="main"] div[role="row"]',
  ];

  function getMailRows() {
    const rows = [];
    const seen = new Set();
    ROW_SELECTORS.forEach((selector) => {
      document.querySelectorAll(selector).forEach((row) => {
        if (!row || seen.has(row)) return;
        const text = (row.textContent || "").trim();
        if (text.length < 8) return;
        seen.add(row);
        rows.push(row);
      });
    });
    return rows;
  }

  function getRowText(row) {
    return (row.textContent || "").toLowerCase();
  }

  function maybeTagDateGroups(settings) {
    const rows = getMailRows();
    if (!settings.groupByDate) {
      rows.forEach((row) => row.removeAttribute("data-gux-date-group"));
      rows.forEach((row) => row.removeAttribute("data-gux-date-header"));
      return;
    }

    let previousGroup = "";
    const headerLabelMap = {
      today: "Today",
      yesterday: "Yesterday",
      "this-week": "This Week",
      "this-month": "This Month",
      older: "Older",
    };
    rows.forEach((row) => {
      const text = getRowText(row);
      let group = "older";
      if (text.includes("today")) group = "today";
      else if (text.includes("yesterday")) group = "yesterday";
      else if (text.includes("this week")) group = "this-week";
      else if (text.includes("this month")) group = "this-month";
      row.setAttribute("data-gux-date-group", group);

      if (group !== previousGroup) {
        row.setAttribute("data-gux-date-header", group);
        row.setAttribute("data-gux-date-header-label", headerLabelMap[group] || "Older");
        previousGroup = group;
      } else {
        row.removeAttribute("data-gux-date-header");
        row.removeAttribute("data-gux-date-header-label");
      }
    });
  }

  function maybeBundleRows(settings) {
    const rows = getMailRows();
    if (!settings.bundleBySenderLabel) {
      rows.forEach((row) => {
        row.removeAttribute("data-gux-bundled");
        row.removeAttribute("data-gux-bundle-count");
      });
      return;
    }

    const senderCount = new Map();
    const senderByRow = new Map();

    rows.forEach((row) => {
      const senderNode =
        row.querySelector('[email]') ||
        row.querySelector('[name]') ||
        row.querySelector('[data-hovercard-id]') ||
        row.querySelector('[role="link"][title]') ||
        row.querySelector('span[email]') ||
        row.querySelector('span[title]');

      const sender = (
        (senderNode && (senderNode.getAttribute("email") || senderNode.getAttribute("name"))) ||
        (senderNode && senderNode.textContent) ||
        ""
      )
        .trim()
        .toLowerCase();

      if (!sender) return;
      senderByRow.set(row, sender);
      senderCount.set(sender, (senderCount.get(sender) || 0) + 1);
    });

    const firstSeen = new Set();
    rows.forEach((row) => {
      const sender = senderByRow.get(row);
      if (!sender) return;
      const count = senderCount.get(sender) || 1;
      row.setAttribute("data-gux-bundle-count", String(count));

      if (!firstSeen.has(sender)) {
        row.setAttribute("data-gux-bundled", "lead");
        firstSeen.add(sender);
      } else {
        row.setAttribute("data-gux-bundled", "true");
      }
    });
  }

  NS.grouping = {
    apply(settings) {
      maybeTagDateGroups(settings);
      maybeBundleRows(settings);
    },
  };
})();
