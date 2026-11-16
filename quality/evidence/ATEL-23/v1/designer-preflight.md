# QA preflight trạng thái Designer — ATEL-23/v1

- Artifact hiện có: `orders/ATEL-23/v1/designer/garment-v1.glb`.
- SHA-256 quan sát lúc preflight: `a8b106e15d8719766a4544afc88a2467c4bf9649bbce05f00006bc77e08c491a`.
- Tệp `orders/ATEL-23/v1/designer/fit.json` chưa có.
- Tệp preview ghép áo/mannequin `orders/ATEL-23/v1/fit-evidence/garment-on-mannequin-v1.glb` chưa có.
- Mannequin chuẩn có SHA-256 khớp profile: `da6d3e8ddf25e31a0b20242852a1f9757661fa8115fde0d0800ff5cc715355e9`.

Chưa thể đưa nhận định fit/cổ/vai/nách/tay/cổ tay/thân/gấu hoặc giao cắt từ file danh tính đơn lẻ. Cần Designer bàn giao fit.json gắn đúng garment SHA cùng ảnh/browser preview trên mannequin-v1 hoặc báo thời điểm preview sẵn; QA sẽ kiểm độc lập ngay sau đó. Đây là ghi nhận phụ thuộc, không phải verdict garment.
