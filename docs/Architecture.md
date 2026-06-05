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
- NPM publishing and release workflow
- Testing strategy and quality gates
- Developer experience and local workflow
- CI/CD considerations for build, test, and publish

### Out of scope

- Framework wrapper packages in v1 (React, Vue, Angular)
- TypeScript source conversion
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
│       ├── lum-button.js
│       ├── lum-input.js
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
│   ├── release.sh
│   └── verify-package.sh
├── docs/
│   ├── PRD.md
│   └── Architecture.md
├── .editorconfig
├── package.json
├── vite.config.js
├── LICENSE
└── README.md
```

Directory responsibilities:

- src/components/: Source of truth, one file per component.
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

- File naming: kebab-case matching tag name, for example lum-button.js.
- Tag naming: lum- prefix required for all public components.
- Class naming: PascalCase, for example LumButton.
- Export strategy: Default export of the class and optional named exports.

### 5.2 Base component shape

Each component extends HTMLElement and attaches a shadow root in the constructor. The example below also shows attribute/property mirroring for disabled and variant.

```js
/**
 * @tag lum-button
 * @attr variant - visual style variant
 * @attr disabled - disables interaction
 * @slot - button label/content
 * @fires lum-click - emitted on user activation when enabled
 */
export default class LumButton extends HTMLElement {
  static get observedAttributes() {
    return ["variant", "disabled"];
  }

  get disabled() {
    return this.hasAttribute("disabled");
  }

  set disabled(value) {
    if (Boolean(value)) {
      this.setAttribute("disabled", "");
    } else {
      this.removeAttribute("disabled");
    }
  }

  get variant() {
    return this.getAttribute("variant") || "solid";
  }

  set variant(value) {
    if (value === null || value === undefined || value === "") {
      this.removeAttribute("variant");
      return;
    }

    this.setAttribute("variant", String(value));
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.render();
  }

  connectedCallback() {
    this.shadowRoot.addEventListener("click", this.onClick);
  }

  disconnectedCallback() {
    this.shadowRoot.removeEventListener("click", this.onClick);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) this.render();
  }

  onClick = (event) => {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.dispatchEvent(
      new CustomEvent("lum-click", {
        bubbles: true,
        composed: true,
        detail: { source: "lum-button" }
      })
    );
  };

  render() {
    const disabled = this.disabled;
    const variant = this.variant;

    if (!this.hasAttribute("variant") && variant) {
      this.setAttribute("variant", variant);
    }

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          --lum-button-bg: #0b5fff;
          --lum-button-color: #ffffff;
          --lum-button-radius: 0.5rem;
        }
        button {
          background: var(--lum-button-bg);
          color: var(--lum-button-color);
          border: 0;
          border-radius: var(--lum-button-radius);
          padding: 0.625rem 0.875rem;
          cursor: pointer;
        }
        button[disabled] {
          opacity: 0.55;
          cursor: not-allowed;
        }
        :host([variant="outline"]) button {
          background: transparent;
          border: 1px solid var(--lum-button-bg);
          color: var(--lum-button-bg);
        }
      </style>
      <button type="button" ${disabled ? "disabled" : ""} part="button">
        <slot></slot>
      </button>
    `;
  }
}

customElements.define("lum-button", LumButton);
```

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
- Use part attributes for intentional styling extension points.

Theming conventions:

- Component token names follow --lum-{component}-{token}.
- Provide sensible defaults inside :host.
- Document every theming token in component docs.

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

- Main entry file (for example src/index.js) imports and registers all shipped components.
- Optional per-component entry points can be added later for tree-shaking.

Setup guidance:

1. Create src/index.js and export/register the public components from that entry.
2. Add Vite as a dev dependency and place the config in vite.config.js.
3. Add standard package scripts so contributors can run the expected workflow.

Recommended package scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "web-test-runner",
    "verify:package": "./scripts/verify-package.sh",
    "release:prepare": "./scripts/release.sh"
  }
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
      entry: path.resolve(__dirname, "src/index.js"),
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

## 8. NPM Packaging and Publishing Workflow

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

### 8.2 Release process

1. Ensure branch is merged to main.
2. Run clean install and verification checks.
3. Run test suite and build via npm scripts.
4. Bump semantic version (patch/minor/major).
5. Update changelog and release notes.
6. Publish to npm.
7. Push git tag and publish GitHub release.

Required release commands:

1. npm run verify:package
2. npm run test
3. npm run build
4. npm run release:prepare

### 8.3 Versioning policy

- Follow SemVer strictly.
- Breaking public API changes require major version bump and migration notes.
- New backward-compatible features use minor bumps.
- Fixes use patch bumps.

## 9. Testing Strategy

### 9.1 Test layers

- Unit/component behavior tests: Web Test Runner.
- Browser interaction and regression tests: Playwright (optional but recommended).
- Build validation tests: verify dist artifacts and import paths.

### 9.2 Minimum quality gates

- Attribute-to-render behavior verified for each component.
- Event contract tests for event names and payload shape.
- Accessibility checks for keyboard interaction and ARIA-critical behavior.
- Smoke tests for ESM, CJS, and IIFE consumption.

### 9.3 Suggested test structure

```text
tests/
├── components/
│   ├── lum-button.test.js
│   ├── lum-input.test.js
│   └── ...
├── integration/
│   ├── esm-import.test.js
│   ├── cjs-import.test.js
│   └── iife-browser.test.js
└── a11y/
    ├── keyboard.test.js
    └── semantics.test.js
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
- Branch names should clearly map to the work item, for example:
  - `feature/#2/arch-document`
  - `fix/#15/button-disabled-state`

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
- Publish to npm (token from repository secrets)
- Create GitHub release notes

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
- NPM publishing workflow documented: Section 8.
- Testing strategy defined: Section 9.
- Developer experience documented: Section 10.
- CI/CD considerations outlined: Section 11.
