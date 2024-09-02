## 0.9.0 (2024-09-02)


### Features

- **terraform-modules:** Added the `aws/karpenter` and `cloudflare/r2-bucket` modules ([09deea18](https://github.com/storm-software/storm-ops/commit/09deea18))


### Bug Fixes

- **terraform-modules:** Resolved issue with applying tags to resources ([a0fd5e19](https://github.com/storm-software/storm-ops/commit/a0fd5e19))

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
