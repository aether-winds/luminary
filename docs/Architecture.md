# Engineering Architecture Document (EAD)

## Document Control

- Product: Luminary Components Library
- Repository: aether-winds/luminary
- Date: 2026-05-30
- Status: Draft v0.1
- Owners: Engineering
- Companion Document: PRD

## 1. Purpose

This document defines the technical foundation, build and release flow, testing strategy, and development workflow for Luminary.

Luminary is a dependency-free component library built with native web platform APIs:

- Custom Elements v1
- Shadow DOM
- Standard browser APIs only (no runtime framework dependency)

## 2. Scope and Non-Goals

### In scope

- Repository layout and component placement
- Component authoring standards and public API conventions
- Shadow DOM styling and theming conventions
- Vite library-mode build architecture and output formats
- Packaging verification and future release workflow
- Testing strategy and quality gates
- Developer experience and local workflow
- CI/CD considerations for build, test, and future publish

### Out of scope

- Framework wrapper packages in v1 (React, Vue, Angular)
- Legacy browser support beyond documented evergreen targets

## 3. Architecture Principles

- Standards first: Use browser standards over framework abstractions.
- Zero runtime dependencies: Keep install size and attack surface minimal.
- Stable public API: Attributes, properties, events, and slots are the product contract.
- Encapsulation by default: Component styles are isolated in Shadow DOM.
- Theming by contract: Expose CSS custom properties with the --lum- prefix.
- Predictable build outputs: ESM, CJS, and IIFE from one source.

## 4. Project Directory Structure

Target project layout:

```text
luminary/
├── src/
│   └── components/
│       ├── lum-element.component.ts
│       ├── lum-button/
│       │   ├── index.ts
│       │   ├── lum-button.component.ts
│       │   ├── lum-button.test.ts
│       │   ├── lum-cancel-button.component.ts
│       │   ├── lum-cancel-button.test.ts
│       │   ├── lum-accept-button.component.ts
│       │   ├── lum-accept-button.test.ts
│       │   ├── lum-submit-button.component.ts
│       │   └── lum-submit-button.test.ts
│       └── ...
├── dist/
│   ├── luminary.esm.js
│   ├── luminary.cjs.js
│   ├── luminary.iife.js
│   └── *.css (if emitted)
├── examples/
│   ├── index.html
│   └── demos/
├── scripts/
│   └── ...
├── docs/
│   ├── PRD.md
│   ├── Architecture.md
|   └── ...
├── .editorconfig
├── package.json
├── vite.config.js
├── LICENSE
├── README.md
└── ...
```

Directory responsibilities:

- src/components/: Source of truth, organized by component families.
- src/components/lum-{component}/: Primary component plus alternative component variants.
- dist/: Build outputs only, generated artifacts.
- examples/: Local demos and manual QA playground.
- scripts/: Internal helper scripts invoked only via package.json scripts (not run directly).
- docs/: Product and engineering documentation.

Script execution policy:

- All project task entry points must be defined in package.json under scripts.
- Contributors and CI should run tasks with `npm run <script-name>`.
- Files in scripts/ are implementation details and are not intended to be executed directly.

## 5. Component Authoring Standards

### 5.1 File and naming conventions

- Component files use the `lum-*.component.ts` naming convention (example: `lum-button.component.ts`).
- Test files use the `lum-*.test.ts` naming convention and are co-located with their component (example: `lum-button.test.ts`).
- Other file types follow the `lum-*.component.*` convention where the extension denotes the file type (example: `lum-button.component.html`, `lum-button.component.css`).
- Specialized file types use a descriptive type segment (example: `lum-*.service.ts`). New type segments must be proposed to and approved by the team before use.
- Tag naming: `lum-` prefix required for all public components.
- Class naming: PascalCase, for example `LumButton`.
- Component families live in per-component folders (for example `src/components/lum-button/`).
- Export strategy: Default export of the class and optional named exports.

### 5.2 Base component shape

Every public component inherits from LumElement, and LumElement extends HTMLElement. Component variants inherit from their primary component.

Required inheritance chain example: `HTMLElement -> LumElement -> LumButton -> LumCancelButton`

### 5.3 Attribute and property rules

- Any user-configurable behavior must be represented by an attribute.
- Property setters should mirror attributes where it improves ergonomics.
- All reactive attributes must be listed in observedAttributes.
- attributeChangedCallback should update rendered state or internal derived state.

### 5.4 Lifecycle expectations

