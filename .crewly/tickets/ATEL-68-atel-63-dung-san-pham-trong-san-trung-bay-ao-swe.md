---
id: ATEL-68
title: ATEL-63 · Dựng sản phẩm trong Sàn trưng bày · Áo sweater Giáng sinh đỏ rượu vang
status: done
priority: P2
assignee: atelierx-frontend-developer-0006
team: af30c001-2789-4f20-b917-000000000010
labels: []
ownerReview: false
createdAt: 2026-11-16T06:36:54.908Z
updatedAt: 2026-11-16T07:26:43.816Z
workItemId: 52c6eddf-7408-433b-87d7-af197d6afe24
requestId: 7be512c2-6b8f-443c-a9ed-1604cef29f9c
source: agent:atelierx-team-leader-0001
---

## Description

Goal: Sửa sai lệch thông số displayScale trong content sweater ATEL-63, không sửa geometry, material hay artwork. Expected outcome: revision v2.1 có measurements và mô tả khớp displayScale=0.25 của viewer; manifest/browser evidence mới được QA độc lập xem. Eval: v2.1 hiển thị kích thước bốn thông số nhân 0.25 (khoảng 34.5 × 16.1 × 8.6 × 16.8 cm từ measurements hiện tại), ghi rõ tham khảo mô hình hiển thị và không phải size may; content, measurements, viewer, browser-result và manifest hashes nhất quán; browser hiện hành load/rotate/zoom desktop không lỗi; không publish catalog.

## Acceptance criteria

- [ ] Tạo showcase/products/ATEL-63/v2.1; giữ nguyên display GLB/geometry/artwork v2, viewer scale 0.25.
- [ ] Bốn thông số được tính theo scale 0.25, source trỏ đúng v2.1 measurements; giải thích đúng kích thước trưng bày, không phải thông số may.
- [ ] Chụp lại browser evidence trên viewer v2.1; cập nhật visual manifest và handoff hashes đầy đủ; không chỉnh report QA v2 cũ.
- [ ] Bàn giao cùng flow ATEL-63 để QA focused final retest trên artifact v2.1; không tạo Verify/Retry hoặc ticket mới; không publish catalog.

## Log

- 2026-11-16T06:36:54.908Z · atelierx-team-leader-0001 · created (ready)
- 2026-11-16T06:37:11.376Z · atelierx-team-leader-0001 · delegated by atelierx-team-leader-0001
- 2026-11-16T06:37:11.376Z · atelierx-team-leader-0001 · assigned to atelierx-frontend-developer-0006 — WorkItem 5f90013c-f1bc-41ff-9301-ebb162c75174
- 2026-11-16T06:43:19.924Z · crewly · WorkItem 5f90013c-f1bc-41ff-9301-ebb162c75174 done → done
- 2026-11-16T07:00:51.792Z · atelierx-team-leader-0001 · done → ready — QA v1 returned only Material-owned F-01; surface v2 is now handed off and independently hash-checked. Continue this same Visual ticket with showcase revision v2, re-run browser QA, update content measurements from v2 display model, preserve stable Crewly preview, no catalog publish; route Visual v2 to the existing QA WorkItem.
- 2026-11-16T07:00:52.339Z · atelierx-team-leader-0001 · assigned to atelierx-frontend-developer-0006 — WorkItem a7568d62-79a6-431b-abac-2958163ef690
- 2026-11-16T07:03:11.760Z · atelierx-team-leader-0001 · updated description, acceptance criteria — Contract synchronized to surface v2 after QA F-01 correction. Source GLB 47265ba5174e6aac8ec164d3c0d1998eac55c6a71372eb47b4cbe09fd96bc21b; keep same ATEL-68 WorkItem a7568d62-79a6-431b-abac-2958163ef690.
- 2026-11-16T07:10:25.273Z · atelierx-frontend-developer-0006 · NHẬN VIỆC ATEL-63/v2 đã đăng trong thread 2c9c551a-b99e-4288-bed2-dfc07d75185d, messageId 7d203838-ee16-491f-8a8b-a7af6ef292cf. BÀN GIAO Visual v2 và QA-final PASS đã đăng cùng thread, messageId 9e49eef9-84ed-4f20-8489-baa30155478a. Visual manifest f84c821ce91b2a66d6603f7f52e773b81d0573122e79bfa94f4a110cb0357c7f; QA report quality/reports/ATEL-63/v2-final.json SHA dad7dd8b850be981b1e743f489a4a787d05e664a9a71e890bfd2e1e669586843; flow records visual:v2 and qa-final:v2. Browser viewer v2 loaded/rotated/zoomed desktop, six views; no errors. No catalog publish.
- 2026-11-16T07:10:53.651Z · crewly · WorkItem a7568d62-79a6-431b-abac-2958163ef690 done → done
- 2026-11-16T07:16:11.399Z · atelierx-team-leader-0001 · done → ready — Lead review QA v2 phát hiện diagnostics displayScaleMatchesMeasurements=false là mismatch thật: viewer scale 0.25 nhưng measurements/content giữ số liệu chưa nhân scale. Cần revision v2.1 content + measurements nhất quán và retest; giữ geometry/material/artwork; không publish v2.
- 2026-11-16T07:16:11.626Z · atelierx-team-leader-0001 · updated description, acceptance criteria — Lead chặn publish do QA v2 báo displayScaleMatchesMeasurements=false và phép tính kiểm tra xác nhận measurements/content không khớp scale 0.25. Mở lại cùng ticket ATEL-68 để sửa metadata ở revision mới v2.1; giữ nguyên hình học/màu/họa tiết.
- 2026-11-16T07:16:11.947Z · atelierx-team-leader-0001 · assigned to atelierx-frontend-developer-0006 — WorkItem 52c6eddf-7408-433b-87d7-af197d6afe24
- 2026-11-16T07:23:57.386Z · atelierx-frontend-developer-0006 · NHẬN VIỆC correction v2.1 đã đăng trong thread ATEL-63 root 2c9c551a-b99e-4288-bed2-dfc07d75185d, messageId cce6c2c5-6b43-4606-813d-db4f5869f9dc. BÀN GIAO v2.1 trong cùng thread messageId 00bd5910-c44c-4a45-b485-ea934c5acfe5; QA được báo trực tiếp trên WorkItem hiện có 5da884a6-bf76-4602-8c44-db13fb2a188b. Manifest SHA 6455ac606bc325fdeb0a4d07ef74e30634a4721bf212ed860f3a51ba5858310e; browser QA sáu góc, loaded/rotated/zoomed desktop pass. Display GLB giữ nguyên SHA 91f278f20d4ea578e49991eed2798e83258cc79983aaa601cc4e20ed889c6a99. Chờ QA focused retest; v2 QA report không sửa, catalog chưa publish.
- 2026-11-16T07:26:11.077Z · crewly · WorkItem 52c6eddf-7408-433b-87d7-af197d6afe24 done → done
- 2026-11-16T07:26:43.816Z · atelierx-frontend-developer-0006 · Visual correction v2.1 đã hoàn tất và WorkItem 52c6eddf-7408-433b-87d7-af197d6afe24 đã complete-task thành công với manifest/artifact/command evidence. QA retest độc lập tiếp tục ở WorkItem QA hiện hữu sau khi Lead assign; không tạo Verify/Retry, ticket mới hay publish catalog.
