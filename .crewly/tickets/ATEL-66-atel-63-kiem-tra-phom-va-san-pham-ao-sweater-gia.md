---
id: ATEL-66
title: ATEL-63 · Kiểm tra phom và sản phẩm · Áo sweater Giáng sinh đỏ rượu vang
status: done
priority: P2
assignee: atelierx-qa-0004
team: af30c001-2789-4f20-b917-000000000010
labels: []
ownerReview: false
createdAt: 2026-11-16T06:02:55.232Z
updatedAt: 2026-11-16T07:31:49.224Z
workItemId: e3413325-8524-4fbf-b759-a248a9395d56
requestId: 7be512c2-6b8f-443c-a9ed-1604cef29f9c
source: agent:atelierx-team-leader-0001
---

## Description

Goal: QA độc lập ATEL-63/v2.1 sau correction metadata displayScale. Expected outcome: kiểm đúng revision v2.1 và ghi report/handoff QA-final với hashes mới; so sánh display GLB byte-identical với v2, xác minh thông số hiển thị sau scale 0.25, content tiếng Việt, sáu góc màu, viewer load/rotate/zoom desktop và không có lỗi. Eval: report chỉ pass khi manifest/evidence hashes khớp và dimensions/content tương ứng v2.1; giữ report QA v2 immutable; nếu có blocker ghi rõ theo evidence. Không publish.

## Acceptance criteria

- [ ] Đối chiếu 14 artifact hashes của orders/ATEL-63/v2.1/visual/visual-manifest.json, browser result và display GLB SHA.
- [ ] Xác minh bốn thông số 34.5/16.1/8.6/16.8 cm được tính theo displayScale 0.25, source/content cùng trỏ v2.1; không phải size may.
- [ ] Xem đủ sáu ảnh màu hiện hành; kiểm neckline fix, artwork, nội dung và viewer load/rotate/zoom desktop.
- [ ] Ghi QA report/handoff QA-final v2.1 và event studio-flow; không chỉnh QA report v2, không publish.

## Log

- 2026-11-16T06:02:55.232Z · atelierx-team-leader-0001 · created (ready)
- 2026-11-16T06:05:09.549Z · atelierx-team-leader-0001 · assigned to atelierx-qa-0004 — WorkItem 5da884a6-bf76-4602-8c44-db13fb2a188b
- 2026-11-16T06:07:17.088Z · atelierx-qa-0004 · QA claimed WorkItem; posted NHẬN VIỆC in ATEL-63 team thread (messageId 7b37c439-ae4d-4fff-ac62-89ac1bfcba8b). Began read-only preliminary review of sweater-owner-supplied-v1; formal decision waits for Designer handoff with exact revision/manifest.
- 2026-11-16T06:16:53.767Z · atelierx-qa-0004 · Independent shape review PASS for sweater-v1-gray (GLB SHA-256 9c7d8b646bcbb72c2a9c10893dd2169b9a0eeee462ee5559ed07e769caca5e0a). Independently verified 13/13 manifest artifact hashes+byte counts, plus source/UV references and identical source/derived BIN chunks; inspected six gray views and compared ATEL-35/v1. Report quality/reports/ATEL-63/sweater-v1-gray.json; shape-review flow event registered. Keeping this WorkItem open for final QA after Material/Visual.
- 2026-11-16T06:17:10.527Z · atelierx-qa-0004 · Posted ĐẠT shape-review in ATEL-63 team thread; messageId 44e0a1e3-0d31-4df7-81b6-6be3da1bb94d. Next dependency: Material surface and Visual viewer; preserve same QA WorkItem for final QA.
- 2026-11-16T06:51:07.498Z · atelierx-qa-0004 · Final QA v1 TRẢ LẠI; QA-final flow handoff recorded with correctionOwner=material. Posted result in ATEL-63 order thread (messageId 26f610f8-e99a-4250-adb8-32c78da67e80). File attachments failed because machine is not signed in to Crewly Cloud; report/evidence remain in shared project paths quality/reports/ATEL-63/v1-final.json and quality/evidence/ATEL-63/v1-final-browser/{front,top}.png.
- 2026-11-16T07:08:24.901Z · atelierx-qa-0004 · Final QA v2 PASS; F-01 from v1 verified corrected in current color six-view browser review. Flow QA-final v2 handoff registered. Posted ĐẠT in ATEL-63 team thread (messageId 3f7d8e0f-cdb6-4df1-8eaa-edbe369ce1e8). Attachments could not transfer: machine lacks Crewly Cloud login; report/screenshots remain in shared workspace.
- 2026-11-16T07:08:39.851Z · crewly · WorkItem 5da884a6-bf76-4602-8c44-db13fb2a188b done → done
- 2026-11-16T07:25:22.140Z · atelierx-team-leader-0001 · done → ready — Visual v2.1 handoff sẵn sàng; QA v2 PASS đã đóng WorkItem trước đó, cần focused independent retest trên artifact v2.1 vì đã sửa content/measurements theo displayScale=0.25. Giữ report v2 nguyên trạng.
- 2026-11-16T07:25:22.481Z · atelierx-team-leader-0001 · updated description, acceptance criteria — Focused retest cùng ticket QA hiện hữu cho visual v2.1; không tạo Verify/Retry hoặc ticket mới.
- 2026-11-16T07:25:22.907Z · atelierx-team-leader-0001 · assigned to atelierx-qa-0004 — WorkItem e3413325-8524-4fbf-b759-a248a9395d56
- 2026-11-16T07:25:32.308Z · atelierx-team-leader-0001 · atelierx-qa-0004 was stopped — starting it for this ticket
- 2026-11-16T07:31:02.992Z · atelierx-qa-0004 · QA độc lập PASS ATEL-63/v2.1. 19/19 manifest + referenced hashes matched; display GLB byte-identical với v2; bốn giá trị display là source×0,25; browser capture mới 6 góc, loaded/rotate/zoom/desktop true, errors rỗng. Report quality/reports/ATEL-63/v2.1-final.json, handoff orders/ATEL-63/v2.1/qa-final-handoff.json; studio-flow qa-final event đã ghi. QA report v2 giữ nguyên; không publish.
- 2026-11-16T07:31:49.224Z · crewly · WorkItem e3413325-8524-4fbf-b759-a248a9395d56 done → done
