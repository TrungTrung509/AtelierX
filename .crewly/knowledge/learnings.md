# Project Learnings: AtelierX

This file contains learnings discovered during development.

---

## 2026-11-13

### [frontend-developer/atelierx-frontend-developer-0006] 12:50:33
Task blocked: Đã dựng viewer shell tại site-atel-1/dist/index.html; URL model xác nhận đúng. Chưa thể hoàn tất hoặc chụp QA vì GLB ATEL-2 chưa được bàn giao và môi trường không có Chrome/Chromium. Cần file hoodie-skull-v1.glb trong assets/models/ATEL-2/v1/ để tích hợp và kiểm desktop/mobile.

---

## 2026-11-13

### [frontend-developer/atelierx-frontend-developer-0006] 13:00:57
Task blocked: Đã sửa chính xác đường dẫn GLB và góc khởi đầu nhìn mặt lưng (180° vì panel sau ở Z âm); xác minh GLB v2 đọc được và HTTP local trả 200 cho HTML + model. Chưa thể hoàn tất QA: runtime không có Chrome/Chromium hay browser tool, nên không xác nhận render/interaction trên desktop/mobile và chưa có ảnh. Cần lead cung cấp browser runner/fallback QA để tiếp tục kiểm tra mô hình thật.

---

## 2026-11-13

### [designer/atelierx-designer-0003] 13:02:20
[[glTF UV mapping]] UV origin is upper-left. Map garment hem to V=1 and shoulders to V=0 so an upright top-to-bottom artwork PNG renders upright on the garment. Keep Khronos Validator output in evidence and distinguish it from viewer QA.

---

## 2026-11-13

### [frontend-developer/atelierx-frontend-developer-0006] 13:02:46
Task blocked: Đã thử fallback Playwright Chromium có sẵn; launcher lỗi thiếu libglib-2.0.so.0. Không cài system library theo chỉ dẫn. Chrome attach execute.sh và browser tool không có trong runtime. HTML/model HTTP 200 và GLB parse pass; render, tương tác chuột/cảm ứng và ảnh desktop/mobile vẫn chưa xác nhận. Đã nhờ lead cung cấp Sites preview/browser runner.

---

## 2026-11-13

### [frontend-developer/atelierx-frontend-developer-0006] 13:40:13
Task blocked: Tích hợp local ATEL-2/v2 hoàn tất: source URL cập nhật đúng canonical GLB; không sửa asset/model. HTTP page và GLB trả 200; GLB v2 parse và các UI/controls được source-check. Browser QA desktop/mobile, render thực, rotation/zoom và screenshots chưa xác nhận vì Chromium thiếu system libraries và không có browser runner.

---

## 2026-11-13

### [frontend-developer/atelierx-frontend-developer-0006] 13:40:39
Task blocked: Tích hợp local ATEL-2/v2 hoàn tất: source URL canonical đúng; không sửa asset/model. HTTP page và GLB trả 200; GLB v2 parse và source checks loading/error, back orbit, mouse/touch controls đạt. Browser QA desktop/mobile, render thực, rotation/zoom và screenshots chưa xác nhận vì Chromium thiếu system libraries và không có browser runner.

---

## 2026-11-13

### [qa/atelierx-qa-0004] 17:55:23
Task blocked: Phiếu QA ATEL-2/v2 hoàn tất và đăng trong thread; asset, GLB, manifest, tests và HTTP đạt kiểm tra tĩnh. WorkItem bị chặn cho runtime vì không có browser runner; viewer source cũng còn nhãn v1.

---

## 2026-11-13

### [qa/atelierx-qa-0004] 18:32:01
Task blocked: ATEL-8 QA report was already posted to the specified AtelierX order thread and logged; no duplicate owner post. Runtime browser checks remain blocked, so preserve the blocked WorkItem state.

---

## 2026-11-13

### [frontend-developer/atelierx-frontend-developer-0006] 18:42:13
Task blocked: Đồng bộ nhãn UI sang ATEL-1 v2/REVISION 02; local HTTP/source checks pass cho trang và GLB canonical v2, không sửa model. Chưa đạt nghiệm thu browser: Chromium thiếu system libraries, nên render desktop/mobile, xoay/zoom thực tế và screenshots chưa xác minh.

---

## 2026-11-14

### [tpm/atelierx-tpm-0002] 04:44:20
Task blocked: Đã xác minh WorkItem 6dc47db3 đang running; ticket cha ghi rõ chỉ Studio Lead sở hữu và quyết định nghiệm thu. Poll FIFO không claim vì WorkItem đã được gán/claim; accept-task targeted bị 404 vì item không còn claimable. Hợp đồng hiện có yêu cầu QA browser thực tế cùng revision; lịch sử ticket ghi browser relay disconnected, không có screenshots render/xoay/zoom desktop/mobile. Tôi không thể thay QA hoặc Lead. Đề nghị Lead khôi phục browser runner/ủy quyền QA đúng agent, hoàn tất evidence rồi Lead chạy quality gate và publish.

---

## 2026-11-14

### [tpm/atelierx-tpm-0002] 04:48:50
Task blocked: Đã khôi phục ngữ cảnh: ATEL-1 hiện được ghi blocked; lịch sử nêu ticket cha thuộc Studio Lead và thiếu browser capture QA thực tế cùng revision. Tôi đã đăng ký active; sẽ kiểm tra state và cập nhật người phụ trách theo operating model.

---

## 2026-11-14

### [tpm/atelierx-tpm-0002] 04:49:15
Task blocked: Đã release ATEL-1 về ready để Studio Lead tiếp quản đúng ownership; gửi structured blocker và bước tiếp theo. Viewer v2 đã có, nhưng thiếu QA browser capture và report revision 02, nên gate/publish chưa đạt.

---

## 2026-11-14

### [tpm/atelierx-tpm-0002] 04:54:17
Task blocked: Dispatch ATEL-10 nhưng poll FIFO claim nhầm WorkItem ATEL-1 hai lần. Đã release claim nhầm và báo Lead; cần sửa routing/claim để tiếp tục đúng ticket ATEL-10.

---

## 2026-11-14

### [frontend-developer/atelierx-frontend-developer-0006] 09:45:25
Task blocked: Đã xác nhận browser capture thật hoạt động trên quality-preview desktop/mobile; ảnh tương tác đạt nhưng QA thấy giá đỡ che/xuyên qua hoodie. Base mesh vẫn candidate nên chưa thể duyệt phom.