- constructor: attach shadow root, initialize defaults only.
- connectedCallback: register listeners, observers, and side effects.
- disconnectedCallback: clean up listeners, observers, timers.
- adoptedCallback: optional for advanced cross-document moves.

### 5.5 Events and slots

- Event names use lum- prefix for custom semantics, for example lum-change.
- Events crossing shadow boundaries should be bubbles: true and composed: true.
- Components with projected content define slot behavior and fallback content.

### 5.6 Accessibility baseline

- Interactive controls must be keyboard-operable.
- Use native elements when possible for built-in semantics.
- Reflect disabled/expanded/selected states via ARIA where required.
- Ensure visible focus styles and adequate default contrast.

## 6. Shadow DOM Styling and Theming Conventions

- All component styles live in shadow root style blocks.
- Public theming hooks are CSS custom properties prefixed with --lum-.
- Avoid exposing internal class names as external contracts.
- CSS custom properties are the default and preferred public styling API.
- Do not expose part attributes as a standard customization contract in v1.
- part may be added only as an explicit exception when a required styling use case cannot be covered by documented tokens.

Theming conventions:

- Component token names follow --lum-{component}-{token}.
- Provide sensible defaults inside :host.
- Document every theming token in component docs.
- Tokens should map to semantic design decisions (for example: surface, text, border, radius, spacing) instead of implementation-only internals.

part exception policy:

- Any part usage must be justified in component documentation with the unmet use case.
- If a part is introduced, document it as an advanced, non-default extension point.
- Prefer adding or refining tokens before introducing any part exposure.

Example token naming:

- --lum-button-bg
- --lum-button-color
- --lum-input-border-color
- --lum-modal-z-index

## 7. Build Architecture (Vite Library Mode)

### 7.1 Build goals

- Generate three outputs from shared source:
  - ESM for modern bundlers
  - CJS for legacy Node/CommonJS consumers
  - IIFE for direct browser script usage

### 7.2 Entry strategy

- Main entry file (for example src/index.ts) imports and registers all shipped components.
- Optional per-component entry points can be added later for tree-shaking.

Setup guidance:

1. Create src/index.ts and export/register the public components from that entry.
2. Add Vite as a dev dependency and place the config in vite.config.js.
3. Add standard package scripts so contributors can run the expected workflow.

Recommended package scripts:

```json
{
  "scripts": {
    "dev": "vite --config vite.examples.config.js",
    "test": "vitest run",
    "typecheck": "tsc --noEmit",
    "build": "vite build",
    "build:examples": "vite build --config vite.examples.config.js",
    "preview": "npm run build && npm run build:examples && vite preview --config vite.examples.config.js --host",
    "verify:package": "sh ./scripts/verify-package.sh"
}
```

Script design guidance:

