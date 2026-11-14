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
