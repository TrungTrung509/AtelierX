# ATEL-53 plan checkpoint — 2026-11-15

## Active order and constraints

- Active order: ATEL-53 (request `445ea941-034d-4479-b633-fbdc1646bc4c`).
- `quality/studio-control.json` confirms `awaitingBrief=false`, `activeOrderId=ATEL-53`; stopped order list contains ATEL-23. ATEL-23 remains stopped; no stopped order was restored.
- Follow `PLAN_STANDALONE.md` and `quality/INVISIBLE_BODY_STANDARD.md`: standalone shirt, no mannequin; real garment shell, openings, volume and natural folds. Do not use closed SDF/solid parametric geometry. ATEL-35/v1 is a fabric/drape benchmark only. ATEL-47/v4 remains rejected and excluded.

## Planning checkpoint

1. Queried `quality/studio-bases.json` and ran `node tools/studio-base.mjs shirt`: there is no ready shirt base; listed user-supplied candidates are rejected t-shirt geometry.
2. ATEL-61 research round 4 remains valid evidence of two unsuitable sources; its manifest was independently verified 13/13. The images attached here are only excluded ArtStation seller-gallery evidence, not garment captures, a base or QA evidence.
3. Owner explicitly directed the team to build a new gray standalone shirt and not wait for another file/URL. Designer ticket ATEL-62 / WorkItem `ec090719-14b6-4e75-8615-7260c53cdade` is running. Lead posted GIAO VIỆC in the ATEL-53 channel thread; messageId `68dc8a62-035d-47bc-aacf-9fd08e41173b`.
4. The sole QA WorkItem remains `92ff0d6b-d686-441f-889e-55756bafa5a2` at `studio-wait: shape`. QA confirms it will independently inspect the actual gray revision, six angles, three closeups, hash and provenance. No new QA/retry/verify/self-ping task was created.
5. Flow remains `phase=preparation`, with no shape event or QA pass yet. Material, Visual and Research are not being handed a gray-shape task. No color/pattern or publish before shape QA pass.

## Visual evidence

- `excluded-artstation-front-gallery.jpg`
- `excluded-artstation-oblique-gallery.jpg`

These show a crew-neck short-sleeve tee, not the required turned collar, placket/buttons and cuffs. Source details remain in `orders/ATEL-61/research/source-02.json` and `orders/ATEL-61/research/handoff.md`.

## Next step

Designer builds new geometry from actual garment shell/panel construction, with visible collar stand and two leaves, long sleeves/cuffs, open openings and structural cloth folds. First file/image checkpoint is due within 10 minutes of assignment; continue toward gray revision renders front/back/side/oblique/top/bottom plus `collarCloseup`, `placketSideCloseup`, `cuffCloseup`. QA inspects before any surface work. A later-provided source may be considered only if it is permitted and does not replace or reuse rejected geometry; do not restart research or repeat excluded searches.

## Self-build checkpoint — WIP, not QA

- New source script: `orders/ATEL-53/v1/designer/build-shirt-shell-v1.mjs`.
- Generated prototype mesh: `orders/ATEL-53/v1/designer/garment-gray-v1-wip.glb` (fresh panel-shell geometry; no source mesh or body reused).
- Actual local preview render: `gray-wip-front.png`; preview page: `gray-wip-preview.html`. Chromium loaded the GLB and model-viewer successfully. A temporary localhost server used only for the screenshot was stopped immediately after capture.
- Current image is a single front-oriented WIP screenshot, not the required six-angle QA set. No QA pass has been recorded; designer continues to refine shape and produce six-angle/three-closeup evidence.

### Designer's six-angle browser checkpoint (18:36 UTC)

The Designer's own browser captures from the new GLB are stored at `orders/ATEL-53/v1/designer/checkpoint-capture/` (`front.png`, `back.png`, `side.png`, `oblique.png`, `top.png`, `bottom.png`) with their SHA-256 and browser result in `checkpoint-manifest.json`. I independently opened oblique/top/bottom; they confirm the designer's declared WIP issues, especially oversized collar and broken shoulder/armhole continuity. Keep these as prototype evidence only. Designer is correcting before the single QA WorkItem reviews a new hash/revision.
