# ATEL-26 — viewer scaffold evidence (draft only)

- Internal URL: `http://127.0.0.1:8787/atelierx-products/products/ATEL-23/v1/index.html`
- Viewer created with `node tools/create-product-viewer.mjs ATEL-23 v1`, then updated for Vietnamese content and studio mannequin.
- Model currently shown: full-body `mannequin-180cm-v1.glb` only; SHA-256 `da6d3e8ddf25e31a0b20242852a1f9757661fa8115fde0d0800ff5cc715355e9`.
- Vietnamese text/art preview loaded from same-order `content.json` and `assets/artwork/atel23-cityline-microprint-v1.svg`. Source hashes: content `34319660f8839af5018add2ad918dc361933b4e691d2bc2b014b7e9547622c4b`; SVG `1538d63898f31b2682cf136275e55383ae890667581c51cd6a44ffd3ed198d99`.
- Browser smoke on scaffold: page/model HTTP 200; loaded/rotated/zoomed desktop/mobile true; errors empty. Front/back buttons set camera orbit 0°/180°. Content is rendered with 3 paragraphs, 5 details and artwork preview.
- Captures are scaffold-only: no shirt geometry or final material. Do not use these for fit/product QA or final delivery; replace them with final-revision captures after UV garment, fit.json and material hashes align.
- Dependencies pending: Designer UV garment revision + fit.json; Material handoff referencing that exact garment SHA. Catalog is unchanged; no product display GLB exists yet.
