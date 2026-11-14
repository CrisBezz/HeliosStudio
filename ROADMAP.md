# Helios Studio Roadmap

## Current

- Release 0.1.2 repairs scrolling in the material preset gallery after Cris accepted the catalogue/previews and reported that the menu would not scroll. The expanded material panel now owns vertical touch scrolling. GitHub Pages run `43560460679` succeeded for commit `d323550`; iPad touch acceptance is pending.

- Repository-owned development and GitHub Pages publishing.
- GitHub Pages publishing source corrected to GitHub Actions; refreshed live render confirmed by Cris.
- 512 spp render quality option.
- Reset controls for selected lighting and material properties.
- Twenty graphical material presets presented in a grid and applied to the selected surface for the current render session.

## Next builds

1. Validate that the expanded material panel scrolls through all twenty cards on iPad portrait and landscape; select a preset near the end of the grid.
2. Continue adding materials only when a distinct PBR appearance or procedural texture is supported.
3. **Done:** Port the material catalogue and gallery into BoxLab's existing Helios adapter.
4. Keep clean render output without interface as a BoxLab-specific feature.
