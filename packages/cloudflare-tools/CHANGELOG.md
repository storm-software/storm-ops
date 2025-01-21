## 0.52.3 (2025-01-21)

### Bug Fixes

- **workspace-tools:** Resolve internal package as ESM via `jiti` resolver ([1dc4cfdd](https://github.com/storm-software/storm-ops/commit/1dc4cfdd))

## 0.52.2 (2025-01-21)

### Bug Fixes

- **unbuild:** Resolved issue with package `exports` path ([faf23b0e](https://github.com/storm-software/storm-ops/commit/faf23b0e))

## 0.52.1 (2025-01-21)

### Bug Fixes

- **workspace-tools:** Resolve issue with invalid import path ([42a07d0c](https://github.com/storm-software/storm-ops/commit/42a07d0c))

## 0.52.0 (2025-01-21)

### Features

- **config-tools:** Added the `createLogger` function to drive CommonJs modules ([0cee1525](https://github.com/storm-software/storm-ops/commit/0cee1525))

## 0.51.2 (2025-01-21)

### Continuous Integration

- **workspace-tools:** Mark all internal packages as external ([f8c65aeb](https://github.com/storm-software/storm-ops/commit/f8c65aeb))

## 0.51.1 (2025-01-20)

### Miscellaneous

- **config-tools:** Bundle dependencies in distributable ([df027cfe](https://github.com/storm-software/storm-ops/commit/df027cfe))

## 0.51.0 (2025-01-20)

### Features

- **unbuild:** Update package to bundle config-tools ([a2fc7768](https://github.com/storm-software/storm-ops/commit/a2fc7768))

## 0.50.4 (2025-01-20)

### Bug Fixes

- **workspace-tools:** Add `jiti` to support resolution of `@storm-software/unbuild` package ([0abfa98b](https://github.com/storm-software/storm-ops/commit/0abfa98b))

## 0.50.3 (2025-01-20)

### Bug Fixes

- **workspace-tools:** Resolve formatting issue with missing `parser` config ([da80cf3d](https://github.com/storm-software/storm-ops/commit/da80cf3d))

## 0.50.2 (2025-01-20)

### Bug Fixes

- **untyped:** Resovle bundling issue with externals ([ff044ddf](https://github.com/storm-software/storm-ops/commit/ff044ddf))

## 0.50.1 (2025-01-20)

### Bug Fixes

- **unbuild:** Update package to bundle the `unbuild` package for distribution ([d304c28d](https://github.com/storm-software/storm-ops/commit/d304c28d))

## 0.50.0 (2025-01-20)

### Features

- **unbuild:** Update build process to use cached project graph ([610c94aa](https://github.com/storm-software/storm-ops/commit/610c94aa))

## 0.49.1 (2025-01-20)

### Bug Fixes

- **workspace-tools:** Resolve cross-platform build issue in `copyfiles` script ([331a723f](https://github.com/storm-software/storm-ops/commit/331a723f))

## 0.49.0 (2025-01-20)

### Features

- **untyped:** Standard file name changes to avoid collisions ([71acf100](https://github.com/storm-software/storm-ops/commit/71acf100))

### Bug Fixes

- **terraform-tools:** Resolve issue with invalid import path ([7a8ee2cf](https://github.com/storm-software/storm-ops/commit/7a8ee2cf))

## 0.48.0 (2025-01-20)

### Features

- **workspace-tools:** Update Nx plugin packages to use new build/dist infrastructure ([67cd3df2](https://github.com/storm-software/storm-ops/commit/67cd3df2))
- **untyped:** Initial check-in for the `untyped` package ([c02dad71](https://github.com/storm-software/storm-ops/commit/c02dad71))

### Bug Fixes

- **workspace-tools:** Resolved issue with invalid fields in base executor schema ([ae28e897](https://github.com/storm-software/storm-ops/commit/ae28e897))

### Miscellaneous

- **monorepo:** Regenerate README markdown files ([5c8e5c96](https://github.com/storm-software/storm-ops/commit/5c8e5c96))

## 0.47.9 (2025-01-13)

### Continuous Integration

- **unbuild:** Update the build configuration to properly bundle for node
  ([72be421b](https://github.com/storm-software/storm-ops/commit/72be421b))

## 0.47.8 (2025-01-13)

### Bug Fixes

- **unbuild:** Resolved issue with distribution package
  ([265f38a2](https://github.com/storm-software/storm-ops/commit/265f38a2))

## 0.47.7 (2025-01-12)

### Miscellaneous

- **monorepo:** Regenerate README markdown files
  ([a104880f](https://github.com/storm-software/storm-ops/commit/a104880f))

## 0.47.6 (2025-01-12)

### Bug Fixes

- **eslint:** Resolve stack overflow error on eslint configuration load
  ([f66752ac](https://github.com/storm-software/storm-ops/commit/f66752ac))

## 0.47.5 (2025-01-11)

### Bug Fixes

- **eslint:** Resolved issue with the bundling process
  ([d06b6588](https://github.com/storm-software/storm-ops/commit/d06b6588))

## 0.47.4 (2025-01-11)

### Bug Fixes

- **workspace-tools:** Resolve issue loading pnpm workspace's catalog
  dependencies
  ([1199e24f](https://github.com/storm-software/storm-ops/commit/1199e24f))

## 0.47.3 (2025-01-11)

### Miscellaneous

- **workspace-tools:** Added additional logging for pnpm dependency updates
  process
  ([400b3369](https://github.com/storm-software/storm-ops/commit/400b3369))

## 0.47.1 (2025-01-09)

### Bug Fixes

- **workspace-tools:** Added additional troubleshooting logging to the package
  ([c2cbdcc5](https://github.com/storm-software/storm-ops/commit/c2cbdcc5))

## 0.47.0 (2025-01-08)

### Features

- **git-tools:** Complete redesign of the package and tools contained within
  ([96de0911](https://github.com/storm-software/storm-ops/commit/96de0911))

## 0.46.0 (2025-01-02)

### Features

- **workspace-tools:** Added code to strip `catalog:` references in published
  `package.json` files
  ([d50c3ea6](https://github.com/storm-software/storm-ops/commit/d50c3ea6))

## 0.45.1 (2025-01-02)

### Bug Fixes

- **workspace-tools:** Resolved issue displaying buffer errors in publish
  executor
  ([21791bd1](https://github.com/storm-software/storm-ops/commit/21791bd1))

## 0.45.0 (2025-01-02)

### Features

- **config:** Clean up Storm workspace configuration properties
  ([22508dd8](https://github.com/storm-software/storm-ops/commit/22508dd8))

## 0.44.0 (2025-01-02)

### Features

- **workspace-tools:** Removed old dynamically imported modules
  ([56f84500](https://github.com/storm-software/storm-ops/commit/56f84500))

## 0.43.0 (2024-12-30)

### Features

- **workspace-tools:** Populate the `platform` project tags in
  `storm-software/typescript` plugin
  ([2942842c](https://github.com/storm-software/storm-ops/commit/2942842c))
- **storm-ops:** Completed enhancement around `catalog` and `workspace`
  dependency upgrades
  ([5dd13247](https://github.com/storm-software/storm-ops/commit/5dd13247))

## 0.42.0 (2024-12-18)

### Features

- **storm-ops:** Improved descriptions and markdown across monorepo
  ([aec89c79](https://github.com/storm-software/storm-ops/commit/aec89c79))

## 0.41.1 (2024-12-18)

### Bug Fixes

- **cloudflare-tools:** Added validation to ensure AWS key environment variables
  exist for R2 upload
  ([88c11eae](https://github.com/storm-software/storm-ops/commit/88c11eae))
- **storm-ops:** Resolved issue with ESM resolve error during postinstall script
  execution
  ([82389510](https://github.com/storm-software/storm-ops/commit/82389510))

### Dependency Upgrades

- **storm-ops:** Upgrade Nx package to v20.2.2
  ([d793912d](https://github.com/storm-software/storm-ops/commit/d793912d))
- **cloudflare-tools:** Update the Nx version used for package dependencies
  ([3f62334f](https://github.com/storm-software/storm-ops/commit/3f62334f))

## 0.41.0 (2024-12-01)

### Features

- **storm-ops:** Added `lint-sherif` script to the CI workflow
  ([906e0c2b](https://github.com/storm-software/storm-ops/commit/906e0c2b))

## 0.40.0 (2024-11-30)

### Features

- **storm-ops:** Added `sherif` and `knip` linting to CI pipeline
  ([181d782a](https://github.com/storm-software/storm-ops/commit/181d782a))

## 0.39.0 (2024-11-18)

### Features

- **build-tools:** Allow default package.json exports by no longer overriding
  them ([f19fc362](https://github.com/storm-software/storm-ops/commit/f19fc362))

## 0.38.1 (2024-11-10)

### Bug Fixes

- **config-tools:** Ensure trace logging is not marked as system logging
  ([e8dca171](https://github.com/storm-software/storm-ops/commit/e8dca171))

## 0.38.0 (2024-11-08)

### Features

- **build-tools:** Added back cjs build and local package.json dependencies
  ([d86d3c2a](https://github.com/storm-software/storm-ops/commit/d86d3c2a))

## 0.37.0 (2024-11-07)

### Features

- **config:** Add the `danger` color token
  ([06dba937](https://github.com/storm-software/storm-ops/commit/06dba937))

## 0.36.0 (2024-11-01)

### Features

- **eslint:** Resolve type issues with Nx plugin in preset
  ([d27162e2](https://github.com/storm-software/storm-ops/commit/d27162e2))

## 0.35.0 (2024-10-31)

### Features

- **storm-ops:** Upgrade the Nx package versions used in the repository
  ([369fad24](https://github.com/storm-software/storm-ops/commit/369fad24))

### Bug Fixes

- **cloudflare-tools:** Update calls to `readTargetsFromPackageJson` to match
  new definitions
  ([00d9c820](https://github.com/storm-software/storm-ops/commit/00d9c820))
- **cloudflare-tools:** Remove references to removed `projectNameAndRootFormat`
  Nx options
  ([7db6e9d6](https://github.com/storm-software/storm-ops/commit/7db6e9d6))

## 0.34.0 (2024-09-15)

### Features

- **build-tools:** Update unbuild optional parameters
  ([af395c22](https://github.com/storm-software/storm-ops/commit/af395c22))

## 0.33.3 (2024-09-08)

### Bug Fixes

- **workspace-tools:** Resolved issue with returned value in Rust plugin
  ([f37a1f44](https://github.com/storm-software/storm-ops/commit/f37a1f44))

## 0.33.2 (2024-09-08)

### Bug Fixes

- **eslint-config:** Resolved issue with applying banners
  ([5a337806](https://github.com/storm-software/storm-ops/commit/5a337806))

## 0.33.1 (2024-09-08)

### Bug Fixes

- **workspace-tools:** Resolved issues with typescript2 plugin
  ([a3a2a4af](https://github.com/storm-software/storm-ops/commit/a3a2a4af))

## 0.33.0 (2024-09-06)

### Features

- **k8s-tools:** Added extra fields onto the released container's `meta.json`
  file ([14356536](https://github.com/storm-software/storm-ops/commit/14356536))

### Bug Fixes

- **workspace-tools:** Resolved the duplicate export name issue
  ([f2586335](https://github.com/storm-software/storm-ops/commit/f2586335))

- **cloudflare-tools:** Removed unused variable
  ([30e0f826](https://github.com/storm-software/storm-ops/commit/30e0f826))

## 0.32.1 (2024-09-06)

### Bug Fixes

- **git-tools:** Resolved issue with missing command line arguments
  ([59e26e31](https://github.com/storm-software/storm-ops/commit/59e26e31))

## 0.32.0 (2024-09-06)

### Features

- **git-tools:** Added logic to skip signing during CI workflows
  ([4a7062ce](https://github.com/storm-software/storm-ops/commit/4a7062ce))

## 0.31.0 (2024-09-06)

### Features

- **git-tools:** Added signed commits to storm-git scripts
  ([3d7c88c9](https://github.com/storm-software/storm-ops/commit/3d7c88c9))

## 0.30.1 (2024-09-05)

### Bug Fixes

- **cloudflare-tools:** Regenerated the README.md file
  ([6ad71f5a](https://github.com/storm-software/storm-ops/commit/6ad71f5a))

## 0.30.0 (2024-09-05)

### Features

- **cloudflare-tools:** Added the `R2UploadPublish` executor
  ([e5495bdb](https://github.com/storm-software/storm-ops/commit/e5495bdb))

## 0.29.0 (2024-08-03)

### Features

- **eslint:** Ignore `prefer-nullish-coalescing` for strings
  ([dbae2a58](https://github.com/storm-software/storm-ops/commit/dbae2a58))

## 0.28.0 (2024-08-03)

### Features

- **storm-ops:** Upgrade workspace's Nx package dependencies
  ([5f31f734](https://github.com/storm-software/storm-ops/commit/5f31f734))

## 0.27.1 (2024-08-03)

### Bug Fixes

- **build-tools:** Resolved issue with the entry name parameter in unbuild
  config
  ([f5e5dbdd](https://github.com/storm-software/storm-ops/commit/f5e5dbdd))

## 0.27.0 (2024-08-02)

### Features

- **build-tools:** Update the unbuild configuration to get exports from
  `package.json` files
  ([bb2fc78f](https://github.com/storm-software/storm-ops/commit/bb2fc78f))

## 0.26.0 (2024-08-02)

### Features

- **terraform-tools:** Initial check-in of project code
  ([c4ef4810](https://github.com/storm-software/storm-ops/commit/c4ef4810))

## 0.25.0 (2024-08-02)

### Features

- **eslint:** Reformatted the banner string whitespace
  ([2df75cbb](https://github.com/storm-software/storm-ops/commit/2df75cbb))

## 0.24.1 (2024-08-02)

### Bug Fixes

- **eslint:** Resolve issue with duplicate plugins
  ([23c09494](https://github.com/storm-software/storm-ops/commit/23c09494))

## 0.24.0 (2024-08-02)

### Features

- **eslint:** Added a banner with `__filename` and `__dirname` to the
  distribution
  ([594c0e9a](https://github.com/storm-software/storm-ops/commit/594c0e9a))

## 0.23.0 (2024-08-02)

### Features

- **eslint:** Improved the logic around determining the banner
  ([4bbb321d](https://github.com/storm-software/storm-ops/commit/4bbb321d))

## 0.22.0 (2024-08-01)

### Features

- **eslint:** Added the `parserOptions` parameter to the preset's options
  ([344db07c](https://github.com/storm-software/storm-ops/commit/344db07c))

## 0.21.1 (2024-08-01)

### Bug Fixes

- **eslint:** Resolved issues with invalid TypeScript flat configuration
  ([88166ab1](https://github.com/storm-software/storm-ops/commit/88166ab1))

## 0.21.0 (2024-08-01)

### Features

- **git-tools:** Ensure `.git/COMMIT_EDITMSG` exists before reading from disk
  ([7abae7ae](https://github.com/storm-software/storm-ops/commit/7abae7ae))

## 0.20.2 (2024-07-31)

### Bug Fixes

- **git-tools:** Resolved issue when `commitlint` is called without a `message`
  parameter
  ([624b24bc](https://github.com/storm-software/storm-ops/commit/624b24bc))

## 0.20.1 (2024-07-31)

### Bug Fixes

- **build-tools:** Resolve issues with the output path provided to unbuild
  ([ee9c2353](https://github.com/storm-software/storm-ops/commit/ee9c2353))

## 0.20.0 (2024-07-31)

### Features

- **build-tools:** Added the CODEOWNERS linting tool
  ([63099b1b](https://github.com/storm-software/storm-ops/commit/63099b1b))

## 0.19.1 (2024-07-31)

### Bug Fixes

- **build-tools:** Remove unused plugin from unbuild
  ([ad8a5991](https://github.com/storm-software/storm-ops/commit/ad8a5991))

## 0.19.0 (2024-07-31)

### Features

- **create-storm-workspace:** Configure workspace to include GitHub
  ([eea71de7](https://github.com/storm-software/storm-ops/commit/eea71de7))

## 0.18.0 (2024-07-30)

### Features

- **eslint:** Added the header plugin
  ([cc0cbbea](https://github.com/storm-software/storm-ops/commit/cc0cbbea))

- **eslint:** Removed invalid JSON configuration from package
  ([2622ee7e](https://github.com/storm-software/storm-ops/commit/2622ee7e))

## 0.17.1 (2024-07-23)

### Bug Fixes

- **eslint:** Resolve issues with `json` plugin config spread
  ([088d498a](https://github.com/storm-software/storm-ops/commit/088d498a))

## 0.17.0 (2024-07-23)

### Features

- **eslint:** Remove the `import` plugin from the preset
  ([6c8551ae](https://github.com/storm-software/storm-ops/commit/6c8551ae))

## 0.16.0 (2024-07-22)

### Features

- **eslint:** Update rules around handling TypeScript function returns
  ([a9859cd4](https://github.com/storm-software/storm-ops/commit/a9859cd4))

## 0.15.0 (2024-07-22)

### Features

- **eslint:** Added Nx plugin to eslint preset
  ([1933027f](https://github.com/storm-software/storm-ops/commit/1933027f))

## 0.14.0 (2024-07-22)

### Features

- **eslint:** Add config formatter to eslint preset
  ([050dadcd](https://github.com/storm-software/storm-ops/commit/050dadcd))

## 0.13.1 (2024-07-22)

### Bug Fixes

- **storm-ops:** Resolved issue with cross-project typings
  ([aed5a357](https://github.com/storm-software/storm-ops/commit/aed5a357))

### Continuous Integration

- **storm-ops:** Resolve permissions issue in CI action
  ([2dd8c79e](https://github.com/storm-software/storm-ops/commit/2dd8c79e))

- **eslint:** Update `build` tasks to be cachable
  ([f24e2897](https://github.com/storm-software/storm-ops/commit/f24e2897))

## 0.13.0 (2024-07-19)

### Features

- **cloudflare-tools:** Added project tag functionality to plugin
  ([ef83e214](https://github.com/storm-software/storm-ops/commit/ef83e214))

### Documentation

- **storm-ops:** Remove emojis from monorepo CHANGELOG files
  ([441b36b1](https://github.com/storm-software/storm-ops/commit/441b36b1))

### Continuous Integration

- **storm-ops:** Update the lefthook configuration to properly glob staged files
  ([366dc251](https://github.com/storm-software/storm-ops/commit/366dc251))

## 0.12.0 (2024-07-17)

### Features

- **git-tools:** Added README header template to include table of contents
  ([6841042e](https://github.com/storm-software/storm-ops/commit/6841042e))

## 0.11.0 (2024-06-22)

### Features

- **workspace-tools:** Upgrade the workspace pnpm-lock file
  ([d33c20cb](https://github.com/storm-software/storm-ops/commit/d33c20cb))

## 0.10.0 (2024-06-22)

### Features

- **storm-ops:** Updated pnpm-lock file
  ([22be1efd](https://github.com/storm-software/storm-ops/commit/22be1efd))

## 0.9.0 (2024-06-22)

### Features

- **workspace-tools:** Added `lint` and `format` tasks and improved cache input
  management
  ([f2ade202](https://github.com/storm-software/storm-ops/commit/f2ade202))

## 0.8.0 (2024-06-21)

### Features

- **eslint-plugin:** Resolve issues with eslint module types
  ([ca513974](https://github.com/storm-software/storm-ops/commit/ca513974))

## 0.7.1 (2024-06-17)

### Bug Fixes

- **deps:** update patch prod dependencies
  ([ec613e8a](https://github.com/storm-software/storm-ops/commit/ec613e8a))

## 0.7.0 (2024-06-05)

### Features

- **cloudflare-tools:** Ensure the account id is provided from config during
  publish
  ([629e76c6](https://github.com/storm-software/storm-ops/commit/629e76c6))

## 0.6.2 (2024-06-05)

### Bug Fixes

- **eslint:** Resolve issue with missing dependencies
  ([b0f43454](https://github.com/storm-software/storm-ops/commit/b0f43454))

## 0.6.1 (2024-06-03)

### Bug Fixes

- **deps:** update patch prod dependencies
  ([072b4763](https://github.com/storm-software/storm-ops/commit/072b4763))

- **deps:** update dependencies-non-major
  ([#181](https://github.com/storm-software/storm-ops/pull/181))

## 0.6.0 (2024-06-02)

### Features

- **config:** Update the Storm Configuration JSON Schema file
  ([0376baa5](https://github.com/storm-software/storm-ops/commit/0376baa5))

## 0.5.0 (2024-06-02)

### Features

- **config-tools:** Enhance the validations for the `cloudflareAccountId`
  configuration
  ([9fbc1954](https://github.com/storm-software/storm-ops/commit/9fbc1954))

## 0.4.0 (2024-05-29)

### Features

- **cloudflare-tools:** Update worker generator to add hono depenendency
  ([946a9e59](https://github.com/storm-software/storm-ops/commit/946a9e59))

## 0.3.0 (2024-05-29)

### Features

- **config:** Added the `cloudflareAccountId` configuration parameter
  ([db4cbd7d](https://github.com/storm-software/storm-ops/commit/db4cbd7d))

### Bug Fixes

- **storm-ops:** Upgrade the monorepo's Nx package versions
  ([29c7e48d](https://github.com/storm-software/storm-ops/commit/29c7e48d))

## 0.2.2 (2024-05-27)

### Bug Fixes

- **deps:** update dependencies-non-major
  ([#145](https://github.com/storm-software/storm-ops/pull/145))

- **deps:** update dependencies-non-major
  ([#159](https://github.com/storm-software/storm-ops/pull/159))

## 0.2.1 (2024-04-29)

### Bug Fixes

- **deps:** update dependencies-non-major
  ([#130](https://github.com/storm-software/storm-ops/pull/130))

## 0.2.0 (2024-04-22)

### Features

- **cloudflare-tools:** Added the `worker`, `init`, and `serve` tools
  ([b4b92c2c](https://github.com/storm-software/storm-ops/commit/b4b92c2c))

### Bug Fixes

- **storm-ops:** Update the Nx versions across packages
  ([29ff17a8](https://github.com/storm-software/storm-ops/commit/29ff17a8))

## 0.1.1 (2024-04-15)

### Bug Fixes

- **deps:** pin dependencies
  ([36d5dd8e](https://github.com/storm-software/storm-ops/commit/36d5dd8e))

## 0.1.0 (2024-04-09)

### Features

- **cloudflare-tools:** Added the `cloudflare-publish` executor
  ([45701720](https://github.com/storm-software/storm-ops/commit/45701720))

## 0.0.7 (2024-04-08)

### Bug Fixes

- **build-tools:** Update the `build` task configuration
  ([31b98d50](https://github.com/storm-software/storm-ops/commit/31b98d50))

## 0.0.6 (2024-04-08)

### Bug Fixes

- **build-tools:** Resolved issue with module types used in build
  ([50a368d3](https://github.com/storm-software/storm-ops/commit/50a368d3))

## 0.0.5 (2024-04-08)

### Bug Fixes

- **cloudflare-tools:** Added plugin code for cloudflare packages
  ([84c95f19](https://github.com/storm-software/storm-ops/commit/84c95f19))

## 0.0.4 (2024-04-08)

### Bug Fixes

- **workspace-tools:** Update module types of imports
  ([9d09009b](https://github.com/storm-software/storm-ops/commit/9d09009b))

## 0.0.3 (2024-04-08)

### Bug Fixes

- **cloudflare-tools:** Update the package to no longer be private
  ([b9a71eba](https://github.com/storm-software/storm-ops/commit/b9a71eba))

- **deps:** pin dependency tslib to 2.6.2
  ([135e0571](https://github.com/storm-software/storm-ops/commit/135e0571))

## 0.0.2 (2024-04-08)

### Bug Fixes

- **deps:** pin dependencies
  ([7406e605](https://github.com/storm-software/storm-ops/commit/7406e605))
