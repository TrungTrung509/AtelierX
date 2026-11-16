---
id: ATEL-2
title: "ATEL-2: Hoodie đen và họa tiết đầu lâu lưng v1"
status: done
priority: P2
assignee: atelierx-designer-0003
team: null
labels: [ atelierx, ATEL-1, asset ]
ownerReview: false
createdAt: 2026-11-13T12:41:33.072Z
updatedAt: 2026-11-13T13:24:00.479Z
workItemId: 35b45d5f-3e5f-4c8f-9026-c6a72bbeac82
requestId: null
source: agent:atelierx-team-leader-0001
---

## Description

Goal: dựng asset 3D hoodie pullover đen và họa tiết đầu lâu đúng mặt lưng cho ATEL-1 revision v1. Expected outcome: GLB, texture/artwork source, generator và test có thể tái tạo; bàn giao rõ file, revision và kết quả validator. Eval tập trung vào tính hợp lệ/tái tạo của asset; kiểm viewer/browser thật thuộc ATEL-3 và ATEL-1.

## Acceptance criteria

- [ ] GLB v1 tại site-atel-1/dist/assets/models/ATEL-2/v1/hoodie-skull-v1.glb hợp lệ theo Khronos glTF Validator, 0 errors và 0 warnings.
- [ ] Có texture/artwork source, generator và tests; tests pass; asset manifest ghi revision và các file đầu ra.
- [ ] Generator/test xác nhận phom hoodie, mặt trước trơn, họa tiết đầu lâu off-white/xám nằm giữa mặt lưng đúng chiều; runtime browser QA được theo dõi riêng ở ATEL-3/ATEL-1.

## Log

- 2026-11-13T12:41:33.072Z · atelierx-team-leader-0001 · created (backlog)
- 2026-11-13T12:41:37.789Z · atelierx-team-leader-0001 · assigned to atelierx-designer-0003 — WorkItem 35b45d5f-3e5f-4c8f-9026-c6a72bbeac82
- 2026-11-13T12:52:16.101Z · atelierx-designer-0003 · Confirmed manual MVP path with Studio Lead. No approved hoodie base/UV, Blender, trimesh, pygltflib, Three.js, or GLB exporter found. Procedural mesh generator is being created under site-atel-1/tools; target asset path site-atel-1/dist/assets/models/ATEL-2/v1/. Viewer validation will be reported separately from structural validation.
- 2026-11-13T13:00:42.050Z · atelierx-team-leader-0001 · updated description, acceptance criteria
- 2026-11-13T13:01:49.480Z · atelierx-designer-0003 · Bundle complete: procedural hoodie GLB v1, PNG texture, SVG artwork, manifest and reproducible generator/test. Khronos Validator 2.0.0-dev.3.10: 0 errors, 0 warnings, 0 infos (3,927 vertices / 7,156 triangles). Generator tests 2/2 pass. Viewer QA intentionally deferred to ATEL-3/ATEL-1 per Studio Lead; no runtime browser packages installed in system.
- 2026-11-13T13:24:00.479Z · crewly · WorkItem 35b45d5f-3e5f-4c8f-9026-c6a72bbeac82 verified → done
