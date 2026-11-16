---
id: ATEL-46
title: ATEL-41 · Kiểm tra phom và sản phẩm · Quần cargo be cát
status: done
priority: P2
assignee: atelierx-qa-0004
team: af30c001-2789-4f20-b917-000000000010
labels: []
ownerReview: false
createdAt: 2026-11-15T11:22:58.052Z
updatedAt: 2026-11-15T12:42:56.672Z
workItemId: edfeafa5-1ef1-4a04-a300-d5069a2bc181
requestId: 62d6b870-6d4b-4308-821b-04714d728cd1
source: request:TKT-008
---

## Description

Goal: Hoàn thiện quần cargo 3D ống suông màu be cát trưng bày độc lập theo brief. Expected Outcome: Sản phẩm có volume/nếp vải, cạp có đỉa thắt lưng, khóa kéo và nút trước, hai túi hộp lớn ở hai đùi, dây rút gấu; viewer desktop trong Sàn trưng bày Crewly và nội dung tiếng Việt có chất liệu mô phỏng cùng kích thước hiển thị có nguồn. Eval Criteria: Không mannequin; đúng silhouette và đủ chi tiết; kiểm ảnh thật trước/sau/nghiêng/oblique; QA độc lập xác nhận revision hiện hành, viewer xoay/zoom desktop, nội dung và quality gate cùng revision. Vai trò QA: giữ đúng một WorkItem xuyên suốt ATEL-41. Đầu tiên kiểm phom xám bằng GLB/hash, provenance và ảnh front/back/side/oblique; ghi shape review pass/return với lỗi cụ thể có ảnh. Sau shape pass, không complete WorkItem; chờ viewer cuối. Cuối đơn kiểm độc lập revision hiện tại trên URL Crewly desktop, geometry/detail, màu/artwork, content tiếng Việt, xoay/zoom, ảnh bốn góc và hash đồng nhất; tối đa ba lỗi cụ thể rồi một retest tập trung.

## Acceptance criteria

- [ ] Review phom xám độc lập dựa trên ảnh thật và đúng hash/revision, ghi decision rõ.
- [ ] QA cuối chỉ trên revision viewer hiện tại; kiểm đầy đủ brief, content, desktop rotate/zoom, bốn góc và artifact/hash.
- [ ] Sau shape review giữ nguyên cùng WorkItem, chờ final; chỉ complete sau final pass và giao QA report.

## Log

- 2026-11-15T11:22:58.052Z · atelierx-team-leader-0001 · created (ready)
- 2026-11-15T11:23:28.463Z · atelierx-team-leader-0001 · delegated by atelierx-team-leader-0001
- 2026-11-15T11:23:28.463Z · atelierx-team-leader-0001 · assigned to atelierx-qa-0004 — WorkItem edfeafa5-1ef1-4a04-a300-d5069a2bc181
- 2026-11-15T12:42:56.672Z · crewly · WorkItem edfeafa5-1ef1-4a04-a300-d5069a2bc181 done → done