---

## 2026-11-14

### [team-leader/atelierx-team-leader-0001] 09:56:08
Task blocked: Không thể nhận Verify ATEL-10: Task Pool vẫn báo queued và đúng target phiên này, nhưng poll trượt vào review ATEL-1 cũ rồi trả 404; claim ID đích cũng trả 404 not claimable.

---

## 2026-11-14

### [backend-developer/atelierx-backend-developer-0005] 10:52:21
Task blocked: Đã gửi Studio Lead yêu cầu căn chỉnh: ATEL-1 là ticket cha thuộc Lead, trong khi WorkItem được route nhầm cho backend; poll-tasks không nhận claim. Ticket còn thiếu browser QA/report revision 02 và Lead cần chạy quality gate.

---

## 2026-11-14

### [backend-developer/atelierx-backend-developer-0005] 10:59:01
Task blocked: Khôi phục phiên: ATEL-1 là ticket cha thuộc Studio Lead; WorkItem backend trước đây bị route nhầm, và còn thiếu QA browser/report revision 02 cùng bước quality gate của Lead. Đang xác minh trạng thái authoritative trước khi nhận thêm việc.

---

## 2026-11-14

### [backend-developer/atelierx-backend-developer-0005] 10:59:11
Task blocked: Đã yêu cầu Team Lead gửi lại kết quả và hợp đồng task bị thất lạc. Chưa bắt đầu sửa ATEL-1 vì ticket cha thuộc Lead và chưa có phân công backend hợp lệ; chờ xác nhận scope/WorkItem.

---

## 2026-11-14

### [backend-developer/atelierx-backend-developer-0005] 11:00:01
Task blocked: Team Lead xác nhận không giao thêm việc backend cho ATEL-1. Material spec ATEL-12 đã done; không sửa assets/catalog/QA. WorkItem ATEL-1 vẫn blocked do route sai ownership; Lead xử lý routing và tiếp tục Designer/QA ATEL-15. QA v2 còn blocker nên catalog giữ preview.

---

## 2026-11-14

### [backend-developer/atelierx-backend-developer-0005] 11:00:37
Task blocked: Không có việc backend cần tiếp tục. Route sai ATEL-1 vẫn chưa được Lead chỉnh; ticket in_progress/frontmatter backend-0005 nhưng WorkItem blocked do ownership mismatch. ATEL-12 done. QA v2 chưa đạt nên preview; Lead cần căn chỉnh assignment/status.

---

## 2026-11-14

### [backend-developer/atelierx-backend-developer-0005] 14:37:58
Task blocked: Đã khôi phục phiên và xác minh WorkItem ATEL-1 vẫn blocked; Lead xác nhận QA đủ bằng chứng nhưng sản phẩm còn preview do phom chưa được duyệt. Đây là ticket cha thuộc Lead, không có phần backend được giao hợp lệ. Cần Lead căn chỉnh/đóng route WorkItem hoặc giao ticket con backend riêng nếu có.

---

## 2026-11-14

### [designer/atelierx-designer-0003] 14:47:04
[[Grab3D clean-v2 UV placement]] Ở ATEL-9, island UV mặt lưng của grab3d-hoodie-clean-v2 bị xoay +90° so với mặt trước; xác nhận bằng dấu chẩn đoán bất đối xứng trên browser. Dấu giữa lưng bị hood phủ một phần. Ảnh neck-detail cũng cho thấy thanh/mảnh ngang còn phía trên cổ/mũ; cần QA phân biệt với cấu tạo trước khi sửa mesh. Dùng GLB chẩn đoán riêng, giữ source hash và status candidate.

---

## 2026-11-14

### [backend-developer/atelierx-backend-developer-0005] 14:57:39
Task blocked: WorkItem backend cũ của ATEL-1 đã được Lead release sau blocked-review; ticket cha được assign lại cho Lead và WorkItem mới đang queued. QA v2 còn thiếu phom procedural approved; catalog vẫn preview. Hiện không có đầu việc backend cần thực hiện, chờ ticket con có scope cụ thể nếu phát sinh.

---

## 2026-11-14

### [designer/atelierx-designer-0003] 16:10:38
[[AtelierX revision ETA calibration]] In ATEL-20, the published revision median was 23 min, but the work completed in 15 min because the approved mesh, existing Crewly browser runner, placement profile and preview route were already available; reserve extra time only for new artwork/texture, not setup that can be reused. Ref: WorkItem 07ca64d9-6a31-449a-b43e-df924903212a.

---

## 2026-11-14

### [tpm/atelierx-tpm-0002] 19:53:14
[[AtelierX Researcher Artwork Handoff]] ETA 2 phút theo median other thấp cho đầu ra artwork gốc, copy, preview, hash và phối hợp; ATEL-28 mất 5 phút. Lần sau ước lượng riêng phần tạo artwork và kiểm manifest; ref WorkItem 001c8134-44f4-4f15-9a6c-b92c4429cde4.

---

## 2026-11-14

### [designer/atelierx-designer-0003] 20:16:41
[[ATEL-24 revision estimate]] The 29-minute revision exceeded the 15-minute estimate because UV handoff required four refreshed detail captures, fit/candidate manifests, reconciling a stale downstream material hash, and recovering from shell-quoting/attachment failures. For revision tasks spanning UV and multi-lane handoff, budget beyond mesh-only time and use message-file or quoted heredoc to preserve paths and hashes.

---

## 2026-11-14

### [frontend-developer/atelierx-frontend-developer-0006] 20:42:55
[[StandingAnswerRefresh]] Standing-answer refresh can surface stale historical blockers; verify primary ticket state before preserving them. ATEL-3 was already done, while the current ATEL-26 blocker was recorded in ticket/report state, so refreshing required checking both before rewriting the answer.

---

## 2026-11-14

### [designer/atelierx-designer-0003] 21:58:14
[[ATEL-29 retry ETA]] The initial ETA 2 min was too low because I classified the task as evidence-only before opening the requested oblique captures. Those captures revealed a real upper-back SDF truncation and required v2.1 geometry rebuild, not just recropping. I updated ETA to 29 min; actual duration was 11 min because the existing builder, browser preview, and capture scripts were reusable. On retry, inspect newly requested camera angles before classifying ETA; the first ETA appears sticky in task timing.

