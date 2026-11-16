# ATEL-53 checkpoint — surface/content ready, viewer released

Updated: 2026-11-16 UTC

## Current gate

- QA shape PASS: `owner-shirt-v1.2-gray`, GLB SHA-256 `4c9e01ed516f454a96a29fd9f7e7081d659988d1fce536395575cc3b3ce3bc9c`; QA report `quality/reports/ATEL-53/owner-shirt-v1.2-gray.json`.
- Material surface: `owner-shirt-v1.2-surface-v1`, GLB SHA-256 `bc15ebd82d9b4ca3ddbdd3d7792f139313cf37687895a462b8c86ad5aa42793b`; manifest `orders/ATEL-53/owner-shirt-v1.2-surface-v1/material/surface.json`, SHA-256 `b177b5556649e9f03d045bde53a422cf3daf9cb6ba61e518572369569f123160`. All 11 manifest artifacts rechecked successfully. Source shape preserved.
- Research content for the same revision: JSON SHA-256 `7b5767dafa2b2678f74ebca50cb97ae685d3a81fea6ee8b87884067f43692593`; manifest SHA-256 `82bb048e967b149b3e09a1fae9d59e58c7240c19fb8526d9b1bc46bf5c12d8b3`. All 10 manifest artifact hash/byte checks pass; studio-flow content event recorded.
- Released/reassigned existing ATEL-57 WorkItem `6d973122-6736-4f0b-acdc-bae085e5c56c` to Designer to begin viewer integration (15-minute ETA from start). No new task created.
- QA WorkItem `92ff0d6b-d686-441f-889e-55756bafa5a2` remains waiting for viewer evidence/handoff. No final QA verdict yet; do not publish or mark complete.

## Surface evidence files

- `orders/ATEL-53/owner-shirt-v1.2-surface-v1/evidence/front.png`
- `orders/ATEL-53/owner-shirt-v1.2-surface-v1/evidence/back.png`
- `orders/ATEL-53/owner-shirt-v1.2-surface-v1/evidence/side.png`
- `orders/ATEL-53/owner-shirt-v1.2-surface-v1/evidence/oblique.png`
- `orders/ATEL-53/owner-shirt-v1.2-surface-v1/evidence/top.png`
- `orders/ATEL-53/owner-shirt-v1.2-surface-v1/evidence/bottom.png`
- `orders/ATEL-53/owner-shirt-v1.2-surface-v1/evidence/collarCloseup.png`
- `orders/ATEL-53/owner-shirt-v1.2-surface-v1/evidence/placketSideCloseup.png`
- `orders/ATEL-53/owner-shirt-v1.2-surface-v1/evidence/cuffLeftCloseup.png`
- `orders/ATEL-53/owner-shirt-v1.2-surface-v1/evidence/cuffRightCloseup.png`

Garment remains standalone with no mannequin. Visual must hand off actual current revision evidence and hash before QA final review.

## Visual handoff review note — 2026-11-16 03:49 UTC

Visual WorkItem `6d973122-6736-4f0b-acdc-bae085e5c56c` has delivered the viewer at `http://127.0.0.1:8787/atelierx-products/products/ATEL-53/v1.2-surface-v1/index.html`; visual manifest SHA-256 reported as `60e3b5e25381d08ca9769a5c5c69cdda56748831a20c5ab7527b3f5361755eeb`. All 25 listed artifact entries pass `sha256sum -c`, with display GLB matching surface source SHA.

Lead found one internal manifest reference mismatch before QA release: `closeups.captureResult.sha256` in `orders/ATEL-53/v1/visual/visual-manifest.json` is `0a234f84ac421d9ae4d2d5498fcbd95b1543b4e99600b00b3a60f43a67c092a2`, but the actual `orders/ATEL-53/v1/visual/evidence/closeup-result.json` SHA-256 is `4df916b65d19eed975d6e84c9f8542172c6651a16ee451e7d4864a29fa968fb9` (also the value in the manifest artifact list). Designer was asked to correct this nested checksum and refresh the same visual handoff on ATEL-57. QA WorkItem remains held at `studio-wait: visual` until corrected manifest is re-verified and released. No QA-final verdict, publish, catalog update, or completion yet.

## Visual manifest corrected and rechecked — 2026-11-16 03:52 UTC

Designer updated the nested closeup result digest and re-registered visual stage on the same ATEL-57. Current manifest SHA-256: `cced31754818126905e37733027ef5025e69cc0e348f9db57de372612c674dd2`. Verified all 25 listed artifact hashes/bytes; nested `browserQa.sha256` and `closeups.captureResult.sha256` now equal the actual evidence-file hashes. Surface/display GLB is unchanged at SHA-256 `bc15ebd82d9b4ca3ddbdd3d7792f139313cf37687895a462b8c86ad5aa42793b`. Existing QA WorkItem was released/reassigned for final review. QA decision is pending; no publish or completion.
