# Checklist QA độc lập — ATEL-23/v1

## Định danh/revision
- [ ] Garment GLB revision + SHA-256 khớp handoff của Designer.
- [ ] Display GLB revision + SHA-256 khớp bản viewer chính thức.
- [ ] Mannequin `quality/candidates/mannequin/mannequin-180cm-v1.glb`, SHA `da6d3e8ddf25e31a0b20242852a1f9757661fa8115fde0d0800ff5cc715355e9`; không áp transform/scale lặp.
- [ ] `fit.json` trỏ đúng mannequin/profile, ghi kết quả và các điểm giao cắt/clipping.

## Fit sớm trên mannequin T-pose
- [ ] Cổ/cổ áo và vai: cân giữa, không xuyên cổ/mannequin, không hở bất thường.
- [ ] Nách và vòng tay: không cắt vào thân/mannequin; hai bên tương xứng.
- [ ] Tay áo/khuỷu/cổ tay: bao phủ tự nhiên, không lơ lửng hoặc xuyên bàn tay/cổ tay.
- [ ] Thân trước/sau và sườn: khoảng hở phù hợp dáng sơ mi; không có xuyên/clipping nhìn thấy.
- [ ] Gấu trước/sau: không cắt vào hông/chân; không giao cắt với tay/thân.
- [ ] Kiểm tra các vùng giao nhau trong 3D, không kết luận từ bounds hoặc một góc camera.

## Viewer và sản phẩm cuối
- [ ] Official viewer/model HTTP 200; display GLB chứa đúng garment + mannequin-v1.
- [ ] Browser QA: loaded/rotated/zoomed/desktop/mobile true; errors rỗng.
- [ ] Captures thật: front/back/left/right/detail/mobile; mannequin toàn thân, head/hands/feet nhìn thấy.
- [ ] Nội dung tiếng Việt hiển thị cạnh/dưới model và khớp revision.
- [ ] Đối chiếu brief: loại sơ mi, màu, họa tiết/vị trí, mannequin/full-body, fit/clipping, copy.

Điểm fit chỉ áp dụng cho garment revision được bàn giao; mannequin profile là measured-reference, không phải phê duyệt tự động cho áo.
