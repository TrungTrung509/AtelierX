---
title: "operating-model"
migrated_from: ".crewly/knowledge/operating-model.md"
---

# Quy trình vận hành AtelierX

**Luồng nhanh 60 phút:** áp dụng `atelierx-fast-lane-v1` khi đã có phom dùng được. Designer kiểm phom/artwork song song với Researcher; không chờ session Researcher nếu bị khóa. QA nhận bản thử cùng revision/hash sớm, trả một danh sách lỗi có chủ sửa; Lead chọn phom khác sau hai vòng sửa không đạt. Không khởi động lại cả team khi Designer/QA đang tạo artifact. Giữ `preview` tới khi G1, QA browser và quality gate đạt.

**Thứ tự kiểm phom nội bộ:** với hoodie ATEL-1, kiểm trước `user-classic-black-flame-hoodie-0a923687-v1` và `user-green-and-white-hoodie-25f4b3ee-v1` trong `quality/base-meshes.json`. Researcher ghi nhanh dáng, phần thừa, mặt lưng và vùng in; Designer kiểm mesh/UV song song. Nếu cả hai không dùng được, ghi lý do cụ thể cho từng file rồi mới tìm nguồn ngoài. ATEL-10 đã hoàn tất đợt tìm nguồn ngoài; lỗi HTTP 403 của BlendSwap không chặn việc kiểm phom nội bộ và không phải lý do retry tiếp. Chỉ QA và Lead mới duyệt G1 dựa trên bằng chứng browser.

**Chuẩn chất lượng hiện hành:** áp dụng `AtelierX/PLAN_CHAT_LUONG_SAN_PHAM.md` và skill `atelierx-quality` cho mọi đơn mới. Phom phải được duyệt trong `quality/base-meshes.json`; QA phải có ảnh browser thật và phiếu `quality/reports/<đơn>/<revision>.json`; Lead chạy `node tools/quality-gate.mjs --product <đơn>` và tự xem ảnh trước khi dùng `--publish` để đổi catalog sang `complete`. Mốc 20 phút bên dưới chỉ để theo dõi đơn đã có đủ asset và công cụ, không phải lý do bỏ cổng chất lượng. Thiếu phom, artwork hoặc browser thì giữ `preview` và tạo ticket bổ sung. Lead mở một thread điều phối riêng trong channel AtelierX; từng agent đăng nhận việc, bàn giao và QA bằng chính session của mình qua `atelierx-channel-v3`, lưu `messageId` vào ticket.

**Phom người dùng đã cung cấp:** 29 GLB trong `phom cơ sở/` và `quality/candidates/user-supplied/` được chủ dự án cho phép dùng cho AtelierX theo `quality/USER_SUPPLIED_BASE_POLICY.md`. Researcher/Designer không chờ người dùng gửi link nguồn hoặc giấy phép từng file. Ưu tiên tham khảo phom để tạo kiểu dáng, màu, vật liệu và họa tiết mới; nếu dẫn xuất trực tiếp, lưu base ID/hash. Quyền dùng không thay cổng G1: phom vẫn `candidate` cho tới khi kiểm thị giác, UV/vùng in và QA đạt.

Mục tiêu của một đơn là mẫu áo số mở được và xoay được ngay trong **Sàn trưng bày của AtelierX trên web Crewly**. Giữ nguyên yêu cầu của khách về loại áo, màu, họa tiết và vị trí. Studio Lead tự quyết phần khách để mở. Tất cả trao đổi và bàn giao bằng tiếng Việt trong thread của đơn trên `#general` AtelierX. Không cần deploy hoặc cấp URL công khai bên ngoài.

## Một đơn, nhiều việc chạy song song

