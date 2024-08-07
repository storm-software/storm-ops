## 1.39.0 (2024-08-04)


### Features

- **config:** Added the `docs` and `licensing` options to the Storm configuration ([c867efe1](https://github.com/storm-software/storm-ops/commit/c867efe1))

- **config:** Updated default `brand` color and added proper URLs to file banners ([008e6ef4](https://github.com/storm-software/storm-ops/commit/008e6ef4))


### Bug Fixes

- **build-tools:** Resolve issues with logic in `outExtension` utility function ([8cdc691b](https://github.com/storm-software/storm-ops/commit/8cdc691b))

## 1.38.0 (2024-08-03)


### Features

- **build-tools:** Add back experimental DTS option to TSUP ([4fe9652b](https://github.com/storm-software/storm-ops/commit/4fe9652b))

## 1.37.0 (2024-08-03)


### Features

- **build-tools:** Add tsup build's rollup helpers ([27ecd4e6](https://github.com/storm-software/storm-ops/commit/27ecd4e6))

## 1.36.0 (2024-08-02)


### Features

- **build-tools:** Added back the export statements to unbuild configuration ([5fb63682](https://github.com/storm-software/storm-ops/commit/5fb63682))

## 1.35.0 (2024-08-02)


### Features

- **config:** Removed the `ci` option from config and enabled better caching ([2456c216](https://github.com/storm-software/storm-ops/commit/2456c216))

- **build-tools:** Populate the distribution's package.json with `exports` based on project structure ([cf0eed52](https://github.com/storm-software/storm-ops/commit/cf0eed52))

## 1.34.1 (2024-07-31)


### Bug Fixes

- **build-tools:** Remove unused plugin from unbuild ([ad8a5991](https://github.com/storm-software/storm-ops/commit/ad8a5991))

## 1.34.0 (2024-07-31)


### Features

- **create-storm-workspace:** Configure workspace to include GitHub ([eea71de7](https://github.com/storm-software/storm-ops/commit/eea71de7))

## 1.33.0 (2024-07-30)


### Features

- **eslint:** Added the header plugin ([cc0cbbea](https://github.com/storm-software/storm-ops/commit/cc0cbbea))

- **eslint:** Removed invalid JSON configuration from package ([2622ee7e](https://github.com/storm-software/storm-ops/commit/2622ee7e))

## 1.32.0 (2024-07-29)


### Features

- **build-tools:** Update unbuild process to use the `tsconfck` package ([d0e4dbf6](https://github.com/storm-software/storm-ops/commit/d0e4dbf6))

## 1.31.0 (2024-07-29)


### Features

- **config:** Added the `brand2` and `brand3` color tokens ([58705631](https://github.com/storm-software/storm-ops/commit/58705631))

## 1.30.0 (2024-07-19)

### Features

- **workspace-tools:** Added the `clean-package` executor
  ([a1763e45](https://github.com/storm-software/storm-ops/commit/a1763e45))

- **config:** Updated `workspaceRoot` with a default value
  ([5ee3fb09](https://github.com/storm-software/storm-ops/commit/5ee3fb09))

## 1.29.0 (2024-07-17)

### Features

- **git-tools:** Added README header template to include table of contents
  ([6841042e](https://github.com/storm-software/storm-ops/commit/6841042e))

## 1.28.0 (2024-06-22)

### Features

- **workspace-tools:** Upgrade the workspace pnpm-lock file
  ([d33c20cb](https://github.com/storm-software/storm-ops/commit/d33c20cb))

## 1.27.0 (2024-06-22)

### Features

- **storm-ops:** Updated pnpm-lock file
  ([22be1efd](https://github.com/storm-software/storm-ops/commit/22be1efd))

## 1.26.0 (2024-06-22)

### Features

- **config:** Added `$schema` field to Storm configuration schema
  ([b4b3323a](https://github.com/storm-software/storm-ops/commit/b4b3323a))

- **workspace-tools:** Added `lint` and `format` tasks and improved cache input
  management
  ([f2ade202](https://github.com/storm-software/storm-ops/commit/f2ade202))

## 1.25.0 (2024-06-21)

### Features

- **eslint-plugin:** Resolve issues with eslint module types
  ([ca513974](https://github.com/storm-software/storm-ops/commit/ca513974))

## 1.24.0 (2024-06-05)

### Features

- **eslint:** Major updates to resolve eslint issues
  ([50e7c988](https://github.com/storm-software/storm-ops/commit/50e7c988))

## 1.23.1 (2024-06-05)

### Bug Fixes

- **eslint:** Resolve issue with missing dependencies
  ([b0f43454](https://github.com/storm-software/storm-ops/commit/b0f43454))

## 1.23.0 (2024-06-03)

### Features

- **config:** Added the `registry` configuration node
  ([708668a4](https://github.com/storm-software/storm-ops/commit/708668a4))

- **config:** Updates to Storm config JSON schema file
  ([5075774d](https://github.com/storm-software/storm-ops/commit/5075774d))

## 1.22.1 (2024-06-03)

### Bug Fixes

- **git-tools:** Resolved issue with import in markdown formatter
  ([5e3963de](https://github.com/storm-software/storm-ops/commit/5e3963de))

## 1.22.0 (2024-06-02)

### Features

- **config:** Update the Storm Configuration JSON Schema file
  ([0376baa5](https://github.com/storm-software/storm-ops/commit/0376baa5))

## 1.21.0 (2024-06-02)

### Features

- **config-tools:** Enhance the validations for the `cloudflareAccountId`
  configuration
  ([9fbc1954](https://github.com/storm-software/storm-ops/commit/9fbc1954))

## 1.20.0 (2024-05-29)

### Features

- **cloudflare-tools:** Update worker generator to add hono depenendency
  ([946a9e59](https://github.com/storm-software/storm-ops/commit/946a9e59))

## 1.19.0 (2024-05-29)

### Features

- **config:** Added the `cloudflareAccountId` configuration parameter
  ([db4cbd7d](https://github.com/storm-software/storm-ops/commit/db4cbd7d))

### Bug Fixes

- **storm-ops:** Upgrade the monorepo's Nx package versions
  ([29c7e48d](https://github.com/storm-software/storm-ops/commit/29c7e48d))

## 1.18.1 (2024-05-27)

### Bug Fixes

- **deps:** update patch prod dependencies
  ([a8113435](https://github.com/storm-software/storm-ops/commit/a8113435))

## 1.18.0 (2024-05-07)

### Features

- **config:** Added the `accent` color token to configuration
  ([a7a24ec1](https://github.com/storm-software/storm-ops/commit/a7a24ec1))

### Bug Fixes

- **config:** Mark the `accent` color as optional
  ([156921b6](https://github.com/storm-software/storm-ops/commit/156921b6))

## 1.17.0 (2024-05-07)

### Features

- **config:** Add the `help` color token type
  ([8a466466](https://github.com/storm-software/storm-ops/commit/8a466466))

## 1.16.7 (2024-05-06)

### Bug Fixes

- **markdownlint:** Resolved issue with bad config in lint file
  ([95b3aba7](https://github.com/storm-software/storm-ops/commit/95b3aba7))

## 1.16.6 (2024-05-04)

### Bug Fixes

- **config:** Resolve issue with invalid export paths
  ([890deaec](https://github.com/storm-software/storm-ops/commit/890deaec))

## 1.16.5 (2024-05-04)

### Bug Fixes

- **config:** Update the imports used in the `package.json` file
  ([63a6cf2a](https://github.com/storm-software/storm-ops/commit/63a6cf2a))

## 1.16.4 (2024-05-04)

### Bug Fixes

- **config:** Resolve issue with previous dist package
  ([23abea7a](https://github.com/storm-software/storm-ops/commit/23abea7a))

## 1.16.3 (2024-05-04)

### Bug Fixes

- **config:** Update type declarations on shared config package
  ([0a560583](https://github.com/storm-software/storm-ops/commit/0a560583))

## 1.16.2 (2024-05-04)

### Bug Fixes

- **config:** Ensure `schemas` folder is specified in `package.json` file
  ([23f25d69](https://github.com/storm-software/storm-ops/commit/23f25d69))

## 1.16.1 (2024-05-04)

### Bug Fixes

- **config:** Ensure JSON schema asset gets copied into dist folder
  ([cde736ce](https://github.com/storm-software/storm-ops/commit/cde736ce))

## 1.16.0 (2024-05-04)

### Features

- **config:** Generated the Storm Configuration JSON schema package asset
  ([0a5c9bb2](https://github.com/storm-software/storm-ops/commit/0a5c9bb2))

## 1.15.0 (2024-05-04)

### Features

- **config:** Update the structure of the theme color names
  ([4c087334](https://github.com/storm-software/storm-ops/commit/4c087334))

## 1.14.0 (2024-05-04)

### Features

- **config:** Reorganized the required theme config schema values
  ([3ec7b029](https://github.com/storm-software/storm-ops/commit/3ec7b029))

## 1.13.0 (2024-05-04)

### Features

- **config:** Update the theme to use brand colors instead of hierarchy colors
  ([bcff6b80](https://github.com/storm-software/storm-ops/commit/bcff6b80))

## 1.12.3 (2024-04-29)

### Bug Fixes

- **deps:** update patch prod dependencies
  ([c427e132](https://github.com/storm-software/storm-ops/commit/c427e132))

- **deps:** update dependencies-non-major
  ([#130](https://github.com/storm-software/storm-ops/pull/130))

## 1.12.2 (2024-04-26)

### Bug Fixes

- **config-tools:** Improved logging and enhanced config json preset
  ([5dabb1ae](https://github.com/storm-software/storm-ops/commit/5dabb1ae))

## 1.12.1 (2024-04-24)

### Bug Fixes

- **config-tools:** Updates to the default values applied to the Storm config
  ([4cc78a98](https://github.com/storm-software/storm-ops/commit/4cc78a98))

## 1.12.0 (2024-04-24)

### Features

- **config:** Add type exports for theme color typings
  ([61fe73f9](https://github.com/storm-software/storm-ops/commit/61fe73f9))

## 1.11.3 (2024-04-22)

### Bug Fixes

- **config:** Added updates to repository logging
  ([2b871dc3](https://github.com/storm-software/storm-ops/commit/2b871dc3))

## 1.11.2 (2024-04-15)

### Bug Fixes

- **config-tools:** Resolved issue with missing fields in Storm configuration
  ([cf157d2a](https://github.com/storm-software/storm-ops/commit/cf157d2a))

## 1.11.1 (2024-04-13)

### Bug Fixes

- **config-tools:** Resolved issue with bad `project.json` tasks
  ([744c7eef](https://github.com/storm-software/storm-ops/commit/744c7eef))

## 1.11.0 (2024-04-13)

### Features

- **config-tools:** Added esm support
  ([fd9dbda5](https://github.com/storm-software/storm-ops/commit/fd9dbda5))

## 1.10.0 (2024-04-13)

### Features

- **config:** Add `light` and `dark` colors to configuration
  ([654cd1d0](https://github.com/storm-software/storm-ops/commit/654cd1d0))

## 1.9.5 (2024-04-13)

### Bug Fixes

- **config:** Update config to use `outputDirectory` value
  ([42604faf](https://github.com/storm-software/storm-ops/commit/42604faf))

## 1.9.4 (2024-04-08)

### Bug Fixes

- **build-tools:** Resolved issue with module types used in build
  ([50a368d3](https://github.com/storm-software/storm-ops/commit/50a368d3))

## 1.9.3 (2024-04-08)

### Bug Fixes

- **build-tools:** Resolved issue with duplicate require definition
  ([63aa1d16](https://github.com/storm-software/storm-ops/commit/63aa1d16))

## 1.9.2 (2024-04-08)

### Bug Fixes

- **workspace-tools:** Resolve issues with `build-tools` import
  ([fc040f71](https://github.com/storm-software/storm-ops/commit/fc040f71))

## 1.9.1 (2024-04-08)

### Bug Fixes

- **git-tools:** Update release tool to use local function to get configuration
  ([53db7520](https://github.com/storm-software/storm-ops/commit/53db7520))

## 1.9.0 (2024-04-07)

### Features

- **git-tools:** Added reusable GitHub `workflows` and `actions`
  ([1c9a5391](https://github.com/storm-software/storm-ops/commit/1c9a5391))

- **storm-ops:** Merged in change to the main branch
  ([ce79c572](https://github.com/storm-software/storm-ops/commit/ce79c572))

## 1.8.0 (2024-04-06)

### Features

- **build-tools:** Added support for `rolldown` builds
  ([46de2e63](https://github.com/storm-software/storm-ops/commit/46de2e63))

## 1.7.4 (2024-04-01)

### Bug Fixes

- **workspace-tools:** Resolve issue with bad release path in npm publish
  ([4f5ba3db](https://github.com/storm-software/storm-ops/commit/4f5ba3db))

## 1.7.3 (2024-03-29)

### Bug Fixes

- **workspace-tools:** Added the `nx-release-publish` target to TypeScript
  projects
  ([52b61117](https://github.com/storm-software/storm-ops/commit/52b61117))

## 1.7.2 (2024-03-28)

### Bug Fixes

- **git-tools:** Added code to add ts plugin transpilers
  ([ec514d57](https://github.com/storm-software/storm-ops/commit/ec514d57))

## 1.7.1 (2024-03-28)

### Bug Fixes

- **storm-ops:** Update the links in the README files to use proper repository
  ([decc0db3](https://github.com/storm-software/storm-ops/commit/decc0db3))

## 1.7.0 (2024-03-25)

### Features

- **workspace-tools:** Added Nx plugin to apply rust and typescript targets
  ([5738161f](https://github.com/storm-software/storm-ops/commit/5738161f))

- **workspace-tools:** Major updates to base nx.json configuration
  ([06ec9a6a](https://github.com/storm-software/storm-ops/commit/06ec9a6a))

## 1.6.0 (2024-03-03)

### Features

- **config:** Added the implementation for the `externalPackagePatterns` config
  parameter
  ([73762463](https://github.com/storm-software/storm-ops/commit/73762463))

## 1.5.5 (2024-03-01)

### Bug Fixes

- **workspace-tools:** Remove the storm env filter
  ([48259eea](https://github.com/storm-software/storm-ops/commit/48259eea))

## 1.5.4 (2024-03-01)

### Bug Fixes

- **workspace-tools:** Use tsc to build package
  ([05780f07](https://github.com/storm-software/storm-ops/commit/05780f07))

## 1.5.3 (2024-02-27)

### Bug Fixes

- **workspace-tools:** Resolve issue with tsconfig file resolution
  ([0254e50a](https://github.com/storm-software/storm-ops/commit/0254e50a))

## 1.5.2 (2024-02-27)

### Bug Fixes

- **workspace-tools:** Update module type on config packages to support imports
  ([a0b2bff4](https://github.com/storm-software/storm-ops/commit/a0b2bff4))

- **config-tools:** Update config packages to only use cjs
  ([75e4a16b](https://github.com/storm-software/storm-ops/commit/75e4a16b))

## 1.5.1 (2024-02-27)

### Bug Fixes

- **workspace-tools:** Update the build executor back to esbuild
  ([ff200547](https://github.com/storm-software/storm-ops/commit/ff200547))

## 1.5.0 (2024-02-26)

### Features

- **tsconfig:** Added package to contain default base tsconfig files
  ([1b341f9a](https://github.com/storm-software/storm-ops/commit/1b341f9a))

### Bug Fixes

- **git-tools:** Resolved linting issues with the nx-version module
  ([9b5f02d0](https://github.com/storm-software/storm-ops/commit/9b5f02d0))

## 1.4.0 (2024-02-26)

### Features

- **storm-ops:** Major updates to tsconfig values
  ([a3638fae](https://github.com/storm-software/storm-ops/commit/a3638fae))

## 1.3.6 (2024-02-24)

### Bug Fixes

- **workspace-tools:** Update build compiler parameters
  ([3c6cb525](https://github.com/storm-software/storm-ops/commit/3c6cb525))

## 1.3.5 (2024-02-20)

### Features

- **git-tools:** Support for updated Nx Release processing
  ([92f99126](https://github.com/storm-software/storm-ops/commit/92f99126))

### Bug Fixes

- **changelog:** Resolved type issues when calling changelogRenderer
  ([3c84ddd5](https://github.com/storm-software/storm-ops/commit/3c84ddd5))

- **config:** Update type of package
  ([60f75b96](https://github.com/storm-software/storm-ops/commit/60f75b96))

- **config:** Update package to use CommonJs
  ([f8c863cd](https://github.com/storm-software/storm-ops/commit/f8c863cd))

- **config-tools:** Update method of importing config package
  ([197213a6](https://github.com/storm-software/storm-ops/commit/197213a6))

- **config:** Mark config to no longer bundle code
  ([2b97e77e](https://github.com/storm-software/storm-ops/commit/2b97e77e))

- **config:** Update package import handlers
  ([5d6e83c8](https://github.com/storm-software/storm-ops/commit/5d6e83c8))

## 1.3.4 (2024-02-20)

### Features

- **git-tools:** Support for updated Nx Release processing
  ([92f99126](https://github.com/storm-software/storm-ops/commit/92f99126))

### Bug Fixes

- **changelog:** Resolved type issues when calling changelogRenderer
  ([3c84ddd5](https://github.com/storm-software/storm-ops/commit/3c84ddd5))

- **config:** Update type of package
  ([60f75b96](https://github.com/storm-software/storm-ops/commit/60f75b96))

- **config:** Update package to use CommonJs
  ([f8c863cd](https://github.com/storm-software/storm-ops/commit/f8c863cd))

- **config-tools:** Update method of importing config package
  ([197213a6](https://github.com/storm-software/storm-ops/commit/197213a6))

- **config:** Mark config to no longer bundle code
  ([2b97e77e](https://github.com/storm-software/storm-ops/commit/2b97e77e))

## 1.3.3 (2024-02-20)

### Features

- **git-tools:** Support for updated Nx Release processing
  ([92f99126](https://github.com/storm-software/storm-ops/commit/92f99126))

### Bug Fixes

- **changelog:** Resolved type issues when calling changelogRenderer
  ([3c84ddd5](https://github.com/storm-software/storm-ops/commit/3c84ddd5))

- **config:** Update type of package
  ([60f75b96](https://github.com/storm-software/storm-ops/commit/60f75b96))

- **config:** Update package to use CommonJs
  ([f8c863cd](https://github.com/storm-software/storm-ops/commit/f8c863cd))

- **config-tools:** Update method of importing config package
  ([197213a6](https://github.com/storm-software/storm-ops/commit/197213a6))

## 1.3.2 (2024-02-20)

### Features

- **git-tools:** Support for updated Nx Release processing
  ([92f99126](https://github.com/storm-software/storm-ops/commit/92f99126))

### Bug Fixes

- **changelog:** Resolved type issues when calling changelogRenderer
  ([3c84ddd5](https://github.com/storm-software/storm-ops/commit/3c84ddd5))

- **config:** Update type of package
  ([60f75b96](https://github.com/storm-software/storm-ops/commit/60f75b96))

- **config:** Update package to use CommonJs
  ([f8c863cd](https://github.com/storm-software/storm-ops/commit/f8c863cd))

## 1.3.1 (2024-02-20)

### Features

- **git-tools:** Support for updated Nx Release processing
  ([92f99126](https://github.com/storm-software/storm-ops/commit/92f99126))

### Bug Fixes

- **changelog:** Resolved type issues when calling changelogRenderer
  ([3c84ddd5](https://github.com/storm-software/storm-ops/commit/3c84ddd5))

- **config:** Update type of package
  ([60f75b96](https://github.com/storm-software/storm-ops/commit/60f75b96))

## 1.3.0 (2024-02-20)

### Features

- **git-tools:** Support for updated Nx Release processing
  ([92f99126](https://github.com/storm-software/storm-ops/commit/92f99126))

### Bug Fixes

- **changelog:** Resolved type issues when calling changelogRenderer
  ([3c84ddd5](https://github.com/storm-software/storm-ops/commit/3c84ddd5))

## 1.2.22 (2024-02-17)

### Bug Fixes

- **storm-ops:** Update the chalk version to v4.1.2
  ([0d50334a](https://github.com/storm-software/storm-ops/commit/0d50334a))

- **storm-ops:** Resolve issue with the pnpm version
  ([f124fd94](https://github.com/storm-software/storm-ops/commit/f124fd94))

- **config-tools:** Update package type to a module to resolve import issues
  ([4a9649c9](https://github.com/storm-software/storm-ops/commit/4a9649c9))

- **config:** Updated the default import method
  ([3556e215](https://github.com/storm-software/storm-ops/commit/3556e215))

- **workspace-tools:** Add `zod` as external depencency
  ([05b66136](https://github.com/storm-software/storm-ops/commit/05b66136))

- **workspace-tools:** Update method of referencing the internal packages
  ([b3f127c4](https://github.com/storm-software/storm-ops/commit/b3f127c4))

## 1.2.21 (2024-02-17)

### Bug Fixes

- **storm-ops:** Update the chalk version to v4.1.2
  ([0d50334a](https://github.com/storm-software/storm-ops/commit/0d50334a))

- **storm-ops:** Resolve issue with the pnpm version
  ([f124fd94](https://github.com/storm-software/storm-ops/commit/f124fd94))

- **config-tools:** Update package type to a module to resolve import issues
  ([4a9649c9](https://github.com/storm-software/storm-ops/commit/4a9649c9))

- **config:** Updated the default import method
  ([3556e215](https://github.com/storm-software/storm-ops/commit/3556e215))

- **workspace-tools:** Add `zod` as external depencency
  ([05b66136](https://github.com/storm-software/storm-ops/commit/05b66136))

## 1.2.20 (2024-02-17)

### Bug Fixes

- **storm-ops:** Update the chalk version to v4.1.2
  ([0d50334a](https://github.com/storm-software/storm-ops/commit/0d50334a))

- **storm-ops:** Resolve issue with the pnpm version
  ([f124fd94](https://github.com/storm-software/storm-ops/commit/f124fd94))

- **config-tools:** Update package type to a module to resolve import issues
  ([4a9649c9](https://github.com/storm-software/storm-ops/commit/4a9649c9))

- **config:** Updated the default import method
  ([3556e215](https://github.com/storm-software/storm-ops/commit/3556e215))

## 1.2.19 (2024-02-15)

### Bug Fixes

- **storm-ops:** Update the chalk version to v4.1.2
  ([0d50334a](https://github.com/storm-software/storm-ops/commit/0d50334a))

- **storm-ops:** Resolve issue with the pnpm version
  ([f124fd94](https://github.com/storm-software/storm-ops/commit/f124fd94))

- **config-tools:** Update package type to a module to resolve import issues
  ([4a9649c9](https://github.com/storm-software/storm-ops/commit/4a9649c9))

## 1.2.18 (2024-02-15)

### Bug Fixes

- **storm-ops:** Update the chalk version to v4.1.2
  ([0d50334a](https://github.com/storm-software/storm-ops/commit/0d50334a))

- **storm-ops:** Resolve issue with the pnpm version
  ([f124fd94](https://github.com/storm-software/storm-ops/commit/f124fd94))

## 1.2.17 (2024-02-15)

### Bug Fixes

- **storm-ops:** Update the chalk version to v4.1.2
  ([0d50334a](https://github.com/storm-software/storm-ops/commit/0d50334a))

## 1.2.16 (2024-02-15)

### Bug Fixes

- **storm-ops:** Update chalk dependency for all modules
  ([d8a55c49](https://github.com/storm-software/storm-ops/commit/d8a55c49))

- **storm-ops:** Downgrade dependencies to work with cjs task runners
  ([bece51de](https://github.com/storm-software/storm-ops/commit/bece51de))

## 1.2.15 (2024-02-15)

### Bug Fixes

- **storm-ops:** Update chalk dependency for all modules
  ([d8a55c49](https://github.com/storm-software/storm-ops/commit/d8a55c49))

## 1.1.0 (2024-02-07)

### Features

- **config:** Added a base config package to allow neutral access of
  `StormConfig`
  ([164eaa5b](https://github.com/storm-software/storm-ops/commit/164eaa5b))

- **config:** Updated git hooks to generate the json-schema for `StormConfig`
  ([263557cb](https://github.com/storm-software/storm-ops/commit/263557cb))