---

## 2026-11-15

### [frontend-developer/atelierx-frontend-developer-0006] 00:22:09
Task blocked: ATEL-26 viewer scaffold và nội dung tiếng Việt sẵn; xác minh mới nhất cho thấy ATEL-23/v2.1 vẫn bị QA trả lại G1 do 931 cặp giao cắt/contact chưa phân loại. ATEL-30 đang do Designer xử lý; giữ nguyên viewer/catalog scaffold, chưa tích hợp material hoặc tạo display.glb cho tới QA retest và quyết định G1 của Lead.

---

## 2026-11-15

### [qa/atelierx-qa-0004] 00:22:59
Task blocked: ATEL-25 chưa thể tiếp tục retest: ATEL-30 chưa bàn giao v2.2 hoặc clearance evidence đã xác minh; v2.1 còn 931 contact chưa phân loại, viewer cuối chưa tích hợp và Crewly Chrome không kết nối. Checklist QA đã chuẩn bị; chờ Lead xác minh handoff và mở lại WorkItem.

---

## 2026-11-15

### [team-leader/atelierx-team-leader-0001] 00:23:47
Task blocked: [TL_REPORT] ATEL-23 chưa thể mở lại ATEL-25: đã xác minh ATEL-30 vẫn in_progress, chưa có v2.2/clearance handoff; QA v2.1 trả G1 với 931 contact chưa phân loại. Đã yêu cầu Designer bàn giao evidence và xác nhận QA giữ blocked. Viewer/catalog giữ scaffold/preview; không publish. Bước kế tiếp: Lead xác minh revision/SHA/evidence rồi unblock QA retest đúng revision.

---

## 2026-11-15

### [qa/atelierx-qa-0004] 00:46:31
Task blocked: QA G1 v2.3 đã trả lại và ghi nhận; Lead giao ATEL-31 corrective vùng cổ/đầu. ATEL-25 chờ handoff revision mới cùng SHA/evidence và Lead xác minh trước retest; official viewer QA và publish vẫn pending.

---

## 2026-11-15

### [qa/atelierx-qa-0004] 01:23:54
Task blocked: ATEL-23/v2.4 retest report ghi TRẢ LẠI G1: clearance screen không tái hiện penetration nhưng mép opening cổ còn gồ ghề/lởm chởm, baseMeshId chưa khai báo. Chờ Lead quyết định corrective/base mesh và mở lại trước viewer QA cuối; không publish.

---

## 2026-11-15

### [designer/atelierx-designer-0003] 02:37:17
[[ATEL-32 source assessment]] The 10-minute completion beat the 22-minute revision estimate because source mapping and isolated GLB generation were already present; work was capture-path repair, reviewing 39 captures, classification, and handoff. For resumed assessment tasks, inspect existing artifacts before estimating fresh build effort.

---

## 2026-11-15

### [frontend-developer/atelierx-frontend-developer-0006] 04:13:19
Task blocked: ATEL-26 đang blocked đúng trạng thái: viewer scaffold mannequin-v1 và nội dung ATEL-23/v1 đã có, nhưng chưa thể lắp garment/material/artwork thành display vì QA G1 gần nhất quality/reports/ATEL-23/v2.4.json (2026-11-15 01:23) trả lại: opening cổ còn răng cưa/lởm chởm; fit.json thiếu baseMeshId và registry chưa có shirt base approved. Designer đang sở hữu corrective revision; chờ Lead xác minh revision/hash/evidence và QA G1 đạt. Giữ catalog unchanged, không tích hợp model chưa duyệt.

---

## 2026-11-15

### [qa/atelierx-qa-0004] 04:15:38
Task blocked: ATEL-23/v2.5 được rà sơ bộ: hash garment/combined/mannequin và 12 capture khớp; clearance vẫn ghi 1.295 giao cắt, 34.745 inside samples, depth 16,16 mm; baseMeshId null, chưa có shirt base approved, preview chưa phải official viewer và rotate=false. Fit bundle tự ghi Lead verification/QA retest pending. WorkItem tiếp tục blocked theo quyết định hiện hành; cần Lead xác minh handoff và xử lý điều kiện G1 rồi mới mở retest.

---

## 2026-11-15

### [team-leader/atelierx-team-leader-0001] 04:17:37
Task blocked: [TL_REPORT] Đã xử lý 4 review recovery tuần tự: ATEL-33 Researcher và ATEL-34 Designer đều xác nhận usage_limit, đã block đến 05:12 UTC để nhả claim; không retry/restart trước reset, artifact/registry giữ nguyên. Bằng chứng: quality/evidence/ATEL-23/idle-review-2026-11-15.md, idle-review-ATEL-34-2026-11-15.md, redelivery-review-ATEL-33-2026-11-15.md, redelivery-review-ATEL-34-2026-11-15.md. Sau 05:12 UTC cần probe hai session; nếu vẫn lỗi thì reassign. ATEL-23 chưa qua G1/QA, viewer cuối và publish vẫn giữ.

---

## 2026-11-15

### [qa/atelierx-qa-0004] 04:23:17
Task blocked: Đã phục hồi ngữ cảnh; ATEL-25 vẫn blocked. Ghi nhận gần nhất: ATEL-23/v2.5 còn 1.295 giao cắt/34.745 inside samples, baseMeshId null, chưa có shirt base approved, preview chưa phải official viewer; cần Lead xác minh handoff/G1 trước retest. Đang đối chiếu brief và quy trình để tránh lặp QA cũ.

---

## 2026-11-15

### [frontend-developer/atelierx-frontend-developer-0006] 04:23:37
Task blocked: ATEL-26 tiếp tục blocked theo cổng G1. what_tried: kiểm tra ticket ATEL-26, operating-model và hồ sơ QA mới nhất hiện có; xác nhận viewer scaffold/content v1 đã bàn giao và chưa có quyền tích hợp model. what_failed: quality/reports/ATEL-23/v2.4.json trả return, leadApproved=false; lỗi cổ/opening còn răng cưa, fit.json thiếu baseMeshId và registry chưa có shirt base approved. v2.5 được nhắc trong ghi chú nhưng file report không tồn tại; chưa có handoff corrective đã xác minh. what_needed: Designer/Lead chốt corrective revision + base mesh, QA độc lập retest G1 đạt, Lead xác nhận cho tiếp tục. partial_result: scaffold mannequin-v1/content Việt và catalog draft hiện có; giữ nguyên, chưa tạo display GLB hoặc cập nhật catalog. Không sửa gì trong lượt khôi phục này.

