# Phiếu QA ATEL-1 · ATEL-2/v2 và ATEL-3/v2

Ngày kiểm: 2026-11-13. Phạm vi: kiểm tra tĩnh bundle và viewer source, local HTTP, tìm browser runner. Không sửa asset.

## Kết quả theo tiêu chí

| Tiêu chí | Kết quả | Bằng chứng / ghi chú |
|---|---|---|
| Một hốc mắt mở | ĐẠT (texture tĩnh) | Texture v2 có một hốc mắt mở; generator test đếm đúng một dark eye opening. |
| Artwork giữa, đúng chiều, không cắt | ĐẠT (texture/UV tĩnh) | Schematic mặt lưng cho thấy hình ở giữa và có lề; test kiểm safe margins, căn giữa, UV mặt lưng từ trên xuống dưới đúng chiều. Schematic không phải ảnh chụp viewer. |
| Mặt trước trơn | ĐẠT (cấu trúc) | Test xác nhận torso trước dùng material không texture; schematic mặt trước không có hình in. |
| GLB/manifest revision v2 | ĐẠT (cấu trúc) | Manifest ghi `revision: v2`; GLB header/version/length hợp lệ, texture embedded trùng PNG sidecar. Khronos report ghi 0 errors, 0 warnings, 0 infos. |
| Viewer trỏ GLB v2 | ĐẠT về source path; CẦN SỬA nhãn | `index.html` source trỏ `./assets/models/ATEL-2/v2/hoodie-skull-v2.glb`, nhưng `<title>` vẫn ghi `v1` và nhãn hiển thị `REVISION 01`. Chưa xác minh render runtime. Cần Visual Studio cập nhật nhãn revision. |
| HTTP local | ĐẠT trong lượt kiểm này | Dùng server local tại `http://127.0.0.1:4173/`; viewer, GLB v2 và PNG texture trả HTTP 200. Đây là URL loopback của môi trường kiểm tra, không phải URL host công khai; server tạm được dừng sau lượt kiểm tra. |
| Browser desktop/mobile render | BLOCKED | `remote-browser`: disconnected, `clientCount: 0`, `drivable: false`; desktop app scan không có app/CDP; `agent-browser` chưa cài; `computer-use` báo unsupported platform (Linux); fallback Chrome attach không có executable script tại đường dẫn catalog. Không có browser runner để quan sát render desktop/mobile hoặc chụp ảnh thật. |
| Xoay/zoom và screenshot thật | BLOCKED | Source có `camera-controls` và hướng dẫn pinch/scroll, nhưng đây chỉ là cấu hình; không có tương tác runtime hoặc screenshot browser được xác minh. Ảnh trong `front-placement-schematic.png` và `back-placement-schematic.png` là sơ đồ SVG ngoại tuyến, không phải browser capture. |
| Phom / physical fit | CHƯA XÁC MINH | Manifest/evidence ghi đây là procedural MVP; project không có base hoodie đã duyệt. Không kết luận phom sản xuất đạt. |

## URL và artifact

- Viewer source (local): `http://127.0.0.1:4173/`
- GLB v2: `http://127.0.0.1:4173/assets/models/ATEL-2/v2/hoodie-skull-v2.glb`
- Texture v2: `http://127.0.0.1:4173/assets/models/ATEL-2/v2/hoodie-back-skull-texture-v2.png`
- Manifest: `site-atel-1/dist/assets/models/ATEL-2/v2/asset-manifest.json`
- Texture/artwork: `site-atel-1/dist/assets/models/ATEL-2/v2/`
- Validator report: `site-atel-1/evidence/ATEL-2/v2/gltf-validator-report.json`
- Test command: `node --test site-atel-1/tools/generate-atel2-v2.test.mjs` — 3 passed, 0 failed.

## Verdict

**Chưa thể nghiệm thu viewer ATEL-3/v2.** Phần texture/GLB tĩnh đạt các kiểm tra nêu trên, nhưng nhãn viewer còn ghi v1 và runtime browser QA desktop/mobile, xoay/zoom, screenshot cùng phom chưa được xác minh. Cần Visual Studio cập nhật nhãn v2; cần browser runner để hoàn tất runtime QA. Không tuyên bố viewer hoặc phom đạt.
