## 0.32.0 (2024-11-30)

### Features

- **storm-ops:** Added `sherif` and `knip` linting to CI pipeline ([181d782a](https://github.com/storm-software/storm-ops/commit/181d782a))

## 0.31.0 (2024-11-18)

### Features

- **build-tools:** Allow default package.json exports by no longer overriding
  them ([f19fc362](https://github.com/storm-software/storm-ops/commit/f19fc362))

## 0.30.1 (2024-11-10)

### Bug Fixes

- **config-tools:** Ensure trace logging is not marked as system logging
  ([e8dca171](https://github.com/storm-software/storm-ops/commit/e8dca171))

## 0.30.0 (2024-11-08)

### Features

- **build-tools:** Added back cjs build and local package.json dependencies
  ([d86d3c2a](https://github.com/storm-software/storm-ops/commit/d86d3c2a))

## 0.29.0 (2024-11-07)

### Features

- **config:** Add the `danger` color token
  ([06dba937](https://github.com/storm-software/storm-ops/commit/06dba937))

## 0.28.0 (2024-11-01)

### Features

- **eslint:** Resolve type issues with Nx plugin in preset
  ([d27162e2](https://github.com/storm-software/storm-ops/commit/d27162e2))

## 0.27.0 (2024-10-31)

### Features

- **storm-ops:** Upgrade the Nx package versions used in the repository
  ([369fad24](https://github.com/storm-software/storm-ops/commit/369fad24))
- **config:** Added the `link` color token to Storm configuration
  ([c66f39ed](https://github.com/storm-software/storm-ops/commit/c66f39ed))

## 0.26.0 (2024-10-22)

### Features

- **build-tools:** Ensure all nested folders have `exports` generated during
  unbuild
  ([cd57af07](https://github.com/storm-software/storm-ops/commit/cd57af07))

## 0.25.1 (2024-10-22)

### Bug Fixes

- **eslint:** Ensure `parserOptions` are removed from all configuration objects
  ([971d16f8](https://github.com/storm-software/storm-ops/commit/971d16f8))

## 0.25.0 (2024-10-22)

### Features

- **eslint:** Added the `nx` linting rules configuration option
  ([cebc611a](https://github.com/storm-software/storm-ops/commit/cebc611a))

## 0.24.1 (2024-10-22)

### Bug Fixes

- **eslint:** Resolve issue with `parserOptions` configuration
  ([4da465aa](https://github.com/storm-software/storm-ops/commit/4da465aa))

## 0.24.0 (2024-10-21)

### Features

- **config-tools:** Update max depth to 4 calls
  ([71c2aab1](https://github.com/storm-software/storm-ops/commit/71c2aab1))

## 0.23.2 (2024-10-21)

### Bug Fixes

- **config-tools:** Resolved issue printing object arrays to the logs
  ([1590597a](https://github.com/storm-software/storm-ops/commit/1590597a))

## 0.23.1 (2024-10-20)

### Bug Fixes

- **eslint:** Resolve issue with merging ESLint configuration objects
  ([bb37374a](https://github.com/storm-software/storm-ops/commit/bb37374a))

## 0.23.0 (2024-10-20)

### Features

- **eslint:** Added ESLint Plugin configuration object logging
  ([2d943cd8](https://github.com/storm-software/storm-ops/commit/2d943cd8))

## 0.22.4 (2024-10-20)

### Bug Fixes

- **eslint:** Ensure the TypeScript ESLint configurations are correctly merged
  by file type
  ([152fce82](https://github.com/storm-software/storm-ops/commit/152fce82))

## 0.22.3 (2024-10-20)

### Bug Fixes

- **eslint:** Resolved issue applying TypeScript ESLint preset configurations
  ([fc0f139e](https://github.com/storm-software/storm-ops/commit/fc0f139e))

## 0.22.2 (2024-09-19)

### Bug Fixes

- **eslint:** Resolve issue applying plugin to configuration aggregate
  ([b86cd266](https://github.com/storm-software/storm-ops/commit/b86cd266))

## 0.22.1 (2024-09-19)

### Bug Fixes

- **eslint:** Resolved issue with scenario where invalid TypeScript
  configuration is provided
  ([4db77c97](https://github.com/storm-software/storm-ops/commit/4db77c97))

## 0.22.0 (2024-09-19)

### Features

- **eslint:** Added the `useTypeScriptESLint` and `useUnicorn` optional
  parameters
  ([60eb6e2e](https://github.com/storm-software/storm-ops/commit/60eb6e2e))

### Bug Fixes

- **eslint:** Resolve build issue in package
  ([78140ff2](https://github.com/storm-software/storm-ops/commit/78140ff2))

## 0.21.0 (2024-09-19)

### Features

- **eslint:** Remove extra rules from TSX files
  ([a609ed20](https://github.com/storm-software/storm-ops/commit/a609ed20))

## 0.20.0 (2024-09-19)

### Features

- **terraform-modules:** Added EKS terraform module
  ([01cc04ff](https://github.com/storm-software/storm-ops/commit/01cc04ff))

## 0.19.0 (2024-09-19)

### Features

- **eslint:** Added proper json linting rules
  ([41809865](https://github.com/storm-software/storm-ops/commit/41809865))

## 0.18.7 (2024-09-19)

### Bug Fixes

- **eslint:** Remove typescript-eslint configuration
  ([03acaaf9](https://github.com/storm-software/storm-ops/commit/03acaaf9))

## 0.18.6 (2024-09-19)

### Bug Fixes

- **eslint:** Resolved issue with invalid TypeScript configuration
  ([15f45cf8](https://github.com/storm-software/storm-ops/commit/15f45cf8))

## 0.18.5 (2024-09-19)

### Bug Fixes

- **eslint:** Remove eslint configuration duplicates
  ([124cead3](https://github.com/storm-software/storm-ops/commit/124cead3))

## 0.18.4 (2024-09-19)

### Bug Fixes

- **eslint:** Remove duplicate eslint rules
  ([bc272af0](https://github.com/storm-software/storm-ops/commit/bc272af0))

## 0.18.3 (2024-09-19)

### Bug Fixes

- **eslint:** Resolve issue with files in typescript rules
  ([02f728a3](https://github.com/storm-software/storm-ops/commit/02f728a3))

## 0.18.2 (2024-09-19)

### Bug Fixes

- **eslint:** Resolve issue with invalid ignores configuration
  ([82c68cad](https://github.com/storm-software/storm-ops/commit/82c68cad))

## 0.18.1 (2024-09-19)

### Bug Fixes

- **eslint:** Remove the jsa11y extension
  ([60a44018](https://github.com/storm-software/storm-ops/commit/60a44018))

## 0.18.0 (2024-09-17)

### Features

- **eslint:** Include updated linting types
  ([9c415747](https://github.com/storm-software/storm-ops/commit/9c415747))

## 0.17.1 (2024-09-17)

### Bug Fixes

- **eslint:** Resolve invalid import path issue
  ([f9c60c86](https://github.com/storm-software/storm-ops/commit/f9c60c86))

## 0.17.0 (2024-09-17)

### Features

- **eslint:** Include the updated typings for the preset's rules
  ([c41fe207](https://github.com/storm-software/storm-ops/commit/c41fe207))

## 0.16.4 (2024-09-16)

### Bug Fixes

- **eslint:** Resolve issue with invalid react file configurations
  ([524b22be](https://github.com/storm-software/storm-ops/commit/524b22be))

## 0.16.3 (2024-09-16)

### Bug Fixes

- **storm-ops:** Resolve issues with workflow actions
  ([2ba8f980](https://github.com/storm-software/storm-ops/commit/2ba8f980))

## 0.16.2 (2024-09-08)

### Bug Fixes

- **workspace-tools:** Update the compiler options used in TypeScript plugin
  ([b788e426](https://github.com/storm-software/storm-ops/commit/b788e426))

- **workspace-tools:** Resolved issue with returned value in Rust plugin
  ([f37a1f44](https://github.com/storm-software/storm-ops/commit/f37a1f44))

## 0.16.1 (2024-09-08)

### Features

- **workspace-tools:** Ensure the workspaceRoot is used as the base directory
  ([2b8ab737](https://github.com/storm-software/storm-ops/commit/2b8ab737))

## 0.15.1 (2024-09-08)

### Bug Fixes

- **workspace-tools:** Resolved issues with typescript2 plugin
  ([a3a2a4af](https://github.com/storm-software/storm-ops/commit/a3a2a4af))

## 0.15.0 (2024-09-06)

### Features

- **k8s-tools:** Added extra fields onto the released container's `meta.json`
  file ([14356536](https://github.com/storm-software/storm-ops/commit/14356536))

### Bug Fixes

- **workspace-tools:** Resolved the duplicate export name issue
  ([f2586335](https://github.com/storm-software/storm-ops/commit/f2586335))

## 0.14.1 (2024-09-06)

### Bug Fixes

- **git-tools:** Resolved issue with missing command line arguments
  ([59e26e31](https://github.com/storm-software/storm-ops/commit/59e26e31))

## 0.14.0 (2024-09-06)

### Features

- **git-tools:** Added logic to skip signing during CI workflows
  ([4a7062ce](https://github.com/storm-software/storm-ops/commit/4a7062ce))

## 0.13.0 (2024-09-06)

### Features

- **git-tools:** Added signed commits to storm-git scripts
  ([3d7c88c9](https://github.com/storm-software/storm-ops/commit/3d7c88c9))

## 0.12.1 (2024-09-05)

### Bug Fixes

- **cloudflare-tools:** Regenerated the README.md file
  ([6ad71f5a](https://github.com/storm-software/storm-ops/commit/6ad71f5a))

## 0.12.0 (2024-09-05)

### Features

- **cloudflare-tools:** Added the `R2UploadPublish` executor
  ([e5495bdb](https://github.com/storm-software/storm-ops/commit/e5495bdb))

## 0.11.0 (2024-09-03)

### Features

- **linting-tools:** Taplo toml formatting improvements
  ([1e84182b](https://github.com/storm-software/storm-ops/commit/1e84182b))

## 0.10.0 (2024-09-03)

### Features

- **storm-ops:** Upgrade the Nx workspace versions
  ([15cb7ee2](https://github.com/storm-software/storm-ops/commit/15cb7ee2))

## 0.9.0 (2024-09-02)

### Features

- **terraform-modules:** Added the `aws/karpenter` and `cloudflare/r2-bucket`
  modules
  ([09deea18](https://github.com/storm-software/storm-ops/commit/09deea18))

### Bug Fixes

- **terraform-modules:** Resolved issue with applying tags to resources
  ([a0fd5e19](https://github.com/storm-software/storm-ops/commit/a0fd5e19))

## 0.8.1 (2024-08-26)

### Bug Fixes

- **terraform-tools:** Resolved issue with the Jest configuration file
  ([16c88699](https://github.com/storm-software/storm-ops/commit/16c88699))

### Dependency Upgrades

- **storm-ops:** Upgrade the workspace's Nx version
  ([4ce6ac9e](https://github.com/storm-software/storm-ops/commit/4ce6ac9e))

## 0.8.0 (2024-08-04)

### Features

- **config:** Added the `docs` and `licensing` options to the Storm
  configuration
  ([c867efe1](https://github.com/storm-software/storm-ops/commit/c867efe1))

## 0.7.0 (2024-08-03)

### Features

- **eslint:** Ignore `prefer-nullish-coalescing` for strings
  ([dbae2a58](https://github.com/storm-software/storm-ops/commit/dbae2a58))

## 0.6.0 (2024-08-03)

### Features

- **build-tools:** Add back experimental DTS option to TSUP
  ([4fe9652b](https://github.com/storm-software/storm-ops/commit/4fe9652b))

## 0.5.0 (2024-08-03)

### Features

- **storm-ops:** Upgrade workspace's Nx package dependencies
  ([5f31f734](https://github.com/storm-software/storm-ops/commit/5f31f734))

## 0.4.0 (2024-08-03)

### Features

- **build-tools:** Add tsup build's rollup helpers
  ([27ecd4e6](https://github.com/storm-software/storm-ops/commit/27ecd4e6))

## 0.3.1 (2024-08-03)

### Bug Fixes

- **build-tools:** Resolved issue with the entry name parameter in unbuild
  config
  ([f5e5dbdd](https://github.com/storm-software/storm-ops/commit/f5e5dbdd))

## 0.3.0 (2024-08-02)

### Features

- **build-tools:** Added back the export statements to unbuild configuration
  ([5fb63682](https://github.com/storm-software/storm-ops/commit/5fb63682))

## 0.2.0 (2024-08-02)

### Features

- **build-tools:** Update the unbuild configuration to get exports from
  `package.json` files
  ([bb2fc78f](https://github.com/storm-software/storm-ops/commit/bb2fc78f))

## 0.1.1 (2024-08-02)

### Bug Fixes

- **terraform-tools:** Resolve issue with invalid release executor
  ([20e5b88c](https://github.com/storm-software/storm-ops/commit/20e5b88c))

- **terraform-tools:** Include missing changes to `project.json` file
  ([5d7e0f0f](https://github.com/storm-software/storm-ops/commit/5d7e0f0f))

## 0.1.0 (2024-08-02)

### Features

- **terraform-tools:** Initial check-in of project code
  ([c4ef4810](https://github.com/storm-software/storm-ops/commit/c4ef4810))

- **build-tools:** Added `failOnWarn` parameter to unbuild configuration
  ([ba28050d](https://github.com/storm-software/storm-ops/commit/ba28050d))

- **terraform-tools:** Added terraform options to the plugin's executor schemas
  ([fb555cb4](https://github.com/storm-software/storm-ops/commit/fb555cb4))

- **terraform-tools:** Update build to exclude other storm package from the
  distribution
  ([96294aac](https://github.com/storm-software/storm-ops/commit/96294aac))
