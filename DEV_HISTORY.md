## 2026-11-14 — Release 0.1.2 material gallery scrolling

- Cris accepted the new materials and their previews, but reported that the preset menu did not scroll. Record the catalogue/previews as a protected partial PASS and the gallery scroll as the failing behavior.
- Removed the nested grid scroller and let the expanded Materials panel own vertical scrolling. Its height adapts while the preset gallery is open and enables native touch momentum.
- BoxLab `.1161` already contains the exact same twenty-preset catalog and shared SVG preview helper as Helios Studio `.1.1` (source files byte-match); no duplicate BoxLab material implementation was added. Cris's `.1161 PASS` is recorded in BoxLab.
- Release target 0.1.2. `npm run lint` (TypeScript check) and `npm run build` pass locally. GitHub Pages publication and device scroll acceptance remain pending.

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
