---
id: ATEL-8
title: "ATEL-8: QA retest hoodie ATEL-1 revision v2"
status: done
priority: P2
assignee: atelierx-qa-0004
team: null
labels: [ atelierx, ATEL-1, ATEL-2, ATEL-3, QA, revision ]
ownerReview: false
createdAt: 2026-11-13T13:41:29.172Z
updatedAt: 2026-11-14T11:00:50.351Z
workItemId: 44cc6a85-e34d-452c-855b-fa6b7e1793d2
requestId: 259a99ed-9162-493c-88f3-fdf548040411
source: request:TKT-002
---

## Description

Goal: kiểm sản phẩm ATEL-1 v2 trong Sàn trưng bày của web Crewly. Expected outcome: phiếu QA tiếng Việt gắn revision v2, xác nhận catalog, iframe viewer, GLB/front/back, thao tác xoay/zoom trên desktop và mobile; gửi trong thread đơn #general. Không kiểm Sites hoặc URL deploy. Nếu chưa có browser runner, ghi blocker riêng cho bước browser và không tuyên bố pass.

## Acceptance criteria

- [ ] Report ATEL-2/v2 theo từng tiêu chí, kèm evidence paths/commands.
- [ ] Viewer source/local HTTP chỉ được báo đúng những gì đã kiểm; browser desktop/mobile render, rotation/zoom và screenshot chưa xác minh thì ghi blocker rõ ràng.
- [ ] Bàn giao tiếng Việt trong đúng thread #general của ATEL-1, không top-level.

## Log

- 2026-11-13T13:41:29.172Z · atelierx-team-leader-0001 · created (ready)
- 2026-11-13T13:41:44.681Z · atelierx-team-leader-0001 · delegated by atelierx-team-leader-0001
- 2026-11-13T13:41:44.681Z · atelierx-team-leader-0001 · assigned to atelierx-qa-0004 — WorkItem 3637aa93-09d7-4560-ad15-2d14cfd45289
- 2026-11-13T13:50:04.485Z · atelierx-qa-0004 · ATEL-2/v2 static QA: one open eye, centered/upright/safe margins, front torso untextured; v2 manifest/GLB consistent, embedded texture matches sidecar; generator tests 3/3 pass and Khronos report 0 errors/warnings/infos. Temporary local HTTP returned 200 for viewer, GLB, PNG and manifest. Viewer source points to v2, but page title and badge still show v1 / REVISION 01 (Visual Studio follow-up). Runtime browser desktop/mobile, rotate/zoom, actual screenshot BLOCKED: Crewly relay disconnected/clientCount 0, desktop app/CDP scan empty, agent-browser missing; computer-use unsupported on Linux. Schematic PNGs are not browser captures. Procedural MVP; no approved base hoodie mesh, physical fit unverified. QA report: site-atel-1/evidence/ATEL-2/v2/qa-ATEL-8-v2.md. WorkItem blocked for runtime QA.
- 2026-11-13T17:54:55.915Z · atelierx-qa-0004 · ATEL-8 report đăng trong thread #general: messageId 43244e6b-dc44-426e-b6a8-1879cb1252cb. File attachment không gửi được: machine chưa đăng nhập Crewly Cloud; report vẫn có trong workspace tại site-atel-1/evidence/ATEL-2/v2/qa-ATEL-8-v2.md, nội dung summary đã đăng kèm path. WorkItem được báo blocked cho browser runtime; asset/path checks hoàn tất.
- 2026-11-13T18:44:49.993Z · atelierx-team-leader-0001 · in_progress → backlog — QA tĩnh v2 đã bàn giao. Phần browser render/xoay/zoom đang chờ browser runner; không retry cùng môi trường thiếu thư viện. Chỉ mở lại khi có runner hoặc phương án kiểm thực tế.
- 2026-11-14T10:15:46.896Z · atelierx-team-leader-0001 · Studio Lead đã chạy local browser QA tại http://127.0.0.1:8787/atelierx-products/products/ATEL-1/v2/index.html; loaded/rotated/zoomed/desktop/mobile=true, errors=[]; ảnh front/back/left/right/detail/mobile mới ở quality/evidence/ATEL-3/ATEL-1-v2/. Relay Chrome vẫn disconnected; QA cần tự rà ảnh, xác nhận họa tiết chỉ ở lưng và lập phiếu đúng revision.
- 2026-11-14T10:15:51.125Z · atelierx-team-leader-0001 · backlog → ready — Có bằng chứng local Chromium thực; QA có thể kiểm revision v2 ngay, không còn blocker browser runner.
- 2026-11-14T10:15:56.477Z · atelierx-team-leader-0001 · assigned to atelierx-qa-0004 — WorkItem 44cc6a85-e34d-452c-855b-fa6b7e1793d2
- 2026-11-14T10:17:08.450Z · atelierx-qa-0004 · QA đã claim WorkItem; NHẬN VIỆC trong thread ATEL-1 #general, messageId 8681a1a4-4607-4851-b654-2920ef80ee01. Phạm vi xác nhận: kiểm catalog/viewer/GLB và browser desktop/mobile, lập report v2; đã yêu cầu Lead xác nhận hiểu đúng hợp đồng trước khi bắt đầu kiểm.
- 2026-11-14T10:18:56.279Z · atelierx-team-leader-0001 · GIAO VIỆC QA v2 trong thread gốc #general; messageId=298e03a6-c92d-4f1e-9695-86c1fba199ba. Capture local Chromium tại quality/evidence/ATEL-3/ATEL-1-v2/; QA được giao independent retest same revision. Watch/fallback đã lập để verify output.
- 2026-11-14T10:21:30.050Z · atelierx-qa-0004 · QA bàn giao ATEL-1/v2 trong thread #general, messageId 5fdd1f83-4d67-4f66-bba4-d7c1733aaf45. Report: quality/reports/ATEL-1/v2.json; ảnh Chromium mới: quality/evidence/ATEL-8/ATEL-1-v2/. Browser load/rotate/zoom desktop/mobile đạt; artwork đúng mặt sau/front trơn. Tổng thể TRẢ LẠI/giữ preview do mesh procedural chưa approved, silhouette 3/5, construction 2/5; statusLabel còn ghi chờ browser; iframe wrapper không được kiểm riêng. Catalog/status không bị sửa.
- 2026-11-14T11:00:50.351Z · crewly · WorkItem 44cc6a85-e34d-452c-855b-fa6b7e1793d2 verified → done
