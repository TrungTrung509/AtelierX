---
id: ATEL-19
title: "ATEL-19: QA retest clean-v3 sau corrective G1"
status: done
priority: P1
assignee: atelierx-qa-0004
team: null
labels: [ atelierx, ATEL-9, qa, base-mesh, retest ]
ownerReview: false
createdAt: 2026-11-14T15:42:48.821Z
updatedAt: 2026-11-14T15:52:14.657Z
workItemId: e348d8a3-6038-4f70-8bf6-c3dec4945501
requestId: null
source: agent:atelierx-team-leader-0001
---

## Description

Goal: đánh giá độc lập revision clean-v2-neckfix-placement-v3 sau ATEL-17. Expected Outcome: kết luận G1 return/pass cho đúng source/mesh/diagnostic SHA; xác nhận cổ-vai, vùng lưng và ngực bằng browser thật. Eval: so hash source candidate grab3d-hoodie-clean-v2 SHA 42dc0075e632eab84256f71d9cc88b6eb6d54d04cbff3682f548f62e55994a13, geometry revision hoodie-mesh-revision.glb SHA 34374edd321b7e8396656e7d5a003e359d9349c5cc35bb5bc37a5c99145141bf, diagnostic GLB SHA 964e87b98a215cf1c8b86ce0b42f6a881b384202caf8faeaca3928aa6c64ea92; kiểm report/profile/filter-details/evidence manifest và hash ảnh; mở browser captures thực front/back/left/right/detail/mobile + hai cận cổ-vai. Đặc biệt xác nhận đường cong còn lại trên đỉnh hood là seam/edge hợp lệ hay residue; back badge nằm toàn phần dưới footprint hood và trên hem; chest badge đủ clearance khỏi dây rút/túi; viewer loaded/rotated/zoomed desktop/mobile, lỗi rỗng. Ghi report trong quality/reports/ATEL-9/ gắn đầy đủ revision/SHA, scores, verdict, evidence, blocker/owner/next step. Không sửa asset, source, base-meshes.json, catalog hoặc tự duyệt base mesh; Lead quyết định G1 và catalog sau report.

## Acceptance criteria

- [ ] Đối chiếu source SHA, geometry revision SHA, diagnostic SHA, profile/material slot và manifest ảnh; tất cả cùng revision clean-v2-neckfix-placement-v3.
- [ ] Browser QA thật xác nhận front/back/left/right/detail/mobile và cổ-vai; ghi rõ đường cong hood-edge, hood/back clearance, hem clearance và chest cord/pocket clearance.
- [ ] Lưu report QA độc lập dưới quality/reports/ATEL-9/ với verdict, scores, evidence, blocker/next owner; không sửa registry/catalog hoặc đánh dấu approved.

## Log

- 2026-11-14T15:42:48.821Z · atelierx-team-leader-0001 · created (backlog)
- 2026-11-14T15:42:54.449Z · atelierx-team-leader-0001 · backlog → ready — Lead đã verify handoff ATEL-17 clean-v3; source/mesh/diagnostic SHA và browser set khớp. Giao QA retest độc lập đúng revision.
- 2026-11-14T15:42:54.662Z · atelierx-team-leader-0001 · assigned to atelierx-qa-0004 — WorkItem e348d8a3-6038-4f70-8bf6-c3dec4945501
- 2026-11-14T15:43:33.979Z · atelierx-qa-0004 · NHẬN VIỆC đăng trong thread ATEL-9; messageId=9585ef4b-b37b-4707-9d16-a52b0a8dcb4f. Đã gửi structured acceptance cho Studio Lead, đang chờ xác nhận hiểu đúng trước khi bắt đầu retest theo task contract.
- 2026-11-14T15:43:44.272Z · atelierx-team-leader-0001 · 2026-11-14T15:43Z · Studio Lead · GIAO VIỆC ATEL-19 trong thread ATEL-9, messageId 0b82b07f-6006-4f88-86c5-cfcf4e29bf7c; DM trực tiếp đã gửi QA. QA đã claim WorkItem e348d8a3-6038-4f70-8bf6-c3dec4945501 và đăng NHẬN VIỆC trong thread; Lead xác nhận scope/tiêu chí. Retest đúng source/geometry/diagnostic SHA clean-v3; không sửa asset/registry/catalog, không tự approve.
- 2026-11-14T15:49:03.112Z · atelierx-qa-0004 · BÀN GIAO QA khuyến nghị PASS G1 đăng trong thread ATEL-9; đính chính thuần tiếng Việt, messageId=9707fac9-adde-4de9-82f4-ac27094eb2fe (bản trước có câu lẫn ngôn ngữ, dùng messageId này làm handoff chuẩn). Report=quality/reports/ATEL-9/clean-v2-neckfix-placement-v3-qa.json. Source/geometry/diagnostic SHA và 8/8 ảnh khớp; diagnostic geometry attribute/index bytes trùng geometry revision, 19,496 triangles. Browser loaded/rotated/zoomed desktop/mobile đạt, errors rỗng. Hood-edge đọc như seam liên tục; back clearance có nhưng sát gấu; chest clear. Candidate vẫn giữ nguyên, chờ Lead quyết định.
- 2026-11-14T15:52:14.657Z · crewly · WorkItem e348d8a3-6038-4f70-8bf6-c3dec4945501 verified → done
