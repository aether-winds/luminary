# luminary

A lightweight, dependency-free web component library built on native browser standards.

## Installation

```bash
npm install
```

## Local Development

```bash
npm run dev
```

This starts the example playground at `examples/index.html`.

## Build, Test, and Release Validation

```bash
npm run test
npm run build
npm run preview
npm run verify:package
npm run release:prepare
```

## Usage

```js
import "@aether-winds/luminary";
```

```html
<lum-button label="Save"></lum-button>
```

## Starter Component API

### `<lum-button>`

- Attributes:
- `label`: Button text when no slotted content is provided.
- `disabled`: Disables interaction when present.
- `variant`: Visual variant. Supported values: `primary`, `secondary`.
- Event:
- `lum-button-click`: Fired on user activation. Event bubbles and crosses shadow boundary.
- Tokens:
- `--lum-button-bg`
- `--lum-button-bg-hover`
- `--lum-button-fg`
- `--lum-button-radius`

## Scripts

- `npm run dev`: Serve the example app.
- `npm run test`: Run Vitest unit tests.
- `npm run preview`: Build and preview the example app.
- `npm run release:prepare`: Run release-readiness checks.
