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

