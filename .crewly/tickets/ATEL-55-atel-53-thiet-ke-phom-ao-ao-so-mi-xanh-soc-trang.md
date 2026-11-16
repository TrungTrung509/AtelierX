---
id: ATEL-55
title: ATEL-53 · Thiết kế phom áo · Áo sơ mi xanh sọc trắng
status: cancelled
priority: P1
assignee: null
team: null
labels: []
ownerReview: false
createdAt: 2026-11-15T17:30:01.522Z
updatedAt: 2026-11-15T19:37:40.725Z
workItemId: null
requestId: 445ea941-034d-4479-b633-fbdc1646bc4c
source: request:TKT-009
---

## Description

Goal: tạo phom gray sơ mi standalone theo owner return và shortlist Research. Expected Outcome: garment shell độc lập có vai/nách/thân/tay liên tục, volume/nếp tự nhiên, cổ bẻ có chân + hai lá, cửa cổ/tay/gấu mở; buttons gắn theo bề mặt nẹp/măng sét và cập nhật anchor khi đổi geometry. Eval Criteria: ảnh gray front/back/side/oblique/top/bottom, thêm collarCloseup/placketSideCloseup/cuffCloseup đúng revision; GLB/hash/provenance/UV/material groups và button anchor notes; QA độc lập shape pass trước surface. Chỉ dùng nguồn được Research xác minh; nếu không có nguồn đạt thì chờ Lead replan, không vá tiếp topology ATEL-47 và không thay bằng khối SDF/parametric.

## Acceptance criteria

- [ ] Cổ, khuy và cửa mở đọc đúng sơ mi; mọi khuy bám vải ở front/side closeups.
- [ ] Có sáu góc gray và ba ảnh cận, manifest/hash và notes đủ để QA độc lập.

## Log

- 2026-11-15T17:30:01.522Z · atelierx-team-leader-0001 · created (ready)
- 2026-11-15T19:33:00.385Z · atelierx-backend-developer-0005 · claimed by atelierx-backend-developer-0005 — WorkItem e223a953-373e-4d1d-b558-4ee3e215dc16
- 2026-11-15T19:35:17.774Z · atelierx-backend-developer-0005 · WorkItem e223a953-373e-4d1d-b558-4ee3e215dc16 được route cho backend nhưng phạm vi là hình học Designer; ticket ATEL-62 cùng đơn đang in_progress với atelierx-designer-0003 và QA v1.4-gray đã return. Đã dừng trước khi sửa artifact; cần Lead căn chỉnh ownership/duplicate ticket.
- 2026-11-15T19:37:40.725Z · atelierx-team-leader-0001 · in_progress → cancelled — Lead 2026-11-15: cancelled as duplicate shape scope. ATEL-62 remains the sole Designer-owned geometry WorkItem for ATEL-53; no artifacts were modified under ATEL-55. Backend WorkItem was blocked before edits and must remain closed from duplicate execution.
