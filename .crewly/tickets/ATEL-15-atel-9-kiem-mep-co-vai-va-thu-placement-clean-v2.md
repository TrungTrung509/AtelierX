---
id: ATEL-15
title: "ATEL-9: Kiểm mép cổ vai và thử placement clean-v2"
status: done
priority: P1
assignee: atelierx-designer-0003
team: null
labels: [ atelierx, ATEL-9, designer, placement ]
ownerReview: false
createdAt: 2026-11-14T10:51:17.432Z
updatedAt: 2026-11-14T15:09:26.814Z
workItemId: 29992930-0f82-42e2-b9b5-fdfc3f8fb015
requestId: null
source: agent:atelierx-team-leader-0001
---

## Description

Goal: hoàn thiện bằng chứng G1 cho grab3d-hoodie-clean-v2. Expected Outcome: Designer kiểm topology cổ/vai, tạo artwork thử ngực/lưng và placement profile gắn đúng SHA/revision; giữ candidate cho tới QA độc lập. Eval Criteria: có GLB/hash, material slots, vùng in và hướng/tỉ lệ; ảnh browser trước/sau/hai bên/detail/mobile; ghi lỗi còn lại và bàn giao QA trong thread ae70a6a0-f4e1-403b-92e5-00462ea20ae5. Không sửa file QA hoặc catalog. Nếu thay mesh tạo revision mới.

## Acceptance criteria

- [ ] Có placement profile, artwork test và kiểm topology cùng revision/hash, hoặc blocker có bằng chứng và bước tiếp theo.

## Log

- 2026-11-14T10:51:17.432Z · atelierx-team-leader-0001 · created (backlog)
- 2026-11-14T10:51:27.583Z · atelierx-team-leader-0001 · backlog → ready
- 2026-11-14T10:51:27.972Z · atelierx-team-leader-0001 · assigned to atelierx-designer-0003 — WorkItem 29992930-0f82-42e2-b9b5-fdfc3f8fb015
- 2026-11-14T10:52:37.487Z · atelierx-designer-0003 · Đã claim WorkItem; NHẬN VIỆC đăng thread ATEL-9 (messageId c0c8a66a-a8c5-4fe0-a45c-880ad005603f). Bắt đầu kiểm GLB clean-v2 cùng SHA/revision và placement.
- 2026-11-14T14:44:34.230Z · atelierx-team-leader-0001 · 14:44Z · Lead idle-holder review: source WorkItem 29992930… running since 14:37:48, no output; Designer session status idle/updated 14:36:45 and persistent session log stops at Codex welcome/sign-in chooser. Đây là blocker session/auth, không phải kết quả chuyên môn. Đã báo Orc yêu cầu khôi phục phiên hợp lệ hoặc quyết định assignee thay thế. Không tạo WorkItem trùng khi claim source còn hiệu lực; giữ clean-v2 candidate, không sửa GLB/catalog. Khi claim được thu hồi/hết hạn: giao lại ATEL-15 cho Designer đã khôi phục hoặc agent thay thế có thể thực hiện; cần placement/topology cùng SHA, sau đó QA độc lập.
- 2026-11-14T14:45:07.048Z · atelierx-team-leader-0001 · 14:46Z · Lead correction based on Orc current session logs: өмнөх auth-blocker үнэлгээг supersede хийнэ. atelierx-designer-0003 session одоо нэвтэрсэн/Working; /tmp/atel15-neck-shot.cjs ажиллуулж neck-shoulder-detail.png болон neck-shoulder-front-detail.png үүсгэн шалгасан, errors=[]. Agent activity log шинэчлэгдсэн тул idle workingStatus stale; claim/assignee хэвээр үлдээнэ, relaunch/reassign хийхгүй. Эдгээр хоёр capture нь Designer-ийн дунд шатны evidence бөгөөд QA pass биш; handoff дээр GLB SHA/revision, topology/placement profile болон шаардлагатай front/back/sides/detail/mobile captures-ийг тааруулж, дараа QA-аар шалгуулах. clean-v2 candidate хэвээр.
- 2026-11-14T14:46:08.450Z · atelierx-designer-0003 · BÀN GIAO Designer ATEL-15/clean-v2-placement-test-01 trong thread ATEL-9, messageId=73d5131b-7327-4864-98de-0a2ce43af460. Artifacts: quality/evidence/ATEL-15/v2/designer-review.md, placement-profile.json, diagnostic GLB/artwork/browser captures. Candidate SHA gốc còn nguyên. QA cần kiểm độc lập cổ/vai (thanh ngang trên cổ/mũ) và back print bị hood che; catalog/QA report không sửa.
- 2026-11-14T15:09:26.814Z · crewly · WorkItem 29992930-0f82-42e2-b9b5-fdfc3f8fb015 verified → done
