# AtelierX: luồng sản phẩm trên mannequin, mục tiêu 50–60 phút

Áp dụng cho đơn mới. Người dùng tự gửi đơn tiếp theo cho Lead; không tự mở đơn sản xuất để thử. Mannequin chuẩn đã đo là `quality/candidates/mannequin/mannequin-180cm-v1.glb`; đọc `quality/MANNEQUIN_REFERENCE.md` và `quality/mannequin-fit.json`. Bản gốc mannequin-model-v1.glb chỉ làm nguồn đối chiếu. Không cần animation hoặc mô phỏng vải động. Phom phải vừa mannequin và giữ đúng brief.

## Đánh giá ATEL-1

Nguồn kiểm chứng: log ticket ATEL-1, ATEL-9, ATEL-10, ATEL-15, ATEL-17, ATEL-19, ATEL-20, ATEL-21, ATEL-22 trong `.crewly/tickets/`.

| Vấn đề quan sát được | Bằng chứng | Thay đổi |
|---|---|---|
| Designer giữ geometry, artwork, material integration, export và ảnh | ATEL-17 giao 15:10Z, handoff 15:40Z, verify 15:43Z; sản phẩm cuối duyệt 16:36Z ngày 14/11 | Tách artwork, texture, assembly thành đầu ra riêng có người sở hữu |
| Claim xong vẫn chờ xác nhận scope | ATEL-17 15:11Z; QA ATEL-19 15:43Z; ATEL-9 vật liệu 10:09Z | Brief/WorkItem đủ đầu vào là quyền bắt đầu; chỉ hỏi phần thật sự mâu thuẫn |
| Lặp tìm nguồn ngoài dù có 403 và chưa có mesh phù hợp | ATEL-10 research-01 tới research-04 | Ưu tiên thư viện; tối đa 2 candidate; không giữ đường sản xuất chờ tìm nguồn |
| Lỗi cổ, hood che hình, dây đè artwork phát hiện muộn | QA ATEL-16 trả lại; ATEL-19 kiểm revision sửa | Kiểm fit/vùng in ở phút 12–18 trước khi hoàn thiện texture |
| QA lại vì schema bằng chứng | ATEL-22 retry 1, sửa featureChecks/đường dẫn trước nghiệm thu | Dùng template dữ liệu và chạy gate trước handoff |
| Status/WorkItem cũ gây hiểu nhầm | Ticket done nhưng LIVE còn lỗi; ATEL-18 treo vì khóa Codex | Một WorkItem sống/ticket; đóng request sau handoff, lỗi lịch sử không phải việc hiện tại |

Các thời gian trên là elapsed của log, không phải toàn bộ thời gian suy luận của model. Vòng cuối sau G1 khoảng 38 phút (15:58–16:36Z); không thể suy ra mọi loại áo đều đạt 60 phút.

## Điều kiện trước đơn đầu tiên

Mannequin đã chuẩn hóa, đo các lát cắt và kiểm ảnh sáu góc/browser; dùng ngay profile `quality/mannequin-fit.json`, không lặp bước đo mannequin. Profile là measured-reference; QA vẫn phải duyệt cặp áo/mannequin mới trước khi coi fit sẵn sàng. Không dùng bounds thô làm số đo cơ thể. Không ép sửa pose bằng scale toàn thân nếu làm méo tỷ lệ.

Nếu chưa có cặp phom/mannequin đạt, Lead ghi nhánh chuẩn bị với ETA riêng ngay đầu đơn. Mốc 50–60 phút đo từ lúc nhận brief và phải báo cả thời gian chuẩn bị; không dời giờ bắt đầu để làm đẹp số liệu.

## Phân công đầu ra

| Người | Đầu ra sở hữu | Khi có thời gian rảnh |
|---|---|---|
| Minh / Lead | brief, phân việc, `orders/<id>/<rev>/flow.json`, catalog, duyệt và trả lời người dùng | kiểm chênh revision, gỡ khóa phiên, kiểm ticket ready, không sửa GLB |
| An / Researcher & Artwork/Content | art direction ngắn, artwork gốc/transparent, `content.json` tiếng Việt | kiểm thumbnail/màu và nguồn; sửa artwork theo QA |
| Linh / Material | texture/PBR files, `material.json`, script áp vật liệu vào bản áo riêng | giảm dung lượng texture, kiểm tương phản và phối màu mannequin |
| Vy / Designer | garment geometry và UV, fit theo anchors, `garment.glb`, `fit.json` | sửa giao nhau ở cổ/nách/cổ tay, không chờ báo cáo research |
| Nhi / Visual Studio | ghép garment đã chốt + mannequin thành `display.glb`, viewer, camera/ánh sáng, content hiển thị | tạo browser captures, manifest SHA và kiểm HTTP/mobile |
| Khoa / QA | kiểm fit sớm, brief/artwork/material/copy, ảnh và report QA độc lập | preflight schema, kiểm hash, không tự sửa asset người tạo |

Chia theo phần việc trên đường tới sản phẩm, không ép số ticket hoặc token bằng nhau. Material chỉ ghi spec rồi nghỉ là chưa đủ; Visual không chỉ thay URL. Một người sửa mỗi file; Material xuất bản riêng, Visual tích hợp, không cùng ghi garment của Designer.

## Các mốc và phối hợp

