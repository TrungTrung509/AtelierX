# Phom cơ sở do chủ dự án cung cấp cho ATEL-53

- Nguồn gốc file: `C:/HocTap/QLDA/shirt.glb` do chủ dự án gửi ngày 2026-11-16.
- Bản sao làm việc: `quality/candidates/user-supplied/shirt.glb`.
- SHA-256: `1de5a29649bd5520bc5163660c40e58799f514c8cbb36cbbcd18611cc3c497d3`.
- Metadata nhúng trong GLB: tác giả `eigenscene`, tiêu đề `Shirt`, nguồn `https://sketchfab.com/3d-models/shirt-745d0d185b49405694ef4e16cf78e224`, giấy phép ghi trong file `CC-BY-4.0`. Ghi công tác giả và nguồn khi bàn giao; metadata là bằng chứng nguồn trong file, chưa phải kiểm chứng độc lập trang ngoài.
- Viewer thử: `/atelierx-products/quality-preview/shirt-owner/index.html`.
- Ảnh sáu góc và kết quả tải/xoay/zoom: `quality/evidence/shirt-owner/browser/`.

## Quyết định sử dụng

Đây là **candidate cho ATEL-53**, chưa là sản phẩm được duyệt. Ảnh browser cho thấy phom sơ mi dài tay độc lập có cổ, nẹp, khuy, độ phồng và nếp vải; cổ, cổ tay, gấu và ống tay có cửa mở. Dùng geometry này làm điểm xuất phát, giữ hình học/normal và vị trí khuy nếu không cần sửa. Không dùng lại phom ATEL-47 bị owner từ chối, không chờ Marvelous Designer.

Designer tạo bản xám từ nguồn này trước. Nếu cần đổi kiểu cổ hoặc tỷ lệ, sửa có kiểm soát và chụp lại ảnh. QA kiểm phom xám trên viewer ở sáu góc, đặc biệt cổ và khuy, rồi ghi `shape-review` pass/return cho đúng revision. Sau khi pass, Material đổi từ caro xanh đậm sang xanh da trời sáng với sọc dọc trắng mảnh và đều; Visual dựng viewer, content tiếng Việt; QA kiểm bản cuối. Lead chỉ bàn giao khi gate đạt, giữ ticket ở To review.

Không tái dùng texture caro/logo của nguồn như thiết kế mới. Ghi `derivedFrom`, SHA nguồn và credit CC BY 4.0 trong manifest sản phẩm.
