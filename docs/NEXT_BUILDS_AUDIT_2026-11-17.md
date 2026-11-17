# Helios Studio next-build audit — 17 November 2026

The detailed coordinated audit covers both repositories, current release evidence, confirmed findings, per-build scope and exit criteria:

[BoxLab and Helios Studio detailed audit](https://github.com/CrisBezz/BoxLab/blob/main/docs/NEXT_BUILDS_AUDIT_2026-11-17.md)

Audited standalone main: `d9d7df4ba5d0ad18f1f1219885326f79fdb477e9`, release0.1.4, runtime`0e79c5163e5d87703d369250e1a9fff9e2b9085f`. Pages43663848502 and43663949379 succeeded with locked Bun install, type-check and build. No fresh local standalone build or physical iPad test was performed for this source audit; local Bun is unavailable. Existing .1.4 device checklist remains unresolved in this repository; BoxLab's upstream acceptance wording differs. Do not infer a new PASS from this audit.

## Recommended queue

| Order | Narrow build | Completion evidence |
|---|---|---|
| H1 / suggested0.1.5 | Correct eight-slot custom-texture allocation/release and rollback; add executable behavior tests and CI step. | Ninth material cannot overwrite the first; a freed non-next slot is reused safely; failed import preserves old scene/texture bookkeeping. |
| H2 / suggested0.1.6 | Guard asynchronous model/map decode and publication with request/scene/material identity. | Slow A→fast B, upload→Restore, scene switch, failed load and disposal cannot publish stale assets; abandoned resources freed. |
| H3 / suggested0.1.7 | Selectively backport BoxLab's independent Metalness map and packed-channel preservation, then non-emissive scalar opacity. Split if needed. | Roughness/metalness independence, PBR/trace parity, Reset and emitter independence. |
| H4 | Preserve grouped/source materials and declare supported import limits. | Multi-material mesh, glass/emissive source, separate scalar maps and overflow fixtures. |
| H5 | Save/reload bounded render setups with camera, lights, materials, transforms and asset linkage. | Reload fidelity, missing/malformed assets, quota/budget behavior, no source geometry mutation. |
| H6 | Dedicated output resolution/aspect/quality controls around existing PNG capture. | Clean image at requested dimensions, no overlays, preview restored on cancel, bounded memory and native iPad check. |
| H7 | Opacity/cutout and AO/ORM map support using established owners. | Both renderers, channel semantics, upload/Restore/save/capacity checks; no unnecessary new arrays. |
| H8 | Controlled geometric displacement experiment. | Actual silhouette/shadow/depth changes distinguished from normal/parallax shading; bounded tessellation/BVH/memory. |

## Confirmed code findings

- `textures.ts`: MAX_CUSTOM_LAYERS8, custom maps1024px. Actual allocator execution with non-GPU dependencies returns layers100…107,100 for nine allocations. It wraps into an occupied slot. Standalone upload and model import do not provide a complete capacity/ownership policy. BoxLab's same allocator is affected, although its direct-upload wrapper partially guards capacity.
- `StudioEngine.loadCustomFile()` clears live texture allocation bookkeeping before awaiting import; no request-generation guard before installation. `uploadMaterialTexture()` allocates before decoding and publishes after the await without a scene/material token. Timing-specific visible corruption is a risk requiring tests, not an iPad reproduction claimed here.
- `models.ts` selects the first material of arrays and redirects beyond20 imported materials to the first. It initializes transmission0, IOR1.5, clearcoat0.1 and emissive intensity0 rather than preserving those source fields. Test supported GLTF material fidelity before adding more maps.
- `package.json` has build and type-check but no behavior-test command; Pages does not run material/import behavior tests.
- No setup serializer was found. Existing PNG snapshot is not a saved rendering setup.
- Three eight-layer1024² RGBA custom arrays require96MiB CPU backing storage when allocated; preset backing arrays add10.5MiB. GPU/mipmap/Three-map cache/render-target/BVH/decode memory is additional, not measured total RAM. Do not simply raise the layer cap or texture size.

BoxLab vendor provenance is standalone0.1.4 plus .1166 metalness and .1168 surface opacity; preset catalogue, preview helper, BVH and UV cleanup currently match, while models/textures/tracer/types differ. Never overwrite the vendor folder wholesale with this older standalone source. Fix shared owners here first, port accepted changes separately, and keep editable BoxLab project data separate from Helios render-session state.

This is a documentation-only audit. Runtime release markers remain0.1.4; none of the queued changes is implemented or claimed tested by this document. Existing UI/gallery/reset and renderer owners remain protected.
