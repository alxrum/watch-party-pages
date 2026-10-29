# Watch Party — pages

The static pages the Watch Party Chrome extension opens, served by GitHub Pages at
`https://alxrum.github.io/watch-party-pages/`. The addresses live in one place in the extension:
`src/lib/config.js` (`WELCOME_URL`, `UNINSTALL_URL`, `FEEDBACK_URL`, `INVITE_BASE_URL`).

| Path | Opened by | What it does |
|---|---|---|
| `welcome/` | `chrome.runtime.onInstalled`, once, `reason === 'install'` | Says it installed, and shows the three steps to pin it. Nothing else — module 3, step 4 of the methodology: a welcome page that teaches the product gets closed unread. |
| `uninstall/` | `chrome.runtime.setUninstallURL` | Four reasons and a free-text box, sent to a Google Form. |
| `feedback/` | 1–3 stars in the rating widget (F-22) | One question, "What should be better?", to a Google Form. No stars, no link to the store. |
| `j/<CODE>` | an invite link (F-13, F-14, F-15) | Hands the room to the extension, or offers the install and keeps the room for when the guest comes back. |
| `404.html` | GitHub Pages, for any unknown path | A copy of `j/index.html`, which is what makes `/j/<CODE>` work: the code is a path segment, not a file. Keep the two in step with `tools/sync-404.sh`. |

`j/index.html` is a copy of `store/pages/j/index.html` in the extension repository, where it ships
beside the code it has to agree with and the e2e suite serves that very file. Edit it there, copy
it here, then run `tools/sync-404.sh`.

## Rules these pages keep

- **No third-party request on the invite page** (TZ 3.1): no font, no CDN, no analytics — everything
  inline. The room code never leaves the browser, and the film is in the URL fragment, which is
  never sent to the server at all.
- **Umami on the other three** (`welcome/`, `uninstall/`, `feedback/`), one shared website id for
  all of Ana's products; they are told apart in the dashboard by URL path. Unique visitors on
  `/watch-party-pages/welcome/` ≈ installs, on `/watch-party-pages/uninstall/` ≈ removals.
- **`noindex` everywhere.** None of these pages is a landing page.
- **English as a native reader expects it**, every string — the pages are read as part of the
  product.

## Illustrations

`tools/shots.html` → `node tools/render-shots.js` → `welcome/steps-1-2.png`, `welcome/step-3.png`
(2x, drawn, not photographed). The renderer borrows Chrome for Testing and puppeteer-core from the
extension repository, so it expects `../watch-party` beside this folder and Node 20+:

```bash
export PATH="/opt/homebrew/Cellar/node@22/22.23.3_1/bin:$PATH"
node tools/render-shots.js
```

## Live, checked 29.10.2026

| Address | |
|---|---|
| https://alxrum.github.io/watch-party-pages/welcome/ | 200 |
| https://alxrum.github.io/watch-party-pages/uninstall/ | 200 |
| https://alxrum.github.io/watch-party-pages/feedback/ | 200 |
| https://alxrum.github.io/watch-party-pages/j/ | 200 |
| https://alxrum.github.io/watch-party-pages/j/ABC23K | 404 by design — served from `404.html`, which is the invite page |

Driven in real Chrome at `/j/ABC23K#<media>`: the guest sees "Maya invited you to watch together ·
Some Film · netflix.com", the install button and "Your room is saved · ABC23K". The only two 404
answers on that load are the document itself (the fallback, intended) and `/favicon.ico` at the
domain root, which the browser asks for on its own and which is not part of this repository.

The Umami script is on `welcome/`, `uninstall/` and `feedback/` and on neither invite page
(checked against the live HTML).

## Still to fill in

- **The Google Form ids.** `FORM_ID` and the `entry.*` constants at the bottom of `uninstall/` and
  `feedback/` are empty, so both pages thank the reader and send nothing. Fill them from each
  form's pre-filled link (⋮ → "Get pre-filled link").
- **The privacy link.** The policy lives on `https://pinwisp.com/watch-party/privacy/` and is not
  published yet; the footers link to the issue tracker only until it is.
- **The store id** in `j/index.html` (`EXT_IDS`, and the "Add to Chrome" button's address): both are
  known only after the first upload to the dashboard.
