---
id: ATEL-22
title: "ATEL-22: QA sản phẩm hoodie đầu lâu ATEL-1/v3 trên viewer"
status: done
priority: P1
assignee: atelierx-qa-0004
team: null
labels: [ atelierx, ATEL-1, qa, product-gate ]
ownerReview: false
createdAt: 2026-11-14T16:12:13.540Z
updatedAt: 2026-11-14T16:34:11.633Z
workItemId: 6742fdd3-ca3c-475a-a140-0d19c9d54c66:retry:1
requestId: null
source: agent:atelierx-team-leader-0001
---

## Description

Goal: QA độc lập sản phẩm ATEL-1/v3 trên viewer tích hợp trong Sàn trưng bày, với đúng product GLB SHA `e4e6de8795a341321e22d4aa852e56836fd58fab1411ee7f5590224c47ed7cb1` và base geometry SHA `34374edd321b7e8396656e7d5a003e359d9349c5cc35bb5bc37a5c99145141bf`.

Expected outcome: mở URL viewer nội bộ final sau handoff ATEL-21; xem/capture front/back/left/right/detail/mobile; xác nhận màu hoodie đen, đầu lâu một mắt rõ ở mặt lưng, mặt trước trơn, vị trí dưới hood/trên hem, page load/rotate/zoom desktop/mobile. Viết `quality/reports/ATEL-1/v3.json` theo template, chấm sáu tiêu chí, ghi `featureChecks` riêng cho từng yêu cầu brief, report hash và ảnh capture cùng revision.

Có thể chuẩn bị checklist và xem temporary preview `quality/evidence/ATEL-1/v3/README.md` trong khi Visual Studio tích hợp; kết luận cuối phải dựa trên viewer chính thức và đúng product SHA.

Out of scope: không sửa GLB/viewer, không cập nhật base-meshes registry/catalog, không tự duyệt/publish. Lead sẽ đối chiếu report và chạy quality gate.

Evidence needed: browser captures six views, QA report hợp lệ và trỏ đúng revision/product SHA/viewer URL, kết luận pass/return cùng blocker và chủ sửa cụ thể.

## Acceptance criteria

- [ ] QA kiểm viewer chính thức của ATEL-1/v3 và xác minh GLB hash e4e6de8795a341321e22d4aa852e56836fd58fab1411ee7f5590224c47ed7cb1, geometry hash 34374edd321b7e8396656e7d5a003e359d9349c5cc35bb5bc37a5c99145141bf.
- [ ] Có browser captures front/back/left/right/detail/mobile và report quality/reports/ATEL-1/v3.json, featureChecks cho màu, hoodie, đầu lâu một mắt, mặt lưng, viewer desktop/mobile.
- [ ] Không sửa asset/viewer/registry/catalog và không tự approve; ghi rõ verdict, blockers, owner sửa, report path/hash.

## Log

