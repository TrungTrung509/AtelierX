# ATEL-29 / ATEL-23/v2 — armhole diagnostic notes

Status: **candidate handed to QA for independent retest; no G1 approval**.

Frozen v1 remains unchanged at SHA-256 `87d6d1f1fa98bae641df5578b634ca08a9453026586e314e2ba7d13e59a0c3bd`. The v2 geometry is a separate revision. It rebuilds the torso/sleeve-root junction as one implicit shell using mannequin-v1 measurements and the MIT shirt pattern armhole boundary as a reference. Attribution and the full license are retained in `orders/ATEL-23/v2/designer/references/`.

Two diagnostic issues were found and fixed before this handoff:

1. A sleeve-root SDF cap truncated the surface union. The cap was removed so the sleeve loft intersects the torso field continuously.
2. The rear torso field reached the original `z=-0.22 m` grid limit, clipping its posterior surface and creating a visible back opening. The grid now extends to `z=-0.30 m`; the back opening is no longer visible in the same-revision browser capture.

Current artifacts and all SHA-256 values are recorded in `orders/ATEL-23/v2/designer/fit.json` and `orders/ATEL-23/v2/designer/candidate-review.json`. The current browser set is `quality/evidence/ATEL-23/v2/browser-fit/`, including both posterior armhole close views. Browser runner reports `loaded=true` and no errors. A designer screening sampled 1,959 mannequin arm-surface vertices in the arm/shoulder band; 0 were outside the generated implicit garment field, with closest sampled signed field value -0.0202 m. This is point sampling, not a triangle collision solver.

QA must independently verify actual surface intersections, both posterior armholes, shoulder silhouette, and whole-garment fit against the exact hashes in `fit.json`. Keep source candidate and catalog state unchanged; do not mark approved or G1 pass.


## Superseded by v2.1

Independent QA returned v2: `quality/reports/ATEL-23/v2.json` (SHA-256 `cdf74e0cb0f12f1eb11beabbe7be76af7bfadb381acf4433ef1992f71887d8ef`) because oblique captures showed upper-back/neck exposure and global intersections. Do not use the earlier v2 handoff as final. Corrective v2.1 preserves v1 and v2, expands the upper grid, defines the neck opening and provides newly framed browser evidence under `quality/evidence/ATEL-23/v2.1/browser-fit/`. See `orders/ATEL-23/v2.1/designer/fit.json`; QA retest remains pending and G1 is not approved.
