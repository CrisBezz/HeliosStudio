## 2026-11-15 — Release 0.1.4 texture mapping and emitter controls

- Extended Helios's existing material controls with cached previews for the active albedo, normal and roughness textures, per-slot replacement, and a restore-to-preset action.
- Added per-material UV scale U/V, offset U/V and rotation and applied the same transform in the existing Three.js PBR and GPU path-tracing owners. Three.js map caching now keys by map and transform and is cleared when mapping changes, avoiding shared texture-transform bleed between materials.
- Exposed emission intensity and emitter opacity. The ray tracer weights emitted radiance by opacity and continues remaining throughput through the transparent emitter; the Three.js view uses the same opacity.
- Clarified that current height relief is normal-map shading rather than geometric displacement; no mesh silhouette displacement was added.
- Updated package/README release markers to 0.1.4. The first hosted type-check caught missing preview-prop wiring; fixed it in follow-up commit `0e79c5163e5d87703d369250e1a9fff9e2b9085f`. Final Pages workflow `43663848502` passed type-check, production build and deploy. iPad/manual acceptance is pending in TEST_CHECKLIST.

## 2026-11-15 — Release 0.1.3 protected PASS

Cris confirms Helios Studio 0.1.3 PASS. Protect the 28 material presets, architectural texture families, previews and scrollable gallery. Keep BoxLab's integrated Helios feature separately versioned.

## 2026-11-14 — Release 0.1.3 architectural material families

- Built on the protected 0.1.2 gallery-scroll PASS. Added Warm Limestone, Red Clay Brick, Spotted Gum, Terrazzo, Glazed Ceramic Tile, Lime Plaster, Weathered Corten Steel, and Polished Concrete, bringing the gallery from twenty to twenty-eight choices.
- Extended the existing procedural PBR texture-array owner with six map families (limestone, running-bond brick, terrazzo aggregate, glazed tile, plaster, and weathered steel) and six additional layers; Spotted Gum and Polished Concrete reuse existing grain families with distinct color/scale/roughness responses.
- Added matching sphere-preview patterns to the existing SVG preview helper. Presets still target only the selected Helios render-session material; BoxLab project data is untouched.
- Release 0.1.3 runtime commit `44a7565e24ee96ea7907716dc67b1b97a810a63d`; local `npm run lint`/`npm run build` and hosted Pages run `43570852359` pass. Hands-on material acceptance is pending. BoxLab `.1162` PASS and Helios `.1.2` PASS remain protected; port these accepted materials to BoxLab in a later build.

## 2026-11-14 — Release 0.1.2 material gallery scrolling — protected PASS

- Cris accepted the new materials and their previews, but reported that the preset menu did not scroll. The catalogue/previews PASS is protected and the gallery scroll was the failing behavior; Cris later confirmed the repaired gallery PASS.
- Removed the nested grid scroller and let the expanded Materials panel own vertical scrolling. Its height adapts while the preset gallery is open and enables native touch momentum.
- BoxLab `.1161` already contains the exact same twenty-preset catalog and shared SVG preview helper as Helios Studio `.1.1` (source files byte-match); no duplicate BoxLab material implementation was added. Cris's `.1161 PASS` is recorded in BoxLab.
- Release 0.1.2: `npm run lint` (TypeScript check) and `npm run build` passed locally. GitHub Pages run `43560460679` succeeded for commit `d323550`. Cris confirmed Helios `.1.2 PASS` and BoxLab `.1162 PASS`, including gallery scrolling.

# Development History

## 2026-11-14 — Release 0.1.1 material gallery

- Added twelve distinct physical material choices to the existing eight presets: brushed aluminum, warm copper, black oxide steel, pearl enamel, matte polymer, walnut wood, black leather, cast concrete, polished marble, frosted glass, emerald glass, and soft rubber. New selections reuse the existing PBR material fields and procedural texture layers; no parallel shading or texture kernel was added.
- Replaced the horizontal preset strip with a grid-opening icon and a scrollable card gallery. Each card uses a lightweight SVG sphere preview parameterized by the preset's base color, texture family, roughness, metalness, transmission and coat.
- Presets continue to update only the currently selected material surface in Helios' render-session state.
- Release markers updated to 0.1.1. `npm run lint` and `npm run build` pass. Pages workflow run `43555341723` succeeded. A first upload of the large `BottomDock.tsx` source was truncated by the GitHub transfer and failed the hosted type-check; the complete source blob was reapplied and the corrected build/deployment succeeded. User device acceptance is pending; see TEST_CHECKLIST.

## 2026-11-14 — Release 0.1.0

- Took repository-owned control of Helios Studio and published through GitHub Pages at https://crisbezz.github.io/HeliosStudio/.
- Added a 512 spp option to the existing ray-tracer quality control.
- Added reset-to-default controls for the selected light and selected material. Material defaults are captured whenever a built-in project or imported model is loaded; uploaded texture maps are retained when resetting material properties.
- User confirmed that the published render view displays correctly.
- The GitHub Actions production build and deployment completed successfully.
- After the reset-controls deployment, Cris reported that the page was blank. The repository's Pages source had reverted to main / root, so GitHub's branch publisher served the unbuilt source tree.
- Restored **GitHub Actions** as the Pages source and ran the custom build-and-deploy workflow (run 43544116013); the build and deployment succeeded.
- Cris confirmed the refreshed live render displays correctly after the publishing correction. Recorded as a protected PASS; the blank-page failure is resolved.


