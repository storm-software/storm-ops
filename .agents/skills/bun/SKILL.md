---
name: Bun
description: Use when building, testing, or deploying JavaScript/TypeScript applications. Reach for Bun when you need to run scripts, install dependencies, bundle code, or test applications with a single unified toolkit that replaces Node.js, npm, and other build tools.
metadata:
    mintlify-proj: bun
    version: "1.0"
---

# Bun Skill Reference

## Product Summary

Bun is an all-in-one JavaScript/TypeScript toolkit that replaces Node.js, npm, and build tools. It includes a fast runtime (powered by JavaScriptCore), package manager, bundler, and test runner—all in a single executable. Key files: `bunfig.toml` (configuration), `package.json` (dependencies and scripts), `bun.lock` (lockfile). Primary commands: `bun run`, `bun install`, `bun build`, `bun test`. See https://bun.com/docs for complete documentation.

## When to Use

- **Running code**: Execute `.js`, `.ts`, `.jsx`, `.tsx` files directly without compilation steps
- **Package management**: Install, add, remove, or update npm packages 25x faster than npm
- **Building**: Bundle TypeScript, JSX, React, and CSS for browsers or servers
- **Testing**: Run Jest-compatible tests with TypeScript support and watch mode
- **Scripts**: Execute `package.json` scripts 28x faster than npm
- **Monorepos**: Manage workspaces with isolated or hoisted dependency strategies
- **Migrating from Node.js**: Drop-in replacement for existing Node.js projects with minimal changes

## Quick Reference

### Core Commands

| Task | Command | Notes |
|------|---------|-------|
| Run a file | `bun run index.ts` | Supports `.ts`, `.tsx`, `.jsx` natively |
| Run a script | `bun run dev` | From `package.json` scripts |
| Install deps | `bun install` | Creates `bun.lock` lockfile |
| Add package | `bun add react` | Adds to `package.json` and installs |
| Add dev dep | `bun add -d @types/node` | Adds to `devDependencies` |
| Remove package | `bun remove react` | Removes from `package.json` |
| Bundle code | `bun build ./index.ts --outdir ./dist` | Outputs to directory |
| Run tests | `bun test` | Finds `*.test.ts`, `*.spec.ts` files |
| Watch mode | `bun --watch run index.ts` | Re-runs on file changes |
| Execute package | `bunx cowsay hello` | Like `npx` |

### Configuration File: bunfig.toml

Place in project root alongside `package.json`. Optional—Bun works without it.

```toml
[install]
# Package manager settings
optional = true          # Install optional dependencies
dev = true              # Install dev dependencies
peer = true             # Install peer dependencies
production = false      # Production mode (skip devDeps)
linker = "hoisted"      # "hoisted" or "isolated"

[test]
# Test runner settings
root = "."              # Test root directory
coverage = false        # Enable coverage reporting
timeout = 5000          # Per-test timeout in ms
randomize = false       # Run tests in random order

[serve]
# HTTP server defaults
port = 3000             # Default port for Bun.serve

[run]
# Script execution settings
shell = "system"        # "system" or "bun"
bun = true              # Auto-alias node to bun
silent = false          # Suppress command output

[define]
# Replace identifiers at build/runtime
"process.env.API_URL" = "'https://api.example.com'"
```

### File Type Support

Bun transpiles on the fly. No configuration needed.

| Extension | Handled As | Notes |
|-----------|-----------|-------|
| `.js`, `.mjs` | JavaScript | ESM or CommonJS |
| `.ts`, `.mts` | TypeScript | Transpiled to JS |
| `.jsx` | JSX | Transpiled with React factory |
| `.tsx` | TypeScript + JSX | Full support |
| `.json`, `.jsonc` | JSON | Imported as objects |
| `.toml`, `.yaml` | Config files | Imported as objects |
| `.html` | HTML | Bundler processes assets |
| `.css` | Stylesheets | Bundled together |

### Package Manager Flags

```bash
bun install --production          # Skip devDependencies
bun install --frozen-lockfile     # Fail if lockfile out of sync
bun install --dry-run             # Preview without installing
bun install --linker isolated     # Strict dependency isolation
bun install --linker hoisted      # Traditional npm layout
bun install --global              # Install globally
bun install --verbose             # Debug logging
```

### Test Runner Flags

```bash
bun test --watch                  # Re-run on changes
bun test --concurrent             # Run tests in parallel
bun test --timeout 10000          # Per-test timeout (ms)
bun test --bail                   # Stop after first failure
bun test --retry 3                # Retry failed tests
bun test --coverage               # Generate coverage report
bun test -t "pattern"             # Filter by test name
```

### Bundler Options

```bash
bun build ./index.ts --outdir ./dist
bun build ./index.ts --outdir ./dist --minify
bun build ./index.ts --outdir ./dist --sourcemap linked
bun build ./index.ts --outdir ./dist --target browser
bun build ./index.ts --outdir ./dist --format esm
bun build ./index.ts --outdir ./dist --splitting
bun build ./index.ts --outdir ./dist --watch
```

## Decision Guidance

### When to Use Hoisted vs. Isolated Installs

| Scenario | Use | Why |
|----------|-----|-----|
| New monorepo/workspace | `isolated` | Prevents phantom dependencies |
| New single-package project | `hoisted` | Traditional npm behavior |
| Existing project (pre-v1.3.2) | `hoisted` | Backward compatibility |
| Strict dependency enforcement | `isolated` | Packages only access declared deps |
| Maximum compatibility | `hoisted` | Works like npm/yarn |

### When to Use bun build vs. bun run

