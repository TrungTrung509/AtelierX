---
id: ATEL-35
title: "ATEL-35 · Áo thun kem hoa ngực trái"
status: done
priority: P1
assignee: null
team: null
labels: [ atelierx, standalone-v8 ]
ownerReview: false
createdAt: 2026-11-15T07:41:21.627Z
updatedAt: 2026-11-15T11:07:31.902Z
workItemId: null
requestId: 734d0f84-2aee-4ad8-9ea6-362fb309b3ff
source: request:TKT-007
---

## Description

Đơn áo thun 3D độc lập theo brief chủ dự án; áp dụng PLAN_STANDALONE.md và flow v8. Phom xám trước trang trí, nền trung tính tương phản; không dùng mannequin.

## Acceptance criteria

- [ ] Áo thun độc lập có khối lượng, cổ/tay/thân nối hợp lý và nếp vải; ảnh xám front/back/side/oblique được Lead và QA duyệt sớm.
- [ ] Màu kem với họa tiết hoa nhỏ ở ngực trái; texture/material provenance và garment revision thống nhất.
- [ ] Viewer Crewly desktop mở, xoay, zoom được; có bốn ảnh desktop front/back/side/oblique, mô tả tiếng Việt 2–4 câu, chất liệu mô phỏng và 3–4 thông số có nguồn; QA kiểm đúng revision và quality gate pass trước publish.

## Log

