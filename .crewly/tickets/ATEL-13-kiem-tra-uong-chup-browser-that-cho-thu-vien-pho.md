---
id: ATEL-13
title: Kiểm tra đường chụp browser thật cho thư viện phom
status: done
priority: P1
assignee: atelierx-frontend-developer-0006
team: af30c001-2789-4f20-b917-000000000010
labels: [ atelierx, ATEL-9, visual-studio, browser-qa ]
ownerReview: false
createdAt: 2026-11-14T04:53:11.869Z
updatedAt: 2026-11-14T09:47:00.853Z
workItemId: 34121392-df64-47dd-a90a-458440f6509b
requestId: ae95d304-4335-4726-b9ed-629d1894c32f
source: request:TKT-003
---

## Description

ATEL-9 Visual Studio: kiểm tra viewer/browser thực có thể dùng trong Crewly, xác nhận đường dẫn local và thao tác tải/xoay/zoom trên desktop/mobile cho candidate hiện có; nếu browser relay không khả dụng, thử một phương án browser cục bộ đã được cài sẵn. Ghi trạng thái, lỗi thực tế và cách QA có thể chụp các góc; không deploy bên ngoài, không tuyên bố đã chạy nếu chỉ đọc source.

## Acceptance criteria

- [ ] Bàn giao bằng chứng browser thật hoặc blocker cụ thể về runner/runtime, cùng bước khôi phục hợp lệ cho QA.

## Log

- 2026-11-14T04:53:11.869Z · atelierx-team-leader-0001 · created (ready)
- 2026-11-14T04:53:26.521Z · atelierx-team-leader-0001 · assigned to atelierx-frontend-developer-0006 — WorkItem 34121392-df64-47dd-a90a-458440f6509b
- 2026-11-14T04:56:35.972Z · atelierx-frontend-developer-0006 · ATEL-13 browser thật đã chạy bằng Chromium 156.0.8078.79 (/usr/bin/chromium) và Playwright Core có sẵn. URL nội bộ http://127.0.0.1:8787/atelierx-products/quality-preview/hoodie/index.html tải GLB thành công; node tools/browser-qa.mjs xác nhận loaded/desktop/rotated/zoomed/mobile=true, errors=[] và tạo ảnh front/back/left/right/detail/mobile tại quality/evidence/ATEL-13/. Kiểm riêng cảm ứng 390x844 bằng CDP: touchRotated=true (theta 3.1416→2.4326), touchZoomed=true (radius 2.6→2.4635), errors=[]. Evidence: browser-result.json, mobile-interaction-result.json. Ảnh front cho thấy chính candidate hoodie pink có giá treo/trụ gỗ xuyên thân; báo QA lưu ý đánh giá phom riêng, không phải blocker browser. Browser relay Crewly vẫn disconnected; phương án local đã dùng được cho QA.
- 2026-11-14T09:45:59.344Z · atelierx-frontend-developer-0006 · ATEL-13 hoàn tất kiểm tra đường browser thật: Chromium 156 local + Playwright chạy viewer quality-preview ở http://127.0.0.1:8787/atelierx-products/quality-preview/hoodie/index.html; tải/xoay/zoom desktop và touch mobile 390x844 đạt, errors=[]; đã lưu 6 PNG và JSON tương tác tại quality/evidence/ATEL-13/. QA trực tiếp xác nhận ảnh hiện tại cho thấy giá đỡ xuyên/che hoodie, nên hình ảnh chưa đạt đánh giá phom; base mesh grab3d-hoodie-candidate-v1 còn candidate, chưa được duyệt. Cần Designer/chủ viewer tách/ẩn giá đỡ ở revision mới, QA chụp lại; Lead quyết định trạng thái.
- 2026-11-14T09:47:00.853Z · crewly · WorkItem 34121392-df64-47dd-a90a-458440f6509b verified → done
