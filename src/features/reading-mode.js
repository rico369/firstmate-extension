/**
 * Gmail Flow - Reading Mode
 * Strip emails to plain text, chunk long content
 */
(function () {
  if (window.GmailFlowReading) return;
  window.GmailFlowReading = true;

  let styleTag = null;
  let readingObserver = null;

  function remove() {
    if (styleTag) { styleTag.remove(); styleTag = null; }
    if (readingObserver) { readingObserver.disconnect(); readingObserver = null; }
    document.body.classList.remove('gmail-flow-reading-active');
    document.querySelectorAll('.gmail-flow-reading-mode').forEach(el => el.remove());
  }

  function apply(settings) {
    if (settings.readingMode === false) {
      remove();
      return;
    }

    const lines = [];
    lines.push(`.gmail-flow-reading-active .nH .nH .nH {`);
    lines.push(`  max-width: 680px !important;`);
    lines.push(`  margin: 0 auto !important;`);
    lines.push(`  padding: 24px 16px !important;`);
    lines.push(`}`);
    lines.push(`.gmail-flow-reading-active .a3s, .gmail-flow-reading-active .gs .a3s {`);
    lines.push(`  max-width: 680px !important;`);
    lines.push(`  margin: 0 auto !important;`);
    lines.push(`}`);
    lines.push(`.gmail-flow-reading-active .a3s .gmail_extra, .gmail-flow-reading-active .a3s .gmail_quote {`);
    lines.push(`  border-left: 3px solid #ccc !important;`);
    lines.push(`  padding-left: 12px !important;`);
    lines.push(`  margin-left: 0 !important;`);
    lines.push(`  opacity: 0.5 !important;`);
    lines.push(`  max-height: 200px !important;`);
    lines.push(`  overflow: hidden !important;`);
    lines.push(`  transition: max-height 0.3s ease !important;`);
    lines.push(`}`);
    lines.push(`.gmail-flow-reading-active .a3s .gmail_extra:hover, .gmail-flow-reading-active .a3s .gmail_quote:hover {`);
    lines.push(`  max-height: 2000px !important;`);
    lines.push(`  opacity: 1 !important;`);
    lines.push(`}`);
    lines.push(`.gmail-flow-reading-active .iY {`);
    lines.push(`  max-width: 680px !important;`);
    lines.push(`  margin: 0 auto !important;`);
    lines.push(`}`);
    lines.push(`.gmail-flow-reading-active .gs {`);
    lines.push(`  max-width: 680px !important;`);
    lines.push(`  margin: 0 auto !important;`);
    lines.push(`}`);
    lines.push(`.gmail-flow-reading-active .gB {`);
    lines.push(`  max-width: 680px !important;`);
    lines.push(`  margin: 0 auto !important;`);
    lines.push(`}`);
    lines.push(`.gmail-flow-reading-active .hi {`);
    lines.push(`  max-width: 680px !important;`);
    lines.push(`  margin: 0 auto !important;`);
    lines.push(`  padding: 16px !important;`);
    lines.push(`}`);
    lines.push(`.gmail-flow-reading-active .a3s img {`);
    lines.push(`  max-width: 100% !important;`);
    lines.push(`  height: auto !important;`);
    lines.push(`}`);
    lines.push(`.gmail-flow-reading-active .a3s a {`);
    lines.push(`  color: #1a73e8 !important;`);
    lines.push(`  text-decoration: underline !important;`);
    lines.push(`}`);
    lines.push(`.gmail-flow-reading-active .a3s a:hover {`);
    lines.push(`  color: #1557b0 !important;`);
    lines.push(`}`);
    lines.push(`.gmail-flow-reading-active .a3s p {`);
    lines.push(`  margin-bottom: 16px !important;`);
    lines.push(`}`);
    lines.push(`.gmail-flow-reading-active .a3s ul, .gmail-flow-reading-active .a3s ol {`);
    lines.push(`  margin-bottom: 16px !important;`);
    lines.push(`  padding-left: 24px !important;`);
    lines.push(`}`);
    lines.push(`.gmail-flow-reading-active .a3s li {`);
    lines.push(`  margin-bottom: 8px !important;`);
    lines.push(`}`);
    lines.push(`.gmail-flow-reading-active .a3s table {`);
    lines.push(`  max-width: 100% !important;`);
    lines.push(`  overflow-x: auto !important;`);
    lines.push(`}`);
    lines.push(`.gmail-flow-reading-active .a3s table td {`);
    lines.push(`  padding: 8px !important;`);
    lines.push(`  vertical-align: top !important;`);
    lines.push(`}`);
    lines.push(`.gmail-flow-reading-active .ha h2 {`);
    lines.push(`  font-size: 22px !important;`);
    lines.push(`  font-weight: 600 !important;`);
    lines.push(`  margin-bottom: 16px !important;`);
    lines.push(`}`);
    lines.push(`.gmail-flow-reading-active .yP, .gmail-flow-reading-active .yW {`);
    lines.push(`  display: none !important;`);
    lines.push(`}`);
    lines.push(`.gmail-flow-reading-active .bog {`);
    lines.push(`  display: block !important;`);
    lines.push(`  font-size: 20px !important;`);
    lines.push(`  font-weight: 600 !important;`);
    lines.push(`  margin-bottom: 8px !important;`);
    lines.push(`}`);
    lines.push(`.gmail-flow-reading-active .n6 {`);
    lines.push(`  display: block !important;`);
    lines.push(`  font-size: 14px !important;`);
    lines.push(`  color: #666 !important;`);
    lines.push(`  margin-bottom: 4px !important;`);
    lines.push(`}`);

    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'gmail-flow-reading';
      document.head.appendChild(styleTag);
    }
    styleTag.textContent = lines.join('\n');
    document.body.classList.add('gmail-flow-reading-active');

    if (settings.chunkLongEmails) {
      startChunking();
    }
  }

  function startChunking() {
    if (readingObserver) return;
    readingObserver = new MutationObserver(() => {
      requestAnimationFrame(chunkLongEmails);
    });
    readingObserver.observe(document.body, { childList: true, subtree: true });
  }

  function chunkLongEmails() {
    const emailBodies = document.querySelectorAll('.a3s:not(.gmail-flow-chunked)');
    emailBodies.forEach(body => {
      body.classList.add('gmail-flow-chunked');
      const paragraphs = body.querySelectorAll('p, div.gmail_extra, div.gmail_quote');
      if (paragraphs.length > 5) {
        paragraphs.forEach((p, i) => {
          if (i > 3) {
            p.style.opacity = '0.4';
            p.style.maxHeight = '120px';
            p.style.overflow = 'hidden';
            p.style.transition = 'max-height 0.3s ease, opacity 0.3s ease';
            const expandBtn = document.createElement('button');
            expandBtn.textContent = 'Expand';
            expandBtn.className = 'gmail-flow-expand-btn';
            expandBtn.style.cssText = 'display:block;margin:8px 0;padding:4px 12px;font-size:12px;border:1px solid #ccc;border-radius:4px;background:#f5f5f5;cursor:pointer;';
            expandBtn.addEventListener('click', () => {
              p.style.maxHeight = 'none';
              p.style.opacity = '1';
              expandBtn.remove();
            });
            p.parentNode.insertBefore(expandBtn, p.nextSibling);
          }
        });
      }
    });
  }

  window.GmailFlowReading = { apply, remove };
})();