- Human-facing command names belong in package.json scripts.
- package.json scripts may call scripts/* helpers as internal implementation.
- CI jobs should call npm run commands instead of executing scripts/* paths directly.

### 7.3 Proposed Vite configuration

```js
import { defineConfig } from "vite";
import path from "node:path";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "Luminary",
      formats: ["es", "cjs", "iife"],
      fileName: (format) => {
        if (format === "es") return "luminary.esm.js";
        return `luminary.${format}.js`;
      }
    },
    outDir: "dist",
    sourcemap: true,
    emptyOutDir: true,
    rollupOptions: {
      output: {
        exports: "named"
      }
    }
  }
});
```

### 7.4 Artifact expectations

- dist/luminary.esm.js
- dist/luminary.cjs.js
- dist/luminary.iife.js
- sourcemaps for each build output

### 7.5 Environment configuration

- Luminary uses a project-specific configuration namespace named `LumConfig` for build-time environment settings.
- Environment files are the primary source of truth, with `.env.development` and `.env.production` defining the default behavior for local development and production builds.
- Script-level overrides are reserved for edge cases, not as the main configuration mechanism.
- Vite is responsible for resolving and injecting the final configuration value during dev-server startup and library builds.
- Logging is build-time controlled for the shipped artifact: development keeps `info` and `trace` visible, while production keeps `warn` and `error` only.
- Future feature flags should extend `LumConfig` rather than introducing separate ad hoc configuration paths.

## 8. Packaging and Release Workflow

### 8.1 Required package metadata

Required package.json fields:

- name
- version
- description
- license (MIT)
- repository
- author or maintainers
- main (CJS)
- module (ESM)
- exports map
- files array
- sideEffects (set intentionally)

Example files array:

```json
{
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ]
}
```

### 8.2 Local verification sequence

1. Run npm run test.
2. Run npm run build.
3. Validate package contents with npm run verify:package.

Release status:

- Tagging and publishing are handled via GitHub pipeline.
- Release governance and publish automation are being finalized.

### 8.3 Versioning policy

- Follow SemVer strictly.
- Breaking public API changes require major version bump and migration notes.
- New backward-compatible features use minor bumps.
- Fixes use patch bumps.

## 9. Testing Strategy

### 9.1 Test layers

- Unit/component behavior tests: Vitest + jsdom.
- Browser interaction and regression tests: Playwright (optional but recommended).
- Build validation tests: verify dist artifacts and import paths.

### 9.2 Minimum quality gates

- Attribute-to-render behavior verified for each component.
- Event contract tests for event names and payload shape.
- Accessibility checks for keyboard interaction and ARIA-critical behavior.
- Smoke tests for ESM, CJS, and IIFE consumption.

### 9.3 Suggested test structure

Test files are co-located with their component inside the component family folder:

```text
src/
└── components/
    ├── lum-element.component.ts
    └── lum-button/
        ├── index.ts
        ├── lum-button.component.ts
        ├── lum-button.test.ts
        ├── lum-cancel-button.component.ts
        ├── lum-cancel-button.test.ts
        └── ...
```

## 10. Developer Experience and Workflow

### 10.1 Local setup

1. Install dependencies with npm install.
2. Start dev playground with npm run dev.
3. Author components in src/components.
4. Validate in examples playground with hot reload.
5. Run npm test and npm run build before opening a pull request.

### 10.2 Contributor workflow

- One focused change per pull request.
- Include docs updates when APIs/events/tokens change.
- Add tests for behavior changes.
- Keep component contracts stable and explicit.

### 10.3 Manual QA workflow

- Verify component behavior in examples page.
- Verify keyboard-only interaction paths.
- Verify default theme and CSS variable overrides.
- Verify rendering in Chromium, Firefox, and Safari.

## 11. CI/CD Considerations

### 11.1 Branching

- `main` is the protected production branch.
- Feature branches are created from `main`.
- The following branch naming conventions should be used for all new branches:
  - `feature/#<ticket-number>/<short-3-6-word-description>` — for work associated with a ticket
  - `task/<short-3-6-word-description>` — for work without a ticket number

Development workflow:

1. Create a feature branch from `main`.
2. Push branch to `origin`.
3. Implement and validate changes (see Section 10.1).
4. Open pull request into `main`.
5. Merge after required approvals and passing CI checks.

Release workflow:

1. Merge release-ready changes into `main`.
2. Tag version with SemVer format `vX.Y.Z`.
3. Trigger release pipeline from the version tag.

### 11.2 Pull request pipeline

On each pull request:

- npm ci
- npm run lint (if configured)
- npm test
- npm run build
- npm run verify:package
- Upload build artifacts (optional)

### 11.3 Release pipeline

On version tag or workflow_dispatch:

- Re-run test and build gates
- Run package verification through npm run verify:package
- Publish step intentionally disabled until governance is finalized
- Create GitHub release notes (optional)

### 11.4 GitHub Actions outline

- ci.yml: run checks on push and pull_request
- release.yml: publish package after protected release trigger

## 12. Security and Supply Chain Basics

- Use npm ci in CI for lockfile reproducibility.
- Restrict npm token permissions to package publish scope.
- Protect main branch with required status checks.
- Enable dependency and secret scanning in GitHub settings.

## 13. Risks, Tradeoffs, and Mitigations

- Risk: API drift across components.
  - Mitigation: shared authoring checklist and test templates.
- Risk: Inconsistent accessibility quality.
  - Mitigation: enforce a11y acceptance checks in PR template and CI.
- Risk: Styling token sprawl.
  - Mitigation: token naming conventions and documentation review.
- Risk: Build output incompatibilities.
  - Mitigation: smoke tests for each distribution format.

## 14. Roadmap Hooks

Post-v1 architecture extensions:

- Optional per-component subpath exports for improved tree-shaking.
- Optional framework adapters as separate repositories/packages.
- Automated visual regression testing for examples.

## 15. Acceptance Criteria Mapping

- Project structure defined: Section 4.
- Component authoring standards documented: Section 5.
- Shadow DOM and styling conventions established: Section 6.
- Vite library-mode build documented: Section 7.
- Release readiness and deferred publishing workflow documented: Section 8.
- Testing strategy defined: Section 9.
- Developer experience documented: Section 10.
- CI/CD considerations outlined: Section 11.
