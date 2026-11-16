---
id: ATEL-10
title: Tìm nguồn phom hoodie sạch, có quyền sử dụng
status: done
priority: P1
assignee: atelierx-frontend-developer-0006
team: af30c001-2789-4f20-b917-000000000010
labels: [ atelierx, ATEL-9, research, base-mesh ]
ownerReview: false
createdAt: 2026-11-14T04:52:58.755Z
updatedAt: 2026-11-14T15:13:27.829Z
workItemId: 6e472cdb-3527-4069-9150-833b8ce7675b
requestId: ae95d304-4335-4726-b9ed-629d1894c32f
source: request:TKT-003
---

## Description

Goal: tìm 2–3 ứng viên hoodie 3D có nguồn và điều kiện sử dụng rõ; ưu tiên phom không có hanger/giá đỡ dính liền và vùng lưng dùng được. Expected Outcome: mỗi ứng viên có URL nguồn, bằng chứng license gốc, ảnh browser thật thể hiện mặt lưng (hoặc góc xoay tương ứng), nhận xét hình học/rủi ro; ghi file/hash chỉ khi tải và xác minh được. Giữ candidate, không duyệt status, không sửa GLB/catalog/base-mesh registry. Eval Criteria: ít nhất hai ứng viên hoặc báo rõ không đủ; mọi license claim gắn với nguồn gốc; không dùng HEAD như bằng chứng nội dung. Re-scope attempt 3: chuyển chủ xử lý sang Visual Studio để dùng browser/asset access; dùng browser bình thường hoặc tìm nguồn thay thế có thể mở, không lặp lại chỉ web search/HEAD. Nếu nguồn trả 403, không bypass; thử nguồn khác truy cập được hoặc ghi blocker cụ thể và bàn giao bước tiếp theo.

## Acceptance criteria

- [ ] Bàn giao ít nhất hai ứng viên hoặc báo rõ không tìm được; mỗi ứng viên có URL nguồn, quyền sử dụng, hình ảnh/góc thể hiện vùng lưng và rủi ro.

## Log

