## 0.128.0 (2025-01-20)

### Features

- **build-tools:** Update helpers to use cached project graph ([ae202661](https://github.com/storm-software/storm-ops/commit/ae202661))

## 0.127.0 (2025-01-20)

### Features

- **unbuild:** Update build process to use cached project graph ([610c94aa](https://github.com/storm-software/storm-ops/commit/610c94aa))

## 0.126.0 (2025-01-20)

### Features

- **untyped:** Initial check-in for the `untyped` package ([c02dad71](https://github.com/storm-software/storm-ops/commit/c02dad71))

### Bug Fixes

- **workspace-tools:** Resolved issue with invalid `package.json` exports ([76c63c08](https://github.com/storm-software/storm-ops/commit/76c63c08))

### Miscellaneous

- **monorepo:** Regenerate README markdown files ([5c8e5c96](https://github.com/storm-software/storm-ops/commit/5c8e5c96))

## 0.125.4 (2025-01-17)

### Bug Fixes

- **unbuild:** Update package to use `tsup-node` to exclude bundles ([cf712b2a](https://github.com/storm-software/storm-ops/commit/cf712b2a))

## 0.125.3 (2025-01-16)

### Bug Fixes

- **workspace-tools:** Added additional externals to the package list
  ([5d4a063f](https://github.com/storm-software/storm-ops/commit/5d4a063f))

### Miscellaneous

- **monorepo:** Regenerate the README markdown files
  ([e911945a](https://github.com/storm-software/storm-ops/commit/e911945a))

## 0.125.2 (2025-01-16)

### Miscellaneous

- **monorepo:** Regenerate README markdown files
  ([e4668406](https://github.com/storm-software/storm-ops/commit/e4668406))

## 0.125.1 (2025-01-16)

### Bug Fixes

- **unbuild:** Update build distributable formatting
  ([2c6a3dce](https://github.com/storm-software/storm-ops/commit/2c6a3dce))

## 0.125.0 (2025-01-13)

### Features

- **unbuild:** Bundle `unbuild` dependency into distributable
  ([78438a04](https://github.com/storm-software/storm-ops/commit/78438a04))

## 0.124.4 (2025-01-13)

### Continuous Integration

- **unbuild:** Update the build configuration to properly bundle for node
  ([72be421b](https://github.com/storm-software/storm-ops/commit/72be421b))

## 0.124.3 (2025-01-13)

### Bug Fixes

- **unbuild:** Resolved issue with the `src` path in the distributable
  ([8810c687](https://github.com/storm-software/storm-ops/commit/8810c687))

## 0.124.2 (2025-01-13)

### Bug Fixes

- **unbuild:** Resolved issue with distribution package
  ([265f38a2](https://github.com/storm-software/storm-ops/commit/265f38a2))

## 0.124.1 (2025-01-12)

### Continuous Integration

- **tsdown:** Update package to exclude `oxc` packages from distributable
  ([8e9ad1ad](https://github.com/storm-software/storm-ops/commit/8e9ad1ad))

## 0.124.0 (2025-01-12)

### Features

- **tsdown:** Initial check-in of the TSBuild package
  ([b1a72514](https://github.com/storm-software/storm-ops/commit/b1a72514))

### Miscellaneous

- **monorepo:** Regenerate README markdown files
  ([a104880f](https://github.com/storm-software/storm-ops/commit/a104880f))

### Dependency Upgrades

- **monorepo:** Resolve dependency mismatches between packages
  ([72960597](https://github.com/storm-software/storm-ops/commit/72960597))

## 0.123.2 (2025-01-12)

### Bug Fixes

- **eslint:** Resolved issue with invalid `cspell` plugin
  ([1c13fb51](https://github.com/storm-software/storm-ops/commit/1c13fb51))

## 0.123.1 (2025-01-12)

### Bug Fixes

- **eslint:** Resolve stack overflow error on eslint configuration load
  ([f66752ac](https://github.com/storm-software/storm-ops/commit/f66752ac))

## 0.123.0 (2025-01-11)

### Features

- **linting-tools:** Added a default configuration for the `dependency-cruiser`
  linting tool
  ([cdc1614b](https://github.com/storm-software/storm-ops/commit/cdc1614b))
- **eslint:** Added `utils` module to the package distribution
  ([42501160](https://github.com/storm-software/storm-ops/commit/42501160))

## 0.122.4 (2025-01-11)

### Bug Fixes

- **eslint:** Resolved issue with the bundling process
  ([d06b6588](https://github.com/storm-software/storm-ops/commit/d06b6588))

## 0.122.3 (2025-01-11)

### Bug Fixes

- **eslint:** Resolved issue with package `exports` invalid extension values
  ([3f6babce](https://github.com/storm-software/storm-ops/commit/3f6babce))

## 0.122.2 (2025-01-11)

### Bug Fixes

- **workspace-tools:** Resolve issue loading pnpm workspace's catalog
  dependencies
  ([1199e24f](https://github.com/storm-software/storm-ops/commit/1199e24f))

## 0.122.1 (2025-01-11)

### Miscellaneous

- **workspace-tools:** Added additional logging for pnpm dependency updates
  process
  ([400b3369](https://github.com/storm-software/storm-ops/commit/400b3369))

## 0.122.0 (2025-01-10)

### Features

- **git-tools:** Ensure we select the correct workflow run to determine release
  changes
  ([f48f346e](https://github.com/storm-software/storm-ops/commit/f48f346e))

### Continuous Integration

- **monorepo:** Update the `ci.yml` configuration to check for previous
  successful runs
  ([6964e972](https://github.com/storm-software/storm-ops/commit/6964e972))

## 0.121.0 (2025-01-10)

### Features

- **build-tools:** Added the `getEnv` helper to populate storm defaults during a
  build
  ([5a9175b9](https://github.com/storm-software/storm-ops/commit/5a9175b9))

## 0.120.3 (2025-01-10)

### Bug Fixes

- **workspace-tools:** Added missing `defu` dependency
  ([60401ac7](https://github.com/storm-software/storm-ops/commit/60401ac7))

## 0.120.2 (2025-01-09)

### Bug Fixes

- **workspace-tools:** Added additional troubleshooting logging to the package
  ([c2cbdcc5](https://github.com/storm-software/storm-ops/commit/c2cbdcc5))

## 0.120.1 (2025-01-09)

### Bug Fixes

- **workspace-tools:** Added `read-yaml-file` as external dependency
  ([c402da27](https://github.com/storm-software/storm-ops/commit/c402da27))

## 0.120.0 (2025-01-08)

### Features

- **git-tools:** Added default release group configurations
  ([4b30144d](https://github.com/storm-software/storm-ops/commit/4b30144d))
- **build-tools:** Enhanced build options resolving to allow plugin list
  overrides
  ([94aa9ac4](https://github.com/storm-software/storm-ops/commit/94aa9ac4))
- **git-tools:** Complete redesign of the package and tools contained within
  ([96de0911](https://github.com/storm-software/storm-ops/commit/96de0911))

### Bug Fixes

- **git-tools:** Remove Nx release configuration defaulting module
  ([6bf1dacf](https://github.com/storm-software/storm-ops/commit/6bf1dacf))
- **git-tools:** Updates to default `nx.json` configuration applied on release
  ([e15c2954](https://github.com/storm-software/storm-ops/commit/e15c2954))
- **git-tools:** Resolve issue with `git` parameters provided to `release` APIs
  ([dd098e08](https://github.com/storm-software/storm-ops/commit/dd098e08))
- **git-tools:** Resolved issue with invalid path provided to `copyfile` in
  `build` target
  ([440ac16b](https://github.com/storm-software/storm-ops/commit/440ac16b))
- **git-tools:** Update dist output to be found in workflow action
  ([3f4dc983](https://github.com/storm-software/storm-ops/commit/3f4dc983))
- **linting-tools:** Update `zizmor` configuration line number
  ([4dd6fbc1](https://github.com/storm-software/storm-ops/commit/4dd6fbc1))

### Code Improvements

- **workspace-tools:** Added release group configuration to nx configuration
  prefixes
  ([1ac21fcf](https://github.com/storm-software/storm-ops/commit/1ac21fcf))

### Chores

- **git-tools:** Added logic to properly copy dist files to output folder
  ([1810fb35](https://github.com/storm-software/storm-ops/commit/1810fb35))
- **monorepo:** Update the release script to work in any environment
  ([c423f46e](https://github.com/storm-software/storm-ops/commit/c423f46e))

### Continuous Integration

- **monorepo:** Resolve issue with `changelog-renderer` selected for repository
  ([3686b00f](https://github.com/storm-software/storm-ops/commit/3686b00f))

### Dependency Upgrades

- **monorepo:** Update `chalk` depenency to v4.1.2 to work with cjs packages
  ([a92755e8](https://github.com/storm-software/storm-ops/commit/a92755e8))

## 0.119.0 (2025-01-02)

### Features

- **workspace-tools:** Added code to strip `catalog:` references in published
  `package.json` files
  ([d50c3ea6](https://github.com/storm-software/storm-ops/commit/d50c3ea6))

### Bug Fixes

- **storm-ops:** Remove unused `deepmerge` references and fix build
  ([0f4ee3f7](https://github.com/storm-software/storm-ops/commit/0f4ee3f7))

## 0.118.2 (2025-01-02)

### Bug Fixes

- **git-tools:** Ensure the correct email is provided for Stormie-Bot
  ([5fb2c9b6](https://github.com/storm-software/storm-ops/commit/5fb2c9b6))

## 0.118.1 (2025-01-02)

### Bug Fixes

- **workspace-tools:** Resolved issue displaying buffer errors in publish
  executor
  ([21791bd1](https://github.com/storm-software/storm-ops/commit/21791bd1))

## 0.118.0 (2025-01-02)

### Features

- **storm-ops:** Updated catalog and JSON schema for `StormConfig` object
  ([bf99f680](https://github.com/storm-software/storm-ops/commit/bf99f680))

## 0.117.0 (2025-01-02)

### Features

- **config:** Clean up Storm workspace configuration properties
  ([22508dd8](https://github.com/storm-software/storm-ops/commit/22508dd8))

## 0.116.0 (2025-01-02)

### Features

- **k8s-tools:** Removed old dynamic modules import
  ([81805110](https://github.com/storm-software/storm-ops/commit/81805110))

## 0.115.0 (2025-01-02)

### Features

- **workspace-tools:** Removed old dynamically imported modules
  ([56f84500](https://github.com/storm-software/storm-ops/commit/56f84500))

## 0.114.3 (2025-01-02)

### Bug Fixes

- **storm-ops:** Resolved issue with missing `zod` dependency
  ([a886ddde](https://github.com/storm-software/storm-ops/commit/a886ddde))

## 0.114.2 (2025-01-02)

### Bug Fixes

- **storm-ops:** Resolve issue preventing release publishing
  ([92c10eae](https://github.com/storm-software/storm-ops/commit/92c10eae))

## 0.114.1 (2025-01-02)

### Bug Fixes

- **workspace-tools:** Resolved issue with missing `deepmerge` dependency
  ([f27195c6](https://github.com/storm-software/storm-ops/commit/f27195c6))

## 0.114.0 (2025-01-02)

### Features

- **workspace-tools:** Added `esbuild` executor and removed deprecations
  ([aaef5e70](https://github.com/storm-software/storm-ops/commit/aaef5e70))
- **build-tools:** Stripped out unused/older code from package
  ([f67738d5](https://github.com/storm-software/storm-ops/commit/f67738d5))
- **esbuild:** Added pipeline logging to trace build steps
  ([5897e233](https://github.com/storm-software/storm-ops/commit/5897e233))
- **config:** Regenerate the `storm.schema.json` file
  ([258c3213](https://github.com/storm-software/storm-ops/commit/258c3213))
- **config:** Added `bot` property to `StormConfig`
  ([2c874819](https://github.com/storm-software/storm-ops/commit/2c874819))
- **config-tools:** Use `tsup` to expand package format and export config
  ([d9e53d7d](https://github.com/storm-software/storm-ops/commit/d9e53d7d))

### Bug Fixes

- **workspace-tools:** Resolve issue with invalid taplo configuration file name
  ([1ffec7e6](https://github.com/storm-software/storm-ops/commit/1ffec7e6))
- **build-tools:** Resolved issues with `tsup` normalized option types mismatch
  ([6fa88c82](https://github.com/storm-software/storm-ops/commit/6fa88c82))

### Dependency Upgrades

- **storm-ops:** Moved `rollup` and `zod` into the pnpm catalog
  ([c80b2a62](https://github.com/storm-software/storm-ops/commit/c80b2a62))

## 0.113.0 (2024-12-30)

### Features

- **workspace-tools:** Use `pnpm publish` in the `npm-publish` executor
  ([48a2ad49](https://github.com/storm-software/storm-ops/commit/48a2ad49))

## 0.112.0 (2024-12-30)

### Features

- **storm-ops:** Completed enhancement around `catalog` and `workspace`
  dependency upgrades
  ([5dd13247](https://github.com/storm-software/storm-ops/commit/5dd13247))

### Dependency Upgrades

- **tools-scripts:** Add `pkg-types` dependency to monorepo catalog
  ([3a087908](https://github.com/storm-software/storm-ops/commit/3a087908))
- **storm-ops:** Added consistent `@types/node` versions across repository
  ([a569536d](https://github.com/storm-software/storm-ops/commit/a569536d))

## 0.111.0 (2024-12-23)

### Features

- **pulumi-tools:** Initial check-in of the `pulumi-tools` package
  ([6b03c2ae](https://github.com/storm-software/storm-ops/commit/6b03c2ae))

## 0.110.0 (2024-12-23)

### Features

- **workspace-tools:** Added the `storm-software/typescript/tsup` plugin
  ([8e74c512](https://github.com/storm-software/storm-ops/commit/8e74c512))

## 0.109.0 (2024-12-22)

### Features

- **unbuild:** Initial check-in of the `unbuild` package
  ([fc246154](https://github.com/storm-software/storm-ops/commit/fc246154))
- **esbuild:** Added copy-assets and reporting build steps
  ([d8372730](https://github.com/storm-software/storm-ops/commit/d8372730))

## 0.108.0 (2024-12-22)

### Features

- **esbuild:** Move shared code to `build-tools` package
  ([bef9364e](https://github.com/storm-software/storm-ops/commit/bef9364e))

## 0.107.0 (2024-12-20)

### Features

- **eslint:** Renamed the `StormEnv` and `StormEnvPublic` globals
  ([f9ee1dab](https://github.com/storm-software/storm-ops/commit/f9ee1dab))

## 0.106.0 (2024-12-19)

### Features

- **workspace-tools:** Added `platform` to unbuild schema and project tags
  ([bfbe9dee](https://github.com/storm-software/storm-ops/commit/bfbe9dee))

## 0.105.0 (2024-12-18)

### Features

- **storm-ops:** Improved descriptions and markdown across monorepo
  ([aec89c79](https://github.com/storm-software/storm-ops/commit/aec89c79))

## 0.104.1 (2024-12-18)

### Bug Fixes

- **build-tools:** Resolved issue with `RollupOptions` type mismatch
  ([3833cb5d](https://github.com/storm-software/storm-ops/commit/3833cb5d))
- **storm-ops:** Resolved issue with ESM resolve error during postinstall script
  execution
  ([82389510](https://github.com/storm-software/storm-ops/commit/82389510))

### Dependency Upgrades

- **storm-ops:** Update `chalk` version to 4.1.0 to use commonjs
  ([d12a4e55](https://github.com/storm-software/storm-ops/commit/d12a4e55))
- **storm-ops:** Upgrade Nx package to v20.2.2
  ([d793912d](https://github.com/storm-software/storm-ops/commit/d793912d))

## 0.104.0 (2024-12-01)

### Features

- **storm-ops:** Added `lint-sherif` script to the CI workflow
  ([906e0c2b](https://github.com/storm-software/storm-ops/commit/906e0c2b))

## 0.103.0 (2024-11-30)

### Features

- **storm-ops:** Added `sherif` and `knip` linting to CI pipeline
  ([181d782a](https://github.com/storm-software/storm-ops/commit/181d782a))
- **linting-tools:** Added `syncpack` config and CI reusable actions
  ([a95fd8e5](https://github.com/storm-software/storm-ops/commit/a95fd8e5))

## 0.102.0 (2024-11-18)

### Features

- **build-tools:** Allow default package.json exports by no longer overriding
  them ([f19fc362](https://github.com/storm-software/storm-ops/commit/f19fc362))

## 0.101.3 (2024-11-10)

### Bug Fixes

- **config-tools:** Improve config file path formatting in log message
  ([5971676e](https://github.com/storm-software/storm-ops/commit/5971676e))

## 0.101.2 (2024-11-10)

### Bug Fixes

- **config-tools:** Ensure trace logging is not marked as system logging
  ([e8dca171](https://github.com/storm-software/storm-ops/commit/e8dca171))

## 0.101.1 (2024-11-08)

### Bug Fixes

- **config-tools:** Cleaned up the logger's formatting
  ([6ed06104](https://github.com/storm-software/storm-ops/commit/6ed06104))

## 0.101.0 (2024-11-08)

### Features

- **build-tools:** Added back cjs build and local package.json dependencies
  ([d86d3c2a](https://github.com/storm-software/storm-ops/commit/d86d3c2a))

## 0.100.0 (2024-11-07)

### Features

- **config:** Add the `danger` color token
  ([06dba937](https://github.com/storm-software/storm-ops/commit/06dba937))

## 0.99.0 (2024-11-01)

### Features

- **eslint:** Resolve type issues with Nx plugin in preset
  ([d27162e2](https://github.com/storm-software/storm-ops/commit/d27162e2))

## 0.98.0 (2024-10-31)

### Features

- **workspace-tools:** Update the Nx package code to conform to latest type
  definitions
  ([b1dbdff8](https://github.com/storm-software/storm-ops/commit/b1dbdff8))
- **storm-ops:** Upgrade the Nx package versions used in the repository
  ([369fad24](https://github.com/storm-software/storm-ops/commit/369fad24))
- **config:** Added the `link` color token to Storm configuration
  ([c66f39ed](https://github.com/storm-software/storm-ops/commit/c66f39ed))

### Bug Fixes

- **cloudflare-tools:** Remove references to removed `projectNameAndRootFormat`
  Nx options
  ([7db6e9d6](https://github.com/storm-software/storm-ops/commit/7db6e9d6))
- **storm-ops:** Resolve issue with invalid Nx ouput configuration
  ([9ca60bc0](https://github.com/storm-software/storm-ops/commit/9ca60bc0))

## 0.97.1 (2024-10-22)

### Bug Fixes

- **build-tools:** Ensure full changes to build tools are applied
  ([5d414904](https://github.com/storm-software/storm-ops/commit/5d414904))

## 0.97.0 (2024-10-22)

### Features

- **build-tools:** Ensure all nested folders have `exports` generated during
  unbuild
  ([cd57af07](https://github.com/storm-software/storm-ops/commit/cd57af07))

## 0.96.1 (2024-10-22)

### Bug Fixes

- **eslint:** Ensure `parserOptions` are removed from all configuration objects
  ([971d16f8](https://github.com/storm-software/storm-ops/commit/971d16f8))

## 0.96.0 (2024-10-22)

### Features

- **eslint:** Added the `nx` linting rules configuration option
  ([cebc611a](https://github.com/storm-software/storm-ops/commit/cebc611a))

## 0.95.1 (2024-10-22)

### Bug Fixes

- **eslint:** Resolve issue with `parserOptions` configuration
  ([4da465aa](https://github.com/storm-software/storm-ops/commit/4da465aa))

## 0.95.0 (2024-10-21)

### Features

- **config-tools:** Update max depth to 4 calls
  ([71c2aab1](https://github.com/storm-software/storm-ops/commit/71c2aab1))

## 0.94.2 (2024-10-21)

### Bug Fixes

- **config-tools:** Resolved issue printing object arrays to the logs
  ([1590597a](https://github.com/storm-software/storm-ops/commit/1590597a))

## 0.94.1 (2024-10-20)

### Bug Fixes

- **eslint:** Resolve issue with merging ESLint configuration objects
  ([bb37374a](https://github.com/storm-software/storm-ops/commit/bb37374a))

## 0.94.0 (2024-10-20)

### Features

- **eslint:** Added ESLint Plugin configuration object logging
  ([2d943cd8](https://github.com/storm-software/storm-ops/commit/2d943cd8))

## 0.93.4 (2024-10-20)

### Bug Fixes

- **eslint:** Ensure the TypeScript ESLint configurations are correctly merged
  by file type
  ([152fce82](https://github.com/storm-software/storm-ops/commit/152fce82))

## 0.93.3 (2024-10-20)

### Bug Fixes

- **eslint:** Resolved issue applying TypeScript ESLint preset configurations
  ([fc0f139e](https://github.com/storm-software/storm-ops/commit/fc0f139e))

## 0.93.2 (2024-09-19)

### Bug Fixes

- **eslint:** Resolve issue applying plugin to configuration aggregate
  ([b86cd266](https://github.com/storm-software/storm-ops/commit/b86cd266))

## 0.93.1 (2024-09-19)

### Bug Fixes

- **eslint:** Resolved issue with scenario where invalid TypeScript
  configuration is provided
  ([4db77c97](https://github.com/storm-software/storm-ops/commit/4db77c97))

## 0.93.0 (2024-09-19)

### Features

- **eslint:** Added the `useTypeScriptESLint` and `useUnicorn` optional
  parameters
  ([60eb6e2e](https://github.com/storm-software/storm-ops/commit/60eb6e2e))

### Bug Fixes

- **eslint:** Resolve build issue in package
  ([78140ff2](https://github.com/storm-software/storm-ops/commit/78140ff2))

## 0.92.0 (2024-09-19)

### Features

- **eslint:** Remove extra rules from TSX files
  ([a609ed20](https://github.com/storm-software/storm-ops/commit/a609ed20))

## 0.91.0 (2024-09-19)

### Features

- **terraform-modules:** Added EKS terraform module
  ([01cc04ff](https://github.com/storm-software/storm-ops/commit/01cc04ff))

## 0.90.0 (2024-09-19)

### Features

- **eslint:** Added proper json linting rules
  ([41809865](https://github.com/storm-software/storm-ops/commit/41809865))

## 0.89.7 (2024-09-19)

### Bug Fixes

- **eslint:** Remove typescript-eslint configuration
  ([03acaaf9](https://github.com/storm-software/storm-ops/commit/03acaaf9))

## 0.89.6 (2024-09-19)

### Bug Fixes

- **eslint:** Resolved issue with invalid TypeScript configuration
  ([15f45cf8](https://github.com/storm-software/storm-ops/commit/15f45cf8))

## 0.89.5 (2024-09-19)

### Bug Fixes

- **eslint:** Remove eslint configuration duplicates
  ([124cead3](https://github.com/storm-software/storm-ops/commit/124cead3))

## 0.89.4 (2024-09-19)

### Bug Fixes

- **eslint:** Remove duplicate eslint rules
  ([bc272af0](https://github.com/storm-software/storm-ops/commit/bc272af0))

## 0.89.3 (2024-09-19)

### Bug Fixes

- **eslint:** Resolve issue with files in typescript rules
  ([02f728a3](https://github.com/storm-software/storm-ops/commit/02f728a3))

## 0.89.2 (2024-09-19)

### Bug Fixes

- **eslint:** Resolve issue with invalid ignores configuration
  ([82c68cad](https://github.com/storm-software/storm-ops/commit/82c68cad))

## 0.89.1 (2024-09-19)

### Bug Fixes

- **eslint:** Remove the jsa11y extension
  ([60a44018](https://github.com/storm-software/storm-ops/commit/60a44018))

## 0.89.0 (2024-09-17)

### Features

- **eslint:** Include updated linting types
  ([9c415747](https://github.com/storm-software/storm-ops/commit/9c415747))

## 0.88.1 (2024-09-17)

### Bug Fixes

- **eslint:** Resolve invalid import path issue
  ([f9c60c86](https://github.com/storm-software/storm-ops/commit/f9c60c86))

## 0.88.0 (2024-09-17)

### Features

- **eslint:** Include the updated typings for the preset's rules
  ([c41fe207](https://github.com/storm-software/storm-ops/commit/c41fe207))

## 0.87.2 (2024-09-16)

### Bug Fixes

- **eslint:** Resolve issue with invalid react file configurations
  ([524b22be](https://github.com/storm-software/storm-ops/commit/524b22be))

## 0.87.1 (2024-09-16)

### Bug Fixes

- **storm-ops:** Resolve issues with workflow actions
  ([2ba8f980](https://github.com/storm-software/storm-ops/commit/2ba8f980))

## 0.87.0 (2024-09-15)

### Features

- **build-tools:** Add logic to ensure we do not overwrite exports
  ([94582fac](https://github.com/storm-software/storm-ops/commit/94582fac))

## 0.86.0 (2024-09-15)

### Features

- **build-tools:** Add a default export to the package.json generated during
  build
  ([342e0699](https://github.com/storm-software/storm-ops/commit/342e0699))

## 0.85.0 (2024-09-15)

### Features

- **build-tools:** Update unbuild optional parameters
  ([af395c22](https://github.com/storm-software/storm-ops/commit/af395c22))

- **build-tools:** Added `main`, `module`, and `types` fields to package.json
  file ([d55521dc](https://github.com/storm-software/storm-ops/commit/d55521dc))

### Bug Fixes

- **eslint:** Make the ESLint rules more lenient
  ([e11897e7](https://github.com/storm-software/storm-ops/commit/e11897e7))

- **build-tools:** Resolve issue with redundant build configurations
  ([0f0fa421](https://github.com/storm-software/storm-ops/commit/0f0fa421))

- **build-tools:** Resolved issue with missing dependency
  ([1c9e6908](https://github.com/storm-software/storm-ops/commit/1c9e6908))

## 0.84.2 (2024-09-13)

### Bug Fixes

- **eslint:** Cleaned up unused eslint rules
  ([81149178](https://github.com/storm-software/storm-ops/commit/81149178))

## 0.84.0 (2024-09-13)

### Bug Fixes

- **build-tools:** Resolve issue with unbuild `input` parameter
  ([a30abbaa](https://github.com/storm-software/storm-ops/commit/a30abbaa))

## 0.83.5 (2024-09-13)

### Bug Fixes

- **workspace-tools:** Resolve issue with setting compiler options
  ([b444511b](https://github.com/storm-software/storm-ops/commit/b444511b))

## 0.83.3 (2024-09-11)

### Bug Fixes

- **build-tools:** Resolved issue with the base path directory
  ([b7cad5eb](https://github.com/storm-software/storm-ops/commit/b7cad5eb))

## 0.83.2 (2024-09-11)

### Bug Fixes

- **workspace-tools:** Resolve issue with input entry point names
  ([12ca61d3](https://github.com/storm-software/storm-ops/commit/12ca61d3))

## 0.83.0 (2024-09-11)

### Features

- **workspace-tools:** Improved the input value formatting
  ([13d3fb1c](https://github.com/storm-software/storm-ops/commit/13d3fb1c))

## 0.82.1 (2024-09-11)

### Bug Fixes

- **workspace-tools:** Resolve issue with names in input files
  ([2f181c56](https://github.com/storm-software/storm-ops/commit/2f181c56))

## 0.82.0 (2024-09-11)

### Features

- **workspace-tools:** Added TypeScript as a peerDependency
  ([74da29f1](https://github.com/storm-software/storm-ops/commit/74da29f1))

## 0.81.10 (2024-09-11)

### Bug Fixes

- **workspace-tools:** Update parameters provided to TypeScript plugin
  ([8cd141c1](https://github.com/storm-software/storm-ops/commit/8cd141c1))

## 0.81.9 (2024-09-11)

### Bug Fixes

- **build-tools:** Resolved issue providing include paths
  ([25f7dc30](https://github.com/storm-software/storm-ops/commit/25f7dc30))

## 0.81.8 (2024-09-11)

### Bug Fixes

- **build-tools:** Resolved issue with missing TypeScript declarations
  ([4cf894fe](https://github.com/storm-software/storm-ops/commit/4cf894fe))

## 0.81.7 (2024-09-11)

### Bug Fixes

- **build-tools:** Invoke chdir in the build function
  ([43f69ff5](https://github.com/storm-software/storm-ops/commit/43f69ff5))

## 0.81.6 (2024-09-11)

### Bug Fixes

- **build-tools:** Updated the slash direction in compiler options paths
  ([cd34a280](https://github.com/storm-software/storm-ops/commit/cd34a280))

## 0.81.5 (2024-09-10)

### Bug Fixes

- **build-tools:** Ensure the `skipDefaultLibCheck` options is added during DTS
  build
  ([f9a7e827](https://github.com/storm-software/storm-ops/commit/f9a7e827))

## 0.81.4 (2024-09-10)

### Bug Fixes

- **build-tools:** Resolve issue with missing declaration files
  ([862e51a1](https://github.com/storm-software/storm-ops/commit/862e51a1))

## 0.81.3 (2024-09-10)

### Bug Fixes

- **build-tools:** Update the declaration directory used during build
  ([a9c0f876](https://github.com/storm-software/storm-ops/commit/a9c0f876))

## 0.81.2 (2024-09-10)

### Bug Fixes

- **build-tools:** Resolved issue with invalid path configurations
  ([533a80bf](https://github.com/storm-software/storm-ops/commit/533a80bf))

## 0.81.1 (2024-09-10)

### Bug Fixes

- **build-tools:** Ensure the `rootDir` and `baseUrl` parameters are consistent
  ([7438183f](https://github.com/storm-software/storm-ops/commit/7438183f))

## 0.81.0 (2024-09-10)

### Features

- **eslint-config:** Added the `useReactCompiler` option to preset
  ([691fdfe8](https://github.com/storm-software/storm-ops/commit/691fdfe8))

## 0.80.9 (2024-09-10)

### Bug Fixes

- **build-tools:** Resolved issue with invalid include paths
  ([3bac71bd](https://github.com/storm-software/storm-ops/commit/3bac71bd))

## 0.80.8 (2024-09-10)

### Bug Fixes

- **build-tools:** Resolve issues with generated tsconfig compilation options
  ([f7a96d93](https://github.com/storm-software/storm-ops/commit/f7a96d93))

## 0.80.7 (2024-09-10)

### Bug Fixes

- **build-tools:** Resolve issue specifying the `typeRoot` options
  ([973f8ee4](https://github.com/storm-software/storm-ops/commit/973f8ee4))

## 0.80.6 (2024-09-10)

### Bug Fixes

- **config-tools:** Resolve issues with slashes in paths
  ([e1e5f571](https://github.com/storm-software/storm-ops/commit/e1e5f571))

## 0.80.5 (2024-09-10)

### Bug Fixes

- **build-tools:** Remove invalid configuration parameters
  ([cede3716](https://github.com/storm-software/storm-ops/commit/cede3716))

## 0.80.4 (2024-09-10)

### Bug Fixes

- **build-tools:** Resolve issue with the raw configuration parameters
  ([bbd59f22](https://github.com/storm-software/storm-ops/commit/bbd59f22))

## 0.80.3 (2024-09-10)

### Bug Fixes

- **storm-ops:** Resolved issue with invalid configuration object
  ([a4f22049](https://github.com/storm-software/storm-ops/commit/a4f22049))

## 0.80.2 (2024-09-08)

### Bug Fixes

- **workspace-tools:** Update the compiler options used in TypeScript plugin
  ([b788e426](https://github.com/storm-software/storm-ops/commit/b788e426))

- **workspace-tools:** Resolved issue with returned value in Rust plugin
  ([f37a1f44](https://github.com/storm-software/storm-ops/commit/f37a1f44))

## 0.80.1 (2024-09-08)

### Features

- **workspace-tools:** Ensure the workspaceRoot is used as the base directory
  ([2b8ab737](https://github.com/storm-software/storm-ops/commit/2b8ab737))

## 0.79.1 (2024-09-08)

### Features

- **workspace-tools:** Added custom code for generating the Nx configuration
  ([651a589e](https://github.com/storm-software/storm-ops/commit/651a589e))

## 0.78.0 (2024-09-06)

### Features

- **k8s-tools:** Added extra fields onto the released container's `meta.json`
  file ([14356536](https://github.com/storm-software/storm-ops/commit/14356536))

### Bug Fixes

- **workspace-tools:** Resolved the duplicate export name issue
  ([f2586335](https://github.com/storm-software/storm-ops/commit/f2586335))

## 0.77.1 (2024-09-06)

### Bug Fixes

- **git-tools:** Resolved issue with missing command line arguments
  ([59e26e31](https://github.com/storm-software/storm-ops/commit/59e26e31))

## 0.77.0 (2024-09-06)

### Features

- **git-tools:** Added logic to skip signing during CI workflows
  ([4a7062ce](https://github.com/storm-software/storm-ops/commit/4a7062ce))

## 0.76.0 (2024-09-06)

### Features

- **git-tools:** Added signed commits to storm-git scripts
  ([3d7c88c9](https://github.com/storm-software/storm-ops/commit/3d7c88c9))

## 0.75.1 (2024-09-05)

### Bug Fixes

- **cloudflare-tools:** Regenerated the README.md file
  ([6ad71f5a](https://github.com/storm-software/storm-ops/commit/6ad71f5a))

## 0.75.0 (2024-09-05)

### Features

- **cloudflare-tools:** Added the `R2UploadPublish` executor
  ([e5495bdb](https://github.com/storm-software/storm-ops/commit/e5495bdb))

## 0.74.0 (2024-09-03)

### Features

- **linting-tools:** Taplo toml formatting improvements
  ([1e84182b](https://github.com/storm-software/storm-ops/commit/1e84182b))

## 0.73.0 (2024-09-03)

### Features

- **storm-ops:** Upgrade the Nx workspace versions
  ([15cb7ee2](https://github.com/storm-software/storm-ops/commit/15cb7ee2))

## 0.72.0 (2024-09-02)

### Features

- **terraform-modules:** Added the `aws/karpenter` and `cloudflare/r2-bucket`
  modules
  ([09deea18](https://github.com/storm-software/storm-ops/commit/09deea18))

### Bug Fixes

- **terraform-modules:** Resolved issue with applying tags to resources
  ([a0fd5e19](https://github.com/storm-software/storm-ops/commit/a0fd5e19))

## 0.71.0 (2024-09-01)

### Features

- **eslint:** Update ESLint line-breaking rules
  ([1d08c4e1](https://github.com/storm-software/storm-ops/commit/1d08c4e1))

- **workspace-tools:** Added the `rollup` executor
  ([efcbbc60](https://github.com/storm-software/storm-ops/commit/efcbbc60))

### Bug Fixes

- **workspace-tools:** Resolve issue with excessive logging in Cargo plugin
  ([5562f21f](https://github.com/storm-software/storm-ops/commit/5562f21f))

## 0.70.0 (2024-09-01)

### Features

- **workspace-tools:** Added the `noDeps` flag to the cargo-doc executor options
  ([82eeb944](https://github.com/storm-software/storm-ops/commit/82eeb944))

## 0.69.1 (2024-08-31)

### Bug Fixes

- **build-tools:** Added try/catch to utility function
  ([3ce4a7cd](https://github.com/storm-software/storm-ops/commit/3ce4a7cd))

## 0.69.0 (2024-08-31)

### Features

- **eslint:** Update linting rules to ignore the length of commands and use
  double quotes
  ([f9c603d7](https://github.com/storm-software/storm-ops/commit/f9c603d7))

## 0.68.3 (2024-08-31)

### Bug Fixes

- **terraform-modules:** Resolve issue with output variable name
  ([dd5b63fb](https://github.com/storm-software/storm-ops/commit/dd5b63fb))

## 0.68.2 (2024-08-31)

### Bug Fixes

- **terraform-modules:** Resolved issue with conditional statement syntax
  ([c96e9a9e](https://github.com/storm-software/storm-ops/commit/c96e9a9e))

## 0.68.1 (2024-08-30)

### Bug Fixes

- **terraform-modules:** Added default values for `full_name` variables
  ([8779001e](https://github.com/storm-software/storm-ops/commit/8779001e))

## 0.68.0 (2024-08-29)

### Features

- **workspace-tools:** The `docs` task no longer depends on `build` to run
  ([9b299fad](https://github.com/storm-software/storm-ops/commit/9b299fad))

### Bug Fixes

- **workspace-tools:** Ensure the `preVersionCommand` property is correct
  ([9d089852](https://github.com/storm-software/storm-ops/commit/9d089852))

## 0.67.2 (2024-08-29)

### Bug Fixes

- **workspace-tools:** Resolved issue with multi-layer extends in Nx
  configurations
  ([9cb9d2ff](https://github.com/storm-software/storm-ops/commit/9cb9d2ff))

## 0.67.1 (2024-08-29)

### Bug Fixes

- **workspace-tools:** Add new Nx configuration files to package.json
  ([23edcd79](https://github.com/storm-software/storm-ops/commit/23edcd79))

## 0.67.0 (2024-08-29)

### Features

- **workspace-tools:** Added `nx-default.json` and `nx-cloud.json` files
  ([4bb13faa](https://github.com/storm-software/storm-ops/commit/4bb13faa))

## 0.66.0 (2024-08-29)

### Features

- **workspace-tools:** Added base entry to package
  ([b0d3b788](https://github.com/storm-software/storm-ops/commit/b0d3b788))

## 0.65.1 (2024-08-26)

### Bug Fixes

- **build-tools:** Resolved issue with `async` modifier in declarations
  ([2b66c821](https://github.com/storm-software/storm-ops/commit/2b66c821))

### Dependency Upgrades

- **storm-ops:** Upgrade the workspace's Nx version
  ([4ce6ac9e](https://github.com/storm-software/storm-ops/commit/4ce6ac9e))

## 0.65.0 (2024-08-09)

### Features

- **storm-ops:** Update the workflows to send requests to Telegram
  ([65332dd0](https://github.com/storm-software/storm-ops/commit/65332dd0))

- **build-tools:** Reformat the TSUP build files
  ([f9cdbdcc](https://github.com/storm-software/storm-ops/commit/f9cdbdcc))

### Bug Fixes

- **build-tools:** Resolved issues with TypeScript libraries paths provided to
  TSUP build
  ([44628c89](https://github.com/storm-software/storm-ops/commit/44628c89))

- **workspace-tools:** Resolve issue with call signature to executors
  ([36ad985a](https://github.com/storm-software/storm-ops/commit/36ad985a))

## 0.64.0 (2024-08-04)

### Features

- **build-tools:** Add `typeRoots` and find TypeScript library definition files
  prior to TSUP build
  ([635833ed](https://github.com/storm-software/storm-ops/commit/635833ed))

## 0.63.0 (2024-08-04)

### Features

- **config:** Added the `docs` and `licensing` options to the Storm
  configuration
  ([c867efe1](https://github.com/storm-software/storm-ops/commit/c867efe1))

### Bug Fixes

- **build-tools:** Resolve issues with logic in `outExtension` utility function
  ([8cdc691b](https://github.com/storm-software/storm-ops/commit/8cdc691b))

## 0.62.0 (2024-08-03)

### Features

- **eslint:** Ignore `prefer-nullish-coalescing` for strings
  ([dbae2a58](https://github.com/storm-software/storm-ops/commit/dbae2a58))

## 0.61.0 (2024-08-03)

### Features

- **build-tools:** Add back experimental DTS option to TSUP
  ([4fe9652b](https://github.com/storm-software/storm-ops/commit/4fe9652b))

## 0.60.0 (2024-08-03)

### Features

- **storm-ops:** Upgrade workspace's Nx package dependencies
  ([5f31f734](https://github.com/storm-software/storm-ops/commit/5f31f734))

## 0.59.0 (2024-08-03)

### Features

- **build-tools:** Add tsup build's rollup helpers
  ([27ecd4e6](https://github.com/storm-software/storm-ops/commit/27ecd4e6))

### Bug Fixes

- **build-tools:** Resolve issue with invalid return paths
  ([0f9f5b1f](https://github.com/storm-software/storm-ops/commit/0f9f5b1f))

## 0.58.0 (2024-08-03)

### Features

- **build-tools:** Enable `dts` instead of `experimentalDts` for TSUP build
  ([0655517a](https://github.com/storm-software/storm-ops/commit/0655517a))

### Bug Fixes

- **build-tools:** Resolved issue with the entry name parameter in unbuild
  config
  ([f5e5dbdd](https://github.com/storm-software/storm-ops/commit/f5e5dbdd))

## 0.57.0 (2024-08-02)

### Features

- **build-tools:** Added back the export statements to unbuild configuration
  ([5fb63682](https://github.com/storm-software/storm-ops/commit/5fb63682))

## 0.56.0 (2024-08-02)

### Features

- **build-tools:** Update the unbuild configuration to get exports from
  `package.json` files
  ([bb2fc78f](https://github.com/storm-software/storm-ops/commit/bb2fc78f))

## 0.55.0 (2024-08-02)

### Features

- **build-tools:** Populate the distribution's package.json with `exports` based
  on project structure
  ([cf0eed52](https://github.com/storm-software/storm-ops/commit/cf0eed52))

## 0.54.0 (2024-08-02)

### Features

- **terraform-tools:** Initial check-in of project code
  ([c4ef4810](https://github.com/storm-software/storm-ops/commit/c4ef4810))

- **build-tools:** Added `failOnWarn` parameter to unbuild configuration
  ([ba28050d](https://github.com/storm-software/storm-ops/commit/ba28050d))

- **terraform-tools:** Update build to exclude other storm package from the
  distribution
  ([96294aac](https://github.com/storm-software/storm-ops/commit/96294aac))

## 0.53.4 (2024-08-02)

### Bug Fixes

- **create-storm-workspace:** Upgrade the package.json to include
  `peerDependencies`
  ([f15d7eb4](https://github.com/storm-software/storm-ops/commit/f15d7eb4))

## 0.53.3 (2024-08-02)

### Bug Fixes

- **build-tools:** Update `rootDir` provided to unbuild
  ([3efbdebc](https://github.com/storm-software/storm-ops/commit/3efbdebc))

## 0.53.2 (2024-08-02)

### Bug Fixes

- **build-tools:** Resolve path issues in unbuild entry configuration
  ([46d128b5](https://github.com/storm-software/storm-ops/commit/46d128b5))

## 0.53.1 (2024-08-02)

### Bug Fixes

- **build-tools:** Update the base path of the unbuild input files
  ([4551640c](https://github.com/storm-software/storm-ops/commit/4551640c))

## 0.53.0 (2024-08-02)

### Features

- **eslint:** Reformatted the banner string whitespace
  ([2df75cbb](https://github.com/storm-software/storm-ops/commit/2df75cbb))

### Bug Fixes

- **build-tools:** Update unbuild to supply proper configuration
  ([29bfb7b4](https://github.com/storm-software/storm-ops/commit/29bfb7b4))

- **build-tools:** Remove the unused variables in the updated code
  ([b01c4999](https://github.com/storm-software/storm-ops/commit/b01c4999))

## 0.52.0 (2024-08-02)

### Features

- **eslint:** Added the `name` and `banner` options to format banner from preset
  ([ee542ed6](https://github.com/storm-software/storm-ops/commit/ee542ed6))

## 0.51.1 (2024-08-02)

### Bug Fixes

- **eslint:** Resolve issue with duplicate plugins
  ([23c09494](https://github.com/storm-software/storm-ops/commit/23c09494))

## 0.51.0 (2024-08-02)

### Features

- **eslint:** Added typing file for ESLint rules used by preset
  ([821637e2](https://github.com/storm-software/storm-ops/commit/821637e2))

## 0.50.0 (2024-08-02)

### Features

- **eslint:** Added a banner with `__filename` and `__dirname` to the
  distribution
  ([594c0e9a](https://github.com/storm-software/storm-ops/commit/594c0e9a))

## 0.49.0 (2024-08-02)

### Features

- **eslint:** Update the build process to include the preset declaration file
  ([1b5fe953](https://github.com/storm-software/storm-ops/commit/1b5fe953))

## 0.48.0 (2024-08-02)

### Features

- **eslint:** Improved the logic around determining the banner
  ([4bbb321d](https://github.com/storm-software/storm-ops/commit/4bbb321d))

## 0.47.1 (2024-08-01)

### Bug Fixes

- **eslint:** Resolve issue with invalid path definition
  ([be930a74](https://github.com/storm-software/storm-ops/commit/be930a74))

## 0.47.0 (2024-08-01)

### Features

- **eslint:** Added the `parserOptions` parameter to the preset's options
  ([344db07c](https://github.com/storm-software/storm-ops/commit/344db07c))

## 0.46.0 (2024-08-01)

### Features

- **eslint:** Added JSX parser options when `react` is enabled
  ([2700e009](https://github.com/storm-software/storm-ops/commit/2700e009))

## 0.45.1 (2024-08-01)

### Bug Fixes

- **eslint:** Resolved issues with invalid TypeScript flat configuration
  ([88166ab1](https://github.com/storm-software/storm-ops/commit/88166ab1))

## 0.45.0 (2024-08-01)

### Features

- **eslint:** Added initial typinges for the distribution package
  ([5a6a9dd1](https://github.com/storm-software/storm-ops/commit/5a6a9dd1))

## 0.44.0 (2024-08-01)

### Features

- **git-tools:** Ensure `.git/COMMIT_EDITMSG` exists before reading from disk
  ([7abae7ae](https://github.com/storm-software/storm-ops/commit/7abae7ae))

## 0.43.0 (2024-08-01)

### Features

- **git-tools:** Update `commitlint` to warn users when no commit message is
  provided instead of throwing errors
  ([04942ee2](https://github.com/storm-software/storm-ops/commit/04942ee2))

## 0.42.3 (2024-07-31)

### Bug Fixes

- **git-tools:** Resolved issue when `commitlint` is called without a `message`
  parameter
  ([624b24bc](https://github.com/storm-software/storm-ops/commit/624b24bc))

## 0.42.2 (2024-07-31)

### Bug Fixes

- **build-tools:** Resolved issue iterating unbuild entry files
  ([17703513](https://github.com/storm-software/storm-ops/commit/17703513))

## 0.42.1 (2024-07-31)

### Bug Fixes

- **build-tools:** Resolve issues with the output path provided to unbuild
  ([ee9c2353](https://github.com/storm-software/storm-ops/commit/ee9c2353))

## 0.42.0 (2024-07-31)

### Features

- **git-tools:** Added the `commitlint` git tools
  ([250875e7](https://github.com/storm-software/storm-ops/commit/250875e7))

## 0.41.0 (2024-07-31)

### Features

- **build-tools:** Added the CODEOWNERS linting tool
  ([63099b1b](https://github.com/storm-software/storm-ops/commit/63099b1b))

## 0.40.0 (2024-07-31)

### Features

- **build-tools:** Added a hook prior to `mkdist` to set custom options
  ([5c15681b](https://github.com/storm-software/storm-ops/commit/5c15681b))

### Bug Fixes

- **build-tools:** Resolved issue with `tsconfck` import
  ([4e5b4667](https://github.com/storm-software/storm-ops/commit/4e5b4667))

## 0.39.0 (2024-07-31)

### Features

- **build-tools:** Added the `typeDefinitions` rollup plugin
  ([8a0e0f8a](https://github.com/storm-software/storm-ops/commit/8a0e0f8a))

### Bug Fixes

- **build-tools:** Removed unused variables
  ([d48e358b](https://github.com/storm-software/storm-ops/commit/d48e358b))

## 0.38.0 (2024-07-31)

### Features

- **build-tools:** Include the `rollup-plugin-typescript2` plugin in
  configuration hook
  ([d7e5f74e](https://github.com/storm-software/storm-ops/commit/d7e5f74e))

## 0.37.2 (2024-07-31)

### Bug Fixes

- **build-tools:** Update unbuild configuration to include proper `rootDir`
  option
  ([11e7f38b](https://github.com/storm-software/storm-ops/commit/11e7f38b))

## 0.37.1 (2024-07-31)

### Bug Fixes

- **build-tools:** Remove unused plugin from unbuild
  ([ad8a5991](https://github.com/storm-software/storm-ops/commit/ad8a5991))

## 0.37.0 (2024-07-31)

### Features

- **create-storm-workspace:** Configure workspace to include GitHub
  ([eea71de7](https://github.com/storm-software/storm-ops/commit/eea71de7))

## 0.36.0 (2024-07-30)

### Features

- **storm-ops:** Prevent duplicate workflow action runs
  ([2d854022](https://github.com/storm-software/storm-ops/commit/2d854022))

- **eslint:** Added the header plugin
  ([cc0cbbea](https://github.com/storm-software/storm-ops/commit/cc0cbbea))

- **eslint:** Removed invalid JSON configuration from package
  ([2622ee7e](https://github.com/storm-software/storm-ops/commit/2622ee7e))

## 0.35.0 (2024-07-29)

### Features

- **tsconfig:** Update base TypeScript config to use `NodeNext` modules
  ([21f3d3f5](https://github.com/storm-software/storm-ops/commit/21f3d3f5))

## 0.34.0 (2024-07-29)

### Features

- **tsconfig:** Updates around `base` and `core` tsconfig files
  ([18b553df](https://github.com/storm-software/storm-ops/commit/18b553df))

## 0.33.1 (2024-07-29)

### Bug Fixes

- **build-tools:** Ensure the TypeScript Declaration library files are included
  ([ce55fa8a](https://github.com/storm-software/storm-ops/commit/ce55fa8a))

## 0.33.0 (2024-07-29)

### Features

- **build-tools:** Added logging to checks for full declaration libraries
  ([c96ccd0a](https://github.com/storm-software/storm-ops/commit/c96ccd0a))

## 0.32.0 (2024-07-29)

### Features

- **build-tools:** Update unbuild process to use the `tsconfck` package
  ([d0e4dbf6](https://github.com/storm-software/storm-ops/commit/d0e4dbf6))

## 0.31.0 (2024-07-29)

### Features

- **config:** Added the `brand2` and `brand3` color tokens
  ([58705631](https://github.com/storm-software/storm-ops/commit/58705631))

## 0.30.0 (2024-07-29)

### Features

- **prettier:** Added `prettier-plugin-solidity` configuration
  ([2f20befd](https://github.com/storm-software/storm-ops/commit/2f20befd))

- **tsconfig:** Added the `core` shared TypeScript configuration file
  ([de64188b](https://github.com/storm-software/storm-ops/commit/de64188b))

## 0.29.0 (2024-07-29)

### Features

- **build-tools:** Update tsconfig to include `lib.*.full.d.ts` by default
  ([8eaf2ed6](https://github.com/storm-software/storm-ops/commit/8eaf2ed6))

## 0.28.0 (2024-07-29)

### Features

- **build-tools:** Added CommonJs and DTS plugin options
  ([bba876f7](https://github.com/storm-software/storm-ops/commit/bba876f7))

## 0.27.2 (2024-07-29)

### Bug Fixes

- **build-tools:** Resolve issue writing `include` paths
  ([63a1acb1](https://github.com/storm-software/storm-ops/commit/63a1acb1))

## 0.27.1 (2024-07-29)

### Bug Fixes

- **build-tools:** Resolve issue with path to tsconfig file
  ([18f261da](https://github.com/storm-software/storm-ops/commit/18f261da))

## 0.27.0 (2024-07-29)

### Features

- **build-tools:** Use `pkg-types` to extract TypeScript configurations
  ([989f81d8](https://github.com/storm-software/storm-ops/commit/989f81d8))

### Bug Fixes

- **build-tools:** Resolve issues with TypeScript library paths in unbuild
  ([428265de](https://github.com/storm-software/storm-ops/commit/428265de))

### Documentation

- **storm-ops:** Format monorepo projects' README.md files
  ([9dc9ac22](https://github.com/storm-software/storm-ops/commit/9dc9ac22))

## 0.26.1 (2024-07-28)

### Bug Fixes

- **build-tools:** Resolved issues with options provided to unbuild
  ([58c7a2f9](https://github.com/storm-software/storm-ops/commit/58c7a2f9))

## 0.26.0 (2024-07-28)

### Features

- **build-tools:** Added code to include TypeScript lib declarations in bundle
  ([689e8a47](https://github.com/storm-software/storm-ops/commit/689e8a47))

- **build-tools:** Added the `generatePackageJson` functionality for unbuild
  ([218c72d4](https://github.com/storm-software/storm-ops/commit/218c72d4))

## 0.25.0 (2024-07-28)

### Features

- **build-tools:** Calculate the tsconfig paths during unbuild process
  ([469485ff](https://github.com/storm-software/storm-ops/commit/469485ff))

## 0.24.1 (2024-07-28)

### Bug Fixes

- **build-tools:** Resolved issue with dist path provided in unbuild
  ([a98a543d](https://github.com/storm-software/storm-ops/commit/a98a543d))

## 0.24.0 (2024-07-28)

### Features

- **build-tools:** Read tsconfig paths while generating types for unbuild
  ([3fad8634](https://github.com/storm-software/storm-ops/commit/3fad8634))

## 0.23.2 (2024-07-28)

### Bug Fixes

- **build-tools:** Resolve issues checking dependency node types
  ([15517428](https://github.com/storm-software/storm-ops/commit/15517428))

## 0.23.1 (2024-07-28)

### Bug Fixes

- **build-tools:** Added dependency bundling logic to unbuild
  ([9aece08d](https://github.com/storm-software/storm-ops/commit/9aece08d))

## 0.23.0 (2024-07-28)

### Features

- **build-tools:** Added `formatPackageJson` functionality to unbuild
  ([6da1a518](https://github.com/storm-software/storm-ops/commit/6da1a518))

## 0.22.2 (2024-07-28)

### Bug Fixes

- **build-tools:** Split out the code to format the `package.json` file
  ([a47b98d5](https://github.com/storm-software/storm-ops/commit/a47b98d5))

## 0.22.1 (2024-07-23)

### Bug Fixes

- **eslint:** Resolve issues with `json` plugin config spread
  ([088d498a](https://github.com/storm-software/storm-ops/commit/088d498a))

## 0.22.0 (2024-07-23)

### Features

- **eslint:** Remove the `import` plugin from the preset
  ([6c8551ae](https://github.com/storm-software/storm-ops/commit/6c8551ae))

## 0.21.0 (2024-07-22)

### Features

- **eslint:** Update rules around handling TypeScript function returns
  ([a9859cd4](https://github.com/storm-software/storm-ops/commit/a9859cd4))

## 0.20.0 (2024-07-22)

### Features

- **eslint:** Added Nx plugin to eslint preset
  ([1933027f](https://github.com/storm-software/storm-ops/commit/1933027f))

## 0.19.0 (2024-07-22)

### Features

- **eslint:** Add config formatter to eslint preset
  ([050dadcd](https://github.com/storm-software/storm-ops/commit/050dadcd))

## 0.18.1 (2024-07-22)

### Bug Fixes

- **storm-ops:** Resolved issue with cross-project typings
  ([aed5a357](https://github.com/storm-software/storm-ops/commit/aed5a357))

## 0.18.0 (2024-07-17)

### Features

- **git-tools:** Added README header template to include table of contents
  ([6841042e](https://github.com/storm-software/storm-ops/commit/6841042e))

## 0.17.0 (2024-06-26)

### Features

- **eslint-plugin:** Bundle storm software packages
  ([f2daca8c](https://github.com/storm-software/storm-ops/commit/f2daca8c))

## 0.16.0 (2024-06-24)

### Features

- **eslint:** Added back `nx` and removed `recommended` base configurations
  ([1661bde9](https://github.com/storm-software/storm-ops/commit/1661bde9))

## 0.15.2 (2024-06-24)

### Bug Fixes

- **storm-ops:** Resolve issue with renovatebot in workflow action
  ([e587423a](https://github.com/storm-software/storm-ops/commit/e587423a))

## 0.15.1 (2024-06-24)

### Bug Fixes

- **storm-ops:** Remove the `lint-commit` actions
  ([a502e8c0](https://github.com/storm-software/storm-ops/commit/a502e8c0))

## 0.15.0 (2024-06-24)

### Features

- **eslint-plugin:** Split up the eslint plugin implementation into separate
  packages
  ([aba11be4](https://github.com/storm-software/storm-ops/commit/aba11be4))

## 0.14.1 (2024-06-24)

### Bug Fixes

- **deps:** update patch prod dependencies
  ([f26698a8](https://github.com/storm-software/storm-ops/commit/f26698a8))

## 0.14.0 (2024-06-22)

### Features

- **workspace-tools:** Upgrade the workspace pnpm-lock file
  ([d33c20cb](https://github.com/storm-software/storm-ops/commit/d33c20cb))

## 0.13.0 (2024-06-22)

### Features

- **storm-ops:** Updated pnpm-lock file
  ([22be1efd](https://github.com/storm-software/storm-ops/commit/22be1efd))

## 0.12.0 (2024-06-22)

### Features

- **workspace-tools:** Added `lint` and `format` tasks and improved cache input
  management
  ([f2ade202](https://github.com/storm-software/storm-ops/commit/f2ade202))

## 0.11.0 (2024-06-21)

### Features

- **eslint-plugin:** Resolve issues with eslint module types
  ([ca513974](https://github.com/storm-software/storm-ops/commit/ca513974))

## 0.10.2 (2024-06-17)

### Bug Fixes

- **deps:** update patch prod dependencies
  ([ec613e8a](https://github.com/storm-software/storm-ops/commit/ec613e8a))

## 0.10.1 (2024-06-05)

### Bug Fixes

- **eslint:** Resolve issue with missing dependencies
  ([b0f43454](https://github.com/storm-software/storm-ops/commit/b0f43454))

## 0.10.0 (2024-06-03)

### Features

- **storm-ops:** Upgrade Nx packages and resolve linting issues
  ([685c2bb9](https://github.com/storm-software/storm-ops/commit/685c2bb9))

### Bug Fixes

- **deps:** update patch prod dependencies
  ([072b4763](https://github.com/storm-software/storm-ops/commit/072b4763))

- **deps:** update dependencies-non-major
  ([#181](https://github.com/storm-software/storm-ops/pull/181))

- **git-tools:** Resolved issue with import in markdown formatter
  ([5e3963de](https://github.com/storm-software/storm-ops/commit/5e3963de))

## 0.9.0 (2024-05-29)

### Features

- **cloudflare-tools:** Update worker generator to add hono depenendency
  ([946a9e59](https://github.com/storm-software/storm-ops/commit/946a9e59))

## 0.8.1 (2024-05-27)

### Bug Fixes

- **deps:** update patch prod dependencies
  ([a8113435](https://github.com/storm-software/storm-ops/commit/a8113435))

- **deps:** update dependencies-non-major
  ([#145](https://github.com/storm-software/storm-ops/pull/145))

- **deps:** update patch prod dependencies
  ([20ed7f14](https://github.com/storm-software/storm-ops/commit/20ed7f14))

- **deps:** update patch prod dependencies
  ([bef67d5d](https://github.com/storm-software/storm-ops/commit/bef67d5d))

- **deps:** update dependencies-non-major
  ([#159](https://github.com/storm-software/storm-ops/pull/159))

## 0.8.0 (2024-05-04)

### Features

- **config:** Generated the Storm Configuration JSON schema package asset
  ([0a5c9bb2](https://github.com/storm-software/storm-ops/commit/0a5c9bb2))

## 0.7.4 (2024-04-29)

### Bug Fixes

- **deps:** update patch prod dependencies
  ([c427e132](https://github.com/storm-software/storm-ops/commit/c427e132))

- **deps:** update dependencies-non-major
  ([#130](https://github.com/storm-software/storm-ops/pull/130))

- **build-tools:** Resolved issue with missing external dependency
  ([ea89d348](https://github.com/storm-software/storm-ops/commit/ea89d348))

## 0.7.3 (2024-04-21)

### Bug Fixes

- **workspace-tools:** Add `AssetGlob` typings
  ([c42da685](https://github.com/storm-software/storm-ops/commit/c42da685))

## 0.7.2 (2024-04-15)

### Bug Fixes

- **deps:** update patch prod dependencies
  ([7f710f58](https://github.com/storm-software/storm-ops/commit/7f710f58))

## 0.7.1 (2024-04-15)

### Bug Fixes

- **deps:** pin dependencies
  ([36d5dd8e](https://github.com/storm-software/storm-ops/commit/36d5dd8e))

## 0.7.0 (2024-04-13)

### Features

- **config-tools:** No longer require `config` in storm console write functions
  ([ad8c6511](https://github.com/storm-software/storm-ops/commit/ad8c6511))

## 0.6.14 (2024-04-13)

### Bug Fixes

- **build-tools:** Replace slashes in libraries path
  ([3b01d54d](https://github.com/storm-software/storm-ops/commit/3b01d54d))

## 0.6.13 (2024-04-13)

### Bug Fixes

- **build-tools:** Update the path provided to include TypeScript declarations
  ([a1a74b21](https://github.com/storm-software/storm-ops/commit/a1a74b21))

## 0.6.12 (2024-04-11)

### Bug Fixes

- **build-tools:** Resolve issues with missing TypeScript lib files
  ([032daaf9](https://github.com/storm-software/storm-ops/commit/032daaf9))

## 0.6.11 (2024-04-11)

### Bug Fixes

- **build-tools:** Added the TypeScript libs files to the compiler options
  ([963d533a](https://github.com/storm-software/storm-ops/commit/963d533a))

## 0.6.10 (2024-04-11)

### Bug Fixes

- **build-tools:** Update `tsup` build to no longer add workspace dependencies
  ([84da4a76](https://github.com/storm-software/storm-ops/commit/84da4a76))

## 0.6.9 (2024-04-11)

### Bug Fixes

- **build-tools:** Add the typescript type libraries to the `tsup` build include
  path ([c7125729](https://github.com/storm-software/storm-ops/commit/c7125729))

## 0.6.8 (2024-04-11)

### Bug Fixes

- **build-tools:** Resolve object ref error with empty dependencies
  ([6abbd534](https://github.com/storm-software/storm-ops/commit/6abbd534))

## 0.6.7 (2024-04-11)

### Bug Fixes

- **build-tools:** Enhance the entry string logic and output path
  ([10801885](https://github.com/storm-software/storm-ops/commit/10801885))

## 0.6.6 (2024-04-11)

### Bug Fixes

- **build-tools:** Update the `rootDir` passed to the build method
  ([d4d4409e](https://github.com/storm-software/storm-ops/commit/d4d4409e))

## 0.6.5 (2024-04-11)

### Bug Fixes

- **build-tools:** Update the logging prior to the build
  ([dd83b930](https://github.com/storm-software/storm-ops/commit/dd83b930))

## 0.6.4 (2024-04-10)

### Bug Fixes

- **build-tools:** Temporarily removed `mkdist` build from config
  ([56f8e104](https://github.com/storm-software/storm-ops/commit/56f8e104))

## 0.6.3 (2024-04-10)

### Bug Fixes

- **build-tools:** Resolve issue with invalid `rootDir` value
  ([16b7e378](https://github.com/storm-software/storm-ops/commit/16b7e378))

## 0.6.2 (2024-04-09)

### Bug Fixes

- **build-tools:** Resolve the multiple `clean` step issue in `unbuild`
  executable
  ([9c2727da](https://github.com/storm-software/storm-ops/commit/9c2727da))

## 0.6.1 (2024-04-09)

### Bug Fixes

- **build-tools:** Resolve issue with empty config file path option
  ([5216a888](https://github.com/storm-software/storm-ops/commit/5216a888))

## 0.6.0 (2024-04-09)

### Features

- **config-tools:** Significant improvements to logic to get config files
  ([0a0ac895](https://github.com/storm-software/storm-ops/commit/0a0ac895))

## 0.5.1 (2024-04-09)

### Bug Fixes

- **build-tools:** Resolved issue with invalid rollup path
  ([4e20c795](https://github.com/storm-software/storm-ops/commit/4e20c795))

## 0.5.0 (2024-04-09)

### Features

- **build-tools:** Added `unbuild` to the build tools
  ([b62cd15b](https://github.com/storm-software/storm-ops/commit/b62cd15b))

## 0.4.29 (2024-04-09)

### Bug Fixes

- **tsconfig:** Resolve invalid base tsconfig modules
  ([af07fcdb](https://github.com/storm-software/storm-ops/commit/af07fcdb))

## 0.4.28 (2024-04-09)

### Bug Fixes

- **build-tools:** Updates to dts compiler options
  ([b3aa2692](https://github.com/storm-software/storm-ops/commit/b3aa2692))

## 0.4.27 (2024-04-09)

### Bug Fixes

- **build-tools:** Updates to base tsconfig and build tools
  ([97648eac](https://github.com/storm-software/storm-ops/commit/97648eac))

## 0.4.26 (2024-04-09)

### Bug Fixes

- **build-tools:** Resolved import issues with external Nx modules
  ([203ffe22](https://github.com/storm-software/storm-ops/commit/203ffe22))

## 0.4.25 (2024-04-09)

### Bug Fixes

- **build-tools:** Apply missing defaults to rolldown options
  ([3ed61c68](https://github.com/storm-software/storm-ops/commit/3ed61c68))

## 0.4.24 (2024-04-09)

### Bug Fixes

- **build-tools:** Added error object logging to rolldown
  ([01aabe2d](https://github.com/storm-software/storm-ops/commit/01aabe2d))

## 0.4.23 (2024-04-09)

### Bug Fixes

- **build-tools:** Resolved issue with empty plugin array
  ([03da3618](https://github.com/storm-software/storm-ops/commit/03da3618))

## 0.4.22 (2024-04-08)

### Bug Fixes

- **build-tools:** Resolve issues with logging during build execution
  ([911ca3c6](https://github.com/storm-software/storm-ops/commit/911ca3c6))

## 0.4.21 (2024-04-08)

### Bug Fixes

- **build-tools:** Enhance the logic to apply multiple entry points
  ([962e72b7](https://github.com/storm-software/storm-ops/commit/962e72b7))

## 0.4.20 (2024-04-08)

### Bug Fixes

- **build-tools:** Added better build logging and validations
  ([03b595a4](https://github.com/storm-software/storm-ops/commit/03b595a4))

## 0.4.19 (2024-04-08)

### Bug Fixes

- **build-tools:** Resolved null reference issue creating build config
  ([35fa37aa](https://github.com/storm-software/storm-ops/commit/35fa37aa))

- **build-tools:** Update the `build` task configuration
  ([31b98d50](https://github.com/storm-software/storm-ops/commit/31b98d50))

## 0.4.18 (2024-04-08)

### Bug Fixes

- **build-tools:** Resolved issue with module types used in build
  ([50a368d3](https://github.com/storm-software/storm-ops/commit/50a368d3))

## 0.4.17 (2024-04-08)

### Bug Fixes

- **build-tools:** Add cjs shims to `esbuild` output
  ([63336f55](https://github.com/storm-software/storm-ops/commit/63336f55))

## 0.4.16 (2024-04-08)

### Bug Fixes

- **build-tools:** Dynamically import `config-tools` in build executable
  ([7746d327](https://github.com/storm-software/storm-ops/commit/7746d327))

## 0.4.15 (2024-04-08)

### Bug Fixes

- **build-tools:** Update module typings for bin and package files
  ([f3ecfe59](https://github.com/storm-software/storm-ops/commit/f3ecfe59))

## 0.4.14 (2024-04-08)

### Bug Fixes

- **build-tools:** Remove unused chalk depenency
  ([ac82cd1a](https://github.com/storm-software/storm-ops/commit/ac82cd1a))

## 0.4.13 (2024-04-08)

### Bug Fixes

- **build-tools:** Resolve last remaining invalid Nx import
  ([c73d0b9a](https://github.com/storm-software/storm-ops/commit/c73d0b9a))

## 0.4.12 (2024-04-08)

### Bug Fixes

- **build-tools:** Resolve issue with Nx file imports
  ([e86eff43](https://github.com/storm-software/storm-ops/commit/e86eff43))

## 0.4.11 (2024-04-08)

### Bug Fixes

- **build-tools:** Add comments to declaration file
  ([47ece361](https://github.com/storm-software/storm-ops/commit/47ece361))

## 0.4.10 (2024-04-08)

### Bug Fixes

- **build-tools:** Update the package as a `module` type
  ([e1f610db](https://github.com/storm-software/storm-ops/commit/e1f610db))

## 0.4.9 (2024-04-08)

### Bug Fixes

- **build-tools:** Resolved issue with duplicate require definition
  ([63aa1d16](https://github.com/storm-software/storm-ops/commit/63aa1d16))

## 0.4.8 (2024-04-08)

### Bug Fixes

- **build-tools:** Add back the cjs module format to package
  ([8283f153](https://github.com/storm-software/storm-ops/commit/8283f153))

## 0.4.7 (2024-04-08)

### Bug Fixes

- **workspace-tools:** Resolve issues with `build-tools` import
  ([fc040f71](https://github.com/storm-software/storm-ops/commit/fc040f71))

## 0.4.6 (2024-04-08)

### Bug Fixes

- **build-tools:** Remove unused main import from package.json
  ([6b141732](https://github.com/storm-software/storm-ops/commit/6b141732))

## 0.4.5 (2024-04-08)

### Bug Fixes

- **workspace-tools:** Update module types of imports
  ([9d09009b](https://github.com/storm-software/storm-ops/commit/9d09009b))

## 0.4.4 (2024-04-08)

### Bug Fixes

- **build-tools:** Resolve issue with build format
  ([02cd5c44](https://github.com/storm-software/storm-ops/commit/02cd5c44))

## 0.4.3 (2024-04-08)

### Bug Fixes

- **deps:** update patch prod dependencies
  ([3bce6c5e](https://github.com/storm-software/storm-ops/commit/3bce6c5e))

- **deps:** update dependency commander to v12
  ([#63](https://github.com/storm-software/storm-ops/pull/63))

- **deps:** update dependencies-non-major
  ([#38](https://github.com/storm-software/storm-ops/pull/38))

- **workspace-tools:** Resolved build issue with typings
  ([97ac0141](https://github.com/storm-software/storm-ops/commit/97ac0141))

## 0.4.2 (2024-04-08)

### Bug Fixes

- **deps:** pin dependencies
  ([7406e605](https://github.com/storm-software/storm-ops/commit/7406e605))

## 0.4.1 (2024-04-08)

### Bug Fixes

- **build-tools:** Marked the module as esm
  ([9059a516](https://github.com/storm-software/storm-ops/commit/9059a516))

## 0.4.0 (2024-04-07)

### Features

- **git-tools:** Added reusable GitHub `workflows` and `actions`
  ([1c9a5391](https://github.com/storm-software/storm-ops/commit/1c9a5391))

- **storm-ops:** Merged in change to the main branch
  ([ce79c572](https://github.com/storm-software/storm-ops/commit/ce79c572))

## 0.3.0 (2024-04-06)

### Features

- **build-tools:** Added support for `rolldown` builds
  ([46de2e63](https://github.com/storm-software/storm-ops/commit/46de2e63))

## 0.2.6 (2024-04-01)

### Bug Fixes

- **workspace-tools:** Resolve issue with bad release path in npm publish
  ([4f5ba3db](https://github.com/storm-software/storm-ops/commit/4f5ba3db))

## 0.2.5 (2024-03-29)

### Bug Fixes

- **workspace-tools:** Added the `nx-release-publish` target to TypeScript
  projects
  ([52b61117](https://github.com/storm-software/storm-ops/commit/52b61117))

## 0.2.4 (2024-03-29)

### Bug Fixes

- **workspace-tools:** Further updates to Nx plugin modules
  ([82b6ab01](https://github.com/storm-software/storm-ops/commit/82b6ab01))

## 0.2.3 (2024-03-28)

### Bug Fixes

- **git-tools:** Added code to add ts plugin transpilers
  ([ec514d57](https://github.com/storm-software/storm-ops/commit/ec514d57))

## 0.2.2 (2024-03-28)

### Bug Fixes

- **storm-ops:** Update the links in the README files to use proper repository
  ([decc0db3](https://github.com/storm-software/storm-ops/commit/decc0db3))

## 0.2.1 (2024-03-25)

### Bug Fixes

- **workspace-tools:** Resolved issue with applying Storm Nx plugins
  ([db3de8a6](https://github.com/storm-software/storm-ops/commit/db3de8a6))

## 0.2.0 (2024-03-25)

### Features

- **storm-config:** Added rust crates and release/publish workspace tools
  ([eab906b1](https://github.com/storm-software/storm-ops/commit/eab906b1))

- **workspace-tools:** Added Nx plugin to apply rust and typescript targets
  ([5738161f](https://github.com/storm-software/storm-ops/commit/5738161f))

- **workspace-tools:** Major updates to base nx.json configuration
  ([06ec9a6a](https://github.com/storm-software/storm-ops/commit/06ec9a6a))

## 0.1.16 (2024-03-17)

### Bug Fixes

- **build-tools:** Update paths in compiler options
  ([1f9eb75f](https://github.com/storm-software/storm-ops/commit/1f9eb75f))

## 0.1.15 (2024-03-17)

### Bug Fixes

- **build-tools:** Resolve issue with bad declaration folder path
  ([a46f403b](https://github.com/storm-software/storm-ops/commit/a46f403b))

## 0.1.14 (2024-03-15)

### Bug Fixes

- **workspace-tools:** Manually add the typescript libs to the `fileNames` build
  parameter
  ([d7462a4e](https://github.com/storm-software/storm-ops/commit/d7462a4e))

## 0.1.13 (2024-03-15)

### Bug Fixes

- **build-tools:** Updates to typescript build processing
  ([ae081b8e](https://github.com/storm-software/storm-ops/commit/ae081b8e))

## 0.1.12 (2024-03-15)

### Bug Fixes

- **build-tools:** Updates to paths provided to compiler options
  ([c559006f](https://github.com/storm-software/storm-ops/commit/c559006f))

## 0.1.11 (2024-03-15)

### Bug Fixes

- **build-tools:** Update issues with invalid path to build shim files
  ([dae25dfd](https://github.com/storm-software/storm-ops/commit/dae25dfd))

## 0.1.10 (2024-03-15)

### Bug Fixes

- **workspace-tools:** Remove unneeded chdir lines from base methods
  ([b65ef683](https://github.com/storm-software/storm-ops/commit/b65ef683))

## 0.1.9 (2024-03-15)

### Bug Fixes

- **build-tools:** Removed the chdir command from build
  ([1ba6be2c](https://github.com/storm-software/storm-ops/commit/1ba6be2c))

## 0.1.8 (2024-03-15)

### Bug Fixes

- **build-tools:** Update the tsup build method to change directory to workspace
  root ([7ebfc281](https://github.com/storm-software/storm-ops/commit/7ebfc281))

## 0.1.7 (2024-03-06)

### Bug Fixes

- **build-tools:** Added the esbuild shims to build-tools
  ([a24174e3](https://github.com/storm-software/storm-ops/commit/a24174e3))

## 0.1.6 (2024-03-06)

### Bug Fixes

- **build-tools:** Enhanced logging and defaulting logic when `getConfig` is
  missing
  ([b353a08f](https://github.com/storm-software/storm-ops/commit/b353a08f))

## 0.1.5 (2024-03-06)

### Bug Fixes

- **build-tools:** Update the package to use the `module` type
  ([068a3d72](https://github.com/storm-software/storm-ops/commit/068a3d72))

## 0.1.4 (2024-03-06)

### Bug Fixes

- **workspace-tools:** Resolve issue adding default `getConfig` options
  ([e318216f](https://github.com/storm-software/storm-ops/commit/e318216f))

## 0.1.3 (2024-03-06)

### Bug Fixes

- **build-tools:** Fix `applyDefaultOptions` issue that cleared out `getConfig`
  values
  ([baab6f94](https://github.com/storm-software/storm-ops/commit/baab6f94))

## 0.1.2 (2024-03-06)

### Bug Fixes

- **build-tools:** Resolved issues with `main` and `module` paths in
  `package.json` file
  ([9add5772](https://github.com/storm-software/storm-ops/commit/9add5772))

## 0.1.1 (2024-03-06)

### Bug Fixes

- **build-tools:** Added item to `additionalEntryPoints` for bin/build
  ([e2e256a5](https://github.com/storm-software/storm-ops/commit/e2e256a5))

## 0.1.0 (2024-03-06)

### Features

- **build-tools:** Update parameters passed to `tsBuild` process
  ([5a976c3e](https://github.com/storm-software/storm-ops/commit/5a976c3e))

- **build-tools:** Added `buildWithOptions` function to support Nx executors
  ([4616cf46](https://github.com/storm-software/storm-ops/commit/4616cf46))

## 0.0.6 (2024-03-05)

### Bug Fixes

- **build-tools:** Resolved issue determining package name
  ([9e407562](https://github.com/storm-software/storm-ops/commit/9e407562))

## 0.0.5 (2024-03-05)

### Bug Fixes

- **build-tools:** Resolved issues with created context in build process
  ([186ac3c7](https://github.com/storm-software/storm-ops/commit/186ac3c7))

## 0.0.4 (2024-03-05)

### Bug Fixes

- **build-tools:** Resolved issue determining project name prior to build
  ([62d4332d](https://github.com/storm-software/storm-ops/commit/62d4332d))

## 0.0.3 (2024-03-05)

### Bug Fixes

- **build-tools:** Resolve issue with duplicate `require` definition and include
  cjs build
  ([3927312b](https://github.com/storm-software/storm-ops/commit/3927312b))

## 0.0.2 (2024-03-05)

### Features

- **build-tools:** Split out Build CLI and supporting code to separate package
  ([9376ed39](https://github.com/storm-software/storm-ops/commit/9376ed39))

### Bug Fixes

- **workspace-tools:** Update `release-version` generator to get initial version
  from disk
  ([759f9ccc](https://github.com/storm-software/storm-ops/commit/759f9ccc))
