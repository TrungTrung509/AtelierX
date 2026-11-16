# Kế hoạch nâng chất lượng sản phẩm số AtelierX

**Trạng thái:** Đang triển khai. Đã có cổng chất lượng, mẫu báo cáo QA, kiểm thử viewer bằng browser, bộ skill cho sáu agent và cấu hình chat team. Sáu agent đã đăng nhận việc/bàn giao trong thread điều phối ATEL-9 bằng chính session của họ. Ứng viên hoodie `grab3d-hoodie-clean-v2` có ảnh browser và UV checker nhưng vẫn chờ kiểm vùng đặt họa tiết, đường mép và QA độc lập; thư viện chưa có mẫu `approved` (xem `quality/BASE_AUDIT.md`). Chưa đạt tiêu chí sẵn sàng nhận đơn tự động ở mục 8.

**Quyết định của chủ dự án:** 29 GLB do người dùng cung cấp được phép dùng cho AtelierX làm tham khảo hoặc phom dẫn xuất; không đặt việc truy lại URL/giấy phép từng file làm phụ thuộc trước khi thiết kế. Ưu tiên thay đổi kiểu dáng, màu, vật liệu và họa tiết để tạo mẫu mới. Xem `quality/USER_SUPPLIED_BASE_POLICY.md`. Việc cho phép sử dụng không tự động nâng bất kỳ phom nào lên `approved`; QA G1 vẫn bắt buộc.

## 1. Mục tiêu và phạm vi

Người dùng chỉ cần giao một brief bằng tiếng Việt, ví dụ “áo hoodie đen, họa tiết đầu lâu ở lưng”. Sáu agent tự phân công, tạo và kiểm tra một **mẫu thời trang số** có phom rõ, họa tiết đúng, chất liệu nhìn hợp lý, rồi đưa vào **Sàn trưng bày ngay trong web Crewly**. Studio Lead tự phê duyệt khi có đủ bằng chứng. Người dùng chỉ tham gia khi yêu cầu mơ hồ ở điểm quyết định, hoặc khi muốn tự duyệt một dòng sản phẩm đặc biệt.

Kế hoạch này áp dụng cho nhiều loại trang phục và phụ kiện, không phải bản vá riêng cho hoodie ATEL-1. Sản phẩm là mô phỏng để xem và tương tác trên web; không mặc định có rập may, số đo sản xuất hoặc triển khai ra website công khai.

**Chuẩn hoàn thành:** đúng brief, trông ra đúng loại sản phẩm ở các góc cần xem, không có bộ phận lơ lửng/xuyên nhau rõ rệt, họa tiết nhận diện được, mở và xoay được trong Sàn trưng bày, và bằng chứng kiểm tra thuộc đúng revision được bàn giao.

## 2. Vấn đề cần giải quyết

Manifest của hoodie v2 hiện ghi rõ đây là mesh tạo bằng thủ tục vì chưa có base mesh hoodie và UV được duyệt; kiểm tra trong browser cũng chưa được xác nhận. Việc có GLB hợp lệ, ảnh sơ đồ hoặc unit test pass không chứng minh phom áo, chi tiết ráp nối và đầu lâu thực sự đạt về thị giác. Tình trạng này phải được nhận diện là **bản xem trước chưa đạt cổng chất lượng**, không làm mẫu chuẩn cho các đơn sau.

Tài liệu đầu vào đề xuất ba hướng đúng: **kho phom**, **công cụ tạo/chọn họa tiết**, **công cụ đặt họa tiết lên sản phẩm**. Tuy nhiên, không nên đặt quy tắc tuyệt đối rằng mọi hình học sinh bằng code đều thất bại, mọi model AI đều dùng được, hay mọi mẫu sẽ xong trong 30 phút. Chất lượng quyết định bằng hình ảnh render và kiểm tra thực tế. Cũng không tự đổi brief “đầu lâu một mắt” thành “hai mắt”: chi tiết người dùng chỉ định luôn được ưu tiên.

## 3. Nền tảng cần chuẩn bị một lần

### 3.1. Thư viện phom đã duyệt

