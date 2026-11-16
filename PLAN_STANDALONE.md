# Chuẩn trang phục mặc trên cơ thể vô hình

**Yêu cầu ưu tiên cao nhất:** trưng bày trang phục 3D độc lập như đang được mặc trên cơ thể vô hình. Áo có phom mặc, độ phồng, nếp gấp tự nhiên, cổ và khuy phù hợp loại áo; người xem xoay và zoom ngay trong Crewly để xem thiết kế, màu sắc và họa tiết. Đây là điều kiện bắt buộc để bàn giao, đứng trước mục tiêu thời gian và số task hoàn tất.

Chuẩn hình ảnh chủ dự án chấp nhận: ATEL-35/v1 — Áo thun kem · Hoa nhỏ. Dùng mẫu này để so chất lượng bề mặt vải, không dùng hình dáng áo thun thay cho loại sản phẩm khác.

## Điều cần giữ từ ATEL-35

- Giữ geometry, normals và nếp rủ của nguồn garment tốt; chỉ chuẩn hóa tỉ lệ/tư thế và đổi màu/PBR/hoạ tiết.
- Quần áo là lớp vỏ vải có không gian mặc bên trong, không phải cơ thể hoặc khối đặc. Cổ, cửa tay, gấu, cạp và ống quần phải là cửa mở tự nhiên khi loại trang phục có chúng. Mép có thể có độ dày/đường may, không bị một đĩa hoặc mặt phẳng bịt ngang.
- Volume theo dáng mặc: vai/nách/ngực ở áo, hông/đáy/đầu gối/ống ở quần; có nếp vải theo cấu trúc, không dùng gợn sin đồng đều để giả độ rủ.
- Cổ, khuy, nẹp, túi nằm hợp lý trên lớp vỏ vải; không ghép hộp/tube/ellipse nổi rời. Nếp và shading phải còn đọc được dưới vật liệu xám trung tính.
- Giữ nguyên scene tương phản đang dùng. Ánh sáng, thêm sọc hoặc roughness không sửa được lỗi geometry.

## Chọn nguồn và giới hạn thời gian

Thứ tự: phom garment đã thành công đúng loại → GLB garment nội bộ có ảnh đạt → tìm nguồn garment khác được phép dùng → dựng/sửa bằng công cụ tạo trang phục nếu có thể chứng minh chất lượng tương đương. Không chuyển từ thiếu phom sang SDF/khối tham số tự viết chỉ để kịp 60 phút.

15 phút là mốc báo readiness/ETA; hai nguồn là giới hạn một đợt tìm. Nếu cả hai không phù hợp, Lead ghi chuẩn bị thêm và phân công tìm tiếp phom tốt. Không cấm nguồn thứ ba rồi ép Designer tự dựng khối. Tốc độ phải đến từ tái sử dụng nguồn và công cụ, không hạ tiêu chuẩn hình dáng.

## Nghiệm thu hình ảnh

Trước trang trí, Designer và QA xem sáu góc xám: front, back, side, oblique, top, bottom. Giữ preview xoay/zoom được. So cạnh hình benchmark ATEL-35/v1 và ghi nhận cụ thể điểm tương đương/kém hơn. Top/bottom phải thấy cửa mở và lớp vỏ, không bịt bằng mặt caps hoặc facing ngang. Không yêu cầu mọi mesh là kín/watertight hoặc cùng một component; đường ráp nhìn tự nhiên và đúng cấu trúc là điều cần kiểm.

QA cuối xem cùng sáu góc với màu thật. Report cần `garmentAppearance`:

```json
{
  "profile": "invisible-body-v1",
  "reviewer": "atelierx-qa-0004",
  "benchmark": "ATEL-35/v1",
  "checks": {
    "hollowOpenings": {"passed": true, "observation": "Mô tả những cửa mở thật đã thấy", "evidence": ["đường dẫn top/bottom"]},
    "naturalDrape": {"passed": true, "observation": "Mô tả nếp và dáng mặc cụ thể", "evidence": ["đường dẫn front/side/oblique"]},
    "fabricEdges": {"passed": true, "observation": "Mép vải tự nhiên, không cap hoặc bề mặt đặc", "evidence": ["đường dẫn chi tiết"]},
    "garmentConstruction": {"passed": true, "observation": "Cổ/tay/nẹp/khuy hoặc cạp/đáy/ống/túi phù hợp", "evidence": ["đường dẫn"]},
    "benchmarkComparison": {"passed": true, "observation": "So sánh thật với chất lượng vải/nếp của áo thun kem", "evidence": ["đường dẫn ảnh sản phẩm"]}
  }
}
```

