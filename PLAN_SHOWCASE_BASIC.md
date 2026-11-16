> Superseded for new orders by PLAN_STANDALONE.md. Historical mannequin instructions below do not apply to standalone orders.

# AtelierX — sản phẩm trưng bày cơ bản

Hồ sơ mặc định: `showcase-basic-v1`. Quyết định mới nhất của chủ dự án thay chuẩn hoàn thành ở PLAN_FLOW_60_MANNEQUIN.md và PLAN_CHAT_LUONG_SAN_PHAM.md cho đơn trưng bày. Mẫu mặc mannequin, đúng loại/màu/họa tiết, dễ nhìn và có mô tả ngắn kèm thông số. Giữ nếp gấp có chủ ý và khuy/chi tiết đóng mở phù hợp loại áo; áo sơ mi cần khuy nhìn thấy. Không yêu cầu cấu trúc may hoặc giao cắt bên trong hoàn hảo.

## Bốn chặng
1. Lead ghi brief: loại áo, màu, họa tiết/vị trí, kiểu dáng, preset chất liệu và ngoại lệ hở/xuyên thấu/không tay. Một ticket cha; chỉ tạo WorkItem cho phần việc thực sự cần làm. Brief đủ là quyền bắt đầu.
2. Designer tạo áo; Researcher viết content/artwork song song; Visual chọn scene/preset. Material chỉ nhận việc riêng khi vật liệu đặc biệt. Dùng phom nội bộ trước. Không tìm lại giấy phép các GLB chủ dự án đã cho phép. Lead không duyệt trung gian.
3. Ghép nháp đúng một lần; xem bốn ảnh trước/sau/hông/chéo. Designer sửa tập trung tối đa ba lỗi nhìn thấy lớn nhất, giữ nếp gấp và khuy. Không ghép lại cho từng sửa nhỏ. Khi đánh dấu `final`, Visual chạy ghép lần hai. Nếu QA trả lại bản chốt, Lead giao một lượt sửa tập trung. Nếu lượt đó còn đúng lỗi nhìn thấy có thể sửa hẹp, Lead được mở một lượt xử lý tiếp trên cùng WorkItem, giới hạn thời gian 15 phút, tối đa hai vùng lỗi, không cần đợi owner. Chỉ hỏi owner khi phải đổi brief, cần asset họ chưa cấp, hoặc đã thử hướng khác mà vẫn không tạo được bản xem được. QA vẫn giữ quyền chặn bản lỗi.
4. QA xem bản chốt + content cùng revision; một danh sách lỗi, kiểm lại đúng phần sửa. Lead kiểm gate và bàn giao link ngay trong Crewly; không deploy. Không chờ base mesh approved/G1 riêng để lắp và duyệt trưng bày cơ bản. Việc dựng thư viện phom kỹ thuật là công việc nền riêng.

## Công cụ tái dùng
- `node tools/create-product-viewer.mjs ATEL-N vN` tạo viewer/content scaffold một lần. Không ghi đè revision đã có.
- Sao chép `quality/templates/showcase-job.json`, điền garment, loại áo, chất liệu và exposure; lưu `orders/ATEL-N/showcase-job.json`.
- `node tools/showcase-basic.mjs orders/ATEL-N/showcase-job.json draft` rồi `final`. Mỗi stage chạy một lần cho cả đơn; nếu xuất lỗi trước khi ghi ledger có thể sửa và chạy lại. Dùng revision riêng cho draft/final để giữ QA không lẫn. Tool giữ nguyên màu/material, texture và mannequin gốc; tự ghi SHA, assembly.json và measurements.json.
- Khi QA trả lỗi rõ sau `correction`, dùng revision mới và `repair` một lần. Không ghi đè revision đã được QA kiểm.
- `node tools/browser-qa.mjs --basic --url http://127.0.0.1:8787/atelierx-products/products/ATEL-N/vN/index.html --out quality/evidence/ATEL-N/vN` tự chụp 4 góc cố định, thử xoay/zoom/mobile. QA chỉ cần xem 4 ảnh + content; mở thêm chi tiết khi thấy lỗi.
- `node tools/quality-gate.mjs --product ATEL-N --publish` sau QA và Lead duyệt. Dùng mẫu `quality/templates/showcase-qa.json`; catalog phải ghi deliveryProfile showcase-basic-v1. Không sửa report cũ thành đạt.

## Phủ mannequin và số đo
Script đo chest section và envelope thực từ GLB world-space. Vai mannequin là mốc tham chiếu; dài tay là độ vươn ngang từ mốc vai, không phải số đo rập. Các khoảng trong showcase-presets.json là kiểm kích thước sơ bộ rộng, cần hiệu chỉnh dần qua mẫu đã xem. Lệch nhẹ trả `review`, QA xem ảnh; chỉ sai đơn vị/vị trí/kích thước cực đoan trả `fail`. Không để agent tự đếm tam giác giao nhau mỗi lượt.

