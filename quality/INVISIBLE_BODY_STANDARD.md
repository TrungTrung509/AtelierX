# Chuẩn trang phục mặc trên cơ thể vô hình

**Yêu cầu ưu tiên cao nhất:** trưng bày trang phục 3D độc lập như đang được mặc trên cơ thể vô hình. Áo có phom mặc, độ phồng, nếp gấp tự nhiên, cổ và khuy phù hợp loại áo; người xem xoay và zoom ngay trong Crewly để xem thiết kế, màu sắc và họa tiết. Đây là điều kiện bắt buộc để bàn giao, đứng trước mục tiêu thời gian và số task hoàn tất.

Chuẩn hình ảnh chủ dự án chấp nhận: ATEL-35/v1 — Áo thun kem · Hoa nhỏ. Dùng mẫu này để so chất lượng bề mặt vải, không dùng hình dáng áo thun thay cho loại sản phẩm khác.

## Điều cần giữ từ ATEL-35

- Giữ geometry, normals và nếp rủ của nguồn garment tốt; chỉ chuẩn hóa tỉ lệ/tư thế và đổi màu/PBR/hoạ tiết.
- Quần áo là lớp vỏ vải có không gian mặc bên trong, không phải cơ thể hoặc khối đặc. Cổ, cửa tay, gấu, cạp và ống quần phải là cửa mở tự nhiên khi loại trang phục có chúng. Mép có thể có độ dày/đường may, không bị một đĩa hoặc mặt phẳng bịt ngang.
- Volume theo dáng mặc: vai/nách/ngực ở áo, hông/đáy/đầu gối/ống ở quần; có nếp vải theo cấu trúc, không dùng gợn sin đồng đều để giả độ rủ.
- Cổ, khuy, nẹp, túi nằm hợp lý trên lớp vỏ vải; không ghép hộp/tube/ellipse nổi rời. Nếp và shading phải còn đọc được dưới vật liệu xám trung tính.
- Giữ nguyên scene tương phản đang dùng. Ánh sáng, thêm sọc hoặc roughness không sửa được lỗi geometry.

## Chọn nguồn và giới hạn thời gian

Thứ tự: phom garment đã thành công đúng loại → GLB garment nội bộ có ảnh đạt → tìm nguồn garment khác được phép dùng → dựng/sửa bằng công cụ tạo trang phục nếu có thể chứng minh chất lượng tương đương. Không chuyển từ thiếu phom sang SDF/khối tham số tự viết chỉ để kịp 60 phút.

15 phút là mốc báo readiness/ETA; hai nguồn là giới hạn một đợt tìm. Nếu cả hai không phù hợp, Lead ghi chuẩn bị thêm và phân công tìm tiếp phom tốt. Không cấm nguồn thứ ba rồi ép Designer tự dựng khối. Tốc độ phải đến từ tái sử dụng nguồn và công cụ, không hạ tiêu chuẩn hình dáng.

## Nghiệm thu hình ảnh

### Cổ, nẹp và khuy sơ mi

