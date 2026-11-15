## 2026-11-15 — Release 0.1.4 texture mapping and emitter controls

- Extended Helios's existing material controls with cached previews for the active albedo, normal and roughness textures, per-slot replacement, and a restore-to-preset action.
- Added per-material UV scale U/V, offset U/V and rotation and applied the same transform in the existing Three.js PBR and GPU path-tracing owners. Three.js map caching now keys by map and transform and is cleared when mapping changes, avoiding shared texture-transform bleed between materials.
- Exposed emission intensity and emitter opacity. The ray tracer weights emitted radiance by opacity and continues remaining throughput through the transparent emitter; the Three.js view uses the same opacity.
- Clarified that current height relief is normal-map shading rather than geometric displacement; no mesh silhouette displacement was added.
- Updated package/README release markers to 0.1.4. Type-check/build are owned by the Pages workflow; record its final result and user's manual acceptance in TEST_CHECKLIST.

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