Tạo thư viện theo **loại + biến thể phom**, không dùng một file chung cho mọi thiết kế. Ưu tiên theo nhu cầu đơn hàng: áo thun, hoodie, áo khoác, quần, mũ; sau đó mở rộng. Mỗi phom có mã và phiên bản, nguồn/quyền sử dụng, ảnh trước/sau/hai bên, vùng in hợp lệ, vùng vật liệu, thiết lập camera và tệp gốc.

Một phom chỉ vào trạng thái `approved` khi:

- Nhìn đúng loại trang phục và kiểu dáng đã đặt tên ở góc trước, sau, bên; tỷ lệ thân, tay, cổ/mũ/túi hợp lý.
- Các bộ phận nối đúng vị trí; không có khe, mảng chồng hoặc xuyên nhau lộ rõ trong viewer. Nếu là phần rời có chủ đích, metadata phải ghi rõ.
- UV hoặc cơ chế đặt hình đủ ổn định cho các vùng đã công bố; họa tiết thử không bị lật, kéo méo hoặc tràn qua đường may.
- Chất liệu và màu có thể thay mà vẫn đọc được nếp/phom; phiên bản dùng trên web tải và xoay được.
- Nguồn và điều kiện sử dụng được lưu lại. Asset tải được miễn phí chưa đồng nghĩa được phép dùng trong sản phẩm.

Model AI 3D, model mua/tải, phom dựng trong phần mềm chuyên dụng và hình học thủ tục đều có thể là **ứng viên**. Không cách nào tự động trở thành phom chuẩn; tất cả đi qua cùng cổng kiểm. Không có phom phù hợp thì đơn chuyển sang nhánh **tạo/duyệt phom mới**, không ép một phom sai loại hoặc gắn nhãn `complete` để kịp giờ.

### 3.2. Kho họa tiết và quy trình tạo mới

Designer được phép dùng công cụ sinh ảnh, tự vẽ, hoặc chọn asset có quyền sử dụng phù hợp. Brief họa tiết phải ghi: chủ thể, phong cách, màu, vị trí, kích thước tương đối, các chi tiết bắt buộc/cấm và mức độ tương phản với nền vải. Lưu nguồn, prompt nếu có, quyền sử dụng, file gốc, file dùng trên web và ảnh preview trên nền sáng/tối.

**Cổng thị giác cho họa tiết:** người/agent kiểm tra phải nhận ra đúng chủ thể được yêu cầu ngay trên ảnh riêng và trên trang phục ở kích thước xem bình thường. Với “đầu lâu”, không thể chỉ dùng phép đếm pixel hoặc tên file làm bằng chứng. Nếu yêu cầu là đầu lâu một mắt, kiểm đúng một mắt; nếu người dùng không quy định số mắt, Designer có quyền chọn trong brief thiết kế và Lead kiểm tính dễ nhận diện. Họa tiết nhòe, nền không trong suốt khi cần, hoặc mất chi tiết khi thu nhỏ phải làm lại trước khi ráp.

### 3.3. Bộ ghép sản phẩm theo profile phom

Xây một quy trình ghép có thể lặp lại, nhận **phom đã duyệt + palette/chất liệu + artwork + vùng đặt + tỉ lệ/hướng + revision** và tạo model, ảnh preview, manifest. Mỗi base mesh có **placement profile riêng** cho ngực, lưng, tay, ống quần, mũ...; không giả định một tọa độ UV dùng cho mọi phom. Hệ thống cần phát hiện vùng không hỗ trợ hoặc decal bị méo/tràn; agent phải sửa hoặc chọn phương án đặt khác có ghi lý do.

Manifest tối thiểu: mã đơn, revision, brief gốc, danh sách ràng buộc, base mesh/version, nguồn artwork, material spec, placement profile, đường dẫn GLB, ảnh kiểm, trạng thái các cổng và người duyệt. Có thể tái tạo đúng bản đã bàn giao; sửa đổi luôn sinh revision mới.

### 3.4. Kiểm tra bằng browser thật

