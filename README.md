# AtelierX Fashion Studio

## Phom cơ sở do người dùng cung cấp

Đã nhập 29 GLB từ thư mục `phom cơ sở` vào `quality/candidates/user-supplied/` và đăng ký trong `quality/base-meshes.json`: 5 áo thun, 2 hoodie, 1 sweatshirt, 7 áo khoác, 3 quần, 2 váy, 1 áo crop top, 6 bộ đồ và 2 mẫu giày. Xem thử tại `/atelierx-products/quality-preview/user-supplied/index.html` trong Crewly. Các bản xem thử không xuất hiện như sản phẩm hoàn thành ở Sàn trưng bày.

Đây đều là `candidate`: cấu trúc GLB và checksum đã kiểm; chủ dự án cho phép dùng trong project theo `quality/USER_SUPPLIED_BASE_POLICY.md`. Agent được dùng ngay để nghiên cứu và dựng mẫu mới, ưu tiên biến đổi kiểu dáng/màu/vật liệu/họa tiết. Chưa qua kiểm phom, UV/vùng in, ảnh browser hoặc QA nên chưa `approved`. Không bắt chủ dự án gửi lại link nguồn cho từng file.

## Làm mới đăng nhập Codex cho Crewly

Chạy `powershell -ExecutionPolicy Bypass -File C:\HocTap\QLDA\crewly-docker\refresh-codex-session.ps1` trong terminal Windows, rồi hoàn thành mã đăng nhập thiết bị mà script in ra. Crewly giữ phiên Codex riêng trong Docker volume, không sao chép refresh token từ Windows. Script kiểm bằng một lượt gọi `gpt-6-luna` thật, xóa cờ quota Codex cũ nếu model chạy được, rồi khởi động lại sáu session AtelierX. Các ticket và sản phẩm trong thư mục project được giữ; tiến trình agent đang chạy sẽ bị ngắt và khởi động lại. `codex login status` riêng lẻ không chứng minh token còn hiệu lực.

Đội sáu agent dùng Codex CLI và GPT-6 Luna. Kế hoạch: [AtelierX Implementation Plan](../AtelierX-Implementation-Plan.md).

Lead giao việc theo đơn. Quy trình chất lượng và các cổng G0–G5 ở [PLAN_CHAT_LUONG_SAN_PHAM.md](PLAN_CHAT_LUONG_SAN_PHAM.md). Phom trong `quality/base-meshes.json` chỉ được dùng cho sản phẩm hoàn thành khi có `status: approved`. `tools/browser-qa.mjs` chụp viewer thật; QA chấm phiếu theo `quality/report-template.json`; `tools/quality-gate.mjs --product ATEL-N --publish` chỉ công bố khi qua cổng. Khi thiếu phom/công cụ/bằng chứng, giữ `preview`, báo rõ blocker và người xử lý.

Giao brief trong `#general` của AtelierX bằng cách **@Studio Lead**; Crewly chỉ đánh thức agent được mention trong channel team. Lead mở thread điều phối riêng cho đơn, giao ticket/WorkItem thật và yêu cầu sáu phòng đăng nhận việc, quyết định, bàn giao, QA và duyệt bằng session của chính mình qua skill `atelierx-channel-v3`; lưu `messageId` ở ticket để truy lại. Tin channel không thay ticket/WorkItem. Kiểm số tin thực bằng `node tools/chat-audit.mjs --since YYYY-MM-DD --check-api` trong container Crewly; lệnh đối chiếu metadata `authorAgentSession` với tác giả mà API web trả về.

Các phom thử đầu tiên và lý do chưa duyệt ghi trong [quality/BASE_AUDIT.md](quality/BASE_AUDIT.md). Hiện chưa có base `approved`; không đánh dấu đơn mới là hoàn thành khi chưa có phom đáp ứng brief.

| Phòng | Skill chuyên môn |
|---|---|
| Studio Lead | Chốt brief, Giao việc, Quản lý phiên bản, Duyệt mẫu, Khôi phục đơn, Đo hiệu năng |
| Market & Trend Researcher | Phân tích ý tưởng, Chọn tham khảo, Bố cục minh họa, Bàn giao mỹ thuật |
| Fashion Designer | Chọn phom, Tạo họa tiết, Đặt hình lên UV, Xuất mẫu web, Sửa bản dựng |
| Technical Designer / QA | Kiểm phom, Kiểm hình in, Kiểm viewer, Kiểm nhiều đơn, Nghiệm thu bản sửa |
| Merchandiser / Material Specialist | Danh mục vật liệu, Phối màu, Bề mặt vải, Kiểm tương thích |
| Brand & Commerce / Visual Studio | Thiết lập góc nhìn, Ảnh xem trước, Trưng bày trên web, Nhãn và mô tả |
