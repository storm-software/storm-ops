## 0.63.1 (2024-08-31)


### Bug Fixes

- **build-tools:** Added try/catch to utility function ([3ce4a7cd](https://github.com/storm-software/storm-ops/commit/3ce4a7cd))

## 0.63.0 (2024-08-31)


### Features

- **eslint:** Update linting rules to ignore the length of commands and use double quotes ([f9c603d7](https://github.com/storm-software/storm-ops/commit/f9c603d7))

## 0.62.5 (2024-08-31)


### Bug Fixes

- **terraform-modules:** Resolve issue with output variable name ([dd5b63fb](https://github.com/storm-software/storm-ops/commit/dd5b63fb))

## 0.62.4 (2024-08-31)


### Bug Fixes

- **terraform-modules:** Resolved issue with conditional statement syntax ([c96e9a9e](https://github.com/storm-software/storm-ops/commit/c96e9a9e))

## 0.62.3 (2024-08-30)


### Bug Fixes

- **terraform-modules:** Added default values for `full_name` variables ([8779001e](https://github.com/storm-software/storm-ops/commit/8779001e))

## 0.62.2 (2024-08-29)


### Bug Fixes

- **workspace-tools:** Ensure the `preVersionCommand` property is correct ([9d089852](https://github.com/storm-software/storm-ops/commit/9d089852))

## 0.62.1 (2024-08-29)


### Bug Fixes

- **workspace-tools:** Resolved issue with multi-layer extends in Nx configurations ([9cb9d2ff](https://github.com/storm-software/storm-ops/commit/9cb9d2ff))

## 0.62.0 (2024-08-29)


### Features

- **workspace-tools:** Added `nx-default.json` and `nx-cloud.json` files ([4bb13faa](https://github.com/storm-software/storm-ops/commit/4bb13faa))

## 0.61.2 (2024-08-27)


### Bug Fixes

- **k8s-tools:** Resolved issue with invalid import ([82a782d4](https://github.com/storm-software/storm-ops/commit/82a782d4))

## 0.61.1 (2024-08-27)


### Bug Fixes

- **k8s-tools:** Resolved issue invoking generator functions ([405367cb](https://github.com/storm-software/storm-ops/commit/405367cb))

## 0.61.0 (2024-08-27)


### Features

- **workspace-tools:** Added Cargo executors for build, check, doc, clippy, and format ([52ffcec8](https://github.com/storm-software/storm-ops/commit/52ffcec8))

## 0.60.2 (2024-08-26)


### Bug Fixes

- **workspace-tools:** Resolved issues with the lint configuration files ([9f7d724c](https://github.com/storm-software/storm-ops/commit/9f7d724c))

## 0.60.1 (2024-08-26)


### Bug Fixes

- **workspace-tools:** Ensure the `publish` Cargo property is handled correctly ([67dd03a0](https://github.com/storm-software/storm-ops/commit/67dd03a0))

## 0.60.0 (2024-08-22)


### Features

- **workspace-tools:** Added the `includeApps` option to the Rust and TypeScript plugins ([7bd309f6](https://github.com/storm-software/storm-ops/commit/7bd309f6))

## 0.59.1 (2024-08-09)


### Bug Fixes

- **storm-ops:** Force a CI re-run ([f287c018](https://github.com/storm-software/storm-ops/commit/f287c018))

## 0.59.0 (2024-08-04)


### Features

- **eslint:** Added new base rules to the preset ([5a5c9253](https://github.com/storm-software/storm-ops/commit/5a5c9253))

## 0.58.0 (2024-08-04)


### Features

- **eslint:** Added the React `version` settings to preset ([42df9e8d](https://github.com/storm-software/storm-ops/commit/42df9e8d))

## 0.57.0 (2024-08-04)


### Features

- **config:** Added the `docs` and `licensing` options to the Storm configuration ([c867efe1](https://github.com/storm-software/storm-ops/commit/c867efe1))

- **config:** Updated default `brand` color and added proper URLs to file banners ([008e6ef4](https://github.com/storm-software/storm-ops/commit/008e6ef4))


### Bug Fixes

- **build-tools:** Resolve issues with logic in `outExtension` utility function ([8cdc691b](https://github.com/storm-software/storm-ops/commit/8cdc691b))

## 0.56.0 (2024-08-03)


### Features

- **eslint:** Ignore `prefer-nullish-coalescing` for strings ([dbae2a58](https://github.com/storm-software/storm-ops/commit/dbae2a58))

## 0.55.0 (2024-08-03)


### Features

- **build-tools:** Add back experimental DTS option to TSUP ([4fe9652b](https://github.com/storm-software/storm-ops/commit/4fe9652b))

## 0.54.0 (2024-08-03)


### Features

- **storm-ops:** Upgrade workspace's Nx package dependencies ([5f31f734](https://github.com/storm-software/storm-ops/commit/5f31f734))

## 0.53.0 (2024-08-03)


### Features

- **eslint:** Added the `cspell` plugin to the preset ([ef88e99c](https://github.com/storm-software/storm-ops/commit/ef88e99c))


### Bug Fixes

- **build-tools:** Resolved issue with the entry name parameter in unbuild config ([f5e5dbdd](https://github.com/storm-software/storm-ops/commit/f5e5dbdd))

- **eslint:** Resolved issue applying `recommended` CSpell configuration ([dea7eecb](https://github.com/storm-software/storm-ops/commit/dea7eecb))

- **eslint:** Resolve issue with invalid rule configuration ([cdc5d81f](https://github.com/storm-software/storm-ops/commit/cdc5d81f))

## 0.52.0 (2024-08-02)


### Features

- **build-tools:** Update the unbuild configuration to get exports from `package.json` files ([bb2fc78f](https://github.com/storm-software/storm-ops/commit/bb2fc78f))

## 0.51.0 (2024-08-02)


### Features

- **terraform-tools:** Initial check-in of project code ([c4ef4810](https://github.com/storm-software/storm-ops/commit/c4ef4810))

## 0.50.1 (2024-08-02)


### Bug Fixes

- **build-tools:** Update the base path of the unbuild input files ([4551640c](https://github.com/storm-software/storm-ops/commit/4551640c))

## 0.50.0 (2024-08-02)


### Features

- **eslint:** Reformatted the banner string whitespace ([2df75cbb](https://github.com/storm-software/storm-ops/commit/2df75cbb))


### Bug Fixes

- **build-tools:** Remove the unused variables in the updated code ([b01c4999](https://github.com/storm-software/storm-ops/commit/b01c4999))

## 0.49.0 (2024-08-02)


### Features

- **eslint:** Added the `name` and `banner` options to format banner from preset ([ee542ed6](https://github.com/storm-software/storm-ops/commit/ee542ed6))

## 0.48.1 (2024-08-02)


### Bug Fixes

- **eslint:** Resolve issue with duplicate plugins ([23c09494](https://github.com/storm-software/storm-ops/commit/23c09494))

## 0.48.0 (2024-08-02)


### Features

- **eslint:** Added typing file for ESLint rules used by preset ([821637e2](https://github.com/storm-software/storm-ops/commit/821637e2))

## 0.47.0 (2024-08-02)


### Features

- **eslint:** Added a banner with `__filename` and `__dirname` to the distribution ([594c0e9a](https://github.com/storm-software/storm-ops/commit/594c0e9a))

## 0.46.0 (2024-08-02)


### Features

- **eslint:** Update the build process to include the preset declaration file ([1b5fe953](https://github.com/storm-software/storm-ops/commit/1b5fe953))

## 0.45.0 (2024-08-02)


### Features

- **eslint:** Improved the logic around determining the banner ([4bbb321d](https://github.com/storm-software/storm-ops/commit/4bbb321d))

## 0.44.1 (2024-08-01)


### Bug Fixes

- **eslint:** Resolve issue with invalid path definition ([be930a74](https://github.com/storm-software/storm-ops/commit/be930a74))

## 0.44.0 (2024-08-01)


### Features

- **eslint:** Added the `parserOptions` parameter to the preset's options ([344db07c](https://github.com/storm-software/storm-ops/commit/344db07c))

## 0.43.0 (2024-08-01)


### Features

- **eslint:** Added JSX parser options when `react` is enabled ([2700e009](https://github.com/storm-software/storm-ops/commit/2700e009))

## 0.42.1 (2024-08-01)


### Bug Fixes

- **eslint:** Resolved issues with invalid TypeScript flat configuration ([88166ab1](https://github.com/storm-software/storm-ops/commit/88166ab1))

## 0.42.0 (2024-08-01)


### Features

- **eslint:** Added initial typinges for the distribution package ([5a6a9dd1](https://github.com/storm-software/storm-ops/commit/5a6a9dd1))


### Bug Fixes

- **eslint:** Resolve issues with build configuration ([caab1ce5](https://github.com/storm-software/storm-ops/commit/caab1ce5))

## 0.41.0 (2024-08-01)


### Features

- **git-tools:** Ensure `.git/COMMIT_EDITMSG` exists before reading from disk ([7abae7ae](https://github.com/storm-software/storm-ops/commit/7abae7ae))

## 0.40.0 (2024-08-01)


### Features

- **git-tools:** Update `commitlint` to warn users when no commit message is provided instead of throwing errors ([04942ee2](https://github.com/storm-software/storm-ops/commit/04942ee2))

## 0.39.3 (2024-07-31)


### Bug Fixes

- **git-tools:** Resolved issue when `commitlint` is called without a `message` parameter ([624b24bc](https://github.com/storm-software/storm-ops/commit/624b24bc))

## 0.39.2 (2024-07-31)


### Bug Fixes

- **build-tools:** Resolved issue iterating unbuild entry files ([17703513](https://github.com/storm-software/storm-ops/commit/17703513))

## 0.39.1 (2024-07-31)


### Bug Fixes

- **build-tools:** Resolve issues with the output path provided to unbuild ([ee9c2353](https://github.com/storm-software/storm-ops/commit/ee9c2353))

## 0.39.0 (2024-07-31)


### Features

- **git-tools:** Added the `commitlint` git tools ([250875e7](https://github.com/storm-software/storm-ops/commit/250875e7))

## 0.38.0 (2024-07-31)


### Features

- **build-tools:** Added the CODEOWNERS linting tool ([63099b1b](https://github.com/storm-software/storm-ops/commit/63099b1b))

## 0.37.0 (2024-07-31)


### Features

- **build-tools:** Added a hook prior to `mkdist` to set custom options ([5c15681b](https://github.com/storm-software/storm-ops/commit/5c15681b))

## 0.36.2 (2024-07-31)


### Bug Fixes

- **build-tools:** Update unbuild configuration to include proper `rootDir` option ([11e7f38b](https://github.com/storm-software/storm-ops/commit/11e7f38b))

## 0.36.1 (2024-07-31)


### Bug Fixes

- **eslint:** Resolved issues applying `unicorn` rules ([b2be1a4d](https://github.com/storm-software/storm-ops/commit/b2be1a4d))

- **eslint:** Ensure rules are spread correctly ([321435c8](https://github.com/storm-software/storm-ops/commit/321435c8))

- **build-tools:** Remove unused plugin from unbuild ([ad8a5991](https://github.com/storm-software/storm-ops/commit/ad8a5991))

## 0.36.0 (2024-07-31)


### Features

- **eslint:** Include all TypeScript rules in preset ([e5b913b1](https://github.com/storm-software/storm-ops/commit/e5b913b1))


### Bug Fixes

- **eslint:** Resolved issue with configuration spread ([c0adeb60](https://github.com/storm-software/storm-ops/commit/c0adeb60))

## 0.35.0 (2024-07-31)


### Features

- **eslint:** Update the `banner/banner` eslint rule to include default options ([d952ac65](https://github.com/storm-software/storm-ops/commit/d952ac65))

## 0.34.0 (2024-07-31)


### Features

- **create-storm-workspace:** Configure workspace to include GitHub ([eea71de7](https://github.com/storm-software/storm-ops/commit/eea71de7))

## 0.33.0 (2024-07-30)


### Features

- **eslint:** Split out the `banner` plugin code ([f49ff5fe](https://github.com/storm-software/storm-ops/commit/f49ff5fe))

## 0.32.0 (2024-07-30)

### Features

- **eslint:** Added the header plugin
  ([cc0cbbea](https://github.com/storm-software/storm-ops/commit/cc0cbbea))

- **eslint:** Removed invalid JSON configuration from package
  ([2622ee7e](https://github.com/storm-software/storm-ops/commit/2622ee7e))

### Continuous Integration

- **storm-ops:** Update actions to skip CodeQL when auto-updating dependencies
  ([29b6b604](https://github.com/storm-software/storm-ops/commit/29b6b604))

## 0.31.2 (2024-07-28)

### Bug Fixes

- **eslint:** Resolved the issues with the provided globals
  ([62094231](https://github.com/storm-software/storm-ops/commit/62094231))

## 0.31.1 (2024-07-28)

### Bug Fixes

- **build-tools:** Resolve issues checking dependency node types
  ([15517428](https://github.com/storm-software/storm-ops/commit/15517428))

## 0.31.0 (2024-07-28)

### Features

- **eslint:** Update `class-methods-use-this` rule to be off
  ([480f4fa3](https://github.com/storm-software/storm-ops/commit/480f4fa3))

## 0.30.0 (2024-07-26)

### Features

- **eslint:** Remove the `unicorn/prefer-logical-operator-over-ternary` rule
  from linting
  ([84b84b73](https://github.com/storm-software/storm-ops/commit/84b84b73))

- **eslint:** Update the `unicorn/prefer-logical-operator-over-ternary` rule to
  warn ([31de2fe9](https://github.com/storm-software/storm-ops/commit/31de2fe9))

## 0.29.0 (2024-07-26)

### Features

- **eslint:** Update the `tsdocs/syntax` to warn instead of error
  ([5da2f059](https://github.com/storm-software/storm-ops/commit/5da2f059))

## 0.28.1 (2024-07-26)

### Bug Fixes

- **storm-ops:** Resolved issue with missing token in CI action
  ([4db79d8e](https://github.com/storm-software/storm-ops/commit/4db79d8e))

## 0.28.0 (2024-07-23)

### Features

- **eslint:** Added dependency-checks rule to preset
  ([bbad6d50](https://github.com/storm-software/storm-ops/commit/bbad6d50))

## 0.27.0 (2024-07-23)

### Features

- **eslint:** Add the `json` and `yml` plugins to preset
  ([27310d44](https://github.com/storm-software/storm-ops/commit/27310d44))

### Bug Fixes

- **eslint:** Resolve issues with `json` plugin config spread
  ([088d498a](https://github.com/storm-software/storm-ops/commit/088d498a))

## 0.26.1 (2024-07-23)

### Bug Fixes

- **eslint:** Resolve issue with handler props naming and unicorn defaults
  ([31333a6a](https://github.com/storm-software/storm-ops/commit/31333a6a))

## 0.26.0 (2024-07-23)

### Features

- **prettier:** Export default `config.json` and `tailwindcss.json` from package
  ([c8711a52](https://github.com/storm-software/storm-ops/commit/c8711a52))

## 0.25.0 (2024-07-23)

### Features

- **eslint:** Remove the `import` plugin from the preset
  ([6c8551ae](https://github.com/storm-software/storm-ops/commit/6c8551ae))

## 0.24.0 (2024-07-23)

### Features

- **eslint:** Added `import` and `prettier` plugins to preset
  ([a8084123](https://github.com/storm-software/storm-ops/commit/a8084123))

- **eslint:** Resolved issues with legacy import plugin
  ([ff2ff86e](https://github.com/storm-software/storm-ops/commit/ff2ff86e))

## 0.23.0 (2024-07-22)

### Features

- **eslint:** Update rules around handling TypeScript function returns
  ([a9859cd4](https://github.com/storm-software/storm-ops/commit/a9859cd4))

## 0.22.0 (2024-07-22)

### Features

- **eslint:** Added optional react rules to preset
  ([bc33a12d](https://github.com/storm-software/storm-ops/commit/bc33a12d))

## 0.21.0 (2024-07-22)

### Features

- **eslint:** Added Nx plugin to eslint preset
  ([1933027f](https://github.com/storm-software/storm-ops/commit/1933027f))

## 0.20.1 (2024-07-22)

### Bug Fixes

- **git-tools:** Resolved issue with version calculation during release
  ([97e23127](https://github.com/storm-software/storm-ops/commit/97e23127))

## 0.20.0 (2024-07-22)

### Features

- **eslint:** Add config formatter to eslint preset
  ([050dadcd](https://github.com/storm-software/storm-ops/commit/050dadcd))

## 0.19.0 (2024-07-22)

### Features

- **eslint:** Added the base eslint preset
  ([0b2aeea2](https://github.com/storm-software/storm-ops/commit/0b2aeea2))

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

## 0.9.3 (2024-06-17)

### Bug Fixes

- **deps:** update patch prod dependencies
  ([ec613e8a](https://github.com/storm-software/storm-ops/commit/ec613e8a))

## 0.9.2 (2024-06-15)

### Bug Fixes

- **workspace-tools:** Resolved issue with invalid package name in tags
  ([e40b5387](https://github.com/storm-software/storm-ops/commit/e40b5387))

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

- **eslint:** Added the `ignores` module to include in ESLint configurations
  ([7ba523b0](https://github.com/storm-software/storm-ops/commit/7ba523b0))

- **eslint:** Converted all eslint configurations to use new flat style
  ([281de429](https://github.com/storm-software/storm-ops/commit/281de429))

## 0.3.0 (2024-06-06)

### Features

- **eslint-config:** Added a package to share the base Storm ESLint
  configuration
  ([af128ebd](https://github.com/storm-software/storm-ops/commit/af128ebd))

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

- **eslint:** Update the `package.json` versions
  ([36a9a82b](https://github.com/storm-software/storm-ops/commit/36a9a82b))

- **storm-ops:** Turn off the Nx daemon
  ([e844cc0a](https://github.com/storm-software/storm-ops/commit/e844cc0a))
