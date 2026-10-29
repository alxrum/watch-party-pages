#!/usr/bin/env node
// Renders the two welcome illustrations (tools/shots.html) to welcome/steps-1-2.png and
// welcome/step-3.png at 2x, with Chrome for Testing and puppeteer-core from the extension repo:
//   export PATH="/opt/homebrew/Cellar/node@22/22.23.3_1/bin:$PATH" && node tools/render-shots.js
'use strict';
const path = require('path');
const EXT = path.resolve(__dirname, '../../watch-party');
const { launch } = require(path.join(EXT, 'tools/e2e/run.js'));
(async () => {
  const b = await launch();
  const p = await b.newPage();
  await p.setViewport({ width: 720, height: 1400, deviceScaleFactor: 2 });
  await p.goto('file://' + path.join(__dirname, 'shots.html'));
  await p.evaluate(() => document.fonts.ready);
  for (const [id, file] of [['step-1', 'steps-1-2.png'], ['step-2', 'step-3.png']]) {
    const el = await p.$('#' + id);
    await el.screenshot({ path: path.join(__dirname, '..', 'welcome', file), omitBackground: true });
    const box = await el.boundingBox();
    console.log('welcome/' + file, Math.round(box.width) + 'x' + Math.round(box.height));
  }
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
