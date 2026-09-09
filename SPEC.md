# Gmail Flow — Product Spec

> A Chrome extension for neurodivergent people that makes Gmail faster, calmer, and easier to process.

## Vision

Simplify makes Gmail faster for power users. Gmail Flow makes Gmail *accessible* for the way neurodivergent brains actually work — while being just as fast.

**Tagline:** "Email that works with your brain, not against it."

## Target Users

- ADHD (executive function paralysis, time blindness, decision fatigue)
- Autism (sensory overload, need for predictability, literal processing)
- Dyslexia (reading overload, visual clutter)
- Anxiety (inbox dread, avoidance spirals)
- Anyone who finds Gmail overwhelming

## Core Features

### 1. Smart Flow (Speed + Executive Function)

**One-click email triage** — process your inbox without decision paralysis.

- **Flow Mode**: Press `F` to enter a focused single-email view. Arrow keys or `J/K` to advance. `A` archive, `R` reply, `S` snooze, `D` delete. No going back — forward only.
- **Priority Score**: Each email gets a subtle badge: 🔴 Urgent (deadline <24h), 🟡 Soon (deadline <7d), 🟢 Later, ⚪ Low priority. Based on sender history, keywords, and response patterns.
- **Batch Actions**: Select multiple emails, apply one action to all. "Archive all read," "Snooze all bills," "Mark all promotions read."
- **Quick Capture**: `Ctrl+Shift+C` opens a floating "brain dump" — jot a note, create a task, or draft a reply without losing your place.

### 2. Focus Engine (Sensory + Attention)

**Reduce cognitive load without reducing capability.**

- **Calm Profiles**: One-click presets:
  - 🧘 **Zen** — muted colors, large text, single column, no animations
  - ⚡ **Speed** — compact, keyboard-first, minimal chrome
  - 🌙 **Night** — dark mode with warm tones, reduced blue light
  - 🎯 **Focus** — hides sidebar, promotions, social tabs; inbox only
  - 🎨 **Custom** — full control over every visual element
- **Sensory Controls**: Granular sliders for contrast, saturation, animation speed, font size, line height, spacing
- **Reduced Motion**: Respect `prefers-reduced-motion`, disable all Gmail animations
- **Predictable Layout**: Lock layout so Gmail doesn't jump around when loading

### 3. Time Awareness (ADHD Support)

**Make time visible and email feel manageable.**

- **Email Age Indicator**: Each email shows "2h ago," "3d ago," "1w ago" — always visible, color-coded (green=fresh, yellow=aging, red=stale)
- **Response Time Tracker**: Shows average response time per sender. "You usually reply to Mom in 2h" vs "You usually reply to LinkedIn in 3d"
- **Inbox Heatmap**: Mini calendar showing email volume by day. See your patterns.
- **Focus Timer**: Optional Pomodoro-style timer. "25 minutes, process 10 emails." Gamified progress.
- **Daily Digest**: End-of-day summary: "You processed 47 emails, archived 31, replied to 12, 3 need follow-up."

### 4. Reading Support (Dyslexia + Overload)

**Make emails easier to read and understand.**

- **Email Summaries**: AI-powered one-line summaries at the top of each email. "Meeting moved to Thursday 3pm" or "Invoice attached, $247 due Oct 1."
- **Key Points Highlight**: Automatically bold/underline action items, dates, names, and deadlines in email body
- **Reading Mode**: Strip emails to plain text with configurable font (OpenDyslexic, Atkinson Hyperlegible, etc.)
- **Send Later + Reminders**: Schedule replies and set follow-up reminders so you don't have to remember

### 5. Gmail Integration (Not a Wrapper)

**Works inside Gmail, not on top of it.**

- Content script injection — no proxy, no API access to your email
- Respects Gmail's own keyboard shortcuts (adds to them, doesn't replace)
- Compatible with other extensions (Simplify, Checker Plus, etc.)
- Manifest V3, minimal permissions: `storage`, `activeTab`, `https://mail.google.com/*`

## Architecture

```
manifest.json
popup/
  popup.html          — quick settings + profile switcher
  popup.js
  popup.css
src/
  content.js          — orchestrator, settings, storage
  features/
    flow.js           — Flow Mode (single-email triage)
    priority.js       — priority scoring + badges
    focus.js          — content width, calm mode, inbox visibility
    cleanup.js        — hide sidebar/Meet/Spaces, density
    highlighting.js   — unread/important/keyword highlighting
    time-awareness.js — email age, response tracking, heatmap
    reading.js        — summaries, key points, reading mode
    shortcuts.js      — custom keyboard shortcuts
  ui-panel.js         — settings panel (right sidebar)
  ui-quick-capture.js — brain dump floating widget
  utils.js            — shared utilities
  styles.css          — all CSS (calm profiles, density, visual calm)
icons/
  *.svg
```

## Settings Categories

1. **Profiles** — Zen, Speed, Night, Focus, Custom (one-click switch)
2. **Visual** — contrast, saturation, font, font size, line height, spacing, animations
3. **Layout** — hide sidebar, hide Meet, hide Spaces, compact/spacious, content width
4. **Flow** — Flow Mode key, batch action defaults, priority scoring on/off
5. **Time** — email age display, response tracking, focus timer, daily digest
6. **Reading** — summaries on/off, key points, reading font, plain text mode
7. **Organization** — group by date, bundle by sender, highlight keywords
8. **Account** — account color mapping, multi-account support

## Competitive Advantage

| Feature | Simplify | Gmail Flow |
|---------|----------|------------|
| Price | Paid after 1mo | Free (open source) |
| Neurodivergent focus | ✗ | ✓ Core mission |
| Flow Mode (single-email triage) | ✗ | ✓ |
| Priority scoring | ✗ | ✓ |
| Email age indicators | ✗ | ✓ |
| Focus timer | ✗ | ✓ |
| AI summaries | ✗ | ✓ |
| Calm profiles | ✗ | ✓ |
| Reading fonts (OpenDyslexic) | ✗ | ✓ |
| Tracker blocking | 250+ | ✓ (basic) |
| Bundles | ✓ | ✓ |
| Dark mode | ✓ | ✓ |
| Keyboard shortcuts | ✓ | ✓ |
| Privacy-first | ✓ | ✓ |

## MVP (v1.0)

Ship the foundation that makes Gmail usable:

1. Calm Profiles (Zen, Speed, Night, Focus)
2. Visual controls (contrast, font, spacing, animations)
3. Hide sidebar/Meet/Spaces
4. Email age indicators
5. Priority badges (basic: sender-based)
6. Keyboard shortcuts (Flow Mode basic)
7. Account color mapping

## v1.1

1. Flow Mode (full single-email triage)
2. Batch actions
3. Focus timer
4. Reading mode with OpenDyslexic

## v1.2

1. AI email summaries
2. Key points highlighting
3. Response time tracking
4. Daily digest

## Privacy

- No data leaves the browser
- No analytics, no trackers, no ads — ever
- All processing local (AI summaries via local model or user's own API key)
- Minimal permissions: only `storage`, `activeTab`, `https://mail.google.com/*`
- Code is open source and auditable

## Success Metrics

- Chrome Web Store rating ≥ 4.5 stars
- Active weekly users growing 20% MoM
- User feedback: "I can finally process my email without anxiety"
- Time-to-inbox-zero reduced by 30%+
