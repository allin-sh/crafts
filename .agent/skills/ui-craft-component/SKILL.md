---
name: ui-craft-component
description: Use when creating, refactoring, or reviewing UI Craft React components, packages under packages/crafts, Ladle stories, module.css styling, or component public APIs.
---

# UI Craft Component

Use this skill when adding a new component/craft, changing an existing component API, styling a craft, or reviewing component quality in this repository.

## Product Bar

This project is for precise, polished, production-quality UI components. Prefer thoughtful interaction details, clean public APIs, strong visual finish, and maintainable implementation over quick demos.

## New Component Workflow

1. Create new component packages with `pnpm craft` unless the user explicitly asks to add code to an existing package.
2. Inspect the generated package before editing. Follow the existing package shape, scripts, `tsup.config.ts`, `tsconfig.json`, `src/index.ts`, and story conventions.
3. Keep the package self-contained under `packages/crafts/<craft-name>`.
4. Export React-facing APIs from `src/index.ts` so consumers can import from the package root.
5. Add or update a Ladle story that demonstrates the default state and meaningful interaction states.

## Dependency Policy

Avoid runtime library dependencies for craft components by default.

Use dependencies only when there is a concrete reason, such as:

- browser APIs are not enough for the interaction quality required
- implementing the behavior correctly would add substantial complexity
- the dependency is already a project convention for that class of behavior
- accessibility, gesture handling, animation, or geometry requires a well-tested primitive

When adding a dependency:

- prefer existing workspace catalogs in `pnpm-workspace.yaml`
- add new catalog entries when the dependency is reusable across packages
- document why the dependency is justified in the final response or PR summary
- keep public APIs independent of dependency-specific types unless unavoidable

## Styling Rules

Use `*.module.css` for component styling unless there is a clear reason not to.

Design every component for both light mode and dark mode. Check contrast, shadows, borders, translucent surfaces, focus states, and interaction feedback in both themes.

Prefer:

- CSS Modules for local component styles
- CSS custom properties for themeable values and controlled variants
- `data-*` attributes for state styling
- semantic class names tied to component parts
- `prefers-reduced-motion` handling for non-trivial animations
- theme-aware CSS variables or explicit light/dark selectors when colors differ by theme

Avoid:

- global selectors like `li`, `button`, `*`, or unscoped `.class` that can affect Ladle or host apps
- styling libraries for ordinary component styling
- leaking assumptions about the consuming app's reset, theme, or layout
- relying on undefined CSS variables without fallbacks
- colors that only work on one background theme
- inline styles for stable visual styling when CSS Modules can express it

If global CSS is truly needed, scope it under a unique craft root class and use narrow selectors.

## Component Architecture

Keep simple components simple. Split only when it improves readability, reuse, or testability.

For complex components, break implementation into maintainable parts:

- public root component
- internal visual parts
- focused hooks for input, measurements, animation, or state machines
- pure helpers for geometry, formatting, or state transitions
- CSS module sections that mirror component parts

Do not prematurely abstract. Prefer a few clear files over many tiny files.

## Public API Design

The user experience of consuming the component is the first priority.

Design APIs that are:

- obvious from TypeScript autocomplete
- hard to misuse
- flexible enough for real usage without exposing internals
- stable across styling and implementation refactors

Prefer explicit prop names and typed unions over loose strings or `any`.

Use a compound component pattern when it makes composition easier, similar to shadcn-style APIs. Examples where compound components may fit:

- the component has named slots
- consumers need to customize nested parts
- multiple subcomponents share context
- the natural usage reads better as composition than as a large prop object

Do not use compound components just because they are fashionable. If one root component with a small prop surface is easier for users, choose that.

## React Guidelines

Build for React package consumption.

Prefer:

- typed props and exported public types
- `forwardRef` when DOM access is useful to consumers
- controlled/uncontrolled patterns only when they are actually needed
- state derived during render instead of mirrored state where practical
- refs for high-frequency transient interaction values
- effect cleanup for subscriptions, timers, observers, and global listeners

Avoid:

- broad document/window side effects without cleanup
- module-level mutable state that can leak across component instances
- global event listeners per item when one scoped listener is enough
- unstable keys like `Date.now()` during render
- defaulting to `useMemo`/`useCallback` unless there is a measured or structural reason

## Interaction Quality

Account for real states, not only the happy path.

Consider:

- hover, active, focus-visible, disabled, loading, and empty states
- keyboard operation where applicable
- pointer and touch behavior where applicable
- reduced motion
- responsive layout and container constraints
- light mode and dark mode visual states
- visual feedback timing and easing
- cleanup after unmount or interrupted interactions

## Accessibility

Use semantic HTML first.

For interactive components:

- ensure keyboard access where the pattern expects it
- expose accessible labels for icon-only controls
- keep focus behavior predictable
- use ARIA only when native semantics are insufficient
- do not trap focus unless the component behaves like a modal/dialog/menu that requires it

## Verification

Before finishing component work, run the narrowest useful checks:

```bash
pnpm --filter <package-name> typecheck
pnpm --filter <package-name> build
pnpm exec biome check <changed-files>
```

For changes that affect app integration or exports, also run:

```bash
pnpm build
```

If a long-running dev command is needed, verify it starts successfully and then stop it.

## Review Checklist

Before finalizing, check:

- package was created with `pnpm craft` for new crafts
- `src/index.ts` exports the intended public API
- styles are scoped and use `module.css` where practical
- no accidental global selectors affect Ladle or consuming apps
- runtime dependencies are avoided or justified
- component is split only where it improves maintenance
- API is easy for external consumers to use
- story demonstrates the component clearly
- light mode and dark mode have both been considered
- typecheck/build/format checks pass or limitations are explicitly reported
