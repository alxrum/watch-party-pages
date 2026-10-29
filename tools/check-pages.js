#!/usr/bin/env node
// Loads every page in real Chrome and reports console errors, failed requests and a screenshot.
//   export PATH="/opt/homebrew/Cellar/node@22/22.23.3_1/bin:$PATH" && node tools/check-pages.js
'use strict';
const path = require('path');
const fs = require('fs');
const EXT = path.resolve(__dirname, '../../watch-party');
const { launch } = require(path.join(EXT, 'tools/e2e/run.js'));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(__dirname, 'shots-out');

const PAGES = [
  ['welcome', 'welcome/index.html', ''],
  ['uninstall', 'uninstall/index.html', ''],
  ['feedback', 'feedback/index.html', ''],
  ['invite-404', '404.html', ''],
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await launch();
  let bad = 0;
  for (const [name, file] of PAGES) {
    const p = await b.newPage();
    const errors = [], failed = [];
    p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    p.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
    p.on('requestfailed', (r) => failed.push(r.url() + ' — ' + (r.failure() || {}).errorText));
    await p.setViewport({ width: 900, height: 900, deviceScaleFactor: 2 });
    await p.goto('file://' + path.join(ROOT, file), { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 800));
    await p.screenshot({ path: path.join(OUT, name + '.png'), fullPage: true });
    // The Umami and Google Fonts requests fail from file:// in a sandbox; only same-origin failures count.
    const local = failed.filter((u) => !/cloud\.umami\.is|fonts\.(googleapis|gstatic)\.com/.test(u));
    const ok = errors.length === 0 && local.length === 0;
    if (!ok) bad++;
    console.log(`${ok ? 'OK  ' : 'FAIL'} ${name}: ${errors.length} console error(s), ${local.length} failed local request(s)`);
    errors.forEach((e) => console.log('      console: ' + e));
    local.forEach((e) => console.log('      request: ' + e));
    await p.close();
  }
  await b.close();
  process.exit(bad ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
