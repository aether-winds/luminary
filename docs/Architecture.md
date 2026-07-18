# Engineering Architecture Document (EAD)

## Document Control

- Product: Luminary Components Library
- Repository: aether-winds/luminary
- Date: 2026-07-18
- Status: Draft v0.2
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
- Build architecture and output formats
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
- Predictable build outputs: ESM is the current output format; multi-format output (ESM, CJS, and IIFE) is planned.

## 4. Project Directory Structure

This repository uses npm workspaces and is organized as a monorepo with two workspace packages.

Workspace layout:

```text
luminary/
├── components/                    (@aether-winds/luminary-components)
│   ├── dev/                       (dev build output, generated, gitignored)
│   ├── dist/                      (prod build output, generated, gitignored)
│   ├── src/
│   │   └── index.ts
│   ├── package.json
│   ├── tsconfig.base.json
│   ├── tsconfig.dev.json
│   ├── tsconfig.prod.json
│   └── tsconfig.json
├── dev-server/                    (@aether-winds/luminary-dev-server)
│   ├── src/
│   │   └── site/
│   │       └── index.html
│   ├── dev-server.config.cjs
│   └── package.json
├── docs/
│   ├── PRD.md
│   └── Architecture.md
├── .editorconfig
├── .gitignore
├── package.json
├── package-lock.json
└── LICENSE
```

Directory responsibilities:

- `components/`: The component library source and build outputs. Published as `@aether-winds/luminary-components`.
- `components/src/`: TypeScript source files for all components.
- `components/dev/`: Dev build output compiled with source maps (gitignored). Used during local contributor workflows.
- `components/dist/`: Production build output (gitignored). Consumed by library users.
- `dev-server/`: Local development server. Not published; for contributor use only.
- `dev-server/src/site/`: Static HTML pages for manual QA and component preview.
- `docs/`: Product and engineering documentation.

Script execution policy:

- All project task entry points must be defined in `package.json` under `scripts`.
- Contributors and CI should run tasks with `npm run <script-name>` from the workspace root.
- Workspace-level scripts can also be targeted directly with `npm run <script-name> --workspace=<workspace-name>`.

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

## 7. Build Architecture

### 7.1 Build tool

The `components` package is compiled by the TypeScript compiler (`tsc`). There is no bundler in the current stack. The build produces native ESM output.

Multi-format output (ESM, CJS, and a browser-ready IIFE) is planned for a future milestone.

### 7.2 Build configurations

The `components/` package uses a layered TypeScript configuration:

| File | Purpose |
|------|---------|
| `tsconfig.base.json` | Shared compiler options (rootDir, module, target, strict flags, etc.) |
| `tsconfig.dev.json` | Extends base; outputs to `components/dev/` with source maps and declaration maps |
| `tsconfig.prod.json` | Extends base; outputs to `components/dist/` without source maps |
| `tsconfig.json` | Extends `tsconfig.dev.json`; used as the primary config for IDE tooling |

### 7.3 Build outputs

| Mode | Output directory | Source maps | Declaration maps |
|------|-----------------|-------------|------------------|
| Development | `components/dev/` | Yes | Yes |
| Production | `components/dist/` | No | No |

`components/dist/` and `components/dev/` are gitignored.

### 7.4 Package exports

The `components/package.json` uses conditional exports to route imports to the appropriate build output:

- The `default` condition resolves to `components/dist/` (production build).
- The `development` condition resolves to `components/dev/` (dev build with source maps) not intended for production.

The `development` condition is non-standard and is not resolved automatically by Node.js. It is activated explicitly via the `--conditions=development` flag passed to `npm run`. This provides a path for tooling that needs to consume the development build during contributor workflows.

### 7.5 Entry strategy

- The main entry point is `components/src/index.ts`.
- This file exports and registers all public components.
- Optional per-component entry points may be added later for tree-shaking.

### 7.6 Development workflow

The workspace root `package.json` provides scripts to orchestrate the local development workflow:

| Script | Description |
|--------|-------------|
| `npm run dev` | Runs `dev:components` and `dev:server` concurrently |
| `npm run dev:components` | Compiles the components package in watch mode to `components/dev/` |
| `npm run dev:server` | Starts the BrowserSync development server |

The dev server (`@aether-winds/luminary-dev-server`) is configured via `dev-server/dev-server.config.cjs`:

- Serves `dev-server/src/site/` as the web root.
- Statically serves `components/dev/` at the `/luminary-components` route.
- Watches both `dev-server/src/site/` and `components/dev/` for live reload.

Script design guidance:

- Human-facing command names belong in package.json scripts.
- package.json scripts may call scripts/* helpers as internal implementation.
- CI jobs should call npm run commands instead of executing scripts/* paths directly.

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

- Unit/component behavior tests: Jest + jsdom.
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
components/src/
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
- Build architecture documented: Section 7.
- Release readiness and deferred publishing workflow documented: Section 8.
- Testing strategy defined: Section 9.
- Developer experience documented: Section 10.
- CI/CD considerations outlined: Section 11.