Không chép sẵn các giá trị pass. JSON trên mô tả cấu trúc; chỉ ghi đạt sau khi quan sát ảnh thật. Script chỉ kiểm hồ sơ và hash; quyết định chất lượng vẫn thuộc QA và Lead. Nếu không đạt dáng mặc/vỏ vải thì giữ preview, không công bố complete vì đủ khuy, màu hoặc file hợp lệ.

Hai sản phẩm ATEL-41/v4 và ATEL-47/v4 đã bị owner phản hồi chưa đạt chuẩn hình dáng. Phiếu QA cũ là lịch sử, không được dùng làm chứng nhận phom ready hoặc benchmark mới. Chỉ đưa revision sửa trở lại complete khi đủ kiểm sáu góc và owner có thể xem lại.

---

> Chu?n ch?t l??ng hi?n h?nh: ??c `quality/INVISIBLE_BODY_STANDARD.md`. ATEL-35/v1 l? benchmark. Trang ph?c ph?i l? v? v?i m?c tr?n c? th? v? h?nh, kh?ng kh?i ??c. Quy t?c 15 ph?t/hai ngu?n d??i ??y l? gi?i h?n m?t ??t t?m; Lead ???c m? ??t chu?n b? m?i v?i ETA ?? t?m phom garment t?t, kh?ng ?p d?ng kh?i t? ch?. Nghi?m thu s?u g?c b?ng `browser-qa --basic --garment`, g?m top/bottom.

# AtelierX ? Quy tr?nh ?o 3D ??c l?p v9

?p d?ng cho ??n m?i. S?n ph?m l? ?o 3D c? ?? ph?ng, n?p v? c?/khuy ph? h?p brief, xoay/zoom tr?n desktop trong Crewly. N?i dung ti?ng Vi?t 2?4 c?u v? ki?u d?ng, m?u/h?a ti?t, ch?t li?u m? ph?ng v? 3?4 th?ng s? hi?n th? c? ngu?n; kh?ng bi?n s? ?o bao mesh th?nh size may. Kh?ng mannequin, kh?ng nghi?m thu mobile. ATEL-23 ?? d?ng; kh?ng ph?c h?i ho?c t?o l?i.

## Nh?n ??n v? t?n vi?c

Lead m? m?t ticket cha s? h?u b?i Lead v? m?t thread. T?n s?n ph?m ng?n, v? d? ??o thun kem hoa ng?c?. T?n vi?c c? d?ng `ATEL-41 ? Thi?t k? phom ?o ? ?o thun kem hoa ng?c`; title kh?ng ch?a GOAL, EXPECTED OUTCOME, UUID, Retry hay nhi?u m? ATEL l?p. M? t? m?i ch?a m?c ti?u, artifact c?n giao v? ?i?u ki?n ??t.

Ch?y t? th? m?c AtelierX:

```bash
node tools/studio-flow.mjs init ATEL-41 --name "?o thun kem hoa ng?c" --request <UUID-request-th?t>
node tools/studio-flow.mjs status ATEL-41
```

D?ng ??ng `tasks[role].title` khi t?o ticket/WorkItem, ??t metadata `{studioOrderId: "ATEL-41", requiresVerification: false}`. Gi? m?t QA WorkItem cho to?n ??n, m?t owner m?i artifact. Sau khi giao b?ng c?ng c? Crewly, ??ng k? li?n k?t th?t:

```bash
node tools/studio-flow.mjs bind ATEL-41 --role qa --ticket ATEL-46 --workitem <UUID>
```

C?c role: lead, research, designer, material, visual, qa. Kh?ng chuy?n ticket cha sang Designer/Visual. Kh?ng t?o vi?c Verify, Retry, self-ping cho t?ng b?n giao. Sau handoff chuy?n m?n, ch? QA cu?i b?ng `studio-wait: qa-final`, gi? c?ng WorkItem ?? nh?n correction. Khi QA cu?i pass, c?ng c? ??nh th?c t?ng ng??i x?c nh?n artifact ?? t?ch h?p r?i complete b?ng session th?t. Lead publish v? b?n giao xong c?ng ho?n t?t WorkItem Lead; kh?ng ?? ticket cha gi? running.