- 2026-11-15T07:41:21.627Z · atelierx-team-leader-0001 · created (ready)
- 2026-11-15T07:43:50.593Z · atelierx-team-leader-0001 · Thread điều phối ATEL-35 đã mở trong AtelierX Fashion Studio; root messageId=e793f080-22d1-4258-b5c1-1874267ccd75. Đơn mới theo PLAN_STANDALONE.md + v8; ATEL-23 giữ stopped.
- 2026-11-15T07:44:00.307Z · atelierx-team-leader-0001 · delegated by atelierx-team-leader-0001
- 2026-11-15T07:44:00.307Z · atelierx-team-leader-0001 · assigned to atelierx-designer-0003 — WorkItem e7291b54-dda0-4375-b78e-a6b450ca8b9e
- 2026-11-15T07:47:29.694Z · atelierx-team-leader-0001 · Các lane đã mở: Designer WorkItem e7291b54-dda0-4375-b78e-a6b450ca8b9e (ticket ATEL-35); Research e729? actual 660e4a21-dae3-46dd-9730-004c061bbeec; Material 0c7969e5-85f6-4ff8-9c35-fd2482179c9c; Visual 7b418437-4c02-488b-ba09-262d84f958ff. Thread root e793f080-22d1-4258-b5c1-1874267ccd75; GIAO Designer=54573d89-eb72-4e50-a56d-f9b1ed43cd54, Research=2ed42fac-2483-49d6-848c-b71f12a3d719, Material=7d1552d9-22be-4e79-b695-717341d970e4.
- 2026-11-15T07:47:52.570Z · atelierx-team-leader-0001 · Visual claim/NHẬN VIỆC messageId=7f0337a1-510f-48b0-a0fe-5633f4df2621; GIAO VIỆC Visual messageId=dc4cab94-92ae-4c5b-a6f3-6fa14fe5ac6c. Visual chuẩn bị standalone scene, chưa stage trước shape review.
- 2026-11-15T07:48:42.314Z · atelierx-tpm-0002 · Research NHẬN VIỆC đăng trong thread ATEL-35, messageId ab9768fc-ccd9-420e-ae81-0e546e536a53. Bàn giao dự kiến: orders/ATEL-35/research/manifest.json, artwork/atel35-chest-flower-v1.svg, art-direction.md. SVG nguyên bản chưa áp mesh. Rà metadata hai phom user-supplied tshirt/UV; user-t-shirt-922001c3-v1 đề xuất Designer thử trước, chưa shape/UV-approved.
- 2026-11-15T07:49:36.857Z · atelierx-frontend-developer-0006 · Visual prep standalone đã bàn giao: orders/ATEL-35/visual/scene-plan.md (SHA 6f29ca49c6baff0687bb7abebb3a15c904d77308502cd3963eff417c56c88d31), showcase-job-draft.json (SHA 454aedd09a66ba611fa18028127244896c15286d8968ed365c3daec212d7907a), viewer-scaffold.html (SHA ea2fd788dcf560b8ccf42a9de8c6c485c7c526eed22d225a7ebe37d13787917d). Standalone=true, maskBody=false; scene neutral gray/soft studio light, camera control/4 preset angles/zoom/mobile layout. Viewer target showcase/products/ATEL-35/v1/index.html after shape-review. No GLB xám yet; no build stage, catalog update or shape approval. NHẬN VIỆC channel messageId 7f0337a1-510f-48b0-a0fe-5633f4df2621.
- 2026-11-15T07:51:23.088Z · atelierx-tpm-0002 · Research v1 handoff trực tiếp Studio Lead (DM thành công): orders/ATEL-35/research/manifest.json, artwork/atel35-chest-flower-v1.svg, art-direction.md. SVG gốc, trong suốt, chưa áp mesh. Rà 2 candidate user-supplied tshirt có UV0; đề xuất Designer thử user-t-shirt-922001c3-v1 vì lưới dày hơn; cả hai vẫn candidate, chưa shape/UV placement approved. XML/JSON/checksum/registry validation PASS. Chưa có nguồn vật liệu hoặc thông số để đưa vào content; chờ Material/Designer cung cấp, không suy đoán.
- 2026-11-15T07:53:48.196Z · atelierx-team-leader-0001 · Research đã bàn giao qua channel thread messageId=d37e7782-e06f-48c7-b302-ee71e5e6f550: SVG hoa 5 cánh nguyên bản, shortlist 2 candidate tee; đề xuất quality/candidates/user-supplied/t-shirt.glb (SHA 922001c3…e237) nhưng UV placement/chest và silhouette chưa duyệt. Material preset orders/ATEL-35/material/pbr-preset-v1.json SHA 5555b6b4…c79c, cotton-like mô phỏng. Visual scene scaffold đã có handoff thread messageId=77986b52-4343-4035-a2ff-63017deefd30, chưa build stage trước shape review. Designer đang dựng v0.1 xám; QA chưa có bằng chứng để duyệt.
- 2026-11-15T07:58:52.823Z · atelierx-team-leader-0001 · Designer v0.1-gray handoff in thread messageId=0061b702-652d-4f21-80ca-60e85ec69954. Garment SHA 48a976465da23f4e235728c4a4b42d11d3afcbcd1d9632980c7324019fb31805; provenance source/UV/topology/normalization in orders/ATEL-35/v0.1/designer/source-uv-provenance.json. Browser preview loaded/rotate/zoom/desktop/mobile=true, errors=[]; actual 5 captures hash-matched under quality/evidence/ATEL-35/v0.1. Lead inspected; requested QA shape review early on ATEL-39 / WorkItem 46509693-9123-4c53-be5f-32dc71aafeab; GIAO QA messageId=18342cf2-6250-4a21-b426-4ea14d0151ee. No artwork/material stage before verdict.
- 2026-11-15T08:01:48.787Z · atelierx-qa-0004 · QA ATEL-39 claimed; NHẬN VIỆC posted in thread e793f080-22d1-4258-b5c1-1874267ccd75 (messageId 53fdb400-a409-40e9-bc45-a6299723425e). Shape review v0.1-gray at orders/ATEL-35/v0.1/shape-review.json; TRẢ LẠI posted in same thread (messageId 1576e59f-b055-40f8-93a7-35adafb32329): body/sleeves visually connected; no visibly detached islands; front reads polo due collar/V placket, needs Lead disposition before decoration.
- 2026-11-15T08:03:20.496Z · atelierx-team-leader-0001 · QA shape-review v0.1-gray được đối chiếu cùng ảnh front/oblique/side; cổ ve và nẹp V đọc thành polo, không khớp brief áo thun cơ bản. v0.1 giữ nguyên, chưa duyệt; Lead yêu cầu Designer đổi sang candidate dự phòng t-shirt (1).glb để dựng bản xám standalone mới, chưa trang trí. Giao QA review tiếp khi có đủ bundle mới.
- 2026-11-15T08:05:55.403Z · crewly · work continues in WorkItem e7291b54-dda0-4375-b78e-a6b450ca8b9e:retry:1
- 2026-11-15T08:06:45.907Z · atelierx-team-leader-0001 · Lead xác minh bundle QA v0.1 và trả lại Designer WorkItem e7291b54-dda0-4375-b78e-a6b450ca8b9e; hệ thống tạo Retry 1 e7291b54-dda0-4375-b78e-a6b450ca8b9e:retry:1, hiện running cho atelierx-designer-0003. Scope: đổi nguồn sang t-shirt (1).glb, chỉ bản xám standalone và captures/hash, chưa trang trí; v0.1 giữ nguyên. QA sẽ review khi handoff mới. Đã thử ghi quyết định vào thread team nhưng session list-channels trả channels=[], channel post bị từ chối; thông báo đã gửi DM trực tiếp.
- 2026-11-15T08:36:56.628Z · owner · updated acceptance criteria — Chủ dự án bỏ yêu cầu mobile. Chỉ kiểm viewer desktop: mở, xoay, zoom; không chờ/chụp mobile để nghiệm thu.
- 2026-11-15T08:38:43.617Z · atelierx-frontend-developer-0006 · updated acceptance criteria — Owner bỏ tiêu chí mobile; nghiệm thu viewer desktop mở/xoay/zoom và bốn ảnh front/back/side/oblique. Không tạo hay chờ task mobile.
- 2026-11-15T08:38:46.966Z · atelierx-team-leader-0001 · updated acceptance criteria — Owner update: mobile removed from acceptance; verify only desktop load/rotation/zoom and four desktop views. Do not block on or create mobile work.
- 2026-11-15T08:43:46.470Z · atelierx-team-leader-0001 · in_progress → ready — Lead review v0.2-gray: browser desktop load/rotate/zoom và bốn góc đạt; phom chưa đạt vì cổ thiếu bo rõ, thân/tay thiếu nếp gấp. Theo PLAN_STANDALONE chuyển hẳn sang source hoặc phương pháp khác, không tiếp tục sửa cùng low-poly source. Owner bỏ mobile; chỉ desktop.
- 2026-11-15T08:44:03.359Z · atelierx-team-leader-0001 · delegated by atelierx-team-leader-0001
- 2026-11-15T08:44:03.359Z · atelierx-team-leader-0001 · assigned to atelierx-designer-0003 — WorkItem 834572fd-bede-404f-a884-285bc7e77fa8
- 2026-11-15T08:56:11.619Z · atelierx-team-leader-0001 · in_progress → ready — v0.3-gray bị chặn: candidate MakeHuman đã có ghi chú loại khỏi thư viện tại quality/BASE_AUDIT.md; ảnh cũng không đáp ứng cổ/nếp. Lead kiểm tra thư viện preview và chọn source user-authorized t-shirt___lp.glb SHA 7158e4b64cdc94df03a3ac14cf72df8a6716bdd2650dd0472df87e4cbf27c3c3: ảnh nguồn thể hiện cổ tròn có dải và nếp vải; thử một hướng source mới, không sửa v0.3.
- 2026-11-15T08:56:33.014Z · atelierx-team-leader-0001 · delegated by atelierx-team-leader-0001
- 2026-11-15T08:56:33.014Z · atelierx-team-leader-0001 · assigned to atelierx-designer-0003 — WorkItem ee9d6cb1-295b-4f9b-8713-072906ce34a4
- 2026-11-15T09:03:32.177Z · atelierx-team-leader-0001 · Lead correction before processing: direct preview showed t-shirt___lp.glb is long-sleeve raglan with 3-button placket, so it does not match brief. Same WorkItem ee9d6cb1-295b-4f9b-8713-072906ce34a4 updated via note/DM to use user-authorized quality/candidates/user-supplied/tshirt.glb (registry user-tshirt-c21ef90d-v1, SHA c21ef90d256b1f28177e8468cc9f69a83dbdd0cc4111addc23f9893e82a1103a), short-sleeve crew-neck preview. No new task, mobile, Verify, or retry.
- 2026-11-15T09:17:21.557Z · atelierx-team-leader-0001 · in_progress → ready — Designer đã bàn giao v0.5-gray từ tshirt.glb; Lead đã đối chiếu ảnh/hash/browser. Theo owner không chờ Verify trung gian; chuyển lượt sang QA độc lập phom bằng bốn ảnh desktop trước tích hợp artwork/material.

- 2026-11-15T10:01:35.187Z · system:atelierx-reconcile · Team product ATEL-35/v1 complete; QA pass and catalog complete. Owner review remains TKT-007.
- 2026-11-15T11:07:31.902Z · owner · updated title — Chuẩn hóa tên công đoạn; giữ nguyên ID và trạng thái.
