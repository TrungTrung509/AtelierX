# ATEL-2 / v2 evidence

- `front-placement-schematic.png` and `back-placement-schematic.png` are offline placement schematics rendered from SVG. They are not captures from a 3D viewer and do not establish runtime QA.
- `gltf-validator-report.json` is from Khronos glTF Validator 2.0.0-dev.3.10: 0 errors, 0 warnings, 0 infos; the GLB embeds its texture.
- `v1-preservation-baseline.sha256` records the v1 GLB, texture, SVG, manifest, and original generator/test hashes from before the v2 edits. `v1-preservation-check.txt` shows all six are unchanged.
- The new art has one centered open eye socket, a longer animal-like muzzle and canine teeth; automated texture checks confirm one dark eye opening, safe print margins, centered placement and upright back UV mapping. The front torso uses an untextured material.
- The hoodie form is procedural because the project contains no approved pullover base mesh or UV source. Runtime browser QA and physical fit are not confirmed; no runtime pass is claimed.
- Rebuild: `node site-atel-1/tools/generate-atel2-v2.mjs`
- Tests: `node --test site-atel-1/tools/generate-atel2-v2.test.mjs` (3 pass).
