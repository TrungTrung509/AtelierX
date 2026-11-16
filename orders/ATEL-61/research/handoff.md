# ATEL-61 / ATEL-53 · Bàn giao preparation round 4

**Kết luận:** đã rà đúng hai nguồn mới; không có GLB phù hợp vừa tải được vừa có provenance/permission rõ. Không chọn base, không tạo shape handoff, không đổi registry.

## Nguồn 01 — GitHub custom-shirts

- URL: https://github.com/dnewcome/custom-shirts
- Evidence: [GitHub metadata](source-01/github-metadata.json), [README](source-01/README.md). GitHub API báo license=null; repository không có LICENSE và không có GLB phát hành.
- README mô tả FreeSewing pattern + Newton/Style3D drape generator, cần NVIDIA GPU/CUDA 12; procedural collar mặc định OFF và khi bật thì đọc như bìa cứng. Không có GLB/file được tải để tạo hash hoặc front/back/side/oblique capture. **Loại:** thiếu license và thiếu GLB độc lập có thể tiếp nhận.

## Nguồn 02 — ArtStation 3D Drape Shirt - Male Shirt

- URL: https://www.artstation.com/marketplace/p/agpaq/3d-drape-shirt-male-shirt · seller nana jimoh. Listing hiển thị Standard Use License, giá USD 12, yêu cầu sign-in/cart; có file Shirt.blend.glb 13 MB nhưng không có URL tải công khai khi chưa mua.
- Seller gallery: [01](source-02/gallery-01.jpg), [02](source-02/gallery-02.jpg), [03](source-02/gallery-03.jpg), [04](source-02/gallery-04.jpg), [05](source-02/gallery-05.jpg), [06](source-02/gallery-06.jpg), [07](source-02/gallery-07.jpg); SHA-256 nằm trong source-02.json. Đây là ảnh gallery người bán, không phải captures từ GLB. Chúng cho thấy áo cổ tròn tay ngắn; không có cổ bẻ/lá cổ, nẹp/khuy hay cuff. **Loại:** sai cấu trúc; không mua asset này. GLB không tải nên không có source hash.

## Blocker / yêu cầu acquisition

Không có base suitable trong hai nguồn mới. Nhờ Owner cung cấp trực tiếp GLB sơ mi độc lập được phép dùng trong AtelierX hoặc URL tải trực tiếp kèm license/provenance; yêu cầu: cổ bẻ có chân cổ + hai lá, nẹp/khuy, tay dài/măng sét, openings thật và drape tự nhiên. ETA 15 phút từ khi nhận file/URL để xác minh provenance/hash và chụp front/back/side/oblique. Không dùng nguồn ATEL-54/59/60 hoặc ATEL-47/v4.