Mask tự động chỉ xóa tam giác mannequin khi cả ba đỉnh nằm giữa hai bề mặt áo theo trục trước/sau và trong vùng an toàn của preset. Giữ vùng cổ/cổ tay/gấu, đầu/bàn tay/chân. Đây là heuristic bảo thủ, QA vẫn nhìn ảnh để phát hiện khe hở. Không mask áo open/sheer/sleeveless; giữ mannequin đầy đủ và dùng cách hiển thị riêng. Nếu mask không đủ, chỉnh phom hoặc preset; không xóa cơ thể tùy tiện. File GLB phải là static/dense/embedded/uncompressed; tool từ chối định dạng chưa hỗ trợ thay vì làm hỏng model.

## Điều kiện hoàn thành
- Đúng brief và mannequin; nhìn rõ thân, cổ, vai, tay, nếp gấp và khuy nếu loại áo có khuy. Không bắt khuy cho hoodie chui đầu.
- Không xuyên/hở/chi tiết rời gây chú ý ở 4 góc và khi xoay thông thường. Số giao cắt khuất không tự chặn.
- Viewer mở, xoay, zoom/mobile được; nền trung tính sáng, camera cố định và model đủ lớn để thấy chi tiết.
- Content ngắn: tên, summary 2–4 câu mô tả cụ thể, material.name/source, style, ít nhất 4 specifications có label/value/unit/source. Chất liệu lấy từ brief/preset, không bịa thành phần hay tính năng. Có số đo thực lấy từ measurements.json, ghi rõ tham khảo mẫu 3D. Không suy ra size sản xuất. Giữ credits.
- QA độc lập xác nhận coverage/silhouette/folds/closures/contentMatches bằng ảnh. `closures=true` được ghi nhận không áp dụng khi brief không có đóng mở; nêu rõ trong report.

## Token và phối hợp
Chỉ nạp flow này + skill vai trò + brief hiện tại. Tra lịch sử/báo cáo dài khi thực sự cần. Một artifact có owner; Material không sửa garment gốc. Dùng script tạo metadata/hash/ảnh, không chép SHA dài trong chat. NHẬN VIỆC một lần, BÀN GIAO một lần; chỉ nhắn thêm khi cần quyết định. Nội dung đầy đủ ở artifact, chat tối đa 5 dòng.

Không tạo task mới để xác nhận một task đang chờ handoff. Lead ghi checkpoint ngay trong task hiện tại. Phiên idle không đồng nghĩa sản phẩm xong; kiểm artifact mới trước khi can thiệp. Worker làm xong phần mình có thể nghỉ. Không dùng token/số ticket bằng nhau làm tiêu chí phân công.

Sau hai handoff còn đúng một lỗi cũ, dừng sinh revision do suy đoán. Kiểm tọa độ, hướng mặt, preset và script tạo geometry bằng phép kiểm tái hiện; chỉ mở một verified-fix khi có chẩn đoán cụ thể. Task kiểm handoff lịch sử đã hết giá trị phải cancel, không giữ blocked mãi. Công việc wiki/refresh không được tranh lượt sản phẩm; tắt wiki bridge trong đợt làm sản phẩm. Chỉ một worker sửa asset; Lead không gọi lại worker để hỏi trạng thái khi chưa tới checkpoint. Một lượt chẩn đoán 15 phút có artifact hoặc kết luận rõ; thiếu artifact thì báo lỗi thực thi, không cấp thêm vòng suy luận.

## Tự phục hồi khi cả chuỗi dừng
`crewly-docker/atelierx-watchdog.cjs` đọc trạng thái mỗi 60 giây, không gọi model để polling. Khi tất cả việc của một đơn đang blocked, nó chọn một WorkItem hiện có theo QA: lỗi phom lặp chuyển Designer đánh giá phom khác; có handoff mới thì đánh thức Lead để giao kiểm tiếp, QA đạt thì chuyển tích hợp. Queued quá 10 phút được nhắc lại một lần có giới hạn. Không tự mở công việc đã hoàn tất, không giành WorkItem đang running, không tự approve/publish. Nếu phiên offline thì start đúng member thay vì restart cả team.

Mỗi quyết định giống nhau tối đa hai lần, cách nhau ít nhất 15 phút; tổng tối đa bốn lần tự phục hồi mỗi đơn/ngày để tránh đốt token. Lưu `~/.crewly/atelierx-watchdog.json` và log riêng. Hết ngân sách thì ghi rõ stopped-no-progress/stopped-recovery-budget; không giả báo công việc đã chạy hay sản phẩm xong. Sự cố quota được giữ riêng runtime-needs-recheck, không lẫn với lỗi hình học. Hệ thống không bảo đảm tự tạo được mọi loại phom, nhưng không được giữ vòng gọi model vô hạn khi không có artifact tiến triển.

Khi quota lỗi: probe một lần; ghi blocker và giữ artifact. Đăng nhập tài khoản mới + probe OK hủy lịch chờ reset cũ, mở lại đúng việc. Không restart cả team khi còn xuất asset.

Mục tiêu 50–60 phút với phom sẵn; dựng phom mới phải báo thời gian chuẩn bị. Sau lượt sửa hẹp vẫn không đạt thì đổi nền hoặc báo phần chưa đạt; Lead ghi quyết định cụ thể, không treo WorkItem với lý do chung `chờ owner` và không sinh retry vô hạn.
