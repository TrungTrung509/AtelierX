---
id: ATEL-21
title: "ATEL-21: Tích hợp viewer Sàn trưng bày cho ATEL-1/v3"
status: done
priority: P1
assignee: atelierx-frontend-developer-0006
team: null
labels: [ atelierx, ATEL-1, viewer, integration ]
ownerReview: false
createdAt: 2026-11-14T16:12:13.135Z
updatedAt: 2026-11-14T16:18:10.805Z
workItemId: 287172a4-d2d1-4bdf-90a1-ce8775c387b4
requestId: null
source: agent:atelierx-team-leader-0001
---

## Description

Goal: tích hợp ATEL-1/v3 product GLB vào viewer nội bộ Sàn trưng bày AtelierX ở `showcase/products/ATEL-1/v3/`.

Expected outcome: trang viewer mở đúng GLB SHA `e4e6de8795a341321e22d4aa852e56836fd58fab1411ee7f5590224c47ed7cb1`; mặc định xem mặt lưng có đầu lâu; xoay/zoom được; asset/page trả HTTP 200. Nội dung, viewer và model có nhãn ATEL-1/v3. URL dự kiến `/atelierx-products/products/ATEL-1/v3/index.html`.

Input đã kiểm: `quality/evidence/ATEL-1/v3/hoodie-black-one-eyed-skull-v3.glb`; profile/manifest/captures ở cùng `quality/evidence/ATEL-1/v3/`. Base G1: `grab3d-hoodie-clean-v2-neckfix-placement-v3`, geometry SHA `34374edd321b7e8396656e7d5a003e359d9349c5cc35bb5bc37a5c99145141bf`.

Out of scope: không đổi `showcase/catalog.json`, không đánh dấu complete, không deploy bên ngoài, không sửa GLB/artwork/material/QA report/base-mesh registry.

Evidence needed: viewer/index file, model copied to `showcase/products/ATEL-1/v3/`, URL/path checks, HTTP response for page and GLB, SHA of copied model matches input. Gửi QA retest và Lead; giữ trạng thái preview.

## Acceptance criteria

- [ ] Viewer trong showcase/products/ATEL-1/v3 trỏ đúng GLB có SHA e4e6de8795a341321e22d4aa852e56836fd58fab1411ee7f5590224c47ed7cb1, không dùng GLB khác revision.
- [ ] Trang hiển thị mã/revision ATEL-1/v3, mặc định mặt lưng, hỗ trợ xoay/zoom, trang và GLB trả HTTP 200.
- [ ] Không sửa catalog hoặc đổi status; bàn giao đường dẫn, source GLB SHA, copied SHA và evidence HTTP cho QA/Lead.

## Log

- 2026-11-14T16:12:13.135Z · atelierx-team-leader-0001 · created (ready)
- 2026-11-14T16:12:21.027Z · atelierx-team-leader-0001 · assigned to atelierx-frontend-developer-0006 — WorkItem 287172a4-d2d1-4bdf-90a1-ce8775c387b4
- 2026-11-14T16:13:01.203Z · atelierx-team-leader-0001 · GIAO VIỆC đăng trong thread ATEL-1 messageId aad86830-5445-46a7-9bb0-5ec9e9c138cc. WorkItem 287172a4-d2d1-4bdf-90a1-ce8775c387b4 confirmed running with atelierx-frontend-developer-0006.
- 2026-11-14T16:14:40.443Z · atelierx-frontend-developer-0006 · ATEL-21/v3 tích hợp hoàn tất: viewer showcase/products/ATEL-1/v3/index.html, model assets/hoodie-black-one-eyed-skull-v3.glb. Source/copied SHA khớp e4e6de8795a341321e22d4aa852e56836fd58fab1411ee7f5590224c47ed7cb1; HTTP page và GLB 200. Browser smoke: loaded/rotated/zoomed desktop/mobile true, errors=[]; mặc định camera 180° là mặt lưng có hình. Captures quality/evidence/ATEL-21/integration-smoke/; catalog không sửa, giữ preview. Cần QA độc lập retest/report tiếp theo.
- 2026-11-14T16:15:08.097Z · atelierx-frontend-developer-0006 · BÀN GIAO channel ATEL-1 root 5434deb6-21a5-4b0d-acd0-955c5299213e; messageId fad1aa7c-559e-4346-b987-8e38ec345c88. Đã báo QA (atelierx-qa-0004) retest viewer tích hợp và ghi v3 report. Smoke evidence quality/evidence/ATEL-21/integration-smoke/.
- 2026-11-14T16:17:57.341Z · crewly · WorkItem 287172a4-d2d1-4bdf-90a1-ce8775c387b4 verified → done
- 2026-11-14T16:18:10.805Z · atelierx-team-leader-0001 · Lead verify hoàn tất: WorkItem verify ATEL-21 accepted. Official viewer route/model HTTP 200; browser QA script loaded/rotated/zoomed/desktop/mobile true, errors empty; copied GLB SHA matches source e4e6de8795a341321e22d4aa852e56836fd58fab1411ee7f5590224c47ed7cb1. Smoke captures quality/evidence/ATEL-21/integration-smoke. Catalog updated by Lead to v3 preview; QA final ATEL-22 now running.
