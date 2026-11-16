# ATEL-47 · Artwork và placement · v1

## Nguồn và cấu hình sọc

- Nguồn: artwork SVG nội bộ `pinstripe-tile.svg`, dựng mới theo brief ATEL-47; không sao chép họa tiết thương mại hoặc logo.
- Màu thiết kế đề xuất: xanh da trời sáng `#75B9E5`, sọc trắng ngà `#F8FCFF`.
- Tile lặp 32 × 32 px, một sọc rộng 1 px; sọc dọc trong tile, tỷ lệ rộng/pitch khoảng 1:32.
- Đây là thông số artwork ban đầu; Material cần hiệu chỉnh tần số theo UV thật để mặt trước có khoảng 12–16 sọc rõ, mảnh và đều trên mỗi thân trước. Không suy ra kích thước may từ tile.

## Placement notes

- Cho sọc chạy theo trục dọc thân áo, từ vai xuống gấu; ở tay áo chạy theo trục từ vai đến cổ tay.
- Giữ hướng và mật độ nhất quán ở thân trước, thân sau và tay. Canh sọc đối xứng hai bên nẹp khuy; không để sọc trắng thành dải lệch tại đường ráp vai/sườn.
- Giữ chi tiết cổ, nẹp, khuy và cổ tay đọc rõ. Ưu tiên sọc theo vải trên thân; cổ và cổ tay có thể dùng màu xanh trơn nếu UV làm họa tiết méo hoặc quá dày.
- Kiểm tra ảnh thật front/back/side/oblique trên geometry final trước khi khóa surface. SVG chỉ là tile artwork, chưa phải bằng chứng UV/placement đạt.
