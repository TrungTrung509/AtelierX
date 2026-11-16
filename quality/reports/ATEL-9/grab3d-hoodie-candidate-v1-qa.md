# QA độc lập G1 — `grab3d-hoodie-candidate-v1`

- Đơn cha: ATEL-9; WorkItem: ATEL-14
- Revision ứng viên: `grab3d-hoodie-candidate-v1`
- Quyết định QA: **TRẢ LẠI — chưa đủ điều kiện G1; giữ trạng thái `candidate`.** QA không tự đổi sang `approved`.
- Phạm vi: rà ảnh Chromium thực có sẵn cùng metadata browser; đây là đánh giá ứng viên phom, không phải nghiệm thu sản phẩm cuối.

## Bằng chứng browser thực đã rà

Nguồn: `quality/evidence/base-hoodie-candidate/`; viewer: `http://127.0.0.1:8787/atelierx-products/quality-preview/hoodie/index.html`.
`browser-result.json` ghi `loaded`, `rotated`, `zoomed`, `desktop`, `mobile` đều `true`, `errors` rỗng. Tôi đã trực tiếp xem cả sáu ảnh sau:

- Front: `quality/evidence/base-hoodie-candidate/front.png`
- Back: `quality/evidence/base-hoodie-candidate/back.png`
- Left: `quality/evidence/base-hoodie-candidate/left.png`
- Right: `quality/evidence/base-hoodie-candidate/right.png`
- Detail: `quality/evidence/base-hoodie-candidate/detail.png`
- Mobile: `quality/evidence/base-hoodie-candidate/mobile.png`

## Nhận xét theo tiêu chí G1

| Tiêu chí | Kết quả | Evidence và nhận xét |
|---|---|---|
| Nhận diện silhouette hoodie | Đạt sơ bộ, chưa đủ để duyệt | Front/back và hai bên cho thấy thân, tay dài, bo gấu, mũ, dây rút và túi kangaroo; kiểu hoodie đọc được. Góc bên có giá đỡ sát/xuyên vùng áo nên đánh giá dáng cạnh bị ảnh hưởng. |
| Vùng in lưng | Không đạt | `back.png`: cọc dọc chắn giữa lưng, chiếm vùng in trung tâm. Không thể xem hoặc dùng trọn vùng đặt hình chính. |
| Giá đỡ xuyên/che | **Lỗi chặn** | `front.png`, `back.png`, `left.png`, `right.png`, `detail.png`, `mobile.png`: cọc/nhánh giá đỡ đi xuyên qua áo hoặc chồng trước áo; trên ảnh sau nó che thẳng giữa lưng, ảnh detail bị cọc chiếm gần giữa khung. |
| UV / placement profile | Chưa xác minh | Ảnh hiện tại không chứng minh được ảnh thử có hướng đúng, không méo/tràn đường may, hay vùng UV lưng/ngực sử dụng được. Cần bản mesh đã xử lý cùng phép thử artwork và ảnh browser mới. Không suy diễn UV đạt từ ảnh phom. |
| Nguồn và quyền | Có khai báo, cần giữ hồ sơ theo revision | `quality/base-meshes.json` ghi nguồn Grab3D, CC0-1.0, URL và checksum; `quality/candidates/grab3d-hoodie-LICENSE.txt` ghi tuyên bố CC0. Đây là hồ sơ quyền hiện có, không thay thế việc lưu lại URL/license/hash cho bản sửa mới. |
| Browser / khả năng kiểm tra | Đạt cho bộ ảnh hiện có | Metadata báo tải, xoay, zoom, desktop và mobile thành công, không lỗi; ảnh thực đủ sáu góc nêu trên. Kết quả này không làm mất lỗi hình học nhìn thấy. |

## Checklist cho ứng viên hoodie tiếp theo hoặc bản sửa mới

1. Ghi ID và revision riêng; lưu URL nguồn, license gốc/điều kiện dùng, file license và SHA-256 đúng với file được thử.
2. Xác nhận mesh có thể chỉnh/tách an toàn; front/back/side không có giá đỡ, hanger hoặc bộ phận rời xuyên hay che trang phục. Nếu phần rời có chủ đích, ghi rõ và chứng minh không cản vùng nhìn/in.
3. Chụp browser thực tại đúng viewer: front, back, left, right, detail vùng lưng/ngực, và mobile; kiểm tra viewer tải, xoay, zoom.
4. Thử một artwork có đường viền/hướng dễ nhận biết trên lưng và ngực; xác nhận không lật, méo, tràn đường may hoặc bị che. Lưu ảnh test cùng revision.
5. Kiểm silhouette hoodie ở front/back/side sau khi xử lý: mũ, thân, tay, vai, bo cổ tay/gấu và túi nối hợp lý, không có khe/xuyên/chồng lộ rõ.
6. Ghi material slots và placement profile theo mesh; Lead chỉ xem xét `approved` khi bản mesh, UV/placement profile, license/hash và ảnh browser cùng trỏ một revision.
7. Với ứng viên không đạt, ghi đúng lỗi nhìn thấy và chủ sửa; không dùng ảnh sơ đồ, ảnh từ môi trường khác hoặc metadata thay cho ảnh browser.

## Retest cần có trước khi xem xét G1

- Designer: bỏ/tách giá đỡ khỏi vùng áo an toàn, tạo revision mới và cung cấp GLB + checksum; không chỉnh status.
- Designer: thử artwork trên lưng/ngực và cung cấp ảnh browser mới để chứng minh UV/placement.
- QA: xem lại sáu góc trực tiếp ở revision mới, tập trung đường viền áo sau khi bỏ giá đỡ, vùng in, lỗi ráp/xuyên và mobile.
- Lead: cân nhắc duyệt sau khi đủ evidence cùng revision; quyết định cuối thuộc Lead.
