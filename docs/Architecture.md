# Luminary Architecture Specification

| Document | Architecture Specification |
|----------|----------------------------|
| Project | Luminary |
| Version | 0.1 Draft |
| Status | Draft |
| Authors | Luminary Contributors |
| Last Updated | YYYY-MM-DD |

---

# 1. Introduction

## 1.1 Purpose

This document defines the architectural specification for the Luminary framework.

Its purpose is to establish the structural, runtime, and engineering requirements that govern the implementation of Luminary. It serves as the authoritative reference for contributors, maintainers, and future implementers responsible for developing or modifying the framework.

This specification defines **how** Luminary is constructed. Product goals, user experience, and project vision are defined separately in the Product Requirements Document (PRD).

---

## 1.2 Scope

This specification applies to all source code distributed as part of the Luminary project, including:

- CSS framework source
- JavaScript framework source
- Native Web Components
- Build tooling
- Documentation examples included in the repository

Unless explicitly stated otherwise, all requirements in this document apply equally to current and future Luminary components.

---

## 1.3 Goals

This specification establishes requirements for:

- Repository organization
- Build architecture
- Runtime architecture
- Public API contracts
- CSS architecture
- JavaScript architecture
- Web Component architecture
- Browser compatibility
- Accessibility
- Testing
- Versioning

This document intentionally does not specify implementation details that do not affect the public architecture of the framework.

---

# 2. Normative Language

The keywords **MUST**, **MUST NOT**, **REQUIRED**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **RECOMMENDED**, **MAY**, and **OPTIONAL** in this document are to be interpreted as described in RFC 2119.

The following conventions are used throughout this specification.

| Keyword | Meaning |
|---------|---------|
| MUST / SHALL | An absolute architectural requirement. |
| MUST NOT / SHALL NOT | A prohibited implementation. |
| SHOULD | Recommended behavior. Deviations should be documented. |
| SHOULD NOT | Discouraged behavior. |
| MAY | Optional implementation. |

---

# 3. Architectural Principles

This section defines the architectural constraints that guide all implementation decisions.

## AP-1. Native Web Platform

Luminary SHALL be implemented using native web platform technologies.

The framework SHALL rely on standardized browser APIs wherever practical.

Examples include, but are not limited to:

- HTML
- CSS
- JavaScript
- CSS Custom Properties
- CSS `@property`
- CSS Container Queries
- CSS `light-dark()`
- Native Custom Elements
- Shadow DOM
- HTML Slots
- CSS Shadow Parts

Luminary SHALL NOT introduce abstractions that replace existing browser capabilities when those capabilities adequately satisfy the framework's requirements.

---

## AP-2. Zero Runtime Dependencies

Luminary SHALL have zero runtime dependencies.

Distributed framework artifacts SHALL NOT require third-party JavaScript libraries, CSS frameworks, or runtime package dependencies.

Development tooling MAY introduce development dependencies provided they are not required by consumers of the framework.

---

## AP-3. Standards Compliance

All framework functionality SHALL conform to the relevant HTML, CSS, and JavaScript standards implemented by supported browsers.

Where browser behavior is defined by specification, Luminary SHALL follow that behavior rather than introducing framework-specific alternatives.

Native browser lifecycle behavior SHALL remain authoritative.

---

## AP-4. Public Contracts

All externally consumable framework interfaces SHALL be explicit.

Public contracts include, but are not limited to:

- CSS custom properties
- HTML attributes
- JavaScript APIs
- Custom events
- Custom Elements

Each public contract SHALL be documented and considered part of Luminary's stable public API.

---

## AP-5. Browser Compatibility

All framework features SHALL operate within the project's supported browser matrix.

Implementation techniques SHALL be selected with browser compatibility as a primary architectural constraint.

Features outside the supported browser matrix SHALL NOT dictate architectural decisions.

---

## AP-6. Accessibility

Accessibility SHALL be considered a functional requirement.

All framework components SHALL conform to WCAG 2.1 and Section 508 accessibility requirements unless a documented exception exists.

Accessibility SHALL NOT be considered an optional enhancement.

# 4. Repository Architecture

## 4.1 Overview

The Luminary repository is organized into four primary areas:

- Development site (`demo/`)
- Framework source (`luminary/`)
- Build and utility scripts (`scripts/`)
- Project infrastructure (configuration, package management, documentation)

Each directory has a single, clearly defined responsibility. Source code SHALL NOT be duplicated across directories.

---

## 4.2 Repository Structure

The repository SHALL conform to the following structure.

```text
src/
├── demo/
│   ├── lum-drawer/
│   │   ├── index.html
│   │   ├── script.ts
│   │   └── styles.css
│   ├── ...
│   └── index.html
│
├── luminary/
│   ├── components/
│   │   ├── lum-drawer/
│   │   │   ├── lum-drawer.elem.css
│   │   │   ├── lum-drawer.elem.html
│   │   │   ├── lum-drawer.elem.ts
│   │   │   └── lum-drawer.prop.css
│   │   ├── ...
│   │   ├── components.elem.ts
│   │   └── components.prop.css
│   │
│   ├── styles/
│   │   ├── lum-button/
│   │   │   ├── lum-button.css
│   │   │   └── ...
│   │   ├── ...
│   │   ├── color.prop.css
│   │   ├── font.prop.css
│   │   ├── ...
│   │   └── root.css
│   │
│   ├── luminary.css
│   └── luminary.ts
│
└── scripts/
```

---

## 4.3 Demo Directory

The `demo/` directory contains the Luminary development site.

The development site serves three purposes:

1. Framework documentation.
2. Component demonstrations.
3. Development playground.

Each documentation page MAY contain:

- `index.html`
- `script.ts`
- `styles.css`

These files are scoped to the documentation page and SHALL NOT be imported into framework artifacts.

Documentation pages SHALL consume the framework exactly as an external application would.

