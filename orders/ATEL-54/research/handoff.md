# TKT-009 · Shortlist nguồn geometry sơ mi

**Kết luận:** chưa có nguồn phù hợp để Designer dùng làm base sơ mi độc lập. `node tools/studio-base.mjs shirt` trả `ready: []`, `needsPreparation: true`. Đã xem tối đa hai nguồn hiện có; không thay đổi registry và không đánh dấu nguồn nào ready.

## Nguồn đã xem

1. **Đồng phục học sinh Nhật** — [GLB](../../../quality/candidates/user-supplied/jk_school_uniform_4.glb), SHA-256 trong `shortlist.json`; [front](../../ATEL-47/v1/research/source-01/front.png), [back](../../ATEL-47/v1/research/source-01/back.png). Có chi tiết cổ viền V, hàng khuy và cuff tay dài, nhưng phần áo liền với váy; cổ không phải cổ bẻ sơ mi công sở. GLB có UV0, song node generic không chứng minh được tách phần áo/UV an toàn. Chủ dự án cho quyền dùng nội bộ theo `quality/USER_SUPPLIED_BASE_POLICY.md`; license bên thứ ba chưa xác minh. **Loại làm base**, chỉ giữ tham khảo thị giác.
2. **T-shirt Tabbuso** — [GLB](../../../quality/candidates/user-supplied/tshirt.glb), SHA-256 trong `shortlist.json`; [front](../../ATEL-35/v0.5/source-preview/front.png), [back](../../ATEL-35/v0.5/source-preview/back.png). UV0 và các cửa cổ/tay mở được ghi trong provenance; ảnh có nếp nhẹ và gần benchmark về bề mặt. Tuy nhiên đây là cổ tròn tay ngắn, không có cổ bẻ, nẹp, khuy hay cuff. **Loại do sai cấu trúc sản phẩm.** Attribution nguồn: Tabbuso, Sketchfab, CC-BY-4.0; chi tiết trong `orders/ATEL-35/v0.5/designer/source-uv-provenance.json`.

Không dùng ATEL-47/v4 làm base. Không khảo sát lại nguồn của ATEL-23 vì đơn đó đã dừng.

## Chuẩn bị tiếp theo

Studio Lead mở preparation round mới để tìm GLB **áo sơ mi độc lập**, có cổ bẻ/chân cổ và lá cổ, nẹp, cổ tay, cửa rỗng và nếp vải. ETA đề xuất: **15 phút cho tối đa hai nguồn**. Sau khi có nguồn, Designer kiểm ảnh xám sáu góc và topology/UV; QA quyết định phom trước khi chuyển Material. ATEL-35/v1 tiếp tục là benchmark bề mặt vải, không phải base sơ mi.

## Evidence

- [Kết quả studio-base](studio-base-shirt.json)
- [Shortlist và hash](shortlist.json)
- [Manifest](manifest.json)
