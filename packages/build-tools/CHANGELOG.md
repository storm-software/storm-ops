## 0.65.0 (2024-08-09)


### Features

- **storm-ops:** Update the workflows to send requests to Telegram ([65332dd0](https://github.com/storm-software/storm-ops/commit/65332dd0))

- **build-tools:** Reformat the TSUP build files ([f9cdbdcc](https://github.com/storm-software/storm-ops/commit/f9cdbdcc))


### Bug Fixes

- **build-tools:** Resolved issues with TypeScript libraries paths provided to TSUP build ([44628c89](https://github.com/storm-software/storm-ops/commit/44628c89))

- **workspace-tools:** Resolve issue with call signature to executors ([36ad985a](https://github.com/storm-software/storm-ops/commit/36ad985a))

## 0.64.0 (2024-08-04)


### Features

- **build-tools:** Add `typeRoots` and find TypeScript library definition files prior to TSUP build ([635833ed](https://github.com/storm-software/storm-ops/commit/635833ed))

## 0.63.0 (2024-08-04)


### Features

- **config:** Added the `docs` and `licensing` options to the Storm configuration ([c867efe1](https://github.com/storm-software/storm-ops/commit/c867efe1))


### Bug Fixes

- **build-tools:** Resolve issues with logic in `outExtension` utility function ([8cdc691b](https://github.com/storm-software/storm-ops/commit/8cdc691b))

## 0.62.0 (2024-08-03)


### Features

- **eslint:** Ignore `prefer-nullish-coalescing` for strings ([dbae2a58](https://github.com/storm-software/storm-ops/commit/dbae2a58))

## 0.61.0 (2024-08-03)


### Features

- **build-tools:** Add back experimental DTS option to TSUP ([4fe9652b](https://github.com/storm-software/storm-ops/commit/4fe9652b))

## 0.60.0 (2024-08-03)


### Features

- **storm-ops:** Upgrade workspace's Nx package dependencies ([5f31f734](https://github.com/storm-software/storm-ops/commit/5f31f734))

## 0.59.0 (2024-08-03)


### Features

- **build-tools:** Add tsup build's rollup helpers ([27ecd4e6](https://github.com/storm-software/storm-ops/commit/27ecd4e6))


### Bug Fixes

- **build-tools:** Resolve issue with invalid return paths ([0f9f5b1f](https://github.com/storm-software/storm-ops/commit/0f9f5b1f))

## 0.58.0 (2024-08-03)


### Features

- **build-tools:** Enable `dts` instead of `experimentalDts` for TSUP build ([0655517a](https://github.com/storm-software/storm-ops/commit/0655517a))


### Bug Fixes

- **build-tools:** Resolved issue with the entry name parameter in unbuild config ([f5e5dbdd](https://github.com/storm-software/storm-ops/commit/f5e5dbdd))

## 0.57.0 (2024-08-02)


### Features

- **build-tools:** Added back the export statements to unbuild configuration ([5fb63682](https://github.com/storm-software/storm-ops/commit/5fb63682))

## 0.56.0 (2024-08-02)


### Features

- **build-tools:** Update the unbuild configuration to get exports from `package.json` files ([bb2fc78f](https://github.com/storm-software/storm-ops/commit/bb2fc78f))

## 0.55.0 (2024-08-02)


### Features

- **build-tools:** Populate the distribution's package.json with `exports` based on project structure ([cf0eed52](https://github.com/storm-software/storm-ops/commit/cf0eed52))

## 0.54.0 (2024-08-02)


### Features

- **terraform-tools:** Initial check-in of project code ([c4ef4810](https://github.com/storm-software/storm-ops/commit/c4ef4810))

- **build-tools:** Added `failOnWarn` parameter to unbuild configuration ([ba28050d](https://github.com/storm-software/storm-ops/commit/ba28050d))

- **terraform-tools:** Update build to exclude other storm package from the distribution ([96294aac](https://github.com/storm-software/storm-ops/commit/96294aac))

## 0.53.4 (2024-08-02)


### Bug Fixes

- **create-storm-workspace:** Upgrade the package.json to include `peerDependencies` ([f15d7eb4](https://github.com/storm-software/storm-ops/commit/f15d7eb4))

## 0.53.3 (2024-08-02)


### Bug Fixes

- **build-tools:** Update `rootDir` provided to unbuild ([3efbdebc](https://github.com/storm-software/storm-ops/commit/3efbdebc))

## 0.53.2 (2024-08-02)


### Bug Fixes

- **build-tools:** Resolve path issues in unbuild entry configuration ([46d128b5](https://github.com/storm-software/storm-ops/commit/46d128b5))

## 0.53.1 (2024-08-02)


### Bug Fixes

- **build-tools:** Update the base path of the unbuild input files ([4551640c](https://github.com/storm-software/storm-ops/commit/4551640c))

## 0.53.0 (2024-08-02)


### Features

- **eslint:** Reformatted the banner string whitespace ([2df75cbb](https://github.com/storm-software/storm-ops/commit/2df75cbb))


### Bug Fixes

- **build-tools:** Update unbuild to supply proper configuration ([29bfb7b4](https://github.com/storm-software/storm-ops/commit/29bfb7b4))

- **build-tools:** Remove the unused variables in the updated code ([b01c4999](https://github.com/storm-software/storm-ops/commit/b01c4999))

## 0.52.0 (2024-08-02)


### Features

- **eslint:** Added the `name` and `banner` options to format banner from preset ([ee542ed6](https://github.com/storm-software/storm-ops/commit/ee542ed6))

## 0.51.1 (2024-08-02)


### Bug Fixes

- **eslint:** Resolve issue with duplicate plugins ([23c09494](https://github.com/storm-software/storm-ops/commit/23c09494))

## 0.51.0 (2024-08-02)


### Features

- **eslint:** Added typing file for ESLint rules used by preset ([821637e2](https://github.com/storm-software/storm-ops/commit/821637e2))

## 0.50.0 (2024-08-02)


### Features

- **eslint:** Added a banner with `__filename` and `__dirname` to the distribution ([594c0e9a](https://github.com/storm-software/storm-ops/commit/594c0e9a))

## 0.49.0 (2024-08-02)


### Features

- **eslint:** Update the build process to include the preset declaration file ([1b5fe953](https://github.com/storm-software/storm-ops/commit/1b5fe953))

## 0.48.0 (2024-08-02)


### Features

- **eslint:** Improved the logic around determining the banner ([4bbb321d](https://github.com/storm-software/storm-ops/commit/4bbb321d))

## 0.47.1 (2024-08-01)


### Bug Fixes

- **eslint:** Resolve issue with invalid path definition ([be930a74](https://github.com/storm-software/storm-ops/commit/be930a74))

## 0.47.0 (2024-08-01)


### Features

- **eslint:** Added the `parserOptions` parameter to the preset's options ([344db07c](https://github.com/storm-software/storm-ops/commit/344db07c))

## 0.46.0 (2024-08-01)


### Features

- **eslint:** Added JSX parser options when `react` is enabled ([2700e009](https://github.com/storm-software/storm-ops/commit/2700e009))

## 0.45.1 (2024-08-01)


### Bug Fixes

- **eslint:** Resolved issues with invalid TypeScript flat configuration ([88166ab1](https://github.com/storm-software/storm-ops/commit/88166ab1))

## 0.45.0 (2024-08-01)


### Features

- **eslint:** Added initial typinges for the distribution package ([5a6a9dd1](https://github.com/storm-software/storm-ops/commit/5a6a9dd1))

## 0.44.0 (2024-08-01)


### Features

- **git-tools:** Ensure `.git/COMMIT_EDITMSG` exists before reading from disk ([7abae7ae](https://github.com/storm-software/storm-ops/commit/7abae7ae))

## 0.43.0 (2024-08-01)


### Features

- **git-tools:** Update `commitlint` to warn users when no commit message is provided instead of throwing errors ([04942ee2](https://github.com/storm-software/storm-ops/commit/04942ee2))

## 0.42.3 (2024-07-31)


### Bug Fixes

- **git-tools:** Resolved issue when `commitlint` is called without a `message` parameter ([624b24bc](https://github.com/storm-software/storm-ops/commit/624b24bc))

## 0.42.2 (2024-07-31)


### Bug Fixes

- **build-tools:** Resolved issue iterating unbuild entry files ([17703513](https://github.com/storm-software/storm-ops/commit/17703513))

## 0.42.1 (2024-07-31)


### Bug Fixes

- **build-tools:** Resolve issues with the output path provided to unbuild ([ee9c2353](https://github.com/storm-software/storm-ops/commit/ee9c2353))

## 0.42.0 (2024-07-31)


### Features

- **git-tools:** Added the `commitlint` git tools ([250875e7](https://github.com/storm-software/storm-ops/commit/250875e7))

## 0.41.0 (2024-07-31)


### Features

- **build-tools:** Added the CODEOWNERS linting tool ([63099b1b](https://github.com/storm-software/storm-ops/commit/63099b1b))

## 0.40.0 (2024-07-31)


### Features

- **build-tools:** Added a hook prior to `mkdist` to set custom options ([5c15681b](https://github.com/storm-software/storm-ops/commit/5c15681b))


### Bug Fixes

- **build-tools:** Resolved issue with `tsconfck` import ([4e5b4667](https://github.com/storm-software/storm-ops/commit/4e5b4667))

## 0.39.0 (2024-07-31)


### Features

- **build-tools:** Added the `typeDefinitions` rollup plugin ([8a0e0f8a](https://github.com/storm-software/storm-ops/commit/8a0e0f8a))


### Bug Fixes

- **build-tools:** Removed unused variables ([d48e358b](https://github.com/storm-software/storm-ops/commit/d48e358b))

## 0.38.0 (2024-07-31)


### Features

- **build-tools:** Include the `rollup-plugin-typescript2` plugin in configuration hook ([d7e5f74e](https://github.com/storm-software/storm-ops/commit/d7e5f74e))

## 0.37.2 (2024-07-31)


### Bug Fixes

- **build-tools:** Update unbuild configuration to include proper `rootDir` option ([11e7f38b](https://github.com/storm-software/storm-ops/commit/11e7f38b))

## 0.37.1 (2024-07-31)


### Bug Fixes

- **build-tools:** Remove unused plugin from unbuild ([ad8a5991](https://github.com/storm-software/storm-ops/commit/ad8a5991))

## 0.37.0 (2024-07-31)


### Features

- **create-storm-workspace:** Configure workspace to include GitHub ([eea71de7](https://github.com/storm-software/storm-ops/commit/eea71de7))

## 0.36.0 (2024-07-30)


### Features

- **storm-ops:** Prevent duplicate workflow action runs ([2d854022](https://github.com/storm-software/storm-ops/commit/2d854022))

- **eslint:** Added the header plugin ([cc0cbbea](https://github.com/storm-software/storm-ops/commit/cc0cbbea))

- **eslint:** Removed invalid JSON configuration from package ([2622ee7e](https://github.com/storm-software/storm-ops/commit/2622ee7e))

## 0.35.0 (2024-07-29)


### Features

- **tsconfig:** Update base TypeScript config to use `NodeNext` modules ([21f3d3f5](https://github.com/storm-software/storm-ops/commit/21f3d3f5))

## 0.34.0 (2024-07-29)


### Features

- **tsconfig:** Updates around `base` and `core` tsconfig files ([18b553df](https://github.com/storm-software/storm-ops/commit/18b553df))

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