- 2026-11-14T04:52:58.755Z · atelierx-team-leader-0001 · created (ready)
- 2026-11-14T04:53:24.995Z · atelierx-team-leader-0001 · assigned to atelierx-tpm-0002 — WorkItem b8205063-7496-4ade-83b7-1941d053e7f8
- 2026-11-14T09:46:11.465Z · atelierx-tpm-0002 · NHẬN VIỆC channel messageId sẽ được ghi ngay sau khi post; WorkItem server hiện failed sau restart nhưng ticket vẫn in_progress, đang tiếp tục kiểm chứng nguồn/licensing theo brief.
- 2026-11-14T09:47:24.269Z · atelierx-tpm-0002 · BÀN GIAO nghiên cứu nguồn hoodie — revision ATEL-10/research-01. Ứng viên ưu tiên: (1) BlendSwap “Basic Hoodie” by acstrider — https://blendswap.com/blend/21443 ; trang ghi CC0, tải .blend Blender 2.7x/Cycles 3.4 MB; mô tả người tạo tự dựng pattern khi học Marvelous Designer và nói dùng tùy ý; có 2 ảnh preview ở trang. Rủi ro: trang bị 403 trong lần mở này nên chưa tải file/hash; preview chưa xác nhận có mesh thân người hay góc sau, cần Designer mở .blend, kiểm tách mesh/UV/vùng lưng và export thử. (2) Sketchfab “Hoodie” by Virtual Pandora — https://sketchfab.com/3d-models/hoodie-97611a53e3b846f69e0655b210f72b2f ; trang tìm kiếm chính chủ nêu downloadable, CC Attribution (CC BY), 240.3k triangles; hoodie CLO3D, túi kangaroo và bo thun, người tạo nói file CLO3D/DXF có thể yêu cầu. License: https://creativecommons.org/licenses/by/4.0/ ; cần giữ ghi công tác giả + nguồn + license, ghi sửa đổi nếu có. Trang có 3D model viewer để xoay kiểm mặt lưng; chưa tải GLB/hash, cần Designer đánh giá UV và dung lượng mesh. Ứng viên dự phòng nhưng không ưu tiên: 3DAssets.dev Snowboard hoodie on hanger — https://3dassets.dev/assets/snowboard-gear-and-freestyle-riders-hoodie-on-hanger-a770c75b ; trang ghi CC0 1.0, GLB https://cdn.3dassets.dev/assets/27162/v1/model.glb (51KB, 1,020 tris), có viewer xoay. Rủi ro chặn theo yêu cầu: chính trang xác nhận toàn bộ là một static assembly, không có named pivot nodes, gồm hanger; không giả định có thể bỏ hanger riêng. Không đề nghị dùng nếu không tách được hanger mà không hỏng phom. Không có ứng viên nào được duyệt status; tất cả vẫn cần kiểm mesh/UV và ảnh browser độc lập.
- 2026-11-14T09:47:35.603Z · atelierx-tpm-0002 · NHẬN VIỆC channel messageId: 3d4d31d6-3812-4d14-b3d6-7f6c97e869d5 (ATEL-10:research:tpm:ack).
- 2026-11-14T10:53:31.954Z · crewly · work continues in WorkItem b8205063-7496-4ade-83b7-1941d053e7f8:retry:2
- 2026-11-14T11:00:39.021Z · atelierx-tpm-0002 · ATEL-10/research-02: lưu snapshot trang nguồn và thumbnail gốc cho BlendSwap Basic Hoodie (CC0) và Sketchfab Virtual Pandora Hoodie (CC BY 4.0) tại quality/evidence/ATEL-10/research-02/. Cả hai ảnh hiện chỉ thấy góc trước; chưa có browser capture mặt lưng, mesh/hash, UV/topology. Mesh chưa tải/kiểm; giữ candidate. Browser Chrome không kết nối, direct GET trang 200 bằng curl; mở trang từ web search bị 403.
- 2026-11-14T11:00:57.188Z · atelierx-tpm-0002 · BÀN GIAO channel ATEL-9 thread ae70a6a0-f4e1-403b-92e5-00462ea20ae5; messageId 531f2464-4812-4005-9fbf-7c1766d71da0. Evidence bundle quality/evidence/ATEL-10/research-02/README.md và 2 thumbnail. Hai nguồn/license đã xác minh; thiếu ảnh mặt lưng/browser, mesh/hash và kiểm UV/topology. Tiếp theo Designer/QA mở viewer/file và lưu bằng chứng; giữ candidate.
- 2026-11-14T14:38:53.594Z · atelierx-tpm-0002 · ATEL-10/research-03: đối chiếu lại hai nguồn; BlendSwap metadata CC0 và Sketchfab CC BY 4.0/240.3k tris có source URL. Lượt này web.open trả 403; preview lưu hiện chỉ góc trước, không có browser capture/góc lưng, chưa tải/hash/kiểm mesh. README cập nhật giới hạn/rủi ro và bước tiếp theo. Bàn giao channel ATEL-9 thread ae70a6a0-f4e1-403b-92e5-00462ea20ae5 messageId f113ed9f-8c2d-431e-81c9-4ec426db5288. Candidate giữ nguyên; acceptance vùng lưng chưa đạt.
- 2026-11-14T14:47:58.884Z · atelierx-team-leader-0001 · updated description — Lead blocked-review: attempt 2 không đáp ứng ảnh lưng/mesh dù evidence license + thumbnails đã có. Đổi phương án và owner sang Visual Studio đang idle vì có kinh nghiệm browser Chromium/viewer; giữ mọi candidate, không tự approve. Release retry-2 ticket, giao một WorkItem mới sau khi description được re-scope.
- 2026-11-14T14:47:59.089Z · atelierx-team-leader-0001 · in_progress → ready — Retry 2/3 blocked on 403/no rear capture. Re-scoped to Visual Studio + browser/asset access; do not repeat HEAD-only or bypass 403.
- 2026-11-14T14:47:59.321Z · atelierx-team-leader-0001 · assigned to atelierx-frontend-developer-0006 — WorkItem 6e472cdb-3527-4069-9150-833b8ce7675b
- 2026-11-14T14:48:21.590Z · atelierx-team-leader-0001 · 14:48Z · Lead blocked-review decision: retry 2/3 evidence still incomplete for acceptance; no rear browser capture, mesh/hash or geometry/UV assessment. Kept both sources as candidates and recorded current license/source URLs + risk. Re-scoped attempt 3 to Visual Studio (atelierx-frontend-developer-0006) with alternate browser/asset access; do not retry HEAD-only or bypass 403; find accessible source or report concrete blocker. Old retry claim was blocked/released before new assignment. Current ticket in_progress with WorkItem 6e472cdb-3527-4069-9150-833b8ce7675b running. No catalog/base-mesh changes; QA/Lead approval remains separate.
- 2026-11-14T14:57:53.960Z · atelierx-frontend-developer-0006 · ATEL-10/research-04: đã dùng Chromium/Playwright trong browser thật. Hai trang 3DAssets CC0 mở được và viewer xoay cho thấy mặt lưng; cả hai asset hoodie đều là static assembly có hanger gắn cứng/không named pivot, nên chưa đạt phom sạch. BlendSwap Basic Hoodie CC0 mở được nhưng gallery chỉ thấy front + wireframe, chưa xác minh back/mesh riêng. Sketchfab Virtual Pandora CC BY 4.0 mở được trang license nhưng viewer báo lỗi; chưa có rear. Evidence + kết luận: quality/evidence/ATEL-10/research-04/README.md; captures cùng thư mục. Không tải/hash mesh, không sửa GLB/catalog/registry. NHẬN VIỆC channel messageId bf8fdbd7-fa7a-4dd0-8dbb-2080db585b98.
- 2026-11-14T15:00:08.585Z · atelierx-frontend-developer-0006 · ATEL-10/research-04 frontend handoff: Chromium/Playwright browser thật đã chụp front/back cho 2 asset 3DAssets CC0: Snowboard Gear hoodie on hanger và Clothing Rail/Wardrobe hoodie on hanger. Viewer xoay được, thấy mặt lưng; cả hai là static assembly hanger gắn liền nên chưa đạt phom sạch, chưa tải/hash/kiểm UV/topology. BlendSwap gallery chỉ front+wireframe; Sketchfab viewer lỗi, không có back. Evidence quality/evidence/ATEL-10/research-04/README.md và captures. Bàn giao thread ATEL-9 ae70a6a0-f4e1-403b-92e5-00462ea20ae5 messageId 7f9d3703-b036-49c4-bcf1-2caafaea1dbe. Giữ candidate, không sửa GLB/catalog/registry.
- 2026-11-14T15:13:27.829Z · crewly · WorkItem 6e472cdb-3527-4069-9150-833b8ce7675b verified → done
