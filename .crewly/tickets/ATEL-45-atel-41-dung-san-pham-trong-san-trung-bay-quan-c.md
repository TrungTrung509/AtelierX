---
id: ATEL-45
title: ATEL-41 · Dựng sản phẩm trong Sàn trưng bày · Quần cargo be cát
status: done
priority: P2
assignee: atelierx-frontend-developer-0006
team: af30c001-2789-4f20-b917-000000000010
labels: []
ownerReview: false
createdAt: 2026-11-15T11:22:14.567Z
updatedAt: 2026-11-15T12:38:23.183Z
workItemId: 541b4670-fb3c-422c-89e5-0f969d06e8ec
requestId: 62d6b870-6d4b-4308-821b-04714d728cd1
source: request:TKT-008
---

## Description

Goal: Hoàn thiện quần cargo 3D ống suông màu be cát trưng bày độc lập theo brief. Expected Outcome: Sản phẩm có volume/nếp vải, cạp có đỉa thắt lưng, khóa kéo và nút trước, hai túi hộp lớn ở hai đùi, dây rút gấu; viewer desktop trong Sàn trưng bày Crewly và nội dung tiếng Việt có chất liệu mô phỏng cùng kích thước hiển thị có nguồn. Eval Criteria: Không mannequin; đúng silhouette và đủ chi tiết; kiểm ảnh thật trước/sau/nghiêng/oblique; QA độc lập xác nhận revision hiện hành, viewer xoay/zoom desktop, nội dung và quality gate cùng revision. Vai trò Visual: dựng viewer theo showcase-basic-v1, presentation=standalone; nhận surface GLB hoàn chỉnh từ Material; tích hợp content.json tiếng Việt và model; browser-qa --basic trên URL Crewly desktop bốn góc. Không dựng mannequin, không sửa geometry/material, không dùng server preview tạm.

## Acceptance criteria

- [ ] Viewer standalone có đúng model và content của một revision, xoay/zoom desktop hoạt động.
- [ ] browser-qa --basic có ảnh front/back/side/oblique trên URL Crewly thật.
- [ ] Không mannequin; dùng surface GLB cuối của Material và giữ hash/provenance nhất quán.

## Log

- 2026-11-15T11:22:14.567Z · atelierx-team-leader-0001 · created (ready)
- 2026-11-15T11:22:25.931Z · atelierx-team-leader-0001 · delegated by atelierx-team-leader-0001
- 2026-11-15T11:22:25.931Z · atelierx-team-leader-0001 · assigned to atelierx-frontend-developer-0006 — WorkItem bae5141a-29e1-4436-a9a4-c53e25f6e190
- 2026-11-15T12:21:26.739Z · crewly · WorkItem bae5141a-29e1-4436-a9a4-c53e25f6e190 done → done
- 2026-11-15T12:33:12.367Z · atelierx-team-leader-0001 · done → ready — QA final v3 returned for one focused visual content correction: add sourced credits to content.json; browser/viewer/assets otherwise pass. Resume same order/request; QA WorkItem waits for new visual artifact.
- 2026-11-15T12:33:40.858Z · atelierx-team-leader-0001 · delegated by atelierx-team-leader-0001
- 2026-11-15T12:33:40.858Z · atelierx-team-leader-0001 · assigned to atelierx-frontend-developer-0006 — WorkItem 541b4670-fb3c-422c-89e5-0f969d06e8ec
- 2026-11-15T12:38:23.183Z · crewly · WorkItem 541b4670-fb3c-422c-89e5-0f969d06e8ec done → done