---

## 4.4 Framework Source

The `luminary/` directory contains all framework source code.

The framework source is divided into two independent systems:

- `styles/`
- `components/`

Neither directory is considered subordinate to the other.

Both contribute to the public Luminary distribution.

---

## 4.5 Styles Directory

The `styles/` directory contains the CSS framework source.

This includes, but is not limited to:

- Design tokens
- CSS property definitions
- Utility classes
- Layout primitives
- CSS components

Component organization within this directory is implementation-defined.

The repository does not prescribe how individual components organize internal styles beyond the required public entry points.

The file `root.css` acts as the aggregation point for the style system.

`luminary.css` SHALL import `root.css` and define the public CSS entry point for the framework.

---

## 4.6 Components Directory

The `components/` directory contains JavaScript-enhanced functionality implemented using native Web Components.

A component directory MAY contain:

- HTML templates
- Shadow DOM stylesheets
- TypeScript implementation
- Public CSS property definitions

The exact contents of a component directory are determined by the needs of the component.

Components are not required to provide visual styling beyond what is necessary for correct operation.

---

## 4.7 Entry Points

Luminary defines two primary framework entry points.

### CSS

```text
luminary.css
```

This file represents the root stylesheet of the framework and SHALL compile into the distributed base stylesheet.

### JavaScript

```text
luminary.ts
```

This file represents the root JavaScript entry point and SHALL compile into the distributed JavaScript bundle.

The JavaScript entry point SHALL aggregate component registrations through barrel imports.

---

## 4.8 Scripts Directory

The `scripts/` directory contains project tooling.

Examples include:

- Build scripts
- Development scripts
- Utility scripts
- Release automation

Scripts are considered development infrastructure and SHALL NOT become runtime dependencies of the framework.

---

## 4.9 Architectural Constraints

The following repository constraints apply.

1. The `demo/` directory SHALL remain independent of framework source.

2. The `styles/` directory SHALL contain CSS framework implementation.

3. The `components/` directory SHALL contain JavaScript enhancement components.

4. Framework artifacts SHALL be produced from the `luminary/` directory.

5. Development tooling SHALL reside in the `scripts/` directory.

6. Consumers SHALL interact only with the distributed framework artifacts and SHALL NOT depend upon repository layout.

# 5. Build Architecture

## 5.1 Overview

Luminary is developed using native HTML, CSS, and JavaScript source files.

The build system is responsible for transforming the development source into distributable framework artifacts. The build process SHALL preserve the runtime architecture of the framework and SHALL NOT introduce runtime dependencies.

---

## 5.2 Toolchain

Luminary uses the following development tools.

| Tool | Purpose |
|------|---------|
| npm | Package management and workflow execution |
| esbuild | Development server and production bundling |
| TypeScript | Static type checking and JavaScript transpilation |

These tools are considered development dependencies only.

No development tool SHALL become a runtime dependency of the distributed framework.

---

## 5.3 Runtime Dependencies

The distributed framework SHALL have zero runtime dependencies.

Specifically:

- Third-party JavaScript libraries SHALL NOT be required.
- Third-party CSS frameworks SHALL NOT be required.
- Runtime package dependencies SHALL NOT be declared in `package.json`.

The framework SHALL execute using only browser-native APIs.

---

## 5.4 Source Files

Source files remain modular during development.

JavaScript SHALL use native ES Module imports.

Example:

```ts
import "./components/lum-drawer/lum-drawer.elem";
```

CSS SHALL use native `@import` directives.

Example:

```css
@import "./styles/root.css";
```

The build system is responsible for resolving module dependencies into distributable artifacts.

---

## 5.5 Development Server

The development environment SHALL be provided by the esbuild development server.

The development server SHALL:

- Serve the demo application.
- Rebuild source files on change.
- Bundle framework artifacts.
- Support rapid development iteration.

The development server SHALL NOT define framework behavior.

---

## 5.6 Distribution Artifacts

The build process SHALL generate browser-ready assets.

The framework defines the following public artifacts.

### Base CSS

```text
luminary.css
```

Provides:

- CSS resets
- Design tokens
- CSS components
- Utility classes

---

### Enhanced CSS

```text
luminary_enhanced.css
```

Provides CSS required by optional JavaScript-enhanced components.

---

### Enhanced JavaScript

```text
luminary_enhanced.js
```

Provides:

- Native Custom Elements
- Interactive components
- Browser behavior enhancements

---

## 5.7 Build Responsibilities

The build system SHALL be responsible for:

- Resolving module imports.
- Bundling JavaScript.
- Bundling CSS.
- Producing distributable artifacts.

The build system SHALL NOT alter the public API of the framework.

---

## 5.8 Build Independence

Consumers of Luminary SHALL NOT depend upon the Luminary build system.

Consumers MAY:

- Use npm packages.
- Use a CDN.
- Copy distributable artifacts directly.

The framework SHALL distribute browser-ready assets independent of the consumer's build environment.

---

## 5.9 Architectural Constraints

1. Source files SHALL remain modular during development.

2. Distributed assets SHALL be bundled for production use.

3. Runtime dependencies SHALL remain zero.

4. Build tooling SHALL remain isolated from framework runtime behavior.

5. The build process SHALL preserve browser-native APIs and framework contracts.

# 6. Distribution Architecture

## 6.1 Overview

Luminary is distributed as browser-native assets.

The framework is divided into independent distribution layers that allow consumers to adopt only the functionality required by their application.

Each distribution layer exposes a well-defined public contract and SHALL remain independently consumable.

---

## 6.2 Distribution Layers

Luminary consists of two architectural layers.

### Base Layer

The Base Layer provides the visual foundation of the framework.

It includes:

- CSS reset
- Design tokens
- CSS property definitions
- Layout primitives
- Utility classes
- CSS components

The Base Layer SHALL NOT require JavaScript.

---

