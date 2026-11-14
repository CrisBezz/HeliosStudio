# Development History

## 2026-11-14 — Release 0.1.0

- Took repository-owned control of Helios Studio and published through GitHub Pages at https://crisbezz.github.io/HeliosStudio/.
- Added a 512 spp option to the existing ray-tracer quality control.
- Added reset-to-default controls for the selected light and selected material. Material defaults are captured whenever a built-in project or imported model is loaded; uploaded texture maps are retained when resetting material properties.
- User confirmed that the published render view displays correctly.
- The GitHub Actions production build and deployment completed successfully.
- After the reset-controls deployment, Cris reported that the page was blank. The repository's Pages source had reverted to main / root, so GitHub's branch publisher served the unbuilt source tree.
- Restored **GitHub Actions** as the Pages source and ran the custom build-and-deploy workflow (run 43544116013); the build and deployment succeeded.
- Cris confirmed the refreshed live render displays correctly after the publishing correction. Recorded as a protected PASS; the blank-page failure is resolved.
