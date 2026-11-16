---
id: ATEL-52
title: ATEL-47 · Kiểm tra phom và sản phẩm · Áo sơ mi xanh sọc trắng
status: done
priority: P2
assignee: atelierx-qa-0004
team: af30c001-2789-4f20-b917-000000000010
labels: []
ownerReview: false
createdAt: 2026-11-15T14:58:57.612Z
updatedAt: 2026-11-15T16:49:43.202Z
workItemId: 3525b4c5-f05c-4945-85af-c9fc32b6f6a6
requestId: 7580966e-280f-471f-b141-1d9f2924b260
source: request:TKT-009
---

## Description

Goal: Tạo áo sơ mi công sở 3D độc lập cho người trẻ đi làm. Expected Outcome: áo phom vừa, xanh da trời sáng, sọc dọc trắng mảnh đều; cổ sơ mi, hàng khuy trước, tay dài, cổ tay có khuy; có volume và nếp vải tự nhiên, xoay/zoom desktop trong Sàn trưng bày Crewly. Eval Criteria: không mannequin; phom xám được xem qua ảnh thật front/back/side/oblique và QA shape pass trước surface; material, content, viewer đồng revision; QA độc lập browser desktop pass; quality gate và catalog khớp. Nhiệm vụ QA: giữ cùng một WorkItem xuyên suốt đơn. Đầu tiên review độc lập untextured shape qua GLB/hash/provenance và ảnh front/back/side/oblique, ghi pass/return rõ; sau shape review chờ final, không complete. Cuối cùng QA browser desktop revision hiện hành, chi tiết brief, content/material/viewer/hash; tối đa 3 lỗi cụ thể có evidence rồi một retest tập trung.

## Acceptance criteria

- [ ] Shape review độc lập có decision/evidence trên đúng revision; QA final browser desktop independent pass/return; report QA/hash; WorkItem chỉ complete sau final pass.

## Log

- 2026-11-15T14:58:57.612Z · atelierx-team-leader-0001 · created (ready)
- 2026-11-15T14:59:07.928Z · atelierx-team-leader-0001 · updated acceptance criteria
- 2026-11-15T15:00:43.443Z · atelierx-team-leader-0001 · updated title
- 2026-11-15T15:02:25.180Z · atelierx-team-leader-0001 · delegated by atelierx-team-leader-0001
- 2026-11-15T15:02:25.180Z · atelierx-team-leader-0001 · assigned to atelierx-qa-0004 — WorkItem 3525b4c5-f05c-4945-85af-c9fc32b6f6a6
- 2026-11-15T16:49:43.202Z · crewly · WorkItem 3525b4c5-f05c-4945-85af-c9fc32b6f6a6 done → done