### Enhanced Layer

The Enhanced Layer provides optional browser behavior through native JavaScript.

Examples include:

- Native Custom Elements
- Interactive components
- Browser event coordination
- Shadow DOM implementations

The Enhanced Layer SHALL require the Base Layer.

The Base Layer SHALL NOT require the Enhanced Layer.

---

## 6.3 Layer Dependencies

The following dependency graph SHALL be maintained.

```text
            Consumer Application
                     │
         ┌───────────┴───────────┐
         │                       │
    Base Layer           Enhanced Layer
         ▲                       │
         └───────────────────────┘
```

The Enhanced Layer MAY depend upon the Base Layer.

The Base Layer SHALL remain independent.

Circular dependencies between layers SHALL NOT exist.

---

## 6.4 Runtime Independence

Each distribution layer SHALL expose browser-ready assets.

Consumers SHALL NOT require Luminary source code to use the framework.

The framework SHALL NOT require:

- source compilation
- repository cloning
- framework-specific tooling

for runtime execution.

---

## 6.5 Public Entry Points

Luminary SHALL define public entry points for each distribution layer.

Consumers SHALL interact only with these published artifacts.

Internal repository organization SHALL NOT be considered part of the public API.

---

## 6.6 Consumer Integration

Consumers MAY integrate Luminary through any deployment mechanism.

Examples include:

- Package managers
- Content Delivery Networks (CDNs)
- Static asset hosting
- Direct file inclusion

The chosen deployment mechanism SHALL NOT affect framework behavior.

---

## 6.7 Layer Responsibilities

### Base Layer

Responsible for:

- Visual presentation
- Layout
- Responsive behavior
- Design tokens
- CSS contracts

The Base Layer SHALL NOT depend upon JavaScript.

---

### Enhanced Layer

Responsible for:

- Interactive behavior
- Custom Elements
- Browser interaction
- Component lifecycle

The Enhanced Layer SHOULD consume the public contracts exposed by the Base Layer.

The Enhanced Layer SHALL NOT duplicate framework design tokens.

---

## 6.8 Architectural Constraints

1. Distribution layers SHALL remain independently maintainable.

2. The Base Layer SHALL function without JavaScript.

3. The Enhanced Layer SHALL extend, but not replace, Base Layer functionality.

4. Public framework contracts SHALL remain consistent regardless of deployment mechanism.

5. Consumers SHALL interact only with distributed framework artifacts.

# 7. CSS Architecture

## 7.1 Overview

Luminary's CSS architecture provides the foundation layer of the framework.

The CSS system is responsible for:

- Design token definitions.
- CSS component implementations.
- Layout utilities.
- Responsive behaviors.
- Consumer customization contracts.

Luminary CSS SHALL be implemented using native CSS capabilities.

The CSS architecture SHALL NOT require JavaScript for base functionality.

---

## 7.2 CSS Source Organization

Luminary CSS source is organized into two primary areas:

```text
luminary/
├── styles/
└── luminary.css
```

The `styles/` directory contains framework CSS implementation.

The `luminary.css` file serves as the primary CSS entry point.

---

## 7.3 CSS Entry Point

The root stylesheet SHALL aggregate all required CSS framework resources.

Example:

```css
@import "./styles/root.css";
```

The root stylesheet is responsible for defining the complete Base Layer CSS distribution.

The final distributed stylesheet SHALL be generated from this entry point.

---

## 7.4 CSS Components

CSS components provide reusable visual patterns implemented using standard CSS selectors.

A CSS component MAY define:

- Element styling.
- Layout behavior.
- Visual states.
- Responsive behavior.
- Customization tokens.

CSS components SHALL NOT require JavaScript unless explicitly implemented as an Enhanced Layer component.

---

## 7.5 Component Isolation

CSS components SHALL define styles according to their intended scope.

Component authors MAY choose the appropriate selector strategy based on component requirements.

Luminary does not enforce a universal selector pattern.

Selectors SHALL remain implementation-specific unless they affect a documented public API.

---

## 7.6 CSS Property Contracts

All public Luminary CSS custom properties SHALL have corresponding CSS `@property` definitions.

A public CSS property definition SHALL specify:

- Property name.
- Syntax.
- Inheritance behavior.
- Initial value.

Example:

```css
@property --lum-component-button-background {
    syntax: "<color>";
    inherits: true;
    initial-value: #ff0000;
}
```

The `@property` definition represents the public contract for the value.

---

## 7.7 Property File Convention

CSS property definitions SHALL be maintained separately from component implementation styles.

Property definition files use the naming convention:

```text
*.prop.css
```

Example:

```text
lum-button.prop.css
```

Property files SHALL contain CSS property contracts.

Property files SHALL NOT define component selector rules.

---

## 7.8 Token Namespace Architecture

Luminary uses explicit namespaces for public CSS properties.

### Base Tokens

Base framework tokens SHALL use:

```css
--lum-base-*
```

Example:

```css
--lum-base-color-primary
```

Base tokens represent framework-level design values.

---

### Component Tokens

Component tokens SHALL use:

```css
--lum-component-*
```

Example:

```css
--lum-component-drawer-slide-speed
```

Component tokens represent component-specific customization points.

---

## 7.9 Token Inheritance

Component tokens SHALL NOT define their initial values by referencing other CSS variables.

Example:

Invalid:

```css
@property --lum-component-button-background {
    initial-value: var(--lum-base-color-primary);
}
```

Instead, components SHALL define their typed default value and MAY establish runtime relationships within component selectors.

Example:

```css
@property --lum-component-button-background {
    syntax: "<color>";
    inherits: true;
    initial-value: red;
}

.lum-button {
    --lum-component-button-background:
        var(--lum-base-color-primary);

    background:
        var(--lum-component-button-background);
}
```

---

## 7.10 CSS Utilities

Utility classes SHALL be implemented within the CSS architecture.

