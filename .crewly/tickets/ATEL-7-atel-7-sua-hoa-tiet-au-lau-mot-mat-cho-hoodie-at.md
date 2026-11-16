---
id: ATEL-7
title: "ATEL-7: Sửa họa tiết đầu lâu một mắt cho hoodie ATEL-1 v2"
status: done
priority: P2
assignee: atelierx-designer-0003
team: null
labels: [ atelierx, ATEL-1, ATEL-2, revision ]
ownerReview: false
createdAt: 2026-11-13T13:17:41.079Z
updatedAt: 2026-11-13T13:37:10.384Z
workItemId: 101cafeb-31b6-401c-bd03-d6eda891e539
requestId: 259a99ed-9162-493c-88f3-fdf548040411
source: request:TKT-002
---

## Description

Goal: cập nhật artwork/texture hoodie ATEL-1 theo yêu cầu kiểm định hiện hành: đầu lâu động vật một mắt, trên lưng áo đen. Expected outcome: bundle ATEL-2 revision v2 có artwork, texture, GLB, manifest và generator/tests tái tạo được; giữ tương thích với viewer ATEL-3 và lưu evidence. Eval Criteria: chỉ có một đặc điểm hốc mắt rõ ràng (không còn hai hốc mở); hình đặt giữa, đúng chiều, không bị cắt; mặt trước vẫn trơn; generator tests và Khronos Validator pass; ghi rõ các giới hạn runtime/physical fit chưa xác minh.

## Acceptance criteria

- [ ] Bundle ATEL-2 v2 cập nhật ở dist/assets/models/ATEL-2/v2/ với GLB, PNG texture, SVG artwork và manifest.
- [ ] Generator/tests tái tạo v2; test pass và Khronos glTF Validator báo 0 errors, 0 warnings.
- [ ] Artwork thể hiện rõ đầu lâu động vật một mắt theo ATEL-6, đặt giữa lưng đúng chiều, không cắt; mặt trước trơn.
- [ ] Bàn giao evidence và giới hạn chưa kiểm chứng; không tuyên bố browser/fit QA đạt nếu chưa có bằng chứng.

## Log

- 2026-11-13T13:17:41.079Z · atelierx-team-leader-0001 · created (ready)
- 2026-11-13T13:17:53.238Z · atelierx-team-leader-0001 · delegated by atelierx-team-leader-0001
- 2026-11-13T13:17:53.238Z · atelierx-team-leader-0001 · assigned to atelierx-designer-0003 — WorkItem 101cafeb-31b6-401c-bd03-d6eda891e539
- 2026-11-13T13:28:17.961Z · atelierx-designer-0003 · Started ATEL-2/v2 using a separate generator/output path. The new artwork has one centered eye opening; v2-specific tests cover eye count, UV orientation, print bounds, blank front, and manifest QA notes. Captured v1 hashes before changes and confirmed current hashes still match.
- 2026-11-13T13:35:00.012Z · atelierx-designer-0003 · ATEL-2/v2 bundle complete in dist/assets/models/ATEL-2/v2: one-eye animal skull artwork/texture, GLB and manifest. Separate v2 generator and 3 passing tests. Khronos Validator 2.0.0-dev.3.10: 0 errors/0 warnings/0 infos. SHA256 check confirms all v1 outputs and original v1 generator/tests are unchanged. Offline front/back placement schematics are labeled as non-viewer captures; runtime browser and physical fit QA remain unconfirmed.
- 2026-11-13T13:37:10.384Z · crewly · WorkItem 101cafeb-31b6-401c-bd03-d6eda891e539 verified → done
