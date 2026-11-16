# ATEL-35 · Visual preparation

**Brief:** áo thun độc lập màu kem, hoa nhỏ ở ngực trái. Scene không có mannequin, avatar, giá đỡ hoặc mask cơ thể.

## Scene và camera

- Nền trung tính xám lạnh, chuyển sáng nhẹ ở giữa; tương phản đủ với áo kem mà không nhuộm màu áo.
- Key light mềm phía trên-trước, fill nhẹ phía trước đối diện và rim mỏng từ sau để thấy đường vai, tay áo và nếp vải. Bóng tiếp xúc nhẹ bên dưới áo; không thêm vật thể đỡ.
- Khung mặc định front 3/4 nhẹ, áo chiếm khoảng 70–78% chiều cao khung. Chốt `camera-target`, `camera-orbit` và khoảng zoom sau khi có GLB xám và bounds; hiện không giả định kích thước.
- Dùng `model-viewer` với `camera-controls`, giới hạn zoom hợp lý, nút Mặt trước / Mặt sau / Hông / Chéo; viewer desktop cao tối thiểu 360 px.

## Tích hợp sau shape-review

- Đích viewer dự kiến: `showcase/products/ATEL-35/v1/index.html`; asset `./assets/display.glb`; content `./content.json`.
- Dùng trực tiếp GLB áo độc lập với `presentation: "standalone"`, `maskBody: false`; không tải mannequin hoặc gọi `mergeGlb` với body.
- Chỉ thay placeholder ở `showcase-job-draft.json` bằng path/hash và chất liệu mô phỏng có nguồn sau handoff; không chạy draft/final từ scaffold này.
- Sau khi shape-review đạt: lấy cùng revision đã duyệt, ghép theo job standalone, đưa content tiếng Việt ngắn và thông số có nguồn vào viewer; chạy `browser-qa --basic` cho desktop (mở, xoay, zoom) và chụp front/back/side/oblique.

**Trạng thái hiện tại:** v0.5-gray đã được QA độc lập duyệt phom (`orders/ATEL-35/v0.5/independent-shape-review.json`, GLB SHA-256 `28f74d1abd4953919a9f862a756694972e8f52787e6598666e8bde4947702712`). Candidate sản phẩm `showcase/products/ATEL-35/v1/` đã ghép standalone bằng preset kem và artwork hoa ngực trái; material tách theo primitive nguồn để giữ lưng sạch mà không đổi geometry/UV. Preview trực tiếp xác nhận front/back/side/oblique; final browser QA desktop và QA sản phẩm độc lập của Lead đang chờ. Catalog chưa đổi, chưa publish.