Utility behavior is component-specific.

Utilities MAY be:

- Global framework utilities.
- Scoped child selectors.
- Component-specific helpers.

The architecture does not require utilities to exist independently from components.

---

## 7.11 CSS Layers

CSS Cascade Layers (`@layer`) are not currently required by Luminary.

Future implementations MAY adopt CSS Layers if they provide architectural value.

Adoption of CSS Layers SHALL preserve existing public CSS contracts.

---

## 7.12 Architectural Constraints

1. Base Luminary functionality SHALL work without JavaScript.

2. Public CSS properties SHALL use `@property` definitions.

3. CSS property names SHALL use Luminary namespaces.

4. CSS components SHALL remain independent from JavaScript components.

5. Consumers SHALL customize Luminary through public CSS contracts rather than modifying framework source.

6. CSS implementation details SHALL remain private unless exposed through documented contracts.

# 8. JavaScript Architecture

## 8.1 Overview

Luminary JavaScript provides optional enhancements through native JavaScript APIs.

The JavaScript layer is responsible for:

- Native Custom Elements.
- Component behavior.
- Browser interaction.
- Event handling.
- Runtime enhancements.

The JavaScript layer SHALL NOT replace native browser functionality with framework-specific abstractions unless required to provide Luminary component behavior.

---

## 8.2 Language and Module Requirements

Luminary JavaScript source SHALL be written in TypeScript.

TypeScript is used to provide:

- Type consistency.
- Development-time validation.
- Reduced runtime errors.

The compiled runtime output SHALL be standard browser-compatible JavaScript.

---

## 8.3 Module Architecture

Luminary SHALL use native JavaScript module patterns during development.

Source files SHALL use ES Module imports.

Example:

```ts
import "./components/lum-drawer/lum-drawer.elem";
```

The build system SHALL resolve and bundle module dependencies for distribution.

Luminary SHALL NOT require a runtime module loader.

---

## 8.4 JavaScript Entry Point

The JavaScript source entry point is:

```text
luminary.ts
```

This file SHALL act as the root aggregation point for JavaScript-enhanced components.

The entry point SHALL:

- Import component registrations.
- Produce the final JavaScript distribution artifact.

The entry point SHALL NOT contain component implementation logic.

---

## 8.5 Custom Element Registration

Luminary components SHALL use the native Custom Elements API.

Components SHALL register through:

```javascript
customElements.define()
```

Example:

```ts
customElements.define(
    "lum-drawer",
    LumDrawer
);
```

Luminary SHALL NOT provide a custom registration abstraction.

---

## 8.6 Component Base Classes

Luminary SHALL NOT provide a framework-specific component base class.

Components SHALL extend the most appropriate native browser element.

Examples:

```ts
class LumDrawer extends HTMLElement {}
```

or:

```ts
class LumLink extends HTMLAnchorElement {}
```

Component authors SHALL use the native Custom Element lifecycle APIs.

---

## 8.7 Component Lifecycle

Component behavior SHALL conform to the native Custom Element lifecycle.

Components MAY implement lifecycle callbacks including:

```ts
connectedCallback()
disconnectedCallback()
attributeChangedCallback()
adoptedCallback()
```

Component implementations SHALL follow browser-defined lifecycle behavior.

Luminary SHALL NOT modify lifecycle semantics.

---

## 8.8 Runtime Dependencies

Luminary JavaScript SHALL have zero runtime dependencies.

Components SHALL use:

- Browser APIs.
- Native JavaScript APIs.
- Luminary public contracts.

Components SHALL NOT require external runtime libraries.

---

## 8.9 DOM Interaction

Components MAY interact with the DOM according to their functional requirements.

Examples include:

- Event listeners.
- DOM manipulation.
- Attribute observation.
- Shadow DOM APIs.
- Browser APIs.

Components SHOULD minimize assumptions about surrounding application structure.

---

## 8.10 Error Handling

Components SHOULD fail predictably when provided invalid configuration.

Components MAY:

- Ignore unsupported values.
- Apply fallback behavior.
- Dispatch error events.

Component-specific error behavior SHALL be documented as part of the component API.

---

## 8.11 Architectural Constraints

1. JavaScript enhancements SHALL remain optional.

2. JavaScript components SHALL use native browser APIs.

3. Luminary SHALL NOT provide a custom JavaScript framework abstraction layer.

4. Runtime dependencies SHALL remain zero.

5. Custom Elements SHALL be registered through standard browser APIs.

6. Component behavior SHALL remain compatible with supported browsers.

# 9. Web Component Architecture

## 9.1 Overview

Luminary Web Components are optional JavaScript enhancements implemented using the native Custom Elements standard.

Web Components provide reusable browser behavior and MAY provide encapsulated visual presentation.

A Web Component SHALL NOT be considered a replacement for CSS components.

Web Components and CSS components are independent implementation systems that share Luminary public contracts.

---

## 9.2 Component Directory Structure

Enhanced components SHALL be organized within the `components/` directory.

A component MAY contain the following files:

```text
lum-component/
├── lum-component.elem.ts
├── lum-component.elem.html
├── lum-component.elem.css
└── lum-component.prop.css
```

Each file has a defined responsibility.

---

## 9.3 Element Implementation

The `.elem.ts` file contains the Custom Element implementation.

Responsibilities include:

- Class definition.
- Lifecycle methods.
- Attribute handling.
- Event handling.
- Component behavior.
- Custom Element registration.

Example:

```ts
class LumDrawer extends HTMLElement {
    connectedCallback() {
        // Component initialization
    }
}

customElements.define(
    "lum-drawer",
    LumDrawer
);
```

---

## 9.4 Element Template

The `.elem.html` file contains the component's internal HTML template.

When a component uses Shadow DOM, the template SHALL be used as the initial shadow content.

Example:

```html
<div class="drawer">
    <slot></slot>
</div>
```