## Ch?n phom: t?i ?a 15 ph?t, hai ngu?n

Research ch?y `node tools/studio-base.mjs tshirt` (ho?c hoodie, shirt...). M?i phom ready c? GLB/hash, ?nh ?? ki?m, phi?u duy?t v? gi?i h?n s? d?ng. ?u ti?n phom ?? d?ng th?nh c?ng, kh?ng ch?n b?ng t?n file, metadata ho?c s? tam gi?c. M? ?nh tr??c/sau ?? x?c nh?n lo?i c?, tay, ?? ph?ng v? n?p tr??c khi x? l?.

Designer d?ng nguy?n geometry ready khi ??ng brief; ghi r? t?i s? d?ng phi?u QA n?o, kh?ng l?m l?i m?t b? th? phom cho ??i m?u/h?a ti?t. N?u thay geometry ho?c chi ti?t c?u tr?c, c?n QA phom m?i. Ngu?n b? lo?i trong `quality/studio-bases.json` kh?ng ???c ?? xu?t l?i cho c?ng lo?i brief. Research l? owner c?a danh s?ch n?y; th?m ngu?n ph?i c? ?nh th?t v? l? do, kh?ng t? ghi ready khi ch?a c? QA.

N?u ch?a c? phom, Research ?? xu?t t?i ?a hai ngu?n c? ?nh tr??c/sau. Designer th? t?i ?a hai ngu?n trong 15 ph?t, m?t correction tr?n ngu?n ?? ch?n. H?t gi?i h?n, Lead ghi ph??ng ?n c? th? v? ETA m?i:

```bash
node tools/studio-flow.mjs replan ATEL-41 --reason "Thi?u phom ph? h?p; ch?n ph??ng ?n ...; ETA ..."
```

H?t hai ngu?n th? k?t th?c ??t t?m, Lead ghi replan v? ETA cho ??t chu?n b? ti?p theo; kh?ng ?p d?ng kh?i thay th?. Giai ?o?n chu?n b? th?m ???c b?o ri?ng, kh?ng gi? cam k?t 60 ph?t khi ??u v?o ch?a c?.

## Ch? s? h?u v? chuy?n b??c tr?c ti?p

- Research: ?nh shortlist, artwork, content nh?p t? brief; ch? ?o r?i ?i?n th?ng s?, kh?ng ch?n phom v? ch?a c? s? ?o.
- Designer: geometry, m?t tr??c/sau, v?ng UV in, material groups, gi?i h?n UV. B?n giao phom ?? ki?m; kh?ng x? l? viewer.
- Material: preset s?m r?i surface GLB c? m?u/artwork sau khi phom ??t. Gi? geometry/UV; ki?m in ng?c kh?ng xu?t hi?n ? l?ng. V?i profile t??ng th?ch, d?ng `node tools/studio-surface.mjs <surface-job.json>`; kh?ng ??y c?ng vi?c ??t h?a ti?t sang Visual.
- Visual: template scene/viewer v? content; nh?n surface GLB ho?n ch?nh. M?t draft n?u c?n, m?t final, m?t correction sau QA. D?ng `showcase-basic.mjs` v?i presentation=standalone; browser-qa --basic ch?p b?n g?c tr?n URL Crewly. Kh?ng m? server t?m r?i t?t tr??c QA.
- QA: m?t WorkItem xuy?n su?t; ki?m phom m?i, r?i QA cu?i. Sau review s?m kh?ng complete; ch? final b?ng blockedReason `studio-wait: visual`. QA cu?i pass m?i ho?n t?t WorkItem.
- Lead: ch?t l?a ch?n/ngo?i l?, ph? duy?t cu?i v? b?n giao. Kh?ng l?m tr?m chuy?n l?i cho t?ng artifact.

M?i b?n giao t?o manifest JSON nh?: `orderId`, `revision`, `artifacts: [{path, sha256}]`; shape th?m `baseId` v? `garment: {path, sha256}`, review th?m `decision: pass|return`, QA cu?i th?m phi?u QA. V?i phom ready nguy?n hash, Designer t?o manifest shape-review d?n phi?u QA c? c? th?t v? ghi `reusedFrom`; kh?ng ??i ng??i k?/ng?y review th?nh m?i.

