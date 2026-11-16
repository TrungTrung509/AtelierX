---
id: ATEL-43
title: ATEL-41 · Hoàn thiện màu và chất liệu · Quần cargo be cát
status: done
priority: P2
assignee: atelierx-backend-developer-0005
team: af30c001-2789-4f20-b917-000000000010
labels: []
ownerReview: false
createdAt: 2026-11-15T11:20:47.991Z
updatedAt: 2026-11-15T12:14:27.038Z
workItemId: a7e9926b-a429-4e10-a706-c4e0c0b97b55
requestId: 62d6b870-6d4b-4308-821b-04714d728cd1
source: request:TKT-008
---

## Description

Goal: Hoàn thiện quần cargo 3D ống suông màu be cát trưng bày độc lập theo brief. Expected Outcome: Sản phẩm có volume/nếp vải, cạp có đỉa thắt lưng, khóa kéo và nút trước, hai túi hộp lớn ở hai đùi, dây rút gấu; viewer desktop trong Sàn trưng bày Crewly và nội dung tiếng Việt có chất liệu mô phỏng cùng kích thước hiển thị có nguồn. Eval Criteria: Không mannequin; đúng silhouette và đủ chi tiết; kiểm ảnh thật trước/sau/nghiêng/oblique; QA độc lập xác nhận revision hiện hành, viewer xoay/zoom desktop, nội dung và quality gate cùng revision. Vai trò Material: chuẩn bị preset PBR cotton/canvas twill tông beige-sand và thông số surface; chờ shape-review pass trước khi xuất surface GLB, giữ nguyên topology/UV; kiểm texture không bị lệch hoặc khác màu giữa ống/túi.

## Acceptance criteria

- [ ] Preset vật liệu mô phỏng có nguồn/tên rõ, màu be cát và roughness phù hợp vải cargo.
- [ ] Surface GLB giữ nguyên geometry và UV, bao gồm toàn bộ chi tiết khi shape-review pass.
- [ ] Giao manifest/hash, mô tả vật liệu mô phỏng và xác nhận mặt trước/lưng không có artwork ngoài brief.

## Log

- 2026-11-15T11:20:47.991Z · atelierx-team-leader-0001 · created (ready)
- 2026-11-15T11:21:01.082Z · atelierx-team-leader-0001 · delegated by atelierx-team-leader-0001
- 2026-11-15T11:21:01.082Z · atelierx-team-leader-0001 · assigned to atelierx-backend-developer-0005 — WorkItem a7e9926b-a429-4e10-a706-c4e0c0b97b55
- 2026-11-15T12:14:27.038Z · crewly · WorkItem a7e9926b-a429-4e10-a706-c4e0c0b97b55 done → done
