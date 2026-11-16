# ATEL-35 Research — v1

## Hướng họa tiết

Hoa năm cánh nhỏ, nét gọn, nhụy vàng ấm, thân và lá olive. Hồng đất tạo tương phản dịu trên nền áo kem; dùng một motif đơn ở ngực trái, không lặp toàn thân. SVG có nền trong suốt để Designer/Material tự quyết kích thước, vị trí cuối và cách map lên UV sau khi phom xám được xem xét.

## Rà phom/UV nội bộ

| Phom | Nguồn / SHA-256 | Ghi nhận | Đề xuất |
|---|---|---|---|
| `user-t-shirt-922001c3-v1` | `quality/candidates/user-supplied/t-shirt.glb` · `922001c3404f16be6a5e752928063696469d10c6dd0f269e44b455f41d79e237` | Đúng loại tshirt, 1 mesh/primitive, có TEXCOORD_0 (27,983 position/UV vertices). UV bounds gần toàn 0–1; cần Designer kiểm tách đảo trước/ngực và khả năng đặt motif ngực trái. GLB có các transform nút lồng nhau, cần chuẩn hóa khi thử độc lập. | **Ưu tiên thử trước**: lưới dày hơn và garment type khớp; chưa được xem là phom đạt hay UV placement đã xác minh. |
| `user-t-shirt-1--4edb5292-v1` | `quality/candidates/user-supplied/t-shirt (1).glb` · `4edb5292c2a5003dba5200af62ce6cd45f3a4ca1dadbaa94ad8c8553d3e8f241` | Đúng loại tshirt, 1 mesh/primitive, có TEXCOORD_0 (319 position/UV vertices), UV bounds gần toàn 0–1. Lưới rất thưa; vị trí/chất lượng hình in chưa kiểm tra. | Dự phòng nếu Designer đánh giá silhouette/UV thuận lợi hơn; cần kiểm lại transform và xem ảnh áo xám. |

Cả hai nguồn là phom người dùng cung cấp, được phép dùng nội bộ theo `quality/USER_SUPPLIED_BASE_POLICY.md`; trạng thái đều `candidate`. Rà soát này chỉ xác nhận metadata mesh/UV và loại áo từ registry/GLB, không duyệt silhouette, topology, vùng in hoặc fit. Designer chọn tối đa một phom để xem ảnh xám trước trang trí; QA/Lead quyết định phom theo flow mới.

## Copy gợi ý

“Áo thun màu kem với một bông hoa nhỏ ở ngực trái. Họa tiết năm cánh hồng đất, nhụy vàng ấm và lá olive tạo điểm nhấn nhẹ trên phom áo tối giản.”

Chất liệu mô phỏng và thông số chờ Material/Designer cung cấp nguồn; không suy đoán tính chất vải hoặc size sản xuất.
