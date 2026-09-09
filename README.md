# Gmail Account Favicon Switcher (MV3)

Chrome extension that changes the Gmail tab favicon based on the active logged-in account.

## Folder Structure

```text
EXTENSION/
  manifest.json
  README.md
  src/
    content.js
  popup/
    popup.html
    popup.css
    popup.js
  icons/
    red-a.svg
    blue-b.svg
    gray-q.svg
```

## Features

- Runs only on `https://mail.google.com/*`
- Detects active account email from Gmail DOM (and URL/body fallbacks)
- Maps account email to a color-based favicon
- Uses default color if account is not mapped
- Handles Gmail SPA navigation and account switching without refresh
- Popup UI to manage mappings
- Persists settings in `chrome.storage.sync`

## Default Mapping

- No prefilled account mappings by default
- Unknown account -> `gray`
- Add mappings from the extension popup (example: `account1@gmail.com` -> `red`)

## Load in Chrome (Developer Mode)

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (top-right)
3. Click **Load unpacked**
4. Select this `EXTENSION` folder
5. Open `https://mail.google.com/`
6. Use extension popup to configure account-color mappings

## Notes

- Favicons are generated dynamically as SVG data URLs (colored circle + account initial).
- The sample files in `icons/` are example generated icons.
- No external dependencies are required.
