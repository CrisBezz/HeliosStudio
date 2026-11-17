## 17 November 2026 — coordinated source audit and recommended queue

See [Helios next-build audit](docs/NEXT_BUILDS_AUDIT_2026-11-17.md) and its linked detailed cross-repo report. Recommended next standalone0.1.5: fix custom-texture slot ownership/release/rollback with executable behavior tests, followed by async request/scene guards, selective backport of BoxLab metalness/surface-opacity improvements, import fidelity, then saved render setups. Actual allocator method reproduced layers100…107,100 for9 allocations in both repositories. Existing .1.4 Pages/type-check/build runs43663848502/43663949379 successful; no fresh local build or device test claimed. Reconcile standalone .1.4 pending acceptance text with BoxLab upstream-base acceptance wording; do not infer a new PASS. Audit only—runtime remains0.1.4; no new material/renderer changes. Preserve existing gallery/device PASSes. Avoid wholesale vendor replacement or immediate unbounded displacement.

# Helios Studio Roadmap

## Current

- Helios Studio 0.1.3's twenty-eight material presets and scrollable gallery are user-PASS protected.
- Release 0.1.4 adds live texture-map previews and replacement, UV offset/scale/rotation, normal relief strength and emitter-opacity control. It extends the existing texture manager and path tracer.
- Current height relief is carried by tangent-space normal maps; ray geometry and silhouettes are unchanged.
- Package and README markers are 0.1.4; `bun.lock` is unchanged because no dependencies were added. Pages run `43663848502` passed type-check, production build and deploy. User device acceptance is pending.

## Next-build ideas

1. After 0.1.4 acceptance, add a true height/displacement path. Compare UV-space parallax relief with tessellated/BVH displacement using a repeatable test scene and iPad memory/performance measurements before choosing an approach.
2. Add optional ambient-occlusion and packed ORM map support with previews and channel selectors.
3. Add per-map enable, strength and reset controls, and allow saving/reloading material setups in Helios without writing to BoxLab project data.
4. Keep standalone Helios material ownership here; port accepted features to BoxLab in a separate BoxLab build when requested.

