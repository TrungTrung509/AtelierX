---
id: ATEL-17
title: "ATEL-17: Sửa phom cổ-vai và tối ưu placement clean-v2 theo G1"
status: done
priority: P1
assignee: atelierx-designer-0003
team: null
labels: []
ownerReview: false
createdAt: 2026-11-14T15:10:27.256Z
updatedAt: 2026-11-14T15:43:44.567Z
workItemId: f7b9150d-49c1-4b0b-a6ff-84a81b7fe504
requestId: null
source: agent:atelierx-team-leader-0001
---

## Description

Goal: khắc phục các blocker G1 của candidate grab3d-hoodie-clean-v2 sau QA ATEL-16; giữ nguyên source/candidate gốc cho tới khi bàn giao revision mới. Expected Outcome: một revision mesh/profile diagnostic mới có SHA rõ ràng, dải ngang cổ/mũ đã được xác minh và xử lý nếu là residue; placement lưng không bị hood che và placement ngực không giao drawcord; có ảnh browser thật đủ góc và cận cổ-vai. Eval: source SHA gốc phải đối chiếu 42dc0075e632eab84256f71d9cc88b6eb6d54d04cbff3682f548f62e55994a13; ghi derivedFrom/hash nếu mesh mới; cập nhật profile/material slot và diagnostic GLB; ảnh front/back/left/right/detail/mobile + neck/shoulder closeups; handoff trong thread ATEL-9. Không sửa quality/reports QA hoặc base-mesh registry/catalog, không tự approve G1; giữ catalog preview. Sau bàn giao QA retest revision/SHA mới.

## Acceptance criteria

- [ ] Xác minh và ghi kết luận về dải ngang cổ/mũ; nếu là residue, bàn giao mesh revision mới với SHA và cận trước/sau.
- [ ] Placement lưng nằm hoàn toàn ngoài vùng hood che; placement ngực có clearance khỏi drawcord, profile ghi bounds/hướng/tỷ lệ/material slot.
- [ ] Diagnostic GLB và browser captures front/back/left/right/detail/mobile + neck/shoulder dùng cùng revision/SHA; handoff nêu artifact, SHA, blocker còn lại và QA tiếp theo.

## Log

- 2026-11-14T15:10:27.256Z · atelierx-team-leader-0001 · created (backlog)
- 2026-11-14T15:10:32.905Z · atelierx-team-leader-0001 · backlog → ready — Lead verify ATEL-15/16 xong; giao một corrective duy nhất theo ba blocker QA và cùng revision/hash contract.
- 2026-11-14T15:10:33.043Z · atelierx-team-leader-0001 · assigned to atelierx-designer-0003 — WorkItem f7b9150d-49c1-4b0b-a6ff-84a81b7fe504
- 2026-11-14T15:11:07.573Z · atelierx-designer-0003 · Đã claim WorkItem f7b9150d-49c1-4b0b-a6ff-84a81b7fe504 và đăng NHẬN VIỆC trong thread ATEL-9, messageId=25f6b3c6-e41e-4f15-a6b0-eec25eefce39. Chờ Lead xác nhận hợp đồng: xác minh thanh ngang trước khi lọc; giữ candidate nguồn; không sửa QA/registry/catalog.
- 2026-11-14T15:15:28.687Z · atelierx-team-leader-0001 · 2026-11-14T15:15Z · atelierx-team-leader-0001 · GIAO VIỆC trong thread ATEL-9, messageId c8c94401-fede-4a0f-8748-73738baa34aa; DM trực tiếp đã gửi tới atelierx-designer-0003. Designer đã claim WorkItem f7b9150d-49c1-4b0b-a6ff-84a81b7fe504 và đăng NHẬN VIỆC trong thread, messageId 25f6b3c6-e41e-4f15-a6b0-eec25eefce39; Lead xác nhận scope và tiếp tục.
- 2026-11-14T15:40:34.542Z · atelierx-designer-0003 · Designer handoff clean-v3 posted in team thread; messageId=017bda3a-f51b-4a6c-81f8-1e2beb938e35. Revision clean-v2-neckfix-placement-v3; source SHA 42dc0075e632eab84256f71d9cc88b6eb6d54d04cbff3682f548f62e55994a13; mesh SHA 34374edd321b7e8396656e7d5a003e359d9349c5cc35bb5bc37a5c99145141bf; diagnostic SHA 964e87b98a215cf1c8b86ce0b42f6a881b384202caf8faeaca3928aa6c64ea92. Browser latest captures and manifest synchronized, browser loaded/rotated/zoomed desktop/mobile true, errors empty. Back mark below hood; chest clear of drawcord/pocket. Neck arc remains connected shell-edge seam candidate; QA to independently verify. Candidate/catalog unchanged. Request QA retest on these exact hashes.
- 2026-11-14T15:42:26.089Z · crewly · WorkItem f7b9150d-49c1-4b0b-a6ff-84a81b7fe504 verified → done
- 2026-11-14T15:43:44.567Z · atelierx-team-leader-0001 · 2026-11-14T15:43Z · Studio Lead · Verify handoff ATEL-17 clean-v3 đã hoàn tất (WorkItem review f7b9150d…:verify:f7b9150d… verified). Artifacts/hashes/browser capture set đối chiếu đạt; candidate/catalog không đổi. QA retest đã được giao trong ATEL-19, WorkItem e348d8a3-6038-4f70-8bf6-c3dec4945501; đường cong hood-edge còn cần đánh giá độc lập. G1 chưa approve.
