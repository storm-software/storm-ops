## 0.27.0 (2024-12-30)

### Features

- **storm-ops:** Completed enhancement around `catalog` and `workspace` dependency upgrades ([5dd13247](https://github.com/storm-software/storm-ops/commit/5dd13247))
- **storm-ops:** Added pnpm `catalog` dependency specification to the monorepo ([b8e6a6e0](https://github.com/storm-software/storm-ops/commit/b8e6a6e0))

### Dependency Upgrades

- **storm-ops:** Moved `c12` and `eslint` dependencies into workspace catalog ([049a350f](https://github.com/storm-software/storm-ops/commit/049a350f))
- **storm-ops:** Added consistent `@types/node` versions across repository ([a569536d](https://github.com/storm-software/storm-ops/commit/a569536d))

## 0.26.1 (2024-12-18)

### Bug Fixes

- **storm-ops:** Resolved issue with ESM resolve error during postinstall script execution ([82389510](https://github.com/storm-software/storm-ops/commit/82389510))

## 0.26.0 (2024-08-03)


### Features

- **eslint:** Ignore `prefer-nullish-coalescing` for strings ([dbae2a58](https://github.com/storm-software/storm-ops/commit/dbae2a58))

## 0.25.0 (2024-08-03)


### Features

- **storm-ops:** Upgrade workspace's Nx package dependencies ([5f31f734](https://github.com/storm-software/storm-ops/commit/5f31f734))

## 0.24.1 (2024-08-03)


### Bug Fixes

- **build-tools:** Resolved issue with the entry name parameter in unbuild config ([f5e5dbdd](https://github.com/storm-software/storm-ops/commit/f5e5dbdd))

## 0.24.0 (2024-08-02)


### Features

- **build-tools:** Update the unbuild configuration to get exports from `package.json` files ([bb2fc78f](https://github.com/storm-software/storm-ops/commit/bb2fc78f))

## 0.23.0 (2024-08-02)


### Features

- **terraform-tools:** Initial check-in of project code ([c4ef4810](https://github.com/storm-software/storm-ops/commit/c4ef4810))

## 0.22.0 (2024-08-02)


### Features

- **eslint:** Reformatted the banner string whitespace ([2df75cbb](https://github.com/storm-software/storm-ops/commit/2df75cbb))

## 0.21.1 (2024-08-02)


### Bug Fixes

- **eslint:** Resolve issue with duplicate plugins ([23c09494](https://github.com/storm-software/storm-ops/commit/23c09494))

## 0.21.0 (2024-08-02)


### Features

- **eslint:** Added a banner with `__filename` and `__dirname` to the distribution ([594c0e9a](https://github.com/storm-software/storm-ops/commit/594c0e9a))

## 0.20.0 (2024-08-02)


### Features

- **eslint:** Improved the logic around determining the banner ([4bbb321d](https://github.com/storm-software/storm-ops/commit/4bbb321d))

## 0.19.0 (2024-08-01)


### Features

- **eslint:** Added the `parserOptions` parameter to the preset's options ([344db07c](https://github.com/storm-software/storm-ops/commit/344db07c))

## 0.18.1 (2024-08-01)


### Bug Fixes

- **eslint:** Resolved issues with invalid TypeScript flat configuration ([88166ab1](https://github.com/storm-software/storm-ops/commit/88166ab1))

## 0.18.0 (2024-08-01)


### Features

- **git-tools:** Ensure `.git/COMMIT_EDITMSG` exists before reading from disk ([7abae7ae](https://github.com/storm-software/storm-ops/commit/7abae7ae))

## 0.17.2 (2024-07-31)


### Bug Fixes

- **git-tools:** Resolved issue when `commitlint` is called without a `message` parameter ([624b24bc](https://github.com/storm-software/storm-ops/commit/624b24bc))

## 0.17.1 (2024-07-31)


### Bug Fixes

- **build-tools:** Resolve issues with the output path provided to unbuild ([ee9c2353](https://github.com/storm-software/storm-ops/commit/ee9c2353))

## 0.17.0 (2024-07-31)


### Features

- **build-tools:** Added the CODEOWNERS linting tool ([63099b1b](https://github.com/storm-software/storm-ops/commit/63099b1b))

## 0.16.1 (2024-07-31)


### Bug Fixes

- **build-tools:** Remove unused plugin from unbuild ([ad8a5991](https://github.com/storm-software/storm-ops/commit/ad8a5991))

## 0.16.0 (2024-07-31)


### Features

- **create-storm-workspace:** Configure workspace to include GitHub ([eea71de7](https://github.com/storm-software/storm-ops/commit/eea71de7))

## 0.15.0 (2024-07-30)


### Features

- **eslint:** Removed invalid JSON configuration from package ([2622ee7e](https://github.com/storm-software/storm-ops/commit/2622ee7e))

## 0.14.0 (2024-07-29)


### Features

- **build-tools:** Update unbuild process to use the `tsconfck` package ([d0e4dbf6](https://github.com/storm-software/storm-ops/commit/d0e4dbf6))

## 0.13.0 (2024-07-29)


### Features

- **config:** Added the `brand2` and `brand3` color tokens ([58705631](https://github.com/storm-software/storm-ops/commit/58705631))

## 0.12.0 (2024-07-29)

### Features

- **prettier:** Added `prettier-plugin-solidity` configuration
  ([2f20befd](https://github.com/storm-software/storm-ops/commit/2f20befd))

## 0.11.1 (2024-07-23)

### Bug Fixes

- **eslint:** Resolve issues with `json` plugin config spread
  ([088d498a](https://github.com/storm-software/storm-ops/commit/088d498a))

## 0.11.0 (2024-07-23)

### Features

- **prettier:** Export default `config.json` and `tailwindcss.json` from package
  ([c8711a52](https://github.com/storm-software/storm-ops/commit/c8711a52))

## 0.10.0 (2024-07-23)

### Features

- **prettier:** Added the `prettier-plugin-organize-imports` plugin
  ([1f7b24ee](https://github.com/storm-software/storm-ops/commit/1f7b24ee))

## 0.9.0 (2024-07-16)

### Features

- **prettier:** Added TailwindCSS configuration json

([0fc2558a](https://github.com/storm-software/storm-ops/commit/0fc2558a))

## 0.8.0 (2024-07-16)

### Features

- **prettier:** Added a separate configuration json for import sorting

([c29219a4](https://github.com/storm-software/storm-ops/commit/c29219a4))

## 0.7.0 (2024-07-16)

### Features

- **prettier:** Remove duplicate import sorting plugin

([bcb27e5a](https://github.com/storm-software/storm-ops/commit/bcb27e5a))

## 0.6.0 (2024-07-14)

### Features

- **markdownlint:** Added markdownlint v1 json configuration

([9fbd4fd0](https://github.com/storm-software/storm-ops/commit/9fbd4fd0))

## 0.5.0 (2024-06-22)

### Features

- **workspace-tools:** Added `lint` and `format` tasks and improved cache input

management
([f2ade202](https://github.com/storm-software/storm-ops/commit/f2ade202))

## 0.4.0 (2024-06-21)

### Features

- **eslint-plugin:** Resolve issues with eslint module types

([ca513974](https://github.com/storm-software/storm-ops/commit/ca513974))

## 0.3.0 (2024-06-17)

### Features

- **git-tools:** Add proper export values to package and resolve type issues

([46f45709](https://github.com/storm-software/storm-ops/commit/46f45709))

## 0.2.2 (2024-06-17)

### Bug Fixes

- **deps:** update patch prod dependencies

([ec613e8a](https://github.com/storm-software/storm-ops/commit/ec613e8a))

## 0.2.1 (2024-06-10)

### Bug Fixes

- **deps:** pin dependencies

([e2f9fcbc](https://github.com/storm-software/storm-ops/commit/e2f9fcbc))

## 0.2.0 (2024-06-05)

### Features

- **eslint-plugin:** Added the `apply` helper function

([ab919d5e](https://github.com/storm-software/storm-ops/commit/ab919d5e))

## 0.1.0 (2024-06-05)

### Features

- **eslint-plugin:** Added the `eslint` and `prittier` base packages

([b2d63d0f](https://github.com/storm-software/storm-ops/commit/b2d63d0f))

- **workspace-tools:** Update `preset` generator with Storm `eslint-plugin` and

`prettier` config
([24ae7683](https://github.com/storm-software/storm-ops/commit/24ae7683))