- 0–5: Lead tạo ticket cha và tối đa 5 ticket con, giao thật, ghi deadline/owner/output/dependency. Mỗi agent claim rồi NHẬN VIỆC trong thread và bắt đầu ngay. Không đợi tin nhắn “đồng ý scope”.
- 5–15: Researcher gửi hướng chính + artwork nháp; Material gửi palette/PBR nháp; Designer thử fit hai phom; Visual dựng viewer/template và mannequin; QA kiểm fit/vùng in sớm.
- 15–30: Designer chốt garment; Researcher hoàn thiện artwork/content; Material xuất texture/bản áp material riêng. Visual ghép bản thử, gửi QA URL ngay. Chỉ phần phụ thuộc mới chờ.
- 30–40: chốt revision/hash của display GLB và content; QA kiểm ảnh thật đủ góc, full-body và cận áo/họa tiết. Không chụp lại mọi bộ ảnh nếu hash/revision và cấu hình ảnh không đổi.
- 40–50: QA trả một danh sách lỗi ưu tiên có owner, ảnh và cách kiểm lại; một lượt sửa tập trung. Visual tích hợp revision mới; QA kiểm phần sửa và ảnh cuối cần thiết.
- 50–60: Lead kiểm QA/gate, đổi catalog complete và gửi link nội bộ kèm bài giới thiệu. Nếu chưa đạt, báo phần còn thiếu/owner/ETA, giữ preview; không tự hạ chuẩn.

Sau 2 phút không heartbeat **và** không log/artifact mới, Lead kiểm phiên; khóa conversation/auth là sự cố phiên, không phải lỗi sản phẩm. Thu hồi claim trước reassign. Người còn hoạt động nhận đúng phần độc lập; không tạo WorkItem trùng, không restart cả team khi đang xuất asset. Hết 15 phút chưa có phom khả thi thì chọn fallback hoặc báo cần chuẩn bị thêm. Sau hai lượt sửa cùng phom không tiến triển thì đổi hướng.

### Nhánh phục hồi khi không có phom đạt

Nếu QA trả G1 hai lần hoặc hai cách sửa liên tiếp không cải thiện, Lead dừng đúng nhánh hình học đó. Ghi bảng quyết định: revision, SHA, lỗi hình học đo được, ảnh, lý do loại; không tạo retry từ cùng nguồn với đổi tên. Trong 5 phút, Lead mở hai việc độc lập: Researcher rà tối đa hai phom cùng loại có nguồn/điều kiện dùng và hình dáng phù hợp; Designer đề xuất một phom mới dựa trên lát cắt mannequin, cổ/vai/nách/tay được dựng có kiểm soát. Researcher không giữ Designer chờ, Designer không tự duyệt G1. QA chuẩn bị checklist cổ/vai/nách và kiểm prototype trước texture; Visual duy trì viewer/content scaffold, Material giữ texture hiện có nhưng chỉ ánh xạ sau khi UV ổn định.

Khi mọi agent `active` nhưng tất cả WorkItem đã xong hoặc blocked, còn ticket cha `in_progress`, Lead phải ghi một quyết định trong ticket cha trong 5 phút: mở đúng WorkItem kế tiếp, đặt `blocked` với blocker ngoài team và ETA, hoặc báo owner rằng chưa có phom khả thi. Không để `in_progress`/`idle` vô hạn. Ticket và WorkItem phải đồng bộ: việc đang chờ dependency ghi `blocked`; khi dependency đạt thì release WorkItem cũ hoặc tạo một việc mới có phạm vi khác, không làm cả hai. Chỉ Lead quyết định mở QA/Visual sau khi nhận revision, hash và bằng chứng; chỉ QA kết luận G1. Mục tiêu 50–60 phút là mục tiêu cho đường có phom sẵn, không dùng để thúc QA bỏ lỗi fit.

Nếu Codex báo `usage_limit`, dùng một probe CLI ngắn để xác minh; trạng thái `selectable` của API không thay thế probe. Ghi thời điểm reset và các WorkItem bị ảnh hưởng vào ticket cha/con. Giữ artifact và revision, không mở retry hoặc khởi động lại toàn team. Nếu có runtime khác đã đăng nhập và được phép dùng, Lead có thể chuyển đúng agent bị ảnh hưởng; nếu không, giữ ticket ở trạng thái chờ hạn mức, nhắc lại sau reset và probe lại trước khi dispatch. Không coi `active` là agent có thể tiếp tục suy luận khi quota đã hết.

NHẬN VIỆC một lần; CẦN PHỐI HỢP chỉ khi cần quyết định; BÀN GIAO kèm ticket/revision/SHA/file/next owner/messageId. Không lặp DM và channel để xin phép bắt đầu. Update ticket qua API/skill; không dùng tin chat thay dispatch. Khi đã nộp reply cuối, request TKT phải sang review; không để in_progress sau khi sản phẩm đã complete. Chỉ owner nghiệm thu request.

## Nội dung và nghiệm thu

`content.json`: `title`, `summary`, `paragraphs` (2–4 đoạn mô tả phom, màu, chất liệu biểu kiến, họa tiết/vị trí và ý tưởng), `details` (3–6 điểm), `credits` (nguồn mannequin và thay đổi). Không bịa chất liệu vật lý, tính năng, giá, chứng nhận. Bản viết phải khớp display GLB cuối. Viewer có đoạn giới thiệu ngay cạnh/dưới model, dễ đọc mobile; không chỉ có mô tả trong chat.

Đơn mới dùng `deliveryProfile: mannequin-v1` trong catalog và QA. Gate cần mannequin file/hash, fit checks, display model có mannequin, content cùng revision và xác nhận QA nhìn thấy content. Các kiểm tra boolean là xác nhận QA có ảnh, không thay việc xem ảnh. Bản ATEL-1/v3 đã nghiệm thu là ngoại lệ lịch sử, không tự đổi sản phẩm cũ.

Đo đơn tiếp theo: thời điểm nhận brief, claim, first artifact, fit review, final assembly, QA verdict, publish; mỗi agent ghi phút làm/chờ và nguyên nhân trong flow.json. Báo tổng elapsed, chờ phiên, chờ dependency, số lần sửa; chỉ kết luận cải thiện sau đơn thật.
