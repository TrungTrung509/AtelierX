# Designer handoff — ATEL-15 / ATEL-9

## Kết luận

Đã tạo profile UV và artwork chẩn đoán cho candidate `grab3d-hoodie-clean-v2`, nhưng G1 **chưa đạt**. Không sửa GLB nguồn hoặc manifest; giữ trạng thái `candidate`. Bản thử cho thấy artwork lưng giữa bị mũ phủ một phần, còn ảnh cận cổ cho thấy một thanh/mảnh hình học nằm ngang còn sót phía trên mép mũ/cổ. QA độc lập cần kiểm đúng bản chẩn đoán và ảnh browser trước khi Lead quyết định sửa mesh hay loại candidate.

## Asset và revision

- Candidate nguồn: `quality/candidates/grab3d-hoodie-clean-v2.glb`
- Candidate SHA-256: `42dc0075e632eab84256f71d9cc88b6eb6d54d04cbff3682f548f62e55994a13` (khớp `quality/base-meshes.json`)
- Revision nguồn: `grab3d-hoodie-clean-v2` (candidate, không được duyệt)
- GLB chẩn đoán placement: `quality/evidence/ATEL-15/v2/grab3d-hoodie-clean-v2-placement-test.glb`
- GLB chẩn đoán SHA-256: `631b0673252dc4d74c72a752aed2a9c00c447ceb6ebcaf61c22c34fa0230486d`
- Profile: `quality/evidence/ATEL-15/v2/placement-profile.json`
- Artwork nguồn: `quality/evidence/ATEL-15/v2/artwork/chest-test.svg`, `back-test.svg`; texture áp dụng: `hoodie-clean-v2-placement-test.jpg`
- Preview Crewly nội bộ: `http://127.0.0.1:8787/atelierx-products/quality-preview/hoodie-clean-v2-placement-test/index.html`

GLB chẩn đoán chỉ thay texture của material slot `hoodie_body_pbr` trên mesh 0 / primitive 0, dùng `TEXCOORD_0`; geometry và source candidate không thay đổi. Placement bounds là đề xuất thử, không phải vùng in đã được duyệt.

## Kiểm tra geometry và UV

`tools/analyze-components.mjs` trên candidate nguồn: 19,253 vertices, 21,095 tam giác, 1,314 thành phần liên thông theo index. Hai mảng thân lớn nhất có 2,772 tam giác (lưng, UV U .41365–.77359 / V .62524–.90086) và 2,564 tam giác (thân trước, UV U .13579–.40842 / V .43869–.79575). Chỉ số thành phần có thể bị chia bởi seam/vertex trùng UV, nên không dùng riêng số đếm để kết luận mesh thủng.

Ảnh cận browser `browser/neck-shoulder-front-detail.png` và `browser/neck-shoulder-detail.png` cho thấy đường V cổ phía trước tương đối liên tục, hai dây rút gắn ở hai bên; tuy vậy còn một dải/thanh ngang trên miệng cổ ở phía trước và một mảnh ngang có đầu gồ ghề phía trên mũ ở mặt sau. Ảnh chưa chứng minh đó là phần giá treo còn sót hay chi tiết cấu tạo; QA cần xem trực tiếp và đánh giá mép vai/cổ để phân biệt.

## Placement test / điều quan sát được

- Ngực: UV bounds U .270–.370 / V .485–.600, tâm (.320, .5425), hướng thẳng. Dấu test chuyển về phía phải người xem, nằm trên túi; dây rút chạm/che nhẹ mép trái artwork nhưng vùng chữ đọc được.
- Lưng: UV bounds U .500–.680 / V .810–.890, tâm (.590, .850), texture xoay +90° để chữ lên đúng chiều. Mũ phủ một phần phía trên artwork; placement giữa lưng hiện chưa an toàn ở vùng này. Cần QA xác nhận vùng thấp hơn/khác hoặc yêu cầu một mesh mới trước khi dùng làm profile chính thức.
- Ảnh browser thật: `browser/front.png`, `back.png`, `left.png`, `right.png`, `detail.png`, `mobile.png`, `neck-shoulder-front-detail.png`, `neck-shoulder-detail.png`.
- `browser/browser-result.json`: loaded, rotated, zoomed, desktop và mobile đều true; không có lỗi trang. Đây là kết quả tải/tương tác, không thay cho quyết định thẩm mỹ QA.

## Bước tiếp theo

QA (`atelierx-qa-0004`) kiểm độc lập toàn bộ ảnh trên đúng diagnostic revision, đặc biệt thanh ngang cổ/mũ, đường vai, dây rút và phần artwork lưng bị che. Nếu lỗi là mesh residue, Designer tạo mesh revision mới và đổi SHA/profile trước khi QA retest; nếu hood che mọi vùng placement hợp lý, Lead giữ candidate hoặc chuyển sang phom khác. Không cập nhật catalog/QA report trong phần việc này.
