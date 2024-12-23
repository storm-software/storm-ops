## 1.207.2 (2024-12-23)

### Bug Fixes

- **workspace-tools:** Resolve issue with `output` property of `build` target ([735e496d](https://github.com/storm-software/storm-ops/commit/735e496d))

## 1.207.1 (2024-12-23)

### Bug Fixes

- **workspace-tools:** Resolve issue with `tsup` plugin's regex
  ([3f0e2c52](https://github.com/storm-software/storm-ops/commit/3f0e2c52))

## 1.207.0 (2024-12-23)

### Features

- **workspace-tools:** Added the `storm-software/typescript/tsup` plugin
  ([8e74c512](https://github.com/storm-software/storm-ops/commit/8e74c512))

## 1.206.0 (2024-12-22)

### Features

- **unbuild:** Initial check-in of the `unbuild` package
  ([fc246154](https://github.com/storm-software/storm-ops/commit/fc246154))

## 1.205.0 (2024-12-19)

### Features

- **workspace-tools:** Added `platform` tag to the TypeScript Nx plugin
  ([f6911898](https://github.com/storm-software/storm-ops/commit/f6911898))

## 1.204.0 (2024-12-19)

### Features

- **workspace-tools:** Added `platform` to unbuild schema and project tags
  ([bfbe9dee](https://github.com/storm-software/storm-ops/commit/bfbe9dee))

## 1.203.0 (2024-12-19)

### Features

- **workspace-tools:** Update TypeScript library generators to use `unbuild`
  executor
  ([29468243](https://github.com/storm-software/storm-ops/commit/29468243))

## 1.202.1 (2024-12-19)

### Bug Fixes

- **workspace-tools:** Resolved issue with TypeScript library generator
  ([f1968e8d](https://github.com/storm-software/storm-ops/commit/f1968e8d))

## 1.202.0 (2024-12-18)

### Features

- **storm-ops:** Improved descriptions and markdown across monorepo
  ([aec89c79](https://github.com/storm-software/storm-ops/commit/aec89c79))

## 1.201.3 (2024-12-18)

### Bug Fixes

- **workspace-tools:** Resolve issues with old `babel` plugin type definitions
  ([bc244027](https://github.com/storm-software/storm-ops/commit/bc244027))
- **storm-ops:** Resolved issue with ESM resolve error during postinstall script
  execution
  ([82389510](https://github.com/storm-software/storm-ops/commit/82389510))

### Continuous Integration

- **storm-ops:** Update scripts to use `pnpm exec` instead of `pnpx` command
  ([3cb7b29e](https://github.com/storm-software/storm-ops/commit/3cb7b29e))

### Dependency Upgrades

- **storm-ops:** Upgrade Nx package to v20.2.2
  ([d793912d](https://github.com/storm-software/storm-ops/commit/d793912d))

## 1.201.2 (2024-12-01)

### Bug Fixes

- **storm-ops:** Resolved issue with autofix build order
  ([bd7f2e6c](https://github.com/storm-software/storm-ops/commit/bd7f2e6c))

## 1.201.1 (2024-12-01)

### Bug Fixes

- **storm-ops:** Removed lint tasks from the autofix workflow action
  ([ad21542d](https://github.com/storm-software/storm-ops/commit/ad21542d))

## 1.201.0 (2024-12-01)

### Features

- **storm-ops:** Added `lint-sherif` script to the CI workflow
  ([906e0c2b](https://github.com/storm-software/storm-ops/commit/906e0c2b))

## 1.200.0 (2024-11-30)

### Features

- **workspace-tools:** Upgrade the Nx configuration target tasks
  ([8a5b0504](https://github.com/storm-software/storm-ops/commit/8a5b0504))
- **storm-ops:** Added `sherif` and `knip` linting to CI pipeline
  ([181d782a](https://github.com/storm-software/storm-ops/commit/181d782a))

## 1.199.0 (2024-11-18)

### Features

- **build-tools:** Allow default package.json exports by no longer overriding
  them ([f19fc362](https://github.com/storm-software/storm-ops/commit/f19fc362))

## 1.198.1 (2024-11-10)

### Bug Fixes

- **config-tools:** Ensure trace logging is not marked as system logging
  ([e8dca171](https://github.com/storm-software/storm-ops/commit/e8dca171))

## 1.198.0 (2024-11-08)

### Features

- **build-tools:** Added back cjs build and local package.json dependencies
  ([d86d3c2a](https://github.com/storm-software/storm-ops/commit/d86d3c2a))

## 1.197.0 (2024-11-07)

### Features

- **config:** Add the `danger` color token
  ([06dba937](https://github.com/storm-software/storm-ops/commit/06dba937))

## 1.196.0 (2024-11-01)

### Features

- **eslint:** Resolve type issues with Nx plugin in preset
  ([d27162e2](https://github.com/storm-software/storm-ops/commit/d27162e2))

## 1.195.0 (2024-10-31)

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

## 1.194.0 (2024-10-22)

### Features

- **build-tools:** Ensure all nested folders have `exports` generated during
  unbuild
  ([cd57af07](https://github.com/storm-software/storm-ops/commit/cd57af07))

## 1.193.1 (2024-10-22)

### Bug Fixes

- **eslint:** Ensure `parserOptions` are removed from all configuration objects
  ([971d16f8](https://github.com/storm-software/storm-ops/commit/971d16f8))

## 1.193.0 (2024-10-22)

### Features

- **eslint:** Added the `nx` linting rules configuration option
  ([cebc611a](https://github.com/storm-software/storm-ops/commit/cebc611a))

## 1.192.1 (2024-10-22)

### Bug Fixes

- **eslint:** Resolve issue with `parserOptions` configuration
  ([4da465aa](https://github.com/storm-software/storm-ops/commit/4da465aa))

## 1.192.0 (2024-10-21)

### Features

- **config-tools:** Update max depth to 4 calls
  ([71c2aab1](https://github.com/storm-software/storm-ops/commit/71c2aab1))

## 1.191.2 (2024-10-21)

### Bug Fixes

- **config-tools:** Resolved issue printing object arrays to the logs
  ([1590597a](https://github.com/storm-software/storm-ops/commit/1590597a))

## 1.191.1 (2024-10-20)

### Bug Fixes

- **eslint:** Resolve issue with merging ESLint configuration objects
  ([bb37374a](https://github.com/storm-software/storm-ops/commit/bb37374a))

## 1.191.0 (2024-10-20)

### Features

- **eslint:** Added ESLint Plugin configuration object logging
  ([2d943cd8](https://github.com/storm-software/storm-ops/commit/2d943cd8))

## 1.190.4 (2024-10-20)

### Bug Fixes

- **eslint:** Ensure the TypeScript ESLint configurations are correctly merged
  by file type
  ([152fce82](https://github.com/storm-software/storm-ops/commit/152fce82))

## 1.190.3 (2024-10-20)

### Bug Fixes

- **eslint:** Resolved issue applying TypeScript ESLint preset configurations
  ([fc0f139e](https://github.com/storm-software/storm-ops/commit/fc0f139e))

## 1.190.2 (2024-09-19)

### Bug Fixes

- **eslint:** Resolve issue applying plugin to configuration aggregate
  ([b86cd266](https://github.com/storm-software/storm-ops/commit/b86cd266))

## 1.190.1 (2024-09-19)

### Bug Fixes

- **eslint:** Resolved issue with scenario where invalid TypeScript
  configuration is provided
  ([4db77c97](https://github.com/storm-software/storm-ops/commit/4db77c97))

## 1.190.0 (2024-09-19)

### Features

- **eslint:** Added the `useTypeScriptESLint` and `useUnicorn` optional
  parameters
  ([60eb6e2e](https://github.com/storm-software/storm-ops/commit/60eb6e2e))

### Bug Fixes

- **eslint:** Resolve build issue in package
  ([78140ff2](https://github.com/storm-software/storm-ops/commit/78140ff2))

## 1.189.0 (2024-09-19)

### Features

- **eslint:** Remove extra rules from TSX files
  ([a609ed20](https://github.com/storm-software/storm-ops/commit/a609ed20))

## 1.188.0 (2024-09-19)

### Features

- **terraform-modules:** Added EKS terraform module
  ([01cc04ff](https://github.com/storm-software/storm-ops/commit/01cc04ff))

## 1.187.0 (2024-09-19)

### Features

- **eslint:** Added proper json linting rules
  ([41809865](https://github.com/storm-software/storm-ops/commit/41809865))

## 1.186.7 (2024-09-19)

### Bug Fixes

- **eslint:** Remove typescript-eslint configuration
  ([03acaaf9](https://github.com/storm-software/storm-ops/commit/03acaaf9))

## 1.186.6 (2024-09-19)

### Bug Fixes

- **eslint:** Resolved issue with invalid TypeScript configuration
  ([15f45cf8](https://github.com/storm-software/storm-ops/commit/15f45cf8))

## 1.186.5 (2024-09-19)

### Bug Fixes

- **eslint:** Remove eslint configuration duplicates
  ([124cead3](https://github.com/storm-software/storm-ops/commit/124cead3))

## 1.186.4 (2024-09-19)

### Bug Fixes

- **eslint:** Remove duplicate eslint rules
  ([bc272af0](https://github.com/storm-software/storm-ops/commit/bc272af0))

## 1.186.3 (2024-09-19)

### Bug Fixes

- **eslint:** Resolve issue with files in typescript rules
  ([02f728a3](https://github.com/storm-software/storm-ops/commit/02f728a3))

## 1.186.2 (2024-09-19)

### Bug Fixes

- **eslint:** Resolve issue with invalid ignores configuration
  ([82c68cad](https://github.com/storm-software/storm-ops/commit/82c68cad))

## 1.186.1 (2024-09-19)

### Bug Fixes

- **eslint:** Remove the jsa11y extension
  ([60a44018](https://github.com/storm-software/storm-ops/commit/60a44018))

## 1.186.0 (2024-09-17)

### Features

- **eslint:** Include updated linting types
  ([9c415747](https://github.com/storm-software/storm-ops/commit/9c415747))

## 1.185.1 (2024-09-17)

### Bug Fixes

- **eslint:** Resolve invalid import path issue
  ([f9c60c86](https://github.com/storm-software/storm-ops/commit/f9c60c86))

## 1.185.0 (2024-09-17)

### Features

- **eslint:** Include the updated typings for the preset's rules
  ([c41fe207](https://github.com/storm-software/storm-ops/commit/c41fe207))

## 1.184.3 (2024-09-16)

### Bug Fixes

- **eslint:** Resolve issue with invalid react file configurations
  ([524b22be](https://github.com/storm-software/storm-ops/commit/524b22be))

## 1.184.2 (2024-09-16)

### Bug Fixes

- **storm-ops:** Resolve issues with workflow actions
  ([2ba8f980](https://github.com/storm-software/storm-ops/commit/2ba8f980))

## 1.184.1 (2024-09-15)

### Bug Fixes

- **storm-ops:** Resolve issue with pnpm version mismatches
  ([11ef01b3](https://github.com/storm-software/storm-ops/commit/11ef01b3))

## 1.184.0 (2024-09-15)

### Features

- **build-tools:** Update unbuild optional parameters
  ([af395c22](https://github.com/storm-software/storm-ops/commit/af395c22))

### Bug Fixes

- **eslint:** Make the ESLint rules more lenient
  ([e11897e7](https://github.com/storm-software/storm-ops/commit/e11897e7))

## 1.183.2 (2024-09-13)

### Bug Fixes

- **eslint:** Cleaned up unused eslint rules
  ([81149178](https://github.com/storm-software/storm-ops/commit/81149178))

## 1.183.0 (2024-09-13)

### Bug Fixes

- **build-tools:** Resolve issue with unbuild `input` parameter
  ([a30abbaa](https://github.com/storm-software/storm-ops/commit/a30abbaa))

## 1.182.5 (2024-09-13)

### Bug Fixes

- **workspace-tools:** Resolve issue with setting compiler options
  ([b444511b](https://github.com/storm-software/storm-ops/commit/b444511b))

## 1.182.3 (2024-09-11)

### Bug Fixes

- **build-tools:** Resolved issue with the base path directory
  ([b7cad5eb](https://github.com/storm-software/storm-ops/commit/b7cad5eb))

## 1.182.2 (2024-09-11)

### Bug Fixes

- **workspace-tools:** Resolve issue with input entry point names
  ([12ca61d3](https://github.com/storm-software/storm-ops/commit/12ca61d3))

## 1.182.0 (2024-09-11)

### Features

- **workspace-tools:** Improved the input value formatting
  ([13d3fb1c](https://github.com/storm-software/storm-ops/commit/13d3fb1c))

## 1.181.1 (2024-09-11)

### Bug Fixes

- **workspace-tools:** Resolve issue with names in input files
  ([2f181c56](https://github.com/storm-software/storm-ops/commit/2f181c56))

## 1.181.0 (2024-09-11)

### Features

- **workspace-tools:** Added TypeScript as a peerDependency
  ([74da29f1](https://github.com/storm-software/storm-ops/commit/74da29f1))

## 1.180.10 (2024-09-11)

### Bug Fixes

- **workspace-tools:** Update parameters provided to TypeScript plugin
  ([8cd141c1](https://github.com/storm-software/storm-ops/commit/8cd141c1))

## 1.180.9 (2024-09-11)

### Bug Fixes

- **build-tools:** Resolved issue providing include paths
  ([25f7dc30](https://github.com/storm-software/storm-ops/commit/25f7dc30))

## 1.180.8 (2024-09-11)

### Bug Fixes

- **build-tools:** Resolved issue with missing TypeScript declarations
  ([4cf894fe](https://github.com/storm-software/storm-ops/commit/4cf894fe))

## 1.180.7 (2024-09-11)

### Bug Fixes

- **build-tools:** Invoke chdir in the build function
  ([43f69ff5](https://github.com/storm-software/storm-ops/commit/43f69ff5))

## 1.180.6 (2024-09-11)

### Bug Fixes

- **build-tools:** Updated the slash direction in compiler options paths
  ([cd34a280](https://github.com/storm-software/storm-ops/commit/cd34a280))

## 1.180.5 (2024-09-10)

### Bug Fixes

- **build-tools:** Ensure the `skipDefaultLibCheck` options is added during DTS
  build
  ([f9a7e827](https://github.com/storm-software/storm-ops/commit/f9a7e827))

## 1.180.4 (2024-09-10)

### Bug Fixes

- **build-tools:** Resolve issue with missing declaration files
  ([862e51a1](https://github.com/storm-software/storm-ops/commit/862e51a1))

## 1.180.3 (2024-09-10)

### Bug Fixes

- **build-tools:** Update the declaration directory used during build
  ([a9c0f876](https://github.com/storm-software/storm-ops/commit/a9c0f876))

## 1.180.2 (2024-09-10)

### Bug Fixes

- **build-tools:** Resolved issue with invalid path configurations
  ([533a80bf](https://github.com/storm-software/storm-ops/commit/533a80bf))

## 1.180.1 (2024-09-10)

### Bug Fixes

- **build-tools:** Ensure the `rootDir` and `baseUrl` parameters are consistent
  ([7438183f](https://github.com/storm-software/storm-ops/commit/7438183f))

## 1.180.0 (2024-09-10)

### Features

- **eslint-config:** Added the `useReactCompiler` option to preset
  ([691fdfe8](https://github.com/storm-software/storm-ops/commit/691fdfe8))

## 1.179.15 (2024-09-10)

### Bug Fixes

- **build-tools:** Resolved issue with invalid include paths
  ([3bac71bd](https://github.com/storm-software/storm-ops/commit/3bac71bd))

## 1.179.14 (2024-09-10)

### Bug Fixes

- **build-tools:** Resolve issues with generated tsconfig compilation options
  ([f7a96d93](https://github.com/storm-software/storm-ops/commit/f7a96d93))

## 1.179.13 (2024-09-10)

### Bug Fixes

- **build-tools:** Resolve issue specifying the `typeRoot` options
  ([973f8ee4](https://github.com/storm-software/storm-ops/commit/973f8ee4))

## 1.179.12 (2024-09-10)

### Bug Fixes

- **config-tools:** Resolve issues with slashes in paths
  ([e1e5f571](https://github.com/storm-software/storm-ops/commit/e1e5f571))

## 1.179.11 (2024-09-10)

### Bug Fixes

- **build-tools:** Remove invalid configuration parameters
  ([cede3716](https://github.com/storm-software/storm-ops/commit/cede3716))

## 1.179.10 (2024-09-10)

### Bug Fixes

- **build-tools:** Resolve issue with the raw configuration parameters
  ([bbd59f22](https://github.com/storm-software/storm-ops/commit/bbd59f22))

## 1.179.9 (2024-09-10)

### Bug Fixes

- **storm-ops:** Resolved issue with invalid configuration object
  ([a4f22049](https://github.com/storm-software/storm-ops/commit/a4f22049))

## 1.179.8 (2024-09-10)

### Bug Fixes

- **workspace-tools:** Change order of plugin invokation
  ([43e80289](https://github.com/storm-software/storm-ops/commit/43e80289))

## 1.179.7 (2024-09-10)

### Bug Fixes

- **workspace-tools:** Resolve paths issue in configuration
  ([ad5950ef](https://github.com/storm-software/storm-ops/commit/ad5950ef))

## 1.179.6 (2024-09-10)

### Bug Fixes

- **eslint-config:** Resolve issue with missing TypeScript configuration
  ([3692faa9](https://github.com/storm-software/storm-ops/commit/3692faa9))

- **workspace-tools:** Resolve issue with workspace paths
  ([1b3305e6](https://github.com/storm-software/storm-ops/commit/1b3305e6))

## 1.179.5 (2024-09-10)

### Bug Fixes

- **workspace-tools:** Added `baseUrl` to compiler options
  ([dd058e2e](https://github.com/storm-software/storm-ops/commit/dd058e2e))

## 1.179.4 (2024-09-09)

### Bug Fixes

- **workspace-tools:** Update `rootDir` path slashes
  ([a50cead4](https://github.com/storm-software/storm-ops/commit/a50cead4))

## 1.179.2 (2024-09-08)

### Bug Fixes

- **workspace-tools:** Update the compiler options used in TypeScript plugin
  ([b788e426](https://github.com/storm-software/storm-ops/commit/b788e426))

- **workspace-tools:** Resolved issue with returned value in Rust plugin
  ([f37a1f44](https://github.com/storm-software/storm-ops/commit/f37a1f44))

## 1.179.1 (2024-09-08)

### Features

- **workspace-tools:** Ensure the workspaceRoot is used as the base directory
  ([2b8ab737](https://github.com/storm-software/storm-ops/commit/2b8ab737))

## 1.178.1 (2024-09-08)

### Features

- **workspace-tools:** Added custom code for generating the Nx configuration
  ([651a589e](https://github.com/storm-software/storm-ops/commit/651a589e))

## 1.177.2 (2024-09-08)

### Bug Fixes

- **workspace-tools:** Added console logging to error reporting
  ([4878661d](https://github.com/storm-software/storm-ops/commit/4878661d))

## 1.177.1 (2024-09-08)

### Bug Fixes

- **workspace-tools:** Added additional logging to Rollup options
  ([2f542ce8](https://github.com/storm-software/storm-ops/commit/2f542ce8))

## 1.177.0 (2024-09-08)

### Features

- **workspace-tools:** Added enhanced post executor logging
  ([6d7d2165](https://github.com/storm-software/storm-ops/commit/6d7d2165))

## 1.176.0 (2024-09-08)

### Features

- **workspace-tools:** Added functionality to parse the `logLevel` during Rollup
  build
  ([5e617be7](https://github.com/storm-software/storm-ops/commit/5e617be7))

## 1.175.6 (2024-09-08)

### Bug Fixes

- **workspace-tools:** Resolved issue resolving plugins
  ([00448e95](https://github.com/storm-software/storm-ops/commit/00448e95))

## 1.175.5 (2024-09-08)

### Bug Fixes

- **workspace-tools:** Add custom rollup code
  ([c21fef43](https://github.com/storm-software/storm-ops/commit/c21fef43))

## 1.175.4 (2024-09-08)

### Bug Fixes

- **workspace-tools:** Resolved issue with syntax error
  ([04d1df8a](https://github.com/storm-software/storm-ops/commit/04d1df8a))

## 1.175.3 (2024-09-08)

### Bug Fixes

- **workspace-tools:** Resolve issue with bundling Nx packages
  ([8fc7681e](https://github.com/storm-software/storm-ops/commit/8fc7681e))

- **workspace-tools:** Resolved usused dependency issue
  ([e6b72551](https://github.com/storm-software/storm-ops/commit/e6b72551))

## 1.175.2 (2024-09-07)

### Bug Fixes

- **workspace-tools:** Resolved issues with path generation in build
  ([6600299c](https://github.com/storm-software/storm-ops/commit/6600299c))

## 1.175.1 (2024-09-06)

### Bug Fixes

- **workspace-tools:** Resolve issue with invalid additional entry paths
  ([546753ab](https://github.com/storm-software/storm-ops/commit/546753ab))

## 1.175.0 (2024-09-06)

### Features

- **k8s-tools:** Added extra fields onto the released container's `meta.json`
  file ([14356536](https://github.com/storm-software/storm-ops/commit/14356536))

### Bug Fixes

- **workspace-tools:** Resolved the duplicate export name issue
  ([f2586335](https://github.com/storm-software/storm-ops/commit/f2586335))

## 1.174.1 (2024-09-06)

### Bug Fixes

- **git-tools:** Resolved issue with missing command line arguments
  ([59e26e31](https://github.com/storm-software/storm-ops/commit/59e26e31))

## 1.174.0 (2024-09-06)

### Features

- **git-tools:** Added logic to skip signing during CI workflows
  ([4a7062ce](https://github.com/storm-software/storm-ops/commit/4a7062ce))

## 1.173.0 (2024-09-06)

### Features

- **git-tools:** Added signed commits to storm-git scripts
  ([3d7c88c9](https://github.com/storm-software/storm-ops/commit/3d7c88c9))

## 1.172.1 (2024-09-05)

### Bug Fixes

- **cloudflare-tools:** Regenerated the README.md file
  ([6ad71f5a](https://github.com/storm-software/storm-ops/commit/6ad71f5a))

## 1.172.0 (2024-09-05)

### Features

- **cloudflare-tools:** Added the `R2UploadPublish` executor
  ([e5495bdb](https://github.com/storm-software/storm-ops/commit/e5495bdb))

## 1.171.0 (2024-09-03)

### Features

- **linting-tools:** Taplo toml formatting improvements
  ([1e84182b](https://github.com/storm-software/storm-ops/commit/1e84182b))

## 1.170.0 (2024-09-03)

### Features

- **k8s-tools:** Added `container-publish` executor and `docker` plugin
  ([36d4d1d0](https://github.com/storm-software/storm-ops/commit/36d4d1d0))

- **storm-ops:** Upgrade the Nx workspace versions
  ([15cb7ee2](https://github.com/storm-software/storm-ops/commit/15cb7ee2))

## 1.169.0 (2024-09-02)

### Features

- **terraform-modules:** Added the `aws/karpenter` and `cloudflare/r2-bucket`
  modules
  ([09deea18](https://github.com/storm-software/storm-ops/commit/09deea18))

### Bug Fixes

- **workspace-tools:** Resolved issue with invalid import
  ([fdd1c68c](https://github.com/storm-software/storm-ops/commit/fdd1c68c))

- **terraform-modules:** Resolved issue with applying tags to resources
  ([a0fd5e19](https://github.com/storm-software/storm-ops/commit/a0fd5e19))

## 1.168.0 (2024-09-01)

### Features

- **eslint:** Update ESLint line-breaking rules
  ([1d08c4e1](https://github.com/storm-software/storm-ops/commit/1d08c4e1))

- **workspace-tools:** Added the `rollup` executor
  ([efcbbc60](https://github.com/storm-software/storm-ops/commit/efcbbc60))

### Bug Fixes

- **workspace-tools:** Resolved various issues with `rollup` executor
  ([5b350c35](https://github.com/storm-software/storm-ops/commit/5b350c35))

- **workspace-tools:** Ensure the correct version of the rollup plugin is
  installed
  ([7b344f6a](https://github.com/storm-software/storm-ops/commit/7b344f6a))

- **workspace-tools:** Resolve typing issue in option defaulting
  ([ec7152bf](https://github.com/storm-software/storm-ops/commit/ec7152bf))

## 1.167.1 (2024-09-01)

### Bug Fixes

- **workspace-tools:** Resolve issue with excessive logging in Cargo plugin
  ([5562f21f](https://github.com/storm-software/storm-ops/commit/5562f21f))

## 1.167.0 (2024-09-01)

### Features

- **workspace-tools:** Added the `noDeps` flag to the cargo-doc executor options
  ([82eeb944](https://github.com/storm-software/storm-ops/commit/82eeb944))

## 1.166.1 (2024-08-31)

### Bug Fixes

- **build-tools:** Added try/catch to utility function
  ([3ce4a7cd](https://github.com/storm-software/storm-ops/commit/3ce4a7cd))

## 1.166.0 (2024-08-31)

### Features

- **eslint:** Update linting rules to ignore the length of commands and use
  double quotes
  ([f9c603d7](https://github.com/storm-software/storm-ops/commit/f9c603d7))

## 1.165.3 (2024-08-31)

### Bug Fixes

- **terraform-modules:** Resolve issue with output variable name
  ([dd5b63fb](https://github.com/storm-software/storm-ops/commit/dd5b63fb))

## 1.165.2 (2024-08-31)

### Bug Fixes

- **terraform-modules:** Resolved issue with conditional statement syntax
  ([c96e9a9e](https://github.com/storm-software/storm-ops/commit/c96e9a9e))

## 1.165.1 (2024-08-30)

### Bug Fixes

- **terraform-modules:** Added default values for `full_name` variables
  ([8779001e](https://github.com/storm-software/storm-ops/commit/8779001e))

## 1.165.0 (2024-08-29)

### Features

- **workspace-tools:** The `docs` task no longer depends on `build` to run
  ([9b299fad](https://github.com/storm-software/storm-ops/commit/9b299fad))

### Bug Fixes

- **workspace-tools:** Ensure the `preVersionCommand` property is correct
  ([9d089852](https://github.com/storm-software/storm-ops/commit/9d089852))

## 1.164.2 (2024-08-29)

### Bug Fixes

- **workspace-tools:** Resolved issue with multi-layer extends in Nx
  configurations
  ([9cb9d2ff](https://github.com/storm-software/storm-ops/commit/9cb9d2ff))

## 1.164.1 (2024-08-29)

### Bug Fixes

- **workspace-tools:** Add new Nx configuration files to package.json
  ([23edcd79](https://github.com/storm-software/storm-ops/commit/23edcd79))

## 1.164.0 (2024-08-29)

### Features

- **workspace-tools:** Added `nx-default.json` and `nx-cloud.json` files
  ([4bb13faa](https://github.com/storm-software/storm-ops/commit/4bb13faa))

## 1.163.0 (2024-08-29)

### Features

- **workspace-tools:** Added base entry to package
  ([b0d3b788](https://github.com/storm-software/storm-ops/commit/b0d3b788))

## 1.162.1 (2024-08-27)

### Bug Fixes

- **k8s-tools:** Resolved issue with invalid import
  ([82a782d4](https://github.com/storm-software/storm-ops/commit/82a782d4))

## 1.162.0 (2024-08-27)

### Features

- **k8s-tools:** Added aliases for `helm-chart` and `helm-dependency` generators
  ([16a4b7c7](https://github.com/storm-software/storm-ops/commit/16a4b7c7))

## 1.161.1 (2024-08-27)

### Bug Fixes

- **k8s-tools:** Resolved issue invoking generator functions
  ([405367cb](https://github.com/storm-software/storm-ops/commit/405367cb))

## 1.161.0 (2024-08-27)

### Features

- **workspace-tools:** Update the `defaultConfiguration` to `production` for
  release
  ([62258f36](https://github.com/storm-software/storm-ops/commit/62258f36))

## 1.160.0 (2024-08-27)

### Features

- **workspace-tools:** Added Cargo executors for build, check, doc, clippy, and
  format
  ([52ffcec8](https://github.com/storm-software/storm-ops/commit/52ffcec8))

- **workspace-tools:** Added the `profiles` option to Cargo plugin
  ([518620ad](https://github.com/storm-software/storm-ops/commit/518620ad))

### Bug Fixes

- **workspace-tools:** Ensure `dev` is used as default profile
  ([f9a49bc5](https://github.com/storm-software/storm-ops/commit/f9a49bc5))

- **workspace-tools:** Added the required json properties to executor schema
  ([c99d89f8](https://github.com/storm-software/storm-ops/commit/c99d89f8))

- **workspace-tools:** Update the Cargo executors body function signature
  ([e40fd886](https://github.com/storm-software/storm-ops/commit/e40fd886))

## 1.159.1 (2024-08-26)

### Bug Fixes

- **workspace-tools:** Resolved issues with the lint configuration files
  ([9f7d724c](https://github.com/storm-software/storm-ops/commit/9f7d724c))

## 1.159.0 (2024-08-26)

### Features

- **workspace-tools:** Resolve issue with invalid `.ls-lint.yml` config file
  path ([2315850a](https://github.com/storm-software/storm-ops/commit/2315850a))

## 1.158.1 (2024-08-26)

- **workspace-tools:** Remove `lint` task as a dependency of the `build` task
  ([7ffc3dfe](https://github.com/storm-software/storm-ops/commit/7ffc3dfe))

### Bug Fixes

- **workspace-tools:** Ensure the `publish` Cargo property is handled correctly
  ([67dd03a0](https://github.com/storm-software/storm-ops/commit/67dd03a0))

- **workspace-tools:** Updated the path to the ls-lint configuration file
  ([8dc17670](https://github.com/storm-software/storm-ops/commit/8dc17670))

## 1.158.0 (2024-08-26)

### Features

- **workspace-tools:** Remove the `format` task as a dependency of `build`
  ([75966255](https://github.com/storm-software/storm-ops/commit/75966255))

- **workspace-tools:** Remove `lint` task as a dependency of the `build` task
  ([7ffc3dfe](https://github.com/storm-software/storm-ops/commit/7ffc3dfe))

### Bug Fixes

- **workspace-tools:** Resolved issue with Release Version generator return type
  ([602dcd63](https://github.com/storm-software/storm-ops/commit/602dcd63))

- **workspace-tools:** Ensure the Release Version generator is default export
  ([6345fefc](https://github.com/storm-software/storm-ops/commit/6345fefc))

### Dependency Upgrades

- **storm-ops:** Upgrade the workspace's Nx version
  ([4ce6ac9e](https://github.com/storm-software/storm-ops/commit/4ce6ac9e))

## 1.157.0 (2024-08-23)

### Features

- **k8s-tools:** Initial code check-in of k8s tools
  ([cac95faa](https://github.com/storm-software/storm-ops/commit/cac95faa))

## 1.156.0 (2024-08-22)

### Features

- **workspace-tools:** Added the `includeApps` option to the Rust and TypeScript
  plugins
  ([7bd309f6](https://github.com/storm-software/storm-ops/commit/7bd309f6))

## 1.155.0 (2024-08-19)

### Features

- **terraform-modules:** Add `region` to resource name
  ([03291fe8](https://github.com/storm-software/storm-ops/commit/03291fe8))

## 1.154.0 (2024-08-19)

### Features

- **workspace-tools:** Added the `build-local` target to the base `nx.json` file
  ([a3afe7e8](https://github.com/storm-software/storm-ops/commit/a3afe7e8))

## 1.153.0 (2024-08-09)

### Features

- **storm-ops:** Update the workflows to send requests to Telegram
  ([65332dd0](https://github.com/storm-software/storm-ops/commit/65332dd0))

- **workspace-tools:** Added the `.env.keys` file to the ignored list to support
  the `dotenvx` package
  ([1394d51c](https://github.com/storm-software/storm-ops/commit/1394d51c))

### Bug Fixes

- **workspace-tools:** Resolve issue with call signature to executors
  ([36ad985a](https://github.com/storm-software/storm-ops/commit/36ad985a))

## 1.152.0 (2024-08-04)

### Features

- **config:** Added the `docs` and `licensing` options to the Storm
  configuration
  ([c867efe1](https://github.com/storm-software/storm-ops/commit/c867efe1))

## 1.151.0 (2024-08-03)

### Features

- **eslint:** Ignore `prefer-nullish-coalescing` for strings
  ([dbae2a58](https://github.com/storm-software/storm-ops/commit/dbae2a58))

## 1.150.0 (2024-08-03)

### Features

- **build-tools:** Add back experimental DTS option to TSUP
  ([4fe9652b](https://github.com/storm-software/storm-ops/commit/4fe9652b))

## 1.149.0 (2024-08-03)

### Features

- **storm-ops:** Upgrade workspace's Nx package dependencies
  ([5f31f734](https://github.com/storm-software/storm-ops/commit/5f31f734))

## 1.148.0 (2024-08-03)

### Features

- **build-tools:** Add tsup build's rollup helpers
  ([27ecd4e6](https://github.com/storm-software/storm-ops/commit/27ecd4e6))

### Bug Fixes

- **build-tools:** Resolve issue with invalid return paths
  ([0f9f5b1f](https://github.com/storm-software/storm-ops/commit/0f9f5b1f))

## 1.147.1 (2024-08-03)

### Bug Fixes

- **build-tools:** Resolved issue with the entry name parameter in unbuild
  config
  ([f5e5dbdd](https://github.com/storm-software/storm-ops/commit/f5e5dbdd))

## 1.147.0 (2024-08-02)

### Features

- **build-tools:** Update the unbuild configuration to get exports from
  `package.json` files
  ([bb2fc78f](https://github.com/storm-software/storm-ops/commit/bb2fc78f))

## 1.146.0 (2024-08-02)

### Features

- **terraform-tools:** Initial check-in of project code
  ([c4ef4810](https://github.com/storm-software/storm-ops/commit/c4ef4810))

## 1.145.0 (2024-08-02)

### Features

- **eslint:** Reformatted the banner string whitespace
  ([2df75cbb](https://github.com/storm-software/storm-ops/commit/2df75cbb))

- **tsconfig:** Added `moduleResolution` to the base tsconfig file
  ([6ed67bbc](https://github.com/storm-software/storm-ops/commit/6ed67bbc))

### Bug Fixes

- **build-tools:** Remove the unused variables in the updated code
  ([b01c4999](https://github.com/storm-software/storm-ops/commit/b01c4999))

## 1.144.0 (2024-08-02)

### Features

- **eslint:** Added the `name` and `banner` options to format banner from preset
  ([ee542ed6](https://github.com/storm-software/storm-ops/commit/ee542ed6))

## 1.143.1 (2024-08-02)

### Bug Fixes

- **eslint:** Resolve issue with duplicate plugins
  ([23c09494](https://github.com/storm-software/storm-ops/commit/23c09494))

## 1.143.0 (2024-08-02)

### Features

- **eslint:** Added typing file for ESLint rules used by preset
  ([821637e2](https://github.com/storm-software/storm-ops/commit/821637e2))

## 1.142.0 (2024-08-02)

### Features

- **eslint:** Added a banner with `__filename` and `__dirname` to the
  distribution
  ([594c0e9a](https://github.com/storm-software/storm-ops/commit/594c0e9a))

## 1.141.0 (2024-08-02)

### Features

- **eslint:** Update the build process to include the preset declaration file
  ([1b5fe953](https://github.com/storm-software/storm-ops/commit/1b5fe953))

## 1.140.0 (2024-08-02)

### Features

- **eslint:** Improved the logic around determining the banner
  ([4bbb321d](https://github.com/storm-software/storm-ops/commit/4bbb321d))

## 1.139.1 (2024-08-01)

### Bug Fixes

- **eslint:** Resolve issue with invalid path definition
  ([be930a74](https://github.com/storm-software/storm-ops/commit/be930a74))

## 1.139.0 (2024-08-01)

### Features

- **eslint:** Added the `parserOptions` parameter to the preset's options
  ([344db07c](https://github.com/storm-software/storm-ops/commit/344db07c))

## 1.138.0 (2024-08-01)

### Features

- **eslint:** Added JSX parser options when `react` is enabled
  ([2700e009](https://github.com/storm-software/storm-ops/commit/2700e009))

## 1.137.1 (2024-08-01)

### Bug Fixes

- **eslint:** Resolved issues with invalid TypeScript flat configuration
  ([88166ab1](https://github.com/storm-software/storm-ops/commit/88166ab1))

## 1.137.0 (2024-08-01)

### Features

- **eslint:** Added initial typinges for the distribution package
  ([5a6a9dd1](https://github.com/storm-software/storm-ops/commit/5a6a9dd1))

## 1.136.0 (2024-08-01)

### Features

- **git-tools:** Ensure `.git/COMMIT_EDITMSG` exists before reading from disk
  ([7abae7ae](https://github.com/storm-software/storm-ops/commit/7abae7ae))

## 1.135.0 (2024-08-01)

### Features

- **git-tools:** Update `commitlint` to warn users when no commit message is
  provided instead of throwing errors
  ([04942ee2](https://github.com/storm-software/storm-ops/commit/04942ee2))

## 1.134.3 (2024-07-31)

### Bug Fixes

- **git-tools:** Resolved issue when `commitlint` is called without a `message`
  parameter
  ([624b24bc](https://github.com/storm-software/storm-ops/commit/624b24bc))

## 1.134.2 (2024-07-31)

### Bug Fixes

- **build-tools:** Resolved issue iterating unbuild entry files
  ([17703513](https://github.com/storm-software/storm-ops/commit/17703513))

## 1.134.1 (2024-07-31)

### Bug Fixes

- **build-tools:** Resolve issues with the output path provided to unbuild
  ([ee9c2353](https://github.com/storm-software/storm-ops/commit/ee9c2353))

## 1.134.0 (2024-07-31)

### Features

- **build-tools:** Added the CODEOWNERS linting tool
  ([63099b1b](https://github.com/storm-software/storm-ops/commit/63099b1b))

## 1.133.1 (2024-07-31)

### Bug Fixes

- **build-tools:** Remove unused plugin from unbuild
  ([ad8a5991](https://github.com/storm-software/storm-ops/commit/ad8a5991))

## 1.133.0 (2024-07-31)

### Features

- **create-storm-workspace:** Configure workspace to include GitHub
  ([eea71de7](https://github.com/storm-software/storm-ops/commit/eea71de7))

## 1.132.0 (2024-07-30)

### Features

- **eslint:** Added the header plugin
  ([cc0cbbea](https://github.com/storm-software/storm-ops/commit/cc0cbbea))

## 1.131.0 (2024-07-28)

### Features

- **build-tools:** Added code to include TypeScript lib declarations in bundle
  ([689e8a47](https://github.com/storm-software/storm-ops/commit/689e8a47))

- **build-tools:** Added the `generatePackageJson` functionality for unbuild
  ([218c72d4](https://github.com/storm-software/storm-ops/commit/218c72d4))

## 1.130.0 (2024-07-28)

### Features

- **build-tools:** Added `formatPackageJson` functionality to unbuild
  ([6da1a518](https://github.com/storm-software/storm-ops/commit/6da1a518))

## 1.129.2 (2024-07-28)

### Bug Fixes

- **build-tools:** Split out the code to format the `package.json` file
  ([a47b98d5](https://github.com/storm-software/storm-ops/commit/a47b98d5))

## 1.129.1 (2024-07-26)

### Bug Fixes

- **storm-ops:** Resolved issue with missing token in CI action
  ([4db79d8e](https://github.com/storm-software/storm-ops/commit/4db79d8e))

## 1.129.0 (2024-07-24)

### Features

- **workspace-tools:** Added the `size-limit` executor
  ([6ce22bab](https://github.com/storm-software/storm-ops/commit/6ce22bab))

## 1.128.2 (2024-07-23)

### Bug Fixes

- **workspace-tools:** Simplified the `namedImports` in the base Nx
  configuration
  ([2982defb](https://github.com/storm-software/storm-ops/commit/2982defb))

- **workspace-tools:** Add the new `namedImports` to workspace plugins
  ([357b9b73](https://github.com/storm-software/storm-ops/commit/357b9b73))

## 1.128.1 (2024-07-23)

### Bug Fixes

- **eslint:** Resolve issues with `json` plugin config spread
  ([088d498a](https://github.com/storm-software/storm-ops/commit/088d498a))

## 1.128.0 (2024-07-23)

### Features

- **prettier:** Export default `config.json` and `tailwindcss.json` from package
  ([c8711a52](https://github.com/storm-software/storm-ops/commit/c8711a52))

## 1.127.0 (2024-07-23)

### Features

- **eslint:** Remove the `import` plugin from the preset
  ([6c8551ae](https://github.com/storm-software/storm-ops/commit/6c8551ae))

## 1.126.0 (2024-07-22)

### Features

- **eslint:** Update rules around handling TypeScript function returns
  ([a9859cd4](https://github.com/storm-software/storm-ops/commit/a9859cd4))

## 1.125.0 (2024-07-22)

### Features

- **eslint:** Added Nx plugin to eslint preset
  ([1933027f](https://github.com/storm-software/storm-ops/commit/1933027f))

## 1.124.0 (2024-07-22)

### Features

- **eslint:** Add config formatter to eslint preset
  ([050dadcd](https://github.com/storm-software/storm-ops/commit/050dadcd))

## 1.123.0 (2024-07-22)

### Features

- **workspace-tools:** Enable distributed task execution and remote caching
  ([307bc05a](https://github.com/storm-software/storm-ops/commit/307bc05a))

- **workspace-tools:** Improve the `nx.config` shared imports
  ([2b298691](https://github.com/storm-software/storm-ops/commit/2b298691))

### Bug Fixes

- **storm-ops:** Resolved issue with cross-project typings
  ([aed5a357](https://github.com/storm-software/storm-ops/commit/aed5a357))

- **workspace-tools:** Improve the inputs used for `build` and `release` tasks
  ([9887f360](https://github.com/storm-software/storm-ops/commit/9887f360))

- **workspace-tools:** Resolve issues with `namedInputs` in base Nx
  configuration
  ([879fc147](https://github.com/storm-software/storm-ops/commit/879fc147))

### Continuous Integration

- **storm-ops:** Resolve permissions issue in CI action
  ([2dd8c79e](https://github.com/storm-software/storm-ops/commit/2dd8c79e))

## 1.122.0 (2024-07-19)

### Features

- **workspace-tools:** Added separate exports for utilities
  ([2e62f379](https://github.com/storm-software/storm-ops/commit/2e62f379))

### Continuous Integration

- **storm-ops:** Track git branch in `nrwl/nx-set-shas` step
  ([e53ee0bc](https://github.com/storm-software/storm-ops/commit/e53ee0bc))

## 1.121.0 (2024-07-19)

### Features

- **workspace-tools:** Added helper functions to support reading/writing project
  tags ([507b5747](https://github.com/storm-software/storm-ops/commit/507b5747))

- **workspace-tools:** Added project tags constants and type declarations
  ([88cd1de2](https://github.com/storm-software/storm-ops/commit/88cd1de2))

## 1.120.0 (2024-07-19)

### Features

- **workspace-tools:** Added tag population to the workspace plugins
  ([f473de63](https://github.com/storm-software/storm-ops/commit/f473de63))

## 1.119.0 (2024-07-19)

### Features

- **workspace-tools:** Added the `clean-package` executor
  ([a1763e45](https://github.com/storm-software/storm-ops/commit/a1763e45))

- **config:** Updated `workspaceRoot` with a default value
  ([5ee3fb09](https://github.com/storm-software/storm-ops/commit/5ee3fb09))

## 1.118.0 (2024-07-19)

### Features

- **storm-ops:** Use renovate with shared preset and update dependabot config
  ([b85fba8a](https://github.com/storm-software/storm-ops/commit/b85fba8a))

## 1.117.0 (2024-07-17)

### Features

- **workspace-tools:** Include Documentation and Examples in the CHANGELOG files
  ([39b694b7](https://github.com/storm-software/storm-ops/commit/39b694b7))

### Documentation

- **storm-ops:** Remove emojis from monorepo CHANGELOG files
  ([441b36b1](https://github.com/storm-software/storm-ops/commit/441b36b1))

- **workspace-tools:** Regenerate README markdown content
  ([3dc140fc](https://github.com/storm-software/storm-ops/commit/3dc140fc))

## 2.29.0 (2024-07-17)

### Features

- **workspace-tools:** Added custom `conventional-commits` configuration
  ([aac74a55](https://github.com/storm-software/storm-ops/commit/aac74a55))

## 2.28.0 (2024-07-17)

### Features

- **git-tools:** Improve README footer template markdown
  ([0450800f](https://github.com/storm-software/storm-ops/commit/0450800f))

## 2.27.0 (2024-07-17)

### Features

- **git-tools:** Added README header template to include table of contents
  ([6841042e](https://github.com/storm-software/storm-ops/commit/6841042e))

## 2.26.0 (2024-07-17)

### Features

- **git-tools:** Added internal `doctoc` implementation
  ([82c4cf40](https://github.com/storm-software/storm-ops/commit/82c4cf40))

## 2.25.1 (2024-07-14)

### Bug Fixes

- **git-tools:** Update README.md formatting for IMPORTANT message
  ([2290ee67](https://github.com/storm-software/storm-ops/commit/2290ee67))

## 2.25.0 (2024-07-03)

### Features

- **storm-ops:** Upgrade `pnpm` package manager version to 9.4.0
  ([2269cf67](https://github.com/storm-software/storm-ops/commit/2269cf67))

- **git-tools:** Added a table of content to the `README.md` header template
  ([227c234f](https://github.com/storm-software/storm-ops/commit/227c234f))

## 2.24.0 (2024-06-29)

### Features

- **eslint-plugin:** Polyfill `require` in esm build output
  ([67f1fbab](https://github.com/storm-software/storm-ops/commit/67f1fbab))

## 2.23.0 (2024-06-22)

### Features

- **workspace-tools:** Upgrade the workspace pnpm-lock file
  ([d33c20cb](https://github.com/storm-software/storm-ops/commit/d33c20cb))

## 2.22.0 (2024-06-22)

### Features

- **storm-ops:** Updated pnpm-lock file
  ([22be1efd](https://github.com/storm-software/storm-ops/commit/22be1efd))

## 2.21.0 (2024-06-22)

### Features

- **workspace-tools:** Added `lint` and `format` tasks and improved cache input
  management
  ([f2ade202](https://github.com/storm-software/storm-ops/commit/f2ade202))

## 2.20.0 (2024-06-21)

### Features

- **eslint-plugin:** Resolve issues with eslint module types
  ([ca513974](https://github.com/storm-software/storm-ops/commit/ca513974))

## 2.19.0 (2024-06-20)

### Features

- **git-tools:** Updated the shared `lefthook` configuration to use npm scripts
  ([68cfb767](https://github.com/storm-software/storm-ops/commit/68cfb767))

## 2.18.0 (2024-06-17)

### Features

- **git-tools:** Use repository scripts in base `lefthook` configuration
  ([771a76d9](https://github.com/storm-software/storm-ops/commit/771a76d9))

## 2.17.0 (2024-06-17)

### Features

- **git-tools:** Add proper export values to package and resolve type issues
  ([46f45709](https://github.com/storm-software/storm-ops/commit/46f45709))

## 2.16.1 (2024-06-17)

### Bug Fixes

- **deps:** update patch prod dependencies
  ([ec613e8a](https://github.com/storm-software/storm-ops/commit/ec613e8a))

## 2.16.0 (2024-06-09)

### Features

- **eslint:** Add dependencies and convert to `CommonJs` package
  ([bd4bc22c](https://github.com/storm-software/storm-ops/commit/bd4bc22c))

## 2.15.0 (2024-06-09)

### Features

- **eslint:** Updated markup documentation files
  ([0097f19e](https://github.com/storm-software/storm-ops/commit/0097f19e))

## 2.14.0 (2024-06-09)

### Features

- **git-tools:** Added additional error logging to release action
  ([d990f9f5](https://github.com/storm-software/storm-ops/commit/d990f9f5))

## 2.13.1 (2024-06-09)

### Bug Fixes

- **git-tools:** File formatting changes
  ([f6c39863](https://github.com/storm-software/storm-ops/commit/f6c39863))

## 2.13.0 (2024-06-09)

### Features

- **git-tools:** Enhance the fatal error logging
  ([89b0e089](https://github.com/storm-software/storm-ops/commit/89b0e089))

## 2.12.1 (2024-06-05)

### Bug Fixes

- **eslint:** Resolve issue with missing dependencies
  ([b0f43454](https://github.com/storm-software/storm-ops/commit/b0f43454))

## 2.12.0 (2024-06-03)

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

## 2.11.0 (2024-05-29)

### Features

- **cloudflare-tools:** Update worker generator to add hono depenendency
  ([946a9e59](https://github.com/storm-software/storm-ops/commit/946a9e59))

## 2.10.2 (2024-05-27)

### Bug Fixes

- **deps:** update patch prod dependencies
  ([a8113435](https://github.com/storm-software/storm-ops/commit/a8113435))

- **deps:** update patch prod dependencies
  ([20ed7f14](https://github.com/storm-software/storm-ops/commit/20ed7f14))

- **deps:** update dependencies-non-major
  ([#159](https://github.com/storm-software/storm-ops/pull/159))

## 2.10.1 (2024-05-06)

### Bug Fixes

- **markdownlint:** Resolved issue with bad config in lint file
  ([95b3aba7](https://github.com/storm-software/storm-ops/commit/95b3aba7))

## 2.10.0 (2024-05-06)

### Features

- **markdownlint:** Added the `markdownlint` package for shared configurations
  ([abd6fa38](https://github.com/storm-software/storm-ops/commit/abd6fa38))

## 2.9.4 (2024-04-29)

### Bug Fixes

- **git-tools:** Update scripts to use deamon to generate Nx Project Graphs
  ([6b6ad2b6](https://github.com/storm-software/storm-ops/commit/6b6ad2b6))

## 2.9.3 (2024-04-29)

### Bug Fixes

- **deps:** update patch prod dependencies
  ([c427e132](https://github.com/storm-software/storm-ops/commit/c427e132))

## 2.9.2 (2024-04-15)

### Bug Fixes

- **config-tools:** Clean up the README markdown
  ([676d23d3](https://github.com/storm-software/storm-ops/commit/676d23d3))

## 2.9.1 (2024-04-15)

### Bug Fixes

- **deps:** update patch prod dependencies
  ([7f710f58](https://github.com/storm-software/storm-ops/commit/7f710f58))

## 2.9.0 (2024-04-13)

### Features

- **git-tools:** Updated the console write calls to use updated method signature
  ([d2d7cc8b](https://github.com/storm-software/storm-ops/commit/d2d7cc8b))

## 2.8.0 (2024-04-13)

### Features

- **config-tools:** No longer require `config` in storm console write functions
  ([ad8c6511](https://github.com/storm-software/storm-ops/commit/ad8c6511))

## 2.7.6 (2024-04-08)

### Bug Fixes

- **build-tools:** Resolved issue with module types used in build
  ([50a368d3](https://github.com/storm-software/storm-ops/commit/50a368d3))

## 2.7.5 (2024-04-08)

### Bug Fixes

- **build-tools:** Resolved issue with duplicate require definition
  ([63aa1d16](https://github.com/storm-software/storm-ops/commit/63aa1d16))

## 2.7.4 (2024-04-08)

### Bug Fixes

- **workspace-tools:** Resolve issues with `build-tools` import
  ([fc040f71](https://github.com/storm-software/storm-ops/commit/fc040f71))

## 2.7.3 (2024-04-08)

### Bug Fixes

- **workspace-tools:** Update module types of imports
  ([9d09009b](https://github.com/storm-software/storm-ops/commit/9d09009b))

## 2.7.2 (2024-04-08)

### Bug Fixes

- **deps:** update patch prod dependencies
  ([3bce6c5e](https://github.com/storm-software/storm-ops/commit/3bce6c5e))

- **deps:** update dependency commander to v12
  ([#63](https://github.com/storm-software/storm-ops/pull/63))

- **deps:** update dependencies-non-major
  ([#38](https://github.com/storm-software/storm-ops/pull/38))

- **deps:** update dependency @commitlint/types to v19
  ([#72](https://github.com/storm-software/storm-ops/pull/72))

- **workspace-tools:** Resolved build issue with typings
  ([97ac0141](https://github.com/storm-software/storm-ops/commit/97ac0141))

- **build-tools:** Resolve issue with Nx API updates
  ([bff53cdc](https://github.com/storm-software/storm-ops/commit/bff53cdc))

- **git-tools:** Resolved issue with invalid release config
  ([382dc9bc](https://github.com/storm-software/storm-ops/commit/382dc9bc))

- **git-tools:** Update release tool to use local function to get configuration
  ([53db7520](https://github.com/storm-software/storm-ops/commit/53db7520))

- **git-tools:** Resolve issue with dependencies
  ([b536fd82](https://github.com/storm-software/storm-ops/commit/b536fd82))

## 2.7.1 (2024-04-08)

### Bug Fixes

- **deps:** pin dependencies
  ([7406e605](https://github.com/storm-software/storm-ops/commit/7406e605))

## 2.7.0 (2024-04-07)

### Features

- **git-tools:** Added reusable GitHub `workflows` and `actions`
  ([1c9a5391](https://github.com/storm-software/storm-ops/commit/1c9a5391))

- **storm-ops:** Merged in change to the main branch
  ([ce79c572](https://github.com/storm-software/storm-ops/commit/ce79c572))

## 2.6.0 (2024-04-06)

### Features

- **build-tools:** Added support for `rolldown` builds
  ([46de2e63](https://github.com/storm-software/storm-ops/commit/46de2e63))

## 2.5.12 (2024-04-01)

### Bug Fixes

- **workspace-tools:** Resolve issue with bad release path in npm publish
  ([4f5ba3db](https://github.com/storm-software/storm-ops/commit/4f5ba3db))

## 2.5.11 (2024-03-29)

### Bug Fixes

- **workspace-tools:** Added the `nx-release-publish` target to TypeScript
  projects
  ([52b61117](https://github.com/storm-software/storm-ops/commit/52b61117))

## 2.5.10 (2024-03-29)

### Bug Fixes

- **workspace-tools:** Further updates to Nx plugin modules
  ([82b6ab01](https://github.com/storm-software/storm-ops/commit/82b6ab01))

## 2.5.9 (2024-03-29)

### Bug Fixes

- **workspace-tools:** Resolve issues applying Nx plugins
  ([7dd277e6](https://github.com/storm-software/storm-ops/commit/7dd277e6))

## 2.5.8 (2024-03-28)

### Bug Fixes

- **git-tools:** Added code to add ts plugin transpilers
  ([ec514d57](https://github.com/storm-software/storm-ops/commit/ec514d57))

- **workspace-tools:** Remove `axios` reference from `cargo-publish` executor
  ([7a2e3570](https://github.com/storm-software/storm-ops/commit/7a2e3570))

## 2.5.7 (2024-03-28)

### Bug Fixes

- **workspace-tools:** Resolve issues with `axios` calls
  ([53306912](https://github.com/storm-software/storm-ops/commit/53306912))

## 2.5.6 (2024-03-28)

### Bug Fixes

- **git-tools:** Update `moduleResolution` option to use `Bundler` value
  ([132eb929](https://github.com/storm-software/storm-ops/commit/132eb929))

## 2.5.5 (2024-03-28)

### Bug Fixes

- **git-tools:** Resolve issue with module type compiler options
  ([5c4a20b7](https://github.com/storm-software/storm-ops/commit/5c4a20b7))

## 2.5.4 (2024-03-28)

### Bug Fixes

- **git-tools:** Ensure we skip ci on publish commit
  ([ab2e0655](https://github.com/storm-software/storm-ops/commit/ab2e0655))

## 2.5.3 (2024-03-28)

### Bug Fixes

- **storm-ops:** Resolve issue with workspace dependencies
  ([041dcc78](https://github.com/storm-software/storm-ops/commit/041dcc78))

## 2.5.2 (2024-03-28)

### Bug Fixes

- **git-tools:** Update to executable git hook scripts
  ([d1e0cb22](https://github.com/storm-software/storm-ops/commit/d1e0cb22))

## 2.5.1 (2024-03-28)

### Bug Fixes

- **storm-ops:** Update the links in the README files to use proper repository
  ([decc0db3](https://github.com/storm-software/storm-ops/commit/decc0db3))

## 2.5.0 (2024-03-25)

### Features

- **workspace-tools:** Added Nx plugin to apply rust and typescript targets
  ([5738161f](https://github.com/storm-software/storm-ops/commit/5738161f))

- **workspace-tools:** Major updates to base nx.json configuration
  ([06ec9a6a](https://github.com/storm-software/storm-ops/commit/06ec9a6a))

### Bug Fixes

- **git-tools:** Resolved issues with `left-hook` scripts
  ([daf28aa2](https://github.com/storm-software/storm-ops/commit/daf28aa2))

## 2.4.0 (2024-03-19)

### Features

- **linting-tools:** Added the `taplo` and `ls-lint` tools
  ([24c984eb](https://github.com/storm-software/storm-ops/commit/24c984eb))

### Bug Fixes

- **git-tools:** Updates to the lefthook scripts execution
  ([ac1f85f3](https://github.com/storm-software/storm-ops/commit/ac1f85f3))

## 2.3.0 (2024-03-05)

### Features

- **build-tools:** Split out Build CLI and supporting code to separate package
  ([9376ed39](https://github.com/storm-software/storm-ops/commit/9376ed39))

## 2.2.7 (2024-03-01)

### Bug Fixes

- **workspace-tools:** Remove the storm env filter
  ([48259eea](https://github.com/storm-software/storm-ops/commit/48259eea))

## 2.2.6 (2024-02-27)

### Bug Fixes

- **workspace-tools:** Relocation config parser code to build function
  ([fa27dea4](https://github.com/storm-software/storm-ops/commit/fa27dea4))

## 2.2.5 (2024-02-27)

### Bug Fixes

- **workspace-tools:** Resolve issue with tsconfig file resolution
  ([0254e50a](https://github.com/storm-software/storm-ops/commit/0254e50a))

## 2.2.4 (2024-02-27)

### Bug Fixes

- **workspace-tools:** Dynamically load tsup module and resolve `testing-tools`
  type issues
  ([c1d51975](https://github.com/storm-software/storm-ops/commit/c1d51975))

## 2.2.3 (2024-02-27)

### Bug Fixes

- **config-tools:** Update config packages to only use cjs
  ([75e4a16b](https://github.com/storm-software/storm-ops/commit/75e4a16b))

## 2.2.2 (2024-02-27)

### Bug Fixes

- **workspace-tools:** Update the build executor back to esbuild
  ([ff200547](https://github.com/storm-software/storm-ops/commit/ff200547))

## 2.2.1 (2024-02-26)

### Bug Fixes

- **git-tools:** Resolved linting issues with the nx-version module
  ([9b5f02d0](https://github.com/storm-software/storm-ops/commit/9b5f02d0))

## 2.2.0 (2024-02-26)

### Features

- **storm-ops:** Major updates to tsconfig values
  ([a3638fae](https://github.com/storm-software/storm-ops/commit/a3638fae))

## 2.1.7 (2024-02-24)

### Bug Fixes

- **workspace-tools:** Update build compiler parameters
  ([3c6cb525](https://github.com/storm-software/storm-ops/commit/3c6cb525))

## 2.1.6 (2024-02-24)

### Bug Fixes

- **git-tools:** Updates to git release workflow processing
  ([3c3dc58f](https://github.com/storm-software/storm-ops/commit/3c3dc58f))

- **git-tools:** Add skip ci to the commit message
  ([74366350](https://github.com/storm-software/storm-ops/commit/74366350))

- **git-tools:** Temporary removal of commit message skip
  ([cc021ec8](https://github.com/storm-software/storm-ops/commit/cc021ec8))

- **git-tools:** Update release processing to skip second commit
  ([fa8fe8f3](https://github.com/storm-software/storm-ops/commit/fa8fe8f3))

- **git-tools:** Update versioning to no longer apply git tag
  ([288c81ca](https://github.com/storm-software/storm-ops/commit/288c81ca))

## 2.1.5 (2024-02-24)

### Bug Fixes

- **git-tools:** Use proper git tag to publish changes
  ([0c8d3230](https://github.com/storm-software/storm-ops/commit/0c8d3230))

- **git-tools:** Updates to the release tag processing
  ([937056c9](https://github.com/storm-software/storm-ops/commit/937056c9))

## 2.1.4 (2024-02-24)

### Bug Fixes

- **git-tools:** Updates to release configuration parameters
  ([482d18ee](https://github.com/storm-software/storm-ops/commit/482d18ee))

## 2.1.3 (2024-02-23)

### Bug Fixes

- **git-tools:** Ensure tag generation during versioning
  ([d08a89cd](https://github.com/storm-software/storm-ops/commit/d08a89cd))

- **git-tools:** Resolved duplicate tag version error
  ([fa743fa6](https://github.com/storm-software/storm-ops/commit/fa743fa6))

- **git-tools:** Resolve issue with release versioning
  ([24bfe5e9](https://github.com/storm-software/storm-ops/commit/24bfe5e9))

## 2.1.2 (2024-02-20)

### Features

- **git-tools:** Update the package to build as CommonJs to support Nx executors
  ([affad63c](https://github.com/storm-software/storm-ops/commit/affad63c))

- **git-tools:** Support for updated Nx Release processing
  ([92f99126](https://github.com/storm-software/storm-ops/commit/92f99126))

### Bug Fixes

- **git-tools:** Resolve issue preventing changelogRenderer from being applied
  ([f7880bae](https://github.com/storm-software/storm-ops/commit/f7880bae))

- **git-tools:** Resolve issue with missing version updates
  ([16385359](https://github.com/storm-software/storm-ops/commit/16385359))

- **git-tools:** Updates to how the changelog renderer is invoked
  ([f38c85fb](https://github.com/storm-software/storm-ops/commit/f38c85fb))

- **git-tools:** Remove custom changelog handling logic
  ([a8015108](https://github.com/storm-software/storm-ops/commit/a8015108))

- **changelog:** Resolve issue with changelog renderer imports
  ([09fe5cb2](https://github.com/storm-software/storm-ops/commit/09fe5cb2))

- **git-tools:** Add reference to local changelog-renderer in release process
  ([3ea469e1](https://github.com/storm-software/storm-ops/commit/3ea469e1))

- **git-tools:** Update method of calling the release action
  ([7c74ffc7](https://github.com/storm-software/storm-ops/commit/7c74ffc7))

- **config:** Mark config to no longer bundle code
  ([2b97e77e](https://github.com/storm-software/storm-ops/commit/2b97e77e))

## 2.1.1 (2024-02-20)

### Features

- **git-tools:** Update the package to build as CommonJs to support Nx executors
  ([affad63c](https://github.com/storm-software/storm-ops/commit/affad63c))

- **git-tools:** Support for updated Nx Release processing
  ([92f99126](https://github.com/storm-software/storm-ops/commit/92f99126))

### Bug Fixes

- **git-tools:** Resolve issue preventing changelogRenderer from being applied
  ([f7880bae](https://github.com/storm-software/storm-ops/commit/f7880bae))

- **git-tools:** Resolve issue with missing version updates
  ([16385359](https://github.com/storm-software/storm-ops/commit/16385359))

- **git-tools:** Updates to how the changelog renderer is invoked
  ([f38c85fb](https://github.com/storm-software/storm-ops/commit/f38c85fb))

- **git-tools:** Remove custom changelog handling logic
  ([a8015108](https://github.com/storm-software/storm-ops/commit/a8015108))

- **changelog:** Resolve issue with changelog renderer imports
  ([09fe5cb2](https://github.com/storm-software/storm-ops/commit/09fe5cb2))

- **git-tools:** Add reference to local changelog-renderer in release process
  ([3ea469e1](https://github.com/storm-software/storm-ops/commit/3ea469e1))

- **git-tools:** Update method of calling the release action
  ([7c74ffc7](https://github.com/storm-software/storm-ops/commit/7c74ffc7))

## 2.1.0 (2024-02-20)

### Features

- **git-tools:** Update the package to build as CommonJs to support Nx executors
  ([affad63c](https://github.com/storm-software/storm-ops/commit/affad63c))

- **git-tools:** Support for updated Nx Release processing
  ([92f99126](https://github.com/storm-software/storm-ops/commit/92f99126))

### Bug Fixes

- **git-tools:** Resolve issue preventing changelogRenderer from being applied
  ([f7880bae](https://github.com/storm-software/storm-ops/commit/f7880bae))

- **git-tools:** Resolve issue with missing version updates
  ([16385359](https://github.com/storm-software/storm-ops/commit/16385359))

- **git-tools:** Updates to how the changelog renderer is invoked
  ([f38c85fb](https://github.com/storm-software/storm-ops/commit/f38c85fb))

- **git-tools:** Remove custom changelog handling logic
  ([a8015108](https://github.com/storm-software/storm-ops/commit/a8015108))

- **changelog:** Resolve issue with changelog renderer imports
  ([09fe5cb2](https://github.com/storm-software/storm-ops/commit/09fe5cb2))

- **git-tools:** Add reference to local changelog-renderer in release process
  ([3ea469e1](https://github.com/storm-software/storm-ops/commit/3ea469e1))

## 2.0.1 (2024-02-17)

### Bug Fixes

- **storm-ops:** Update the chalk version to v4.1.2
  ([0d50334a](https://github.com/storm-software/storm-ops/commit/0d50334a))

- **storm-ops:** Resolve issue with the pnpm version
  ([f124fd94](https://github.com/storm-software/storm-ops/commit/f124fd94))

- **config-tools:** Update package type to a module to resolve import issues
  ([4a9649c9](https://github.com/storm-software/storm-ops/commit/4a9649c9))

- ⚠️ **git-tools:** Arbitrary commit changes
  ([040f4cd2](https://github.com/storm-software/storm-ops/commit/040f4cd2))

- **git-tools:** Resolve linting failures
  ([5715afb9](https://github.com/storm-software/storm-ops/commit/5715afb9))

- **workspace-tools:** Update method of referencing the internal packages
  ([b3f127c4](https://github.com/storm-software/storm-ops/commit/b3f127c4))

- **linting-tools:** Resolved previous linting issues
  ([83b3b199](https://github.com/storm-software/storm-ops/commit/83b3b199))

#### ⚠️ Breaking Changes

- **git-tools:** \

# 2.0.0 (2024-02-17)

### Bug Fixes

- **storm-ops:** Update the chalk version to v4.1.2
  ([0d50334a](https://github.com/storm-software/storm-ops/commit/0d50334a))

- **storm-ops:** Resolve issue with the pnpm version
  ([f124fd94](https://github.com/storm-software/storm-ops/commit/f124fd94))

- **config-tools:** Update package type to a module to resolve import issues
  ([4a9649c9](https://github.com/storm-software/storm-ops/commit/4a9649c9))

- ⚠️ **git-tools:** Arbitrary commit changes
  ([040f4cd2](https://github.com/storm-software/storm-ops/commit/040f4cd2))

- **git-tools:** Resolve linting failures
  ([5715afb9](https://github.com/storm-software/storm-ops/commit/5715afb9))

#### ⚠️ Breaking Changes

- **git-tools:** \

## 1.38.5 (2024-02-15)

### Bug Fixes

- **storm-ops:** Update the chalk version to v4.1.2
  ([0d50334a](https://github.com/storm-software/storm-ops/commit/0d50334a))

- **storm-ops:** Resolve issue with the pnpm version
  ([f124fd94](https://github.com/storm-software/storm-ops/commit/f124fd94))

- **config-tools:** Update package type to a module to resolve import issues
  ([4a9649c9](https://github.com/storm-software/storm-ops/commit/4a9649c9))

## 1.38.4 (2024-02-15)

### Bug Fixes

- **storm-ops:** Update the chalk version to v4.1.2
  ([0d50334a](https://github.com/storm-software/storm-ops/commit/0d50334a))

- **storm-ops:** Resolve issue with the pnpm version
  ([f124fd94](https://github.com/storm-software/storm-ops/commit/f124fd94))

## 1.38.3 (2024-02-15)

### Bug Fixes

- **storm-ops:** Update the chalk version to v4.1.2
  ([0d50334a](https://github.com/storm-software/storm-ops/commit/0d50334a))

## 1.38.2 (2024-02-15)

### Features

- **git-tools:** Completed release process changes and updated dependencies
  ([ebd33d5c](https://github.com/storm-software/storm-ops/commit/ebd33d5c))

### Bug Fixes

- **storm-ops:** Update chalk dependency for all modules
  ([d8a55c49](https://github.com/storm-software/storm-ops/commit/d8a55c49))

- **storm-ops:** Downgrade dependencies to work with cjs task runners
  ([bece51de](https://github.com/storm-software/storm-ops/commit/bece51de))

## 1.38.1 (2024-02-15)

### Features

- **git-tools:** Completed release process changes and updated dependencies
  ([ebd33d5c](https://github.com/storm-software/storm-ops/commit/ebd33d5c))

### Bug Fixes

- **storm-ops:** Update chalk dependency for all modules
  ([d8a55c49](https://github.com/storm-software/storm-ops/commit/d8a55c49))

## 1.38.0 (2024-02-15)

### Features

- **git-tools:** Completed release process changes and updated dependencies
  ([ebd33d5c](https://github.com/storm-software/storm-ops/commit/ebd33d5c))

## 1.37.0 (2024-02-15)

### Features

- **changelog:** Added the `changelog` package to handle file creation during
  release
  ([d050648d](https://github.com/storm-software/storm-ops/commit/d050648d))

### Bug Fixes

- **workspace-tools:** Point the `nx.json` to the Storm ChangeLogRenderer class
  ([f6620cef](https://github.com/storm-software/storm-ops/commit/f6620cef))

- **git-tools:** Update parameters passed to nx release functions
  ([1108f889](https://github.com/storm-software/storm-ops/commit/1108f889))

- **git-tools:** Resolved issues around pushing changes to changelog files
  ([6d29c04f](https://github.com/storm-software/storm-ops/commit/6d29c04f))

- **git-tools:** Resolved linting errors from previous commit
  ([0cc57b66](https://github.com/storm-software/storm-ops/commit/0cc57b66))

## 1.36.14 (2024-02-13)

### Bug Fixes

- **git-tools:** Updated logging in the Storm-Git release hook
  ([669a289a](https://github.com/storm-software/storm-ops/commit/669a289a))

## 1.36.13 (2024-02-11)

### Bug Fixes

- **git-tools:** Removed the emojis from the Changelog Renderer
  ([93d5d140](https://github.com/storm-software/storm-ops/commit/93d5d140))

## 1.36.11 (2024-02-09)

### Bug Fixes

- **config-tools:** Updated the color of the logger text
  ([63016bd6](https://github.com/storm-software/storm-ops/commit/63016bd6))

## 1.36.6 (2024-02-09)

### Bug Fixes

- **workspace-tools:** Resolved issue publishing first package releases to npm
  ([8205dfcf](https://github.com/storm-software/storm-ops/commit/8205dfcf))

## 1.36.4 (2024-02-09)

### Bug Fixes

- **linting-tools:** Ensure correct parameter is passed to lefthook
  ([3fe19f4b](https://github.com/storm-software/storm-ops/commit/3fe19f4b))

## 1.36.3 (2024-02-09)

### Bug Fixes

- **linting-tools:** Added `--no-errors-on-unmatched` to format command
  ([c7bd849a](https://github.com/storm-software/storm-ops/commit/c7bd849a))

## 1.36.2 (2024-02-09)

### Bug Fixes

- **linting-tools:** Ensure we use `build:all` script during linting
  ([848bd1cf](https://github.com/storm-software/storm-ops/commit/848bd1cf))

## 1.35.0 (2024-02-07)

### Features

- **config:** Added a base config package to allow neutral access of
  `StormConfig`
  ([164eaa5b](https://github.com/storm-software/storm-ops/commit/164eaa5b))

## 1.32.12 (2024-01-29)

### Bug Fixes

- **workspace-tools:** Added full publish fields to target
  ([921dc2b6](https://github.com/storm-software/storm-ops/commit/921dc2b6))

## 1.32.11 (2024-01-29)

### Bug Fixes

- **workspace-tools:** Added full publish fields to target
  ([921dc2b6](https://github.com/storm-software/storm-ops/commit/921dc2b6))

## 1.32.10 (2024-01-28)

### Bug Fixes

- **workspace-tools:** Added full publish fields to target
  ([921dc2b6](https://github.com/storm-software/storm-ops/commit/921dc2b6))

## 1.32.9 (2024-01-28)

### Bug Fixes

- **workspace-tools:** Added full publish fields to target
  ([921dc2b6](https://github.com/storm-software/storm-ops/commit/921dc2b6))

## 1.32.8 (2024-01-28)

### Bug Fixes

- **workspace-tools:** Added full publish fields to target
  ([921dc2b6](https://github.com/storm-software/storm-ops/commit/921dc2b6))

## 1.32.7 (2024-01-28)

### Bug Fixes

- **workspace-tools:** Added the nx-release-publish task to project target
  ([cb6d7c17](https://github.com/storm-software/storm-ops/commit/cb6d7c17))

## 1.32.6 (2024-01-28)

### Bug Fixes

- **git-tools:** Correct the asset output paths
  ([7cf40f6d](https://github.com/storm-software/storm-ops/commit/7cf40f6d))

## 1.32.5 (2024-01-28)

### Bug Fixes

- **git-tools:** Reformat display message
  ([7ec1ff23](https://github.com/storm-software/storm-ops/commit/7ec1ff23))

## 1.32.4 (2024-01-27)

### Bug Fixes

- **git-tools:** Added skip ci to release commit message
  ([2e808a18](https://github.com/storm-software/storm-ops/commit/2e808a18))

## 1.32.3 (2024-01-27)

### Bug Fixes

- **git-tools:** Added back newlines to the commit message
  ([114a3d71](https://github.com/storm-software/storm-ops/commit/114a3d71))

## 1.32.0 (2024-01-27)

### Features

- **config-tools:** Added the `preid` config option and removed `preMajor`
  ([0d8756dc](https://github.com/storm-software/storm-ops/commit/0d8756dc))

## 1.31.2 (2024-01-26)

### Bug Fixes

- **git-tools:** Added code to set providence on publish process
  ([06439ff3](https://github.com/storm-software/storm-ops/commit/06439ff3))

## 1.29.7 (2024-01-23)

### Bug Fixes

- **git-tools:** Remove the install hook from pre-commit
  ([75104c7e](https://github.com/storm-software/storm-ops/commit/75104c7e))

## 1.29.6 (2024-01-23)

### Bug Fixes

- **git-tools:** Update the lefthook configuration to correctly handle install
  ([e27fd423](https://github.com/storm-software/storm-ops/commit/e27fd423))

## 1.29.0 (2024-01-21)

### Features

- **git-tools:** Added custom storm `ChangelogRenderer` for releases
  ([922aa263](https://github.com/storm-software/storm-ops/commit/922aa263))

### Bug Fixes

- **git-tools:** Update path to changelog renderer
  ([d4dd7006](https://github.com/storm-software/storm-ops/commit/d4dd7006))

- **git-tools:** Added separate changelog-renderer CommonJs build
  ([4da88acb](https://github.com/storm-software/storm-ops/commit/4da88acb))

## 1.28.5 (2024-01-21)

### Bug Fixes

- **git-tools:** Resolve issues with commit message formatting
  ([90bdc930](https://github.com/storm-software/storm-ops/commit/90bdc930))

## 1.28.4 (2024-01-21)

### Bug Fixes

- **git-tools:** Resolve issues with commit message formatting
  ([90bdc930](https://github.com/storm-software/storm-ops/commit/90bdc930))

## 1.28.3 (2024-01-21)

### Features

- **git-tools:** Update release process to use built-in Nx functionality
  ([f592bd33](https://github.com/storm-software/storm-ops/commit/f592bd33))

### Bug Fixes

- **git-tools:** Clean up of various unused dependencies
  ([c39257b8](https://github.com/storm-software/storm-ops/commit/c39257b8))

- **git-tools:** Add git format specification
  ([c5297382](https://github.com/storm-software/storm-ops/commit/c5297382))

- **git-tools:** Changing format of the generated git tag
  ([55a19275](https://github.com/storm-software/storm-ops/commit/55a19275))

- **git-tools:** Apply tag format through command line args
  ([b7d9294a](https://github.com/storm-software/storm-ops/commit/b7d9294a))

- **git-tools:** Added missing git tags
  ([190d43f0](https://github.com/storm-software/storm-ops/commit/190d43f0))

- **git-tools:** Update the order of commits
  ([b017bf1d](https://github.com/storm-software/storm-ops/commit/b017bf1d))

- **git-tools:** Modified release to not commit on version processing
  ([4768a1ae](https://github.com/storm-software/storm-ops/commit/4768a1ae))

- **workspace-tools:** Added logging to the release process
  ([2f905859](https://github.com/storm-software/storm-ops/commit/2f905859))

- **git-tools:** Remove the git extension from the repository URL
  ([50a6de3d](https://github.com/storm-software/storm-ops/commit/50a6de3d))

- **git-tools:** Update release logging level
  ([ea0f7e35](https://github.com/storm-software/storm-ops/commit/ea0f7e35))

- **git-tools:** Update the remote name to point to origin
  ([ae84b6d5](https://github.com/storm-software/storm-ops/commit/ae84b6d5))

- **git-tools:** Update tag to be false in release config
  ([e41d1327](https://github.com/storm-software/storm-ops/commit/e41d1327))

- **git-tools:** Resolved issue with modules imports
  ([4aa7abed](https://github.com/storm-software/storm-ops/commit/4aa7abed))

- **git-tools:** Update release to use Nx config relationship settings
  ([9f0a7519](https://github.com/storm-software/storm-ops/commit/9f0a7519))

## 1.28.2 (2024-01-21)

### Features

- **git-tools:** Update release process to use built-in Nx functionality
  ([f592bd33](https://github.com/storm-software/storm-ops/commit/f592bd33))

### Bug Fixes

- **git-tools:** Clean up of various unused dependencies
  ([c39257b8](https://github.com/storm-software/storm-ops/commit/c39257b8))

- **git-tools:** Add git format specification
  ([c5297382](https://github.com/storm-software/storm-ops/commit/c5297382))

- **git-tools:** Changing format of the generated git tag
  ([55a19275](https://github.com/storm-software/storm-ops/commit/55a19275))

- **git-tools:** Apply tag format through command line args
  ([b7d9294a](https://github.com/storm-software/storm-ops/commit/b7d9294a))

- **git-tools:** Added missing git tags
  ([190d43f0](https://github.com/storm-software/storm-ops/commit/190d43f0))

- **git-tools:** Update the order of commits
  ([b017bf1d](https://github.com/storm-software/storm-ops/commit/b017bf1d))

- **git-tools:** Modified release to not commit on version processing
  ([4768a1ae](https://github.com/storm-software/storm-ops/commit/4768a1ae))

- **workspace-tools:** Added logging to the release process
  ([2f905859](https://github.com/storm-software/storm-ops/commit/2f905859))

- **git-tools:** Remove the git extension from the repository URL
  ([50a6de3d](https://github.com/storm-software/storm-ops/commit/50a6de3d))

- **git-tools:** Update release logging level
  ([ea0f7e35](https://github.com/storm-software/storm-ops/commit/ea0f7e35))

- **git-tools:** Update the remote name to point to origin
  ([ae84b6d5](https://github.com/storm-software/storm-ops/commit/ae84b6d5))

- **git-tools:** Update tag to be false in release config
  ([e41d1327](https://github.com/storm-software/storm-ops/commit/e41d1327))

- **git-tools:** Resolved issue with modules imports
  ([4aa7abed](https://github.com/storm-software/storm-ops/commit/4aa7abed))

- **git-tools:** Update release to use Nx config relationship settings
  ([9f0a7519](https://github.com/storm-software/storm-ops/commit/9f0a7519))

## 1.28.1 (2024-01-21)

### Features

- **git-tools:** Update release process to use built-in Nx functionality
  ([f592bd33](https://github.com/storm-software/storm-ops/commit/f592bd33))

### Bug Fixes

- **git-tools:** Clean up of various unused dependencies
  ([c39257b8](https://github.com/storm-software/storm-ops/commit/c39257b8))

- **git-tools:** Add git format specification
  ([c5297382](https://github.com/storm-software/storm-ops/commit/c5297382))

- **git-tools:** Changing format of the generated git tag
  ([55a19275](https://github.com/storm-software/storm-ops/commit/55a19275))

- **git-tools:** Apply tag format through command line args
  ([b7d9294a](https://github.com/storm-software/storm-ops/commit/b7d9294a))

- **git-tools:** Added missing git tags
  ([190d43f0](https://github.com/storm-software/storm-ops/commit/190d43f0))

- **git-tools:** Update the order of commits
  ([b017bf1d](https://github.com/storm-software/storm-ops/commit/b017bf1d))

- **git-tools:** Modified release to not commit on version processing
  ([4768a1ae](https://github.com/storm-software/storm-ops/commit/4768a1ae))

- **workspace-tools:** Added logging to the release process
  ([2f905859](https://github.com/storm-software/storm-ops/commit/2f905859))

- **git-tools:** Remove the git extension from the repository URL
  ([50a6de3d](https://github.com/storm-software/storm-ops/commit/50a6de3d))

- **git-tools:** Update release logging level
  ([ea0f7e35](https://github.com/storm-software/storm-ops/commit/ea0f7e35))

- **git-tools:** Update the remote name to point to origin
  ([ae84b6d5](https://github.com/storm-software/storm-ops/commit/ae84b6d5))

- **git-tools:** Update tag to be false in release config
  ([e41d1327](https://github.com/storm-software/storm-ops/commit/e41d1327))

- **git-tools:** Resolved issue with modules imports
  ([4aa7abed](https://github.com/storm-software/storm-ops/commit/4aa7abed))

- **git-tools:** Update release to use Nx config relationship settings
  ([9f0a7519](https://github.com/storm-software/storm-ops/commit/9f0a7519))

# [1.28.0](https://github.com/storm-software/storm-ops/compare/git-tools-v1.27.0...git-tools-v1.28.0) (2024-01-20)

### Features

- **workspace-tools:** Added the `skipNativeModulesPlugin` option to tsup build
  ([eb5ade8](https://github.com/storm-software/storm-ops/commit/eb5ade8320372a792c9ca97fa9f843e63f2601d1))

# [1.27.0](https://github.com/storm-software/storm-ops/compare/git-tools-v1.26.2...git-tools-v1.27.0) (2024-01-19)

### Features

- **config-tools:** Added the `getConfigFileByName` function export
  ([9f56a9c](https://github.com/storm-software/storm-ops/commit/9f56a9ca2c1df0bccbf533cc63f15602e8de0dff))

## [1.26.2](https://github.com/storm-software/storm-ops/compare/git-tools-v1.26.1...git-tools-v1.26.2) (2024-01-19)

### Bug Fixes

- **config-tools:** Added the `defineConfig` function to type-check config
  options
  ([0676271](https://github.com/storm-software/storm-ops/commit/0676271161ec4a04715fb495f55042328a9f116f))

## [1.26.1](https://github.com/storm-software/storm-ops/compare/git-tools-v1.26.0...git-tools-v1.26.1) (2024-01-19)

### Bug Fixes

- **git-tools:** Updated the base lefthook config file
  ([5fc8e10](https://github.com/storm-software/storm-ops/commit/5fc8e10a0eb176148bf57d45c176f8e6fdf309c6))

# [1.26.0](https://github.com/storm-software/storm-ops/compare/git-tools-v1.25.2...git-tools-v1.26.0) (2024-01-19)

### Bug Fixes

- **config-tools:** Rerun ci pipeline
  ([d855670](https://github.com/storm-software/storm-ops/commit/d855670faf558969a592b8b6666754280c0dc829))
- **config-tools:** Resolved the issue with the tsconfig properties
  ([5bc729e](https://github.com/storm-software/storm-ops/commit/5bc729e4680f2bb8ce67a2f6a85dff875bef9997))
- **config-tools:** Skip type checks
  ([c7da786](https://github.com/storm-software/storm-ops/commit/c7da78609234d5eb0998465c9d38fe10eb02d205))
- **config-tools:** Update lefthook config to call install prior to push
  ([6a81b6a](https://github.com/storm-software/storm-ops/commit/6a81b6a27359ab41549cb93227d28c5fc1b2ee01))
- **git-tools:** Fixed issue with bad validation in pre-push hook
  ([5eeb926](https://github.com/storm-software/storm-ops/commit/5eeb9260088689d370c1b178b2ffa3bd4b110396))
- **git-tools:** Resolved issue preventing git-tools publish
  ([1bf9727](https://github.com/storm-software/storm-ops/commit/1bf97271e3421b5c485708ed2c59da815cde6c4b))
- **git-tools:** Resolved issues around the new paths used in git-tools
  ([b2e0074](https://github.com/storm-software/storm-ops/commit/b2e00740de8a1081282a5b090c975ef43d2799c5))
- **git-tools:** Resolved the issue with the missing release plugin
  ([15cc054](https://github.com/storm-software/storm-ops/commit/15cc054a1e538f55fe246db79622281f48972193))
- **git-tools:** Resovled issues with lock file versions
  ([3740dc2](https://github.com/storm-software/storm-ops/commit/3740dc2392a8c4fcb0beae0816afeaea1573f6ae))
- **git-tools:** Upgrade Nx version and resolved import issues
  ([53432f2](https://github.com/storm-software/storm-ops/commit/53432f2b318c24bc0d65cf2509d01861c0c6f91b))
- **git-tools:** Upgrade pnpm lock file
  ([daa3d32](https://github.com/storm-software/storm-ops/commit/daa3d32fd692799b036556ccf04279507410e4eb))

### Features

- **git-tools:** Redesigned the executable script structure
  ([a4c097b](https://github.com/storm-software/storm-ops/commit/a4c097bd38a68ca0c206686b592d994fb643a5d2))

## [1.25.2](https://github.com/storm-software/storm-ops/compare/git-tools-v1.25.1...git-tools-v1.25.2) (2024-01-19)

### Bug Fixes

- **git-tools:** Fixed issue with early checked in files
  ([8ffde96](https://github.com/storm-software/storm-ops/commit/8ffde96f22e788b6c44c737f0246a8d0ba4ff422))
- **git-tools:** Updated executable scripts to use correct directory
  ([8bd14e7](https://github.com/storm-software/storm-ops/commit/8bd14e7b1d78ece17f314ef172c344e927c0736d))

## [1.25.1](https://github.com/storm-software/storm-ops/compare/git-tools-v1.25.0...git-tools-v1.25.1) (2024-01-18)

### Bug Fixes

- **config-tools:** Resolved empty config file loading error
  ([6b84a12](https://github.com/storm-software/storm-ops/commit/6b84a12f762ac038d9ca6131249c8b51979d0320))

# [1.25.0](https://github.com/storm-software/storm-ops/compare/git-tools-v1.24.15...git-tools-v1.25.0) (2024-01-18)

### Features

- **workspace-tools:** Added the `typia` executor
  ([feb49f7](https://github.com/storm-software/storm-ops/commit/feb49f71a2b54c14c4ea34ebbde529b89e6b4b42))

## [1.24.15](https://github.com/storm-software/storm-ops/compare/git-tools-v1.24.14...git-tools-v1.24.15) (2024-01-18)

### Bug Fixes

- **linting-tools:** Updated ignored files in biome linter
  ([54520d2](https://github.com/storm-software/storm-ops/commit/54520d24ffc860401b57cab2d28a2565c352a7e9))

## [1.24.14](https://github.com/storm-software/storm-ops/compare/git-tools-v1.24.13...git-tools-v1.24.14) (2024-01-17)

### Bug Fixes

- **workspace-tools:** Patched transformer functions in tsup dependency
  ([f6412b4](https://github.com/storm-software/storm-ops/commit/f6412b437bb5d3122573f1e0ff877ac20f4ad947))

## [1.24.13](https://github.com/storm-software/storm-ops/compare/git-tools-v1.24.12...git-tools-v1.24.13) (2024-01-17)

### Bug Fixes

- **workspace-tools:** Resolved blocking issue preventing tsup build completion
  ([e13f88f](https://github.com/storm-software/storm-ops/commit/e13f88f4c98eda68ec3d45c3b48caba533243b55))

## [1.24.12](https://github.com/storm-software/storm-ops/compare/git-tools-v1.24.11...git-tools-v1.24.12) (2024-01-17)

### Bug Fixes

- **config-tools:** Ensure colors are set correctly
  ([e6fffd0](https://github.com/storm-software/storm-ops/commit/e6fffd0c6554d2fa36e3a4b8b44b443c030aa831))

## [1.24.11](https://github.com/storm-software/storm-ops/compare/git-tools-v1.24.10...git-tools-v1.24.11) (2024-01-17)

### Bug Fixes

- **config-tools:** Fixed config value defaulting issue for booleans
  ([c54c60b](https://github.com/storm-software/storm-ops/commit/c54c60b1ddd533530571dd41fd9b6502c1cb2cb8))

## [1.24.10](https://github.com/storm-software/storm-ops/compare/git-tools-v1.24.9...git-tools-v1.24.10) (2024-01-17)

### Bug Fixes

- **config-tools:** Ehanced config values assignement logic
  ([d66dcf7](https://github.com/storm-software/storm-ops/commit/d66dcf7500d15bc85065cb5676a1fb585d44d94b))

## [1.24.9](https://github.com/storm-software/storm-ops/compare/git-tools-v1.24.8...git-tools-v1.24.9) (2024-01-17)

### Bug Fixes

- **config-tools:** Added code to print out config values added
  ([ea56410](https://github.com/storm-software/storm-ops/commit/ea56410f9e7e9f3e4f68268395a13127a1653d2d))

## [1.24.8](https://github.com/storm-software/storm-ops/compare/git-tools-v1.24.7...git-tools-v1.24.8) (2024-01-17)

### Bug Fixes

- **config-tools:** Removed unused defaulting logic for config file
  ([2770efd](https://github.com/storm-software/storm-ops/commit/2770efde7032b88e6bf20fb23c5b89060175db5d))

## [1.24.7](https://github.com/storm-software/storm-ops/compare/git-tools-v1.24.6...git-tools-v1.24.7) (2024-01-17)

### Bug Fixes

- **config-tools:** Resolved issue with bad config file lookup logic
  ([9967de4](https://github.com/storm-software/storm-ops/commit/9967de48b063a83f42c74c3f6dd667d31123dc6f))
- **workspace-tools:** Resolved issue with config file names changing
  ([f18c40c](https://github.com/storm-software/storm-ops/commit/f18c40c1be8c154aff163692e79351b34accb991))

## [1.24.6](https://github.com/storm-software/storm-ops/compare/git-tools-v1.24.5...git-tools-v1.24.6) (2024-01-17)

### Bug Fixes

- **workspace-tools:** Added code to properly parse out the config file
  ([c345fef](https://github.com/storm-software/storm-ops/commit/c345fefc6389a9a10b3f5b8446eb76982f45e6f7))

## [1.24.5](https://github.com/storm-software/storm-ops/compare/git-tools-v1.24.4...git-tools-v1.24.5) (2024-01-17)

### Bug Fixes

- **workspace-tools:** Removed instance of JSDocs parser in tsup patch
  ([4c8448e](https://github.com/storm-software/storm-ops/commit/4c8448eed32092d203621d4e05526a89d4b8e216))

## [1.24.4](https://github.com/storm-software/storm-ops/compare/git-tools-v1.24.3...git-tools-v1.24.4) (2024-01-17)

### Bug Fixes

- **git-tools:** Resolved issue with logging strings
  ([21d9e0d](https://github.com/storm-software/storm-ops/commit/21d9e0dc7f21820909697577931d0c7b339755b7))
- **workspace-tools:** Remove the transform code from tsup patch
  ([399c910](https://github.com/storm-software/storm-ops/commit/399c910f0ca46741cc97b06f2a0812adbf7910f0))

## [1.24.3](https://github.com/storm-software/storm-ops/compare/git-tools-v1.24.2...git-tools-v1.24.3) (2024-01-16)

### Bug Fixes

- **workspace-tools:** Clean up code to apply getConfig option in tsup build
  ([96227fd](https://github.com/storm-software/storm-ops/commit/96227fde3d3f2871a88aa24be9206d555d373c9b))

## [1.24.2](https://github.com/storm-software/storm-ops/compare/git-tools-v1.24.1...git-tools-v1.24.2) (2024-01-16)

### Bug Fixes

- **git-tools:** Updated console formatting and text colors
  ([82e869f](https://github.com/storm-software/storm-ops/commit/82e869f0395d112c0a2906223e0827fd9b243e54))

## [1.24.1](https://github.com/storm-software/storm-ops/compare/git-tools-v1.24.0...git-tools-v1.24.1) (2024-01-16)

### Bug Fixes

- **git-tools:** Resolved logging issues with git hooks and tsup build
  ([daeec6e](https://github.com/storm-software/storm-ops/commit/daeec6efaad169b6947eedef1a07339c0b52409c))

# [1.24.0](https://github.com/storm-software/storm-ops/compare/git-tools-v1.23.3...git-tools-v1.24.0) (2024-01-15)

### Features

- **workspace-tools:** Added logger functions to use in the repo's console CLI
  apps
  ([c38d262](https://github.com/storm-software/storm-ops/commit/c38d26271cfee4e8fd094526b431e098d186a667))

## [1.23.3](https://github.com/storm-software/storm-ops/compare/git-tools-v1.23.2...git-tools-v1.23.3) (2024-01-15)

### Bug Fixes

- **workspace-tools:** Many code quality improvements and enhanced linting rules
  ([d2123cf](https://github.com/storm-software/storm-ops/commit/d2123cf87850b1442b8e7c1ed4b3ccc07f2a8673))

## [1.23.2](https://github.com/storm-software/storm-ops/compare/git-tools-v1.23.1...git-tools-v1.23.2) (2024-01-15)

### Bug Fixes

- **git-tools:** Added dependency override for `request` package to prevent
  request forgery exposure
  ([1f42b96](https://github.com/storm-software/storm-ops/commit/1f42b96518e944a3b1e5a3e38dfc1c7dc1a7241f))

## [1.23.1](https://github.com/storm-software/storm-ops/compare/git-tools-v1.23.0...git-tools-v1.23.1) (2024-01-15)

### Bug Fixes

- **linting-tools:** Resolve Dependabot Alerts
  [#1](https://github.com/storm-software/storm-ops/issues/1),
  [#2](https://github.com/storm-software/storm-ops/issues/2),
  [#3](https://github.com/storm-software/storm-ops/issues/3), and
  [#4](https://github.com/storm-software/storm-ops/issues/4)
  ([88253ba](https://github.com/storm-software/storm-ops/commit/88253ba59b21442d7af2f1f3cb958d9e9d13289e))

# [1.23.0](https://github.com/storm-software/storm-ops/compare/git-tools-v1.22.1...git-tools-v1.23.0) (2024-01-15)

### Bug Fixes

- **git-tools:** Resolved git hook issue with git-lfs calls
  ([e7e7a57](https://github.com/storm-software/storm-ops/commit/e7e7a5723e84b23d28037954787fd01a868c6e58))
- **linting-tools:** Various improvements to the biome formatter and linter
  configuration
  ([1dfd480](https://github.com/storm-software/storm-ops/commit/1dfd4802024427b6041fc09f6bdaa01d7be8783b))
- **workspace-tools:** Enhanced tsup executor logging to use `LogLevel` from
  config
  ([75517d2](https://github.com/storm-software/storm-ops/commit/75517d24e663611c8b75c8ca5d9bcd04b4c4bc40))

### Features

- **git-tools:** Added default `lefthook` and `biome` configuration
  ([489bec2](https://github.com/storm-software/storm-ops/commit/489bec287d5d8d556746df25ab44856c2ae368b7))
- **git-tools:** Added the `format` hook command to lefthook
  ([cca82b6](https://github.com/storm-software/storm-ops/commit/cca82b64aeba60d8bb6194e03c048fc044f7ef3d))

## [1.22.1](https://github.com/storm-software/storm-ops/compare/git-tools-v1.22.0...git-tools-v1.22.1) (2024-01-14)

### Bug Fixes

- **workspace-tools:** Cleaned up dependanies and option defaulting in tsup
  ([0ae0dd3](https://github.com/storm-software/storm-ops/commit/0ae0dd327ed646e6dbcd1c33b44aef820403cd77))

# [1.22.0](https://github.com/storm-software/storm-ops/compare/git-tools-v1.21.1...git-tools-v1.22.0) (2024-01-14)

### Features

- **git-tools:** Improved all CLI tools and git hooks to use the `zx` package
  ([a905c21](https://github.com/storm-software/storm-ops/commit/a905c213d710d995cc114b32a90bf4d042c550d6))

## [1.21.1](https://github.com/storm-software/storm-ops/compare/git-tools-v1.21.0...git-tools-v1.21.1) (2024-01-14)

### Bug Fixes

- **workspace-tools:** Resolved runtime issues with tsup build
  ([052c78c](https://github.com/storm-software/storm-ops/commit/052c78ca8258ba4acadbfce18b1bc3bee2aa0fe3))

# [1.21.0](https://github.com/storm-software/storm-ops/compare/git-tools-v1.20.0...git-tools-v1.21.0) (2024-01-14)

### Bug Fixes

- **storm-ops:** Added missing dependencies
  ([4ab8aee](https://github.com/storm-software/storm-ops/commit/4ab8aeeab3b7ca4610a3ef0adb31332688c8346a))

### Features

- **git-tools:** Re-added the Git hooks to drive workspace processing
  ([24311bf](https://github.com/storm-software/storm-ops/commit/24311bfde1becaba5573c4a55d1a6d68e84eb4fb))
- **linting-tools:** Added Typia compiler transformer to tsup build
  ([5b39221](https://github.com/storm-software/storm-ops/commit/5b39221dedcc63c21b15f653f56efb4f5cf20989))

# [1.20.0](https://github.com/storm-software/storm-ops/compare/git-tools-v1.19.1...git-tools-v1.20.0) (2024-01-13)

### Features

- **workspace-tools:** Added Typia compiler transformer to tsup build
  ([2b5645f](https://github.com/storm-software/storm-ops/commit/2b5645f8603ba06437b7311dc0652be5927e3168))

## [1.19.1](https://github.com/storm-software/storm-ops/compare/git-tools-v1.19.0...git-tools-v1.19.1) (2024-01-12)

### Bug Fixes

- **workspace-tools:** Removed legacy config from neutral tsup build
  ([4e1cce7](https://github.com/storm-software/storm-ops/commit/4e1cce7122194d6d0364a564115ebdebe7eab46b))

# [1.19.0](https://github.com/storm-software/storm-ops/compare/git-tools-v1.18.3...git-tools-v1.19.0) (2024-01-11)

### Features

- **workspace-tools:** Added `metafile` option to tsup build
  ([f3c982c](https://github.com/storm-software/storm-ops/commit/f3c982c16a29d2034b9087bc86cf61a776e1445b))

## [1.18.3](https://github.com/storm-software/storm-ops/compare/git-tools-v1.18.2...git-tools-v1.18.3) (2023-12-26)

### Bug Fixes

- **linting-tools:** Added tailwindcss prettier formatting to linting tools
  ([a8072f2](https://github.com/storm-software/storm-ops/commit/a8072f2f92a4cc9e93ef173574ff142cf23c13f7))

## [1.18.2](https://github.com/storm-software/storm-ops/compare/git-tools-v1.18.1...git-tools-v1.18.2) (2023-12-24)

### Bug Fixes

- **git-tools:** Ensure lint stange is not ran concurrently
  ([3fab5d6](https://github.com/storm-software/storm-ops/commit/3fab5d65ae00b6db3d0441913d35432448e498ce))

## [1.18.1](https://github.com/storm-software/storm-ops/compare/git-tools-v1.18.0...git-tools-v1.18.1) (2023-12-23)

### Bug Fixes

- **git-tools:** Updated command execution in git hooks
  ([5ec4f55](https://github.com/storm-software/storm-ops/commit/5ec4f556b58025b1d3880c8696a1e065e4fe0d57))

# [1.18.0](https://github.com/storm-software/storm-ops/compare/git-tools-v1.17.4...git-tools-v1.18.0) (2023-12-21)

### Features

- **config-tools:** Added the `findWorkspaceRootSync` and
  `findWorkspaceRootSafeSync` functions
  ([59e0ee4](https://github.com/storm-software/storm-ops/commit/59e0ee4779a15752fb035d235b929bb3e8ecc974))

## [1.17.4](https://github.com/storm-software/storm-ops/compare/git-tools-v1.17.3...git-tools-v1.17.4) (2023-12-21)

### Bug Fixes

- **config-tools:** Remove unused dependencies
  ([ef00034](https://github.com/storm-software/storm-ops/commit/ef00034e8a79b81147056ee32a12eaa991a0d4f3))

## [1.17.3](https://github.com/storm-software/storm-ops/compare/git-tools-v1.17.2...git-tools-v1.17.3) (2023-12-20)

### Bug Fixes

- **config-tools:** Added more accurate search for workspace root
  ([c418b08](https://github.com/storm-software/storm-ops/commit/c418b08c8bb8917e562bef50cb324d66244d98a3))

## [1.17.2](https://github.com/storm-software/storm-ops/compare/git-tools-v1.17.1...git-tools-v1.17.2) (2023-12-20)

### Bug Fixes

- **config-tools:** Update project config to no longer bundle
  ([06b72cd](https://github.com/storm-software/storm-ops/commit/06b72cdea2b85826571d177dad1cb352769c0f76))

## [1.17.1](https://github.com/storm-software/storm-ops/compare/git-tools-v1.17.0...git-tools-v1.17.1) (2023-12-17)

### Bug Fixes

- **git-tools:** Update the env names to align with config parameters
  ([f7438f0](https://github.com/storm-software/storm-ops/commit/f7438f048d52a598bb11e742b1549153e58237c8))

# [1.17.0](https://github.com/storm-software/storm-ops/compare/git-tools-v1.16.0...git-tools-v1.17.0) (2023-12-15)

### Features

- **design-tools:** Added design tools package to support storm design systems
  ([187a38f](https://github.com/storm-software/storm-ops/commit/187a38fc7ce8f992ff96ad210058089da909f1b6))

# [1.16.0](https://github.com/storm-software/storm-ops/compare/git-tools-v1.15.1...git-tools-v1.16.0) (2023-12-12)

### Features

- **workspace-tools:** Added the `packageAll` option to build nested package
  files
  ([cf18588](https://github.com/storm-software/storm-ops/commit/cf18588e55e491f984affecd040c95298f0cf273))

## [1.15.1](https://github.com/storm-software/storm-ops/compare/git-tools-v1.15.0...git-tools-v1.15.1) (2023-12-11)

### Bug Fixes

- **workspace-tools:** Resolved issue with bad nx.json config
  ([1753feb](https://github.com/storm-software/storm-ops/commit/1753febc615fa341af86d49981905221153dbcfb))

# [1.15.0](https://github.com/storm-software/storm-ops/compare/git-tools-v1.14.9...git-tools-v1.15.0) (2023-12-09)

### Features

- **workspace-tools:** Added `esbuild-plugin-handlebars` plugin
  ([5859957](https://github.com/storm-software/storm-ops/commit/5859957a0b0fff43099a7b821d721fa6625429e0))

## [1.14.9](https://github.com/storm-software/storm-ops/compare/git-tools-v1.14.8...git-tools-v1.14.9) (2023-12-08)

### Bug Fixes

- **workspace-tools:** Update the tsup build executor to use the daemon for
  getting the ProjectGraph
  ([0e3a598](https://github.com/storm-software/storm-ops/commit/0e3a598fb0b20008b8321a174dfb861590a6a9de))

## [1.14.8](https://github.com/storm-software/storm-ops/compare/git-tools-v1.14.7...git-tools-v1.14.8) (2023-12-06)

### Bug Fixes

- **workspace-tools:** Resolved issue with bad options passed into base TS
  library generator
  ([aeff286](https://github.com/storm-software/storm-ops/commit/aeff286fba411b47c205f3d13cefb425b2c1a977))

## [1.14.7](https://github.com/storm-software/storm-ops/compare/git-tools-v1.14.6...git-tools-v1.14.7) (2023-12-05)

### Bug Fixes

- **git-tools:** Bundle patched `semantic-release` code with package
  ([9e6bb0e](https://github.com/storm-software/storm-ops/commit/9e6bb0e1e43d743e1ccf0d607a4099fd1dd49dab))
- **git-tools:** Ensure we skip workspace root when releasing packages
  ([11de1df](https://github.com/storm-software/storm-ops/commit/11de1dfb665b9ab9fdb80c004020a71d6b1f6a9d))
- **git-tools:** Resolved issue in `semantic-release` patch with module
  directory
  ([a04aa3a](https://github.com/storm-software/storm-ops/commit/a04aa3add212abc781392d1227122a790b2f004e))
- **git-tools:** Resolved issue with patched semantic-release bundled path
  ([93b4e43](https://github.com/storm-software/storm-ops/commit/93b4e439bf19a888db1b35554b32b9aec3cc3acd))
- **git-tools:** Update the env used by packages to match new config updates
  ([d3b7dac](https://github.com/storm-software/storm-ops/commit/d3b7dac057a04aff9e0170d89cedc4cb47c584e5))
- **git-tools:** Updated `semantic-release` patch to properly check for plugins
  ([4e3db96](https://github.com/storm-software/storm-ops/commit/4e3db96814e8abb5cb22d9bfb5c747f042c43157))

## [1.14.6](https://github.com/storm-software/storm-ops/compare/git-tools-v1.14.5...git-tools-v1.14.6) (2023-12-05)

### Bug Fixes

- **config-tools:** Update configuration types to allow any type of schema
  ([c79b428](https://github.com/storm-software/storm-ops/commit/c79b428057b6020c1a50e68dd6f753cf7ad133f5))

## [1.14.5](https://github.com/storm-software/storm-ops/compare/git-tools-v1.14.4...git-tools-v1.14.5) (2023-12-03)

### Bug Fixes

- **workspace-tools:** Ensure only storm env are written to build package
  ([16d7fc9](https://github.com/storm-software/storm-ops/commit/16d7fc90c831d89e0d79bc02683c8a3ad7af63ce))

## [1.14.4](https://github.com/storm-software/storm-ops/compare/git-tools-v1.14.3...git-tools-v1.14.4) (2023-12-03)

### Bug Fixes

- **storm-ops:** Update pnpm-lock.yaml file
  ([74fe737](https://github.com/storm-software/storm-ops/commit/74fe737c2d43018c2c2a09d0489bdfc188b0e1ce))
- **workspace-tools:** Remove pino logging esbuild plugin
  ([730de8c](https://github.com/storm-software/storm-ops/commit/730de8c5c49c1e1b360b961e23b3f462e9e58c1a))
- **workspace-tools:** Resolved more issues with results display
  ([05d80d2](https://github.com/storm-software/storm-ops/commit/05d80d26e77e514a18101290f52398a970d260a7))
- **workspace-tools:** Update all workspace chalk deps to version 4.1.0
  ([b74a940](https://github.com/storm-software/storm-ops/commit/b74a940ee921981612a0ed1f951ce443f133dcd7))

## [1.14.3](https://github.com/storm-software/storm-ops/compare/git-tools-v1.14.2...git-tools-v1.14.3) (2023-12-03)

### Bug Fixes

- **workspace-tools:** Remove config-tools as an external dependency
  ([7a24864](https://github.com/storm-software/storm-ops/commit/7a248643ef13fca6ddaa3c25f6c78ede86dec8be))

## [1.14.2](https://github.com/storm-software/storm-ops/compare/git-tools-v1.14.1...git-tools-v1.14.2) (2023-12-03)

### Bug Fixes

- **config-tools:** Updated the `StormConfig` schema to properly type extensions
  and removed @decs/typeschema dependency
  ([40ed139](https://github.com/storm-software/storm-ops/commit/40ed13919f073da95cac183467accdcfc6c12270))

## [1.14.1](https://github.com/storm-software/storm-ops/compare/git-tools-v1.14.0...git-tools-v1.14.1) (2023-12-02)

### Bug Fixes

- **config-tools:** Update config package module type
  ([52dacd0](https://github.com/storm-software/storm-ops/commit/52dacd0a9f43ad36c915a0bc2ff5994c2ad32d45))

# [1.14.0](https://github.com/storm-software/storm-ops/compare/git-tools-v1.13.1...git-tools-v1.14.0) (2023-12-02)

### Features

- **config-tools:** Added `logLevel` configuration value
  ([edcd12a](https://github.com/storm-software/storm-ops/commit/edcd12a215cc1f6ec7c8ee3b1521a847a5a1e44f))

## [1.13.1](https://github.com/storm-software/storm-ops/compare/git-tools-v1.13.0...git-tools-v1.13.1) (2023-12-02)

### Bug Fixes

- **config-tools:** Updated the config schema's default values
  ([42fc718](https://github.com/storm-software/storm-ops/commit/42fc7183f2725e435d006897fb349c02f7454ff9))

# [1.13.0](https://github.com/storm-software/storm-ops/compare/git-tools-v1.12.0...git-tools-v1.13.0) (2023-12-02)

### Features

- **workspace-tools:** Added the config-schema generator to create json schemas
  for Storm Config
  ([4b66f3c](https://github.com/storm-software/storm-ops/commit/4b66f3cb6ff1586b0f86ceec89cc5a296162ed97))

# [1.12.0](https://github.com/storm-software/storm-ops/compare/git-tools-v1.11.1...git-tools-v1.12.0) (2023-12-02)

### Features

- **config-tools:** Added the config-tools library to support storm
  configuration
  ([63f8b9e](https://github.com/storm-software/storm-ops/commit/63f8b9e80a3fc95adbb4dae36e04339e9d46d089))
- **workspace-tools:** Added the `tsup-neutral` and `tsup-node` executors
  ([0b1c10e](https://github.com/storm-software/storm-ops/commit/0b1c10e40b2c14b1f49012b8288808aec74e247f))

## [1.11.1](https://github.com/storm-software/storm-ops/compare/git-tools-v1.11.0...git-tools-v1.11.1) (2023-11-30)

### Bug Fixes

- **workspace-tools:** Enhanced external dependency selection logic
  ([12dc8d5](https://github.com/storm-software/storm-ops/commit/12dc8d52175f19f70014f21e66e27c7dbaf29df2))

# [1.11.0](https://github.com/storm-software/storm-ops/compare/git-tools-v1.10.18...git-tools-v1.11.0) (2023-11-30)

### Features

- **workspace-tools:** Added `esbuild-decorators` plugin to tsup build executor
  ([5f83171](https://github.com/storm-software/storm-ops/commit/5f831716b4e9d6ba35e87a4cc62de0f1b2c397c3))

## [1.10.18](https://github.com/storm-software/storm-ops/compare/git-tools-v1.10.17...git-tools-v1.10.18) (2023-11-30)

### Bug Fixes

- **workspace-tools:** Update input file path for api-extractor
  ([7750f15](https://github.com/storm-software/storm-ops/commit/7750f151de20da36ab72c0b7f98df415c833704a))

## [1.10.17](https://github.com/storm-software/storm-ops/compare/git-tools-v1.10.16...git-tools-v1.10.17) (2023-11-30)

### Bug Fixes

- **workspace-tools:** Resolved bad reference to path
  ([622c842](https://github.com/storm-software/storm-ops/commit/622c84247119570a469d2dc802a3317d44a17bb0))

## [1.10.16](https://github.com/storm-software/storm-ops/compare/git-tools-v1.10.15...git-tools-v1.10.16) (2023-11-30)

### Bug Fixes

- **workspace-tools:** Resolved issue with api-extractor input path
  ([dabefc5](https://github.com/storm-software/storm-ops/commit/dabefc5295646d83325eb845038a2e9b273f7d8e))

## [1.10.15](https://github.com/storm-software/storm-ops/compare/git-tools-v1.10.14...git-tools-v1.10.15) (2023-11-29)

### Bug Fixes

- **workspace-tools:** Update the path separators in api-extractor parameters
  ([59a0908](https://github.com/storm-software/storm-ops/commit/59a09086e48af2f8aff9297878c3cd436eaf7837))

## [1.10.14](https://github.com/storm-software/storm-ops/compare/git-tools-v1.10.13...git-tools-v1.10.14) (2023-11-29)

### Bug Fixes

- **workspace-tools:** Add back the `declarationDir` value to the
  compilerOptions for dts build
  ([b02402d](https://github.com/storm-software/storm-ops/commit/b02402d6ef3c57b217771b2f086058c329c0b5af))

### Reverts

- **workspace-tools:** Revert tsup patch back to previous version before updates
  to api-extractor
  ([c8a83f1](https://github.com/storm-software/storm-ops/commit/c8a83f1ca6739248576bf81d791d02d02a09acb4))

## [1.10.13](https://github.com/storm-software/storm-ops/compare/git-tools-v1.10.12...git-tools-v1.10.13) (2023-11-29)

### Bug Fixes

- **workspace-tools:** Update tmp path on tsup patch
  ([2dd3551](https://github.com/storm-software/storm-ops/commit/2dd3551988d0c6ee4236123c4eeb7047f53cf666))

## [1.10.12](https://github.com/storm-software/storm-ops/compare/git-tools-v1.10.11...git-tools-v1.10.12) (2023-11-29)

### Bug Fixes

- **workspace-tools:** Resolve issue with path separators in tsup patch
  ([e7dc44d](https://github.com/storm-software/storm-ops/commit/e7dc44d77f8445a495fb7164d85498d4a2cbf179))

## [1.10.11](https://github.com/storm-software/storm-ops/compare/git-tools-v1.10.10...git-tools-v1.10.11) (2023-11-29)

### Bug Fixes

- **workspace-tools:** Resolved issue with bad path module usage in tsup patch
  ([e0a984a](https://github.com/storm-software/storm-ops/commit/e0a984a656d65cb6f2b015ebac43d908bdded3d9))

## [1.10.10](https://github.com/storm-software/storm-ops/compare/git-tools-v1.10.9...git-tools-v1.10.10) (2023-11-29)

### Bug Fixes

- **git-tools:** Resolved issue with escape character in descriptions for nx
  plugins
  ([c4c5cb0](https://github.com/storm-software/storm-ops/commit/c4c5cb0ec512d74836d9769dac50b3e545993b0c))
- **workspace-tools:** Update tsup patch so correct files are written after
  api-extractor
  ([7106c74](https://github.com/storm-software/storm-ops/commit/7106c74eddc0fe552b142c467ea63e74fb7026ba))

## [1.10.9](https://github.com/storm-software/storm-ops/compare/git-tools-v1.10.8...git-tools-v1.10.9) (2023-11-29)

### Bug Fixes

- **workspace-tools:** Update tsup patch to use workspace root as base directory
  for api-extractor
  ([d8cdc3c](https://github.com/storm-software/storm-ops/commit/d8cdc3c461ac1a95a814f04e569f05a54d1a8937))

## [1.10.8](https://github.com/storm-software/storm-ops/compare/git-tools-v1.10.7...git-tools-v1.10.8) (2023-11-29)

### Bug Fixes

- **workspace-tools:** Reduce path length of `mainEntryPointFilePath`
  api-extractor option
  ([1e747d3](https://github.com/storm-software/storm-ops/commit/1e747d34c5c9c82e00884d140632f9e725950672))

## [1.10.7](https://github.com/storm-software/storm-ops/compare/git-tools-v1.10.6...git-tools-v1.10.7) (2023-11-29)

### Bug Fixes

- **workspace-tools:** Resolve issue with api-extractor output directory
  ([5aa99ef](https://github.com/storm-software/storm-ops/commit/5aa99ef09950a738e658d4c75c6e241e4f1b4f14))

## [1.10.6](https://github.com/storm-software/storm-ops/compare/git-tools-v1.10.5...git-tools-v1.10.6) (2023-11-29)

### Bug Fixes

- **git-tools:** Ensure default options for arrays is documented correctly in
  README
  ([1754da3](https://github.com/storm-software/storm-ops/commit/1754da39e1ff6c72b020ef0119287e91e64b160d))
- **git-tools:** Resolved issue with generation of options table in readme-gen
  ([69f9c86](https://github.com/storm-software/storm-ops/commit/69f9c86efc90e117c4ec9a5b4d1a520d764af4f5))

## [1.10.5](https://github.com/storm-software/storm-ops/compare/git-tools-v1.10.4...git-tools-v1.10.5) (2023-11-29)

### Bug Fixes

- **workspace-tools:** Resolved issue with paths passed to api-extractor
  ([3f7c5ea](https://github.com/storm-software/storm-ops/commit/3f7c5ea14b3db1d1444624781a5ec025cc432552))

## [1.10.4](https://github.com/storm-software/storm-ops/compare/git-tools-v1.10.3...git-tools-v1.10.4) (2023-11-29)

### Bug Fixes

- **git-tools:** Added code to ensure the readme-gen sections are added back
  after running
  ([19232ef](https://github.com/storm-software/storm-ops/commit/19232ef62d9d10bb4619debeb968f83e970e38c8))

## [1.10.3](https://github.com/storm-software/storm-ops/compare/git-tools-v1.10.2...git-tools-v1.10.3) (2023-11-29)

### Bug Fixes

- **workspace-tools:** Resolved issue with entry path passed into api-extractor
  ([b2614e5](https://github.com/storm-software/storm-ops/commit/b2614e5639be0717e747c6bf06b39dc31df393e2))

## [1.10.2](https://github.com/storm-software/storm-ops/compare/git-tools-v1.10.1...git-tools-v1.10.2) (2023-11-29)

### Bug Fixes

- **git-tools:** Resolved various issues with nx documentation for readme-gen
  ([8067497](https://github.com/storm-software/storm-ops/commit/806749724b520f21622c0c93c8ff4e3c63129480))

## [1.10.1](https://github.com/storm-software/storm-ops/compare/git-tools-v1.10.0...git-tools-v1.10.1) (2023-11-29)

### Bug Fixes

- **workspace-tools:** Resolved issue with invalid schema json for tsup executor
  ([045560e](https://github.com/storm-software/storm-ops/commit/045560e2add5f4dc33be71148d63e4ecee496ced))

# [1.10.0](https://github.com/storm-software/storm-ops/compare/git-tools-v1.9.5...git-tools-v1.10.0) (2023-11-29)

### Features

- **git-tools:** Added executors and generators sections to the readme-gen CLI
  ([99aacba](https://github.com/storm-software/storm-ops/commit/99aacba62747cef1347bc87a0fff35fb2ffb0bde))

## [1.9.5](https://github.com/storm-software/storm-ops/compare/git-tools-v1.9.4...git-tools-v1.9.5) (2023-11-29)

### Bug Fixes

- **workspace-tools:** Update paths passed to api-extractor in tsup patch
  ([f3b6ce9](https://github.com/storm-software/storm-ops/commit/f3b6ce91e71ccc104895b4bcc0edf50a52e2b8ba))

## [1.9.4](https://github.com/storm-software/storm-ops/compare/git-tools-v1.9.3...git-tools-v1.9.4) (2023-11-29)

### Bug Fixes

- **workspace-tools:** Update the slashes used in package path in tsup patch
  ([55470d5](https://github.com/storm-software/storm-ops/commit/55470d54de7dc73b07430e153a6c89719da44667))

## [1.9.3](https://github.com/storm-software/storm-ops/compare/git-tools-v1.9.2...git-tools-v1.9.3) (2023-11-29)

### Bug Fixes

- **workspace-tools:** Update package path used by api-extractor
  ([e8081ef](https://github.com/storm-software/storm-ops/commit/e8081ef5df2bdd0b970c52444b552ab91d8ff2b4))

## [1.9.2](https://github.com/storm-software/storm-ops/compare/git-tools-v1.9.1...git-tools-v1.9.2) (2023-11-29)

### Bug Fixes

- **workspace-tools:** Resolved issue with package.json search method
  ([287761e](https://github.com/storm-software/storm-ops/commit/287761e008d821c32216b18c7eba448e3576b0dd))

## [1.9.1](https://github.com/storm-software/storm-ops/compare/git-tools-v1.9.0...git-tools-v1.9.1) (2023-11-29)

### Bug Fixes

- **workspace-tools:** Remove code that overwrites dts files
  ([894ef6e](https://github.com/storm-software/storm-ops/commit/894ef6e0ad973d5ed0983f421be341cf53075202))

# [1.9.0](https://github.com/storm-software/storm-ops/compare/git-tools-v1.8.21...git-tools-v1.9.0) (2023-11-28)

### Bug Fixes

- **workspace-tools:** Remove rollup.ts from the `additionalEntryPoints` list
  ([b45785e](https://github.com/storm-software/storm-ops/commit/b45785e8b9dd09178651123658cccaded7c559d7))

### Features

- **workspace-tools:** Added the `plugins` option to the tsup executor
  ([8cdb8af](https://github.com/storm-software/storm-ops/commit/8cdb8af57eddac03af7f96bfbc2dfbc1672a71be))

## [1.8.21](https://github.com/storm-software/storm-ops/compare/git-tools-v1.8.20...git-tools-v1.8.21) (2023-11-27)

### Bug Fixes

- **workspace-tools:** Cleaned up tsup patch and executor code
  ([289721f](https://github.com/storm-software/storm-ops/commit/289721f40f481b8c8b904298df7ff6efa8a7979b))

## [1.8.20](https://github.com/storm-software/storm-ops/compare/git-tools-v1.8.19...git-tools-v1.8.20) (2023-11-27)

### Bug Fixes

- **workspace-tools:** Resolved issue preventing file mappings from being logged
  ([f1435ed](https://github.com/storm-software/storm-ops/commit/f1435ed71a1e11098a581e5808c40910224a9c6f))

## [1.8.19](https://github.com/storm-software/storm-ops/compare/git-tools-v1.8.18...git-tools-v1.8.19) (2023-11-27)

### Bug Fixes

- **workspace-tools:** Resolved const issue in tsup patch
  ([cb14759](https://github.com/storm-software/storm-ops/commit/cb14759987b7306b7ba843dbd2798f928db66aaa))
- **workspace-tools:** Updated issue with bad map logging
  ([70092a8](https://github.com/storm-software/storm-ops/commit/70092a8ad5e3b0a6128ec5a96da7d7b723b416b1))

## [1.8.18](https://github.com/storm-software/storm-ops/compare/git-tools-v1.8.17...git-tools-v1.8.18) (2023-11-27)

### Bug Fixes

- **workspace-tools:** Added additional logging for tsc process
  ([ffe350f](https://github.com/storm-software/storm-ops/commit/ffe350faf3c77d7e99f30d8ea231228936faea25))

## [1.8.17](https://github.com/storm-software/storm-ops/compare/git-tools-v1.8.16...git-tools-v1.8.17) (2023-11-27)

### Bug Fixes

- **workspace-tools:** Resolved issue with invalid fileNames variable reference
  ([c045be1](https://github.com/storm-software/storm-ops/commit/c045be17ca911278d174f47924c6f03a240da790))

## [1.8.16](https://github.com/storm-software/storm-ops/compare/git-tools-v1.8.15...git-tools-v1.8.16) (2023-11-27)

### Bug Fixes

- **workspace-tools:** Resovled issue with parameters passed to createProgram
  ([96e1e5a](https://github.com/storm-software/storm-ops/commit/96e1e5a12a871779b77f6f51ff1d40cb150fb014))

## [1.8.15](https://github.com/storm-software/storm-ops/compare/git-tools-v1.8.14...git-tools-v1.8.15) (2023-11-27)

### Bug Fixes

- **workspace-tools:** Added paresed tsc options as tsup parameter
  ([dd51e93](https://github.com/storm-software/storm-ops/commit/dd51e934a793fa0c4c9c07ee2e97bda185777a27))

## [1.8.14](https://github.com/storm-software/storm-ops/compare/git-tools-v1.8.13...git-tools-v1.8.14) (2023-11-27)

### Bug Fixes

- **workspace-tools:** Added custom tsc options to tsup patch config
  ([c6a4d49](https://github.com/storm-software/storm-ops/commit/c6a4d49ef5efac05acb09601393fb54dee42090b))

## [1.8.13](https://github.com/storm-software/storm-ops/compare/git-tools-v1.8.12...git-tools-v1.8.13) (2023-11-27)

### Bug Fixes

- **workspace-tools:** Resolved issue with bad path in file map
  ([ed09f1e](https://github.com/storm-software/storm-ops/commit/ed09f1ecff294e124c6c72301330dbb6f8f94c11))

## [1.8.12](https://github.com/storm-software/storm-ops/compare/git-tools-v1.8.11...git-tools-v1.8.12) (2023-11-27)

### Bug Fixes

- **workspace-tools:** Added code to call original emit method
  ([d4febb4](https://github.com/storm-software/storm-ops/commit/d4febb40983615dbeabfbf88d38a59555722e217))

## [1.8.11](https://github.com/storm-software/storm-ops/compare/git-tools-v1.8.10...git-tools-v1.8.11) (2023-11-27)

### Bug Fixes

- **workspace-tools:** Resolved issue around adding files to api-extractor
  config
  ([4ad4118](https://github.com/storm-software/storm-ops/commit/4ad41184c0c8d1f803846b5bb653dc8fffc905e6))

## [1.8.10](https://github.com/storm-software/storm-ops/compare/git-tools-v1.8.9...git-tools-v1.8.10) (2023-11-27)

### Bug Fixes

- **workspace-tools:** Clean up around tsup patch dts build
  ([4650a98](https://github.com/storm-software/storm-ops/commit/4650a9884784707e927bc2352643e1a3bc535fd4))

## [1.8.9](https://github.com/storm-software/storm-ops/compare/git-tools-v1.8.8...git-tools-v1.8.9) (2023-11-27)

### Bug Fixes

- **workspace-tools:** Updated how emit is called
  ([dcc7bc5](https://github.com/storm-software/storm-ops/commit/dcc7bc54a6de0123d47decc548ea0e611cdecd95))

## [1.8.8](https://github.com/storm-software/storm-ops/compare/git-tools-v1.8.7...git-tools-v1.8.8) (2023-11-26)

### Bug Fixes

- **workspace-tools:** Fixed issue with `packageJsonFullPath` parameter of
  api-extractor
  ([69e4021](https://github.com/storm-software/storm-ops/commit/69e40219d7db548736b640ebada7fa14aee8a325))

## [1.8.7](https://github.com/storm-software/storm-ops/compare/git-tools-v1.8.6...git-tools-v1.8.7) (2023-11-26)

### Bug Fixes

- **workspace-tools:** Added `emitDeclarationOnly` to typescript compiler
  options
  ([e7b024f](https://github.com/storm-software/storm-ops/commit/e7b024f6f7648607aa4c71048cebbf6451d30577))

## [1.8.6](https://github.com/storm-software/storm-ops/compare/git-tools-v1.8.5...git-tools-v1.8.6) (2023-11-26)

### Bug Fixes

- **workspace-tools:** Resolved issue where fs map was cleared out
  ([1ea5c53](https://github.com/storm-software/storm-ops/commit/1ea5c538fbcd5220edc62024d42238816c4ecf2c))

## [1.8.5](https://github.com/storm-software/storm-ops/compare/git-tools-v1.8.4...git-tools-v1.8.5) (2023-11-26)

### Bug Fixes

- **workspace-tools:** Resolved issue with virtual file system in tsup patch
  ([ea79319](https://github.com/storm-software/storm-ops/commit/ea793191735ccf6bfd7d9b4670da71a598e12606))

## [1.8.4](https://github.com/storm-software/storm-ops/compare/git-tools-v1.8.3...git-tools-v1.8.4) (2023-11-26)

### Bug Fixes

- **workspace-tools:** Resolved issue with fs key
  ([e48babc](https://github.com/storm-software/storm-ops/commit/e48babca8053531bcbec4635efca7accd0e00699))

## [1.8.3](https://github.com/storm-software/storm-ops/compare/git-tools-v1.8.2...git-tools-v1.8.3) (2023-11-25)

### Bug Fixes

- **workspace-tools:** Resolved issue with incorrectly written config file
  ([bc93e00](https://github.com/storm-software/storm-ops/commit/bc93e00986d962c55323d85dec22c7c543614417))

## [1.8.2](https://github.com/storm-software/storm-ops/compare/git-tools-v1.8.1...git-tools-v1.8.2) (2023-11-25)

### Bug Fixes

- **workspace-tools:** Updated the way options are passed to `createProgram`
  ([aa03cd7](https://github.com/storm-software/storm-ops/commit/aa03cd764dcf0fee436d12d385cae5cec74aab9d))

## [1.8.1](https://github.com/storm-software/storm-ops/compare/git-tools-v1.8.0...git-tools-v1.8.1) (2023-11-25)

### Bug Fixes

- **workspace-tools:** Updated tsup patch to use compilerHost
  ([6fcff07](https://github.com/storm-software/storm-ops/commit/6fcff076a61f708472591c701dbd06716286ef6b))

# [1.8.0](https://github.com/storm-software/storm-ops/compare/git-tools-v1.7.6...git-tools-v1.8.0) (2023-11-25)

### Bug Fixes

- **workspace-tools:** Resolved issue with ES module imports
  ([8573fbc](https://github.com/storm-software/storm-ops/commit/8573fbcc2c741c8496160e61ff7011070ad07402))

### Features

- **workspace-tools:** Added `WorkspaceStorage` class to handle caching during
  processing
  ([b7a6830](https://github.com/storm-software/storm-ops/commit/b7a68300721be70fdf18c07b9e700f77f1191486))

## [1.7.6](https://github.com/storm-software/storm-ops/compare/git-tools-v1.7.5...git-tools-v1.7.6) (2023-11-25)

### Bug Fixes

- **workspace-tools:** Resovled issue with missing options in rollup build in
  tsup patch
  ([765f538](https://github.com/storm-software/storm-ops/commit/765f538d0dd11964299e254654bbd1b5b38261ff))

## [1.7.5](https://github.com/storm-software/storm-ops/compare/git-tools-v1.7.4...git-tools-v1.7.5) (2023-11-25)

### Bug Fixes

- **workspace-tools:** Update imports for @typescript/vfs to use named values
  ([99306e5](https://github.com/storm-software/storm-ops/commit/99306e575db6c059035077c26dcef4a116ff1bcb))

## [1.7.4](https://github.com/storm-software/storm-ops/compare/git-tools-v1.7.3...git-tools-v1.7.4) (2023-11-25)

### Bug Fixes

- **workspace-tools:** Added virtual file system to tsup patch to resolve
  missing libs
  ([068ab7a](https://github.com/storm-software/storm-ops/commit/068ab7a56a45d3d3ed63a86661d8207929829e5a))

## [1.7.3](https://github.com/storm-software/storm-ops/compare/git-tools-v1.7.2...git-tools-v1.7.3) (2023-11-25)

### Bug Fixes

- **workspace-tools:** Removed compiler options to set targer manaully in tsup
  build
  ([4aff28d](https://github.com/storm-software/storm-ops/commit/4aff28d6e451b18c120157b0c7e62ce6530a9eff))

## [1.7.2](https://github.com/storm-software/storm-ops/compare/git-tools-v1.7.1...git-tools-v1.7.2) (2023-11-25)

### Bug Fixes

- **workspace-tools:** Update default compilerOptions prior to calling tsc
  ([8bcb254](https://github.com/storm-software/storm-ops/commit/8bcb254fc0045414a80d79b056f6cfde2fd66e68))

## [1.7.1](https://github.com/storm-software/storm-ops/compare/git-tools-v1.7.0...git-tools-v1.7.1) (2023-11-25)

### Bug Fixes

- **workspace-tools:** Resolved bad iterable issue in tsup patch
  ([62a016b](https://github.com/storm-software/storm-ops/commit/62a016bc7bc5aec0978d0a92883843c795f997ac))

# [1.7.0](https://github.com/storm-software/storm-ops/compare/git-tools-v1.6.1...git-tools-v1.7.0) (2023-11-25)

### Features

- **workspace-tools:** Added the `includeSrc` option to the tsup build executor
  ([be66e22](https://github.com/storm-software/storm-ops/commit/be66e222af773fb741cfa719f883bfb921ff8a68))

## [1.6.1](https://github.com/storm-software/storm-ops/compare/git-tools-v1.6.0...git-tools-v1.6.1) (2023-11-25)

### Bug Fixes

- **workspace-tools:** Update include paths in tsconfig used in tsup builder
  ([99e651d](https://github.com/storm-software/storm-ops/commit/99e651d42f770bc29e7e76f7533abe519e29b9a4))

# [1.6.0](https://github.com/storm-software/storm-ops/compare/git-tools-v1.5.13...git-tools-v1.6.0) (2023-11-25)

### Features

- **workspace-tools:** Added workers distribution to tsup build
  ([fc80ec1](https://github.com/storm-software/storm-ops/commit/fc80ec1e3ecea46bc63b2bd5fc4e46f3ecdc8ba0))

## [1.5.13](https://github.com/storm-software/storm-ops/compare/git-tools-v1.5.12...git-tools-v1.5.13) (2023-11-25)

### Bug Fixes

- **workspace-tools:** Update the outDir value of parsed tsconfig options in
  tsup patch
  ([65c2aca](https://github.com/storm-software/storm-ops/commit/65c2aca19ba41a7de44d2f4b2121f7e2abfd3893))

## [1.5.12](https://github.com/storm-software/storm-ops/compare/git-tools-v1.5.11...git-tools-v1.5.12) (2023-11-25)

### Bug Fixes

- **workspace-tools:** Fixed issue with invalid chars in entry name
  ([5d849dd](https://github.com/storm-software/storm-ops/commit/5d849dd45c198283b31fe5e939351df0e841107c))

## [1.5.11](https://github.com/storm-software/storm-ops/compare/git-tools-v1.5.10...git-tools-v1.5.11) (2023-11-24)

### Bug Fixes

- **workspace-tools:** Resolve issue with dts `files` in compiler options
  ([2e9a611](https://github.com/storm-software/storm-ops/commit/2e9a611f6dee0c2db0fc6b87301472960f3b0cb5))

## [1.5.10](https://github.com/storm-software/storm-ops/compare/git-tools-v1.5.9...git-tools-v1.5.10) (2023-11-22)

### Bug Fixes

- **workspace-tools:** Resolved issue with bad path in tsup build
  ([33a7b25](https://github.com/storm-software/storm-ops/commit/33a7b25b153f81cfced829dd0b3e6c5225afea36))

## [1.5.9](https://github.com/storm-software/storm-ops/compare/git-tools-v1.5.8...git-tools-v1.5.9) (2023-11-22)

### Bug Fixes

- **workspace-tools:** Update generated tsconfig include to point to package
  root
  ([49aef81](https://github.com/storm-software/storm-ops/commit/49aef8178bb8a2c71e92ee3785358d42507eee56))

## [1.5.8](https://github.com/storm-software/storm-ops/compare/git-tools-v1.5.7...git-tools-v1.5.8) (2023-11-22)

### Bug Fixes

- **workspace-tools:** Resolve include issue with tsc during tsup build
  ([a6fffbe](https://github.com/storm-software/storm-ops/commit/a6fffbe881cb4f05f974de0b745157a0cfb8dcf6))

## [1.5.7](https://github.com/storm-software/storm-ops/compare/git-tools-v1.5.6...git-tools-v1.5.7) (2023-11-22)

### Bug Fixes

- **workspace-tools:** Resolved issue around incorrect output mapping in
  api-extractor
  ([b0464ed](https://github.com/storm-software/storm-ops/commit/b0464ed5f4b1f91a5b4c21d00e29d770d5732582))

## [1.5.6](https://github.com/storm-software/storm-ops/compare/git-tools-v1.5.5...git-tools-v1.5.6) (2023-11-22)

### Bug Fixes

- **workspace-tools:** Removed overriden tsconfig for api-extractor
  ([fcece07](https://github.com/storm-software/storm-ops/commit/fcece076bca3b0bd9938a4f5fbf3717628085ac3))

## [1.5.5](https://github.com/storm-software/storm-ops/compare/git-tools-v1.5.4...git-tools-v1.5.5) (2023-11-22)

### Bug Fixes

- **workspace-tools:** Correctly formatted include path in tsconfig passed to
  api extractor
  ([4c65fcf](https://github.com/storm-software/storm-ops/commit/4c65fcfb109f21f854ba5d6973e00bbc6e5c5173))

## [1.5.4](https://github.com/storm-software/storm-ops/compare/git-tools-v1.5.3...git-tools-v1.5.4) (2023-11-22)

### Bug Fixes

- **workspace-tools:** Resolved issue with export generation after api-extractor
  ([2b9e593](https://github.com/storm-software/storm-ops/commit/2b9e593a72ee352531e5721c62e3a3d10e86ed47))

## [1.5.3](https://github.com/storm-software/storm-ops/compare/git-tools-v1.5.2...git-tools-v1.5.3) (2023-11-22)

### Bug Fixes

- **workspace-tools:** Add default tsconfig values for api-extractor
  ([ae43e3f](https://github.com/storm-software/storm-ops/commit/ae43e3f47636a8921ace3441da5d533fa9773fe1))

## [1.5.2](https://github.com/storm-software/storm-ops/compare/git-tools-v1.5.1...git-tools-v1.5.2) (2023-11-22)

### Bug Fixes

- **workspace-tools:** Update the `projectFolder` option passed to api-extractor
  ([fb0c939](https://github.com/storm-software/storm-ops/commit/fb0c939122c19947bebfbebdea153cbabc3335cc))

## [1.5.1](https://github.com/storm-software/storm-ops/compare/git-tools-v1.5.0...git-tools-v1.5.1) (2023-11-21)

### Bug Fixes

- **workspace-tools:** Resolved issues with api-extractors paths
  ([8ea88f0](https://github.com/storm-software/storm-ops/commit/8ea88f09c240a94533474436dbac50bdabd26b2a))

# [1.5.0](https://github.com/storm-software/storm-ops/compare/git-tools-v1.4.0...git-tools-v1.5.0) (2023-11-21)

### Features

- **workspace-tools:** Added the `main` option to tsup build support manually
  entered entry paths
  ([fcb0fa7](https://github.com/storm-software/storm-ops/commit/fcb0fa7b98a8ed9bf14f9b724d9d9c7f345b7a08))

# [1.4.0](https://github.com/storm-software/storm-ops/compare/git-tools-v1.3.5...git-tools-v1.4.0) (2023-11-21)

### Features

- **workspace-tools:** Added `description` as an option in the node-library
  generator
  ([7a8eb85](https://github.com/storm-software/storm-ops/commit/7a8eb851ae7d979bb32c250ed3a1c78ea5b65af9))

## [1.3.5](https://github.com/storm-software/storm-ops/compare/git-tools-v1.3.4...git-tools-v1.3.5) (2023-11-21)

### Bug Fixes

- **workspace-tools:** Updated paths of generated api-reports
  ([c79d65e](https://github.com/storm-software/storm-ops/commit/c79d65e8a77c4801f20934e4cc733817f60d1aa2))

## [1.3.4](https://github.com/storm-software/storm-ops/compare/git-tools-v1.3.3...git-tools-v1.3.4) (2023-11-21)

### Bug Fixes

- **workspace-tools:** Resolved issue with `tsdocMetadataFilePath` option
  ([e1e8b59](https://github.com/storm-software/storm-ops/commit/e1e8b59c853580ea5deb5175cad6971953878f18))

## [1.3.3](https://github.com/storm-software/storm-ops/compare/git-tools-v1.3.2...git-tools-v1.3.3) (2023-11-21)

### Bug Fixes

- **workspace-tools:** Resolved issue with path separator character in tsup
  ([ea97d60](https://github.com/storm-software/storm-ops/commit/ea97d60bec1d966bbda5edffcc9f7edb8e488c27))

## [1.3.2](https://github.com/storm-software/storm-ops/compare/git-tools-v1.3.1...git-tools-v1.3.2) (2023-11-20)

### Bug Fixes

- **workspace-tools:** Resolved path issue in API Extractor config
  ([d3f8ae5](https://github.com/storm-software/storm-ops/commit/d3f8ae5d6f298e9e18dc2b26270edbb704a9b712))

## [1.3.1](https://github.com/storm-software/storm-ops/compare/git-tools-v1.3.0...git-tools-v1.3.1) (2023-11-20)

### Bug Fixes

- **workspace-tools:** Updated the api-reports docs path in tsup executor
  ([7ba4b1d](https://github.com/storm-software/storm-ops/commit/7ba4b1d6969d6de7f77ca9f1b99a53426ed659fb))

# [1.3.0](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.58...git-tools-v1.3.0) (2023-11-20)

### Features

- **workspace-tools:** Update tsup executor to generate API Report file, Doc
  Model, and TSDoc Metadata
  ([fb4cda5](https://github.com/storm-software/storm-ops/commit/fb4cda5807005d2ae412d637fa5247ebad09abf7))

## [1.2.58](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.57...git-tools-v1.2.58) (2023-11-20)

### Bug Fixes

- **workspace-tools:** Added missing @microsoft/api-extractor dependency for
  tsup DTS build
  ([56ab124](https://github.com/storm-software/storm-ops/commit/56ab124124275be7f66f0e9f11d64477c82bbcf5))

## [1.2.57](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.56...git-tools-v1.2.57) (2023-11-20)

### Bug Fixes

- **workspace-tools:** Resolved issue with tsconfig parser parameteters in tsup
  patch
  ([f71e590](https://github.com/storm-software/storm-ops/commit/f71e59055fc2d37ba282fd041c7a60e6469c76da))

## [1.2.56](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.55...git-tools-v1.2.56) (2023-11-20)

### Bug Fixes

- **workspace-tools:** Added extra logging to tsup patch
  ([6c58d8a](https://github.com/storm-software/storm-ops/commit/6c58d8a369d5ee4b28804903b49ae2ea141e7abd))

## [1.2.55](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.54...git-tools-v1.2.55) (2023-11-20)

### Bug Fixes

- **workspace-tools:** Resolved issue with package export lookup in tsup patch
  ([ba53a36](https://github.com/storm-software/storm-ops/commit/ba53a3606b60e78d0f66894c6e3bc5d116ddaacd))

## [1.2.54](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.53...git-tools-v1.2.54) (2023-11-20)

### Bug Fixes

- **workspace-tools:** Resolved bad tsconfig path issue in tsup patch
  ([564b0b5](https://github.com/storm-software/storm-ops/commit/564b0b5cd054852106328fb047cd77baefea962e))

## [1.2.53](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.52...git-tools-v1.2.53) (2023-11-20)

### Bug Fixes

- **workspace-tools:** Resolve issue with path library reference in tsup
  ([9745279](https://github.com/storm-software/storm-ops/commit/974527945816b40c8b210b06b3da16f20cb86dde))

## [1.2.52](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.51...git-tools-v1.2.52) (2023-11-20)

### Bug Fixes

- **workspace-tools:** Resovled issue with tsup dts tsconfig path
  ([eefb517](https://github.com/storm-software/storm-ops/commit/eefb517fc2369ab2411911c3810e51390a4689d9))

## [1.2.51](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.50...git-tools-v1.2.51) (2023-11-20)

### Bug Fixes

- **workspace-tools:** Added code to default tsup build options and package.json
  path in api-extractor
  ([f79dbb1](https://github.com/storm-software/storm-ops/commit/f79dbb1d57ba7e2da054ae47483e98516739662b))

## [1.2.50](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.49...git-tools-v1.2.50) (2023-11-20)

### Bug Fixes

- **workspace-tools:** Prevent both dts and experimentalDts from being enabled
  ([c2e5082](https://github.com/storm-software/storm-ops/commit/c2e50822440564f27e7f387e0e936c07092b4653))

## [1.2.49](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.48...git-tools-v1.2.49) (2023-11-19)

### Bug Fixes

- **workspace-tools:** Upgrade tsup version and enabled experimental dts
  ([96f6870](https://github.com/storm-software/storm-ops/commit/96f6870f590ab6a44a3058f20f6ee4e6a6ab1623))

## [1.2.48](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.47...git-tools-v1.2.48) (2023-11-19)

### Bug Fixes

- **workspace-tools:** Update where tsup loads shim files and added define
  option
  ([fa8fe6a](https://github.com/storm-software/storm-ops/commit/fa8fe6a4e7a5d6ac0f87a7b07d1db41cdd3bddc6))

## [1.2.47](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.46...git-tools-v1.2.47) (2023-11-19)

### Bug Fixes

- **workspace-tools:** Added esm and cjs shims to package bundle
  ([87a16e4](https://github.com/storm-software/storm-ops/commit/87a16e4007f04201bb0b817fe6fe2bf41c461f95))

## [1.2.46](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.45...git-tools-v1.2.46) (2023-11-19)

### Bug Fixes

- **workspace-tools:** Added rollup support for DTS generation
  ([d1f3325](https://github.com/storm-software/storm-ops/commit/d1f3325bf712e3714904e9ca4b795bfba3df39f8))

## [1.2.45](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.44...git-tools-v1.2.45) (2023-11-19)

### Bug Fixes

- **workspace-tools:** Resolved issue preventing package.json from being written
  ([c340959](https://github.com/storm-software/storm-ops/commit/c340959fdacb2541c60afca5feef9868bc0296e1))

## [1.2.44](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.43...git-tools-v1.2.44) (2023-11-19)

### Bug Fixes

- **workspace-tools:** Resolved issue with bad loop conditional in Tsup patch
  ([a692e7d](https://github.com/storm-software/storm-ops/commit/a692e7d3adf526353a4714e22761a1ba3bcc1cb5))

## [1.2.43](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.42...git-tools-v1.2.43) (2023-11-19)

### Bug Fixes

- **workspace-tools:** Added conditional to tsup package.json search
  ([f1e26a9](https://github.com/storm-software/storm-ops/commit/f1e26a9fadee64704e7a3beebed6ac8e9d103063))

## [1.2.42](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.41...git-tools-v1.2.42) (2023-11-18)

### Bug Fixes

- **workspace-tools:** Resolved issue with order of package.json search in tsup
  executor
  ([5fea9a1](https://github.com/storm-software/storm-ops/commit/5fea9a117691bef20aa22fbd107522d43b8b1b62))

## [1.2.41](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.40...git-tools-v1.2.41) (2023-11-18)

### Bug Fixes

- **workspace-tools:** Added join to add separators in package.json path in tsup
  ([b56df8a](https://github.com/storm-software/storm-ops/commit/b56df8a3c20e12fb8763e481cbc6ca82ff6403cf))

## [1.2.40](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.39...git-tools-v1.2.40) (2023-11-18)

### Bug Fixes

- **workspace-tools:** Resolved issue looking up package folder in tsup patch
  ([0eeee37](https://github.com/storm-software/storm-ops/commit/0eeee37219ceaf2873d7e8d0c7d5f7f46ab6a9bd))

## [1.2.39](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.38...git-tools-v1.2.39) (2023-11-18)

### Bug Fixes

- **workspace-tools:** Fixed issue in tsup patch around package.json generation
  ([a526fe7](https://github.com/storm-software/storm-ops/commit/a526fe72607ed7a957266fc790cafa8fb5d5b501))

## [1.2.38](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.37...git-tools-v1.2.38) (2023-11-18)

### Bug Fixes

- **workspace-tools:** Added banner to tsup patch
  ([2b97503](https://github.com/storm-software/storm-ops/commit/2b975032eece19bcdde9b7c3fbbd160c37c02c0f))

## [1.2.37](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.36...git-tools-v1.2.37) (2023-11-18)

### Bug Fixes

- **workspace-tools:** Patched tsup to properly use logger
  ([73a56f0](https://github.com/storm-software/storm-ops/commit/73a56f07931e173a70e30b01cf629ae17f27646a))

## [1.2.36](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.35...git-tools-v1.2.36) (2023-11-16)

### Bug Fixes

- **workspace-tools:** Update `entry` in tsup to use a single default file
  ([06bf60c](https://github.com/storm-software/storm-ops/commit/06bf60c125411a1bdc72bebd7ebe0e7bbc9aa740))

## [1.2.35](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.34...git-tools-v1.2.35) (2023-11-16)

### Bug Fixes

- **linting-tools:** Added tsconfig recommended to root tsconfig
  ([cfc70d7](https://github.com/storm-software/storm-ops/commit/cfc70d70ed5a123260d4ef9f1649ad66a0fe38e1))

## [1.2.34](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.33...git-tools-v1.2.34) (2023-11-16)

### Bug Fixes

- **workspace-tools:** Change tsup build to use glob package instead of function
  from Nx
  ([4fa5e17](https://github.com/storm-software/storm-ops/commit/4fa5e17d3d29f1769caccb52957fb8fb9ee772d0))
- **workspace-tools:** Included missing config function signature change
  ([a2228f2](https://github.com/storm-software/storm-ops/commit/a2228f2fba09d2dfd80a3f3c6dc5059077265f12))

## [1.2.33](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.32...git-tools-v1.2.33) (2023-11-16)

### Bug Fixes

- **workspace-tools:** Patch tsup build with check for `this` in rollup config
  ([f6bd066](https://github.com/storm-software/storm-ops/commit/f6bd06677163c0df6bd0a1b4a5e40bd651bf1e86))

## [1.2.32](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.31...git-tools-v1.2.32) (2023-11-16)

### Bug Fixes

- **workspace-tools:** Patch logging into tsup build
  ([e6ce2d7](https://github.com/storm-software/storm-ops/commit/e6ce2d7332c409d98f3aee4c561c299de6566de5))

## [1.2.31](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.30...git-tools-v1.2.31) (2023-11-16)

### Bug Fixes

- **workspace-tools:** Update tsup patch to use the logger
  ([4874960](https://github.com/storm-software/storm-ops/commit/4874960eff7c9335d51c375ea858bca992c9e5f8))

## [1.2.30](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.29...git-tools-v1.2.30) (2023-11-16)

### Bug Fixes

- **workspace-tools:** Added troubleshooting logging to tsup build
  ([f033bc5](https://github.com/storm-software/storm-ops/commit/f033bc548ef94aee6310fb6d5105fc750074264b))

## [1.2.29](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.28...git-tools-v1.2.29) (2023-11-15)

### Bug Fixes

- **workspace-tools:** Resolved issue with prettier config import
  ([4e2c026](https://github.com/storm-software/storm-ops/commit/4e2c026ca16072a60cbf34ece52e836ed6c0c183))
- **workspace-tools:** Updated tsup build to check for package.json in outDir
  via patch
  ([65afb51](https://github.com/storm-software/storm-ops/commit/65afb51dbcd4e68ebf44f643a9f683e66564b18c))

## [1.2.28](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.27...git-tools-v1.2.28) (2023-11-15)

### Bug Fixes

- **workspace-tools:** Resolved tsup issue with entry option and package.json
  full path
  ([1181d64](https://github.com/storm-software/storm-ops/commit/1181d644c5c1ced40c7dbb563df252b2630ca7ca))

## [1.2.27](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.26...git-tools-v1.2.27) (2023-11-15)

### Bug Fixes

- **workspace-tools:** Patch tsup to use generated package.json file
  ([424fb45](https://github.com/storm-software/storm-ops/commit/424fb454abea5399b7333777210286d654610f2d))

## [1.2.26](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.25...git-tools-v1.2.26) (2023-11-15)

### Bug Fixes

- **deps:** update patch prod dependencies
  ([4f84a7e](https://github.com/storm-software/storm-ops/commit/4f84a7e38ddd416883229b67665649ae0ffcc03a))
- **workspace-tools:** Update default options for tsup executor
  ([436d792](https://github.com/storm-software/storm-ops/commit/436d7922a31128030659d671e5ed76272801215d))

## [1.2.25](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.24...git-tools-v1.2.25) (2023-11-13)

### Bug Fixes

- **workspace-tools:** Update tsup config to package src files in build package
  ([c6297b5](https://github.com/storm-software/storm-ops/commit/c6297b54a4db28d0737adfa4203a6a6dd9b4565f))

## [1.2.24](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.23...git-tools-v1.2.24) (2023-11-13)

### Bug Fixes

- **workspace-tools:** Include terser in workspace package for tsup build
  ([ee26f46](https://github.com/storm-software/storm-ops/commit/ee26f4696873ea4b329f73d7b4b718cd193c7847))

## [1.2.23](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.22...git-tools-v1.2.23) (2023-11-12)

### Bug Fixes

- **workspace-tools:** Update output paths on tsup executor config
  ([54e2078](https://github.com/storm-software/storm-ops/commit/54e2078c4d6fbc98401d4703746c1de9504e75a4))

## [1.2.22](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.21...git-tools-v1.2.22) (2023-11-12)

### Bug Fixes

- **workspace-tools:** Update clean functionality so no previously build files
  are removed
  ([19ce7bd](https://github.com/storm-software/storm-ops/commit/19ce7bd17f570587a70256471c63b613943a0c39))

## [1.2.21](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.20...git-tools-v1.2.21) (2023-11-12)

### Bug Fixes

- **workspace-tools:** Resolve issue with config objects passed to copyAssets
  function
  ([ea68191](https://github.com/storm-software/storm-ops/commit/ea681918bac665c7442afee6aa3228897b69ea10))

## [1.2.20](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.19...git-tools-v1.2.20) (2023-11-12)

### Bug Fixes

- **workspace-tools:** Include @nx/esbuild and tsup dependencies in build bundle
  ([7acaf5e](https://github.com/storm-software/storm-ops/commit/7acaf5e138709ac0ded3bbcfda2de6f3dfe8cca8))

## [1.2.19](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.18...git-tools-v1.2.19) (2023-11-10)

### Bug Fixes

- **git-tools:** Add origin to git lfs command
  ([4c33508](https://github.com/storm-software/storm-ops/commit/4c335088d426535eb443b01d653696576dc1d237))
- **git-tools:** Added branch name to git command
  ([f411035](https://github.com/storm-software/storm-ops/commit/f41103595cfa383256b347c5e93635445a051fda))
- **git-tools:** Ensure full path is added to remote branch params
  ([bb2c668](https://github.com/storm-software/storm-ops/commit/bb2c668ccb959b038929a30436163088b4c02a7d))
- **git-tools:** More updates to variables in hooks
  ([1096948](https://github.com/storm-software/storm-ops/commit/10969481676eba0b86118dff0e1365adfbf4bd75))
- **git-tools:** Remove git-lfs variables from the husky
  ([0f80794](https://github.com/storm-software/storm-ops/commit/0f80794418bb82000e73029df6c7d738d289ca78))
- **git-tools:** Remove git-lfs variables from the husky hooks
  ([cad7eff](https://github.com/storm-software/storm-ops/commit/cad7eff3c2ed3a1f0b318d9973b6756b8446eb0a))
- **git-tools:** Resolved issue calling git-lfs commands on current branch
  ([f5c4dd8](https://github.com/storm-software/storm-ops/commit/f5c4dd8331f1df05e0661b1aa72dcd1260a972ad))
- **git-tools:** Update code to use the provided git variables
  ([f5acee1](https://github.com/storm-software/storm-ops/commit/f5acee1da47f1d0ec730a82a20aaaff9f6e77e54))
- **git-tools:** Update hook execution scripts
  ([1d1b426](https://github.com/storm-software/storm-ops/commit/1d1b4265ad99ad9fc97764dd89f5cf2cf5f9a2ca))
- **git-tools:** Update use of command line variables
  ([a6c0d18](https://github.com/storm-software/storm-ops/commit/a6c0d1858a19791d92316a4fc2ec520f4bf69d98))

## [1.2.18](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.17...git-tools-v1.2.18) (2023-11-10)

### Bug Fixes

- **git-tools:** Updated code that checks for git-lfs in hooks
  ([ec4e632](https://github.com/storm-software/storm-ops/commit/ec4e632fe5db27eba12e7dffbbab7ef96c2ef40e))

## [1.2.17](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.16...git-tools-v1.2.17) (2023-11-10)

### Bug Fixes

- **git-tools:** Added logging to husky hooks
  ([5b4a159](https://github.com/storm-software/storm-ops/commit/5b4a1597fee820bf1aa009473b313d43d06ae1c9))
- **git-tools:** Moved hook executable scripts to bin folder
  ([36f8896](https://github.com/storm-software/storm-ops/commit/36f889633a971ac091491dd82fbd40d6cc6236dc))
- **git-tools:** Updated executable scripts to check for git-lfs failures
  ([ad738cf](https://github.com/storm-software/storm-ops/commit/ad738cfaadc30306c9ff9e2e7fde19c9b328ccaf))
- **git-tools:** Wrapped all hook executable scripts with try-catches
  ([f36b181](https://github.com/storm-software/storm-ops/commit/f36b1813a88970eb7fd24c67ef71e93bca7edcf9))

## [1.2.16](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.15...git-tools-v1.2.16) (2023-11-10)

### Bug Fixes

- **workspace-tools:** Resolved issue setting private package.json field in
  node-library generator
  ([7e570c5](https://github.com/storm-software/storm-ops/commit/7e570c5d62b206bca2840e8e92c0a9920d8b571e))

## [1.2.15](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.14...git-tools-v1.2.15) (2023-11-10)

### Bug Fixes

- **git-tools:** Update husky hooks to executable scripts
  ([acc9511](https://github.com/storm-software/storm-ops/commit/acc95116890a7ed6ed896fbc354ea601d3386255))

## [1.2.14](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.13...git-tools-v1.2.14) (2023-11-10)

### Bug Fixes

- **git-tools:** Update extension type of scripts used in husky hooks
  ([1aa3e3b](https://github.com/storm-software/storm-ops/commit/1aa3e3b26d79015bab75f1bbee26974407a19428))

## [1.2.13](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.12...git-tools-v1.2.13) (2023-11-10)

### Bug Fixes

- **workspace-tools:** Resolved issue with node-library generator
  ([c0f2d26](https://github.com/storm-software/storm-ops/commit/c0f2d26849f0f16ca4e6da30c953152be3113906))

## [1.2.12](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.11...git-tools-v1.2.12) (2023-11-10)

### Bug Fixes

- **git-tools:** Update readme-gen to use the configured pnpm script
  ([87a2788](https://github.com/storm-software/storm-ops/commit/87a2788bbe74bd7ef92ca872c3cadc57531ba51e))

## [1.2.11](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.10...git-tools-v1.2.11) (2023-11-10)

### Bug Fixes

- **git-tools:** Update list-staged config extension to work with ES modules
  ([a408b88](https://github.com/storm-software/storm-ops/commit/a408b88543fa835c931b25d8c9294c4427e8e6fe))
- **linting-tools:** Update cspell config to json to resolve import issue
  ([5ca437a](https://github.com/storm-software/storm-ops/commit/5ca437a2880486de494f4a49803b5e59b5a746dc))

## [1.2.10](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.9...git-tools-v1.2.10) (2023-11-10)

### Bug Fixes

- **git-tools:** Resolved issues with husky hook scripts
  ([3c330bb](https://github.com/storm-software/storm-ops/commit/3c330bb92ed007d9d8c9b6f893826057b5150092))

## [1.2.9](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.8...git-tools-v1.2.9) (2023-11-10)

### Bug Fixes

- **git-tools:** Resolved issue with missing husky hooks
  ([505113d](https://github.com/storm-software/storm-ops/commit/505113d29a17b37c99aa00d93bb6a1b5f60412ed))

## [1.2.8](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.7...git-tools-v1.2.8) (2023-11-10)

### Bug Fixes

- **git-tools:** Resolved issue with semantic release plugin path default
  ([d7eea90](https://github.com/storm-software/storm-ops/commit/d7eea9024787edde8672482c29cba93cd50408b2))

## [1.2.7](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.6...git-tools-v1.2.7) (2023-11-09)

### Bug Fixes

- **git-tools:** Update GitHub release CLI
  ([87e3c01](https://github.com/storm-software/storm-ops/commit/87e3c014c317d971cd76daf99c7ed49a66f7f664))

## [1.2.6](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.5...git-tools-v1.2.6) (2023-11-09)

### Bug Fixes

- **workspace-tools:** Remove GitHub release from workspace tools
  ([cfab2ac](https://github.com/storm-software/storm-ops/commit/cfab2ac7e7fbd8f5f067b468947952920028cd44))

## [1.2.5](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.4...git-tools-v1.2.5) (2023-11-09)

### Bug Fixes

- **workspace-tools:** Resolved issue with dependency versions in preset
  ([3e8225a](https://github.com/storm-software/storm-ops/commit/3e8225aed8de591575b225b01d4fb7fb9ed4d56a))

## [1.2.4](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.3...git-tools-v1.2.4) (2023-11-08)

### Bug Fixes

- **workspace-tools:** Resolved issues with all-contributors template
  ([56f40e0](https://github.com/storm-software/storm-ops/commit/56f40e06143203c6d24658d192cba20fefa75004))

## [1.2.3](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.2...git-tools-v1.2.3) (2023-11-08)

### Bug Fixes

- **git-tools:** Resolved incorrect author and committer names during release
  CLI
  ([9192070](https://github.com/storm-software/storm-ops/commit/91920705e9d99db618917ed2183c8862f9b64c91))

## [1.2.2](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.1...git-tools-v1.2.2) (2023-11-07)

### Bug Fixes

- **create-storm-workspace:** Bundle packages with create-storm-workspace
  ([f3bcb3b](https://github.com/storm-software/storm-ops/commit/f3bcb3b750cf8f8aacb2e93a600a5b18bcacaa7d))

## [1.2.1](https://github.com/storm-software/storm-ops/compare/git-tools-v1.2.0...git-tools-v1.2.1) (2023-11-07)

### Bug Fixes

- **create-storm-workspace:** Resolved issue with linked workspace-tools
  dependency in package.json
  ([90b0b76](https://github.com/storm-software/storm-ops/commit/90b0b766817445084cec96126c51c8302ca16d6d))

# [1.2.0](https://github.com/storm-software/storm-ops/compare/git-tools-v1.1.0...git-tools-v1.2.0) (2023-11-07)

### Bug Fixes

- **storm-ops:** Regenerated pnpm filelock file
  ([113bf16](https://github.com/storm-software/storm-ops/commit/113bf1678acd4324992f4d8f2581c262bddcbc85))

### Features

- **testing-tools:** Added testing-tools library for common test functionality
  ([08d3ccd](https://github.com/storm-software/storm-ops/commit/08d3ccda5508db5c9abf2481900f9d9826d6ece1))

# [1.1.0](https://github.com/storm-software/storm-ops/compare/git-tools-v1.0.11...git-tools-v1.1.0) (2023-11-07)

### Bug Fixes

- **storm-ops:** Update pnpm lockfile
  ([f08a730](https://github.com/storm-software/storm-ops/commit/f08a7309f56fabbf6d0c108b3a57834a0ec05429))

### Features

- **storm-ops:** Converted repository eslint to flat structure
  ([a738c3a](https://github.com/storm-software/storm-ops/commit/a738c3a9839cd5262e98029641f7a9a4d886e117))

## [1.0.11](https://github.com/storm-software/storm-ops/compare/git-tools-v1.0.10...git-tools-v1.0.11) (2023-11-07)

### Bug Fixes

- **git-tools:** Update GitHub release CLI
  ([2a8a496](https://github.com/storm-software/storm-ops/commit/2a8a496987de961a4d780013a758893d7e6fde8e))

## [1.0.10](https://github.com/storm-software/storm-ops/compare/git-tools-v1.0.9...git-tools-v1.0.10) (2023-11-07)

### Bug Fixes

- **git-tools:** Removed old release drafts
  ([7dff66c](https://github.com/storm-software/storm-ops/commit/7dff66c5da29f559bc1e515d48e9fc1b8fa252d5))

## [1.0.9](https://github.com/storm-software/storm-ops/compare/git-tools-v1.0.8...git-tools-v1.0.9) (2023-11-06)

### Bug Fixes

- **git-tools:** Combined the distribution packages for GitHub release
  ([0090c28](https://github.com/storm-software/storm-ops/commit/0090c2859ace94396de1da654e39a35caf5aae4a))

## [1.0.8](https://github.com/storm-software/storm-ops/compare/git-tools-v1.0.7...git-tools-v1.0.8) (2023-11-06)

### Bug Fixes

- **git-tools:** Update GitHub release CLI to skip workspace root
  ([85aa29d](https://github.com/storm-software/storm-ops/commit/85aa29df7b38a37e8ecf68cb4b22901963148e47))

## [1.0.7](https://github.com/storm-software/storm-ops/compare/git-tools-v1.0.6...git-tools-v1.0.7) (2023-11-06)

### Bug Fixes

- **git-tools:** Cleaned up assets list in GitHub release CLI
  ([726f2e4](https://github.com/storm-software/storm-ops/commit/726f2e41180ca282fcccf9d9223c4e7ff2c3a4f8))

## [1.0.6](https://github.com/storm-software/storm-ops/compare/git-tools-v1.0.5...git-tools-v1.0.6) (2023-11-06)

### Bug Fixes

- **git-tools:** Add code to get lfs files in release CLI
  ([ff959c2](https://github.com/storm-software/storm-ops/commit/ff959c20bb3f3881a69e79b50d58d1e4e742bd24))

## [1.0.5](https://github.com/storm-software/storm-ops/compare/git-tools-v1.0.4...git-tools-v1.0.5) (2023-11-06)

### Bug Fixes

- **storm-ops:** Regenerate pnpm lockfile
  ([6cc4c75](https://github.com/storm-software/storm-ops/commit/6cc4c75486d843327d8e438e34dd08182bb0e052))

## [1.0.4](https://github.com/storm-software/storm-ops/compare/git-tools-v1.0.3...git-tools-v1.0.4) (2023-11-06)

### Bug Fixes

- **git-tools:** Added missing GitHub release config and removed failed
  GitGuardian lines
  ([4b64698](https://github.com/storm-software/storm-ops/commit/4b646983226fa979c76f8078ffd1cee1d544f1a1))

## [1.0.3](https://github.com/storm-software/storm-ops/compare/git-tools-v1.0.2...git-tools-v1.0.3) (2023-11-06)

### Bug Fixes

- **storm-ops:** Add @semantic-release/commit-analyzer dependency back to
  workspace root
  ([553dd65](https://github.com/storm-software/storm-ops/commit/553dd6548aba57eada49dce635312b2c4bdd474f))
- **storm-ops:** Resolved issue with prepare script in workspace root
  ([4caa35a](https://github.com/storm-software/storm-ops/commit/4caa35a09421e0ac48a0d2eddc27843c4dcff6e7))

## [1.0.2](https://github.com/storm-software/storm-ops/compare/git-tools-v1.0.1...git-tools-v1.0.2) (2023-11-06)

### Bug Fixes

- **git-tools:** Update readme CLI to properly handle scenario with no project
  name
  ([7e80f7c](https://github.com/storm-software/storm-ops/commit/7e80f7c72f1af3d67b5b21b9adde65f80b30df7c))

## [1.0.1](https://github.com/storm-software/storm-ops/compare/git-tools-v1.0.0...git-tools-v1.0.1) (2023-11-06)

### Bug Fixes

- **git-tools:** Updated default README template files used by readme CLI
  ([77c7c59](https://github.com/storm-software/storm-ops/commit/77c7c5936b614f7a5d3072254ff8065e70ad4d25))

# [1.0.0](https://github.com/storm-software/storm-ops/compare/...git-tools-v1.0.0) (2023-11-06)

### Bug Fixes

- **deps:** pin dependencies
  ([3a245b9](https://github.com/storm-software/storm-ops/commit/3a245b9f6781af520862474da42de105a59a96e1))
- **deps:** update dependencies-non-major
  ([8b99e68](https://github.com/storm-software/storm-ops/commit/8b99e68edc98c02d0e59d69d7c82069e60ee0faa))
- **deps:** update dependency @cspell/dict-en-gb to v4
  ([eddf2bf](https://github.com/storm-software/storm-ops/commit/eddf2bff0125b38008a3dccf22928f20767ecd26))
- **deps:** update dependency p-limit to v5
  ([353e00a](https://github.com/storm-software/storm-ops/commit/353e00a00d4de71ca2d828d4a788726da6020ba4))
- **deps:** update dependency prettier to v3
  ([f505213](https://github.com/storm-software/storm-ops/commit/f50521399cb1f54916a803b91587f6241467123a))
- **deps:** update patch prod dependencies
  ([651ea23](https://github.com/storm-software/storm-ops/commit/651ea23e5a515e2391a415b5c9b1f194eb7ff8f0))
- **deps:** update typescript-eslint monorepo to v6
  ([c8b086b](https://github.com/storm-software/storm-ops/commit/c8b086b43f25c22c200bf157e88459371391ec38))
- **git-tools:** Add @semantic-release/github dependency to git-tools
  ([949bc8d](https://github.com/storm-software/storm-ops/commit/949bc8d953b855e3f2e0a2f7e1faae12da83cdad))
- **git-tools:** Add base path to the semantic release plugin module
  ([91b0f52](https://github.com/storm-software/storm-ops/commit/91b0f52394e04f4b54acfe5fe594301504970586))
- **git-tools:** Add call to git lfs fetch in release CLI
  ([a1fe306](https://github.com/storm-software/storm-ops/commit/a1fe306a18926295cacce8a18456613ba8318645))
- **git-tools:** Add full path to package.json directory when loading npm plugin
  ([af935bb](https://github.com/storm-software/storm-ops/commit/af935bbe33857420b4082d5e1b70a942d4e66b4b))
- **git-tools:** Add option values to plugins with no options provided
  ([1779229](https://github.com/storm-software/storm-ops/commit/177922927ed66cb2784f7851fa1182838e36143f))
- **git-tools:** Added config token replacement functionality
  ([cd48602](https://github.com/storm-software/storm-ops/commit/cd4860283eb249bfe2b2b08a439f729f2f5b89a3))
- **git-tools:** Added missing semantic-release depenencies
  ([33a0f5e](https://github.com/storm-software/storm-ops/commit/33a0f5e635a417715db8cbfd78540912e721529b))
- **git-tools:** Added missing semantic-release plugins
  ([5350bc2](https://github.com/storm-software/storm-ops/commit/5350bc2bd4c89f9f1dc1f29903dfbd90ffb6f337))
- **git-tools:** Added semantic-release plugins to root package.json
  ([55289a7](https://github.com/storm-software/storm-ops/commit/55289a75b08e1603f087dfa1c8b6d594b6386f95))
- **git-tools:** Apply default config to plugin options
  ([35e9e31](https://github.com/storm-software/storm-ops/commit/35e9e31a7a03796a2479223f316423238d61486b))
- **git-tools:** Convert package to ES module
  ([b845fda](https://github.com/storm-software/storm-ops/commit/b845fdacbd530a90cb6a596cd9e182f3466e92f0))
- **git-tools:** Convert the cjs scripts to ES modules
  ([b6b4db7](https://github.com/storm-software/storm-ops/commit/b6b4db7475d5beba127ba862fb5c6431cc0b0063))
- **git-tools:** Directly import commit analyzer
  ([dac2293](https://github.com/storm-software/storm-ops/commit/dac22931580c3f15088523bcb4b225bbf6fdc126))
- **git-tools:** Improve the way the analyze commit plugin options are merged
  ([09bc5d8](https://github.com/storm-software/storm-ops/commit/09bc5d8bd645120e1206f4304396337bfb39547f))
- **git-tools:** Make release plugin dynamic
  ([de9aeb8](https://github.com/storm-software/storm-ops/commit/de9aeb849a7216a570242868a2034f0b661bd946))
- **git-tools:** Manually import commit-analyzer in release CLI
  ([4747759](https://github.com/storm-software/storm-ops/commit/4747759cd6ce28a682f4fa5b9ecdf18c7b2a40b2))
- **git-tools:** Patch semantic-release to use an import instead of require on
  the plugin
  ([25dcf81](https://github.com/storm-software/storm-ops/commit/25dcf81794381cb3df24ea944592bf6e729093cf))
- **git-tools:** Remove commit plugin from list
  ([95aacee](https://github.com/storm-software/storm-ops/commit/95aaceeec9eccbb51c99e92bbeeb14f49091f8ec))
- **git-tools:** Remove unused lodash dependency
  ([0381059](https://github.com/storm-software/storm-ops/commit/0381059a48e7260648a61178ad52912c69362601))
- **git-tools:** Removed code that incorrectly threw an error when no release
  was performed
  ([ab6052f](https://github.com/storm-software/storm-ops/commit/ab6052fe7ee66dd4bd101661105fcbf4a4580a3b))
- **git-tools:** Resolve invalid branch name
  ([dc6dc05](https://github.com/storm-software/storm-ops/commit/dc6dc053747ad1cb0e38b532a30a366bb72fd057))
- **git-tools:** Resolve issue reading results during release processing
  ([0eec7bc](https://github.com/storm-software/storm-ops/commit/0eec7bc4f4454e91945dd772d477e54dc035fa63))
- **git-tools:** Resolve issue where no `releaseRules` were provided to the
  analyzer plugin config
  ([6dad601](https://github.com/storm-software/storm-ops/commit/6dad601b017689b5d8af0facb12070fc00916dff))
- **git-tools:** Resolve issue with CJS vs ESM conflicts
  ([7afb4c9](https://github.com/storm-software/storm-ops/commit/7afb4c98b22dff7a9b9d9ba5987b212797b7aa29))
- **git-tools:** Resolve issue with missing path reference in header
  ([73424b4](https://github.com/storm-software/storm-ops/commit/73424b449f6aee64a01d6adb26225d364027036c))
- **git-tools:** Resolve issue with passing options to semantic release
  ([2628172](https://github.com/storm-software/storm-ops/commit/2628172ea1e9fc6cd8b4301df080878bb8f663b6))
- **git-tools:** Resolve issue with plugin path
  ([feef4fe](https://github.com/storm-software/storm-ops/commit/feef4fe14b9556c3b736c63d731cd04d299aae68))
- **git-tools:** Resolve issue with registry config in release action
  ([a5f73e7](https://github.com/storm-software/storm-ops/commit/a5f73e7956b36bbe50d2f3180f95c3b599f9059d))
- **git-tools:** Resolve semantic-release import issue
  ([4f7058b](https://github.com/storm-software/storm-ops/commit/4f7058bdc5cfcf7db7fa70b0b060f94b6c557377))
- **git-tools:** Resolved issue with bad import for filter function
  ([a429777](https://github.com/storm-software/storm-ops/commit/a42977746e777c17e5986c85a54cc23ecee66a0b))
- **git-tools:** Resolved issue with misnamed workspaceDir config option
  ([4fe7b12](https://github.com/storm-software/storm-ops/commit/4fe7b12974be152da85f9f17b985933dd8cd6bc1))
- **git-tools:** Resolved issue with missing outputPath in npm release
  ([5a11e46](https://github.com/storm-software/storm-ops/commit/5a11e4628dfc53d996a6d9d24a5682b5ada8362f))
- **git-tools:** Resolved issue with output path in npm release plugin
  ([644fd6f](https://github.com/storm-software/storm-ops/commit/644fd6f9aac2a9fbaa9c99a26f823d7ef21c3258))
- **git-tools:** Resolved issues with release module imports
  ([befe2b2](https://github.com/storm-software/storm-ops/commit/befe2b21a3726abd51a032abaed21e8bcaf50c74))
- **git-tools:** Resolved logging issue during release reporting
  ([77774d2](https://github.com/storm-software/storm-ops/commit/77774d282ed1c805c65fc9a9ba1cbd5893b69576))
- **git-tools:** Update env variable passed to release plugin
  ([c75602f](https://github.com/storm-software/storm-ops/commit/c75602fbc0b2ad8eec238617e2e473a9bf3348c6))
- **git-tools:** Update how commit analyzer import is handled in
  storm-semantic-release
  ([148c952](https://github.com/storm-software/storm-ops/commit/148c952677d97bd66fbb8b691161c307bb60af8f))
- **git-tools:** Update method of importing semantic-release
  ([5ae114e](https://github.com/storm-software/storm-ops/commit/5ae114e0fee775840363ffcf7f2efcb727c2c9ed))
- **git-tools:** Update paths used to check for package.json during versioning
  ([e25e02a](https://github.com/storm-software/storm-ops/commit/e25e02a23c6df87331bd1aae5b5c970445b912a8))
- **git-tools:** Update release CLI to release to npm
  ([6b4b7ec](https://github.com/storm-software/storm-ops/commit/6b4b7ecec767f1bbd1da1f1e21014baff1f3e5bf))
- **git-tools:** Update require to import in semantic-release patch
  ([e2ef52c](https://github.com/storm-software/storm-ops/commit/e2ef52cd0920336ad33857954040af7291a66e6d))
- **git-tools:** Updates to default config to resolve GitHub checkin error
  ([412c679](https://github.com/storm-software/storm-ops/commit/412c6796873ffc86872425e42bfdce3f06340352))
- **semantic-release-plugin:** Add cjs build to release plugin
  ([3e06494](https://github.com/storm-software/storm-ops/commit/3e0649470fcc68814b550dd933fedb5840425617))
- **semantic-release-plugin:** Add code for commit analyzer
  ([2757ca3](https://github.com/storm-software/storm-ops/commit/2757ca3c9805b1cde9cb4bab0361ebee783fae11))
- **semantic-release-plugin:** Add release context fields to config
  ([06b0dd0](https://github.com/storm-software/storm-ops/commit/06b0dd0fbac867f73f9152e0dcc93251b033a62e))
- **semantic-release-plugin:** Add release note generation to semantic release
  plugin
  ([c4e250d](https://github.com/storm-software/storm-ops/commit/c4e250d910daa10aa33549c1c6f508e569930870))
- **semantic-release-plugin:** Add rootDir to plugin
  ([674ebdd](https://github.com/storm-software/storm-ops/commit/674ebddf21eaea5958064d4791df1ef676aab393))
- **semantic-release-plugin:** Change compiler type
  ([542667d](https://github.com/storm-software/storm-ops/commit/542667db6b58fe9775c92632cf0497a80d74593b))
- **semantic-release-plugin:** Changed import type for release plugin
  ([51f4809](https://github.com/storm-software/storm-ops/commit/51f480922809acb5592fcc8b594548d729388a7b))
- **semantic-release-plugin:** Converted the plugin to CommonJS
  ([ff870ee](https://github.com/storm-software/storm-ops/commit/ff870ee083c7da4524f50332cf2b47ef27734a3f))
- **semantic-release-plugin:** Format output to mjs file
  ([2175391](https://github.com/storm-software/storm-ops/commit/217539176889675d3e47a7dac102a1533a68869a))
- **semantic-release-plugin:** Invoke commit analzyer manually to prevent ES
  module issues
  ([09c66cb](https://github.com/storm-software/storm-ops/commit/09c66cb2c2fc94f59149b93d299cc95346438542))
- **semantic-release-plugin:** Mark the semantic-release plugin as external
  ([863ed64](https://github.com/storm-software/storm-ops/commit/863ed640a3960fbed7de71f946db0e2d591c87b8))
- **semantic-release-plugin:** Patch semantic-release-plugin-decorators to use
  import instead of require
  ([8a4b348](https://github.com/storm-software/storm-ops/commit/8a4b34854be0b5b6e7d4bef05942de8ea7ab84b4))
- **semantic-release-plugin:** Remove code to avoid semantic release built-in
  plugins
  ([6a7263b](https://github.com/storm-software/storm-ops/commit/6a7263b1273c0233ccdb79b3c3c06a9059375e5d))
- **semantic-release-plugin:** Remove third party code from bundle
  ([5d0d464](https://github.com/storm-software/storm-ops/commit/5d0d464e75d1fdd47e8db9f471ef8655a6b800e5))
- **semantic-release-plugin:** Removed dependancy on commit analyzer
  ([4796955](https://github.com/storm-software/storm-ops/commit/479695525e578ead9ada3fc79b2f46edfb0b667d))
- **semantic-release-plugin:** Resolve imports to support ES modules
  ([91cdf56](https://github.com/storm-software/storm-ops/commit/91cdf569e0e2237bbc0cb2e81446c3b2578a2e27))
- **semantic-release-plugin:** Resolve issue with main path extension in
  package.json
  ([b2aa62b](https://github.com/storm-software/storm-ops/commit/b2aa62be19ed31f64f6b1c483f0dd480ce73c1de))
- **semantic-release-plugin:** Resolve missing path module
  ([34409df](https://github.com/storm-software/storm-ops/commit/34409df07f095e6b11d80f570d03dea3bf859a86))
- **semantic-release-plugin:** Resolve path import issue
  ([c7769a1](https://github.com/storm-software/storm-ops/commit/c7769a123fbb48988c58047fa4832563b7946dad))
- **semantic-release-plugin:** Unbundle sematic release plugin
  ([7910e43](https://github.com/storm-software/storm-ops/commit/7910e43b14a9f048ad4979cdc8819589adbc1b3a))
- **semantic-release-plugin:** Update extension on main file to be mjs
  ([8c6e389](https://github.com/storm-software/storm-ops/commit/8c6e389bac21008b2cb4289b47f345ec52b2c204))
- **semantic-release-plugin:** Update the package.json index file path
  ([1da1cce](https://github.com/storm-software/storm-ops/commit/1da1cce9d135826636ed7af371e01db329bf1cc9))
- **storm-ops:** Added back husky hooks and removed config from package.json
  ([f1b0b85](https://github.com/storm-software/storm-ops/commit/f1b0b85af21c22051a9f26c8d987c4370c60ca76))
- **storm-ops:** Fixed issues with paths in husky hooks
  ([97ddda2](https://github.com/storm-software/storm-ops/commit/97ddda2f59cfde43e9f0026ed4bb713c67c6404c))
- **storm-ops:** Patch semantic release to use old config import
  ([18e27d6](https://github.com/storm-software/storm-ops/commit/18e27d6f5038475e28a83efbfdb0438fac3acda2))
- **storm-ops:** Remove unused workspace config from package.json
  ([0651468](https://github.com/storm-software/storm-ops/commit/0651468547eab92f29ea0f74152752eb700af0cb))
- **storm-ops:** Resolve issue with large image assets
  ([e0a49a0](https://github.com/storm-software/storm-ops/commit/e0a49a0b1d560794d09abdddd20434ae66900a1c))
- **storm-ops:** Resolved issue with lint staged config path in workspace hooks
  folder
  ([1fd5d07](https://github.com/storm-software/storm-ops/commit/1fd5d07298dd96ac70eff6171b17034c47ac88fb))
- **storm-ops:** Resolved issues with build/CI
  ([fc81a8f](https://github.com/storm-software/storm-ops/commit/fc81a8f527d7b0a069818243f955d05062a4efac))
- **storm-ops:** Resolved issues with pnpm lockfile
  ([563238c](https://github.com/storm-software/storm-ops/commit/563238cad00bc4042512438aee4072a084cfce99))
- **storm-ops:** Update env prefix with STORM to specify it is internal
  ([7e7468b](https://github.com/storm-software/storm-ops/commit/7e7468b6e21dd993bc8af9af74bda10b926c5e6f))
- **storm-ops:** Update linting tools, and scripts, to use ES modules
  ([59cb4a1](https://github.com/storm-software/storm-ops/commit/59cb4a18772bbe85a8d88aa356c37b799ce0d11f))
- **storm-ops:** Update lockfile for monorepo
  ([fc39b4a](https://github.com/storm-software/storm-ops/commit/fc39b4a32e199550eddf85360728e9253d210fa7))
- **storm-ops:** Update paths used to check for package.json during versioning
  ([5e87fd0](https://github.com/storm-software/storm-ops/commit/5e87fd0d472ff670c48081fd30c15eaa699dcde5))
- **storm-ops:** Update the directory paths in child package.json files
  ([77b739e](https://github.com/storm-software/storm-ops/commit/77b739e5ff4266a0a7a7b9ab0a6dc39062ecfbe7))
- **storm-ops:** Update the REPO_ROOT env to align with new naming convention
  ([02d58d0](https://github.com/storm-software/storm-ops/commit/02d58d05c15de07c9123427df7fead73bfed5364))
- **storm-ops:** Update workspace package.json file with private field set to
  false
  ([2045f27](https://github.com/storm-software/storm-ops/commit/2045f2753e90828747d155903dc5071864e893aa))

### Features

- **create-storm-workspace:** Initial check-in for storm-ops monorepo
  ([ecb9822](https://github.com/storm-software/storm-ops/commit/ecb9822741fd989c3ce68fd7d07547e8b925cd9d))
- **git-tools:** Move the semantic-release-plugin into the git-tools package
  ([663e7ca](https://github.com/storm-software/storm-ops/commit/663e7ca6f51bf141b698a6448f88471278a2c77f))
- **semantic-release-plugin:** Resolve issues with plugin so release executes
  ([b7164b5](https://github.com/storm-software/storm-ops/commit/b7164b5b5b077da44a40141ade245ddd26ae54ee))
- **semantic-release-plugin:** Split out the semantic release plugin into it's
  own project
  ([317e52c](https://github.com/storm-software/storm-ops/commit/317e52ca4278855a87a5d1f8b52faab610a35ba8))

### Reverts

- **git-tools:** Revert import of commit analyzer
  ([dcd6029](https://github.com/storm-software/storm-ops/commit/dcd60297b34a3c73ce16fe5f5176302693b5ed8b))