| Use Case | Tool | Why |
|----------|------|-----|
| Development, testing | `bun run` | Fast startup, no bundling overhead |
| Production deployment | `bun build` | Optimized, minified, single file |
| Browser apps | `bun build --target browser` | Outputs ES modules for `<script type="module">` |
| Server apps | `bun build --target bun` | Optimized for Bun runtime |
| Node.js compatibility | `bun build --target node` | Outputs CommonJS |

### When to Use bun test vs. External Test Runners

| Scenario | Use Bun | Use External |
|----------|---------|--------------|
| TypeScript tests | ✓ | Only if Jest/Vitest already configured |
| Jest compatibility needed | ✓ | If advanced features required |
| DOM/UI testing | ✓ | With HappyDOM or Testing Library |
| Snapshot testing | ✓ | If Jest snapshots needed |
| Custom reporters | ✗ | Use Jest/Vitest |

## Workflow

### 1. Initialize a New Project

```bash
bun init my-app
cd my-app
```

Choose template: `Blank`, `React`, or `Library`. Creates `package.json`, `tsconfig.json`, `bunfig.toml`, and starter files.

### 2. Install Dependencies

```bash
bun install                    # Install all deps from package.json
bun add react                  # Add a package
bun add -d @types/node         # Add dev dependency
bun install --frozen-lockfile  # CI: exact versions from bun.lock
```

Check `bun.lock` into version control for reproducible installs.

### 3. Run Code or Scripts

```bash
bun run index.ts               # Run a file directly
bun run dev                    # Run a package.json script
bun --watch run index.ts       # Watch mode
```

Bun transpiles TypeScript/JSX on the fly. No build step needed for development.

### 4. Write and Run Tests

```bash
# Create test file: math.test.ts
import { test, expect } from "bun:test";
test("2 + 2 = 4", () => {
  expect(2 + 2).toBe(4);
});

# Run tests
bun test
bun test --watch
bun test --coverage
```

Tests auto-discover files matching `*.test.ts`, `*.spec.ts`, etc.

### 5. Build for Production

```bash
# Bundle for browser
bun build ./src/index.tsx --outdir ./dist --minify

# Bundle for server
bun build ./src/server.ts --outdir ./dist --target bun --minify

# Create standalone executable
bun build ./cli.ts --outfile mycli --compile
```

Output is optimized, minified, and ready to deploy.

### 6. Configure bunfig.toml (Optional)

```toml
[install]
linker = "isolated"

[test]
coverage = true
timeout = 10000

[run]
bun = true
```

Override defaults as needed. Most projects work without this file.

## Common Gotchas

- **Lifecycle scripts disabled by default**: Bun doesn't run `postinstall` scripts for security. Add trusted packages to `trustedDependencies` in `package.json` to allow them.

- **Flags go after `bun`, not after the command**: Use `bun --watch run dev`, not `bun run dev --watch`. Flags after the command are passed to the script itself.

- **`bun.lock` is binary by default**: Prior to Bun 1.2, lockfiles were binary (`bun.lockb`). Upgrade with `bun install --save-text-lockfile --frozen-lockfile --lockfile-only`, then delete `bun.lockb`.

- **Node.js shebang scripts run with Node by default**: Scripts with `#!/usr/bin/env node` run with Node.js. Use `bun run --bun script` to force Bun instead.

- **Environment variables not auto-loaded in bunfig.toml by default**: Use `$VARIABLE` syntax in `bunfig.toml` to reference env vars. Bun loads `.env`, `.env.local`, `.env.[NODE_ENV]` automatically at runtime.

- **Peer dependencies installed by default**: Unlike npm, Bun installs `peerDependencies` automatically. Disable with `peer = false` in `bunfig.toml` or `--omit peer` flag.

- **Auto-install can mask missing dependencies**: With `install.auto = "auto"` (default), missing packages are installed on the fly. In CI, use `--frozen-lockfile` to catch missing deps.

- **Isolated linker requires explicit hoisting for some packages**: With `linker = "isolated"`, packages can only access declared dependencies. Use `publicHoistPattern` to hoist specific packages to root `node_modules`.

- **TypeScript errors don't block execution**: Bun runs `.ts` files even with type errors. Use a separate type-checker (`tsc --noEmit`) in CI if strict type checking is required.

- **CommonJS `require()` works but ESM is preferred**: Bun supports both, but ESM is the default. Use `import` statements for better tree-shaking and bundler optimization.

## Verification Checklist

Before submitting work with Bun:

- [ ] Run `bun install --frozen-lockfile` to verify lockfile is up to date
- [ ] Run `bun test` and confirm all tests pass
- [ ] Run `bun build` and verify output is generated without errors
- [ ] Check `bun.lock` is committed to version control
- [ ] Verify `bunfig.toml` settings match project requirements (linker strategy, test config, etc.)
- [ ] Test with `bun run` to confirm scripts execute correctly
- [ ] Check that TypeScript files transpile without errors (use `tsc --noEmit` for strict checking)
- [ ] Verify environment variables are loaded correctly (check `.env` files exist and are not in `.gitignore`)
- [ ] Confirm `package.json` has correct `"type": "module"` or `"type": "commonjs"` if needed
- [ ] Test in CI environment with `bun ci` or `bun install --frozen-lockfile`

## Resources

- **Comprehensive navigation**: https://bun.com/docs/llms.txt — Full page-by-page listing for agent reference
- **Runtime documentation**: https://bun.com/docs/runtime — Execute files, scripts, and use Bun APIs
- **Package manager**: https://bun.com/docs/pm/cli/install — Install, add, remove packages
- **Bundler**: https://bun.com/docs/bundler — Bundle TypeScript, JSX, CSS for production

---

> For additional documentation and navigation, see: https://bun.com/docs/llms.txt