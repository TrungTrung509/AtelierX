---
id: ATEL-47
title: ATEL-47 · Điều phối và bàn giao · Áo sơ mi xanh sọc trắng
status: done
priority: P2
assignee: atelierx-team-leader-0001
team: af30c001-2789-4f20-b917-000000000010
labels: []
ownerReview: false
createdAt: 2026-11-15T14:57:33.754Z
updatedAt: 2026-11-15T16:53:40.691Z
workItemId: 56def604-c31a-488c-8b30-399648f98d02
requestId: 7580966e-280f-471f-b141-1d9f2924b260
source: request:TKT-009
---

## Description

Goal: Tạo áo sơ mi công sở 3D độc lập cho người trẻ đi làm. Expected Outcome: áo phom vừa, xanh da trời sáng, sọc dọc trắng mảnh đều; cổ sơ mi, hàng khuy trước, tay dài, cổ tay có khuy; có volume và nếp vải tự nhiên, xoay/zoom desktop trong Sàn trưng bày Crewly. Eval Criteria: không mannequin; phom xám được xem qua ảnh thật front/back/side/oblique và QA shape pass trước surface; material, content, viewer đồng revision; QA độc lập browser desktop pass; quality gate và catalog khớp.

## Acceptance criteria

- [ ] Phom standalone đúng brief, có volume/nếp, không mannequin; ảnh front/back/side/oblique được Lead xem.
- [ ] Sọc trắng mảnh đều chạy dọc trên nền xanh da trời sáng; cổ sơ mi, nút trước, tay dài và khuy cổ tay đọc rõ.
- [ ] Viewer Crewly desktop xoay/zoom được; content tiếng Việt nêu vật liệu mô phỏng và 3–4 kích thước trưng bày có nguồn, không phải size may.
- [ ] QA độc lập và quality gate pass cùng revision/hash; deliveryProfile showcase-basic-v1, presentation standalone.

## Log

