## 0.12.0 (2025-01-08)

### Features

- **git-tools:** Added default release group configurations ([4b30144d](https://github.com/storm-software/storm-ops/commit/4b30144d))
- **build-tools:** Enhanced build options resolving to allow plugin list overrides ([94aa9ac4](https://github.com/storm-software/storm-ops/commit/94aa9ac4))
- **git-tools:** Complete redesign of the package and tools contained within ([96de0911](https://github.com/storm-software/storm-ops/commit/96de0911))

### Bug Fixes

- **git-tools:** Remove Nx release configuration defaulting module ([6bf1dacf](https://github.com/storm-software/storm-ops/commit/6bf1dacf))
- **git-tools:** Updates to default `nx.json` configuration applied on release ([e15c2954](https://github.com/storm-software/storm-ops/commit/e15c2954))
- **git-tools:** Resolve issue with `git` parameters provided to `release` APIs ([dd098e08](https://github.com/storm-software/storm-ops/commit/dd098e08))
- **git-tools:** Resolved issue with invalid path provided to `copyfile` in `build` target ([440ac16b](https://github.com/storm-software/storm-ops/commit/440ac16b))
- **git-tools:** Resolved issue with generated output directory ([8d6ef27c](https://github.com/storm-software/storm-ops/commit/8d6ef27c))
- **git-tools:** Update dist output to be found in workflow action ([3f4dc983](https://github.com/storm-software/storm-ops/commit/3f4dc983))
- **linting-tools:** Update `zizmor` configuration line number ([4dd6fbc1](https://github.com/storm-software/storm-ops/commit/4dd6fbc1))

### Code Improvements

- **workspace-tools:** Added release group configuration to nx configuration prefixes ([1ac21fcf](https://github.com/storm-software/storm-ops/commit/1ac21fcf))

### Chores

- **git-tools:** Added logic to properly copy dist files to output folder ([1810fb35](https://github.com/storm-software/storm-ops/commit/1810fb35))
- **monorepo:** Update the release script to work in any environment ([c423f46e](https://github.com/storm-software/storm-ops/commit/c423f46e))

### Continuous Integration

- **monorepo:** Resolve issue with `changelog-renderer` selected for repository ([3686b00f](https://github.com/storm-software/storm-ops/commit/3686b00f))

### Dependency Upgrades

- **monorepo:** Update `chalk` depenency to v4.1.2 to work with cjs packages ([a92755e8](https://github.com/storm-software/storm-ops/commit/a92755e8))

### 🧱 Updated Dependencies

- Updated config-tools to 1.128.0
- Updated build-tools to 0.120.0
- Updated config to 1.89.0

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
- **esbuild:** Added the `storm-esbuild` binary
  ([2a9cfd19](https://github.com/storm-software/storm-ops/commit/2a9cfd19))
- **build-tools:** Stripped out unused/older code from package
  ([f67738d5](https://github.com/storm-software/storm-ops/commit/f67738d5))
- **unbuild:** Added pipeline logging to trace build steps
  ([a1d371b1](https://github.com/storm-software/storm-ops/commit/a1d371b1))
- **config-tools:** Added separate `logger` module to package
  ([3d33abf9](https://github.com/storm-software/storm-ops/commit/3d33abf9))
- **config-tools:** Use `tsup` to expand package format and export config
  ([d9e53d7d](https://github.com/storm-software/storm-ops/commit/d9e53d7d))

### Bug Fixes

- **workspace-tools:** Resolve issue with invalid taplo configuration file name
  ([1ffec7e6](https://github.com/storm-software/storm-ops/commit/1ffec7e6))

### Dependency Upgrades

- **storm-ops:** Moved `rollup` and `zod` into the pnpm catalog
  ([c80b2a62](https://github.com/storm-software/storm-ops/commit/c80b2a62))

### 🧱 Updated Dependencies

- Updated config-tools to 1.122.0
- Updated build-tools to 0.114.0
- Updated config to 1.83.0

## 0.5.0 (2024-12-30)

### Features

- **storm-ops:** Completed enhancement around `catalog` and `workspace`
  dependency upgrades
  ([5dd13247](https://github.com/storm-software/storm-ops/commit/5dd13247))

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

### 🧱 Updated Dependencies

- Updated config-tools to 1.117.0
- Updated build-tools to 0.109.0