Chuẩn bị khả năng mở **đúng viewer đang dùng trong Crewly**, chụp tối thiểu mặt trước, mặt sau, hai bên và cận cảnh họa tiết/chi tiết đặc trưng. Kiểm xoay, zoom, tải model, nền đủ tương phản với màu sản phẩm, và ít nhất một kích thước màn hình nhỏ. Ảnh sơ đồ, ảnh render từ môi trường khác và kiểm tra glTF chỉ là bằng chứng phụ.

Nếu bộ chạy browser chưa hoạt động, ghi rõ `browser QA pending`; cho phép đăng bản `preview` để xem, nhưng không tự động đổi sang `complete`. Đây là lỗi năng lực kiểm tra cần xử lý ưu tiên, không phải lý do để dừng Researcher/Designer/Material Specialist trên các việc độc lập.

## 4. Luồng một đơn hàng: chạy song song, có cổng chất lượng

| Cổng | Đầu ra cần có | Người quyết định | Điều kiện qua cổng |
|---|---|---|---|
| G0 — Brief | Brief chuẩn hóa, ràng buộc bắt buộc, tiêu chí nhìn thấy | Studio Lead | Không tự sửa ý chính của người dùng; thiếu chi tiết không trọng yếu thì Lead tự chọn và ghi lại |
| G1 — Phom | Mã phom `approved` phù hợp, hoặc nhánh tạo phom mới | Designer + QA | Nhìn đúng loại, các phần ráp hợp lý, có vùng in dùng được và quyền sử dụng rõ |
| G2 — Đồ họa và vật liệu | Artwork preview, bảng màu, material spec | Designer + Material Specialist; Researcher kiểm hướng | Chủ thể nhận diện được, màu/độ tương phản phù hợp brief, không có xung đột nguồn asset |
| G3 — Bản ghép | GLB và manifest cùng revision; ảnh render nháp | Designer | Họa tiết đặt đúng vị trí/hướng/tỉ lệ, phom không hỏng sau ghép |
| G4 — QA thị giác | Ảnh browser trước/sau/bên/cận cảnh, phiếu lỗi và kết quả tương tác | QA, độc lập với người tạo | Không có lỗi chặn; các tiêu chí chất lượng đạt ngưỡng; viewer mở trong Crewly |
| G5 — Duyệt và bàn giao | Mục catalog `complete`, link mở trong Sàn trưng bày, thông báo tiếng Việt | Studio Lead | Tất cả bằng chứng G0–G4 trỏ đúng cùng revision; Lead tự kiểm hình và phê duyệt |

**Song song từ G0:** Researcher phân tích phong cách và tham chiếu; Material Specialist chọn màu/chất liệu; Designer tìm phom và phác họa tiết; Visual Studio chuẩn bị viewer bằng model thử và khung catalog; QA chuẩn bị checklist theo brief. Designer không phải chờ toàn bộ báo cáo mới tìm phom. Visual Studio không chờ GLB cuối mới kiểm giao diện. QA bắt đầu xem artwork và phom ngay khi có ứng viên, thay vì chờ đến cuối để trả lại cả đơn.

Mỗi đầu ra có một chủ sở hữu và một revision. Người nhận bàn giao ghi rõ phần mình dùng và phiên bản. Khi QA phát hiện lỗi, chỉ trả lại **đầu ra liên quan**: sai chủ thể về Designer, sai vật liệu về Material Specialist, lỗi viewer về Visual Studio, phom không đạt về Designer/phụ trách thư viện phom. Lead không khởi động lại toàn bộ đơn. Nếu cùng một cách sửa thất bại hai lần, Lead đổi phương án hoặc asset, ghi nguyên nhân và mốc mới. Các đơn khác vẫn chạy khi không tranh cùng file hoặc agent.

## 5. Trách nhiệm của sáu agent

