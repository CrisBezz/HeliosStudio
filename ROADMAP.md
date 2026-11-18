## 18 November 2026 — H2 / Helios Studio 0.1.6

BoxLab .1192 Guided Unwrap is user PASS and protected. Helios uses latest-project-request ownership for file imports and built-in project choices. Obsolete file reads and parsed roots cannot publish. Staging texture managers are allocated after successful current parsing. Failed imports preserve the previous scene. Texture upload tokens guard the decode write, lease cleanup and subsequent material update. Restore, preset changes, material removal, project replacement and disposal invalidate stale uploads. The file picker is bound to the current engine and project. Same-material concurrent uploads retain the H1 wait behavior. UV3 is next for BoxLab.

Device: import a large model and switch to a gallery project while it loads. Try two different imports in quick succession. Replace a map and immediately use Restore preset maps or switch projects. Confirm that only the active project and material show the expected textures.

## 18 November 2026 — H1 / Helios Studio 0.1.5 user PASS

Cris confirms PASS /nextbuild. Protect explicit eight-slot allocation/free reuse/overflow, failed upload/import rollback and independent material textures from .1.5. Next ordered build B1 ports safety to BoxLab with existing packed-metalness/opacity behavior retained; standalone runtime stays0.1.5. No new standalone runtime build or unchanged-code retest is implied.

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

# Helios Studio Roadmap

## Current

- Helios Studio 0.1.3's twenty-eight material presets and scrollable gallery are user-PASS protected.
- Release 0.1.4 adds live texture-map previews and replacement, UV offset/scale/rotation, normal relief strength and emitter-opacity control. It extends the existing texture manager and path tracer.
- Current height relief is carried by tangent-space normal maps; ray geometry and silhouettes are unchanged.
- Package and README markers are 0.1.4; `bun.lock` is unchanged because no dependencies were added. Pages run `43663848502` passed type-check, production build and deploy. User device acceptance is pending.

## Next-build ideas

1. After 0.1.4 acceptance, add a true height/displacement path. Compare UV-space parallax relief with tessellated/BVH displacement using a repeatable test scene and iPad memory/performance measurements before choosing an approach.
2. Add optional ambient-occlusion and packed ORM map support with previews and channel selectors.
3. Add per-map enable, strength and reset controls, and allow saving/reloading material setups in Helios without writing to BoxLab project data.
4. Keep standalone Helios material ownership here; port accepted features to BoxLab in a separate BoxLab build when requested.