Mỗi đơn có một ticket cha. Lead tạo các ticket con riêng, gắn mã đơn cha và giao ngay cho đúng agent. Ticket tạo ở `backlog` chưa khởi chạy. Lead chuyển sang `ready`, rồi dùng `skill-assign-ticket` hoặc `project-tickets assign` để có assignee và WorkItem thật. Sau khi giao, kiểm tra API hoặc bảng Tasks đã ghi `in_progress` và tên người nhận. Bài đăng chat chỉ thông báo, không thay thế thao tác giao ticket.

| Đầu việc | Phụ trách | Có thể bắt đầu khi | Bàn giao tối thiểu |
|---|---|---|---|
| Hướng minh họa | Researcher | Có brief | Chủ thể, bố cục, bảng màu, điều bắt buộc, tài liệu tham khảo nếu dùng |
| Chất liệu số và bảng màu | Material Specialist | Có brief và loại áo | Màu, material slot, độ nhám, vùng in, asset có thật hoặc fallback |
| Phom và họa tiết | Designer | Có brief và phom dùng được | Bản nguồn, texture, GLB, revision, ảnh trước/sau |
| Khung viewer | Visual Studio | Có mã đơn; có thể dùng mẫu thử sẵn | Viewer mở được mẫu thử, trạng thái tải/lỗi, chỗ thay URL GLB cuối |
| Kiểm tra kỹ thuật | QA | Có GLB nháp; trước đó chuẩn bị checklist | Ảnh và kết quả về mặt in, chiều, phom, tải model, revision |
| Duyệt và bàn giao | Studio Lead | Có GLB, viewer và QA đạt cùng revision | Mục sản phẩm trong Sàn trưng bày, tên mẫu, revision, điểm đã kiểm tra |

Researcher, Material Specialist, Designer và Visual Studio bắt đầu cùng lúc. Designer được dựng phom trước khi có art direction, Visual Studio được dựng khung viewer bằng model thử trước khi có GLB cuối, QA được chuẩn bị checklist trước khi có GLB. Khi một phòng bàn giao dữ liệu mới, người nhận chỉ cập nhật phần phụ thuộc. Không bắt cả đội chờ một báo cáo chung.

Mỗi agent chỉ giữ một WorkItem đang thực hiện cho một đơn; revision mới thay cho revision cũ của cùng đầu ra, không chạy hai bản sửa trên cùng file đồng thời. Lead có thể mở đơn khác khi chủ file và năng lực thực thi không xung đột. Nếu cần đổi ưu tiên, Lead ghi ticket nào tạm dừng, ticket nào được tiếp tục và revision nào là nguồn chuẩn.

Ticket cha chỉ thuộc Studio Lead; các chuyên viên không claim ticket cha. Ticket con `ready` phải được giao trong cùng lượt điều phối, kể cả khi ticket khác bị chặn. Sau khi giao, kiểm cả ticket, WorkItem, session và log thực thi. `active/running` nhưng agent `idle` chỉ được coi là treo khi cả heartbeat lẫn log/đầu ra đều không tiến triển trong 2 phút; `workingStatus` có thể cập nhật chậm dù agent đang chạy. Không tạo WorkItem mới cho cùng ticket khi claim cũ còn hiệu lực: trước hết thu hồi hoặc kết thúc claim cũ, ghi lý do, rồi giao lại đúng một lần.

## Quyền sở hữu và phiên bản

Designer sở hữu file nguồn, texture và GLB trong thư mục mẫu. Material Specialist sở hữu material spec riêng; Visual Studio sở hữu trang viewer và bản sao phục vụ Sàn trưng bày; QA sở hữu phiếu kiểm tra. Lead sở hữu brief, trạng thái đơn và `showcase/catalog.json`. Mỗi người chỉ sửa khu vực của mình. Dùng mã `ATEL-n/vN` trong mọi bàn giao. Nếu cùng file cần hai người sửa, Lead chỉ định một người sửa và người còn lại gửi nhận xét hoặc patch để áp dụng. Chỉ công bố hoàn thành khi sản phẩm trong Sàn trưng bày tải đúng GLB của revision đã được QA kiểm.

## Nhịp và xử lý vướng mắc