| Agent | Trách nhiệm chính | Bàn giao kiểm được |
|---|---|---|
| Studio Lead | Chốt brief, chia việc, giữ ràng buộc người dùng, xử lý tắc nghẽn, tự phê duyệt và bàn giao | Brief chuẩn hóa, ticket có owner, quyết định qua/từ chối từng cổng, trạng thái catalog và tin bàn giao tiếng Việt |
| Researcher | Tìm hướng thẩm mỹ và tham chiếu phù hợp chủ đề; rà nguồn/giấy phép nếu đề xuất asset | Art direction ngắn, các đặc điểm bắt buộc, palette gợi ý và nguồn tham chiếu |
| Fashion Designer | Chọn/phát triển phom ứng viên, tạo hoặc chọn artwork, ghép model, quản lý nguồn và revision | Base mesh ID, artwork thật, GLB/manifest, ảnh các góc, ghi chú những lựa chọn thiết kế |
| Material Specialist | Quy định màu/chất liệu số, cách bề mặt bắt sáng, tương phản giữa vải và họa tiết; kiểm material slots | Material spec, palette, ảnh thử nền sáng/tối và nhận xét nếu chất liệu làm mất phom/hình in |
| Visual Studio | Viewer trong Crewly, ánh sáng/camera/nền, mục trưng bày nhiều sản phẩm, tương tác trên màn hình nhỏ | Mục `preview`/`complete` đúng revision, viewer tải và xoay, ảnh màn hình thật |
| QA Specialist | Kiểm độc lập kỹ thuật lẫn thị giác, đối chiếu brief với ảnh browser, phát hành phiếu lỗi có thể sửa | Phiếu QA theo từng cổng, ảnh chứng cứ, lỗi chặn/lỗi nhẹ, kết quả kiểm lại đúng revision |

Studio Lead có thể duyệt nội bộ dựa trên phiếu QA và ảnh thật. Không thêm bước bắt người dùng bấm “Duyệt” cho mỗi đơn. Khi mở loại phom đầu tiên hoặc sản phẩm chủ lực, có thể mời người dùng đánh giá **chuẩn mẫu** một lần để hiệu chỉnh thẩm mỹ; đó là lựa chọn của người dùng, không là điều kiện đóng mọi ticket.

## 6. Thang chất lượng và lỗi chặn

Chấm 0–5 cho sáu mục: (1) phom/silhouette, (2) ráp nối và chi tiết đặc trưng, (3) độ đúng và dễ nhận diện của họa tiết, (4) vị trí/hướng/tỉ lệ họa tiết, (5) chất liệu/màu/độ tương phản, (6) hiển thị và tương tác trong web. **Qua G4 khi mỗi mục đạt ít nhất 4/5 và không có lỗi chặn.** Điểm phải kèm ảnh hoặc quan sát cụ thể, không được tự chấm theo tên file, kích thước texture hay unit test.

Lỗi chặn gồm: sai loại sản phẩm; thiếu một thuộc tính người dùng nêu rõ; phom không giống trang phục; tay/mũ/túi hoặc chi tiết chính lơ lửng, xuyên, chồng lệch dễ thấy; họa tiết không nhận ra chủ thể hoặc ở sai mặt; sản phẩm gần như chìm vào nền; viewer không mở được; bằng chứng QA khác revision. Lỗi nhẹ như nếp vải chưa phong phú hoặc góc camera chưa tối ưu được ghi để sửa sau nếu không ảnh hưởng chuẩn trên.

Kết quả có ba mức riêng: `draft` (đang tạo), `preview` (mở được nhưng còn cổng chưa đạt), `complete` (qua đủ G0–G5). Không đổi ticket sang Done chỉ vì file đã tạo hoặc agent đã báo xong; ticket cha chỉ hoàn thành khi mục `complete` mở được trong Sàn trưng bày. Giữ lịch sử revision và lý do từ chối để không lặp lỗi.

## 7. Thứ tự triển khai sau khi duyệt kế hoạch

