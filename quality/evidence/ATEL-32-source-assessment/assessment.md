# ATEL-32 — thẩm định và tách shirt candidate theo islands nguyên vẹn

## Kết luận

Đã tạo shirt-only **candidate** từ outfit nguồn bằng cách giữ các disconnected indexed-vertex components được xác định là áo và loại các components của váy. Không sửa source mesh, không xóa mặt trong island, không remesh hay hàn vertex. GLB candidate và mannequin preview mở được trong browser.

**Verdict Lead: source-derived candidate không đạt fit.** Clearance screen ghi nhận 4.600 exact triangle intersections trên 35.479 candidate pairs; sampled penetration tối đa 24,0511 mm. Front capture cho thấy phom áo ngắn/hẹp rõ so với mannequin-v1 T-pose. Không mở QA/ATEL-25, không approve base/G1. Dừng tạo biến thể từ source này trừ khi có source/phom mới được duyệt. Registry giữ nguyên `candidate`; v2.4/v2.5 và source giữ nguyên.

## Nguồn, lineage và transform

- Source: `quality/candidates/user-supplied/white_shirt_black_leather_skirt_outfit.glb`
- Source SHA-256: `48f2e9ba4694355b36c7148006c49af925c9002bd78b09cd28504d3dd0c0a93c`
- Attribution: Style3D CG, [Sketchfab source](https://sketchfab.com/3d-models/white-shirt-black-leather-skirt-outfit-9f9e3d05217a4f969cd08224ad0b0aee), CC-BY-4.0 (giữ attribution trong asset metadata).
- Registry id/status: `user-white-shirt-black-leather-skirt-outfit-48f2e9ba-v1` / `candidate`; không thay đổi registry.
- Derived candidate: `orders/ATEL-23/source-assessment/candidate-shirt-islands.glb`
- Derived SHA-256: `d4d27b29cead3a83141d67a1cbaffd0bca0822f1030df4407b9f319c6d7fe41e`
- Giữ hierarchy và root rotation nguồn; thêm wrapper scale `[0.001,0.001,0.001]` để diễn giải source coordinates mm thành mét. Mọi source garment primitive giữ UV0. Các island được chọn trỏ lại các vertex/index/UV nguồn; phần index accessor mới chỉ chứa toàn bộ tam giác của island chọn.

## Island mapping

Quy tắc connectivity: hai triangle cùng island khi chia sẻ indexed vertex ID. Không weld theo khoảng cách hình học. `island-map-all.json` có bounds đã biến đổi, centroid, UV bounds, triangle count, selected/excluded disposition cho từng island.

| Source mesh | Đưa vào candidate | Loại khỏi candidate |
|---:|---|---|
| 2 | 0–3: tay trái/dải trước áo | — |
| 4 | 0–5: cổ ve và chi tiết mép áo | — |
| 5 | 0–5: tay phải và cuff | 6–7: dải rủ ngang eo/váy |
| 6 | 6–7: mảng thân trước trái | 0–5: dải rủ/gấu váy |
| 7 | 0–1: mảng thân trước phải | 2–6: drape/dây váy |
| 8 | 0–1: thân sau/yoke | — |
| 10 | 0–27: hai cụm nút nẹp áo | 28–41: cụm nút thấp phía váy |
| 11 | 28–41: cụm nút áo | 0–27: nút hai bên váy |
| 12 | 0–13: nút nẹp áo | 14–27: nút thấp phía váy |

Mesh source 0, 1, 3, 9 (viền và panels váy) không được đưa vào candidate. Các surfaces cặp có cùng vùng bounds/UV được giữ nguyên nếu thuộc island được chọn.

## Fit và browser evidence

- Mannequin: `quality/candidates/mannequin/mannequin-180cm-v1.glb`, SHA-256 `da6d3e8ddf25e31a0b20242852a1f9757661fa8115fde0d0800ff5cc715355e9`, meters/+Y up/+Z front/T-pose; không thêm scale mannequin.
- Combined fit preview: `orders/ATEL-23/source-assessment/fit-evidence/shirt-candidate-on-mannequin-v1.glb`, SHA-256 `b55785dafefbbf1f2c54ab704ba323aaf3d8ccbba978c09910aa85e15ed5622e`.
- Browser viewable route: `http://127.0.0.1:8787/atelierx-products/quality-preview/atel32-fit-screen/index.html`.
- `fit-browser-qa`: front/back/left/right/detail/mobile; loaded, rotated, zoomed, desktop/mobile true, page errors 0. Standalone candidate QA evidence ở `candidate-browser-qa/`.
- Triangle screen input is flattened in world-meter coordinates and hash-bound to candidate/mannequin; result `triangle-intersection-result.json`. Clearance/sampled inside report: `contact-clearance-analysis.json`. Candidate pairs 35.479; exact triangle intersection pairs 4.600; max sampled depth 0,0240511 m. Đây là screening evidence, không phải G1 verdict.
- Capture hashes: `capture-hashes.json`; candidate, combined fit and source/object SHA records: `orders/ATEL-23/source-assessment/fit.json`.

## Trạng thái và giới hạn

Lead/QA cần đánh giá độc lập source candidate và fit screen. Không đăng ký approved base, không dùng làm final, không claim G1. v2.4 và v2.5 frozen, artwork/material/viewer/catalog không đổi.