- Chốt loại cổ bằng ảnh tham khảo trước dựng phom. Cổ sơ mi bẻ thông thường có chân cổ theo vòng cổ và hai lá cổ gập ra ngoài đúng hướng; nối tự nhiên với vai/thân và có khoảng mặc bên trong. Không coi mặt bịt mang tên collar là đủ.
- Khuy trước nằm trên nẹp, khuy cổ tay nằm trên măng sét. Xác định điểm bám và hướng theo bề mặt vải trong cùng hệ tọa độ: chiếu lên mặt/UV và hướng pháp tuyến. Độ nhô phản ánh độ dày khuy và chỗ đính; không đặt offset lớn cố định theo trục thế giới.
- Khuy có thể là mesh riêng, không bắt buộc weld vào thân. Nhìn nghiêng phải thấy phần đính gắn với vải, không có khoảng hở làm cả hàng khuy lơ lửng. Không chôn khuy vào vải để che lỗi.
- Khi đổi geometry, tỉ lệ hoặc transform thân/nẹp/măng sét, cập nhật điểm bám và kiểm lại toàn bộ khuy. Material/Visual không dịch riêng mesh phụ khi đóng gói.
- Kiểm ở bản xám trước sọc/artwork, rồi kiểm final. Ngoài sáu góc, cần ảnh cận đúng revision: `collarCloseup` (cổ/vai góc chéo hoặc trên), `placketSideCloseup` (nẹp/chân khuy nhìn nghiêng), `cuffCloseup` (măng sét/khuy cổ tay). Lấy ảnh từ model thật, đủ gần để đánh giá; không dùng ảnh tham khảo thay bằng chứng.
- Khuy bay, sai hướng, chìm mất; cổ méo/lộn, thiếu chân cổ với kiểu cổ đã chọn hoặc bịt kín là lỗi chặn bàn giao. Trả Designer bằng ảnh/vị trí/lỗi cụ thể trong cùng WorkItem. Nếu thiếu phom tốt thì tìm garment có cổ/nẹp/khuy đúng sẵn, không vá khối kém tiếp.

Với sơ mi, thêm `collarConstruction`, `buttonAttachment`, `trimFollowsGeometry` vào `garmentAppearance.checks`; từng mục có `passed`, quan sát cụ thể và `evidence`. Ghi ba ảnh cận cùng hash trong `report.evidence` và `report.evidenceSha256`. Gate kiểm hồ sơ/hash; QA vẫn phải nhìn ảnh để đánh giá cấu trúc.

Trước trang trí, Designer và QA xem sáu góc xám: front, back, side, oblique, top, bottom. Giữ preview xoay/zoom được. So cạnh hình benchmark ATEL-35/v1 và ghi nhận cụ thể điểm tương đương/kém hơn. Top/bottom phải thấy cửa mở và lớp vỏ, không bịt bằng mặt caps hoặc facing ngang. Không yêu cầu mọi mesh là kín/watertight hoặc cùng một component; đường ráp nhìn tự nhiên và đúng cấu trúc là điều cần kiểm.

QA cuối xem cùng sáu góc với màu thật. Report cần `garmentAppearance`:

```json
{
  "profile": "invisible-body-v1",
  "reviewer": "atelierx-qa-0004",
  "benchmark": "ATEL-35/v1",
  "checks": {
    "hollowOpenings": {"passed": true, "observation": "Mô tả những cửa mở thật đã thấy", "evidence": ["đường dẫn top/bottom"]},
    "naturalDrape": {"passed": true, "observation": "Mô tả nếp và dáng mặc cụ thể", "evidence": ["đường dẫn front/side/oblique"]},
    "fabricEdges": {"passed": true, "observation": "Mép vải tự nhiên, không cap hoặc bề mặt đặc", "evidence": ["đường dẫn chi tiết"]},
    "garmentConstruction": {"passed": true, "observation": "Cổ/tay/nẹp/khuy hoặc cạp/đáy/ống/túi phù hợp", "evidence": ["đường dẫn"]},
    "benchmarkComparison": {"passed": true, "observation": "So sánh thật với chất lượng vải/nếp của áo thun kem", "evidence": ["đường dẫn ảnh sản phẩm"]}
  }
}
```

Không chép sẵn các giá trị pass. JSON trên mô tả cấu trúc; chỉ ghi đạt sau khi quan sát ảnh thật. Script chỉ kiểm hồ sơ và hash; quyết định chất lượng vẫn thuộc QA và Lead. Nếu không đạt dáng mặc/vỏ vải thì giữ preview, không công bố complete vì đủ khuy, màu hoặc file hợp lệ.

Hai sản phẩm ATEL-41/v4 và ATEL-47/v4 đã bị owner phản hồi chưa đạt chuẩn hình dáng. Phiếu QA cũ là lịch sử, không được dùng làm chứng nhận phom ready hoặc benchmark mới. Chỉ đưa revision sửa trở lại complete khi đủ kiểm sáu góc và owner có thể xem lại.
