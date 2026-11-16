# Mannequin cơ sở v1

- File: `mannequin-model-v1.glb` (bản sao nguyên vẹn từ `mannequin__model.glb` do chủ dự án cung cấp).
- SHA-256: `dc905436fc8e57bceb1978716bdfe53ca28edc6643255b70032400e6e605a0d7`.
- Metadata nhúng: tác giả `zveoxic`, nguồn `https://sketchfab.com/3d-models/mannequin--model-59460931b9cb43f98c97991300c920fb`, giấy phép `CC-BY-4.0`. Khi trưng bày hay phát hành bản dẫn xuất, ghi công tác giả, link nguồn, license và thay đổi đã làm.
- GLB 2.0 hợp lệ về cấu trúc; 1 mesh/1 primitive/1 material, không có skin/animation, không có UV hoặc texture. Tư thế và chi tiết hình thể cần kiểm bằng ảnh browser trước khi ghép.
- Kích thước mesh thô khoảng 2.00 × 1.87 × 0.29 đơn vị; hoodie ATEL-1/v3 khoảng 0.83 × 1.57 × 0.41. Node cha có biến đổi trục/tỷ lệ, vì vậy phải kiểm bounds trong cùng hệ tọa độ và căn vai, cổ, tay trước khi ghép.
- Bản nguồn giữ để đối chiếu. Bản chuẩn đã đo và kiểm browser: `mannequin-180cm-v1.glb`; đọc `quality/MANNEQUIN_REFERENCE.md` và `quality/mannequin-fit.json`. Chỉ cặp áo/mannequin mới cần QA fit riêng.