Components MAY define:

- Internal structure.
- Named slots.
- Default slot behavior.
- Structural elements.

---

## 9.5 Shadow DOM

Luminary Web Components SHALL use Shadow DOM in open mode.

Example:

```ts
this.attachShadow({
    mode: "open"
});
```

Open Shadow DOM is required to allow:

- Browser-native encapsulation.
- Developer inspection.
- Standard Shadow DOM interaction.

Components SHALL NOT rely on closed Shadow DOM.

---

## 9.6 Component Styling

The `.elem.css` file contains styles specific to the component's Shadow DOM implementation.

Components SHOULD use constructable stylesheets when appropriate.

Example:

```ts
shadowRoot.adoptedStyleSheets = [
    stylesheet
];
```

Component styles SHALL remain scoped to the component implementation.

---

## 9.7 CSS Shadow Parts

Components MAY expose internal styling hooks using the CSS `::part()` pseudo-element.

Example:

```html
<div part="header">
</div>
```

Consumers MAY style exposed parts:

```css
lum-drawer::part(header) {
    padding: 1rem;
}
```

Components SHOULD expose parts only where external customization is required.

---

## 9.8 Content Projection

Components that accept consumer-provided content SHALL use the native slot API.

Example:

```html
<slot></slot>
```

Components MAY define:

- Default slots.
- Named slots.
- Multiple slot locations.

Components SHALL NOT require consumers to modify internal Shadow DOM markup.

---

## 9.9 Component State

Component state SHALL be represented through HTML attributes.

Attributes SHALL contain string values.

Example:

```html
<lum-drawer open>
</lum-drawer>
```

or:

```html
<lum-button color="primary">
</lum-button>
```

Components MAY internally transform attribute values into richer runtime representations.

Internal state management is component-specific.

---

## 9.10 Attribute Observation

Components SHOULD observe only attributes that affect component behavior.

Observed attributes SHALL be explicitly declared using the native Custom Element mechanism.

Example:

```ts
static observedAttributes = [
    "open"
];
```

Components SHOULD avoid unnecessary DOM observation.

---

## 9.11 Component Communication

Web Components MAY communicate through:

- Native DOM events.
- Custom events.
- Public methods.
- Shared application state.
- Publish/subscribe mechanisms.

Communication strategy is component-specific.

Components SHALL use browser-compatible communication mechanisms.

---

## 9.12 Component Dependencies

Components SHALL minimize dependencies on other Luminary components.

A component MAY depend on another component when the dependency is required for functionality.

Such dependencies SHALL be explicitly documented.

Components SHOULD rely primarily on:

- Native browser APIs.
- Luminary public contracts.
- Their own implementation.

---

## 9.13 Accessibility

Web Components SHALL maintain accessibility requirements defined by Luminary.

Components SHALL:

- Preserve semantic HTML where possible.
- Provide appropriate ARIA behavior.
- Support keyboard interaction where applicable.
- Maintain WCAG 2.1 and Section 508 compliance.

---

## 9.14 Architectural Constraints

1. Web Components SHALL use native Custom Elements.

2. Web Components SHALL use open Shadow DOM.

3. Web Components SHALL not require CSS component equivalents.

4. Components SHALL expose public configuration through documented contracts.

5. Components SHALL use native browser compatibility standards.

6. Components SHALL remain independent unless a dependency is explicitly documented.

# 10. Public Contract Architecture

## 10.1 Overview

Luminary defines public contracts as any interface intentionally exposed for consumer interaction or customization.

Public contracts represent the boundary between Luminary implementation details and consumer application code.

A public contract SHALL be:

- Explicit.
- Documented.
- Stable.
- Versioned.

Consumers SHOULD interact with Luminary through public contracts only.

---

## 10.2 Contract Types

Luminary supports four primary public contract types:

1. CSS contracts.
2. HTML contracts.
3. JavaScript contracts.
4. Event contracts.

Each contract type serves a specific purpose.

---

# 10.3 CSS Contracts

CSS contracts define visual customization and presentation behavior.

CSS contracts are exposed through CSS custom properties.

Example:

```css
--lum-base-color-primary
```

or:

```css
--lum-component-drawer-slide-speed
```

Public CSS properties SHALL:

- Use Luminary naming conventions.
- Have a corresponding `@property` definition.
- Define syntax.
- Define inheritance behavior.
- Define an initial value.

Consumers MAY override public CSS properties without modifying framework source.

---

## 10.4 HTML Contracts

HTML contracts define component configuration through attributes.

Example:

```html
<lum-drawer open>
</lum-drawer>
```

or:

```html
<lum-drawer trigger=".menu-button">
</lum-drawer>
```

HTML attributes SHALL:

- Use explicit names.
- Represent component configuration or state.
- Contain string values.

Components MAY interpret attribute values internally.

---

## 10.5 Attribute State Model

Component state SHALL be represented through HTML attributes.

Example:

```html
<lum-dialog open>
</lum-dialog>
```

The presence, absence, or value of an attribute represents the public state of the component.

Internal state MAY exist but SHALL NOT replace the public attribute state model.

---

## 10.6 Data Attributes

Application-specific data SHALL use standard HTML data attributes.

Example:

```html
<div data-user-id="123">
</div>
```

Luminary component APIs SHALL NOT use `data-*` attributes for framework-defined configuration.

---

## 10.7 JavaScript Contracts

JavaScript contracts define programmatic interaction with Luminary components.

These MAY include:

- Public methods.
- Public properties.
- Component interfaces.

JavaScript contracts SHALL follow native browser object conventions.

Example:

```javascript
drawer.open();
```

Components SHOULD avoid exposing APIs that duplicate existing HTML attribute functionality unless there is a documented reason.

---

## 10.8 Event Contracts

Events provide communication between components and consuming applications.

Events MAY include:

- Native DOM events.
- Custom events.

Custom events SHALL:

- Use documented names.
- Document event payloads.
- Define dispatch conditions.

Example:

```javascript
drawer.dispatchEvent(
    new CustomEvent("drawer-open")
);
```

---

## 10.9 Contract Documentation Requirements

Every public contract SHALL document:

- Name.
- Purpose.
- Accepted values.
- Default behavior.
- Examples.
- Version availability.

For component contracts, documentation SHOULD include:

- HTML usage.
- CSS customization.
- JavaScript interaction.
- Events.
- Accessibility considerations.

---

## 10.10 Contract Stability

Public contracts SHALL be considered stable framework APIs.

Changes to public contracts require:

- Migration documentation.
- Deprecation notice where applicable.
- A replacement path when possible.

Internal implementation details MAY change without affecting public contracts.

---

## 10.11 Contract Ownership

Luminary defines the contract.

Consumers define the implementation usage.

Consumers SHALL NOT be required to understand internal implementation details to use supported public contracts.

---

## 10.12 Architectural Constraints

1. Public interfaces SHALL be explicitly documented.

2. Internal implementation details SHALL NOT be treated as public APIs.

3. CSS properties, HTML attributes, JavaScript APIs, and events SHALL be versioned as public contracts.

4. Components SHALL expose configuration through the most appropriate contract type.

5. Public contracts SHALL remain backward compatible according to Luminary versioning policy.

# 11. Theme & Token Architecture

## 11.1 Overview

Luminary uses CSS Custom Properties as the primary mechanism for exposing design customization.

Tokens represent the configurable values that define Luminary's visual system.

All Luminary tokens SHALL use CSS `@property` definitions to establish their public contract.

The token system SHALL support:

- Framework defaults.
- Light and dark mode values.
- Consumer overrides.
- Component-specific customization.

---

## 11.2 Token Categories

Luminary defines two primary token categories:

1. Base tokens.
2. Component tokens.

---

## 11.3 Base Tokens

Base tokens represent framework-level design values.

Base tokens SHALL use the following naming convention:

```css
--lum-base-*
```

Examples:

```css
--lum-base-color-primary
--lum-base-color-secondary
--lum-base-spacing-small
--lum-base-font-family
```

Base tokens define values that may be consumed throughout an application.

---

## 11.4 Component Tokens

Component tokens represent component-specific customization points.

Component tokens SHALL use the following naming convention:

```css
--lum-component-*
```

Examples:

```css
--lum-component-button-background
--lum-component-drawer-slide-speed
```

Component tokens SHALL only represent values specific to component behavior or presentation.

---

## 11.5 Token Contract Definition

Every Luminary token SHALL have a corresponding `@property` declaration.

Example:

```css
@property --lum-base-spacing-small {
    syntax: "<length>";
    inherits: true;
    initial-value: 8px;
}
```

The declaration SHALL define:

- Syntax.
- Inheritance.
- Initial value.

---

## 11.6 Token Inheritance

Luminary tokens SHALL use CSS inheritance behavior to allow consumer customization.

Example:

```css
:root {
    --lum-base-color-primary: blue;
}
```

Components consuming this token SHALL inherit the updated value.

---

## 11.7 Token Relationship Model

CSS `@property` initial values SHALL define concrete fallback values.

A token's `initial-value` SHALL NOT reference another CSS variable.

Invalid example:

```css
@property --lum-component-button-background {
    syntax: "<color>";
    initial-value: var(--lum-base-color-primary);
}
```

Valid example:

```css
@property --lum-component-button-background {
    syntax: "<color>";
    inherits: true;
    initial-value: red;
}
```

Component styles MAY establish relationships between tokens after declaration.

Example:

```css
.lum-button {
    --lum-component-button-background:
        var(--lum-base-color-primary);
}
```

---

## 11.8 Color Mode Architecture

Luminary uses native CSS color mode functionality.

The framework SHALL use:

```css
color-scheme
```

and:

```css
light-dark()
```

to provide adaptive color behavior.

Luminary SHALL NOT implement theme switching through JavaScript.

---

## 11.9 Mode-Specific Tokens

Color tokens MAY define separate values for light and dark environments.

Naming convention:

```css
--lum-base-light-*
--lum-base-dark-*
```

Example:

```css
@property --lum-base-light-color-primary {
    syntax: "<color>";
    inherits: true;
    initial-value: orange;
}

@property --lum-base-dark-color-primary {
    syntax: "<color>";
    inherits: true;
    initial-value: blue;
}
```

---

## 11.10 Runtime Color Tokens

Runtime tokens represent the active value consumed by components.

Example:

```css
:root {
    color-scheme: light dark;

    --lum-base-color-primary:
        light-dark(
            var(--lum-base-light-color-primary),
            var(--lum-base-dark-color-primary)
        );
}
```

Components SHOULD consume runtime tokens rather than directly consuming light or dark variants.

Example:

```css
color:
    var(--lum-base-color-primary);
```

---

## 11.11 Consumer Customization

Consumers MAY customize Luminary tokens at any supported level.

Examples:

### Customize individual modes

```css
:root {
    --lum-base-light-color-primary: #ff8800;
    --lum-base-dark-color-primary: #0088ff;
}
```

### Override runtime behavior

```css
:root {
    --lum-base-color-primary: purple;
}
```

Consumers SHALL NOT need to modify framework source to customize supported values.

---

## 11.12 Token Documentation

Every public token SHALL document:

- Token name.
- Category.
- Syntax.
- Default value.
- Usage.
- Related components.

Token documentation SHOULD be generated or maintained alongside the token definition.

---

## 11.13 Architectural Constraints

1. All public Luminary tokens SHALL use `@property`.

2. Token names SHALL use Luminary namespaces.

3. Base tokens SHALL use the `--lum-base-*` prefix.

4. Component tokens SHALL use the `--lum-component-*` prefix.

