# unreact

Building React from scratch to learn how it works. No React dependency, no implementation yet.

## Setup

Install [Bun](https://bun.sh), then:

```sh
bun install
bun run dev
```

## Commands

| Command                | Purpose                                               |
| ---------------------- | ----------------------------------------------------- |
| `bun start`            | Serve the browser playground                          |
| `bun run dev`          | Serve with browser hot reload                         |
| `bun run build`        | Bundle HTML and browser assets into `dist/`           |
| `bun test`             | Run tests                                             |
| `bun run test:watch`   | Rerun tests when files change                         |
| `bun run typecheck`    | Check TypeScript types                                |
| `bun run lint`         | Lint with Oxlint; warnings fail the check             |
| `bun run lint:fix`     | Apply automatic lint fixes                            |
| `bun run format`       | Format files with Oxfmt                               |
| `bun run format:check` | Check formatting without writing files                |
| `bun run check`        | Run type checking, lint, formatting checks, and tests |

Lint rules live in `.oxlintrc.json`; formatter options live in `.oxfmtrc.json`.
Both tools are local dev dependencies run through Bun scripts; no global install needed.

## Structure

```text
index.html       # Browser playground with #root mount point
src/
  index.ts       # Starting point
  index.test.ts  # Starter smoke test
```

Open the URL printed by `bun run dev` (normally `http://localhost:3000`).
`index.html` imports `src/index.ts`; Bun bundles TypeScript in memory and hot-reloads the browser as you edit. No manual rebuild or polling `dist/` needed. Use `bun run build` to generate static output in `dist/`, including its own `index.html` with bundled asset paths.

TypeScript uses strict checks and includes browser DOM types. JSX is preserved by the type checker; no React JSX runtime is configured. Configure your own JSX factory/runtime when you reach that step.

## Practice ideas

1. Represent elements as plain objects.
2. Render elements into browser DOM nodes.
3. Add updates and reconciliation.
4. Support function components.
5. Implement basic hooks such as `useState`.
