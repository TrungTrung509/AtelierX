---
title: "operating-model"
migrated_from: ".crewly/knowledge/operating-model.md"
---

# Quy trình vận hành AtelierX

Mục tiêu của một đơn là mẫu áo số mở được và xoay được trên web. Giữ nguyên yêu cầu của khách về loại áo, màu, họa tiết và vị trí. Studio Lead tự quyết phần khách để mở. Tất cả trao đổi và bàn giao bằng tiếng Việt trong thread của đơn trên `#general` AtelierX.

## Một đơn, nhiều việc chạy song song

Mỗi đơn có một ticket cha. Lead tạo các ticket con riêng, gắn mã đơn cha và giao ngay cho đúng agent. Ticket tạo ở `backlog` chưa khởi chạy. Lead chuyển sang `ready`, rồi dùng `skill-assign-ticket` hoặc `project-tickets assign` để có assignee và WorkItem thật. Sau khi giao, kiểm tra API hoặc bảng Tasks đã ghi `in_progress` và tên người nhận. Bài đăng chat chỉ thông báo, không thay thế thao tác giao ticket.

| Đầu việc | Phụ trách | Có thể bắt đầu khi | Bàn giao tối thiểu |
|---|---|---|---|
| Hướng minh họa | Researcher | Có brief | Chủ thể, bố cục, bảng màu, điều bắt buộc, tài liệu tham khảo nếu dùng |
| Chất liệu số và bảng màu | Material Specialist | Có brief và loại áo | Màu, material slot, độ nhám, vùng in, asset có thật hoặc fallback |
| Phom và họa tiết | Designer | Có brief và phom dùng được | Bản nguồn, texture, GLB, revision, ảnh trước/sau |
| Khung viewer | Visual Studio | Có mã đơn; có thể dùng mẫu thử sẵn | Viewer mở được mẫu thử, trạng thái tải/lỗi, chỗ thay URL GLB cuối |
| Kiểm tra kỹ thuật | QA | Có GLB nháp; trước đó chuẩn bị checklist | Ảnh và kết quả về mặt in, chiều, phom, tải model, revision |
| Duyệt và bàn giao | Studio Lead | Có GLB, viewer và QA đạt cùng revision | URL xem, tên mẫu, revision, điểm đã kiểm tra |

Researcher, Material Specialist, Designer và Visual Studio bắt đầu cùng lúc. Designer được dựng phom trước khi có art direction, Visual Studio được dựng khung viewer bằng model thử trước khi có GLB cuối, QA được chuẩn bị checklist trước khi có GLB. Khi một phòng bàn giao dữ liệu mới, người nhận chỉ cập nhật phần phụ thuộc. Không bắt cả đội chờ một báo cáo chung.

Mỗi agent chỉ giữ một WorkItem đang thực hiện cho một đơn; revision mới thay cho revision cũ của cùng đầu ra, không chạy hai bản sửa trên cùng file đồng thời. Lead có thể mở đơn khác khi chủ file và năng lực thực thi không xung đột. Nếu cần đổi ưu tiên, Lead ghi ticket nào tạm dừng, ticket nào được tiếp tục và revision nào là nguồn chuẩn.

## Quyền sở hữu và phiên bản

Designer sở hữu file nguồn, texture và GLB trong thư mục mẫu. Material Specialist sở hữu material spec riêng; Visual Studio sở hữu trang viewer; QA sở hữu phiếu kiểm tra. Lead sở hữu brief và trạng thái đơn. Mỗi người chỉ sửa khu vực của mình. Dùng mã `ATEL-n/vN` trong mọi bàn giao. Nếu cùng file cần hai người sửa, Lead chỉ định một người sửa và người còn lại gửi nhận xét hoặc patch để áp dụng. Chỉ công bố hoàn thành khi URL web tải đúng GLB của revision đã được QA kiểm.

## Nhịp và xử lý vướng mắc

- Trong 2 phút từ lúc nhận brief, Lead tạo việc cho các phòng độc lập. Sau mỗi lần giao, xác nhận ticket có người nhận và WorkItem đã chạy.
- Mốc mục tiêu cho đơn dùng phom có sẵn: phút 0–2 chốt brief/giao việc; phút 2–7 hoàn tất hướng minh họa, vật liệu số và viewer khung; phút 7–15 hoàn thiện GLB và tích hợp; phút 15–20 QA, sửa lỗi nhỏ và bàn giao. Đây là mốc theo dõi, không phải thời hạn để bỏ kiểm tra. Nếu một mốc trễ, Lead ghi nguyên nhân, phạm vi ảnh hưởng, người xử lý và mốc dự kiến mới trong ticket cha.
- Mỗi phòng đăng một cập nhật khi có đầu ra, khi đổi revision hoặc khi bị chặn. Không gửi tin lặp chỉ để báo vẫn đang làm.
- Khi bị chặn, ghi nguyên nhân cụ thể, file hoặc API lỗi, việc nào bị ảnh hưởng và bước thử tiếp theo. Trong cùng lượt làm việc, thử một hướng khác phù hợp với yêu cầu số 3D. Ví dụ, thiếu thông số may thật không chặn mockup; CDN viewer lỗi thì thử tài sản viewer cục bộ hoặc môi trường duyệt đã có; thiếu GLB cuối thì Visual Studio hoàn thiện khung bằng model thử.
- Nếu vẫn bị chặn, trả ticket về `ready` hoặc ghi trạng thái chờ phù hợp với lý do, báo Lead, rồi nhận phần việc độc lập kế tiếp. Lead giao lại người khác khi cần. Không giữ ticket `in_progress` mà WorkItem đã `blocked` hoặc `done` không có ghi chú cập nhật.
- Lead kiểm tra bảng việc và sản phẩm khi có bàn giao, không đánh thức cả đội theo lịch cố định. Ticket con hoàn thành sau khi Lead xác minh đầu ra. Lead cập nhật ticket cha khi các điều kiện cuối đều đạt.

## Điều kiện nghiệm thu

Mẫu xoay được trong web và mở mặc định ở mặt có họa tiết; màu, loại áo, hình và vị trí đúng brief; ảnh trước/sau và URL là cùng revision; QA ghi bằng chứng kiểm thực tế. Nếu chưa đạt, Lead ghi rõ phần chưa hoàn tất bằng tiếng Việt. Mốc 20 phút là mục tiêu đo cho đơn dùng phom và công cụ đã chuẩn bị, không phải lý do để báo hoàn thành khi viewer chưa chạy.