5. Theme selection SHALL use native CSS color functionality.

6. JavaScript SHALL NOT manage Luminary theme state.

7. Consumers SHALL customize tokens through public CSS contracts.

# 12. Browser Compatibility

## 12.1 Overview

Luminary is designed as a browser-native framework.

The framework SHALL rely on standardized HTML, CSS, and JavaScript platform capabilities rather than framework-specific runtime abstractions.

Browser compatibility is a core architectural requirement.

---

## 12.2 Supported Browsers

Luminary SHALL support the following minimum browser versions:

| Browser | Minimum Version |
|---|---:|
| Chrome | 67 |
| Firefox | 63 |
| Safari | 26 |
| Edge | 79 |

Features introduced after the supported browser matrix SHALL NOT be required unless the support policy is updated.

---

## 12.3 Native Platform Requirement

Luminary SHALL prioritize native browser standards.

Supported implementations SHALL be based on:

- Standard HTML APIs.
- Standard CSS APIs.
- Standard JavaScript APIs.
- Web Platform specifications.

Luminary SHALL NOT require framework-specific runtime behavior to provide core functionality.

---

## 12.4 Feature Compatibility

Before adopting a browser feature, Luminary implementations SHALL verify compatibility against the supported browser matrix.

Feature decisions SHALL consider:

- Browser availability.
- Standards maturity.
- Long-term maintenance impact.
- Consumer adoption requirements.

---

## 12.5 Polyfill Policy

Luminary SHALL NOT include runtime polyfills by default.

The framework SHALL assume the supported browser matrix provides the required platform capabilities.

Future polyfills MAY be considered only when:

- A required standard is unavailable.
- The feature provides significant framework value.
- The addition does not violate the zero runtime dependency requirement.

---

## 12.6 Progressive Enhancement

Luminary SHALL support progressive enhancement principles.

Base functionality SHOULD remain available through standard HTML and CSS wherever possible.

JavaScript enhancements SHOULD extend functionality rather than make basic content inaccessible.

---

## 12.7 Browser-Specific Behavior

Browser-specific implementations MAY exist when required to maintain compatibility.

Such implementations SHALL:

- Be isolated.
- Be documented.
- Preserve the public framework contract.

Browser-specific behavior SHALL NOT become the expected consumer implementation model.

---

## 12.8 Standards Alignment

Luminary implementations SHALL reference established web standards when defining behavior.

Primary reference sources include:

- WHATWG HTML Standard.
- CSS specifications.
- ECMAScript specifications.
- W3C accessibility standards.

---

## 12.9 Architectural Constraints

1. Luminary SHALL maintain the defined browser support matrix.

2. Runtime dependencies SHALL NOT be introduced to solve browser compatibility.

3. Native browser APIs SHALL be preferred over custom abstractions.

4. New platform features SHALL be evaluated against compatibility requirements.

5. Public framework contracts SHALL remain consistent across supported browsers.

# 13. Accessibility Requirements

## 13.1 Overview

Luminary treats accessibility as a required component of framework correctness.

All Luminary components, CSS patterns, and JavaScript enhancements SHALL be designed to support accessible user experiences.

Accessibility SHALL be considered during component architecture, implementation, testing, and documentation.

---

## 13.2 Compliance Standards

Luminary components SHALL maintain compliance with:

- Web Content Accessibility Guidelines (WCAG) 2.1.
- Section 508 accessibility requirements.

Future accessibility standards MAY be adopted as the framework evolves.

---

## 13.3 Semantic HTML

Luminary SHALL prioritize native semantic HTML elements whenever possible.

Components SHOULD:

- Use the appropriate native HTML element.
- Preserve existing browser behavior.
- Avoid unnecessary ARIA usage when native semantics are sufficient.

Custom elements SHALL provide equivalent accessible behavior when replacing or extending native functionality.

---

## 13.4 Keyboard Interaction

Interactive Luminary components SHALL support keyboard interaction.

Components requiring user interaction SHALL define:

- Supported keyboard inputs.
- Focus behavior.
- Focus management.
- Interaction states.

Keyboard behavior SHALL be documented as part of the component API.

---

## 13.5 Focus Management

Components that modify user interface state SHALL manage focus appropriately.

Examples include:

- Dialogs.
- Drawers.
- Menus.
- Popovers.

Components SHALL ensure users can:

- Enter interactive states.
- Navigate within interactive states.
- Exit interactive states.

---

## 13.6 ARIA Usage

ARIA attributes MAY be used when native HTML semantics are insufficient.

Components SHALL:

- Use valid ARIA attributes.
- Maintain accurate accessibility state.
- Update ARIA values when component state changes.

ARIA SHALL NOT replace proper semantic HTML when semantic HTML provides equivalent behavior.

---

## 13.7 Component State and Accessibility

Component state represented through HTML attributes SHALL maintain corresponding accessibility state when applicable.

Example:

```html
<lum-drawer open>
</lum-drawer>
```

If the component exposes an expanded, hidden, selected, or active state, the accessibility tree SHALL reflect the current state.

---

## 13.8 Shadow DOM Accessibility

Components using Shadow DOM SHALL preserve accessibility behavior across the shadow boundary.

Component authors SHALL consider:

- Accessible names.
- Slot behavior.
- Keyboard navigation.
- Internal semantic structure.

Shadow DOM encapsulation SHALL NOT prevent assistive technologies from accessing required information.

---

## 13.9 Documentation Requirements

Accessibility behavior SHALL be documented for each interactive component.

Documentation SHOULD include:

- Keyboard controls.
- Screen reader expectations.
- Required attributes.
- Accessible usage examples.

---

## 13.10 Testing Requirements

Accessibility SHALL be validated during component development.

Testing SHOULD include:

- Automated accessibility testing where practical.
- Keyboard testing.
- Browser testing.
- Assistive technology validation where applicable.

---

## 13.11 Architectural Constraints

