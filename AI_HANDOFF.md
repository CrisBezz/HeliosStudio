# Helios Studio Handoff

## Current state

- Repository: `CrisBezz/HeliosStudio`, branch `main`.
- Live app: https://crisbezz.github.io/HeliosStudio/
- GitHub Pages deploys through `.github/workflows/pages.yml`.
- Google AI Studio is no longer part of the development or publishing loop. The repository is the source of truth.
- Release target: 0.1.2; source main was `0485ff1` before the scroll fix. `npm run lint` and `npm run build` pass locally; GitHub Pages run `43560460679` succeeded for commit `d323550`. Cris’s iPad touch acceptance remains pending.
- GitHub Pages source is set to **GitHub Actions**; the latest published gallery build is 0.1.2.
- Cris reported a blank page after the Pages source had fallen back to publishing the repository root. The source was corrected, and Cris confirmed the refreshed live render displays correctly (**protected PASS**).

## Implemented

- Added the 512 spp render quality option.
- Added circular reset controls for the selected light and selected material.
- Light reset restores the matching `DEFAULT_LIGHTS` entry.
- Material reset restores the loaded project's initial scalar and procedural material properties while retaining uploaded texture-map assets.
- Added repository-owned GitHub Pages build and deployment configuration.
- Added twelve additional physical material presets, bringing the catalogue to twenty.
- Replaced the inline preset strip with a touch-friendly grid opened by a presets icon; sphere thumbnails preview color, surface texture, roughness, metalness, transmission, and coat characteristics. Cris accepted the new materials and previews, then reported the gallery did not scroll.
- Release 0.1.2 makes the expanded material panel the single vertical scroll owner on touch devices; the nested gallery scroller was removed.
- Preset selection applies to the currently selected material surface in the Helios render session. BoxLab project and mesh data remain outside Helios ownership.

## Current architectural owners

- UI and application state: `src/App.tsx` and `src/components/BottomDock.tsx`.
- Built-in defaults and presets: `src/data/presets.ts`.
- Three.js scene and path tracing: `src/engine/StudioEngine.ts` and `src/engine/pathTracer.ts`.
- Dependency resolution is pinned by `bun.lock`.

## Next

Cris to verify scrolling through all twenty preset cards on iPad portrait and landscape, then apply a lower-row material. Continue coordinated development with BoxLab; clean render export remains BoxLab-specific.