## 17 November 2026 — coordinated source audit and recommended queue

See [Helios next-build audit](docs/NEXT_BUILDS_AUDIT_2026-11-17.md) and its linked detailed cross-repo report. Recommended next standalone0.1.5: fix custom-texture slot ownership/release/rollback with executable behavior tests, followed by async request/scene guards, selective backport of BoxLab metalness/surface-opacity improvements, import fidelity, then saved render setups. Actual allocator method reproduced layers100…107,100 for9 allocations in both repositories. Existing .1.4 Pages/type-check/build runs43663848502/43663949379 successful; no fresh local build or device test claimed. Reconcile standalone .1.4 pending acceptance text with BoxLab upstream-base acceptance wording; do not infer a new PASS. Audit only—runtime remains0.1.4; no new material/renderer changes. Preserve existing gallery/device PASSes. Avoid wholesale vendor replacement or immediate unbounded displacement.



## 17 November 2026 — UV/painting priority and unified B / H / UV progression

User explicitly prioritizes robust automatic unwrap into usable large patches, Facegroup-guided regions and selected-edge seam control, with painting/UV work above optional renderer features. [Detailed UV audit and authoritative ordered queue](https://github.com/CrisBezz/BoxLab/blob/main/docs/UV_AUDIT_AND_ORDERED_BUILDS_2026-11-17.md) supersedes the previous audit's priority order. Next recommended runtime capability: UV1 bounded worker-based Auto Unwrap with preview/Apply/Undo using an external xatlas adapter; then H1 shared texture safety, B1 integration/workflow protection, UV2 guided groups, H2 async safety, UV3 selected seams and UV4 packing/quality, followed by painting/refinement/import/reprojection/export. Full25-row progression has explicit dependencies and useful completion gates.

Confirmed current Facegroup planner demands an already disk-shaped patch and refuses a closed one-group cube and planar ring; current Auto atlas is projection-based. Existing strict core/workflow tests9/9 PASS; retain their mode contracts while adding explicit Guided semantics. Isolated watlas WASM Node feasibility: cube6 charts, ring1 chart, source correspondence checked on ring; no BoxLab integration or iPad performance claimed. Preserve editable quads and current face-corner UV/history/paint owners. Verify explicit seam enforcement and temporary-triangle correspondence before adoption; xatlas material IDs are hard boundaries, not arbitrary soft preferences. Imported/painted target preservation, worker cancellation, pixel gutters and quality metrics are scheduled capabilities, not implemented claims. Audit only; runtime versions unchanged.


## 18 November 2026 — H1 / Helios Studio 0.1.5: custom texture-slot safety

BoxLab .1189 UV1 is user PASS, protected. H1 is standalone only; B1 remains the separate BoxLab vendor port, surface-opacity Reset and browser-workflow build. Do not describe BoxLab as receiving this allocator repair yet. Standalone release0.1.5 keeps the existing renderer, presets, mapping and eight1024 custom layers.

The original PbrTextureManager now reserves explicit live leases, finds a genuinely free slot and refuses a ninth without wrapping or touching occupied pixels. Restore/preset changes and material removal release slots; reset/dispose invalidate outstanding leases. File decoding records its lease and rejects late results after release/reuse. Image processing completes before atlas flags/pixel publication. Upload reserves privately, publishes mapping/flags only after successful decode/write, releases a new reservation on failure and reuses an existing material slot for additional channels. Concurrent uploads to one material are refused with a wait message.

Importer stages all layer mappings and rolls back reservations on capacity/image-write failure. Standalone custom import prepares a separate texture manager/layer map before replacing live state, so a failed import preserves existing project pixels and bookkeeping. Temporary staging can retain two managers (up to approximately192MiB custom CPU pixel arrays, plus GPU/geometry/preview overhead); steady-state capacity remains eight, not increased. Full latest-request/scene/material async ordering is H2, not claimed completed by these lease checks. Existing grouped-material/source-fidelity limitations remain H4.

New executable tests exercise actual TypeScript production owners with Three.js, controlled image/canvas/loader boundaries; no GPU/iPad visual result inferred. Cover8→9, non-next free reuse, failed decode, late lease reuse, upload rollback/replacement/Restore, import overflow and write rollback, live-scene preservation, private import success and material removal. CI now runs these before type-check/build. Local install used npm legacy-peer-deps because normal npm resolution disagrees with the existing future pinned dependency ranges; bun.lock and all dependency versions remain unchanged, hosted CI retains frozen Bun install. Final local validation:7/7 behavior tests PASS (23.672s), npm run lint PASS, production build PASS, diff check clean. Hosted locked-install/test/type-check/build/deployment proof follows.

DEVICE015: upload distinct maps to several materials, replace Normal/Roughness on one and confirm others stay unchanged; Restore preset maps then upload elsewhere; try invalid/over-capacity import and verify existing scene remains. Synthetic eight-slot/rollback cases are automated; no need to manually manufacture nine materials. Next ordered build B1 port tested safety to BoxLab, then UV2 guided Facegroups; H2 request ordering remains queued.

