# Configuration Development Plan

## Purpose

Establish a small, explicit environment configuration layer for Luminary so logging behavior and future feature flags can be controlled consistently across development and build outputs.

## Todo List

1. Define the `LumConfig` contract, including supported values, precedence, and mode-specific defaults.
2. Establish env-file-first defaults for development and production, with script-level overrides limited to edge cases.
3. Add build-time injection in the Vite config path so the resolved configuration is baked into the library artifact and example build flow.
4. Update logger filtering so production artifacts suppress lower-priority output while development keeps full visibility.
5. Update repository documentation to describe the configuration model, precedence rules, and logging behavior.
6. Add verification coverage for config resolution and log filtering, then run the required quality gates.

## Relevant Files

- [docs/Architecture.md](docs/Architecture.md) - architecture guidance for the environment configuration strategy.
- [vite.config.js](vite.config.js) - library build configuration and build-time value injection.
- [vite.examples.config.js](vite.examples.config.js) - development server configuration.
- [package.json](package.json) - script entry points and override commands.
- [src/utils/logger.util.ts](src/utils/logger.util.ts) - centralized logging behavior.
- [src/utils/index.ts](src/utils/index.ts) - utility exports if the logger support becomes reusable.
- [src/index.ts](src/index.ts) - library entry if configuration needs to be surfaced publicly.

## Verification

1. Validate the configuration contract against the configured dev and build entry points.
2. Confirm the logger only emits the intended levels in production-mode and development-mode scenarios.
3. Run `npm run test`.
4. Run `npm run build`.
5. Run `npm run verify:package`.

## Decisions

- Use `LumConfig` as the explicit project-specific configuration name.
- Prefer `.env.development` and `.env.production` as the primary sources of truth.
- Treat logging as build-time controlled for the shipped artifact.
- Keep `warn` and `error` visible in production, and allow `info` and `trace` in development.
- Use a scenario matrix in the docs if additional environment combinations are introduced later.
