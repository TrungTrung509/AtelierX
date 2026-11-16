# ATEL-47 · Research handoff · v1

## Kết luận cho Lead và Designer

`node tools/studio-base.mjs shirt` trả về `ready: []`. Không có phom sơ mi G1-ready. Shortlist chỉ giữ một nguồn user-supplied ở trạng thái `candidate`, không tự đánh dấu ready.

**Nguồn tham khảo duy nhất:** `jk_school_uniform_4.glb` (14 mesh). Ảnh front/back/side/oblique cho thấy áo cổ bẻ, tay dài, hàng khuy và cổ tay; tuy nhiên áo gắn với váy kẻ, có panel đồng phục bất đối xứng và mesh tên chung. Chỉ dùng làm nguồn tham khảo/ứng viên để Designer kiểm tra mapping; không dùng nguyên outfit cho sản phẩm. Nếu không tách áo sạch mà giữ được hình học/UV, dừng tách và dựng geometry độc lập. Mọi geometry mới phải có ảnh xám và QA shape trước Material.

Một asset blouse-váy đã thử trong ATEL-23 bị loại vì không tách được; tôi đã loại khỏi shortlist hiện tại và xóa các capture mới tạo. ATEL-23 vẫn dừng; registry không đổi.

Provenance, SHA, bốn góc ảnh và browser result ở `shortlist.json`. Quyền sử dụng theo project được nêu trong `quality/USER_SUPPLIED_BASE_POLICY.md`; provenance không xác minh quyền bên thứ ba.

## Artwork và content

- Tile pinstripe mới theo brief: `pinstripe-tile.svg`; sọc dọc trắng mảnh trên nền xanh da trời sáng.
- Mật độ ban đầu và placement notes ở `artwork-placement.md`; Material cần căn theo UV thật và kiểm ảnh trên mesh trước khi chốt.
- Content nháp tiếng Việt ở `content-draft.json`; cotton poplin chỉ là chất liệu mô phỏng, không xác nhận nguồn vải vật lý. Bốn kích thước hiển thị để `null` đến khi mesh final được đo.

## Giới hạn bằng chứng

Browser tải candidate và không báo lỗi trang; thao tác xoay thành công. Preview ghi `zoomed=false`, nên không xác nhận zoom trên nguồn này. Bốn ảnh là bằng chứng quan sát trực quan nguồn, không phải shape QA và không duyệt phom. Còn cần Designer chọn/rebuild geometry, QA shape độc lập và Lead chốt phương án.