---

## 2026-11-15

### [qa/atelierx-qa-0004] 04:24:44
Task blocked: ATEL-25 vẫn blocked theo quyết định Lead. Checklist QA v1 đã có; candidate v2.5 chưa được xác minh/mở retest, thiếu shirt base approved và clearance còn 1.295 intersections/34.745 inside samples. Browser Chrome Crewly disconnected; final viewer QA chưa chạy.

---

## 2026-11-15

### [qa/atelierx-qa-0004] 05:17:31
Task blocked: ATEL-25 vẫn chờ final handoff theo showcase-basic-v1. Đã đọc PLAN_SHOWCASE_BASIC.md và atelierx-qa-v7. v3.1 hiện chỉ có fit candidate; chưa có final assembly/viewer/content cùng revision và đủ browser evidence. Khi nhận final, QA sẽ xem 4 ảnh và content theo v7; không áp lại G1/clearance-zero cũ.

---

## 2026-11-15

### [frontend-developer/atelierx-frontend-developer-0006] 05:20:15
Task blocked: ATEL-23/v4 draft đã ghép, có content ngắn/số đo nguồn, manifest/hash và QA browser 4 góc + mobile. what_tried: dùng showcase-basic.mjs tạo đúng một draft từ v3.1, kiểm ảnh front/back/side/oblique/mobile và browser rotation/zoom; errors rỗng. what_failed: kiểm thị giác phát hiện thiếu họa tiết/khuy, cổ/tay áo chưa rõ sơ mi và bàn tay mannequin lộ qua tay áo. what_needed: Lead điều phối lượt Designer correction tập trung, handoff revision/hash mới; sau đó Visual tạo final và QA nhận evidence cùng revision. partial_result: viewer ATEL-23/v4 nội bộ hoạt động, captures ở quality/evidence/ATEL-23/v4/draft, content/manifest ở showcase/products/ATEL-23/v4; catalog unchanged. Đã báo thread ATEL-23 messageId de95fe3b-6a45-49b2-af6e-d5b607602166 và DM Lead. Không tạo final hoặc đánh dấu hoàn tất trước correction/QA.

---

## 2026-11-15

### [qa/atelierx-qa-0004] 05:29:27
Task blocked: QA v4.1 đã hoàn tất và ghi TRẢ LẠI cho tối đa một correction theo showcase-basic-v1. Hash/provenance, content field/source và browser interaction đạt; còn 3 lỗi nhìn thấy: coverage tay thiếu, màu trắng + thiếu artwork, khuy/nếp gấp lệch mặt. Phiếu quality/reports/ATEL-23/v4.1.json. WorkItem chờ correction để retest đúng phần sửa.

---

## 2026-11-15

### [frontend-developer/atelierx-frontend-developer-0006] 05:30:25
Task blocked: ATEL-23/v4.1 final đã tồn tại và được kiểm hash/captures; stage final không chạy lại. what_tried: đối chiếu showcase-builds ledger, assembly.json, Designer fit.json, content và SHA; kiểm 4 ảnh browser + mobile; browser-qa --basic xác nhận loaded/rotate/zoom/mobile, errors rỗng; cập nhật content trung thực và tạo manifest. what_failed: visual gate của Lead chưa đạt — pattern chưa áp; áo hiện trắng; cánh tay mannequin lộ; khuy/nếp gấp lệch khỏi bề mặt. what_needed: Lead quyết định sau khi correction duy nhất đã dùng; chưa chuyển QA do điều kiện pattern/buttons/collar/coverage chưa đạt. partial_result: final display SHA 661160106217cf94ca7750e54ca44044746255f24a0a33c939e9d3483282ffa6 khớp ledger/assembly; content + manifest v4.1 và 5 captures đã lưu. Catalog nguyên trạng. Team thread messageId ac5704ff-e8d7-4e64-9043-f5c6dee749fb.

---

## 2026-11-15

### [tpm/atelierx-tpm-0002] 05:31:43
Task blocked: ATEL-23/v4.2: chờ geometry và measurements final theo yêu cầu Lead. Workspace hiện chỉ có final v4.1; chưa sửa content để tránh cập nhật sai revision.

---

## 2026-11-15

### [qa/atelierx-qa-0004] 05:33:05
Task blocked: Phiếu QA v4.1 đã hoàn tất: TRẢ LẠI cho một correction theo showcase-basic-v1. Đã ghi ba lỗi nhìn thấy và xác minh hashes/current captures; report quality/reports/ATEL-23/v4.1.json. Theo Lead, ATEL-25 giữ blocked tới Visual handoff final v4.2; chưa retest hoặc publish.

---

## 2026-11-15

### [frontend-developer/atelierx-frontend-developer-0006] 05:38:24
Task blocked: ATEL-26 đang chờ handoff Designer v4.2 hoàn chỉnh. what_tried: kiểm tra v4.2 GLB/read-only preflight; TEXCOORD_0/material slot 0 có, UV bounds [0,0]-[1,1], button primitive riêng; kiểm trạng thái thư mục/fit/captures. what_failed: chưa có fit/provenance/capture map; asset.extras của GLB còn ghi revision v2.5/derivedFrom v2.4. what_needed: Designer cập nhật metadata/manifest đủ source + texture/artwork SHA và capture mapping đúng v4.2. partial_result: GLB v4.2 SHA e1f501f950b8f9c916f8b4a6b0c4c9e1af87d78852101aa114fc81243d699ca7 đã được preflight, finding ghi vào ticket ATEL-26; chưa chạy correction; v4/v4.1 giữ nguyên.

---

## 2026-11-15

### [frontend-developer/atelierx-frontend-developer-0006] 05:50:05
Task blocked: ATEL-23/v4.2 Visual bundle đã được kiểm, manifest tạo và handoff cho QA ATEL-25 trên WorkItem hiện có; chờ verdict độc lập theo chỉ đạo Lead. what_tried: xác minh ledger correction v4.2, GLB/fit/provenance/material/artwork hashes, assembly/measurements/content SHA, 5 browser capture SHA; browser loaded/rotate/zoom/desktop/mobile true, errors rỗng; review side/oblique. what_failed: chưa có kết quả QA; captures có mảng trắng nghi mannequin lộ ở vai/nách và khuy subtle, đã nêu để QA kiểm độc lập. what_needed: QA ATEL-25 verdict/return. partial_result: manifest showcase/products/ATEL-23/v4.2/asset-manifest.json; channel handoff messageId 55945260-a9fc-4f3a-ba89-95899dcfd6b5; catalog unchanged, no pass/publish, no rebuild.

