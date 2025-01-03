## 0.45.0 (2024-12-30)

### Features

- **storm-ops:** Completed enhancement around `catalog` and `workspace` dependency upgrades ([5dd13247](https://github.com/storm-software/storm-ops/commit/5dd13247))

### Dependency Upgrades

- **storm-ops:** Moved `c12` and `eslint` dependencies into workspace catalog ([049a350f](https://github.com/storm-software/storm-ops/commit/049a350f))
- **storm-ops:** Added consistent `@types/node` versions across repository ([a569536d](https://github.com/storm-software/storm-ops/commit/a569536d))

## 0.44.1 (2024-12-18)

### Bug Fixes

- **storm-ops:** Resolved issue with ESM resolve error during postinstall script execution ([82389510](https://github.com/storm-software/storm-ops/commit/82389510))

### Dependency Upgrades

- **storm-ops:** Upgrade Nx package to v20.2.2 ([d793912d](https://github.com/storm-software/storm-ops/commit/d793912d))

## 0.44.0 (2024-12-01)

### Features

- **storm-ops:** Added `lint-sherif` script to the CI workflow ([906e0c2b](https://github.com/storm-software/storm-ops/commit/906e0c2b))

## 0.43.0 (2024-11-30)

### Features

- **storm-ops:** Added `sherif` and `knip` linting to CI pipeline ([181d782a](https://github.com/storm-software/storm-ops/commit/181d782a))

## 0.42.0 (2024-11-18)

### Features

- **build-tools:** Allow default package.json exports by no longer overriding them ([f19fc362](https://github.com/storm-software/storm-ops/commit/f19fc362))

## 0.41.1 (2024-11-10)

### Bug Fixes

- **config-tools:** Ensure trace logging is not marked as system logging ([e8dca171](https://github.com/storm-software/storm-ops/commit/e8dca171))

## 0.41.0 (2024-11-08)

### Features

- **build-tools:** Added back cjs build and local package.json dependencies ([d86d3c2a](https://github.com/storm-software/storm-ops/commit/d86d3c2a))

## 0.40.0 (2024-11-07)

### Features

- **config:** Add the `danger` color token ([06dba937](https://github.com/storm-software/storm-ops/commit/06dba937))

## 0.39.0 (2024-11-01)

### Features

- **eslint:** Resolve type issues with Nx plugin in preset ([d27162e2](https://github.com/storm-software/storm-ops/commit/d27162e2))

## 0.38.0 (2024-10-31)

### Features

- **storm-ops:** Upgrade the Nx package versions used in the repository ([369fad24](https://github.com/storm-software/storm-ops/commit/369fad24))

## 0.37.0 (2024-08-03)


### Features

- **eslint:** Ignore `prefer-nullish-coalescing` for strings ([dbae2a58](https://github.com/storm-software/storm-ops/commit/dbae2a58))

## 0.36.0 (2024-08-03)


### Features

- **storm-ops:** Upgrade workspace's Nx package dependencies ([5f31f734](https://github.com/storm-software/storm-ops/commit/5f31f734))

## 0.35.1 (2024-08-03)


### Bug Fixes

- **build-tools:** Resolved issue with the entry name parameter in unbuild config ([f5e5dbdd](https://github.com/storm-software/storm-ops/commit/f5e5dbdd))

## 0.35.0 (2024-08-02)


### Features

- **build-tools:** Update the unbuild configuration to get exports from `package.json` files ([bb2fc78f](https://github.com/storm-software/storm-ops/commit/bb2fc78f))

## 0.34.0 (2024-08-02)


### Features

- **terraform-tools:** Initial check-in of project code ([c4ef4810](https://github.com/storm-software/storm-ops/commit/c4ef4810))

## 0.33.0 (2024-08-02)


### Features

- **eslint:** Reformatted the banner string whitespace ([2df75cbb](https://github.com/storm-software/storm-ops/commit/2df75cbb))

## 0.32.1 (2024-08-02)


### Bug Fixes

- **eslint:** Resolve issue with duplicate plugins ([23c09494](https://github.com/storm-software/storm-ops/commit/23c09494))

## 0.32.0 (2024-08-02)


### Features

- **eslint:** Added a banner with `__filename` and `__dirname` to the distribution ([594c0e9a](https://github.com/storm-software/storm-ops/commit/594c0e9a))

## 0.31.0 (2024-08-02)


### Features

- **eslint:** Improved the logic around determining the banner ([4bbb321d](https://github.com/storm-software/storm-ops/commit/4bbb321d))

## 0.30.0 (2024-08-01)


### Features

- **eslint:** Added the `parserOptions` parameter to the preset's options ([344db07c](https://github.com/storm-software/storm-ops/commit/344db07c))

## 0.29.1 (2024-08-01)


### Bug Fixes

- **eslint:** Resolved issues with invalid TypeScript flat configuration ([88166ab1](https://github.com/storm-software/storm-ops/commit/88166ab1))

## 0.29.0 (2024-08-01)


### Features

- **git-tools:** Ensure `.git/COMMIT_EDITMSG` exists before reading from disk ([7abae7ae](https://github.com/storm-software/storm-ops/commit/7abae7ae))

## 0.28.2 (2024-07-31)


### Bug Fixes

- **git-tools:** Resolved issue when `commitlint` is called without a `message` parameter ([624b24bc](https://github.com/storm-software/storm-ops/commit/624b24bc))

## 0.28.1 (2024-07-31)


### Bug Fixes

- **build-tools:** Resolve issues with the output path provided to unbuild ([ee9c2353](https://github.com/storm-software/storm-ops/commit/ee9c2353))

## 0.28.0 (2024-07-31)


### Features

- **build-tools:** Added the CODEOWNERS linting tool ([63099b1b](https://github.com/storm-software/storm-ops/commit/63099b1b))

## 0.27.3 (2024-07-26)


### Bug Fixes

- **storm-ops:** Resolved issue with missing token in CI action ([4db79d8e](https://github.com/storm-software/storm-ops/commit/4db79d8e))

## 0.27.2 (2024-07-23)


### Bug Fixes

- **workspace-tools:** Removed deprecated input names from configurations ([e713c484](https://github.com/storm-software/storm-ops/commit/e713c484))

## 0.27.1 (2024-07-23)


### Bug Fixes

- **eslint:** Resolve issues with `json` plugin config spread ([088d498a](https://github.com/storm-software/storm-ops/commit/088d498a))

## 0.27.0 (2024-07-23)


### Features

- **eslint:** Remove the `import` plugin from the preset ([6c8551ae](https://github.com/storm-software/storm-ops/commit/6c8551ae))

## 0.26.0 (2024-07-23)


### Features

- **eslint:** Added `import` and `prettier` plugins to preset ([a8084123](https://github.com/storm-software/storm-ops/commit/a8084123))

## 0.25.0 (2024-07-22)


### Features

- **eslint:** Added optional react rules to preset ([bc33a12d](https://github.com/storm-software/storm-ops/commit/bc33a12d))

## 0.24.1 (2024-07-22)


### Bug Fixes

- **git-tools:** Resolved issue with version calculation during release ([97e23127](https://github.com/storm-software/storm-ops/commit/97e23127))

## 0.24.0 (2024-07-22)


### Features

- **eslint:** Added the base eslint preset ([0b2aeea2](https://github.com/storm-software/storm-ops/commit/0b2aeea2))

## 0.23.0 (2024-07-17)

### Features

- **git-tools:** Added README header template to include table of contents
  ([6841042e](https://github.com/storm-software/storm-ops/commit/6841042e))

## 0.22.1 (2024-07-12)

### Bug Fixes

- **eslint-plugin:** Update the typings to correctly export plugin as default
  ([9140b58a](https://github.com/storm-software/storm-ops/commit/9140b58a))

## 0.22.0 (2024-07-09)

### Features

- **eslint-plugin:** Update ESM build to exclude require resolver plugin
  ([48601eb1](https://github.com/storm-software/storm-ops/commit/48601eb1))

## 0.21.0 (2024-06-29)

### Features

- **eslint-plugin:** Polyfill `require` in esm build output
  ([67f1fbab](https://github.com/storm-software/storm-ops/commit/67f1fbab))

## 0.20.0 (2024-06-28)

### Features

- **eslint-plugin:** Update package type to `module` in `package.json` file
  ([36c1c2c9](https://github.com/storm-software/storm-ops/commit/36c1c2c9))

## 0.19.0 (2024-06-26)

### Features

- **eslint-plugin:** No longer provide duplicate require methods
  ([10bf27a6](https://github.com/storm-software/storm-ops/commit/10bf27a6))

## 0.18.0 (2024-06-26)

### Features

- **eslint-plugin:** Include typings in published package
  ([19902d74](https://github.com/storm-software/storm-ops/commit/19902d74))

## 0.17.1 (2024-06-26)

### Bug Fixes

- **eslint-plugin:** Include resolver plugin in package builds
  ([38ab95b2](https://github.com/storm-software/storm-ops/commit/38ab95b2))

## 0.17.0 (2024-06-26)

### Features

- **eslint-plugin:** Bundle storm software packages
  ([f2daca8c](https://github.com/storm-software/storm-ops/commit/f2daca8c))

## 0.16.0 (2024-06-24)

### Features

- **eslint:** Added back `nx` and removed `recommended` base configurations
  ([1661bde9](https://github.com/storm-software/storm-ops/commit/1661bde9))

## 0.15.1 (2024-06-24)

### Bug Fixes

- **storm-ops:** Resolve issue with renovatebot in workflow action
  ([e587423a](https://github.com/storm-software/storm-ops/commit/e587423a))

## 0.15.0 (2024-06-24)

### Features

- **eslint-plugin:** Split up the eslint plugin implementation into separate
  packages
  ([aba11be4](https://github.com/storm-software/storm-ops/commit/aba11be4))

## 0.14.0 (2024-06-22)

### Features

- **workspace-tools:** Enhance the Nx workspace task base configuration
  ([3799d938](https://github.com/storm-software/storm-ops/commit/3799d938))

## 0.13.0 (2024-06-22)

### Features

- **workspace-tools:** Upgrade the workspace pnpm-lock file
  ([d33c20cb](https://github.com/storm-software/storm-ops/commit/d33c20cb))

## 0.12.0 (2024-06-22)

### Features

- **storm-ops:** Updated pnpm-lock file
  ([22be1efd](https://github.com/storm-software/storm-ops/commit/22be1efd))

## 0.11.0 (2024-06-22)

### Features

- **workspace-tools:** Added `lint` and `format` tasks and improved cache input
  management
  ([f2ade202](https://github.com/storm-software/storm-ops/commit/f2ade202))

## 0.10.0 (2024-06-21)

### Features

- **eslint-plugin:** Resolve issues with eslint module types
  ([ca513974](https://github.com/storm-software/storm-ops/commit/ca513974))

## 0.9.2 (2024-06-17)

### Bug Fixes

- **deps:** update patch prod dependencies
  ([ec613e8a](https://github.com/storm-software/storm-ops/commit/ec613e8a))

## 0.9.1 (2024-06-15)

### Bug Fixes

- **storm-ops:** Resolved issue populating the git tag during publishing
  ([9ac9f1be](https://github.com/storm-software/storm-ops/commit/9ac9f1be))

## 0.9.0 (2024-06-10)

### Features

- **eslint:** Updated package configuration back to `ESNext` from `CommonJs`
  ([565143d4](https://github.com/storm-software/storm-ops/commit/565143d4))

### Bug Fixes

- **deps:** pin dependencies
  ([e2f9fcbc](https://github.com/storm-software/storm-ops/commit/e2f9fcbc))

## 0.8.0 (2024-06-09)

### Features

- **eslint:** Add dependencies and convert to `CommonJs` package
  ([bd4bc22c](https://github.com/storm-software/storm-ops/commit/bd4bc22c))

## 0.7.0 (2024-06-09)

### Features

- **eslint:** Change module formats for eslint packages
  ([2be209ea](https://github.com/storm-software/storm-ops/commit/2be209ea))

## 0.6.0 (2024-06-09)

### Features

- **eslint:** Updated markup documentation files
  ([0097f19e](https://github.com/storm-software/storm-ops/commit/0097f19e))

## 0.5.0 (2024-06-09)

### Features

- **eslint:** Update eslint packages to use `CommonJs` instead of `ESNext`
  ([d6a48043](https://github.com/storm-software/storm-ops/commit/d6a48043))

## 0.4.0 (2024-06-08)

### Features

- **eslint:** Converted all eslint configurations to use new flat style
  ([281de429](https://github.com/storm-software/storm-ops/commit/281de429))

## 0.3.2 (2024-06-05)

### Bug Fixes

- **markdownlint:** Resolve issue with bad rules export
  ([7e6e5375](https://github.com/storm-software/storm-ops/commit/7e6e5375))

## 0.3.1 (2024-06-05)

### Bug Fixes

- **eslint-plugin:** Resolve issues with `apply` module syntax
  ([de90c861](https://github.com/storm-software/storm-ops/commit/de90c861))

## 0.3.0 (2024-06-05)

### Features

- **eslint-plugin:** Added the `apply` helper function
  ([ab919d5e](https://github.com/storm-software/storm-ops/commit/ab919d5e))

## 0.2.0 (2024-06-05)

### Features

- **eslint:** Major updates to resolve eslint issues
  ([50e7c988](https://github.com/storm-software/storm-ops/commit/50e7c988))

## 0.1.0 (2024-06-05)

### Features

- **eslint-plugin:** Added the `eslint` and `prittier` base packages
  ([b2d63d0f](https://github.com/storm-software/storm-ops/commit/b2d63d0f))

### Bug Fixes

- **eslint:** Resolve issue with missing dependencies
  ([b0f43454](https://github.com/storm-software/storm-ops/commit/b0f43454))
