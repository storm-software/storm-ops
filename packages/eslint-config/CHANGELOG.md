## 0.46.0 (2024-08-22)


### Features

- **workspace-tools:** Added the `includeApps` option to the Rust and TypeScript plugins ([7bd309f6](https://github.com/storm-software/storm-ops/commit/7bd309f6))

## 0.45.0 (2024-08-03)


### Features

- **eslint:** Ignore `prefer-nullish-coalescing` for strings ([dbae2a58](https://github.com/storm-software/storm-ops/commit/dbae2a58))

## 0.44.0 (2024-08-03)


### Features

- **storm-ops:** Upgrade workspace's Nx package dependencies ([5f31f734](https://github.com/storm-software/storm-ops/commit/5f31f734))

## 0.43.1 (2024-08-03)


### Bug Fixes

- **build-tools:** Resolved issue with the entry name parameter in unbuild config ([f5e5dbdd](https://github.com/storm-software/storm-ops/commit/f5e5dbdd))

## 0.43.0 (2024-08-02)


### Features

- **build-tools:** Update the unbuild configuration to get exports from `package.json` files ([bb2fc78f](https://github.com/storm-software/storm-ops/commit/bb2fc78f))

## 0.42.0 (2024-08-02)


### Features

- **terraform-tools:** Initial check-in of project code ([c4ef4810](https://github.com/storm-software/storm-ops/commit/c4ef4810))

## 0.41.0 (2024-08-02)


### Features

- **eslint:** Reformatted the banner string whitespace ([2df75cbb](https://github.com/storm-software/storm-ops/commit/2df75cbb))

## 0.40.1 (2024-08-02)


### Bug Fixes

- **eslint:** Resolve issue with duplicate plugins ([23c09494](https://github.com/storm-software/storm-ops/commit/23c09494))

## 0.40.0 (2024-08-02)


### Features

- **eslint:** Added a banner with `__filename` and `__dirname` to the distribution ([594c0e9a](https://github.com/storm-software/storm-ops/commit/594c0e9a))

## 0.39.0 (2024-08-02)


### Features

- **eslint:** Improved the logic around determining the banner ([4bbb321d](https://github.com/storm-software/storm-ops/commit/4bbb321d))

## 0.38.0 (2024-08-01)


### Features

- **eslint:** Added the `parserOptions` parameter to the preset's options ([344db07c](https://github.com/storm-software/storm-ops/commit/344db07c))

## 0.37.1 (2024-08-01)


### Bug Fixes

- **eslint:** Resolved issues with invalid TypeScript flat configuration ([88166ab1](https://github.com/storm-software/storm-ops/commit/88166ab1))

## 0.37.0 (2024-08-01)


### Features

- **git-tools:** Ensure `.git/COMMIT_EDITMSG` exists before reading from disk ([7abae7ae](https://github.com/storm-software/storm-ops/commit/7abae7ae))

## 0.36.2 (2024-07-31)


### Bug Fixes

- **git-tools:** Resolved issue when `commitlint` is called without a `message` parameter ([624b24bc](https://github.com/storm-software/storm-ops/commit/624b24bc))

## 0.36.1 (2024-07-31)


### Bug Fixes

- **build-tools:** Resolve issues with the output path provided to unbuild ([ee9c2353](https://github.com/storm-software/storm-ops/commit/ee9c2353))

## 0.36.0 (2024-07-31)


### Features

- **build-tools:** Added the CODEOWNERS linting tool ([63099b1b](https://github.com/storm-software/storm-ops/commit/63099b1b))

## 0.35.1 (2024-07-23)


### Bug Fixes

- **eslint:** Resolve issues with `json` plugin config spread ([088d498a](https://github.com/storm-software/storm-ops/commit/088d498a))

## 0.35.0 (2024-07-23)


### Features

- **eslint:** Remove the `import` plugin from the preset ([6c8551ae](https://github.com/storm-software/storm-ops/commit/6c8551ae))

## 0.34.0 (2024-07-22)


### Features

- **eslint:** Update rules around handling TypeScript function returns ([a9859cd4](https://github.com/storm-software/storm-ops/commit/a9859cd4))

## 0.33.0 (2024-07-22)


### Features

- **eslint:** Added Nx plugin to eslint preset ([1933027f](https://github.com/storm-software/storm-ops/commit/1933027f))

## 0.32.0 (2024-07-22)


### Features

- **eslint:** Add config formatter to eslint preset ([050dadcd](https://github.com/storm-software/storm-ops/commit/050dadcd))

## 0.31.1 (2024-07-22)


### Bug Fixes

- **eslint-config:** Mark the build task as cachable ([a074ad1c](https://github.com/storm-software/storm-ops/commit/a074ad1c))

- **workspace-tools:** Resolve issues with `namedInputs` in base Nx configuration ([879fc147](https://github.com/storm-software/storm-ops/commit/879fc147))


### Continuous Integration

- **eslint-config:** Ensure the `test` task is cachable ([45d7b578](https://github.com/storm-software/storm-ops/commit/45d7b578))

## 0.31.0 (2024-07-19)


### Features

- **config:** Updated `workspaceRoot` with a default value ([5ee3fb09](https://github.com/storm-software/storm-ops/commit/5ee3fb09))

## 0.30.2 (2024-07-19)


### Bug Fixes

- **eslint-config:** Disable the `no-magic-numbers` rule due to excesive false positives ([14097de0](https://github.com/storm-software/storm-ops/commit/14097de0))

## 0.30.1 (2024-07-19)


### Bug Fixes

- **eslint-config:** Adjusted various default rule configurations ([6e0faae5](https://github.com/storm-software/storm-ops/commit/6e0faae5))

## 0.30.0 (2024-07-19)


### Features

- **eslint-config:** Allow props spreading in React components ([803a5cc2](https://github.com/storm-software/storm-ops/commit/803a5cc2))

## 0.29.1 (2024-07-19)


### Bug Fixes

- **eslint-config:** Remove unused `react/jsx-sort-prop-types` rule ([9cfc32b8](https://github.com/storm-software/storm-ops/commit/9cfc32b8))

## 0.29.0 (2024-07-17)


### Features

- **eslint-config:** Enable React component props sorting rules ([45c86e76](https://github.com/storm-software/storm-ops/commit/45c86e76))

## 0.28.0 (2024-07-17)


### Features

- **eslint-config:** Added `.tsx` and `.mdx` as valid JSX files ([25f6478d](https://github.com/storm-software/storm-ops/commit/25f6478d))

## 0.27.0 (2024-07-17)

### Features

- **git-tools:** Added README header template to include table of contents
  ([6841042e](https://github.com/storm-software/storm-ops/commit/6841042e))

## 0.26.0 (2024-07-17)

### Features

- **eslint-config:** Added `eslint-plugin-prettier` recommended configuration
  ([2abcf85a](https://github.com/storm-software/storm-ops/commit/2abcf85a))

## 0.25.0 (2024-07-17)

### Features

- **eslint-config:** Remove the `import/no-unresolved` rule
  ([ec96f648](https://github.com/storm-software/storm-ops/commit/ec96f648))

## 0.24.0 (2024-07-16)

### Features

- **eslint-config:** Update `import/extensions` rule to `never`
  ([27d122cd](https://github.com/storm-software/storm-ops/commit/27d122cd))

## 0.23.0 (2024-07-16)

### Features

- **eslint-config:** Update the import and style rule defaults
  ([74bd6eed](https://github.com/storm-software/storm-ops/commit/74bd6eed))

## 0.22.0 (2024-07-16)

### Features

- **eslint-config:** Regenerated README.md file
  ([d562f7e1](https://github.com/storm-software/storm-ops/commit/d562f7e1))

## 0.21.0 (2024-07-16)

### Features

- **eslint-config:** Fix unused imports and variables automatically
  ([f9443086](https://github.com/storm-software/storm-ops/commit/f9443086))

## 0.20.0 (2024-07-16)

### Features

- **eslint-config:** Warn when code exists before imports in TypeScript files
  ([7d1d4f53](https://github.com/storm-software/storm-ops/commit/7d1d4f53))

## 0.19.0 (2024-07-14)

### Features

- **eslint-config:** Added entry points to the base of the package
  ([a76af4fd](https://github.com/storm-software/storm-ops/commit/a76af4fd))

## 0.18.0 (2024-07-14)

### Features

- **eslint-config:** Update the package name to use a scope
  ([f83f44cc](https://github.com/storm-software/storm-ops/commit/f83f44cc))

## 0.17.0 (2024-07-14)

### Features

- **eslint-config:** Added perfectionist plugins to improve base configuration
  ([d9a3f383](https://github.com/storm-software/storm-ops/commit/d9a3f383))

- **eslint-config:** Separate out the base and extended configurations
  ([e81d9070](https://github.com/storm-software/storm-ops/commit/e81d9070))

## 0.16.0 (2024-07-14)

### Features

- **eslint-config:** Publish the base eslint configuration changes
  ([276ed890](https://github.com/storm-software/storm-ops/commit/276ed890))

## 0.15.0 (2024-07-14)

### Features

- **eslint-config:** Add custom eslint rules based on AirBnB config
  ([f4ce1582](https://github.com/storm-software/storm-ops/commit/f4ce1582))

## 0.14.0 (2024-06-26)

### Features

- **eslint-plugin:** Bundle storm software packages
  ([f2daca8c](https://github.com/storm-software/storm-ops/commit/f2daca8c))

## 0.13.0 (2024-06-24)

### Features

- **eslint:** Added back `nx` and removed `recommended` base configurations
  ([1661bde9](https://github.com/storm-software/storm-ops/commit/1661bde9))

## 0.12.1 (2024-06-24)

### Bug Fixes

- **storm-ops:** Resolve issue with renovatebot in workflow action
  ([e587423a](https://github.com/storm-software/storm-ops/commit/e587423a))

## 0.12.0 (2024-06-24)

### Features

- **eslint-plugin:** Split up the eslint plugin implementation into separate
  packages
  ([aba11be4](https://github.com/storm-software/storm-ops/commit/aba11be4))

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

## 0.7.1 (2024-06-15)

### Bug Fixes

- **storm-ops:** Resolved issue populating the git tag during publishing
  ([9ac9f1be](https://github.com/storm-software/storm-ops/commit/9ac9f1be))

## 0.7.0 (2024-06-10)

### Features

- **eslint:** Updated package configuration back to `ESNext` from `CommonJs`
  ([565143d4](https://github.com/storm-software/storm-ops/commit/565143d4))

### Bug Fixes

- **deps:** pin dependencies
  ([e2f9fcbc](https://github.com/storm-software/storm-ops/commit/e2f9fcbc))

## 0.6.0 (2024-06-09)

### Features

- **eslint:** Add dependencies and convert to `CommonJs` package
  ([bd4bc22c](https://github.com/storm-software/storm-ops/commit/bd4bc22c))

## 0.5.0 (2024-06-09)

### Features

- **eslint:** Change module formats for eslint packages
  ([2be209ea](https://github.com/storm-software/storm-ops/commit/2be209ea))

## 0.4.0 (2024-06-09)

### Features

- **eslint:** Updated markup documentation files
  ([0097f19e](https://github.com/storm-software/storm-ops/commit/0097f19e))

## 0.3.0 (2024-06-09)

### Features

- **eslint:** Update eslint packages to use `CommonJs` instead of `ESNext`
  ([d6a48043](https://github.com/storm-software/storm-ops/commit/d6a48043))

## 0.2.0 (2024-06-08)

### Features

- **eslint-config:** Renamed the `eslint-config-storm-software` package to avoid
  conflicts
  ([3ff32ab0](https://github.com/storm-software/storm-ops/commit/3ff32ab0))

- **eslint:** Added the `ignores` module to include in ESLint configurations
  ([7ba523b0](https://github.com/storm-software/storm-ops/commit/7ba523b0))

- **eslint:** Converted all eslint configurations to use new flat style
  ([281de429](https://github.com/storm-software/storm-ops/commit/281de429))

## 0.1.0 (2024-06-06)

### Features

- **eslint-config:** Added a package to share the base Storm ESLint
  configuration
  ([af128ebd](https://github.com/storm-software/storm-ops/commit/af128ebd))
