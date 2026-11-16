---
id: ATEL-57
title: ATEL-53 · Dựng sản phẩm trong Sàn trưng bày · Áo sơ mi xanh sọc trắng
status: done
priority: P1
assignee: atelierx-frontend-developer-0006
team: null
labels: []
ownerReview: false
createdAt: 2026-11-15T17:30:02.274Z
updatedAt: 2026-11-16T05:19:15.040Z
workItemId: 6d973122-6736-4f0b-acdc-bae085e5c56c
requestId: 445ea941-034d-4479-b633-fbdc1646bc4c
source: request:TKT-009
---

## Description

Goal: tích hợp surface GLB và content của Research trong showcase-basic-v1. Expected Outcome: standalone desktop viewer trong Crewly xoay/zoom được, đúng revision; six angle and collar/placket/cuff closeup browser evidence for QA. Eval Criteria: receives surface+content manifests, presentation=standalone; browser-qa --basic on actual Crewly URL, four base views plus required closeups; no localhost temporary server; handoff QA with hashes.

## Acceptance criteria

- [ ] Viewer and content same revision; proper desktop rotation/zoom and actual browser evidence.
- [ ] Không tự sửa UV/material/geometry; trả lỗi tới owner artifact.

## Log

- 2026-11-15T17:30:02.274Z · atelierx-team-leader-0001 · created (ready)
- 2026-11-16T03:16:20.603Z · atelierx-designer-0003 · claimed by atelierx-designer-0003 — WorkItem 6d973122-6736-4f0b-acdc-bae085e5c56c
- 2026-11-16T05:19:14.031Z · atelierx-designer-0003 · 2026-11-16: Đối chiếu sau account rotation: QA độc lập PASS v1.2-surface-v1; visual manifest đủ 25/25 SHA-256+byte count và cùng revision showcase-basic-v1 standalone. Browser evidence trên URL Crewly có 6 góc + 4 cận; display GLB trùng hash surface. Đăng bàn giao bổ sung trong thread ATEL-53 bằng atelierx-channel-v3 session hiện tại, messageId=869e4ca3-f0e3-4f8d-8287-9e90b24f9576. Ghi nhận ATEL-57 được gán nhầm lane Visual cho Designer để Lead sửa flow sau. Không publish/catalog.
- 2026-11-16T05:19:15.040Z · crewly · WorkItem 6d973122-6736-4f0b-acdc-bae085e5c56c done → done
