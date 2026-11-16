---
title: "AtelierX agent rules"
kind: "runbook"
migrated_from: "AGENTS.md"
---

# AtelierX agent rules

Read PLAN_STANDALONE.md for new orders. It replaces mannequin-v1, mandatory fit/intersection checks, G1 approved-base and previous flow documents for standalone orders. Default: an independent 3D garment with volume, folds and garment-specific collar/buttons; no mannequin. Check untextured shape from actual front/back/oblique renders before final artwork. Use six v9 role skills and one thread per order, genuine session acknowledgements and short artifact handoffs. Never claim completion from a valid GLB or running status alone.

Owner stopped ATEL-23. Read quality/studio-control.json; never resume/recreate stopped orders. Wait for owner brief to Lead. New briefs use a new order ID; Lead clears awaitingBrief only for that new order.

Publish inside Crewly showcase/catalog.json and showcase/products/. No external deployment. Use deliveryProfile showcase-basic-v1 and job.presentation=standalone. Browser evidence must show the actual current revision and QA must independently inspect it. Content in Vietnamese: concise specific description, simulated material/source, style and sourced display dimensions (not manufacturing sizes). User-supplied GLBs are permitted under quality/USER_SUPPLIED_BASE_POLICY.md.

Speak Vietnamese in DM, channel, tickets and delivery. Use atelierx-channel-v3 from the agent's own session; channel messages do not replace WorkItem assignment. Preserve runtime/account settings. Do not repeatedly read historic plans or regenerate the same failed approach.

Current flow v9: use tools/studio-base.mjs for visually qualified reusable geometry and tools/studio-flow.mjs for exact task links, readable titles and artifact routing. Material owns the surface GLB, Designer owns geometry, Visual owns viewer. Two source attempts and a 15-minute selection budget. Owner review stays separate from production completion. Do not load retired v3?v8 workflows.

Visual contract: quality/INVISIBLE_BODY_STANDARD.md. Benchmark ATEL-35/v1; preserve cloth shell, real openings, natural drape. Do not substitute closed SDF/parametric solids for garment geometry. Inspect six angles including top/bottom. ATEL-41/v4 and ATEL-47/v4 are owner-rejected shape examples, not qualified reusable bases.
