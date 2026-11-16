# ATEL-33 · rà hai nguồn phom sơ mi mới — research-01

## Kết luận

Không có ứng viên nào hiện đủ cơ sở để dùng làm phom sơ mi được duyệt cho ATEL-23. Nên tiếp tục prototype của Designer trên mannequin-v1. Nếu Lead muốn thêm một vòng nguồn, đồng phục học sinh Nhật là nguồn gần nhất để xin phạm vi tách riêng áo trên và kiểm fit; không tái dùng outfit áo sơ mi/váy bị Lead bác.

## So sánh

| Ứng viên | Nguồn/quyền | Mesh, UV, dáng và bounds | Khuyến nghị |
|---|---|---|---|
| Japanese School Uniform | sivayuce, [Sketchfab](https://sketchfab.com/3d-models/japanese-school-uniform-5358af0b05724d509be427628a316397), CC-BY-4.0 theo metadata; owner policy cho phép trong project. SHA-256 `2061a93d7c86dd9a32eba365e26caee59526b69eb93df49b943e387815620390` | 7 mesh; 2 shell vật liệu shirt, 1 mesh cổ/tay, nơ và váy tách riêng. Tất cả có UV0. Local bounds áo gần x -32.7..32.5, z 116.1..160.2; root transform xoay trục nên chưa quy đổi sang mét mannequin. Dáng đồng phục học sinh, khác sơ mi công sở. | Chỉ xem xét extraction mới khi Lead cho phép và Designer/QA kiểm transform, UV placement, cổ/vai/nách, intersections với mannequin. Không dùng nguyên outfit. |
| Man Black Business Suit | Style3D CG, [Sketchfab](https://sketchfab.com/3d-models/man-black-business-suit-7a669a06fb954d459985ccaa98672177), CC-BY-4.0 theo metadata; owner policy cho phép trong project. SHA-256 `e585ced6202f6e7d27bf93de0ac31c76aeb2316b9821e4e9f86ddc3b7cd973e0` | 37 mesh, UV0 có mặt; phần lớn cùng material `uniform_1001`, mesh shirt không định danh được. Root xoay trục, local Z tới 1618 đơn vị nguồn; scale chưa xác nhận. | Không chọn làm sơ mi. Chỉ reference silhouette công sở; muốn dùng phải map mesh và tách lớp vest/cà vạt/nút trước fit. |

## Ảnh và kiểm tra

- Preview nội bộ: [atel33-source-inspection](http://127.0.0.1:8787/atelierx-products/quality-preview/atel33-source-inspection/index.html). Route trả HTTP 200.
- Browser screenshot capture đã thử nhưng timeout khi chụp trang có model vest 37 mesh; không ghi nhận capture thành công cho ATEL-33. Vì vậy báo cáo này không dùng ảnh ATEL-32 của nguồn đã bị bác làm bằng chứng cho hai ứng viên mới.
- GLB inspection: `node tools/inspect-glb.mjs`; xác nhận topology count, UV0 attribute, material labels và transforms. UV0 chỉ xác nhận kênh UV có tồn tại; chưa chứng minh vùng in.
- Không làm mannequin overlay/intersection test vì chưa xác nhận units/transform của hai asset. Mannequin tham chiếu là 1,80 m, meters, +Y up, +Z front, SHA `da6d3e8ddf25e31a0b20242852a1f9757661fa8115fde0d0800ff5cc715355e9`.

## Ranh giới quyết định

Cả hai registry entry giữ `candidate`; không sửa `quality/base-meshes.json`, không approve, không dùng làm final. ATEL-32 rejected source bị loại khỏi vòng tìm mới: 4.600 cặp giao cắt / 35.479 cặp kiểm, penetration mẫu tối đa 24,0511 mm.

Chi tiết máy đọc và SHA: `orders/ATEL-23/source-assessment/ATEL-33-research-01.json`.
