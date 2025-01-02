## 0.6.0 (2025-01-02)

### Features

- **workspace-tools:** Added `esbuild` executor and removed deprecations ([aaef5e70](https://github.com/storm-software/storm-ops/commit/aaef5e70))
- **unbuild:** Added the `storm-unbuild` binaries ([ac6560a6](https://github.com/storm-software/storm-ops/commit/ac6560a6))
- **esbuild:** Added the `storm-esbuild` binary ([2a9cfd19](https://github.com/storm-software/storm-ops/commit/2a9cfd19))
- **build-tools:** Stripped out unused/older code from package ([f67738d5](https://github.com/storm-software/storm-ops/commit/f67738d5))
- **unbuild:** Added pipeline logging to trace build steps ([a1d371b1](https://github.com/storm-software/storm-ops/commit/a1d371b1))
- **config-tools:** Added separate `logger` module to package ([3d33abf9](https://github.com/storm-software/storm-ops/commit/3d33abf9))
- **config-tools:** Use `tsup` to expand package format and export config ([d9e53d7d](https://github.com/storm-software/storm-ops/commit/d9e53d7d))

### Bug Fixes

- **workspace-tools:** Resolve issue with invalid taplo configuration file name ([1ffec7e6](https://github.com/storm-software/storm-ops/commit/1ffec7e6))

### Dependency Upgrades

- **storm-ops:** Moved `rollup` and `zod` into the pnpm catalog ([c80b2a62](https://github.com/storm-software/storm-ops/commit/c80b2a62))

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
