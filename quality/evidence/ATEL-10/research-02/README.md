# ATEL-10/research-03 — nguồn hoodie và bằng chứng trang nguồn

Ngày kiểm tra: 2026-11-14. Các ảnh JPEG trong thư mục là thumbnail tải trực tiếp từ thẻ `og:image` của trang nguồn (không phải ảnh chụp browser tương tác). Cả hai chỉ cho thấy mặt trước/góc trước; chưa đáp ứng yêu cầu ảnh mặt lưng. Trong lượt retry này, web search vẫn xác nhận metadata/license của hai trang; mở trực tiếp qua web tool trả HTTP 403. Direct GET của Sketchfab bằng curl trả HTTP 200, nhưng không có được browser capture hoặc góc sau đáng tin cậy. Không tải mesh, không có hash mesh, và không đánh giá topology/UV. Vì vậy các ứng viên vẫn chỉ là tài liệu tham khảo candidate, không đủ để xác nhận phù hợp vùng lưng.

## Ứng viên 1 — Basic Hoodie, acstrider (BlendSwap)

- Trang nguồn: https://blendswap.com/blend/21443
- Bằng chứng trang nguồn: metadata của chính trang BlendSwap qua kết quả tìm kiếm ghi License: CC0; mô tả tác giả nói tự dựng pattern khi học MD và “Use it for whatever you'd like”. Tham chiếu: https://blendswap.com/blend/21443
- License gốc được gắn trên asset: CC0 theo metadata trang nguồn; văn bản license chuẩn: https://creativecommons.org/publicdomain/zero/1.0/. Chưa lưu được snapshot HTML mới trong lượt retry này; không diễn giải nội dung license ngoài metadata trang.
- Trang liệt kê Blender 2.7x/Cycles, tệp tải 3.4 MB. Chưa tải được file trong lần nghiên cứu này, nên không ghi hash hoặc xác nhận nội dung archive.
- Thumbnail nguồn: `blendswap-basic-hoodie-preview.jpg`; SHA-256 `93298957dd56d0cec509205141d3d5f0a01252467fa0ddb7a108ea0041d64646`.
- Góc/rủi ro hình học: hai preview ở trang nguồn nhưng không có được bản ảnh góc sau trong phiên này; thumbnail đã lưu chỉ thể hiện trước/góc trước, áo trên nhân vật. Chưa xác minh mặt lưng, mesh người mẫu có tách rời được không, vùng lưng/UV hay topology. Cần mở viewer/file, xoay/chụp lưng.
- Trạng thái đề xuất: candidate nghiên cứu; không duyệt.

## Ứng viên 2 — Hoodie, Virtual Pandora (Sketchfab)

- Trang nguồn: https://sketchfab.com/3d-models/hoodie-97611a53e3b846f69e0655b210f72b2f
- Bằng chứng trang nguồn: HTML trang nguồn kiểm lại qua curl trả HTTP 200 và trang kết quả tìm kiếm chính chủ ghi tác giả Virtual Pandora, model hoodie tạo bằng CLO3D, 240.3k triangles, downloadable; license CC Attribution (CC BY). Tham chiếu: https://sketchfab.com/3d-models/hoodie-97611a53e3b846f69e0655b210f72b2f
- License gốc được gắn trên asset: CC BY 4.0; https://creativecommons.org/licenses/by/4.0/. Khi dùng phải ghi công phù hợp, liên kết license và thông báo thay đổi nếu có. Rà soát thêm quyền hình ảnh/thương hiệu nếu mesh có yếu tố bên thứ ba.
- Tác giả ghi model CLO3D gốc và rập DXF (nam cỡ M) có thể cung cấp theo yêu cầu; không có file/hash trong nghiên cứu này.
- Thumbnail nguồn: `sketchfab-virtual-pandora-hoodie-preview.jpg`; SHA-256 `5b3e9f583c5415b4eabc802361b4260acca7b78094ff2ab46977f88f41ab0280`.
- Góc/rủi ro hình học: thumbnail chỉ thể hiện trước; trang có 3D viewer nhưng phiên này không chụp được browser capture hoặc xác nhận ảnh mặt lưng. Chưa kiểm topology, mesh rời, UV/vùng in, dung lượng thực tải. Không ghi thumbnail là bằng chứng mặt sau.
- Trạng thái đề xuất: candidate nghiên cứu; không duyệt.

## Kết quả retry 2/3 và bước tiếp theo

Acceptance về nguồn/license có bằng chứng sơ bộ cho hai ứng viên; acceptance về ảnh/góc thể hiện vùng lưng chưa đạt. `web.open` cho cả hai trang trả 403; tìm kiếm chỉ trả metadata/thumbnail, không có ảnh sau. Để hoàn tất cần người có browser/asset access mở viewer hoặc file và cung cấp screenshot vùng lưng; đồng thời tải mesh, ghi hash, kiểm tra tách mesh, topology và UV. Không khẳng định BlendSwap có license/mesh kiểm chứng vượt metadata nguồn và không đưa bất kỳ ứng viên nào thành `approved` dựa riêng vào hồ sơ này.
