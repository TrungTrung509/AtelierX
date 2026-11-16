# ATEL-23/v1 — Hướng hình “Tuyến sáng”

- **Ý tưởng:** bản đồ đô thị tối giản, gợi nhịp phố đi bộ và các nút giao; dùng đường đôi mảnh, góc bo và các ô kiến trúc nhỏ thay cho hình minh họa lớn.
- **Màu đề xuất:** nền sơ mi ivory `#F8F5ED` hoặc xanh trời nhạt `#D9EEF4`; nét chính xanh trời `#579BB3`; điểm nhỏ coral `#E98979` và vàng chanh dịu `#D9B94C`.
- **Nhịp:** ô lặp vector 240 × 240 đơn vị, đường nét nhỏ và thoáng. Dùng làm microprint toàn thân hoặc thu nhỏ theo tỉ lệ áo; Designer xác nhận tỉ lệ và vùng đặt trên geometry cuối.
- **Ràng buộc công sở:** giữ nền sáng, khoảng trống và nét mảnh; điểm màu chỉ là dấu giao nhỏ. Tránh mảng đặc lớn, chữ, logo hoặc tương phản gắt để áo vẫn gọn khi nhìn ở khoảng cách thông thường.
- **Tệp:** `artwork/atel23-cityline-microprint-v1.svg` là artwork gốc nền trong suốt, có thể lặp; không gồm nền áo và chưa phải texture/PBR.
- **Bằng chứng xem trước:** `artwork/atel23-cityline-preview.png` cho thấy artwork trên nền ivory và xanh trời nhạt. Bố cục/nhịp đã được xem trong Chromium headless; chưa phải ảnh QA trên garment hoặc mannequin.
