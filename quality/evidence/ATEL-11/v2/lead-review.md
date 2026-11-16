# Studio Lead review — ATEL-11/v2

Revision inspected: `grab3d-hoodie-clean-v2`.

- GLB exists and SHA-256 `42dc0075e632eab84256f71d9cc88b6eb6d54d04cbff3682f548f62e55994a13` matches `quality/base-meshes.json`.
- Registry records Grab3D source and CC0-1.0 license; status remains `candidate`.
- Opened the six browser captures (front/back/left/right/detail/mobile). The stand no longer obscures the back. Small residual marks near the neck/shoulder remain for QA review.
- Browser result reports loaded/rotated/zoomed/desktop/mobile true with no errors.
- Opened the back UV checker. It makes the back UV islands visible, but it is diagnostic evidence only and does not prove artwork orientation, distortion, seam overflow, or a usable placement profile.

Decision: accept the Designer's technical cleanup deliverable for its scoped task. This does not approve the base mesh. Keep `candidate` pending independent QA of the residual mesh marks and an actual artwork placement check on this same revision.
