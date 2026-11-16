# Rà soát lãng phí ATEL-23

Các bước hoàn tất không tương ứng sản phẩm hoàn tất. V4.1–v4.3 lặp cùng lỗi nhìn thấy nhưng sửa theo tọa độ suy đoán. Regression check phát hiện khuy nằm trong XZ, projected height bằng 0. Shirt preset mask chỉ tới 1.44 m, vai tham chiếu ~1.50 m. Sửa profile tới 1.55 m; giữ cổ ở 1.57 m. Đây là chẩn đoán code, vẫn cần xem ảnh để xác nhận kết quả.

Đã can thiệp: giữ đúng WorkItem ATEL-34, giao script sửa hướng khuy xác định tại v4.4; một worker sửa, Visual/QA nhận theo handoff, Lead không tạo thêm task hỏi trạng thái. Canceled WorkItem xác minh v3.1 cũ và retry hoodie v2 đã bị thay thế. Không xóa lịch sử hoặc nâng sản phẩm lỗi thành hoàn tất. Tắt WIKI_BRIDGE_ENABLED trong compose ở lần khởi động sau; không restart các phiên đang sửa sản phẩm chỉ để đổi biến môi trường.

Quy trình sửa sau hai lượt cùng lỗi: tái hiện bằng kiểm hình học/ảnh; chọn đúng lỗi trong tool/preset; viết kiểm thử hồi quy; sửa trong một revision mới; chạy tool; QA xem đúng ảnh. Không tiếp tục vòng đoán, thêm cap, đọc lại toàn bộ lịch sử rồi xin thêm lượt. Nếu chẩn đoán không tạo cải thiện ảnh, Lead phải chọn hướng khác bằng một đầu ra kiểm được, không giữ task vô hạn với chờ owner.

Đầu ra tối thiểu: áo phủ mannequin đúng brief, nếp gấp, khuy nhìn được, model/viewer và mô tả có chất liệu/kiểu dáng/số đo mẫu 3D. Không cần quality dossier kỹ thuật may. Research/Material hoàn thành có thể nghỉ; ưu tiên worker hình học và Visual. Không chạy sáu agent thường trực để kiểm tra lẫn nhau.

Ledger snapshot: usage-audit-2026-11-15.json, phạm vi 7 ngày toàn hệ thống. `tokens.input` có cachedInput là một phần bên trong, không cộng cachedInput thêm lần nữa. `tokens.total` là input+output+cacheWrite; `tokens.budget` là quy đổi trọng số cache, không phải output mới. `costUsd` là số Crewly ghi nhận, chưa xác minh bằng hóa đơn nhà cung cấp. Số dashboard người dùng gửi có thể khác phạm vi; không báo % tiết kiệm cho tới khi có hai checkpoint cùng phạm vi/ticket.

Kiểm tiết kiệm lượt tiếp theo: so snapshot ledger cùng ticket trước/sau; ghi artifact mới, lỗi đã giảm, token uncached/cached/output và thời gian. Nếu không có artifact mới, dừng hỏi trạng thái bằng model và kiểm lỗi phiên bằng API/log. Tự động hóa số đo/ảnh/hash bằng script, không nhờ nhiều agent suy luận lại cùng report.