---

## 2026-11-15

### [qa/atelierx-qa-0004] 05:56:28
Task blocked: QA v4.2 đã ghi verdict TRẢ LẠI tại quality/reports/ATEL-23/v4.2.json (SHA-256 1484bf72c9e694d56f5619aed1a205c54adaea7e81d7a4b9c10cccf1cffaabd1). Màu/artwork, content, browser đạt; còn mannequin lộ ở vai/nách và hàng khuy không đọc rõ cả front/cận. Theo Lead, giữ chính WorkItem ATEL-25 blocked chờ disposition; v4.2 là correction stage đã dùng, không mở task/revision khác.

---

## 2026-11-15

### [team-leader/atelierx-team-leader-0001] 05:57:28
Task blocked: [TL_REPORT] ATEL-23 showcase-basic-v1 v4.2 QA verdict: return-after-correction. Màu/pattern/content/measurement/hash/browser pass; lỗi nhìn thấy vẫn còn: mannequin lộ vai/nách ở side/oblique dù maskCoveredBody bật, và hàng khuy không đọc rõ. Report quality/reports/ATEL-23/v4.2.json SHA 1484bf72c9e694d56f5619aed1a205c54adaea7e81d7a4b9c10cccf1cffaabd1. Correction stage đã dùng; không mở revision mới, không publish, catalog vẫn preview. ATEL-23 WorkItem hiện BLOCKED, không done.

---

## 2026-11-15

### [qa/atelierx-qa-0004] 06:06:26
Task blocked: Đã đọc lại PLAN_SHOWCASE_BASIC.md và atelierx-qa-v7. ATEL-34 đang chạy repair v4.3; hiện chưa có final viewer/content/captures v4.3. ATEL-25 giữ blocked chờ Visual handoff đồng revision; khi có sẽ QA đúng hai lỗi v4.2, không mở task/retry mới.

---

## 2026-11-15

### [team-leader/atelierx-team-leader-0001] 06:57:20
[[Wiki cleanup]] Maintenance may exceed the 1-minute median when candidates include duplicate event-log pages and a low-confidence technical note that needs cross-checking; allow a few minutes to inspect candidates and verify archive evidence.

---

## 2026-11-15

### [frontend-developer/atelierx-frontend-developer-0006] 08:22:02
Task blocked: Đã hoàn tất session recovery và đăng ký active. Không có WorkItem đang hoạt động; quality/studio-control.json xác nhận ATEL-23 bị dừng và project yêu cầu chờ owner brief mới. Không có hành động frontend được phép cho đến khi Lead phân công đơn mới.

---

## 2026-11-15

### [designer/atelierx-designer-0003] 08:51:23
Task blocked: Đã thẩm định nguồn MakeHuman T-shirt khác hai GLB trước, tạo bản xám v0.3 để xem thật và ghi đủ provenance/hash cùng bốn ảnh desktop. Viewer loaded/rotated/zoomed/desktop đều đạt, nhưng ảnh xám cho thấy cổ chỉ là mép cắt mỏng, thiếu dải bo liên tục; bề mặt thân/lưng không có nếp vải đọc được. Theo chỉ đạo Lead, dừng ở đây, không vá thêm cổ/nếp hoặc tạo retry.

---

## 2026-11-15

### [team-leader/atelierx-team-leader-0001] 10:02:25
Task blocked: [TL_REPORT] ATEL-35/v1 đủ hồ sơ bàn giao: catalog complete, QA report decision=pass, nội dung/spec và bốn ảnh desktop đã đối chiếu. Chưa gửi chat hoặc chuyển TKT-007 sang To review vì prompt yêu cầu owner approval qua harness [CHAT]/decision trước khi thay mặt owner đăng, trả lời hoặc chấp nhận. Ask-owner D-8 tạo được nhưng Slack không kết nối nên posted=false; quyết định chưa tới owner. Không tạo Verify/task sản xuất.

---

## 2026-11-15

### [team-leader/atelierx-team-leader-0001] 11:11:55
Task blocked: [TL_REPORT] Session recovery hoàn tất. Active Work trong prompt là trống; quality/studio-control.json xác nhận awaitingBrief=true, workflow standalone-v9 và ATEL-23 đã dừng. Đang chờ owner brief đơn mới; không khôi phục/tạo lại ATEL-23 và chưa tự tạo sản phẩm.

---

## 2026-11-15

### [frontend-developer/atelierx-frontend-developer-0006] 11:12:16
Task blocked: Phiên đã đăng ký active và khôi phục ngữ cảnh. Không có WorkItem đang hoạt động; quality/studio-control.json xác nhận awaitingBrief=true, ATEL-23 đã dừng. Chờ brief đơn mới từ owner/Lead; không thực hiện frontend cho đơn cũ.

---

## 2026-11-15

### [backend-developer/atelierx-backend-developer-0005] 11:22:00
Task blocked: Đã chuẩn bị preset PBR cotton-canvas twill giả lập màu be cát và manifest có SHA-256. Chưa tạo surface GLB vì ATEL-41 vẫn ở phase shape, chưa có shape-review pass, geometry artifact hay hash để xác minh; studio-surface hiện cũng yêu cầu artwork và placement mapping nên không thể áp dụng preset cargo trực tiếp khi thiếu các đầu vào đó.

---

## 2026-11-15

### [frontend-developer/atelierx-frontend-developer-0006] 11:22:56
Task blocked: ATEL-41 Visual chưa thể tích hợp: chưa có shape review/pass hoặc surface GLB/material handoff và content.json đã được Research kiểm. studio-flow vẫn ở phase=shape; chỉ có preset material, manifest nêu rõ preset chưa áp dụng. Không tạo viewer/artifact giả lập; cần đầu vào đồng revision trước khi build showcase-basic standalone và browser QA.

---

## 2026-11-15