- Trong 2 phút từ lúc nhận brief, Lead tạo việc cho các phòng độc lập. Sau mỗi lần giao, xác nhận ticket có người nhận và WorkItem đã chạy.
- Mốc mục tiêu cho đơn dùng phom có sẵn: phút 0–2 chốt brief/giao việc; phút 2–7 hoàn tất hướng minh họa, vật liệu số và viewer khung; phút 7–15 hoàn thiện GLB và tích hợp; phút 15–20 QA, sửa lỗi nhỏ và bàn giao. Đây là mốc theo dõi, không phải thời hạn để bỏ kiểm tra. Nếu một mốc trễ, Lead ghi nguyên nhân, phạm vi ảnh hưởng, người xử lý và mốc dự kiến mới trong ticket cha.
- Mỗi phòng đăng một cập nhật khi có đầu ra, khi đổi revision hoặc khi bị chặn. Không gửi tin lặp chỉ để báo vẫn đang làm.
- Khi bị chặn, ghi nguyên nhân cụ thể, file hoặc API lỗi, việc nào bị ảnh hưởng và bước thử tiếp theo. Trong cùng lượt làm việc, thử một hướng khác phù hợp với yêu cầu số 3D. Ví dụ, thiếu thông số may thật không chặn mockup; CDN viewer lỗi thì thử tài sản viewer cục bộ hoặc môi trường duyệt đã có; thiếu GLB cuối thì Visual Studio hoàn thiện khung bằng model thử.
- Nếu vẫn bị chặn, trả ticket về `ready` hoặc ghi trạng thái chờ phù hợp với lý do, báo Lead, rồi nhận phần việc độc lập kế tiếp. Lead giao lại người khác khi cần. Không giữ ticket `in_progress` mà WorkItem đã `blocked` hoặc `done` không có ghi chú cập nhật.
- Mỗi khi nhận brief, bàn giao hoặc cảnh báo, Lead rà nhanh ba hàng đợi: ticket `ready` chưa có assignee/WorkItem; WorkItem `running` nhưng session idle, không có heartbeat **và** log/đầu ra đứng yên; WorkItem `blocked` nhưng còn phần việc độc lập. Giao ticket ready ngay, thu hồi claim treo trước khi retry, tách phần đã đạt ra khỏi phần còn chặn. Sau tối đa một lần retry cùng cách, đổi phương án hoặc chủ xử lý; không tạo chuỗi `:review:` lặp.
- Tách kiểm viewer thành ba kết quả: (1) asset/HTML/HTTP, (2) render/xoay/zoom trong browser Crewly, (3) mục catalog trỏ đúng revision. Thiếu browser chỉ chặn mục (2); Viewer vẫn bàn giao phần (1), Lead có thể đưa bản nháp vào catalog với `status: preview`, và chỉ đổi thành `complete` khi QA đạt. Không chờ Sites, hosting hay quyền phát hành bên ngoài. Các phòng khác tiếp tục đơn kế tiếp nếu không xung đột file.
- Lead kiểm tra bảng việc và sản phẩm khi có bàn giao, không đánh thức cả đội theo lịch cố định. Ticket con hoàn thành sau khi Lead xác minh đầu ra. Lead cập nhật ticket cha khi các điều kiện cuối đều đạt.

## Điều kiện nghiệm thu

Mẫu xuất hiện trong danh sách Sàn trưng bày, mở được ngay trong Crewly, xoay được và mặc định ở mặt có họa tiết; màu, loại áo, hình và vị trí đúng brief; catalog, GLB, ảnh trước/sau và QA là cùng revision. QA ghi bằng chứng kiểm thực tế. Nếu chưa đạt, catalog ghi `preview` và Lead nêu phần còn thiếu bằng tiếng Việt. Mốc 20 phút là mục tiêu đo cho đơn dùng phom và công cụ đã chuẩn bị, không phải lý do để báo hoàn thành khi viewer chưa chạy.
