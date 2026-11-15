# Helios Studio Roadmap

## Current

- Helios Studio 0.1.3's twenty-eight material presets and scrollable gallery are user-PASS protected.
- Release 0.1.4 adds live texture-map previews and replacement, UV offset/scale/rotation, normal relief strength and emitter-opacity control. It extends the existing texture manager and path tracer.
- Current height relief is carried by tangent-space normal maps; ray geometry and silhouettes are unchanged.
- Package and README markers are 0.1.4; `bun.lock` is unchanged because no dependencies were added.

## Next-build ideas

1. After 0.1.4 acceptance, add a true height/displacement path. Compare UV-space parallax relief with tessellated/BVH displacement using a repeatable test scene and iPad memory/performance measurements before choosing an approach.
2. Add optional ambient-occlusion and packed ORM map support with previews and channel selectors.
3. Add per-map enable, strength and reset controls, and allow saving/reloading material setups in Helios without writing to BoxLab project data.
4. Keep standalone Helios material ownership here; port accepted features to BoxLab in a separate BoxLab build when requested.

