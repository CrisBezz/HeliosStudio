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
