## 18 November 2026 — H1 / Helios Studio 0.1.5 user PASS

Cris confirms PASS /nextbuild. Protect explicit eight-slot allocation/free reuse/overflow, failed upload/import rollback and independent material textures from .1.5. Next ordered build B1 ports safety to BoxLab with existing packed-metalness/opacity behavior retained; standalone runtime stays0.1.5. No new standalone runtime build or unchanged-code retest is implied.

## H1 / 0.1.5 publication verified — 18 November 2026

Standalone runtime cb4e68d04f3837f12266468e3cca59450ae9081a published to main. All11 changed files byte-match validated local source. Local7/7 behavior tests PASS (23.672s), type-check/build/diff PASS. Hosted Pages44235671140 build134571085734 and deploy134571260760 SUCCESS: frozen Bun install, seven behavior tests, type-check, production build and Pages deploy all pass. Live shell references assets/index-DjT0GQQw.js; fetched1,093,733-byte production bundle contains the new capacity, lease-cancellation, per-material pending and scene/dispose guards. Physical iPad acceptance pending. BoxLab remains .1189 UV1 PASS; B1 port is next, not included in this runtime.

## 18 November 2026 — H1 / Helios Studio 0.1.5: custom texture-slot safety

BoxLab .1189 UV1 is user PASS, protected. H1 is standalone only; B1 remains the separate BoxLab vendor port, surface-opacity Reset and browser-workflow build. Do not describe BoxLab as receiving this allocator repair yet. Standalone release0.1.5 keeps the existing renderer, presets, mapping and eight1024 custom layers.

The original PbrTextureManager now reserves explicit live leases, finds a genuinely free slot and refuses a ninth without wrapping or touching occupied pixels. Restore/preset changes and material removal release slots; reset/dispose invalidate outstanding leases. File decoding records its lease and rejects late results after release/reuse. Image processing completes before atlas flags/pixel publication. Upload reserves privately, publishes mapping/flags only after successful decode/write, releases a new reservation on failure and reuses an existing material slot for additional channels. Concurrent uploads to one material are refused with a wait message.

Importer stages all layer mappings and rolls back reservations on capacity/image-write failure. Standalone custom import prepares a separate texture manager/layer map before replacing live state, so a failed import preserves existing project pixels and bookkeeping. Temporary staging can retain two managers (up to approximately192MiB custom CPU pixel arrays, plus GPU/geometry/preview overhead); steady-state capacity remains eight, not increased. Full latest-request/scene/material async ordering is H2, not claimed completed by these lease checks. Existing grouped-material/source-fidelity limitations remain H4.

New executable tests exercise actual TypeScript production owners with Three.js, controlled image/canvas/loader boundaries; no GPU/iPad visual result inferred. Cover8→9, non-next free reuse, failed decode, late lease reuse, upload rollback/replacement/Restore, import overflow and write rollback, live-scene preservation, private import success and material removal. CI now runs these before type-check/build. Local install used npm legacy-peer-deps because normal npm resolution disagrees with the existing future pinned dependency ranges; bun.lock and all dependency versions remain unchanged, hosted CI retains frozen Bun install. Final local validation:7/7 behavior tests PASS (23.672s), npm run lint PASS, production build PASS, diff check clean. Hosted locked-install/test/type-check/build/deployment proof follows.

DEVICE015: upload distinct maps to several materials, replace Normal/Roughness on one and confirm others stay unchanged; Restore preset maps then upload elsewhere; try invalid/over-capacity import and verify existing scene remains. Synthetic eight-slot/rollback cases are automated; no need to manually manufacture nine materials. Next ordered build B1 port tested safety to BoxLab, then UV2 guided Facegroups; H2 request ordering remains queued.

## 17 November 2026 — UV/painting priority and unified B / H / UV progression

