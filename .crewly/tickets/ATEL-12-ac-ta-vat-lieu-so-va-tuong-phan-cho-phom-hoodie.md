---
id: ATEL-12
title: Đặc tả vật liệu số và tương phản cho phom hoodie
status: done
priority: P1
assignee: atelierx-backend-developer-0005
team: af30c001-2789-4f20-b917-000000000010
labels: [ atelierx, ATEL-9, material ]
ownerReview: false
createdAt: 2026-11-14T04:52:59.470Z
updatedAt: 2026-11-14T09:47:42.893Z
workItemId: 1f981925-3709-48e9-9e6f-3b1843b386a2
requestId: ae95d304-4335-4726-b9ed-629d1894c32f
source: request:TKT-003
---

## Description

ATEL-9 Material Specialist: đọc các material slots đang có của ứng viên hoodie, đề xuất thông số số hóa cho vải đen và vùng in tương phản; lập swatch sáng/tối và tiêu chí giữ nếp/phom đọc được. Có thể dùng candidate hiện có để thử; không sửa GLB hoặc viewer.

## Acceptance criteria

- [ ] Bàn giao material spec có slot, màu, roughness/normal nếu phù hợp, vùng in và ảnh/swatches hoặc fallback rõ ràng.

## Log

- 2026-11-14T04:52:59.470Z · atelierx-team-leader-0001 · created (ready)
- 2026-11-14T04:53:26.105Z · atelierx-team-leader-0001 · assigned to atelierx-backend-developer-0005 — WorkItem 1f981925-3709-48e9-9e6f-3b1843b386a2
- 2026-11-14T04:54:55.950Z · atelierx-backend-developer-0005 · NHẬN VIỆC trong thread ATEL-9 #general; messageId dc510e3c-a128-4fa7-a593-eb8465b73490. Chờ Lead xác nhận hợp đồng đầu việc trước khi bắt đầu thực thi theo acceptance protocol.
- 2026-11-14T09:46:07.355Z · atelierx-backend-developer-0005 · Hoàn tất đọc slot hoodie_body_pbr và map; tạo spec/swatches ATEL-12/v1. Ứng viên Grab3D vẫn candidate, không có slot print riêng hoặc vùng in được duyệt; bàn giao vùng in/UV cho Designer xác nhận.
- 2026-11-14T09:46:46.025Z · atelierx-backend-developer-0005 · BÀN GIAO channel AtelierX thread ATEL-9: messageId 83a9c377-d8e0-4bab-b7d4-8532527d85c1. Artifact ATEL-12/v1 spec + SVG swatch. Ứng viên vẫn candidate; Designer/QA cần xác nhận UV/vùng in trên phom được chọn.
- 2026-11-14T09:47:42.893Z · crewly · WorkItem 1f981925-3709-48e9-9e6f-3b1843b386a2 verified → done
