# Mannequin chuẩn AtelierX — đo trước đơn sản xuất

Team đọc `quality/mannequin-fit.json` và dùng **`quality/candidates/mannequin/mannequin-180cm-v1.glb`**. File gốc chỉ làm nguồn đối chiếu, không đo lại và không áp thêm scale 100/0.01 từ node gốc. Bản chuẩn đã bake transform và làm mượt normals.

| Thông số | Giá trị quy ước trên model |
|---|---:|
| Chiều cao | 180,0 cm |
| Sải tay, điểm xa nhất | 192,8 cm |
| Độ sâu toàn thân | 28,4 cm |
| Chu vi lát ngực ở y=137 cm | 105,1 cm |
| Ngang/sâu ngực | 39,0 / 24,1 cm |
| Chu vi lát eo ở y=118 cm | 76,2 cm |
| Chu vi lát hông ở y=94 cm | 91,5 cm |
| Chu vi lát cổ ở y=157 cm | 45,9 cm |
| Khoảng cách hai điểm tham chiếu vai | 50,0 cm |
| Cao tâm vai tham chiếu | khoảng 149,9 cm |

Chiều cao 180 cm là tỷ lệ studio chọn, vì file gốc không xác nhận chiều cao người thật. Chu vi là chiều dài đường cắt tam giác tại cao độ ghi rõ; các vị trí giải phẫu/khớp là tham chiếu gần đúng, không dùng để sản xuất quần áo thật.

Hệ tọa độ: mét, +Y lên, +Z trước, sàn y=0, tâm ngang x=0. Pose T tĩnh, không rig. Dùng tên positiveX/negativeX trong JSON để tránh đảo trái/phải. Anchors có điểm trung tâm thân, mặt trước/sau từng lát và tâm vai/bắp tay/khuỷu/cổ tay hai bên. Tọa độ là điểm xuất phát để fit; không phải joint rig.

Designer đặt garment theo anchors, kiểm cổ/nách/tay/gấu và họa tiết. Visual ghép mannequin chuẩn với bản garment/material cuối; không scale mannequin tùy tiện cho từng đơn. Khoảng hở ban đầu 1,5 cm chỉ là gợi ý; kiểu oversize và cấu tạo khác cần chỉnh riêng. QA độc lập kiểm giao nhau trên từng sản phẩm.

Profile ở `measured-reference`: đã đo geometry và kiểm thị giác/browser, **chưa có cặp phom áo nào được tự động duyệt fit**. Việc này đã loại bước đo lại mannequin khỏi mỗi đơn; chỉ cần kiểm độ vừa của chiếc áo mới. Chưa phải mô phỏng độ rủ vải thật.

Xem trực tiếp: `/atelierx-products/quality-preview/mannequin/index.html` trong Crewly. Ảnh sáu góc và kết quả browser tại `quality/evidence/mannequin-v1/browser/`. File measurements.json chứa lát cắt mỗi 1 cm. Tái tạo bằng `python tools/measure-mannequin.py`, sau đó `node tools/build-mannequin-profile.mjs`; thay geometry phải chụp và kiểm lại ảnh, ghi hash evidence tương ứng.

Ghi công: zveoxic, “Mannequin_ model”, Sketchfab, CC BY 4.0. Nguồn được lưu trong profile và metadata GLB; thay đổi là chuẩn hóa trục/kích thước, làm mượt normals và vật liệu xám trung tính.