User explicitly prioritizes robust automatic unwrap into usable large patches, Facegroup-guided regions and selected-edge seam control, with painting/UV work above optional renderer features. [Detailed UV audit and authoritative ordered queue](https://github.com/CrisBezz/BoxLab/blob/main/docs/UV_AUDIT_AND_ORDERED_BUILDS_2026-11-17.md) supersedes the previous audit's priority order. Next recommended runtime capability: UV1 bounded worker-based Auto Unwrap with preview/Apply/Undo using an external xatlas adapter; then H1 shared texture safety, B1 integration/workflow protection, UV2 guided groups, H2 async safety, UV3 selected seams and UV4 packing/quality, followed by painting/refinement/import/reprojection/export. Full25-row progression has explicit dependencies and useful completion gates.

Confirmed current Facegroup planner demands an already disk-shaped patch and refuses a closed one-group cube and planar ring; current Auto atlas is projection-based. Existing strict core/workflow tests9/9 PASS; retain their mode contracts while adding explicit Guided semantics. Isolated watlas WASM Node feasibility: cube6 charts, ring1 chart, source correspondence checked on ring; no BoxLab integration or iPad performance claimed. Preserve editable quads and current face-corner UV/history/paint owners. Verify explicit seam enforcement and temporary-triangle correspondence before adoption; xatlas material IDs are hard boundaries, not arbitrary soft preferences. Imported/painted target preservation, worker cancellation, pixel gutters and quality metrics are scheduled capabilities, not implemented claims. Audit only; runtime versions unchanged.

## 17 November 2026 — coordinated source audit and recommended queue

See [Helios next-build audit](docs/NEXT_BUILDS_AUDIT_2026-11-17.md) and its linked detailed cross-repo report. Recommended next standalone0.1.5: fix custom-texture slot ownership/release/rollback with executable behavior tests, followed by async request/scene guards, selective backport of BoxLab metalness/surface-opacity improvements, import fidelity, then saved render setups. Actual allocator method reproduced layers100…107,100 for9 allocations in both repositories. Existing .1.4 Pages/type-check/build runs43663848502/43663949379 successful; no fresh local build or device test claimed. Reconcile standalone .1.4 pending acceptance text with BoxLab upstream-base acceptance wording; do not infer a new PASS. Audit only—runtime remains0.1.4; no new material/renderer changes. Preserve existing gallery/device PASSes. Avoid wholesale vendor replacement or immediate unbounded displacement.

# Helios Studio Handoff

## Current state

- Repository: `CrisBezz/HeliosStudio`, branch `main`.
- Live app: https://crisbezz.github.io/HeliosStudio/
- GitHub Pages workflow: `.github/workflows/pages.yml`; dependency pins remain in `bun.lock`.
- Current published release: 0.1.4, runtime commit `0e79c5163e5d87703d369250e1a9fff9e2b9085f`; Pages workflow run `43663848502` passed type-check, build and deploy. Runtime base commit: `f0877f10125ff7e58103ec97f16137c5e972a4a9`.
- Release 0.1.4 extends the existing `BottomDock`, `StudioEngine`, `PbrTextureManager` and `GPUPathTracer`; no renderer or material kernel was added.
- Helios Studio 0.1.3's 28 material presets and scrolling gallery are PASS protected. BoxLab .1164 menu styling is separately protected; this build changes standalone Helios Studio only.

## 0.1.4 material mapping controls

- The Material tab now shows cached previews for the active albedo, normal and roughness maps. Each slot can be replaced with an uploaded image, and uploaded maps can be reverted to the selected procedural preset.
- UV mapping now supports separate U/V scale, U/V offset and rotation. The same transform is applied in the path tracer and Three.js PBR preview; map textures are cached per transform so one material cannot alter another material's mapping.
- Normal strength is clearly exposed as normal/height-relief strength. Current procedural height detail is baked into normal maps; it changes shading but does not displace ray geometry or alter the silhouette.
- Emission intensity is exposed. Emitter opacity lets rays continue through partly transparent glowing surfaces, with the PBR preview reflecting the same opacity.
- Reset mapping returns to the material preset's tile scale and zero offset/rotation. Full material reset preserves uploaded map assets, consistent with earlier ownership.

## Current owners

- UI/application state: `src/App.tsx`, `src/components/BottomDock.tsx`.
- Built-in defaults and presets: `src/data/presets.ts`.
- Texture arrays, procedural maps and preview generation: `src/engine/textures.ts`.
- Three.js PBR materials and UV matrix: `src/engine/models.ts`.
- Scene/update and imported maps: `src/engine/StudioEngine.ts`.
- Path tracing and per-material UV/emitter uniforms: `src/engine/pathTracer.ts`.
- Do not add a second renderer or a separate map-control owner.

## Validation and next step

Repository CI run `43663848502` passed `bun run lint`, `bun run build`, and Pages deployment. Cris's hands-on result is pending; record it in `TEST_CHECKLIST.md`. See the .1.4 checklist for touch, transform, preview, reset and emitter-opacity checks. True geometric displacement, AO/height asset channels and per-channel blend controls remain future candidates.

