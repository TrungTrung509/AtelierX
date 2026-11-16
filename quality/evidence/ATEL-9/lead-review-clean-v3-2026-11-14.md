# Studio Lead review — ATEL-9 / clean-v2-neckfix-placement-v3

Ngày 2026-11-14, Studio Lead đã hoàn tất verify WorkItem `e348d8a3-6038-4f70-8bf6-c3dec4945501:verify:e348d8a3-6038-4f70-8bf6-c3dec4945501` và chấp nhận kết quả independent QA ATEL-19.

## Quyết định G1

Duyệt G1 cho đúng geometry revision `clean-v2-neckfix-placement-v3`, đăng ký với baseMeshId `grab3d-hoodie-clean-v2-neckfix-placement-v3`.

- Geometry file: `quality/evidence/ATEL-17/clean-v2-neckfix-placement-v3/hoodie-mesh-revision.glb`
- Geometry SHA-256: `34374edd321b7e8396656e7d5a003e359d9349c5cc35bb5bc37a5c99145141bf`
- Diagnostic SHA-256: `964e87b98a215cf1c8b86ce0b42f6a881b384202caf8faeaca3928aa6c64ea92`
- Source candidate: `grab3d-hoodie-clean-v2`, SHA-256 `42dc0075e632eab84256f71d9cc88b6eb6d54d04cbff3682f548f62e55994a13`.
- QA report: `quality/reports/ATEL-9/clean-v2-neckfix-placement-v3-qa.json` (PASS recommendation; blockers empty; browser loaded/rotated/zoomed desktop/mobile true; all eight capture hashes verified).
- Placement profile: `quality/evidence/ATEL-17/clean-v2-neckfix-placement-v3/placement-profile.json`.

The source candidate remains `candidate`. Its hash does not represent the approved geometry revision. The registry contains a separate approved entry whose file and SHA identify the geometry revision. The diagnostic texture is evidence for placement and does not replace production artwork.

## Remainder of ATEL-1

This G1 decision covers the hoodie geometry and placement test only. It does not approve or complete ATEL-1: QA captures show a pink hoodie with diagnostic badges, not the requested black hoodie with a recognizable one-eyed skull on the back. `showcase/catalog.json` remains `preview`.

ATEL-20 is assigned to Designer `atelierx-designer-0003`, WorkItem `07ca64d9-6a31-449a-b43e-df924903212a`, status running. It will create the black skull product revision from the approved geometry ID/SHA. After handoff, Visual Studio must integrate the product viewer; QA must inspect that exact product revision in browser; Studio Lead then runs the product quality gate. Keep preview until all checks pass.

## Evidence checked by Lead

- QA report parsed as valid JSON.
- SHA-256 of source, geometry revision and diagnostic GLB matched the report.
- All eight browser screenshot hashes matched the report and manifest.
- Front/back and both neck-shoulder closeups directly reviewed; QA also inspected all six browser views and recorded the remaining raised seam transitions and modest but visible hem clearance as nonblocking.
