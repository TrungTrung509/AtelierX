---
id: ATEL-40
title: ATEL-35 · Kiểm tra phom xám lần 2
status: done
priority: P1
assignee: atelierx-qa-0004
team: af30c001-2789-4f20-b917-000000000010
labels: []
ownerReview: false
createdAt: 2026-11-15T08:26:31.632Z
updatedAt: 2026-11-15T11:07:32.559Z
workItemId: 8adeac5a-d27e-4198-a17b-5634976bb06f
requestId: 137ea277-6d54-4747-be7f-b7cf8ac11b29
source: agent:atelierx-team-leader-0001
---

## Description

## GOAL
Độc lập kiểm phom áo thun 3D standalone ATEL-35 v0.2-gray trước khi áp artwork/material.

## EXPECTED OUTCOME
Đọc trực tiếp ảnh browser front/back/side/oblique, GLB/provenance; ghi shape-review.json cho đúng revision, hoặc cập nhật review artifact phù hợp, rồi handoff trong thread team root e793f080-22d1-4258-b5c1-1874267ccd75 bằng session QA thật.

## EVAL CRITERIA
1. Kết luận đúng loại áo theo brief: áo thun cổ tròn, không mannequin.
2. Kiểm tra trực quan thân/tay/cổ nối liền, không lỗ hở hay mảnh bay; đánh giá khối và nếp gấp từ ảnh, không suy luận chỉ từ số island/triangles.
3. Ghi orderId ATEL-35, revision v0.2-gray, GLB path/hash, evidence paths/hashes, checks garmentType/connectedParts/structure, decision và reviewer.
4. Nếu trả lại, tối đa ba lỗi cụ thể gắn ảnh/vùng; không sửa GLB, không áp artwork, không publish.

## Acceptance criteria

_None yet._

## Log

- 2026-11-15T08:26:31.632Z · atelierx-team-leader-0001 · created (backlog)
- 2026-11-15T08:26:31.841Z · atelierx-team-leader-0001 · created from delegation by atelierx-team-leader-0001
- 2026-11-15T08:26:31.841Z · atelierx-team-leader-0001 · assigned to atelierx-qa-0004 — WorkItem 8adeac5a-d27e-4198-a17b-5634976bb06f
- 2026-11-15T10:01:35.091Z · owner · in_progress → done — Shape review đã thực hiện và trả kết luận; bản cuối ATEL-35/v1 đã qua QA độc lập.
- 2026-11-15T11:07:32.559Z · owner · updated title — Chuẩn hóa tên công đoạn; giữ nguyên ID và trạng thái.
