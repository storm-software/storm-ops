## 0.21.3 (2025-01-21)

### Bug Fixes

- **workspace-tools:** Resolve internal package as ESM via `jiti` resolver ([1dc4cfdd](https://github.com/storm-software/storm-ops/commit/1dc4cfdd))

## 0.21.2 (2025-01-21)

### Bug Fixes

- **unbuild:** Resolved issue with package `exports` path ([faf23b0e](https://github.com/storm-software/storm-ops/commit/faf23b0e))

## 0.21.1 (2025-01-21)

### Bug Fixes

- **workspace-tools:** Resolve issue with invalid import path ([42a07d0c](https://github.com/storm-software/storm-ops/commit/42a07d0c))

## 0.21.0 (2025-01-21)

### Features

- **config-tools:** Added the `createLogger` function to drive CommonJs modules ([0cee1525](https://github.com/storm-software/storm-ops/commit/0cee1525))

## 0.20.2 (2025-01-21)

### Continuous Integration

- **workspace-tools:** Mark all internal packages as external ([f8c65aeb](https://github.com/storm-software/storm-ops/commit/f8c65aeb))

## 0.20.1 (2025-01-20)

### Miscellaneous

- **config-tools:** Bundle dependencies in distributable ([df027cfe](https://github.com/storm-software/storm-ops/commit/df027cfe))

## 0.20.0 (2025-01-20)

### Features

- **unbuild:** Update package to bundle config-tools ([a2fc7768](https://github.com/storm-software/storm-ops/commit/a2fc7768))

## 0.19.5 (2025-01-20)

### Bug Fixes

- **workspace-tools:** Add `jiti` to support resolution of `@storm-software/unbuild` package ([0abfa98b](https://github.com/storm-software/storm-ops/commit/0abfa98b))

## 0.19.4 (2025-01-20)

### Bug Fixes

- **workspace-tools:** Resolve formatting issue with missing `parser` config ([da80cf3d](https://github.com/storm-software/storm-ops/commit/da80cf3d))

## 0.19.3 (2025-01-20)

### Bug Fixes

- **untyped:** Resovle bundling issue with externals ([ff044ddf](https://github.com/storm-software/storm-ops/commit/ff044ddf))

## 0.19.2 (2025-01-20)

### Bug Fixes

- **unbuild:** Update package to bundle the `unbuild` package for distribution ([d304c28d](https://github.com/storm-software/storm-ops/commit/d304c28d))

## 0.19.1 (2025-01-20)

### Bug Fixes

- **workspace-tools:** Resolve cross-platform build issue in `copyfiles` script ([331a723f](https://github.com/storm-software/storm-ops/commit/331a723f))

## 0.19.0 (2025-01-20)

### Features

- **untyped:** Standard file name changes to avoid collisions ([71acf100](https://github.com/storm-software/storm-ops/commit/71acf100))

### Bug Fixes

- **pulumi-tools:** Resolved issue with invalid import paths ([af7e7c5e](https://github.com/storm-software/storm-ops/commit/af7e7c5e))
- **workspace-tools:** Resolved issues with import paths ([9eeb1f73](https://github.com/storm-software/storm-ops/commit/9eeb1f73))

## 0.18.0 (2025-01-20)

### Features

- **workspace-tools:** Added new scripts and configuration to Nx preset ([a912e765](https://github.com/storm-software/storm-ops/commit/a912e765))
- **workspace-tools:** Update Nx plugin packages to use new build/dist infrastructure ([67cd3df2](https://github.com/storm-software/storm-ops/commit/67cd3df2))

## 0.17.1 (2025-01-09)

### Bug Fixes

- **workspace-tools:** Added additional troubleshooting logging to the package
  ([c2cbdcc5](https://github.com/storm-software/storm-ops/commit/c2cbdcc5))

## 0.17.0 (2025-01-08)

### Features

- **build-tools:** Enhanced build options resolving to allow plugin list
  overrides
  ([94aa9ac4](https://github.com/storm-software/storm-ops/commit/94aa9ac4))

## 0.16.0 (2025-01-02)

### Features

- **storm-ops:** Updated catalog and JSON schema for `StormConfig` object
  ([bf99f680](https://github.com/storm-software/storm-ops/commit/bf99f680))

## 0.15.0 (2025-01-02)

### Features

- **k8s-tools:** Removed old dynamic modules import
  ([81805110](https://github.com/storm-software/storm-ops/commit/81805110))

## 0.14.0 (2025-01-02)

### Features

- **config:** Regenerate the `storm.schema.json` file
  ([258c3213](https://github.com/storm-software/storm-ops/commit/258c3213))

## 0.13.0 (2024-12-30)

### Features

- **storm-ops:** Completed enhancement around `catalog` and `workspace`
  dependency upgrades
  ([5dd13247](https://github.com/storm-software/storm-ops/commit/5dd13247))

### Dependency Upgrades

- **storm-ops:** Added consistent `@types/node` versions across repository
  ([a569536d](https://github.com/storm-software/storm-ops/commit/a569536d))

## 0.12.0 (2024-12-22)

### Features

- **esbuild:** Move shared code to `build-tools` package
  ([bef9364e](https://github.com/storm-software/storm-ops/commit/bef9364e))

## 0.11.0 (2024-12-18)

### Features

- **storm-ops:** Improved descriptions and markdown across monorepo
  ([aec89c79](https://github.com/storm-software/storm-ops/commit/aec89c79))

## 0.10.1 (2024-12-18)

### Bug Fixes

- **storm-ops:** Resolved issue with ESM resolve error during postinstall script
  execution
  ([82389510](https://github.com/storm-software/storm-ops/commit/82389510))

### Dependency Upgrades

- **storm-ops:** Upgrade Nx package to v20.2.2
  ([d793912d](https://github.com/storm-software/storm-ops/commit/d793912d))

## 0.10.0 (2024-10-31)

### Features

- **storm-ops:** Upgrade the Nx package versions used in the repository
  ([369fad24](https://github.com/storm-software/storm-ops/commit/369fad24))

## 0.9.1 (2024-09-08)

### Bug Fixes

- **workspace-tools:** Update the compiler options used in TypeScript plugin
  ([b788e426](https://github.com/storm-software/storm-ops/commit/b788e426))

## 0.9.0 (2024-09-08)

### Features

- **workspace-tools:** Ensure the workspaceRoot is used as the base directory
  ([2b8ab737](https://github.com/storm-software/storm-ops/commit/2b8ab737))

## 0.8.0 (2024-09-06)

### Features

- **k8s-tools:** Added extra fields onto the released container's `meta.json`
  file ([14356536](https://github.com/storm-software/storm-ops/commit/14356536))

### Bug Fixes

- **workspace-tools:** Resolved the duplicate export name issue
  ([f2586335](https://github.com/storm-software/storm-ops/commit/f2586335))

## 0.7.0 (2024-09-05)

### Features

- **cloudflare-tools:** Added the `R2UploadPublish` executor
  ([e5495bdb](https://github.com/storm-software/storm-ops/commit/e5495bdb))

## 0.6.0 (2024-09-03)

### Features

- **k8s-tools:** Added `container-publish` executor and `docker` plugin
  ([36d4d1d0](https://github.com/storm-software/storm-ops/commit/36d4d1d0))

- **storm-ops:** Upgrade the Nx workspace versions
  ([15cb7ee2](https://github.com/storm-software/storm-ops/commit/15cb7ee2))

## 0.5.0 (2024-09-02)

### Features

- **terraform-modules:** Added the `aws/karpenter` and `cloudflare/r2-bucket`
  modules
  ([09deea18](https://github.com/storm-software/storm-ops/commit/09deea18))

## 0.4.0 (2024-09-01)

### Features

- **workspace-tools:** Added the `noDeps` flag to the cargo-doc executor options
  ([82eeb944](https://github.com/storm-software/storm-ops/commit/82eeb944))

## 0.3.0 (2024-08-29)

### Features

- **workspace-tools:** Added base entry to package
  ([b0d3b788](https://github.com/storm-software/storm-ops/commit/b0d3b788))

## 0.2.1 (2024-08-27)

### Bug Fixes

- **k8s-tools:** Resolved issue with invalid import
  ([82a782d4](https://github.com/storm-software/storm-ops/commit/82a782d4))

## 0.2.0 (2024-08-27)

### Features

- **k8s-tools:** Added aliases for `helm-chart` and `helm-dependency` generators
  ([16a4b7c7](https://github.com/storm-software/storm-ops/commit/16a4b7c7))

## 0.1.1 (2024-08-27)

### Bug Fixes

- **k8s-tools:** Resolved issue invoking generator functions
  ([405367cb](https://github.com/storm-software/storm-ops/commit/405367cb))

## 0.1.0 (2024-08-23)

### Features

- **k8s-tools:** Initial code check-in of k8s tools
  ([cac95faa](https://github.com/storm-software/storm-ops/commit/cac95faa))
