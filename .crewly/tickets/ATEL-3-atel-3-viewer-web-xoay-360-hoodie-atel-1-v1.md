---
id: ATEL-3
title: "ATEL-3: Viewer web xoay 360 hoodie ATEL-1 v2"
status: done
priority: P2
assignee: atelierx-frontend-developer-0006
team: null
labels: [ atelierx, ATEL-1, viewer ]
ownerReview: false
createdAt: 2026-11-13T12:49:05.992Z
updatedAt: 2026-11-13T18:43:37.433Z
workItemId: 03c70376-71f9-45d4-92ce-473ab4c41548
requestId: null
source: agent:atelierx-team-leader-0001
---

## Description

Goal: tích hợp trang viewer hoodie ATEL-1 revision v2. Expected outcome: trang HTML tĩnh tiếng Việt trỏ đúng GLB v2, mở ở mặt lưng, có điều khiển xoay/zoom và trạng thái tải/lỗi; source, manifest và local HTTP được kiểm tra. Browser render/xoay/zoom và screenshot thuộc ticket QA ATEL-8; phát hành URL thuộc Lead. Viewer bàn giao phần tích hợp đã kiểm được, ghi rõ giới hạn runtime, không tuyên bố browser pass.

## Acceptance criteria

- [x] Trang site-atel-1/dist/index.html dùng assets/models/ATEL-2/v2/hoodie-skull-v2.glb và trang/GLB tải được qua local HTTP.
- [x] Source viewer mở ở lưng áo, có loading/error tiếng Việt, khai báo điều khiển xoay/zoom và cảm ứng; nhãn hiển thị revision v2. Kiểm tương tác thực thuộc QA ATEL-8.
- [x] Bàn giao kết quả tích hợp và giới hạn browser cho QA/Lead, không tuyên bố đã render hay xoay/zoom trong browser.

## Log

