# ATEL-12/v1 — Đặc tả vật liệu số và tương phản hoodie

**Phạm vi:** đọc asset ứng viên `grab3d-hoodie-candidate-v1` và đề xuất giá trị khởi điểm để xem thử trong preview số. Đây không phải thông số may/nhuộm sản xuất, không chứng minh phom đã đạt và không sửa GLB/viewer.

## Slot và map đang có

Đọc trực tiếp `quality/candidates/grab3d-hoodie.glb`:

- Một material slot: `hoodie_body_pbr`.
- Một mesh/primitive: `hoodie_body` (một primitive, UV `TEXCOORD_0`). Không có material slot hoặc primitive riêng cho artwork.
- `hoodie_body_basecolor` (JPEG) gắn `baseColorTexture`.
- `hoodie_body_normal` (JPEG) gắn `normalTexture`.
- `hoodie_body_metallic-hoodie_body_roughness` (JPEG) gắn `metallicRoughnessTexture`.
- GLB không khai báo scalar `baseColorFactor`, `metallicFactor` hay `roughnessFactor`; không được suy diễn giá trị pixel cụ thể từ tên map.

Ứng viên trong `quality/base-meshes.json` đang ở trạng thái `candidate`, chưa `approved`. Việc có UV không xác nhận vùng in, hướng UV hay quyền dùng làm phom chuẩn.

## Thông số khởi điểm đề xuất

| Thành phần | Slot/vùng dự kiến | Giá trị thử | Lý do và giới hạn |
|---|---|---|---|
| Vải fleece đen | `hoodie_body_pbr` / thân hoodie | Base color factor `#17191D` (sRGB); metallic `0.0`; roughness `0.88` | Đen than, tránh đen tuyệt đối để ánh sáng còn đọc được nếp. Giữ base-color texture hiện tại; factor là gợi ý thử nghiệm, cần kiểm tra tương tác factor × texture trong viewer. |
| Nếp/vi sợi | normal map hiện có `hoodie_body_normal` | Giữ map; scale mặc định `1.0`, chỉ giảm cường độ về khoảng `0.5–0.7` nếu map làm bề mặt gồ/nhăn quá mức ở browser | Không thể kiểm tra cường độ hay hướng tangent chỉ từ tên slot; không bake lại nếu chưa có ảnh browser và đối chiếu mesh. |
| Roughness | kênh G của `hoodie_body_metallic-hoodie_body_roughness` | Giữ map; scalar roughness gợi ý `0.88`, metallic `0.0` | Texture glTF metallic-roughness: roughness ở G, metallic ở B. Nếu viewer nhân scalar với map, bắt đầu ở `1.0` để tránh làm tối map hai lần; chọn theo render thật. |
| Họa tiết in tương phản | Chưa có slot riêng; decal/material artwork chỉ sau khi Designer xác nhận UV/placement | Mực ngà `#E7E0D2`, vùng trung gian `#AAA69D`, bóng than `#34363A`; roughness `0.78–0.90`, metallic `0.0` | Giữ nét trên vải đen nhưng không giả kim loại. Không tuyên bố vị trí/bounds trên ứng viên vì chưa có placement profile được duyệt. Nếu decal không hỗ trợ, fallback là texture artwork phẳng riêng sau khi xác nhận UV. |

### Tiêu chí nhìn trên nền sáng/tối

- Xem swatch tại `material-swatches.svg`; ánh sáng/nền trung tính sáng và tối giúp so màu, không thay browser capture trên hoodie thật.
- Trên áo đen, đường viền/chi tiết của họa tiết phải còn phân biệt ở kích thước xem bình thường; không để vùng ngà cháy trắng hoặc bóng than nhập hoàn toàn vào vải.
- Nếp lớn ở thân, tay, mũ và túi phải còn đọc được dưới ánh sáng chính diện lẫn xiên; nếu thân thành mảng đen phẳng, tăng sáng môi trường hoặc nâng base color từng bước (tối đa khoảng `#202226`) trước khi giảm roughness.
- Bề mặt phải giữ cảm giác vải mờ: không highlight nhựa/bóng, không phản chiếu kim loại; metallic luôn 0.
- Kiểm cạnh in ở vùng cong/nếp và mọi đường ráp; không tràn, lật hoặc kéo giãn. Chỉ xác lập vùng in sau khi Designer kiểm UV/browser trên mesh được chọn.

## Swatches và fallback

Swatch sáng/tối dạng SVG kèm theo: `material-swatches.svg`. Đây là bảng màu định hướng, không phải ảnh render hay bằng chứng QA thị giác trên model.

Nếu chưa thể gắn decal/kiểm UV trên candidate: dùng swatch này làm tham chiếu cho artwork, ghi vùng in là **chưa xác định**, tiếp tục đặc tả độc lập; không giả lập ảnh composite trên UV hoặc báo phom đạt. Khi có phom được duyệt, Designer cần xác nhận placement profile và revision artwork; QA cần ảnh browser thật.

## Nguồn và bước tiếp theo

- Candidate GLB: `quality/candidates/grab3d-hoodie.glb`
- Manifest trạng thái phom: `quality/base-meshes.json` (`grab3d-hoodie-candidate-v1`, `candidate`)
- Material spec trước đây của hoodie thủ tục ATEL-1/v1 không áp dụng trực tiếp cho slot khác này.
- Bước kế tiếp: Designer/QA xác nhận phom và vùng UV; sau đó Material Specialist/Designer hiệu chỉnh factor/roughness trên render browser, tạo revision mới nếu cần.
