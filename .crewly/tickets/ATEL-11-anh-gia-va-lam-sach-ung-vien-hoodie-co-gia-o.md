---
id: ATEL-11
title: Đánh giá và làm sạch ứng viên hoodie có giá đỡ
status: done
priority: P1
assignee: atelierx-designer-0003
team: af30c001-2789-4f20-b917-000000000010
labels: [ atelierx, ATEL-9, designer, base-mesh ]
ownerReview: false
createdAt: 2026-11-14T04:52:59.242Z
updatedAt: 2026-11-14T10:12:43.716Z
workItemId: f157b771-c1b4-48ad-9302-91260f50bfd1
requestId: ae95d304-4335-4726-b9ed-629d1894c32f
source: request:TKT-003
---

## Description

ATEL-9 Designer: kiểm tra candidate grab3d-hoodie-candidate-v1, nơi giá đỡ xuyên lưng và mesh/giá đỡ gộp primitive. Xác định có thể tách/bỏ an toàn và giữ UV vùng in hay không; nếu có, tạo bản candidate revision mới với source/checksum/preview. Nếu không, ghi rõ giới hạn và chờ Researcher tìm phom khác. Không thay đổi status approved.

## Acceptance criteria

- [ ] Bàn giao kết quả kỹ thuật có đường dẫn/revision/hash và ảnh góc lưng/UV thử, hoặc kết luận có lý do tại sao không thể tách sạch.

## Log

- 2026-11-14T04:52:59.242Z · atelierx-team-leader-0001 · created (ready)
- 2026-11-14T04:53:25.563Z · atelierx-team-leader-0001 · assigned to atelierx-designer-0003 — WorkItem f157b771-c1b4-48ad-9302-91260f50bfd1
- 2026-11-14T04:54:28.826Z · atelierx-designer-0003 · Đã claim WorkItem f157b771-c1b4-48ad-9302-91260f50bfd1. Gửi TL structured acceptance để xác nhận phạm vi theo protocol. atelierx-channel-v3 chưa thể đăng NHẬN VIỆC: list-channels trả channels=[]; đã báo TL và xin thread root messageId. Chưa sửa asset.
- 2026-11-14T04:55:55.832Z · atelierx-designer-0003 · NHẬN VIỆC đăng trong thread ATEL-9, messageId 62b41c6e-dbb2-4cc0-b5eb-3de32c8e9555. TL xác nhận phạm vi: phân tích/tách thử trên bản sao; dừng nếu loại stand làm hỏng UV. WorkItem claim hiện tại f157b771-c1b4-48ad-9302-91260f50bfd1.
- 2026-11-14T09:55:34.938Z · atelierx-designer-0003 · Đang phân tích cấu trúc GLB và UV; xác nhận mesh có primitive duy nhất nhưng nhiều component hình học rời, sẽ thử lọc trên bản sao và kiểm preview browser trước khi quyết định.
- 2026-11-14T10:04:19.173Z · atelierx-designer-0003 · Bàn giao `grab3d-hoodie-clean-v2` để Lead/QA xem xét; sha256 42dc0075e632eab84256f71d9cc88b6eb6d54d04cbff3682f548f62e55994a13. Browser capture đủ front/back/left/right/detail/mobile, UV checker back ở quality/evidence/ATEL-11/v2/. Handoff team channel messageId a3a62e3f-ec63-4a1f-9b3a-9b9c2511fab1. Channel post thành công nhưng file attachments không gửi do máy chưa đăng nhập Crewly Cloud; mọi đường dẫn artifact đã nằm trong nội dung post và ở workspace dùng chung. Giữ status candidate; còn vệt nhỏ gần cổ/vai và cần QA độc lập.
- 2026-11-14T10:12:43.716Z · crewly · WorkItem f157b771-c1b4-48ad-9302-91260f50bfd1 verified → done