```bash
node tools/studio-flow.mjs handoff ATEL-41 --stage shape --manifest orders/ATEL-41/v1/shape.json
node tools/studio-flow.mjs handoff ATEL-41 --stage shape-review --manifest orders/ATEL-41/v1/shape-review-handoff.json
```

C?c stage: shape, shape-review, surface, visual, qa-final, content. Watchdog x?c nh?n manifest/hash r?i b?o tr?c ti?p ng??i nh?n trong chu k? 15 gi?y, kh?ng t?o WorkItem m?i. QA pass phom ? Material; surface ? Visual; viewer ? QA; QA cu?i ? Lead. Return phom ? Designer. Return cu?i n?u ??ng owner trong `correctionOwner: designer|material|visual`, kh?ng m?c ??nh b?t Visual s?a geometry.

D?ng `studio-wait: <stage>` ch? cho ph? thu?c artifact. Quota/auth c? l? do ri?ng, kh?ng ???c c?ng c? handoff t? b? ch?n. M?i agent ??ng NH?N VI?C sau claim v? B?N GIAO t?i ?a 5 d?ng trong c?ng thread b?ng session th?t; th?ng b?o m?y kh?ng gi? l?m l?i agent.

## QA v? b?n giao

Gi? QA cu?i: ??ng lo?i ?o, h?nh d?ng c? volume/n?p, khuy khi c?n, m?u/ho? ti?t/v? tr?, content v? xoay/zoom desktop. T?i ?a ba l?i c? ?nh/v?ng v? owner; m?t retest t?p trung. Script l?m hash, ?o v? ch?p; QA ??nh gi? ?nh. Kh?ng ki?m fit mannequin, kh?ng ??m giao c?t ho?c vi?t l?i hash b?ng tay.

Sau QA pass, Lead xem ?nh ??ng revision, ghi leadApproved v? ch?y `node tools/quality-gate.mjs --product ATEL-41 --publish`. C?ng c? b?n giao ki?m gate th?t, catalog/model/viewer/content ??ng revision, ??ng request UUID v? li?n k?t WorkItem ?? bind. Vi?c s?n xu?t c?n running kh?ng ???c t? ghi done; Lead nh?n m?t th?ng b?o ?? ??ng b?ng ch?ng/??nh d?u vi?c thay th?. Ch? Verify t? sinh ho?c vi?c c? metadata studioSuperseded m?i ???c t? h?y khi ?ang queued/blocked/scheduled; kh?ng c?t ngang vi?c ch?y.

Khi m?i vi?c thu?c ??n ?? k?t th?c, c?ng c? ??ng ticket s?n xu?t theo tr?ng th?i th?t (done ho?c cancelled), l?u to?n b? li?n k?t trong receipt r?i chuy?n TKT sang `waiting_confirmation` / c?t **To review**. Kh?ng h?i owner ?cho ph?p b?n giao? th?m l?n n?a, kh?ng t? Verified, kh?ng t? nghi?m thu theo th?i gian. Owner Send back th? kh?ng n?p l?i c?ng revision ?? b? tr?.

## Th?i gian v? ph?c h?i

M?c ti?u c?n ki?m ch?ng: 25?40 ph?t cho bi?n th? m?u/h?a ti?t tr?n phom ?? bi?t; 40?60 ph?t khi c? phom ph? h?p nh?ng c?n ch?nh nh?. Ch?n phom 0?15 ph?t; surface v? artwork/content l?m song song kho?ng 10?30; t?ch h?p 30?40; QA v? b?n giao 40?55, d? ph?ng ??n 60. ?o t? gi? nh?n brief t?i QA pass v? t?i To review ri?ng, kh?ng l?y tr?ng th?i running l?m b?ng ch?ng n?ng su?t.

Kh?ng c? artifact m?i sau 10 ph?t: Lead ki?m ??ng lane b? k?t, kh?ng g?i l?i c? team. Gi? c? ch? ??i t?i kho?n Codex v? ti?p t?c c?ng WorkItem t? checkpoint; kh?ng g?n interruption l? ho?n th?nh. `quality/studio-control.json` l? ngu?n d?ng ??n. Kh?ng t? t?o s?n ph?m m?i ?? th? flow; ch? brief owner.
