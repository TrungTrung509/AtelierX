# Bàn giao Designer — ATEL-11/v2

## Kết luận

Có thể loại phần giá đỡ khỏi bản sao mà không sửa dữ liệu UV, và đã tạo ứng viên `grab3d-hoodie-clean-v2`. Đây chưa phải phom được duyệt: ảnh browser còn vài vệt nhỏ gần đường cổ/vai cần QA xem lại; không đổi trạng thái `approved`.

## Tệp và nguồn

- GLB: `quality/candidates/grab3d-hoodie-clean-v2.glb`
- Revision: `grab3d-hoodie-clean-v2` (dẫn xuất từ `grab3d-hoodie-candidate-v1`)
- SHA-256: `42dc0075e632eab84256f71d9cc88b6eb6d54d04cbff3682f548f62e55994a13`
- Nguồn/license giữ nguyên: Grab3D, CC0-1.0; `quality/candidates/grab3d-hoodie-LICENSE.txt`
- Manifest: `quality/base-meshes.json`; trạng thái vẫn là `candidate`.
- Preview trong Crewly: `http://127.0.0.1:8787/atelierx-products/quality-preview/hoodie-clean-v2/index.html`

## Phương pháp và kiểm tra UV

Mesh gốc có một mesh, một primitive và một material; giá đỡ không phải node riêng. Script hiện có `tools/remove-stand-prototype.mjs` lọc 3.858/24.953 tam giác trên bản sao theo vùng không gian. Phần còn lại giữ nguyên dữ liệu POSITION, NORMAL và TEXCOORD_0; checksum của ba dải dữ liệu đầu vào và ứng viên trùng nhau. 21.095 tam giác còn lại.

UV checker 8×8 được gắn riêng vào bản chẩn đoán, không vào GLB ứng viên: `quality/evidence/ATEL-11/v2/uv-checker/back.png`. Các ô ở thân sau nhìn rõ, không thấy kéo giãn lớn; mép hood/tay có các đường UV island/đứt ô như mong đợi. Đây là kiểm tra checker, chưa thay thế phép thử artwork placement và QA độc lập.

## Ảnh browser của đúng revision

`quality/evidence/ATEL-11/v2/browser-result.json` ghi `loaded`, `rotated`, `zoomed`, `desktop`, `mobile` đều `true`, không lỗi. Đã xem trực tiếp `front.png`, `back.png`, `left.png`, `right.png`, `detail.png`, `mobile.png`; cọc và chân đế không còn chắn giữa lưng, nhưng còn vệt nhỏ sát cổ/vai. Cần QA kiểm mép mesh và quyết định liệu có thể lọc phần dư mà không cắt hood/áo.

## Bước tiếp theo

QA kiểm tra ứng viên `grab3d-hoodie-clean-v2` bằng ảnh cùng revision, đặc biệt vùng cổ/vai, đường may và UV placement; Lead quyết định giữ hay loại. Không dùng revision này cho sản phẩm `complete` trước khi QA và Lead duyệt.
