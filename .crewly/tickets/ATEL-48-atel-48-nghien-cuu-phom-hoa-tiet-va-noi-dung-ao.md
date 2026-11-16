---
id: ATEL-48
title: ATEL-47 · Nghiên cứu phom, họa tiết và nội dung · Áo sơ mi xanh sọc trắng
status: done
priority: P2
assignee: atelierx-tpm-0002
team: af30c001-2789-4f20-b917-000000000010
labels: []
ownerReview: false
createdAt: 2026-11-15T14:58:54.125Z
updatedAt: 2026-11-15T16:36:21.899Z
workItemId: aceab7cc-1f00-41a0-81b8-922a0d359a81
requestId: 7580966e-280f-471f-b141-1d9f2924b260
source: request:TKT-009
---

## Description

Goal: Tạo áo sơ mi công sở 3D độc lập cho người trẻ đi làm. Expected Outcome: áo phom vừa, xanh da trời sáng, sọc dọc trắng mảnh đều; cổ sơ mi, hàng khuy trước, tay dài, cổ tay có khuy; có volume và nếp vải tự nhiên, xoay/zoom desktop trong Sàn trưng bày Crewly. Eval Criteria: không mannequin; phom xám được xem qua ảnh thật front/back/side/oblique và QA shape pass trước surface; material, content, viewer đồng revision; QA độc lập browser desktop pass; quality gate và catalog khớp. Nhiệm vụ Research: chạy studio-base shirt; dùng phom ready đã qua QA nếu phù hợp, nếu không đề xuất tối đa hai nguồn có ảnh trước/sau và provenance trong 15 phút. Không gắn ready nếu chưa có QA. Chốt nguồn họa tiết sọc mảnh, artwork/placement notes và content nháp tiếng Việt; để trống kích thước đến khi có mesh.

## Acceptance criteria

- [ ] Tối đa hai nguồn hoặc một phom ready có ảnh trước/sau, provenance/hash và lý do phù hợp; đề xuất sọc/placement rõ; content nháp tiếng Việt 2–4 câu.

## Log

- 2026-11-15T14:58:54.125Z · atelierx-team-leader-0001 · created (ready)
- 2026-11-15T15:00:40.920Z · atelierx-team-leader-0001 · updated title
- 2026-11-15T15:01:00.572Z · atelierx-team-leader-0001 · delegated by atelierx-team-leader-0001
- 2026-11-15T15:01:00.572Z · atelierx-team-leader-0001 · assigned to atelierx-tpm-0002 — WorkItem c9d45789-3b6e-4ae4-8c95-626ff7e13284
- 2026-11-15T15:13:02.278Z · atelierx-tpm-0002 · Research handoff v1: orders/ATEL-47/v1/research/manifest.json (14 artifacts with SHA-256), shortlist.json, handoff.md, pattern tile/placement notes and Vietnamese content draft. Message IDs in ATEL-47 channel thread: acceptance 543c95ed-b84c-42a2-bcc4-e2350ac5c088; handoff 6f810bdd-763c-4b3d-b8b6-e0f3dcd9bc34; path correction 65f3b3a1-83dd-4964-a777-17f995b0313d. Source is candidate only; no ready shirt base found. Attachment transfer failed because this session is not signed in to Crewly Cloud; shared workspace paths posted in channel. Browser source preview zoomed=false; not shape QA. ATEL-23 remains stopped; no registry changes.
- 2026-11-15T15:13:36.321Z · crewly · WorkItem c9d45789-3b6e-4ae4-8c95-626ff7e13284 done → done
- 2026-11-15T15:37:14.358Z · atelierx-tpm-0002 · Designer response received: ATEL-47/v1 geometry is being built standalone from brief; candidate B only visually screened, no mesh/UV reuse. GLB v1 orders/ATEL-47/v1/designer/garment-gray-v1.glb SHA-256 e44f8c74a3c6d555e9cad8827ccd4ab4ed91dc75bb404045992683ce0867d1eb. QA returned three blockers (rear shoulder seam, collar stand/leaves not joined, torso folds unclear); Designer is correcting v2 under same flow/WorkItem, ETA 15:52 UTC. No shape pass; Material must wait.
- 2026-11-15T16:31:56.459Z · atelierx-team-leader-0001 · done → ready — Shape v4 passed independent QA; finalize concise Vietnamese content against v4 display-envelope measurements and the approved simulated cotton-poplin/pinstripe brief.
- 2026-11-15T16:31:56.870Z · atelierx-team-leader-0001 · assigned to atelierx-tpm-0002 — WorkItem aceab7cc-1f00-41a0-81b8-922a0d359a81
- 2026-11-15T16:35:52.104Z · atelierx-tpm-0002 · Content final v4 completed per Lead direction. Artifact orders/ATEL-47/v4/research/content-v4.json SHA-256 6a34fc63cc24857044dbd83987043426e664f7b830aa6fee2024e68f5d005af6. Content manifest orders/ATEL-47/v4/research/content-manifest-v4.json SHA-256 05159311941a768a6f2ad93631806602260c0f6c884c580f4500610ea0e673ce references the v4 shape QA pass, provenance, material preset and placement notes. Includes 82.6 × 59.1 × 19.3 cm display-envelope measurements sourced from provenance-v4; explicitly not garment/manufacturing size. `studio-flow handoff content` recorded event content:v4 for Visual; no viewer/catalog work.
- 2026-11-15T16:36:21.899Z · crewly · WorkItem aceab7cc-1f00-41a0-81b8-922a0d359a81 done → done
