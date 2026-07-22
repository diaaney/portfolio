# Portfolio references

This directory keeps source material for Diane's new portfolio. It is separate from the active Next.js app in the repository root.

## Point + Talk

`point-n-talk/index.html` is the original HTML response from <https://diana.lu/point-n-talk>. `point-n-talk/offline.html` points directly linked images, scripts, and videos to files under `point-n-talk/assets/`. `point-n-talk/manifest.json` records each asset's original URL and checksum. The archived page is a reference snapshot of a Framer site, not its editable Framer project.

Run `python mirror_site.py` from this directory to refresh the snapshot. Open `point-n-talk/offline.html` through a local HTTP server if you want to review it in a browser.

## Previous portfolio

`old-portfolio.zip` is an archive of [diaaney/portfolio](https://github.com/diaaney/portfolio) on its `master` branch at commit `e7436064d707cd3d82c5275b7dcc066508d6a8b0`. The extracted source is in `old-portfolio/portfolio-master/`.