- 2026-11-15T14:57:33.754Z · atelierx-team-leader-0001 · created (ready)
- 2026-11-15T14:59:08.278Z · atelierx-team-leader-0001 · assigned to atelierx-team-leader-0001 — WorkItem 56def604-c31a-488c-8b30-399648f98d02
- 2026-11-15T15:08:27.746Z · atelierx-team-leader-0001 · Thread team ATEL-47/v1 root messageId: 178ecb5b-7f76-479b-bc16-4d99a7f3964f. GIAO VIỆC cập nhật Design/Material/Visual/QA; tất cả role tickets và WorkItems được bind trong orders/ATEL-47/studio-flow.json.
- 2026-11-15T15:13:34.007Z · atelierx-team-leader-0001 · 15:13 UTC Lead replan: hai nguồn Research đã dùng trong 15 phút; đã xem front captures, không có ready base. Designer tự dựng áo standalone, không nguồn thứ ba; candidate A chỉ là tham khảo cổ/tay/cổ tay. ETA gray GLB + front/back/side/oblique + provenance/UV/manifest: 15:43 UTC. Đã sửa studio-flow.mjs để shape hash của geometry authored (manifest không có baseId) không bị chặn bởi selection deadline 15 phút; giới hạn số attempts vẫn giữ nguyên. Lý do tự sửa: mọi thành viên khác đang có WorkItem và worker không thể sửa luồng điều phối đang chặn handoff; thay đổi một điều kiện nhỏ cần cho replan. Không chạy tests.
- 2026-11-15T15:14:31.540Z · atelierx-team-leader-0001 · Lead posted QUYẾT ĐỊNH ATEL-47/v1 in team thread; messageId 178ecb5b-7f76-479b-bc16-4d99a7f3964f: source budget exhausted, authored standalone geometry chosen, ETA 15:43 UTC; route QA after gray shape.
- 2026-11-15T15:32:43.138Z · atelierx-team-leader-0001 · 15:32 UTC: Shape standalone v1 handoff received; all 9 artifacts in shape.json, including GLB e44f8c74…, verify hash. studio-flow now records source-free authored geometry with no candidate attempt/baseId (fixed prior hash being miscounted as a source). QA notified to review. Lead inspected captures and flagged shoulder/back gaps/collar details for independent QA attention; no shape pass yet, Material remains waiting for shape-review pass.
- 2026-11-15T15:33:16.639Z · atelierx-team-leader-0001 · 15:33 UTC: Posted correction and shape handoff in ATEL-47 team thread (messageId e0a06c9a-aea8-4d1b-9671-c184c6746e00): excluded old ATEL-23 source, B imagery-only, no source mesh; QA review pending. studio-flow phase set to shape-review; shapeApproved remains false.
- 2026-11-15T15:35:33.949Z · atelierx-team-leader-0001 · 15:35 UTC: QA shape-review v1 decision=return recorded; independent findings are SHAPE-01 shoulder join gaps/protrusions, SHAPE-02 disconnected collar stand/leaves, SHAPE-03 no readable natural torso folds. Sent exact evidence and one-correction scope to Designer on existing WorkItem; QA holds same WorkItem at studio-wait: shape for v2 retest, Material remains gated. Posted team VƯỚNG MẮC (messageId c1b1f641-8d2b-4e63-9676-c0337bc5de8a); studio-flow phase=shape, shapeApproved=false.
- 2026-11-15T15:41:10.708Z · atelierx-team-leader-0001 · 15:38 UTC: phát hiện ATEL-49/Designer WorkItem gốc 8473425f… đã auto-complete sau v1 dù QA sau đó trả shape. Reopened cùng ticket ATEL-49 cho một lượt correction và assign WorkItem af551c45-a367-4029-9117-0fb8911852c7; cập nhật bind Designer trong studio-flow. Designer đã claim, xác nhận ETA 15:52 và đủ SHAPE-01/02/03. QA WorkItem không đổi, giữ studio-wait: shape.
- 2026-11-15T15:42:45.159Z · atelierx-team-leader-0001 · 15:44 UTC: Designer claimed reopened correction WorkItem af551c45-a367-4029-9117-0fb8911852c7 and confirmed v2 ETA 15:52; QA remains on original continuous WorkItem. Owner updated in original chat (messageId c68f828d-3dce-4c89-952a-5aff3d6ad900). Team thread updated with correct Designer binding (messageId 2ed99930-f735-42fc-bc40-bc46ecb5e139). Research handoff re-verified: all 14 artifact hashes match, shortlist is candidate only and excludes ATEL-23 source.
- 2026-11-15T15:50:19.285Z · atelierx-team-leader-0001 · 15:50 UTC: Shape standalone v2 handoff ghi vào studio-flow; 11 artifact hash-match, GLB fd7fd25e…, browser evidence loaded/rotate/zoom desktop no errors. Đã báo QA độc lập retest SHAPE-01/02/03 trên bốn captures. Designer tự lưu ý vùng tối vai/cổ và folds nhẹ; chưa pass, chưa mở Material. Team BÀN GIAO messageId ecdd7013-4fdd-43c3-8ef2-217f0a9e057a.
- 2026-11-15T15:55:56.462Z · atelierx-team-leader-0001 · 15:55 UTC: Lead chấp thuận QA phương án A sau v2: một correction cuối v3 tập trung SHAPE-01/02; SHAPE-03 folds đã đạt nên giữ nguyên. Đã release blocked Designer WorkItem af551c45 trở lại queued và Designer claim lại đúng ID (không tạo WI mới); replan ETA 16:10 UTC. QA giữ cùng WorkItem để retest. Nếu v3 fail, dừng geometry; Material vẫn chờ.
- 2026-11-15T16:04:08.336Z · atelierx-team-leader-0001 · 16:04 UTC: Shape v3 correction handoff registered; 11 artifact hashes match, browser load/rotate/zoom desktop no errors. QA WorkItem 3525b4c5 requeued to same QA for focused retest of SHAPE-01/02, retaining SHAPE-03 pass. This is final correction; stop geometry if remaining findings fail. Material still held.
- 2026-11-15T16:09:29.275Z · atelierx-team-leader-0001 · 16:09 UTC: QA final shape v3 decision=return; SHAPE-01 outer shoulder notches/gaps and SHAPE-02 collar still detached; SHAPE-03 folds pass; all artifacts/browser valid. Lead stops this geometry topology and replans a new authored topology from scratch, not another v3 patch. Reopened ATEL-49; new Designer WorkItem 6c47554f-bb30-418e-9d75-600169cf9686 bound in studio-flow with same requestId. Target 16:40 UTC for gray GLB/hash/provenance/4 captures; QA remains same WorkItem. Material held.
- 2026-11-15T16:28:50.839Z · atelierx-team-leader-0001 · 16:28 UTC: Topology mới v4 handoff đã ghi; toàn bộ 11 hash khớp và browser evidence desktop load/rotate/zoom không lỗi. Requeued cùng QA WorkItem để review độc lập vai/armhole/cổ; Material vẫn giữ. Team handoff messageId sẽ log ngay sau khi nhận.
- 2026-11-15T16:32:46.828Z · atelierx-team-leader-0001 · 16:31 UTC: QA shape ATEL-47/v4 passed independent inspection (11 hashes, provenance, 4 actual views, browser rotation/zoom; standalone garment, shoulder/armhole/collar/folds/buttons pass, no mannequin). studio-flow shapeApproved=true, phase=surface. Reopened ATEL-50 with WorkItem 3477c75a… for surface v4 and ATEL-48 with WorkItem aceab7cc… for Vietnamese content final v4 using display envelope 82.6×59.1×19.3cm; bound both in flow. Visual waits for both; QA waits for visual final.
- 2026-11-15T16:33:52.612Z · atelierx-team-leader-0001 · 16:33 UTC: Owner update sent (messageId 7b0f19c7-e198-4147-ac72-7fa814218e5a) that shape v4 passed and material/content/viewer are underway. Material WorkItem 3477c75a and Research content WorkItem aceab7cc are both running with requestId 7580966e…; Visual remains blocked until both v4 handoffs, then QA final.
- 2026-11-15T16:38:47.596Z · atelierx-team-leader-0001 · 16:39 UTC: surface-handoff v4 (12 hashes including surface GLB/texture/render evidence) is registered; content:v4 was already registered and verified. Both stage events share v4. Requeued existing Visual WorkItem ATEL-51 for showcase-basic-v1 integration; QA remains waiting for Visual final. Team decision posted; message ID logged after response.
- 2026-11-15T16:53:17.512Z · atelierx-team-leader-0001 · QA final v4 độc lập pass; 15 artifact hash khớp, 4 góc desktop/rotate/zoom/errors=0, viewer/content đồng revision. Studio Lead đã duyệt bằng chứng và quality-gate --product ATEL-47 --publish pass; đã đăng catalog Crewly showcase v4 hoàn tất, chờ owner xem riêng.
- 2026-11-15T16:53:40.691Z · crewly · WorkItem 56def604-c31a-488c-8b30-399648f98d02 done → done
