---
id: ATEL-6
title: Ki?m tra m?u hoodie ATEL-1
status: done
priority: P2
assignee: atelierx-qa-0004
team: null
labels: [ atelierx, ATEL-1 ]
ownerReview: false
createdAt: 2026-11-13T13:11:54.143Z
updatedAt: 2026-11-13T13:37:58.488Z
workItemId: bc61322a-109f-4cac-8efd-602c0919f3e4
requestId: null
source: owner
---

## Description

Ki?m b?n d?ng ATEL-2 v? viewer ATEL-3: ??ng phom hoodie ?en, ??u l?u ??ng m?t l?ng, kh?ng b? l?t/c?t, xoay ???c; b?o l?i c? th? ho?c ??t theo revision.

## Acceptance criteria

- [ ] C? k?t qu? c? th? g?n ATEL-1 v? revision.
- [ ] B?n giao b?ng ti?ng Vi?t trong channel AtelierX.

## Log

- 2026-11-13T13:11:54.143Z · owner · created (ready)
- 2026-11-13T13:11:54.260Z · owner · assigned to atelierx-qa-0004 — WorkItem bc61322a-109f-4cac-8efd-602c0919f3e4
- 2026-11-13T13:15:33.492Z · atelierx-qa-0004 · QA ATEL-1 / ATEL-2 v1: KHÔNG ĐẠT. Texture skull upright, centered with margins, nhưng có hai hốc mắt (không đáp ứng “đầu lâu một mắt”). GLB có header/version 2/length khớp; test generator 2/2 pass; HTTP 200 cho viewer, GLB và texture; validator report hiện có 0 errors/warnings. Chưa xác minh render/xoay/zoom/clipping trong browser: remote-browser relay không kết nối, desktop scan không có browser. Form là procedural MVP, chưa có base mesh hoodie đã duyệt nên chưa thể xác nhận đúng phom sản xuất. Bằng chứng: site-atel-1/dist/assets/models/ATEL-2/v1/{hoodie-skull-v1.glb,hoodie-back-skull-texture-v1.png,asset-manifest.json}; viewer site-atel-1/dist/index.html. Đề xuất sửa artwork thành một mắt và thực hiện browser QA khi có browser kết nối.
- 2026-11-13T13:37:58.488Z · crewly · WorkItem bc61322a-109f-4cac-8efd-602c0919f3e4 verified → done
