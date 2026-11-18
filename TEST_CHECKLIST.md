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

## Release 0.1.4 — texture mapping and emitter controls

- [ ] In Materials, confirm the current albedo, normal and roughness maps each show a preview; change each map and confirm its preview updates.
- [ ] Restore preset maps and confirm the selected material's procedural maps return.
- [ ] Change U/V scale, U/V offset and rotation separately; confirm each transform changes the ray-traced render and the Three.js PBR view, and does not alter another material using the same preset.
- [ ] Adjust normal / height-relief strength and confirm surface shading changes without mesh silhouette changes.
- [ ] Raise emission, lower emitter opacity, and confirm the glowing surface becomes translucent in the render; compare the PBR preview.
- [ ] Reset mapping, then reset the material; confirm transforms return to their preset defaults and uploaded map assets remain available.
- [ ] Repeat the material-panel interactions in iPad portrait and landscape and confirm the dock remains scrollable and controls stay tappable.

Automated status for 0.1.4: Pages workflow `43663848502` passed type-check, production build and deploy. Cris's hands-on device acceptance is pending.

## Release 0.1.3 — architectural material library — protected PASS

- [x] All twenty-eight labeled cards and eight architectural presets are present.
- [x] Preset materials update the selected render-session surface with visible texture and preview.
- [x] Texture patterns and preset-gallery scrolling work in portrait and landscape.
- [x] Presets do not modify the source project or mesh.
- Automated: local lint/build and Pages run `43570852359` passed. Cris confirmed 0.1.3 PASS.

## Release 0.1.3 — architectural material library

- [ ] In Materials, open the preset grid and confirm all twenty-eight labeled preview cards are present, including the eight new architectural presets.
- [ ] Apply Warm Limestone, Red Clay Brick, Spotted Gum, Terrazzo, Glazed Ceramic Tile, Lime Plaster, Weathered Corten Steel, and Polished Concrete to the selected surface; confirm each changes the render.
- [ ] Check brick bond, terrazzo chips, tile grout, limestone/plaster grain, and Corten mottling are visible in the ray-traced result and card previews.
- [ ] Scroll to the last card in portrait and landscape; confirm the preset panel remains scrollable and selection still closes the gallery.
- [ ] Confirm presets affect only the selected render-session material and do not change the source project.

Automated status for 0.1.3: local `npm run lint`/`npm run build` and Pages run `43570852359` pass. Hands-on touch/material acceptance is pending.

## Release 0.1.2 — material gallery scroll repair — protected PASS

- [ ] On iPad portrait, open Materials > preset grid and scroll to the final row without closing the menu.
- [ ] Repeat in landscape and confirm the material panel scrolls smoothly while the viewport remains usable outside the dock.
- [ ] Apply a lower-row preset; confirm it applies to the selected surface and the gallery closes.
- [ ] Confirm the scrollable area includes all twenty cards and retains their preview and label.

Automated status for 0.1.2: `npm run lint` and `npm run build` pass locally; GitHub Pages run `43560460679` succeeded for commit `d323550`. Cris confirmed Helios `.1.2 PASS` and BoxLab `.1162 PASS` for gallery scrolling.

## Release 0.1.1 — user partial acceptance

- [x] **Protected PASS:** Cris says the expanded material choices and previews look great.
- [x] **Resolved FAIL:** The material gallery was trapped in a menu that did not scroll; 0.1.2 makes the parent material panel the sole touch scroll owner.

# Hands-on Test Checklist

## Release 0.1.1 — material preset gallery

- [ ] In Materials, open the grid icon and confirm all twenty preset cards include a visible material sphere and label.
- [ ] Apply a metal, textured, glass, and diffuse preset to the selected surface; confirm the ray trace updates and the other material surfaces stay unchanged.
- [ ] Confirm the preset grid closes after selection and the selected material controls show the applied values.
- [ ] Confirm the gallery is scrollable and its cards remain tappable on iPad portrait and landscape.
- [ ] Confirm these are render-session settings and do not modify BoxLab's source project or mesh.

Automated status for 0.1.1: `npm run lint` (TypeScript check) and `npm run build` both pass. Pages workflow run `43555341723` succeeded; user device acceptance remains pending.

## Release 0.1.0 — protected acceptance and remaining controls

- [x] **Protected PASS:** User confirmed the live Helios Studio render view appears.
- [x] **Resolved FAIL:** A later deployment showed a blank page while Pages was publishing main / repository root. Pages is now set to GitHub Actions; run 43544116013 completed successfully, and Cris confirmed the refreshed live render displays (**protected PASS**).
- [ ] In Lights, change a light value, tap its circular-arrow control, and confirm that light returns to its default values.
- [ ] Apply a lighting rig, then reset the selected light and confirm the other lights remain as set.
- [ ] In Materials, change Albedo, Roughness, and Metalness, then reset and confirm the loaded material values return.
- [ ] Upload a custom texture map, change scalar properties, reset, and confirm the custom map remains active.
- [ ] Confirm 512 spp remains selectable and the ray-tracer starts accumulating samples.
- [ ] On desktop and iPad, confirm the reset buttons are clear, tappable, and do not obstruct controls.

Record user-reported PASS items as protected. Record failures and the affected scene/material before changing the owning implementation.
