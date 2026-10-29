#!/usr/bin/env bash
# The invite page is served from two places: j/index.html for /j/ itself, and 404.html for
# /j/<CODE>, which is not a file. This copies the first over the second, keeping the header comment.
set -euo pipefail
cd "$(dirname "$0")/.."
python3 - <<'PY'
src = open('j/index.html', encoding='utf-8').read()
old = open('404.html', encoding='utf-8').read()
head = old.split('-->', 1)[0] + '-->'
open('404.html', 'w', encoding='utf-8').write(src.replace('<!doctype html>', head, 1))
PY
echo "404.html <- j/index.html"
