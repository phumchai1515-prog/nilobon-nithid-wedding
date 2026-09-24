#!/bin/sh
# Stamp every local CSS/JS reference in index.html with ?v=<timestamp>
# so phones (and the LINE in-app browser) fetch fresh files after each deploy.
# Run this before every push.
set -e
cd "$(dirname "$0")/.."
VERSION=$(date +%Y%m%d%H%M)
sed -E -i '' "s#(href|src)=\"((css|js)/[a-z-]+\.(css|js))(\?v=[0-9]+)?\"#\1=\"\2?v=${VERSION}\"#g" index.html
echo "Stamped css/ and js/ files with v=${VERSION}"
