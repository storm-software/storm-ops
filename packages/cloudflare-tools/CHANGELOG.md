## 0.20.2 (2024-07-31)


### Bug Fixes

- **git-tools:** Resolved issue when `commitlint` is called without a `message` parameter ([624b24bc](https://github.com/storm-software/storm-ops/commit/624b24bc))

## 0.20.1 (2024-07-31)


### Bug Fixes

- **build-tools:** Resolve issues with the output path provided to unbuild ([ee9c2353](https://github.com/storm-software/storm-ops/commit/ee9c2353))

## 0.20.0 (2024-07-31)


### Features

- **build-tools:** Added the CODEOWNERS linting tool ([63099b1b](https://github.com/storm-software/storm-ops/commit/63099b1b))

## 0.19.1 (2024-07-31)


### Bug Fixes

- **build-tools:** Remove unused plugin from unbuild ([ad8a5991](https://github.com/storm-software/storm-ops/commit/ad8a5991))

## 0.19.0 (2024-07-31)


### Features

- **create-storm-workspace:** Configure workspace to include GitHub ([eea71de7](https://github.com/storm-software/storm-ops/commit/eea71de7))

## 0.18.0 (2024-07-30)


### Features

- **eslint:** Added the header plugin ([cc0cbbea](https://github.com/storm-software/storm-ops/commit/cc0cbbea))

- **eslint:** Removed invalid JSON configuration from package ([2622ee7e](https://github.com/storm-software/storm-ops/commit/2622ee7e))

## 0.17.1 (2024-07-23)


### Bug Fixes

- **eslint:** Resolve issues with `json` plugin config spread ([088d498a](https://github.com/storm-software/storm-ops/commit/088d498a))

## 0.17.0 (2024-07-23)


### Features

- **eslint:** Remove the `import` plugin from the preset ([6c8551ae](https://github.com/storm-software/storm-ops/commit/6c8551ae))

## 0.16.0 (2024-07-22)


### Features

- **eslint:** Update rules around handling TypeScript function returns ([a9859cd4](https://github.com/storm-software/storm-ops/commit/a9859cd4))

## 0.15.0 (2024-07-22)


### Features

- **eslint:** Added Nx plugin to eslint preset ([1933027f](https://github.com/storm-software/storm-ops/commit/1933027f))

## 0.14.0 (2024-07-22)


### Features

- **eslint:** Add config formatter to eslint preset ([050dadcd](https://github.com/storm-software/storm-ops/commit/050dadcd))

## 0.13.1 (2024-07-22)


### Bug Fixes

- **storm-ops:** Resolved issue with cross-project typings ([aed5a357](https://github.com/storm-software/storm-ops/commit/aed5a357))


### Continuous Integration

- **storm-ops:** Resolve permissions issue in CI action ([2dd8c79e](https://github.com/storm-software/storm-ops/commit/2dd8c79e))

- **eslint:** Update `build` tasks to be cachable ([f24e2897](https://github.com/storm-software/storm-ops/commit/f24e2897))

## 0.13.0 (2024-07-19)


### Features

- **cloudflare-tools:** Added project tag functionality to plugin ([ef83e214](https://github.com/storm-software/storm-ops/commit/ef83e214))


### Documentation

- **storm-ops:** Remove emojis from monorepo CHANGELOG files ([441b36b1](https://github.com/storm-software/storm-ops/commit/441b36b1))


### Continuous Integration

- **storm-ops:** Update the lefthook configuration to properly glob staged files ([366dc251](https://github.com/storm-software/storm-ops/commit/366dc251))

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
