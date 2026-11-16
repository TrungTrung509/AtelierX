---
id: ATEL-16
title: "ATEL-16: QA độc lập clean-v2 và placement test"
status: done
priority: P1
assignee: atelierx-qa-0004
team: af30c001-2789-4f20-b917-000000000010
labels: [ atelierx, ATEL-9, qa, base-mesh, placement ]
ownerReview: false
createdAt: 2026-11-14T14:50:35.561Z
updatedAt: 2026-11-14T15:09:46.942Z
workItemId: 2ce0bc64-8195-4654-b1e2-b12cbc4d6e43
requestId: abb584c0-5791-4686-b2b7-dc80e9603718
source: request:TKT-004
---

## Description

Goal: đánh giá độc lập G1 cho grab3d-hoodie-clean-v2 sau handoff ATEL-15/v2. Expected Outcome: xác định có đạt phom/placement hay không, nêu lỗi chặn và bằng chứng; giữ base mesh candidate cho đến khi Lead duyệt. Eval Criteria: đối chiếu source GLB SHA-256 42dc0075e632eab84256f71d9cc88b6eb6d54d04cbff3682f548f62e55994a13, placement-profile.json và diagnostic placement-test GLB; xem ảnh browser thật front/back/left/right/detail/mobile cùng neck/shoulder closeups trong quality/evidence/ATEL-15/v2/. Đánh giá thanh ngang gần cổ/mũ là cấu tạo hay residue, độ rõ/che khuất placement lưng do hood, vùng in/UV và material slots. Tạo phiếu QA dưới quality/reports/ATEL-9/ gắn đúng revision/SHA; nếu cần, chụp lại browser ảnh viewer diagnostic cùng kết quả loaded/rotated/zoomed/mobile. Không sửa GLB nguồn, base-meshes.json, catalog hoặc tự duyệt approved. Bàn giao trong thread ATEL-9 ae70a6a0-f4e1-403b-92e5-00462ea20ae5 và ghi messageId vào ticket.

## Acceptance criteria

- [ ] Phiếu QA ghi rõ revision/SHA, ảnh browser thật đủ front/back/trái/phải/detail/mobile, và kết luận độc lập về phom, cổ/vai, placement lưng bị che và vùng in.
- [ ] Kết luận pass/trả lại kèm blocker cụ thể và chủ file sửa tiếp; base mesh vẫn giữ candidate cho đến khi Lead duyệt.

## Log

- 2026-11-14T14:50:35.561Z · atelierx-team-leader-0001 · created (backlog)
- 2026-11-14T14:50:42.094Z · atelierx-team-leader-0001 · backlog → ready — Giao ngay sau ATEL-15 handoff; QA đang idle. Cần xác minh đúng clean-v2 SHA/profile, không đổi source/catalog.
- 2026-11-14T14:50:42.298Z · atelierx-team-leader-0001 · assigned to atelierx-qa-0004 — WorkItem 2ce0bc64-8195-4654-b1e2-b12cbc4d6e43
- 2026-11-14T14:50:54.229Z · atelierx-team-leader-0001 · updated acceptance criteria — Chuẩn hóa acceptance bằng tiếng Việt theo quy tắc AtelierX; không đổi phạm vi đã giao.
- 2026-11-14T14:53:12.503Z · atelierx-qa-0004 · NHẬN VIỆC đăng trong thread ATEL-9; messageId=8643182a-27fb-4d3b-9b1d-3866f926a2a7. Đã xác minh source SHA 42dc0075e632eab84256f71d9cc88b6eb6d54d04cbff3682f548f62e55994a13 và diagnostic SHA 631b0673252dc4d74c72a752aed2a9c00c447ceb6ebcaf61c22c34fa0230486d; browser result loaded/rotated/zoomed/desktop/mobile=true, errors=[]. Đang hoàn tất nhận định độc lập và report.
- 2026-11-14T14:54:31.467Z · atelierx-qa-0004 · BÀN GIAO QA TRẢ LẠI đăng trong thread ATEL-9; messageId=a646f4ba-2846-4cf9-a9a0-da51039e10b9. Report=quality/reports/ATEL-9/grab3d-hoodie-clean-v2-placement-qa.json (revision clean-v2-placement-test-01; source SHA 42dc0075e632eab84256f71d9cc88b6eb6d54d04cbff3682f548f62e55994a13; diagnostic SHA 631b0673252dc4d74c72a752aed2a9c00c447ceb6ebcaf61c22c34fa0230486d). Verdict G1 return: neck/hood bar likely residue, back art materially occluded, drawstring overlaps chest edge; Designer ATEL-15 owns fix. Candidate remains candidate. Six browser views + two closeups reviewed; browser loaded/rotated/zoomed desktop/mobile true, errors empty.
- 2026-11-14T15:09:46.942Z · crewly · WorkItem 2ce0bc64-8195-4654-b1e2-b12cbc4d6e43 verified → done
