## 0.8.0 (2025-01-22)

### Features

- **workspace-tools:** Enhanced option tokenization logic for executors ([14ed93d7](https://github.com/storm-software/storm-ops/commit/14ed93d7))

## 0.7.5 (2025-01-21)

### Bug Fixes

- **unbuild:** Ensure we always use directory as input instead of a file ([13d4a133](https://github.com/storm-software/storm-ops/commit/13d4a133))

## 0.7.4 (2025-01-21)

### Dependency Upgrades

- **monorepo:** Use version 4.2.1 of `chalk` package to prevent CommonJs issues ([133dcdfd](https://github.com/storm-software/storm-ops/commit/133dcdfd))

## 0.7.3 (2025-01-21)

### Bug Fixes

- **workspace-tools:** Resolve internal package as ESM via `jiti` resolver ([1dc4cfdd](https://github.com/storm-software/storm-ops/commit/1dc4cfdd))

## 0.7.2 (2025-01-21)

### Bug Fixes

- **workspace-tools:** Resolve issue with invalid import path ([42a07d0c](https://github.com/storm-software/storm-ops/commit/42a07d0c))

## 0.7.1 (2025-01-21)

### Continuous Integration

- **workspace-tools:** Mark all internal packages as external ([f8c65aeb](https://github.com/storm-software/storm-ops/commit/f8c65aeb))

## 0.7.0 (2025-01-20)

### Features

- **unbuild:** Update package to bundle config-tools ([a2fc7768](https://github.com/storm-software/storm-ops/commit/a2fc7768))

## 0.6.2 (2025-01-20)

### Bug Fixes

- **workspace-tools:** Resolve formatting issue with missing `parser` config ([da80cf3d](https://github.com/storm-software/storm-ops/commit/da80cf3d))

## 0.6.1 (2025-01-20)

### Bug Fixes

- **unbuild:** Update package to bundle the `unbuild` package for distribution ([d304c28d](https://github.com/storm-software/storm-ops/commit/d304c28d))

## 0.6.0 (2025-01-20)

### Features

- **unbuild:** Update build process to use cached project graph ([610c94aa](https://github.com/storm-software/storm-ops/commit/610c94aa))

## 0.5.4 (2025-01-20)

### Miscellaneous

- **monorepo:** Regenerate README markdown files ([5c8e5c96](https://github.com/storm-software/storm-ops/commit/5c8e5c96))

## 0.5.3 (2025-01-17)

### Bug Fixes

- **unbuild:** Update package to use `tsup-node` to exclude bundles ([cf712b2a](https://github.com/storm-software/storm-ops/commit/cf712b2a))

## 0.5.2 (2025-01-16)

### Miscellaneous

- **monorepo:** Regenerate README markdown files ([e4668406](https://github.com/storm-software/storm-ops/commit/e4668406))

## 0.5.1 (2025-01-16)

### Bug Fixes

- **unbuild:** Update build distributable formatting ([2c6a3dce](https://github.com/storm-software/storm-ops/commit/2c6a3dce))

## 0.5.0 (2025-01-13)

### Features

- **unbuild:** Bundle `unbuild` dependency into distributable ([78438a04](https://github.com/storm-software/storm-ops/commit/78438a04))

## 0.4.3 (2025-01-13)

### Continuous Integration

- **unbuild:** Update the build configuration to properly bundle for node
  ([72be421b](https://github.com/storm-software/storm-ops/commit/72be421b))

## 0.4.2 (2025-01-13)

### Bug Fixes

- **unbuild:** Resolved issue with the `src` path in the distributable
  ([8810c687](https://github.com/storm-software/storm-ops/commit/8810c687))

## 0.4.1 (2025-01-13)

### Bug Fixes

- **unbuild:** Resolved issue with distribution package
  ([265f38a2](https://github.com/storm-software/storm-ops/commit/265f38a2))

## 0.4.0 (2025-01-12)

### Features

- **cspell:** Added new tool names to cspell dictionary
  ([fd067a2f](https://github.com/storm-software/storm-ops/commit/fd067a2f))

## 0.3.3 (2025-01-12)

### Miscellaneous

- **monorepo:** Regenerate README markdown files
  ([a104880f](https://github.com/storm-software/storm-ops/commit/a104880f))

### Dependency Upgrades

- **monorepo:** Resolve dependency mismatches between packages
  ([72960597](https://github.com/storm-software/storm-ops/commit/72960597))

## 0.3.2 (2025-01-12)

### Bug Fixes

- **eslint:** Resolved issue with invalid `cspell` plugin
  ([1c13fb51](https://github.com/storm-software/storm-ops/commit/1c13fb51))

## 0.3.1 (2025-01-12)

### Bug Fixes

- **eslint:** Resolve stack overflow error on eslint configuration load
  ([f66752ac](https://github.com/storm-software/storm-ops/commit/f66752ac))

## 0.3.0 (2025-01-11)

### Features

- **eslint:** Added `utils` module to the package distribution
  ([42501160](https://github.com/storm-software/storm-ops/commit/42501160))

## 0.2.3 (2025-01-11)

### Bug Fixes

- **eslint:** Resolved issue with the bundling process
  ([d06b6588](https://github.com/storm-software/storm-ops/commit/d06b6588))

## 0.2.2 (2025-01-11)

### Bug Fixes

- **config-tools:** Resolve issue with missing `logger` module
  ([1b5df538](https://github.com/storm-software/storm-ops/commit/1b5df538))

## 0.2.1 (2025-01-11)

### Bug Fixes

- **workspace-tools:** Resolve issue loading pnpm workspace's catalog
  dependencies
  ([1199e24f](https://github.com/storm-software/storm-ops/commit/1199e24f))

## 0.2.0 (2025-01-11)

### Features

- **eslint:** Update some default storm linting rules to match new standard
  ([b29cea21](https://github.com/storm-software/storm-ops/commit/b29cea21))

## 0.1.1 (2025-01-11)

### Miscellaneous

- **workspace-tools:** Added additional logging for pnpm dependency updates
  process
  ([400b3369](https://github.com/storm-software/storm-ops/commit/400b3369))

## 0.1.0 (2025-01-11)

### Features

- **cspell:** Initial check-in of the CSpell configuration package
  ([f5768507](https://github.com/storm-software/storm-ops/commit/f5768507))
