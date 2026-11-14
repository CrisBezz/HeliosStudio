# Helios Studio Handoff

## Current state

- Repository: `CrisBezz/HeliosStudio`, branch `main`.
- Live app: https://crisbezz.github.io/HeliosStudio/
- GitHub Pages deploys through `.github/workflows/pages.yml`.
- Google AI Studio is no longer part of the development or publishing loop. The repository is the source of truth.
- Current release target: 0.1.3. Release 0.1.2 gallery scrolling is user-PASS protected; Pages remains on GitHub Actions.
- BoxLab `.1162` scroll repair is also user-PASS protected. Its catalogue currently has the shared 20 presets from Helios `.1.1`; port the new `.1.3` architecture presets to BoxLab in a separate BoxLab build after this Helios release is accepted.
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
- Release 0.1.3 adds eight architectural presets and six dedicated procedural PBR texture families to the existing texture-array owner. The gallery and previews remain in the existing preset UI.
- Preset selection applies to the currently selected material surface in the Helios render session. BoxLab project and mesh data remain outside Helios ownership.

## Current architectural owners

- UI and application state: `src/App.tsx` and `src/components/BottomDock.tsx`.
- Built-in defaults and presets: `src/data/presets.ts`.
- Three.js scene and path tracing: `src/engine/StudioEngine.ts` and `src/engine/pathTracer.ts`.
- Dependency resolution is pinned by `bun.lock`.

## Next

Cris to verify the eight new architectural finishes and gallery scrolling through all twenty-eight cards. Then port the accepted catalog and texture families to BoxLab while preserving its project/material boundary. Clean render export remains BoxLab-specific.
