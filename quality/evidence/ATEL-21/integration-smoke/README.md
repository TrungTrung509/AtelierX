# ATEL-21 integration smoke · ATEL-1/v3

- Viewer: `http://127.0.0.1:8787/atelierx-products/products/ATEL-1/v3/index.html`
- Model: `/atelierx-products/products/ATEL-1/v3/assets/hoodie-black-one-eyed-skull-v3.glb`
- Browser: Chromium via `node tools/browser-qa.mjs`; loaded/desktop/rotated/zoomed/mobile all true; errors empty (`browser-result.json`).
- Page HTTP 200 (`text/html; charset=UTF-8`); GLB HTTP 200 (`model/gltf-binary`, 6,168,880 bytes).
- Source and copied GLB SHA-256: `e4e6de8795a341321e22d4aa852e56836fd58fab1411ee7f5590224c47ed7cb1`.
- Default viewer orbit is 180° and shows the printed back, as confirmed by the screenshot `front.png` generated with QA tool `--front-deg 180`. In this model the QA tool's `front.png` filename denotes its configured starting angle, not garment front; the opposite orbit screenshot `back.png` shows the blank pocket front.
- These are Visual Studio integration smoke captures; independent product QA retest/report and Lead quality gate remain pending. Catalog is unchanged and product remains preview.
