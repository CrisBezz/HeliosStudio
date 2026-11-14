# Helios Studio AI Workflow

## Source of truth

- Develop on the repository's `main` branch. The repository and its live GitHub Pages site are authoritative.
- Do not rely on Google AI Studio state or chat history when it conflicts with repository contents.
- Preserve the existing Three.js and path-tracing owners. Repair or extend them instead of adding a second renderer.

## Before each build

1. Read `AI_HANDOFF.md`, `TEST_CHECKLIST.md`, recent relevant entries in `DEV_HISTORY.md`, and `ROADMAP.md`.
2. Inspect `main`, the current release marker in `package.json`, the live Pages workflow, dependency pins in `bun.lock`, and recent commits.
3. Audit existing UI and engine owners before implementing a feature.
4. Keep each build narrow and preserve unrelated user work.

## Build completion

- Update `package.json`'s version for a user-facing build and keep the README release marker aligned.
- Update the handoff, development history, test checklist, and roadmap where relevant.
- Run the repository's type-check and production build before publishing.
- Give Cris a short hands-on checklist. Record reported PASS results as protected; record FAIL results with the observed behavior and regression scope.
- Push to `main` when the active request authorizes publishing. GitHub Actions builds and deploys the Pages site from `main`.