1. Accessibility SHALL be considered a framework requirement.

2. Components SHALL maintain WCAG 2.1 and Section 508 compliance.

3. Native semantic HTML SHALL be preferred over custom implementations.

4. Interactive components SHALL define keyboard behavior.

5. Component state SHALL maintain accessible representation.

6. Accessibility SHALL be documented as part of the component contract.

# 14. Testing Requirements

## 14.1 Overview

Testing ensures that Luminary maintains stable public contracts and reliable browser-native behavior.

Tests SHALL validate:

- Framework functionality.
- Public API contracts.
- Browser compatibility.
- Component behavior.
- Regression prevention.

Testing SHALL be considered part of the framework development lifecycle.

---

## 14.2 Testing Framework

Luminary SHALL use Jest as the primary unit testing framework.

Jest is responsible for validating JavaScript behavior and framework logic.

---

## 14.3 Test Organization

Tests SHALL be organized according to the functionality being validated.

Test organization SHOULD align with framework source organization.

Examples:

```text
luminary/
├── components/
│   └── lum-drawer/
│       ├── lum-drawer.elem.ts
│       └── lum-drawer.test.ts
```

The exact test file organization MAY evolve with project requirements.

---

## 14.4 Component Testing

Web Components SHALL be tested according to their public behavior.

Tests SHOULD validate:

- Component registration.
- Lifecycle behavior.
- Attribute handling.
- Event dispatching.
- DOM output.
- State transitions.

Tests SHOULD avoid validating private implementation details.

---

## 14.5 CSS Contract Testing

CSS behavior SHALL be validated through appropriate testing methods.

Tests SHOULD verify:

- Token availability.
- Expected defaults.
- Consumer override behavior.
- Theme behavior.

CSS implementation details SHOULD NOT be treated as public contracts unless documented.

---

## 14.6 Public Contract Testing

All public contracts SHALL have validation coverage.

This includes:

- CSS custom properties.
- HTML attributes.
- JavaScript APIs.
- Custom events.

Changes to public contracts SHALL require corresponding test updates.

---

## 14.7 Browser Validation

Unit tests SHALL NOT be considered sufficient for complete framework validation.

Luminary SHOULD validate behavior across supported browsers.

Validation SHOULD include:

- Chrome.
- Firefox.
- Safari.
- Edge.

---

## 14.8 Accessibility Testing

Accessibility requirements SHALL be included in component validation.

Tests SHOULD verify:

- Semantic output.
- Keyboard behavior.
- Accessibility state.
- ARIA relationships where applicable.

---

## 14.9 Regression Prevention

Changes to Luminary SHALL include regression consideration.

Before release, maintainers SHOULD verify:

- Existing components remain functional.
- Existing contracts remain valid.
- Deprecated APIs continue to behave as documented.

---

## 14.10 Architectural Constraints

1. Luminary SHALL maintain automated tests.

2. Public contracts SHALL have validation coverage.

3. Tests SHALL validate behavior rather than implementation details.

4. Component behavior SHALL be tested independently.

5. Browser compatibility SHALL be validated beyond unit tests.

6. Accessibility SHALL be included in validation practices.

# 15. Versioning & Deprecation

## 15.1 Overview

Luminary is designed around stable public contracts.

Changes to the framework SHALL prioritize backward compatibility and predictable migration paths.

Versioning exists to communicate changes to consumers and maintain trust in the framework's public interfaces.

---

## 15.2 Public Contract Stability

The following SHALL be considered public Luminary contracts:

- CSS custom properties.
- HTML attributes.
- Custom elements.
- JavaScript APIs.
- Custom events.
- Documented behaviors.

Public contracts SHALL remain stable unless a breaking change is required.

---

## 15.3 Internal Implementation

Internal implementation details MAY change without requiring a versioning impact.

Examples include:

- File organization.
- Internal CSS selectors.
- Component implementation details.
- Build process changes.

Internal changes SHALL NOT affect documented public contracts.

---

## 15.4 Contract Changes

Changes to public contracts SHALL follow a compatibility-first approach.

A public contract change SHOULD:

1. Preserve existing functionality where possible.
2. Provide an equivalent or improved replacement.
3. Include migration documentation.
4. Maintain deprecated behavior during a transition period.

---

## 15.5 Deprecation Policy

Deprecated features SHALL remain available for a reasonable transition period.

The transition period SHALL be determined based on:

- Severity of the change.
- Consumer impact.
- Migration complexity.
- Framework release schedule.

Deprecated features SHOULD:

- Remain functional.
- Produce appropriate documentation warnings where applicable.
- Identify the recommended replacement.

---

## 15.6 Removal of Deprecated Features

Deprecated features MAY be removed only after:

- A replacement exists.
- Migration guidance has been provided.
- The deprecation period has elapsed.

Removal SHALL be documented in release notes.

---

## 15.7 Browser Compatibility Changes

Changes to supported browser versions SHALL be treated as compatibility changes.

Updates to browser requirements SHALL:

- Be documented.
- Consider consumer impact.
- Preserve existing framework contracts where possible.

---

## 15.8 Component Evolution

Web Components SHALL evolve through their public interfaces.

Component changes SHALL consider:

- Existing HTML usage.
- Existing CSS customization.
- Existing JavaScript interaction.
- Accessibility behavior.

---

## 15.9 Documentation Requirements

Version changes affecting public contracts SHALL include updated documentation.

Documentation SHOULD identify:

- New functionality.
- Changed behavior.
- Deprecated functionality.
- Migration guidance.

---

## 15.10 Architectural Constraints

1. Public contracts SHALL be treated as long-lived interfaces.

2. Breaking changes SHALL require explicit migration paths.

3. Deprecated functionality SHALL remain available during transition periods.

4. Internal implementation changes SHALL not affect consumers.

5. Framework evolution SHALL prioritize stability and predictability.
