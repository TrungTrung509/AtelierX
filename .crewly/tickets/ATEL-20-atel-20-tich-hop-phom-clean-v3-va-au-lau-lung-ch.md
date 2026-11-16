---
id: ATEL-20
title: "ATEL-20: Tích hợp phom clean-v3 và đầu lâu lưng cho ATEL-1"
status: done
priority: P1
assignee: atelierx-designer-0003
team: null
labels: [ atelierx, ATEL-1, design, approved-base ]
ownerReview: false
createdAt: 2026-11-14T15:54:14.895Z
updatedAt: 2026-11-14T16:13:00.990Z
workItemId: 07ca64d9-6a31-449a-b43e-df924903212a
requestId: null
source: agent:atelierx-team-leader-0001
---

## Description

Goal: tạo revision sản phẩm ATEL-1 hoodie đen với đầu lâu một mắt ở lưng, dùng đúng phom G1 đã duyệt `grab3d-hoodie-clean-v2-neckfix-placement-v3`, geometry SHA-256 `34374edd321b7e8396656e7d5a003e359d9349c5cc35bb5bc37a5c99145141bf`. Base source `grab3d-hoodie-clean-v2` SHA `42dc0075e632eab84256f71d9cc88b6eb6d54d04cbff3682f548f62e55994a13` vẫn là candidate; không dùng SHA nguồn để đại diện geometry revision đã duyệt.

Expected outcome: GLB sản phẩm đen với đầu lâu một mắt dễ nhận ra ở lưng, dựa trên mesh G1 được duyệt; profile/manifest ghi rõ baseMeshId, geometry SHA, artwork, placement, material và revision mới (ATEL-1/v3). Gửi handoff cho Lead và Visual Studio để tích hợp viewer; QA sẽ retest sản phẩm sau tích hợp.

Out of scope: không sửa QA report, base-meshes registry, showcase/catalog, viewer hoặc không tự duyệt/publish sản phẩm.

Evidence needed: GLB, artwork nguồn, manifest/profile, SHA-256, ảnh browser trước/sau/trái/phải/detail/mobile cho bản tích hợp khi có; ghi rõ chỗ lưu và hạn chế.

## Acceptance criteria

- [ ] Dùng baseMeshId grab3d-hoodie-clean-v2-neckfix-placement-v3 với geometry SHA 34374edd321b7e8396656e7d5a003e359d9349c5cc35bb5bc37a5c99145141bf; không tham chiếu nhầm source SHA 42dc0075… như geometry revision.
- [ ] Tạo hoodie đen theo brief ATEL-1, đầu lâu một mắt ở giữa lưng nhận diện rõ ở kích thước viewer; mặt trước không có artwork ngoài yêu cầu.
- [ ] Tạo GLB + artwork + placement/profile + manifest cho revision mới, ghi nguồn/license base, baseMeshId và checksum, không ghi đè v2 hay candidate nguồn.
- [ ] Bàn giao bằng tiếng Việt với đường dẫn, SHA, ảnh browser thật và người nhận là Lead/Visual Studio; không tự đánh dấu sản phẩm complete.

## Log

- 2026-11-14T15:54:14.895Z · atelierx-team-leader-0001 · created (ready)
- 2026-11-14T15:54:46.689Z · atelierx-team-leader-0001 · updated description
- 2026-11-14T15:54:46.924Z · atelierx-team-leader-0001 · assigned to atelierx-designer-0003 — WorkItem 07ca64d9-6a31-449a-b43e-df924903212a
- 2026-11-14T15:56:04.312Z · atelierx-designer-0003 · NHẬN VIỆC đã đăng trong thread ATEL-9; WorkItem 07ca64d9-6a31-449a-b43e-df924903212a; bắt đầu ATEL-1/v3 theo đúng approved baseMeshId và geometry SHA 34374edd…; source candidate SHA chỉ được ghi làm nguồn, không dùng làm geometry revision.
- 2026-11-14T15:56:42.159Z · atelierx-team-leader-0001 · GIAO VIỆC posted in ATEL-1 team thread messageId 5434deb6-21a5-4b0d-acd0-955c5299213e. WorkItem 07ca64d9-6a31-449a-b43e-df924903212a confirmed running with designer. Yêu cầu Designer đăng NHẬN VIỆC vào thread ATEL-1; hiện đã claim và gửi ack nhầm trong thread ATEL-9.
- 2026-11-14T15:57:11.512Z · atelierx-designer-0003 · NHẬN VIỆC đúng thread riêng ATEL-1; messageId 1? xác nhận output kế tiếp. Đã claim WorkItem và xác nhận baseMeshId grab3d-hoodie-clean-v2-neckfix-placement-v3 cùng geometry SHA 34374edd321b7e8396656e7d5a003e359d9349c5cc35bb5bc37a5c99145141bf.
- 2026-11-14T15:57:22.273Z · atelierx-designer-0003 · NHẬN VIỆC trong thread ATEL-1 root 5434deb6-21a5-4b0d-acd0-955c5299213e đã được xác nhận đăng thành công; messageId=52660167-7740-44e9-9f3c-0a74e09cd6f1. Nội dung nêu đúng baseMeshId và geometry SHA.
- 2026-11-14T16:09:22.853Z · atelierx-designer-0003 · Browser QA preview-ийн эхний lỗi cụ thể: model-viewer console THREE.GLTFLoader: Couldn’t load texture Promise (3x), sau đó TypeError: Cannot read properties of null (reading slice) trong model-viewer.min.js; HTML/GLB/module đều HTTP 200, không có requestfailed. Nguyên nhân xác nhận trong build GLB: BIN chunk type bị ghi literal backslash thay vì null byte. Đã sửa thành BIN\\0 đúng GLB, rebuild; browser loaded/rotated/zoomed/desktop/mobile=true, errors=[]. Capture cuối và hash đồng bộ ở quality/evidence/ATEL-1/v3.
- 2026-11-14T16:09:23.006Z · atelierx-designer-0003 · BÀN GIAO đăng đúng thread riêng ATEL-1; messageId=433ae9c3-2b37-4030-be54-a26ae0b965a1. Revision ATEL-1/v3, product GLB SHA-256 e4e6de8795a341321e22d4aa852e56836fd58fab1411ee7f5590224c47ed7cb1; approved geometry SHA-256 34374edd321b7e8396656e7d5a003e359d9349c5cc35bb5bc37a5c99145141bf; source candidate SHA 42dc0075e632eab84256f71d9cc88b6eb6d54d04cbff3682f548f62e55994a13 unchanged. Profile/manifest/capture hashes written; 15% artwork enlargement checked in browser, centered below hood and above hem; front blank. Lead + Visual Studio to integrate; QA retest pending. Product catalog remains preview.
- 2026-11-14T16:11:40.293Z · crewly · WorkItem 07ca64d9-6a31-449a-b43e-df924903212a verified → done
- 2026-11-14T16:13:00.990Z · atelierx-team-leader-0001 · Lead verify hoàn tất: product SHA e4e6de8795a341321e22d4aa852e56836fd58fab1411ee7f5590224c47ed7cb1; geometry payload khớp base G1 SHA 34374edd…; six capture hashes và browser preview flags khớp. Handoff Designer messageId 433ae9c3-2b37-4030-be54-a26ae0b965a1 trong thread ATEL-1. Ticket ATEL-21/WorkItem 287172a4-d2d1-4bdf-90a1-ce8775c387b4 đã giao Visual Studio để tích hợp viewer.
