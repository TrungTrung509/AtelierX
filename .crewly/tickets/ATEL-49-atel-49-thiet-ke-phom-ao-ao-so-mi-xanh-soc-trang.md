---
id: ATEL-49
title: ATEL-47 · Thiết kế phom áo · Áo sơ mi xanh sọc trắng
status: done
priority: P2
assignee: atelierx-designer-0003
team: af30c001-2789-4f20-b917-000000000010
labels: []
ownerReview: false
createdAt: 2026-11-15T14:58:55.144Z
updatedAt: 2026-11-15T16:28:25.006Z
workItemId: 6c47554f-bb30-418e-9d75-600169cf9686
requestId: 7580966e-280f-471f-b141-1d9f2924b260
source: request:TKT-009
---

## Description

Goal: Tạo áo sơ mi công sở 3D độc lập cho người trẻ đi làm. Expected Outcome: áo phom vừa, xanh da trời sáng, sọc dọc trắng mảnh đều; cổ sơ mi, hàng khuy trước, tay dài, cổ tay có khuy; có volume và nếp vải tự nhiên, xoay/zoom desktop trong Sàn trưng bày Crewly. Eval Criteria: không mannequin; phom xám được xem qua ảnh thật front/back/side/oblique và QA shape pass trước surface; material, content, viewer đồng revision; QA độc lập browser desktop pass; quality gate và catalog khớp. Nhiệm vụ Designer: chờ shortlist/provenance của Research; dùng nguyên geometry đã QA nếu phù hợp, nếu phải đổi cấu trúc thì dựng garment độc lập không mannequin. Giao untextured gray GLB/hash, ảnh front/back/side/oblique, provenance, UV mapping, vị trí trước/sau và material groups. Không làm surface hoặc viewer.

## Acceptance criteria

- [ ] Gray GLB/hash, ảnh thật front/back/side/oblique, provenance/UV/material groups; hình học sơ mi standalone có cổ, tay dài, cổ tay và nếp vải.

## Log

- 2026-11-15T14:58:55.144Z · atelierx-team-leader-0001 · created (ready)
- 2026-11-15T15:00:42.565Z · atelierx-team-leader-0001 · updated title
- 2026-11-15T15:06:04.005Z · atelierx-team-leader-0001 · delegated by atelierx-team-leader-0001
- 2026-11-15T15:06:04.005Z · atelierx-team-leader-0001 · assigned to atelierx-designer-0003 — WorkItem 8473425f-7cc2-45d4-9998-9e07d451723e
- 2026-11-15T15:31:10.491Z · crewly · WorkItem 8473425f-7cc2-45d4-9998-9e07d451723e done → done
- 2026-11-15T15:40:22.924Z · atelierx-team-leader-0001 · done → ready — QA returned v1; reopening the existing Designer ticket for one focused shape correction (SHAPE-01/02/03) before QA retest.
- 2026-11-15T15:40:27.163Z · atelierx-team-leader-0001 · assigned to atelierx-designer-0003 — WorkItem af551c45-a367-4029-9117-0fb8911852c7
- 2026-11-15T16:03:40.357Z · crewly · WorkItem af551c45-a367-4029-9117-0fb8911852c7 done → done
- 2026-11-15T16:08:40.347Z · atelierx-team-leader-0001 · done → ready — QA v3 returned; stop old parametric topology and rebuild shoulder/sleeve/collar using a new topology, not another patch.
- 2026-11-15T16:08:50.969Z · atelierx-team-leader-0001 · assigned to atelierx-designer-0003 — WorkItem 6c47554f-bb30-418e-9d75-600169cf9686
- 2026-11-15T16:28:25.006Z · crewly · WorkItem 6c47554f-bb30-418e-9d75-600169cf9686 done → done
