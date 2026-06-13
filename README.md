# Luminary

## Description

Luminary is an early-stage foundation for a dependency-free web component library built on native browser standards.

- Uses Custom Elements v1 and Shadow DOM.
- Targets framework-agnostic usage in plain HTML or app frameworks.
- Emphasizes stable public component contracts through attributes, properties, events, and slots.
- Prioritizes accessibility defaults and predictable behavior over broad feature surface.

This repository currently provides a starter component family (`<lum-button>`, `<lum-cancel-button>`, `<lum-accept-button>`, `<lum-submit-button>`) and the build, test, and example infrastructure needed to grow the library intentionally.

## Installation

Luminary is currently documented as a source-first project. Clone the repository and install dependencies locally.

```bash
git clone https://github.com/aether-winds/luminary.git
cd luminary
npm install
```

Requirements:

- Node.js 18+
- npm

## Usage

Import the local source entry to register/export components:

```js
import "./src/index.js";
```

Render a component in HTML:

```html
<lum-button label="Save"></lum-button>
<lum-cancel-button></lum-cancel-button>
```

Listen for component events:

```js
const button = document.querySelector("lum-button");

button.addEventListener("lum-button-click", (event) => {
  console.log("Luminary button activated", event.detail);
});
```

Customize via CSS design tokens:

```css
lum-button {
  --lum-button-bg: #0a7a6d;
  --lum-button-bg-hover: #07574f;
  --lum-button-fg: #ffffff;
  --lum-button-radius: 0.75rem;
}
```

## Architecture (Summary)

Luminary is structured around a small set of explicit layers:

- `src/components/lum-element.component.ts`: Abstract base element all components inherit from.
- `src/components/lum-{component}/`: Component family folders containing a primary component, alternatives, and co-located tests.
- `src/index.js`: Library entry that exports/registers public components.
- `examples/`: Manual QA playground.
- `docs/`: Product and architecture references.
- `scripts/`: Internal helpers invoked by npm scripts.
- `dist/`: Generated library artifacts (build output only).

Build architecture uses Vite library mode with sourcemaps and multiple output formats (ESM, CJS, IIFE) from shared source.

Roadmap direction: Luminary is intended to grow into a broader set of reusable UI primitives, but component expansion will remain incremental and quality-gated.

## Design Principles

- Standards first: Prefer browser-native platform capabilities over framework abstractions.
- Zero runtime dependencies: Keep runtime small, portable, and low maintenance.
- Stable API contracts: Treat attributes, properties, events, slots, and tokens as product surface.
- Encapsulation by default: Keep internals isolated with Shadow DOM.
- Theming by contract: Expose documented CSS custom properties with the `--lum-` prefix.
- Accessibility baseline: Ship keyboard-operable, semantic, and focus-visible interactive controls.

## Development

Use npm scripts as the only supported task entry points.

Start local development server for examples:

```bash
npm run dev
```

Run tests:

```bash
npm run test
```

Run static type checks (TypeScript on JavaScript sources):

```bash
npm run typecheck
```

Build library artifacts:

```bash
npm run build
```

Preview examples build locally:

```bash
npm run preview
```

Optional package validation check:

```bash
npm run verify:package
```

## Styleguide

Luminary component authoring follows these baseline conventions:

### Naming and structure

- Public tag names use the `lum-` prefix (example: `lum-button`).
- Component files use the `lum-*.component.ts` naming convention (example: `lum-button.component.ts`).
- Test files use the `lum-*.test.ts` naming convention and are co-located with their component file.
- Other file types follow the `lum-*.component.*` convention with the extension denoting the file type (example: `lum-button.component.html`).
- Specialized file types use a descriptive type segment (example: `lum-*.service.ts`). New type segments require team approval before use.
- Component classes are PascalCase and extend `HTMLElement` via `LumElement`.
- All public components inherit from the abstract `LumElement` base class.
- Alternative components inherit from the primary component in a family (`LumCancelButton` extends `LumButton`).

### API and reactivity

- User-configurable behavior is represented with attributes.
- Reactive attributes are listed in `observedAttributes`.
- Attribute changes update rendered or derived state.
- Property setters should mirror attributes where ergonomic.

### Accessibility and interaction

- Interactive components are keyboard operable.
- Prefer native semantic elements in shadow content.
- Keep visible focus styling and sensible contrast defaults.
- Emit integration events with `bubbles: true` and `composed: true` when needed across shadow boundaries.

### Theming contract

- Public theming tokens use the `--lum-` prefix.
- Token naming follows `--lum-{component}-{token}`.
- Prefer tokens as the primary customization API.

### Lifecycle discipline

- `constructor`: initialize defaults and attach shadow root.
- `connectedCallback`: register listeners/observers.
- `disconnectedCallback`: clean up listeners/observers/timers.
