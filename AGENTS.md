# AGENTS.md

## Project Context

Luminary is a lightweight, dependency-free JavaScript component library built on native web standards:

- Custom Elements v1
- Shadow DOM
- Standard browser APIs only

Primary product goals:

- Framework-agnostic component consumption
- Stable and predictable component APIs
- Strong accessibility defaults
- Small runtime footprint with zero runtime dependencies

Out of scope for v1:

- Framework wrappers (React, Vue, Angular)
- TypeScript source conversion
- Legacy browser support beyond evergreen targets

## Source of Truth and Directory Rules

Use this repository layout and ownership model:

- `src/components/`: Source of truth for components, one component per file
- `dist/`: Generated build artifacts only; do not hand-author
- `examples/`: Manual QA playground and demos
- `scripts/`: Internal helper scripts called by npm scripts only
- `docs/`: Product and architecture documentation

Expected structure target from architecture docs:

- `src/components/lum-*.js` (component implementations)
- `src/index.js` (library entry that registers/exports public components)
- `vite.config.js` (Vite library-mode build config)
- `package.json` scripts as task entry points

## Exact Commands

Use npm scripts as the only supported task entry points.

Required local workflow commands:

- `npm install`
- `npm run dev`
- `npm run test`
- `npm run build`
- `npm run preview`

Required release validation sequence:

1. `npm run verify:package`
2. `npm run test`
3. `npm run build`
4. `npm run release:prepare`

Script execution policy:

- Run tasks via `npm run <script-name>`
- Do not execute files in `scripts/` directly
- CI must also call npm scripts, not script file paths

## Code Style and Authoring Standards

Language and dependencies:

- Plain JavaScript only
- Zero runtime dependencies

Component standards:

- Every public component tag must use the `lum-` prefix
- File naming must be kebab-case and match tag name (example: `lum-button.js`)
- Class naming must be PascalCase (example: `LumButton`)
- Components must extend `HTMLElement`; if user specifies differently, default to user.
- Components must attach Shadow DOM in constructor
- Styles must live inside Shadow DOM

Reactive API rules:

- User-configurable behavior must be represented by attributes
- Reactive attributes must be listed in `observedAttributes`
- `attributeChangedCallback` must update rendered/derived state
- Property setters should mirror attributes when ergonomic

Lifecycle rules:

- `constructor`: initialize defaults and attach shadow root only
- `connectedCallback`: add listeners/observers/side effects
- `disconnectedCallback`: clean up listeners/observers/timers

Events and slots:

- Custom event names use `lum-` prefix
- Cross-shadow integration events should use `bubbles: true` and `composed: true`
- Slot behavior and fallback must be defined and documented

Styling and theming:

- Public theming tokens must use `--lum-` prefix
- Component token pattern: `--lum-{component}-{token}`
- Standardize style customization on CSS custom properties
- Do not expose `part` as a default public styling contract
- Allow `part` only by explicit, documented exception when tokens cannot cover a required use case
- Do not expose internal class names as public contract

Accessibility baseline:

- Interactive controls must be keyboard operable
- Prefer native elements where possible
- Reflect required ARIA states/labels
- Maintain visible focus styles and adequate contrast

Documentation requirement per component:

- Method and Class names must be descriptive of function
- JSDoc block describing tag, attributes, slots, and events
- Usage examples and API docs for attributes/properties/events/slots/tokens

## Build and Architecture Rules

Build system constraints:

- Use Vite library mode
- Produce ESM, CJS, and IIFE outputs from shared source
- Keep output predictable and stable

Expected build artifacts:

- `dist/luminary.esm.js`
- `dist/luminary.cjs.js`
- `dist/luminary.iife.js`
- Sourcemaps for each output

Packaging requirements:

- Include package metadata: name, version, description, license, repository, maintainers
- Provide `main`, `module`, and `exports` map
- Include files array for publish contents (`dist`, `README.md`, `LICENSE`)
- Follow semantic versioning strictly

## Git Allowances and Restrictions

Allowances:

- When starting new work, always create a feature branch
  - Branch naming pattern
    - With ticket number `feature/#<ticket-number>/<short-3-6-word-description>`
    - Without ticket number `task/<short-3-6-word-description>`
    - If user defines branch name, use that

Restrictions:

- Do not commit anything to the repository; user is responsible for git commits
- Do not push anything to the repository; user is responsible for git pushes
- Do not bypass npm script entry points for project tasks
- Do not hand-edit generated artifacts in `dist/`
- Do not introduce runtime framework dependencies
- Do not introduce non-`lum-` public component tags
- Do not ship breaking API changes without semver major bump and migration notes

Release branch policy:

- Release only from changes merged to `main`
- Before release, pass package verification, tests, and build commands in order
- Tag and document releases with changelog/release notes

## Quality Gates

Before considering work complete:

- Build passes
- Tests pass
- Public API changes are documented
- Accessibility-critical behavior is validated
- Theming tokens and events are documented and stable
