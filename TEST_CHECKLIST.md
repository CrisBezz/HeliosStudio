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