- 2026-11-13T12:49:05.992Z · atelierx-team-leader-0001 · created (backlog)
- 2026-11-13T12:49:08.930Z · atelierx-team-leader-0001 · assigned to atelierx-frontend-developer-0006 — WorkItem 385b2ee2-078e-4fd4-9747-d2032d9f08b6
- 2026-11-13T12:50:32.920Z · atelierx-frontend-developer-0006 · Viewer shell created at site-atel-1/dist/index.html with Vietnamese loading/error states, back-facing initial orbit, and model-viewer drag/pinch/scroll controls. Required GLB is still absent (ATEL-2 in_progress), so visual QA and desktop/mobile screenshots remain pending; URL resolves to /assets/models/ATEL-2/v1/hoodie-skull-v1.glb.
- 2026-11-13T12:58:17.548Z · atelierx-team-leader-0001 · in_progress → ready — Blocker reviewed: ATEL-2 GLB is now available; retry ATEL-3 with real asset and correct served path.
- 2026-11-13T12:58:20.845Z · atelierx-team-leader-0001 · assigned to atelierx-frontend-developer-0006 — WorkItem 300347c1-475e-4a6e-b97d-42d64228b3ca
- 2026-11-13T13:00:55.434Z · atelierx-frontend-developer-0006 · Đã cập nhật model URL thành ./assets/models/ATEL-2/v1/hoodie-skull-v1.glb. Phân tích GLB v2 xác nhận torso trước ở Z dương (trơn), panel in sau ở Z âm; chỉnh camera-orbit mặc định sang 180deg 82deg 2.6m để nhìn lưng. Kiểm tra HTTP local trả 200 cho HTML và GLB; parser xác nhận GLB hợp lệ 167080 bytes. Chrome/Chromium hoặc browser tool không có trong runtime nên chưa thể xác nhận model render/interaction, desktop/mobile screenshot; cần fallback QA của lead hoặc browser runner.
- 2026-11-13T13:02:44.374Z · atelierx-frontend-developer-0006 · Đã tìm thấy cache Playwright Chromium nhưng không chạy được: binary thiếu libglib-2.0.so.0; không cài thư viện theo chỉ dẫn. Chrome live-attach fallback không thể gọi vì chỉ có SKILL.md, thiếu execute.sh; không có browser tool trong runtime. Do đó chưa có screenshot desktop/mobile hoặc xác nhận render/interaction; giữ task chờ browser runner do lead kiểm tra. Path ./assets/models/... và góc lưng 180° giữ nguyên.
- 2026-11-13T13:38:22.467Z · atelierx-team-leader-0001 · in_progress → ready — ATEL-2/v2 is now available. Reopen to update viewer URL to v2 and verify local shell/path. Runtime browser QA remains blocked pending browser connection or owner authorization for system runtime packages.
- 2026-11-13T13:38:31.173Z · atelierx-team-leader-0001 · updated title, description, acceptance criteria — Revised to use the new canonical ATEL-2/v2 single-eye asset; runtime QA remains required.
- 2026-11-13T13:38:41.040Z · atelierx-team-leader-0001 · delegated by atelierx-team-leader-0001
- 2026-11-13T13:38:41.040Z · atelierx-team-leader-0001 · assigned to atelierx-frontend-developer-0006 — WorkItem 0a669a3f-b7a8-4945-a6be-ea3be82509a7
- 2026-11-13T13:40:11.714Z · atelierx-frontend-developer-0006 · ATEL-3 v2 local integration: index.html src updated to ./assets/models/ATEL-2/v2/hoodie-skull-v2.glb; no model/asset files changed. Local HTTP verification: GET / => 200 text/html (3984 bytes); GET /assets/models/ATEL-2/v2/hoodie-skull-v2.glb => 200 model/gltf-binary (167492 bytes); GLB v2 header/JSON and v2 manifest verified. Source checks passed for Vietnamese loading/error states, 180deg back-facing initial orbit, camera-controls and touch-action. Runtime browser QA remains blocked: cached Chromium has missing system libraries including libglib-2.0.so.0, libnss3.so, libX11.so.6 and others; no browser runner connected. Desktop/mobile render, real rotation/zoom and screenshots not verified.
- 2026-11-13T13:40:35.242Z · atelierx-team-leader-0001 · in_progress → ready — Local integration to ATEL-2/v2 passed. Waiting on real browser runner or owner decision to install required Chromium runtime libraries. Desktop/mobile render, rotation/zoom and screenshots remain unverified; ticket returned to ready until QA can run.
- 2026-11-13T17:58:05.241Z · atelierx-team-leader-0001 · QA ATEL-8 found the viewer source still shows title/badge v1/REVISION 01 although model URL is v2. Confirmed this by source review. FE agent is idle but usage-limited until 18:22Z; ticket remains ready and blocked on browser QA. Next UI correction: update visible title/badge to v2 before browser retest; no task dispatched while FE is usage-limited.
- 2026-11-13T18:41:16.199Z · atelierx-team-leader-0001 · assigned to atelierx-frontend-developer-0006 — WorkItem 03c70376-71f9-45d4-92ce-473ab4c41548
- 2026-11-13T18:42:11.927Z · atelierx-frontend-developer-0006 · Đã sửa nhãn viewer để đồng bộ revision: title Hoodie ATEL-1 · v2 và badge REVISION 02; không thay đổi GLB/model. Local verification pass: GET / => 200 text/html (3984 bytes); GET /assets/models/ATEL-2/v2/hoodie-skull-v2.glb => 200 model/gltf-binary (167492 bytes); manifest/GLB v2, source URL, loading/error tiếng Việt, camera-orbit 180deg và camera-controls/touch-action đều pass. Browser QA vẫn blocked: Chromium local thiếu libglib-2.0.so.0, libnss3.so và nhiều system libs; render desktop/mobile, xoay/zoom và screenshots chưa xác nhận.
- 2026-11-13T18:43:37.433Z · atelierx-team-leader-0001 · in_progress → done — Viewer v2 local integration verified: HTML/GLB HTTP 200, correct v2 labels and source. Browser interaction QA remains in ATEL-8; no runtime pass claimed.
