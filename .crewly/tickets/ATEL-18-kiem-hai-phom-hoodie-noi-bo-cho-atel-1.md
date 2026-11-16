---
id: ATEL-18
title: Kiểm hai phom hoodie nội bộ cho ATEL-1
status: cancelled
priority: P1
assignee: null
team: af30c001-2789-4f20-b917-000000000010
labels: [ atelierx, ATEL-1, ATEL-9, research, base-mesh ]
ownerReview: false
source: owner:atelierx
updatedAt: 2026-11-14T17:43:40.795Z
workItemId: null
---

## Description

Chủ dự án đã cho phép dùng 29 GLB trong `phom cơ sở/` theo `quality/USER_SUPPLIED_BASE_POLICY.md`. ATEL-10 là báo cáo tìm nguồn ngoài đã hoàn tất, không lặp lại BlendSwap/Sketchfab hoặc chờ lỗi HTTP 403.

Researcher kiểm trước hai candidate `user-classic-black-flame-hoodie-0a923687-v1` và `user-green-and-white-hoodie-25f4b3ee-v1` trong `quality/base-meshes.json` và preview `showcase/quality-preview/user-supplied/`. Với từng phom, ghi mặt trước/sau, dáng, mũ/cổ/vai/tay/túi, giá đỡ/mannequin, mức che vùng in lưng, khả năng dùng làm tham khảo để tạo thiết kế mới. Ghi ID/hash và đường dẫn evidence; có thể đề xuất điều chỉnh kiểu dáng, màu, chất liệu, họa tiết. Bàn giao nhanh lựa chọn ưu tiên hoặc lý do loại từng phom cho Designer và Lead trong thread ATEL-9. Designer kiểm geometry/UV độc lập; Researcher không sửa GLB hoặc tự duyệt `approved`.

Nếu cả hai không đáp ứng, nêu lỗi hình học/vùng in cụ thể để Lead quyết định sửa phom hay tìm nguồn khác. Không biến việc kiểm license từng file người dùng cấp thành blocker. QA G1 và Lead duyệt riêng sau khi có bản thử trên web Crewly.

## Acceptance criteria

- [ ] Có nhận xét riêng cho cả hai hoodie, kèm ID/hash, ảnh mặt trước/sau hoặc ghi rõ bằng chứng còn thiếu.
- [ ] Đề xuất một phom để Designer thử hoặc lý do cụ thể vì sao cả hai không dùng được.
- [ ] Bàn giao trong thread ATEL-9 bằng tiếng Việt, lưu messageId và đường dẫn báo cáo.

## Log

- 2026-11-14 · owner · Mở việc kiểm thư viện phom nội bộ sau khi ATEL-10 hoàn tất nghiên cứu nguồn ngoài.
- 2026-11-14T15:21:22.019Z · owner · assigned to atelierx-tpm-0002 — WorkItem c046c9c5-9c02-4a91-b6ba-daca9126400f
- 2026-11-14T17:43:40.197Z · owner · in_progress → ready — ATEL-1/v3 đã nghiệm thu; phom nội bộ chưa được Researcher kiểm, dừng WorkItem treo.
- 2026-11-14T17:43:40.795Z · owner · ready → cancelled — ATEL-1/v3 đã hoàn thành; ticket kiểm phom phục vụ riêng đơn này không còn cần thiết. Chưa có kết quả nghiên cứu, không đánh dấu done.
