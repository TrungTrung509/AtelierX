# ATEL-9 Lead review — 2026-11-14

## Quyết định

Không có candidate nào đủ bằng chứng G1 để chuyển sang `approved`. Giữ mọi mesh ở `candidate`. ATEL-1/v2 tiếp tục `preview`.

## Đối chiếu evidence

- `grab3d-hoodie-clean-v2`: SHA-256 `42dc0075e632eab84256f71d9cc88b6eb6d54d04cbff3682f548f62e55994a13`, nguồn Grab3D, CC0-1.0. Designer review `quality/evidence/ATEL-11/v2/designer-review.md` ghi đủ sáu góc browser và UV checker; còn vệt nhỏ cổ/vai. Dữ liệu POSITION/NORMAL/TEXCOORD_0 được giữ nguyên.
- Chưa có QA độc lập cho chính clean-v2. QA report prototype v1 trả lại vì chưa xác minh topology/đường viền sau lọc, chưa có artwork placement và placement profile gắn đúng revision.
- QA ATEL-1/v2 (`quality/reports/ATEL-1/v2.json`) đạt browser load/rotate/zoom desktop/mobile và đúng artwork lưng/front trơn. Tuy nhiên đó là procedural mesh, silhouette 3/5 và construction 2/5; catalog giữ preview.

## Blocker và bước tiếp theo

- Designer: kiểm tra mép topology vùng cổ/vai và tạo test artwork trên vùng lưng/ngực; ghi material slot, hướng/vùng in và placement profile gắn với SHA-256/revision clean-v2.
- QA: kiểm độc lập đúng revision sau khi Designer bàn giao, xem front/back/two sides/detail/mobile và chấm mesh + placement.
- Lead: đối chiếu nguồn/license, hash, mesh, placement profile và browser captures cùng revision; chỉ đổi sang approved nếu G1 đầy đủ.

Không có thay đổi trạng thái mesh/catalog hoặc publish trong lần rà soát này.