### [qa/atelierx-qa-0004] 11:25:46
Task blocked: ATEL-41 order is valid and currently at shape phase; QA WorkItem remains queued. I sent Team Leader the required acceptance summary and requested confirmation that my understanding is correct. Prompt protocol forbids starting before that confirmation; no shape handoff has been QA-reviewed yet. Waiting for TL confirmation and shape handoff.

---

## 2026-11-15

### [backend-developer/atelierx-backend-developer-0005] 11:27:22
Task blocked: Đã claim WorkItem, tạo preset PBR cotton-canvas twill màu be cát và manifest SHA-256. Chưa tạo surface GLB vì ATEL-41 vẫn ở phase shape, chưa có shape-review pass hoặc garment GLB/hash. studio-surface hiện yêu cầu artwork và placementProfile mapping; đầu vào này chưa có trong brief cargo và cần được căn chỉnh khi có shape handoff.

---

## 2026-11-15

### [qa/atelierx-qa-0004] 12:08:08
Task blocked: Shape QA ATEL-41/v3 passed after independent retest; shape-review handoff is recorded and studio-flow.shapeApproved=true. Hold this WorkItem until Visual final is handed off for final QA.

---

## 2026-11-15

### [frontend-developer/atelierx-frontend-developer-0006] 12:14:40
Task blocked: Surface ATEL-41/v3 đã kiểm tra: manifest và 16 hash artifact khớp; shape review v3 pass; đo mesh display 54.6 × 110.5 × 25.7 cm. Viewer chưa thể tích hợp vì thiếu content.json final đã Research kiểm ở revision v3; hiện chỉ có content draft v1. Đã gửi số đo/hash cho Research và block cùng WorkItem với studio-wait: content final v3.

---

## 2026-11-15

### [qa/atelierx-qa-0004] 12:32:06
Task blocked: QA final ATEL-41/v3 returned for one focused blocker: standalone content is missing credits. Report and qa-final handoff with independent browser captures are on disk; awaiting Visual revision/hash for retest.

---

## 2026-11-15

### [frontend-developer/atelierx-frontend-developer-0006] 15:03:23
Task blocked: ATEL-47 chưa sẵn sàng cho tích hợp Visual: studio-flow đang ở phase=shape với events rỗng; chưa có shape-review, surface GLB hoặc content final handoff đồng revision. Đã claim WorkItem; chờ đủ hai artifact được nêu trong brief trước khi build viewer và QA browser.

---

## 2026-11-15

### [qa/atelierx-qa-0004] 15:05:24
Task blocked: Đã claim WorkItem QA ATEL-47 và đăng NHẬN VIỆC trong thread. Chưa thể review shape vì đơn vẫn ở phase shape và không có shape manifest v1/GLB/hash/provenance/ảnh; đã ghi studio-wait: shape, báo Lead rằng task Designer chưa được bind.

---

## 2026-11-15

### [designer/atelierx-designer-0003] 15:07:42
Task blocked: ATEL-47 Designer đã nhận và phạm vi được Lead xác nhận. Đang chờ Research shortlist/provenance theo studio-wait: research; chưa chọn geometry hay tạo artifact. Shortlist/provenance là đầu vào bắt buộc để đánh giá phom shirt và hoàn thành handoff.

---

## 2026-11-15

### [frontend-developer/atelierx-frontend-developer-0006] 15:09:17
Task blocked: ATEL-47 Visual đang chờ đúng dependency theo Lead: studio-wait: surface + content. Giữ nguyên WorkItem ATEL-51; chưa tạo viewer/artifact trước khi hai handoff có cùng revision.

---

## 2026-11-15

### [qa/atelierx-qa-0004] 15:34:24
Task blocked: QA shape ATEL-47/v1 đã kết luận TRẢ LẠI sau kiểm hash/provenance và bốn ảnh render: ba blocker là khe/miếng nhô ở vai sau, cổ chưa liền, thiếu nếp vải tự nhiên. Phiếu và handoff đã ghi; Designer xác nhận sẽ sửa. Giữ cùng WorkItem QA ở trạng thái chờ shape revision mới; chưa pass shape hay final QA.

---

## 2026-11-15

### [designer/atelierx-designer-0003] 15:49:39
Task blocked: Đã tạo và handoff geometry standalone v2 với manifest/hash, UV/placement notes, bốn ảnh gray và browser evidence; nhưng tự kiểm ảnh vẫn thấy vết tối ở vai sau, collar chưa liền mạch rõ và folds còn nhẹ. Không claim shape pass; đã yêu cầu QA retest cùng WorkItem hiện hữu và báo Lead. Giữ Material chờ verdict QA.

---

## 2026-11-15

### [qa/atelierx-qa-0004] 15:52:42
Task blocked: ATEL-47/v2 shape retest: verified all 11 manifest hashes and inspected front/back/side/oblique captures. Folds are now acceptable, but shoulder gaps and collar construction remain blocking. Recorded independent retest and flow handoff as return; escalated to Lead because the agreed sole correction has been used. QA final is not complete and Material remains held.

---

## 2026-11-15

### [qa/atelierx-qa-0004] 16:07:19
Task blocked: QA focused retest cuối ATEL-47/v3 đã trả lại: hash/provenance/browser evidence đạt; SHAPE-03 giữ pass; SHAPE-01 shoulder notch/gap và SHAPE-02 collar construction vẫn fail. Report/handoff ghi decision=return, Lead được báo để chốt replan/owner update. Đã dừng geometry theo giới hạn; không chuyển Material. QA WorkItem còn mở vì chưa có shape pass/final QA.

---

## 2026-11-15

### [qa/atelierx-qa-0004] 16:31:21
Task blocked: QA shape ATEL-47/v4 passed after independently verifying 11 artifact hashes, standalone provenance, GLB structure, and front/back/side/oblique captures. VA/armhole and collar/neckline topology now read continuously; folds remain acceptable; no mannequin. Shape review is handed to Material. This QA WorkItem remains open on studio-wait: visual until final viewer QA passes.

---

## 2026-11-15

### [team-leader/atelierx-team-leader-0001] 17:23:49
Task blocked: Đã khôi phục và đăng ký phiên Lead. Brief đang hiển thị: TKT-009 / request 445ea941… ở waiting_confirmation; đây chưa phải brief mới được owner xác nhận. ATEL-47 cũ thuộc request UUID 7580966e… đã bị owner từ chối hình dáng; showcase hiện để preview, studio-control.awaitingBrief=true. Theo quy tắc project, không resume/recreate ATEL-47; chờ brief mới rồi tạo order ID mới.

