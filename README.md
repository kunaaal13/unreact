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
| `bun start`            | Run the entry point once                              |
| `bun run dev`          | Restart the entry point when files change             |
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
src/
  index.ts       # Starting point
  index.test.ts  # Starter smoke test
```

TypeScript uses strict checks and includes browser DOM types for future rendering code. JSX is preserved; no React JSX runtime is configured. The dev command runs in Bun, not a browser; browser serving and JSX transforms can be added when needed.

## Practice ideas

1. Represent elements as plain objects.
2. Render elements into browser DOM nodes.
3. Add updates and reconciliation.
4. Support function components.
5. Implement basic hooks such as `useState`.
