# Helios Studio Handoff

## Current state

- Repository: `CrisBezz/HeliosStudio`, branch `main`.
- Live app: https://crisbezz.github.io/HeliosStudio/
- GitHub Pages deploys through `.github/workflows/pages.yml`.
- Google AI Studio is no longer part of the development or publishing loop. The repository is the source of truth.
- Release marker: 0.1.0.
- GitHub Pages source is set to **GitHub Actions**. Latest custom workflow deployment: run 43544116013 succeeded.
- Cris reported a blank page after the Pages source had fallen back to publishing the repository root. The source was corrected, and Cris confirmed the refreshed live render displays correctly (**protected PASS**).

## Implemented in 0.1.0

- Added the 512 spp render quality option.
- Added circular reset controls for the selected light and selected material.
- Light reset restores the matching `DEFAULT_LIGHTS` entry.
- Material reset restores the loaded project's initial scalar and procedural material properties while retaining uploaded texture-map assets.
- Added repository-owned GitHub Pages build and deployment configuration.

## Current architectural owners

- UI and application state: `src/App.tsx` and `src/components/BottomDock.tsx`.
- Built-in defaults and presets: `src/data/presets.ts`.
- Three.js scene and path tracing: `src/engine/StudioEngine.ts` and `src/engine/pathTracer.ts`.
- Dependency resolution is pinned by `bun.lock`.

## Next

Create graphical previews for the existing material presets before expanding the preset catalogue. Then continue material additions and port the agreed Helios controls into BoxLab. Clean render export remains BoxLab-specific.
