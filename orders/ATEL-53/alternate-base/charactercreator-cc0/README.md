# ATEL-53 alternate shirt-base checkpoint

Selected by Lead after the custom procedural shape path failed review. Source is `clothing_shirt.glb` from the `kblood/CharacterCreator` repository at commit `852e48f316b90a0937234886630e4fb4cdfd1f78`:

- Model: https://github.com/kblood/CharacterCreator/blob/852e48f316b90a0937234886630e4fb4cdfd1f78/output/clothing_shirt.glb
- License record: https://github.com/kblood/CharacterCreator/blob/852e48f316b90a0937234886630e4fb4cdfd1f78/LICENSE-NOTES.md
- Clothing record: https://github.com/kblood/CharacterCreator/blob/852e48f316b90a0937234886630e4fb4cdfd1f78/output/clothing.json
- Upstream declares generated garment GLBs CC0-1.0; this shirt is generated from MakeHuman system assets marked CC0. The attribution and exact license notes are retained locally.

The source GLB scene contains a single mesh named `Cloth_shirt` plus armature/skin data; it contains no body or mannequin mesh. The geometry is kept unchanged in `gray-shirt-candidate.glb`. Only the material base color/roughness was neutralized for shape inspection; texture references were removed from the inspection copy. The viewer screenshot is a checkpoint, not a shape approval. Designer and independent QA must still inspect collar construction, openings, drape, and silhouette against ATEL-35/v1 before any surface/artwork work.
