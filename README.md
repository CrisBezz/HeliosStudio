# Helios Studio

**Release:** 0.1.3

**Live app:** [https://crisbezz.github.io/HeliosStudio/](https://crisbezz.github.io/HeliosStudio/)

Real-time GPU path tracing and interactive PBR lighting preview studio for 3D modeling workflows on iPad and desktop browsers.

## Features

- **WebGL2 GPU Path Tracer**: Interactive BVH-accelerated Monte Carlo path tracer with progressive sample accumulation, joint-bilateral denoiser, ACES filmic tone mapping, and multiple lighting environments (`Studio`, `Golden Hour`, `Architectural Loft`, `Cornell Box`, `Obsidian`).
- **Live PBR & Split Comparison Modes**: Switch between real-time Three.js PBR viewport, progressive Ray Trace mode, and interactive Split wipe comparison.
- **3D Studio Light Rig**: Up to 4 independent studio lights with azimuth/elevation/distance controls, soft area light radius, Kelvin color temperature or custom hex tint, and 3D transform gizmos.
- **PBR Texture Maps & Custom Model Import**:
  - Built-in procedural PBR material presets (`Brushed Grain`, `Carbon Weave`, `Vulcanite Grip`, `Guilloché Dial`, `Board Concrete`, `Cedar Timber`, `Honed Marble`) with Albedo, Tangent Normal, and Roughness maps.
  - Twenty-eight physical material presets, including metals, glass, woods, stone, brick, terrazzo, ceramic tile, plaster, concrete, and weathered steel, shown in a graphical preview grid.
  - Import `.glb`, `.gltf`, `.obj`, and `.stl` models or upload custom PBR texture maps per surface, with automatic 3D UV seam feathering and atlas gutter dilation.
- **iPad-Ready Touch Viewport**: Responsive touch orbit/dolly/pan gestures, tap-to-inspect materials and lights, camera presets, Clay shading mode, turntable preview, and PNG snapshot export.

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Helios Studio is built and published from this repository. Pushes to `main` run
the GitHub Actions Pages workflow; local development and `npm run build` use `/`,
while the Pages workflow builds with `/HeliosStudio/` as the asset base.

## Scripts

- `npm run dev` — Start the Vite development server on port 3000
- `npm run build` — Build the production bundle into `dist/`
- `npm run preview` — Preview the production build locally
- `npm run lint` — Type-check with TypeScript (`tsc --noEmit`)
