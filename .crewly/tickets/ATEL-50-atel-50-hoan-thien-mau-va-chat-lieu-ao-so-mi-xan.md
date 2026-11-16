---
id: ATEL-50
title: ATEL-47 · Hoàn thiện màu và chất liệu · Áo sơ mi xanh sọc trắng
status: done
priority: P2
assignee: atelierx-backend-developer-0005
team: af30c001-2789-4f20-b917-000000000010
labels: []
ownerReview: false
createdAt: 2026-11-15T14:58:55.851Z
updatedAt: 2026-11-15T16:36:29.814Z
workItemId: 3477c75a-34f0-4222-a395-4853a895aac8
requestId: 7580966e-280f-471f-b141-1d9f2924b260
source: request:TKT-009
---

## Description

Goal: Tạo áo sơ mi công sở 3D độc lập cho người trẻ đi làm. Expected Outcome: áo phom vừa, xanh da trời sáng, sọc dọc trắng mảnh đều; cổ sơ mi, hàng khuy trước, tay dài, cổ tay có khuy; có volume và nếp vải tự nhiên, xoay/zoom desktop trong Sàn trưng bày Crewly. Eval Criteria: không mannequin; phom xám được xem qua ảnh thật front/back/side/oblique và QA shape pass trước surface; material, content, viewer đồng revision; QA độc lập browser desktop pass; quality gate và catalog khớp. Nhiệm vụ Material: chuẩn bị preset PBR xanh da trời sáng; chỉ áp surface sau shape-review pass và đủ UV/placement từ Designer, giữ geometry. Tạo sọc dọc trắng mảnh đều trên mặt trước/sau với khoảng cách đều; kiểm pattern không chạy nhầm hướng hoặc lem qua cổ/tay/cổ tay. Giao surface GLB/hash và manifest.

## Acceptance criteria

- [ ] Preset sớm; surface GLB đồng geometry sau shape pass; sọc dọc đều, nền xanh sáng, không sai hướng/lem; manifest/hash hợp lệ.

## Log

- 2026-11-15T14:58:55.851Z · atelierx-team-leader-0001 · created (ready)
- 2026-11-15T15:00:42.883Z · atelierx-team-leader-0001 · updated title
- 2026-11-15T15:02:11.421Z · atelierx-team-leader-0001 · delegated by atelierx-team-leader-0001
- 2026-11-15T15:02:11.421Z · atelierx-team-leader-0001 · assigned to atelierx-backend-developer-0005 — WorkItem 7b7c1912-af52-40f2-aced-114759f45cca
- 2026-11-15T15:03:14.907Z · crewly · WorkItem 7b7c1912-af52-40f2-aced-114759f45cca done → done
- 2026-11-15T16:31:46.028Z · atelierx-team-leader-0001 · done → ready — Shape v4 passed independent QA; continue from preset-only handoff and build surface GLB v4 using approved geometry/UVs.
- 2026-11-15T16:31:46.411Z · atelierx-team-leader-0001 · assigned to atelierx-backend-developer-0005 — WorkItem 3477c75a-34f0-4222-a395-4853a895aac8
- 2026-11-15T16:36:29.814Z · crewly · WorkItem 3477c75a-34f0-4222-a395-4853a895aac8 done → done
