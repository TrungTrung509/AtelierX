# Designer handoff — ATEL-17 / ATEL-9

## Kết quả

Đã tạo diagnostic geometry revision `clean-v2-neckfix-placement-v3` và sửa placement sau khi browser xác nhận lỗi tâm texture trước đó. Ảnh browser hiện cho thấy dấu lưng nằm trọn dưới hood và trên gấu; dấu ngực ở phía viewer-left, không chạm dây rút hoặc túi. Vệt sáng lạc gần túi đã biến mất sau khi đặt artwork theo đúng pixel-space center `(U,V)`.

Đây là bằng chứng chỉnh sửa để QA retest, không phải phom được duyệt. Giữ candidate registry và catalog nguyên trạng.

## SHA và file

- Source candidate `grab3d-hoodie-clean-v2`: `quality/candidates/grab3d-hoodie-clean-v2.glb`
  - SHA-256: `42dc0075e632eab84256f71d9cc88b6eb6d54d04cbff3682f548f62e55994a13` (khớp manifest nguồn)
- Mesh revision: `quality/evidence/ATEL-17/clean-v2-neckfix-placement-v3/hoodie-mesh-revision.glb`
  - SHA-256: `34374edd321b7e8396656e7d5a003e359d9349c5cc35bb5bc37a5c99145141bf`
  - Derived from source SHA ở trên; 21.095 → 19.496 tam giác. Xóa 1.458 mặt của dải mảnh xuyên vùng cổ và hai component mảnh rời phía trên/sau hood (141 mặt).
- Diagnostic GLB có texture thử: `quality/evidence/ATEL-17/clean-v2-neckfix-placement-v3/diagnostic.glb`
  - SHA-256: `964e87b98a215cf1c8b86ce0b42f6a881b384202caf8faeaca3928aa6c64ea92`
- Profile: `placement-profile.json`; texture và nguồn artwork: `placement-test.jpg`, `artwork/chest-test.svg`, `artwork/back-test.svg`.
- Giao diện mở trong Crewly: http://127.0.0.1:8787/atelierx-products/quality-preview/hoodie-clean-v2-rev03/index.html

## Cổ/vai và dải ngang

Ảnh trước revision: `quality/evidence/ATEL-15/v2/browser/neck-shoulder-front-detail.png` và `neck-shoulder-detail.png`. Cận trước cho thấy dải rời nằm sau miệng cổ V; cận sau có hai mảnh hẹp đầu gồ ghề phía trên hood.

Mesh audit cho thấy dải trước nằm giữa hai mặt vải theo chiều sâu và hai dải sau là component liên thông riêng, mỏng. Chúng đã được loại khỏi **bản sao revision**; candidate nguồn không đổi. Cận sau revision cho thấy còn một đường cong mảnh trên đỉnh hood. Phần này thuộc component hood/thân sau liên tục, cùng material `hoodie_body_pbr` và bề mặt vải; không còn component rời hoặc đầu gồ ghề. Tôi giữ lại như viền/đường ráp hood-vải, nhưng QA cần xác nhận diễn giải đó độc lập.

## Placement và kiểm tra texture

- Material slot: `hoodie_body_pbr`, mesh 0 / primitive 0 / material 0; `TEXCOORD_0`.
- Ngực: U `.175–.245`, V `.5025–.5975`, hướng thẳng; badge ở phía viewer-left, trên túi và lệch khỏi dây rút.
- Lưng: U `.44–.56`, V `.80–.88`; artwork xoay `+90°` quanh pixel center `(U=.50,V=.84)`. Bounds pixel texture 2048² là x `901–1147`, y `1638–1802`. Badge hiện dưới footprint hood, nằm trên gấu.
- Lượt trước đặt tâm pixel thành `(V,U)` nên hình rơi vào atlas sai vùng, in một vệt trên mép túi và không hiện trên lưng. Revision hiện tại sửa tâm về `(U,V)`; browser xác nhận vệt túi không còn.

## Browser evidence cùng diagnostic SHA

`browser/latest/browser-result.json` báo `loaded`, `rotated`, `zoomed`, `desktop`, `mobile` đều true và `errors` rỗng. Đã xem trực tiếp front/back/left/right/detail/mobile cùng hai cận cổ-vai; hash của từng ảnh nằm trong `browser-evidence-manifest.json`.

QA retest cần xác nhận: (1) đường cong còn lại phía trên hood là viền vải hợp lệ, (2) back mark có clearances đủ với hood và gấu, (3) chest mark có clearance đủ với drawcord. Không sửa QA report, base-mesh registry hoặc catalog trong phần việc này.
