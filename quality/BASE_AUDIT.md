# Kiểm tra phom ứng viên đầu tiên

Ngày 14/11/2026. Ảnh ở `quality/evidence/` được chụp bằng Chromium từ viewer phục vụ trong Crewly. Kiểm tra tải, xoay, zoom và màn hình nhỏ đều chạy, nhưng những điều đó không tự chứng minh phom đạt thẩm mỹ.

| Ứng viên | Nguồn và quyền | Kết quả thị giác | Quyết định |
|---|---|---|---|
| `grab3d-hoodie-candidate-v1` | Grab3D, CC0; có file license và checksum trong `base-meshes.json` | Áo hoodie có phom đọc được, nhưng cọc giá đỡ xuyên dọc lưng, che vùng họa tiết chính. Mesh áo và cọc gộp vào cùng primitive nên không thể tắt bằng cách ẩn node. | Giữ `candidate`, không duyệt. Chỉ được duyệt sau khi tách bỏ giá đỡ, kiểm lại phom và UV vùng lưng bằng ảnh browser. |
| `grab3d-hoodie-clean-prototype-v1` | Dẫn xuất từ bản Grab3D CC0, giữ hồ sơ nguồn và checksum riêng | Lọc 3.858 tam giác theo vùng không gian; ảnh browser trước/sau không còn cọc che lưng, tải/xoay/zoom và mobile chạy. QA độc lập đã trả lại đúng revision vì chưa kiểm đường viền/topology, UV/họa tiết và placement profile; xem `reports/ATEL-9/grab3d-hoodie-clean-prototype-v1-qa.json`. | Giữ `candidate`; không dùng cho sản phẩm complete. |
| `grab3d-hoodie-clean-v2` | Dẫn xuất từ bản Grab3D CC0, checksum riêng trong manifest | Ảnh browser trước/sau/hai bên/detail/mobile đã có. UV checker tải được và cho thấy vùng thân lưng liên tục ở giữa, nhưng có vệt/đứt mép quanh mũ, vai, tay và gấu; phép thử xoay trong kết quả UV checker trả `false`. Chưa có artwork định hướng riêng ở ngực và lưng, placement profile hoặc QA độc lập cho revision này. | Giữ `candidate`; Designer cần xác định vùng in an toàn và xử lý mép, QA retest đúng revision. |
| `makehuman-hoodie.glb` | CharacterCreator, nguồn CC0 theo `candidates/makehuman-licenses.json` | Phom bị thủng/lệch nhiều mảng khi xem từ browser. | Loại khỏi thư viện phom. |
| `makehuman-tshirt.glb` | CharacterCreator, nguồn CC0 theo `candidates/makehuman-licenses.json` | Tỷ lệ thân và ngực méo, không giống mẫu áo thun thương mại. | Loại khỏi thư viện phom. |

Ảnh và kết quả kiểm có trong `evidence/base-hoodie-candidate/`, `evidence/base-hoodie-clean-prototype/`, `evidence/base-makehuman-hoodie/`, `evidence/base-makehuman-tshirt/`. Trang thử ở `showcase/quality-preview/` chỉ để kiểm phom, không phải sản phẩm hoàn thành. Script lọc hình học `tools/remove-stand-prototype.mjs` chỉ tạo ứng viên; không tự duyệt phom.

## Việc tiếp theo để mở G1

1. Researcher tìm 2–3 nguồn phom sạch, kiểm giấy phép gốc, ghi URL và điều kiện dùng.
2. Designer kiểm mesh/UV, thử một hình vuông và một họa tiết ở vùng lưng/ngực; loại phom có bộ phận xuyên nhau hoặc vùng in không dùng được.
3. Material Specialist thử màu sáng và tối trên nền viewer, kiểm các material slot có thể đổi mà vẫn nhìn rõ phom.
4. QA chụp đủ bốn góc, cận cảnh vùng đặt họa tiết và màn hình nhỏ; ghi nhận lỗi nhìn thấy được.
5. Lead mới đổi `status` thành `approved` khi bằng chứng và placement profile cùng trỏ đúng bản phom. Không dùng ứng viên hiện tại cho sản phẩm `complete`.

Chẩn đoán mesh của prototype: phần thân phía lưng có 2.772 tam giác, khoảng UV `U=0.414–0.774`, `V=0.625–0.901`; phần thân phía trước có 2.564 tam giác, khoảng `U=0.136–0.408`, `V=0.439–0.796` (xem `tools/analyze-components.mjs`). Đây là **bounds của component**, chưa phải placement profile. Designer phải đặt hình thử và xác nhận hướng, méo và đường may trong viewer trước khi dùng vùng UV này.