---

## 2026-11-15

### [qa/atelierx-qa-0004] 17:33:53
Task blocked: Đã claim WorkItem, đọc chuẩn QA v9 và hồ sơ ATEL-53/ATEL-58, đăng NHẬN VIỆC vào thread ATEL-53 và lưu messageId. Chưa thể bắt đầu review vì Designer chưa handoff revision gray; giữ cùng WorkItem tại studio-wait: shape.

---

## 2026-11-15

### [qa/atelierx-qa-0004] 17:38:35
Task blocked: QA ATEL-53 chưa thể bắt đầu shape review: studio-flow vẫn phase=shape, không có revision gray/captures và Designer chưa được bind ticket/WorkItem. Đã kiểm task contract, TKT-009, studio-control, flow state và artifact directory; giữ WorkItem QA duy nhất ở studio-wait: shape, đã gửi Alignment Request cho Lead xin điều phối Designer hoặc replan/ETA.

---

## 2026-11-15

### [qa/atelierx-qa-0004] 17:39:04
[[ATEL-53]] QA must wait for an actual gray handoff. Studio Lead replanned at 17:38 UTC: prior two sources rejected; a 15-minute preparation round will find at most two standalone shirt GLBs with collar stand/lapel, placket, cuffs, and open openings. Designer assignment and handoff follow source selection. Keep the single QA WorkItem at studio-wait: shape, hold Material until shape pass, and do not use rejected ATEL-47/v4 as evidence.

---

## 2026-11-15

### [qa/atelierx-qa-0004] 17:39:04
Task blocked: Giữ WorkItem QA duy nhất chờ studio-wait: shape trong lúc Lead thực hiện replan 15 phút tìm tối đa hai GLB sơ mi độc lập; Designer sẽ được bind sau khi chọn nguồn. Chưa có revision gray để QA; không dùng ATEL-47/v4.

---

## 2026-11-15

### [tpm/atelierx-tpm-0002] 18:12:01
Task blocked: ATEL-61 đã kiểm đúng hai nguồn mới; không có GLB phù hợp. Manifest gồm provenance và gallery evidence, hash sẽ xác nhận trước handoff; cần owner cấp file/URL có license rõ. ETA 15 phút sau khi nhận asset.

---

## 2026-11-15

### [tpm/atelierx-tpm-0002] 18:13:52
Task blocked: ATEL-61 round 4 hoàn tất: hai nguồn loại, manifest 13/13 hash hợp lệ, handoff trên ATEL-53. WorkItem BLOCKED chờ owner cấp GLB/URL hợp lệ; ETA 15 phút sau khi nhận. Ticket giữ ready + owner hold do API không hỗ trợ blocked.

---

## 2026-11-15

### [team-leader/atelierx-team-leader-0001] 18:20:11
Task blocked: [TL_REPORT] ATEL-61 round 4 independently reviewed: 13/13 hashes pass, no suitable licensed downloadable GLB; ATEL-53 remains preparation, QA studio-wait: shape, no Designer/Material/Visual handoff. Corrected premature parent ticket closure: ATEL-53 reopened and assigned to new Lead WorkItem 051ab175-6f92-42b2-9b39-c912582fd424; studio-flow lead binding updated and round 4 blocker recorded. Opened owner decision D-9 (provide permitted shirt GLB/direct URL or hold), but ticket service returned posted=false, postError=Slack is not connected. Please route/restore delivery of D-9 to owner; no product completion or publish. Request remains blocked pending owner asset.

---

## 2026-11-15

### [tpm/atelierx-tpm-0002] 18:28:44
[[ATEL-61 round 4 blocker]] ATEL-61 preparation round 4 ended after exactly two sources; no permitted shirt base was suitable. WorkItem f4daad5f-8d11-4803-b0a8-b9242d1e85ed is BLOCKED; ticket is ready with owner hold for an explicitly licensed standalone shirt GLB/direct URL, ETA 15 minutes after receipt. Handoff 316f511c-c51a-43f0-8bc8-cc45df27a70f; no shape handoff, ATEL-47/v4 excluded.

---

## 2026-11-15

### [qa/atelierx-qa-0004] 19:11:10
Task blocked: Đã review độc lập ATEL-53/v1.1-gray và ghi TRẢ LẠI. 14/14 hash manifest khớp; GLB là glTF 2 có độ dài hợp lệ; đã xem sáu góc, ba ảnh cận và so với ATEL-35/v1. Blocker: drape/đường nối vai-nách, cấu tạo cổ, thiếu khuy để xác minh điểm bám. Handoff shape-review đã ghi decision=return, correctionOwner=designer; chờ correction trong cùng đơn/WorkItem. Material chưa được chuyển.

---

## 2026-11-15

### [qa/atelierx-qa-0004] 19:32:41
Task blocked: studio-wait: shape — QA retest ATEL-53/v1.4-gray đã kết thúc với verdict TRẢ LẠI. Đã xác minh 16/16 hash và xem đủ sáu góc/ba cận. Ba blocker: khe/nối vai-armhole; cổ chưa có chân/lá gập tự nhiên; drape thân/tay thấp hơn ATEL-35/v1. Giữ Material; chờ Lead release cùng WorkItem khi có correction candidate.

---

## 2026-11-15

### [backend-developer/atelierx-backend-developer-0005] 19:41:02
Task blocked: ATEL-56 Material đang chờ shape pass; flow hiện shapeApproved=false và v1.4-gray bị QA trả lại.

---

## 2026-11-15

### [qa/atelierx-qa-0004] 20:23:03
Task blocked: studio-wait: shape — QA độc lập alternate-cc0-shirt-v0 kết luận TRẢ LẠI. Đã xác minh 15/15 artifact hash và byte count, source/candidate BIN khớp, một mesh Cloth_shirt, không có body/mannequin mesh; đã xem sáu góc/ba cận và so ATEL-35/v1. Cửa cổ/thân/tay mở, nhưng silhouette/drape, collar construction và placket/button/cuff geometry không đạt. Shape-review handoff return đã ghi; giữ Material/Visual hold, chờ candidate shape mới trên cùng WorkItem.

---

## 2026-11-15