| Giai đoạn | Việc làm | Điều kiện chuyển bước |
|---|---|---|
| 0. Chốt chuẩn đo | Lưu lỗi hoodie hiện tại làm ca kiểm hồi quy; chốt thang điểm, mẫu brief/manifest/phiếu QA; xác nhận cách chụp browser trong Crewly | Một sản phẩm lỗi được đánh `preview` với lý do nhìn thấy được, không bị báo Done nhầm |
| 1. Dựng thư viện phom | Bắt đầu từ 1–2 loại có đơn thực tế; kiểm nguồn và duyệt phom, UV, vùng in, ảnh các góc; mở rộng dần | Ít nhất một phom cho mỗi loại đang nhận đơn qua G1; thiếu phom có nhánh xử lý rõ |
| 2. Trang bị artwork và ghép | Cấp công cụ tạo/chọn hình hợp lệ, lưu nguồn; làm placement profile theo từng phom; xuất manifest/revision tái tạo được | Một họa tiết mới ghép được đúng vị trí trên mỗi phom thử mà không sửa tay code cho từng đơn |
| 3. Nối QA thị giác và catalog | Chụp browser thật, lưu ảnh/phiếu điểm, chặn `complete` khi G4 thiếu; hiển thị nhiều mẫu và trạng thái trong Sàn trưng bày | Lead xem đúng revision, từ chối bản xấu và duyệt bản tốt ngay trong quy trình |
| 4. Thử đa dạng | Chạy ít nhất ba brief khác nhau về loại phom, màu và vị trí họa tiết; cố ý đưa một mẫu lỗi để thử cổng chặn | Mẫu tốt được bàn giao; mẫu lỗi nằm `preview` và có ticket sửa đúng owner |

Thư viện phom, profile đặt hình và browser QA là **công việc nền một lần, có bảo trì**, không tính vào thời gian làm từng đơn. Sau khi đủ nền, theo dõi thời gian từ brief đến preview và từ preview đến complete; đặt mục tiêu thời gian dựa trên dữ liệu thực tế của từng loại sản phẩm. Không dùng mốc 20–30 phút để bỏ qua cổng chất lượng hoặc hứa mọi yêu cầu đều xong trong cùng một khoảng thời gian.

## 8. Chỉ số theo dõi và tiêu chí chấp nhận toàn hệ thống

Theo dõi theo tuần: tỷ lệ qua QA thị giác lần đầu, số vòng sửa mỗi đơn, thời gian chờ do thiếu phom/artwork/browser, số lần revision lệch giữa catalog–GLB–QA, và tỷ lệ đơn `complete` mà người dùng mở được trong Crewly. Mỗi lỗi lặp lại từ hai đơn trở lên phải trở thành cải tiến thư viện phom, placement profile hoặc checklist, thay vì bản vá riêng cho từng mẫu.

Hệ thống chỉ được xem là sẵn sàng nhận đơn tự động khi: ba brief thử đa dạng qua đủ G0–G5; một brief cố ý lỗi bị chặn trước `complete`; người dùng xem được danh sách nhiều sản phẩm trong Sàn trưng bày; Lead bàn giao bằng tiếng Việt với link/mã sản phẩm và ảnh kiểm; không cần người dùng đưa sẵn model, ảnh họa tiết hoặc duyệt từng bước. Nếu công cụ hoặc quyền sử dụng chưa đủ cho một brief, Lead báo rõ trạng thái `preview`/chưa thể nhận, phần thiếu, người xử lý và phương án tiếp theo — không tự chế bản kém chất lượng để báo xong.

## 9. Các quyết định cần chốt khi đánh giá plan

1. **Loại sản phẩm ưu tiên để dựng thư viện đầu tiên:** đề xuất hoodie và áo thun vì có thể kiểm lại hoodie hiện tại và thử một kiểu khác; danh sách sẽ mở rộng theo đơn thực tế.
2. **Mức thẩm mỹ chuẩn:** chọn một vài mẫu tham chiếu hợp gu AtelierX để Lead/QA chấm nhất quán. Đây là hiệu chỉnh chuẩn chung, không phải duyệt từng đơn.
3. **Nguồn asset và ngân sách công cụ:** sau khi duyệt plan mới chọn nguồn model/họa tiết và xem giấy phép, giá, giới hạn API. Không giả định công cụ nào đã được kết nối hoặc miễn phí.
4. **Đơn ngoài thư viện:** cho phép nhận với trạng thái “cần tạo phom mới” và thời gian riêng; không hứa thời hạn của đơn dùng phom sẵn.