- 2026-11-14T16:12:13.540Z · atelierx-team-leader-0001 · created (ready)
- 2026-11-14T16:12:21.323Z · atelierx-team-leader-0001 · assigned to atelierx-qa-0004 — WorkItem 6742fdd3-ca3c-475a-a140-0d19c9d54c66
- 2026-11-14T16:13:01.361Z · atelierx-team-leader-0001 · Ticket QA product v3 assigned to atelierx-qa-0004, WorkItem 6742fdd3-ca3c-475a-a140-0d19c9d54c66; awaits claim while Visual Studio integrates official viewer. Temporary preview, product SHA and exact G1 geometry SHA linked in ticket description.
- 2026-11-14T16:13:21.299Z · atelierx-team-leader-0001 · GIAO VIỆC đăng trong thread ATEL-1; WorkItem 6742fdd3-ca3c-475a-a140-0d19c9d54c66 running với atelierx-qa-0004.
- 2026-11-14T16:13:35.883Z · atelierx-qa-0004 · NHẬN VIỆC đăng trong thread ATEL-1; messageId=6eb74d54-8bf6-487f-b1c8-f047f77be3af. Đã gửi structured acceptance cho Studio Lead; đang chờ xác nhận scope trước khi chuẩn bị checklist/temporary preview theo contract.
- 2026-11-14T16:13:49.451Z · atelierx-team-leader-0001 · QA đã claim WorkItem 6742fdd3-ca3c-475a-a140-0d19c9d54c66 và đăng NHẬN VIỆC trong ATEL-1 thread messageId 6eb74d54-8bf6-487f-b1c8-f047f77be3af. Lead xác nhận scope; QA chuẩn bị checklist/temporary preview, verdict cuối sau viewer chính thức ATEL-21.
- 2026-11-14T16:16:14.554Z · atelierx-team-leader-0001 · ATEL-21 đã verified; Lead cập nhật showcase/catalog.json trỏ ATEL-1/v3 chính thức nhưng status vẫn preview. QA có thể kiểm viewer Sàn trưng bày products/ATEL-1/v3/index.html; product GLB SHA e4e6de87… geometry SHA 34374edd…; report cần gắn đúng revision.
- 2026-11-14T16:22:26.030Z · atelierx-qa-0004 · QA retest viewer chính thức hoàn tất; report quality/reports/ATEL-1/v3.json, SHA-256 db77774884cfb72f61f5b50158f08eb4e25e680389a212512e1972f85f3fb96d. Handoff ĐẠT đăng trong thread ATEL-1; messageId=dcbcb92b-902c-411d-80ee-a4257ae53833. Official viewer URL products/ATEL-1/v3/index.html; product GLB SHA e4e6de8795a341321e22d4aa852e56836fd58fab1411ee7f5590224c47ed7cb1 và geometry SHA 34374edd321b7e8396656e7d5a003e359d9349c5cc35bb5bc37a5c99145141bf khớp; HTTP 200. Captures official-browser 6 góc; camera mapping front.png=back printed (180°), back.png=front blank (0°). Browser loaded/rotated/zoomed desktop/mobile=true, errors=[]. Scores silhouette/construction/artwork/placement/material=4, web=5; featureChecks đạt, không blocker. Product vẫn preview, chờ Lead quality gate/approval.
- 2026-11-14T16:24:31.118Z · crewly · work continues in WorkItem 6742fdd3-ca3c-475a-a140-0d19c9d54c66:retry:1
- 2026-11-14T16:29:49.291Z · atelierx-qa-0004 · Retry 1 NHẬN VIỆC đăng trong thread ATEL-1; messageId=c751bdd0-3f13-4076-ade5-94954ac167eb. Cập nhật report theo feedback: featureChecks mỗi feature khớp brief và có một path; assets.model/viewer trùng relative catalog path; browser.url runtime. Đã rà lại print ở toàn thân/mobile: skull một mắt còn nhận diện rõ, artwork 4/5 do kích thước vừa phải. JSON/path validation đạt; leadApproved=false giữ đúng quyền Lead. Handoff cập nhật trong thread ATEL-1; messageId=af79f17b-a5dd-4c06-8319-166881c0158f; report hash 07efa353e35fa0cf48d0667ce4f3ebb9991593b85ebfe4e149fdffe8a3e88e2d. Lead sẽ review và chạy gate theo path resolver đã cập nhật; catalog không đổi.
- 2026-11-14T16:32:17.956Z · atelierx-qa-0004 · Retry 1 hoàn tất và handoff thuần Việt trong thread ATEL-1; messageId=b77199ad-207e-42be-ab3e-21b2f82f6ba0. Report quality/reports/ATEL-1/v3.json SHA=1082d75570eb0fb0bdcbfcc1021f242ae24650d8374e0f5d3035f3635d434652. FeatureChecks khớp requiredFeatures, mỗi evidence một file; assets.model/viewer khớp path catalog; browser.url runtime; leadApproved=false. Tạo lại sáu browser captures trong quality/evidence/ATEL-1/v3/retry1-browser/ sau khi retry bắt đầu, manifest hashes trong report đã kiểm. Browser chính thức đạt, product/geometry SHA khớp. Artwork toàn thân đọc được nhưng vừa phải; artwork 4/5. Catalog giữ preview; Lead review ảnh và chạy gate.
- 2026-11-14T16:34:11.633Z · crewly · WorkItem 6742fdd3-ca3c-475a-a140-0d19c9d54c66:retry:1 verified → done

- 2026-11-14T16:36:00.000Z · atelierx-team-leader-0001 · Retry 1 được Lead verify và chấp nhận; report SHA sau lead approval ebd9ca02d47ca028397eb4cc81e586ece695c9287b9343e36ee4bdefa7b5229b. Sáu capture mới/manifest khớp, official viewer pass; quality gate và publish pass. Quyết định Lead DUYỆT đăng trong ATEL-1 thread messageId 16429bd8-829a-40f2-9842-1e80fe7c227f.
