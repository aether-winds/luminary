# Luminary — Project Guidelines

## What Is Luminary?
Luminary is a lightweight, dependency-free NPM module that provides native web components for rapidly building web applications. Components are authored in vanilla JavaScript using the Custom Elements v1 spec with Shadow DOM for style encapsulation.

## Architecture

```
luminary/
├── src/
│   └── components/      # One file per web component (e.g., lum-button.js)
├── dist/                # Vite build output (ESM, CJS, IIFE)
├── examples/            # Dev playground and usage demos
└── scripts/             # Build and publish helpers
```

- Each component lives in its own file under `src/components/`.
- Components extend `HTMLElement`, use Shadow DOM, and follow the `lum-` tag prefix convention.
- No external dependencies — keep the runtime footprint at zero.

## Code Style

- **Language:** Plain JavaScript (no TypeScript).
- **Styling:** Shadow DOM only — all component styles live inside the shadow root. Use CSS custom properties (`--lum-*`) for theming and external customization.
- **Naming:** Component files use kebab-case matching the tag name (e.g., `lum-button.js` defines `<lum-button>`). Classes use PascalCase (e.g., `LumButton`).
- **No framework dependencies** — components must work standalone in any HTML page or framework context.

## Build and Test

```bash
npm install          # Install dev dependencies
npm run dev          # Start Vite dev server (examples playground)
npm run build        # Bundle components via Vite (library mode)
npm run test         # Run component tests
```

> Build tooling is Vite in library mode. Setup details are tracked in the Engineering Architecture Document issue on the [Luminary GitHub Project](https://github.com/users/aether-winds/projects/8).

## Conventions

- Components register themselves via `customElements.define('lum-<name>', Lum<Name>)` at the bottom of their file.
- Use `observedAttributes` + `attributeChangedCallback` for reactive props — avoid storing mutable state outside the class.
- CSS custom properties must use the `--lum-` prefix to avoid collisions.
- Each component should include a JSDoc block describing its tag name, attributes, slots, and fired events.

## Project Management

- GitHub Project board: [Luminary (project #8)](https://github.com/users/aether-winds/projects/8)
- Key documents being produced (tracked as issues on the project board):
  - **PRD** — Product Requirements Document defining scope, users, and success metrics
  - **Engineering Architecture Document** — Technical foundation, Vite config, publishing workflow
- License: MIT

## Framework Compatibility

Currently framework-agnostic (pure web components). Optional framework wrappers (React, Vue, etc.) are undecided and should not be assumed in implementation unless explicitly requested.
