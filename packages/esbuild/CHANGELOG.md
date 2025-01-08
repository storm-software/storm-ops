## 0.11.0 (2025-01-02)

### Features

- **workspace-tools:** Added code to strip `catalog:` references in published
  `package.json` files
  ([d50c3ea6](https://github.com/storm-software/storm-ops/commit/d50c3ea6))

### Bug Fixes

- **storm-ops:** Remove unused `deepmerge` references and fix build
  ([0f4ee3f7](https://github.com/storm-software/storm-ops/commit/0f4ee3f7))

### 🧱 Updated Dependencies

- Updated config-tools to 1.127.0
- Updated build-tools to 0.119.0
- Updated config to 1.88.0

## 0.10.2 (2025-01-02)

### Bug Fixes

- **git-tools:** Ensure the correct email is provided for Stormie-Bot
  ([5fb2c9b6](https://github.com/storm-software/storm-ops/commit/5fb2c9b6))

### 🧱 Updated Dependencies

- Updated config-tools to 1.126.2
- Updated build-tools to 0.118.2
- Updated config to 1.87.2

## 0.10.1 (2025-01-02)

### Bug Fixes

- **workspace-tools:** Resolved issue displaying buffer errors in publish
  executor
  ([21791bd1](https://github.com/storm-software/storm-ops/commit/21791bd1))

### 🧱 Updated Dependencies

- Updated config-tools to 1.126.1
- Updated build-tools to 0.118.1
- Updated config to 1.87.1

## 0.10.0 (2025-01-02)

### Features

- **storm-ops:** Updated catalog and JSON schema for `StormConfig` object
  ([bf99f680](https://github.com/storm-software/storm-ops/commit/bf99f680))

### 🧱 Updated Dependencies

- Updated config-tools to 1.126.0
- Updated build-tools to 0.118.0
- Updated config to 1.87.0

## 0.9.0 (2025-01-02)

### Features

- **config:** Clean up Storm workspace configuration properties
  ([22508dd8](https://github.com/storm-software/storm-ops/commit/22508dd8))

### 🧱 Updated Dependencies

- Updated config-tools to 1.125.0
- Updated build-tools to 0.117.0
- Updated config to 1.86.0

## 0.8.0 (2025-01-02)

### Features

- **k8s-tools:** Removed old dynamic modules import
  ([81805110](https://github.com/storm-software/storm-ops/commit/81805110))

### 🧱 Updated Dependencies

- Updated config-tools to 1.124.0
- Updated build-tools to 0.116.0
- Updated config to 1.85.0

## 0.7.0 (2025-01-02)

### Features

- **workspace-tools:** Removed old dynamically imported modules
  ([56f84500](https://github.com/storm-software/storm-ops/commit/56f84500))

### 🧱 Updated Dependencies

- Updated config-tools to 1.123.0
- Updated build-tools to 0.115.0
- Updated config to 1.84.0

## 0.6.3 (2025-01-02)

### Bug Fixes

- **storm-ops:** Resolved issue with missing `zod` dependency
  ([a886ddde](https://github.com/storm-software/storm-ops/commit/a886ddde))

### 🧱 Updated Dependencies

- Updated config-tools to 1.122.3
- Updated build-tools to 0.114.3
- Updated config to 1.83.3

## 0.6.2 (2025-01-02)

### Bug Fixes

- **storm-ops:** Resolve issue preventing release publishing
  ([92c10eae](https://github.com/storm-software/storm-ops/commit/92c10eae))

### 🧱 Updated Dependencies

- Updated config-tools to 1.122.2
- Updated build-tools to 0.114.2
- Updated config to 1.83.2

## 0.6.1 (2025-01-02)

### Bug Fixes

- **workspace-tools:** Resolved issue with missing `deepmerge` dependency
  ([f27195c6](https://github.com/storm-software/storm-ops/commit/f27195c6))

### 🧱 Updated Dependencies

- Updated config-tools to 1.122.1
- Updated build-tools to 0.114.1
- Updated config to 1.83.1

## 0.6.0 (2025-01-02)

### Features

- **workspace-tools:** Added `esbuild` executor and removed deprecations
  ([aaef5e70](https://github.com/storm-software/storm-ops/commit/aaef5e70))
- **unbuild:** Added the `storm-unbuild` binaries
  ([ac6560a6](https://github.com/storm-software/storm-ops/commit/ac6560a6))
- **esbuild:** Added the `storm-esbuild-cjs` and `storm-esbuild-esm` binaries
  ([10c057ac](https://github.com/storm-software/storm-ops/commit/10c057ac))
- **esbuild:** Added the `storm-esbuild` binary
  ([2a9cfd19](https://github.com/storm-software/storm-ops/commit/2a9cfd19))
- **build-tools:** Stripped out unused/older code from package
  ([f67738d5](https://github.com/storm-software/storm-ops/commit/f67738d5))
- **config-tools:** Added separate `logger` module to package
  ([3d33abf9](https://github.com/storm-software/storm-ops/commit/3d33abf9))
- **esbuild:** Added pipeline logging to trace build steps
  ([5897e233](https://github.com/storm-software/storm-ops/commit/5897e233))
- **config-tools:** Use `tsup` to expand package format and export config
  ([d9e53d7d](https://github.com/storm-software/storm-ops/commit/d9e53d7d))

### Bug Fixes

- **workspace-tools:** Resolve issue with invalid taplo configuration file name
  ([1ffec7e6](https://github.com/storm-software/storm-ops/commit/1ffec7e6))

### 🧱 Updated Dependencies

- Updated config-tools to 1.122.0
- Updated build-tools to 0.114.0
- Updated config to 1.83.0

## 0.5.0 (2024-12-30)

### Features

- **esbuild:** Updated the `tsc` plugin to handle monorepos correctly
  ([ed6b42cd](https://github.com/storm-software/storm-ops/commit/ed6b42cd))
- **storm-ops:** Completed enhancement around `catalog` and `workspace`
  dependency upgrades
  ([5dd13247](https://github.com/storm-software/storm-ops/commit/5dd13247))
- **esbuild:** Added new plugins and build options
  ([481ac411](https://github.com/storm-software/storm-ops/commit/481ac411))

### Dependency Upgrades

- **storm-ops:** Added consistent `@types/node` versions across repository
  ([a569536d](https://github.com/storm-software/storm-ops/commit/a569536d))

### 🧱 Updated Dependencies

- Updated config-tools to 1.120.0
- Updated build-tools to 0.112.0
- Updated config to 1.81.0

## 0.4.1 (2024-12-23)

### Bug Fixes

- **unbuild:** Resolve typing issues with mismatch `typescript` versions
  ([5a9bd555](https://github.com/storm-software/storm-ops/commit/5a9bd555))

### 🧱 Updated Dependencies

- Updated config-tools to 1.118.0
- Updated build-tools to 0.110.0
- Updated config to 1.79.0

## 0.4.0 (2024-12-22)

### Features

- **unbuild:** Initial check-in of the `unbuild` package
  ([fc246154](https://github.com/storm-software/storm-ops/commit/fc246154))
- **esbuild:** Added copy-assets and reporting build steps
  ([d8372730](https://github.com/storm-software/storm-ops/commit/d8372730))

### Bug Fixes

- **esbuild:** Resolve DTS build issue
  ([bc4464b8](https://github.com/storm-software/storm-ops/commit/bc4464b8))

### 🧱 Updated Dependencies

- Updated config-tools to 1.117.0
- Updated build-tools to 0.109.0

## 0.3.0 (2024-12-22)

### Features

- **esbuild:** Move shared code to `build-tools` package
  ([bef9364e](https://github.com/storm-software/storm-ops/commit/bef9364e))

### 🧱 Updated Dependencies

- Updated build-tools to 0.108.0

## 0.2.0 (2024-12-22)

### Features

- **esbuild:** Use `tsup` to build to package
  ([8d7a14f9](https://github.com/storm-software/storm-ops/commit/8d7a14f9))

## 0.1.0 (2024-12-22)

### Features

- **esbuild:** Initial check-in of the `esbuild` utility package
  ([ee029b2e](https://github.com/storm-software/storm-ops/commit/ee029b2e))
