# ATEL-1/v1 — Đặc tả chất liệu số và vùng in

**Đơn:** ATEL-1  
**Revision được đối chiếu:** ATEL-2/v1  
**Phạm vi:** material cho preview 3D số; không xác nhận thông số may hoặc kích thước áo thật.

## Chốt material số

| Vị trí / material slot | Màu số | Metallic | Roughness | Ghi chú |
|---|---:|---:|---:|---|
| Thân áo, tay áo — `black-cotton-fleece` | `#111214` (base factor xấp xỉ `[0.025, 0.028, 0.034]`) | 0 | 0.96 | Đen mờ, texture noise nhẹ hiện có |
| Túi trước — `front-kangaroo-pocket-black-fleece` | gần `#111214` (`[0.035, 0.038, 0.044]`) | 0 | 0.97 | Cùng tông thân áo; mặt trước không in |
| Bo tay — `rib-knit-cuffs` | đen sâu (`[0.018, 0.02, 0.025]`) | 0 | 0.98 | Tạo khác biệt rất nhẹ với thân |
| Mũ — `hood-shell` | đen (`[0.03, 0.033, 0.04]`) | 0 | 0.98 | Không có họa tiết |
| Dây rút — `hood-drawcords` | xám than (`[0.095, 0.098, 0.105]`) | 0 | 0.90 | Giữ dây nhìn thấy trên nền đen |
| Panel lưng — `back-panel-black-with-skull-print` | texture PNG ATEL-2/v1 | 0 | 0.96 | Nền đen và hình đầu lâu 3 tông |

## Họa tiết và vùng in số

- Asset thực có: `hoodie-back-skull-texture-v1.png` (1024 × 1024 px), artwork nguồn `hoodie-back-skull-artwork-v1.svg` (400 × 440 px).
- Bounding box phần artwork trong PNG: **x=350–674, y=178–539 px**, kích thước **324 × 361 px**, tâm x=512 px. Màu chính: xương ngà `#DDD8CD`, xám `#A9A69F`, hốc/viền than `#38393B`.
- Vùng này được UV-map lên mesh `back-pullover-torso-print-panel`; họa tiết dựng thẳng chiều, căn giữa lưng và dưới mũ. Mặt trước dùng `front-pullover-torso-plain`, không dùng material in; túi trước vẫn là material đen riêng.
- Đây là vùng in khả dụng đã biết theo texture/UV của ATEL-2/v1. Không quy đổi sang mm vì model procedural chưa có scale vật lý được duyệt.

## Tương thích, fallback và asset thiếu

Đặc tả tương thích với asset ATEL-2/v1 hiện có: GLB, texture PNG, artwork SVG, manifest và generator đều tồn tại. Manifest ghi rõ mesh procedural MVP, chưa có base hoodie/UV được duyệt. Dùng bộ asset này làm fallback cho preview số ATEL-1/v1; cần Designer thay mesh/UV nếu có phom chuẩn mới, sau đó cập nhật UV/print region và revision liên quan.

## File nguồn

- GLB: `site-atel-1/dist/assets/models/ATEL-2/v1/hoodie-skull-v1.glb`
- Texture: `site-atel-1/dist/assets/models/ATEL-2/v1/hoodie-back-skull-texture-v1.png`
- Artwork: `site-atel-1/dist/assets/models/ATEL-2/v1/hoodie-back-skull-artwork-v1.svg`
- Manifest: `site-atel-1/dist/assets/models/ATEL-2/v1/asset-manifest.json`
- Generator: `site-atel-1/tools/generate-atel2.mjs`
