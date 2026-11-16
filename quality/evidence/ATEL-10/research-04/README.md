# ATEL-10/research-04 — hoodie mesh candidates

Ngày kiểm tra: 2026-11-14. Phạm vi: thử browser thật cho các nguồn hoodie, ghi nhận license trên trang nguồn và chụp mặt lưng khi viewer cho phép. Tất cả vẫn là `candidate`; không tải mesh, không tạo hash mesh, không sửa GLB, showcase/catalog hay base-mesh registry.

## Kết quả

Tìm được hai asset CC0 có thể mở và xoay trong browser để thấy mặt lưng. Cả hai đều là garment gắn cứng với hanger trong một static assembly, không có named pivot/nodes để tách riêng theo thông tin trang nguồn. Vì vậy chưa tìm được phom sạch đáp ứng yêu cầu dùng như base hoodie độc lập. Hai asset dưới đây chỉ là fallback tham khảo, không đề xuất duyệt. BlendSwap và Sketchfab được ghi thêm như nguồn đối chiếu; bằng chứng browser của chúng không cho thấy mặt lưng.

Các ảnh PNG trong thư mục là ảnh chụp trang và viewer bằng Chromium/Playwright, không phải schematic hay thumbnail tải riêng. Với hai asset 3DAssets, ảnh `*-back*.png` được chụp sau thao tác kéo xoay viewer đến mặt sau.

## Candidate 1 — Hoodie on a hanger (Snowboard Gear and Freestyle Riders)

- Trang nguồn: https://3dassets.dev/assets/snowboard-gear-and-freestyle-riders-hoodie-on-hanger-a770c75b
- Model URL được công bố trên trang: https://cdn.3dassets.dev/assets/27162/v1/model.glb
- License trang nguồn: CC0 1.0 Universal; [văn bản CC0](https://creativecommons.org/publicdomain/zero/1.0/). Trang ghi free to use, không yêu cầu attribution.
- Thông tin trang: 0.581 × 0.807 × 0.27 m; 1,020 tris; hoodie có hood lót, dây rút, túi kangaroo, bo cổ tay và gấu.
- Browser evidence: `3dassets-front-source.png`, `3dassets-rotated-source.png`. Ảnh sau cho thấy lưng hoodie trơn, viewer xoay được; cũng thấy móc và hanger còn gắn với garment.
- Rủi ro: trang xác nhận toàn bộ là một static assembly, không có named pivot nodes. Không thể coi đây là mesh hoodie sạch/tách hanger. Không tải GLB hoặc xác minh topology/UV/hash.
- Đánh giá: fallback candidate có license và hình lưng xác minh trong browser; không đạt điều kiện phom sạch.

## Candidate 2 — Hoodie on a hanger (Clothing Rail and Wardrobe)

- Trang nguồn: https://3dassets.dev/assets/clothing-rail-and-wardrobe-hoodie-on-hanger-8ed88c32
- License trang nguồn: CC0 1.0 Universal; [văn bản CC0](https://creativecommons.org/publicdomain/zero/1.0/).
- Thông tin trang: hoodie màu sage, bo sáng; kích thước 0.68 × 0.81 × 0.20 m. Trang ghi garment và hanger cùng nằm dưới điểm origin để treo trên rail; hình học static, không cloth simulation/skinning.
- Browser evidence: `3dassets-wardrobe-front.png`, `3dassets-wardrobe-back.png`. Viewer xoay được; ảnh sau cho thấy mặt lưng và hanger.
- Rủi ro: hanger là một phần của static assembly. Màu/bo khác với brief ATEL-1 và không có bằng chứng mesh garment có thể tách riêng. Không tải GLB hoặc xác minh topology/UV/hash.
- Đánh giá: candidate phụ để tham khảo hình lưng; không đạt điều kiện phom hoodie độc lập.

## Nguồn đối chiếu — chưa đủ điều kiện candidate có mặt lưng

### Basic Hoodie — acstrider (BlendSwap)

- Trang nguồn: https://blendswap.com/blend/21443
- Trang hiện ghi CC0; tác giả mô tả tự dựng pattern và cho phép dùng tùy ý. License chuẩn: [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/).
- Trang ghi file Blender 2.7x, 3.4 MB. Chưa tải file, nên không có hash hoặc xác nhận nội dung file.
- Ảnh browser: `blendswap-front-source.png` và `blendswap-preview-2-source.png`. Ảnh thứ hai là preview wireframe; không xác nhận được mặt sau. Preview chính cho thấy nhiều hình/mesh kiểu mannequin quanh hoodie, chưa xác định garment có tách riêng được không.
- Rủi ro: cần mở file Blender để xác minh mesh rời, mặt sau, topology và UV. Không dùng preview này làm bằng chứng back view.

### Hoodie — Virtual Pandora (Sketchfab)

- Trang nguồn: https://sketchfab.com/3d-models/hoodie-97611a53e3b846f69e0655b210f72b2f
- Trang ghi downloadable, CC Attribution; license: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Nếu sử dụng phải ghi tác giả, nguồn, license và thay đổi.
- Trang mô tả hoodie dựng bằng CLO3D, 240.3k triangles; tác giả cho biết file CLO3D và rập DXF có thể cung cấp theo yêu cầu.
- Ảnh browser: `sketchfab-viewer-status.png`. Trang nguồn mở được, nhưng 3D viewer hiện báo “Something went wrong with the 3D viewer”; chỉ thấy poster mặt trước. Không có ảnh mặt lưng hoặc tương tác xác nhận được.
- Rủi ro: high polygon count so với viewer nhẹ; mặt lưng/UV và mesh độc lập chưa xác minh; file gốc cần yêu cầu tác giả.

## Bước tiếp theo

Hai asset 3DAssets cung cấp bằng chứng browser góc sau nhưng đều không phù hợp làm phom sạch vì hanger gắn cứng. BlendSwap/Sketchfab chưa có bằng chứng mặt lưng. Cần người có quyền tải và mở file Blender/CLO3D hoặc một nguồn khác có garment mesh độc lập để xác nhận tách mesh, topology/UV và góc lưng. Không đưa bất kỳ asset nào vào `quality/base-meshes.json` hay đánh dấu `approved` trong phạm vi nghiên cứu này.
