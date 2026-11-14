## Release 0.1.3 — architectural material library

- [ ] In Materials, open the preset grid and confirm all twenty-eight labeled preview cards are present, including the eight new architectural presets.
- [ ] Apply Warm Limestone, Red Clay Brick, Spotted Gum, Terrazzo, Glazed Ceramic Tile, Lime Plaster, Weathered Corten Steel, and Polished Concrete to the selected surface; confirm each changes the render.
- [ ] Check brick bond, terrazzo chips, tile grout, limestone/plaster grain, and Corten mottling are visible in the ray-traced result and card previews.
- [ ] Scroll to the last card in portrait and landscape; confirm the preset panel remains scrollable and selection still closes the gallery.
- [ ] Confirm presets affect only the selected render-session material and do not change the source project.

Automated status for 0.1.3: `npm run lint` and `npm run build` pass locally; hosted Pages verification and touch/material acceptance are pending.

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