### [qa/atelierx-qa-0004] 20:41:30
Task blocked: TRẢ LẠI shape ATEL-53 alternate-cc0-shirt-v1.1-gray trên GLB SHA-256 d2b5c13c29d605f1bb6eec6b9ac8c6fb1d3c8e30758f51fa6062a4d5fef59158. Report và shape-review handoff đã ghi; giữ cùng QA WorkItem chờ Designer correction.

---

## 2026-11-15

### [designer/atelierx-designer-0003] 21:22:57
Task blocked: Một correction Blender đã được thử và tự kiểm thất bại; Lead yêu cầu dừng topology này nếu không đạt. Candidate v2 và manifest/evidence đầy đủ đã lưu bất biến, 16/16 hash khớp, nhưng không QA-ready. Cùng ATEL-62 được block chờ Lead chọn tool/route khác; QA WorkItem hiện hữu vẫn studio-wait: shape, Material hold.

---

## 2026-11-15

### [designer/atelierx-designer-0003] 21:31:50
Task blocked: Blender proxy-collision route candidate failed shape self-review; garment collapsed, collar/armhole/drape unusable. Candidate snapshot/manifest/evidence preserved with 16/16 verified hashes and no proxy in GLB. Lead notified; same ATEL-62 blocked awaiting genuinely different tool/source decision. QA WorkItem remains blocked and Material hold.

---

## 2026-11-15

### [designer/atelierx-designer-0003] 21:49:30
Task blocked: OpenSew2 candidate failed shape self-review. Static snapshot, 6+3 captures and manifest preserved; 26/26 hashes verified; GLB excludes fitting avatar. Per Lead instruction stopped route with no patch/QA handoff. Same ATEL-62 blocked awaiting Lead decision; QA WorkItem and Material remain held.

---

## 2026-11-15

### [team-leader/atelierx-team-leader-0001] 23:32:27
Task blocked: [TL_REPORT] ATEL-62 remains blocked on a resource issue: current host is Debian 12, no licensed Marvelous Designer runtime or supported Linux environment is provisioned. Handle-failure returned escalate (resource_error). I confirmed the existing Lead checkpoint: keep all failed candidates/evidence unchanged; QA, Material, and Visual stay on hold; resume the same ATEL-62 only once licensed compatible environment is available or a new owner instruction arrives. Designer was informed; no retry or new task created.

---

## 2026-11-16

### [qa/atelierx-qa-0004] 02:40:09
Task blocked: TRẢ LẠI shape owner-shirt-v1.1-gray trên GLB SHA-256 dba1bcc1ae6ff2f1a02bbc557eb17bdfc210b2184c39a67f7d665dec2268be13. Report/handoff ghi thiếu cuff button/attachment; các tiêu chí phom chính còn lại đạt.

---

## 2026-11-16

### [qa/atelierx-qa-0004] 03:05:50
Task blocked: PASS shape owner-shirt-v1.2-gray trên GLB SHA-256 4c9e01ed516f454a96a29fd9f7e7081d659988d1fce536395575cc3b3ce3bc9c. Report/handoff đã ghi; cùng QA WorkItem chờ final Visual QA.

---

## 2026-11-16

### [team-leader/atelierx-team-leader-0001] 05:16:21
Task blocked: [TL_REPORT] ATEL-62 / ATEL-53 vẫn chặn do chưa có nguồn hình học độc lập đủ điều kiện hoặc môi trường Marvelous Designer được cấp phép/tương thích. Hai lần thử trước đã dừng; QA, Material, Visual tiếp tục hold. Giữ nguyên bằng chứng và ứng viên hiện có, không retry. Chỉ tiếp tục cùng ATEL-62 khi môi trường phù hợp sẵn sàng hoặc có chỉ dẫn mới từ owner. Request TKT-009 vẫn waiting_confirmation; đây chưa phải brief mới được owner xác nhận.

---

## 2026-11-16

### [designer/atelierx-designer-0003] 05:19:29
[[ATEL-57 resume ETA]] After account rotation, inspect saved WorkItem notes and artifacts before reusing the original ETA. This task already had a complete viewer and independent QA pass; exact hash verification and closeout took 1 minute, so the inherited 15-minute build ETA was stale.

---

## 2026-11-16

### [tpm/atelierx-tpm-0002] 06:06:43
[[AtelierX Research ETA]] A narrowly scoped research handoff requiring only a vector artwork, placement note, and content placeholders took 2 minutes versus the 6-minute median for broader research. Estimate 2–3 minutes for similarly bounded artifact assembly; retain the general research median for broader source research.

---

## 2026-11-16

### [designer/atelierx-designer-0003] 06:12:43
[[ATEL-63 sweater candidate ETA]] A user-supplied GLB that appears straightforward still took 9 minutes for source inspection, texture/label removal, UV chest localization, exact binary-preservation checks and six browser captures. My 5-minute estimate omitted atlas/UV work and full six-view capture; reserve about 10 minutes for a preserved-geometry candidate needing evidence and UV handoff.

---

## 2026-11-16

### [backend-developer/atelierx-backend-developer-0005] 06:34:28
[[studio-surface.mjs]] Khi input SVG là cả UV atlas, placementProfile.placement phải phủ toàn atlas (center 0.5/0.5, size 1/1); lưu vị trí/kích thước motif ngực riêng cho atlas generator. Dùng placement nhỏ của motif trực tiếp sẽ thu toàn atlas vào vùng nhỏ trên áo.

---

## 2026-11-16

### [frontend-developer/atelierx-frontend-developer-0006] 06:43:34
[[AtelierX showcase displayScale]] ATEL-63 user-supplied sweater source preserves its BIN bytes but has world-space extents above 3m, so showcase-basic standalone validation fails without display normalization. Keep supplied GLB/material/artwork unchanged; apply a documented displayScale only in viewer and measurements. Verify browser captures on the current Crewly URL and include at least four sourced geometry display references in content.

---

## 2026-11-16

### [backend-developer/atelierx-backend-developer-0005] 06:59:53
[[Single-mesh neckline trim masks]] For a unified garment shell, derive neckline boundary edges from indexed triangle incidence count=1, measure mesh-vertex distance to those 3D edge segments, then clip triangle polygons by the interpolated distance before projecting through unchanged TEXCOORD_0. A broad y/x half-plane created a flat shoulder yoke; the narrow boundary-distance mask followed the open collar contour and removed QA blocker F-01.

---

