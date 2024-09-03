## 0.22.0 (2024-09-02)


### Features

- **terraform-modules:** Added the `aws/karpenter` and `cloudflare/r2-bucket` modules ([09deea18](https://github.com/storm-software/storm-ops/commit/09deea18))


### Bug Fixes

- **terraform-modules:** Resolved issue with applying tags to resources ([a0fd5e19](https://github.com/storm-software/storm-ops/commit/a0fd5e19))

## 0.21.0 (2024-09-01)


### Features

- **eslint:** Update ESLint line-breaking rules ([1d08c4e1](https://github.com/storm-software/storm-ops/commit/1d08c4e1))


### Bug Fixes

- **workspace-tools:** Resolved various issues with `rollup` executor ([5b350c35](https://github.com/storm-software/storm-ops/commit/5b350c35))

## 0.20.1 (2024-09-01)


### Bug Fixes

- **workspace-tools:** Resolve issue with excessive logging in Cargo plugin ([5562f21f](https://github.com/storm-software/storm-ops/commit/5562f21f))

## 0.20.0 (2024-09-01)


### Features

- **workspace-tools:** Added the `noDeps` flag to the cargo-doc executor options ([82eeb944](https://github.com/storm-software/storm-ops/commit/82eeb944))

## 0.19.1 (2024-08-31)


### Bug Fixes

- **build-tools:** Added try/catch to utility function ([3ce4a7cd](https://github.com/storm-software/storm-ops/commit/3ce4a7cd))

## 0.19.0 (2024-08-31)


### Features

- **eslint:** Update linting rules to ignore the length of commands and use double quotes ([f9c603d7](https://github.com/storm-software/storm-ops/commit/f9c603d7))

## 0.18.4 (2024-08-31)


### Bug Fixes

- **terraform-modules:** Resolve issue with output variable name ([dd5b63fb](https://github.com/storm-software/storm-ops/commit/dd5b63fb))

## 0.18.3 (2024-08-31)


### Bug Fixes

- **terraform-modules:** Resolved issue with conditional statement syntax ([c96e9a9e](https://github.com/storm-software/storm-ops/commit/c96e9a9e))

## 0.18.2 (2024-08-30)


### Bug Fixes

- **terraform-modules:** Added default values for `full_name` variables ([8779001e](https://github.com/storm-software/storm-ops/commit/8779001e))

## 0.18.1 (2024-08-29)


### Bug Fixes

- **workspace-tools:** Resolved issue with multi-layer extends in Nx configurations ([9cb9d2ff](https://github.com/storm-software/storm-ops/commit/9cb9d2ff))

## 0.18.0 (2024-08-29)


### Features

- **workspace-tools:** Added `nx-default.json` and `nx-cloud.json` files ([4bb13faa](https://github.com/storm-software/storm-ops/commit/4bb13faa))

## 0.17.2 (2024-08-27)


### Bug Fixes

- **k8s-tools:** Resolved issue with invalid import ([82a782d4](https://github.com/storm-software/storm-ops/commit/82a782d4))

## 0.17.1 (2024-08-27)


### Bug Fixes

- **k8s-tools:** Resolved issue invoking generator functions ([405367cb](https://github.com/storm-software/storm-ops/commit/405367cb))

## 0.17.0 (2024-08-27)


### Features

- **workspace-tools:** Added Cargo executors for build, check, doc, clippy, and format ([52ffcec8](https://github.com/storm-software/storm-ops/commit/52ffcec8))

## 0.16.1 (2024-08-26)


### Bug Fixes

- **workspace-tools:** Resolved issues with the lint configuration files ([9f7d724c](https://github.com/storm-software/storm-ops/commit/9f7d724c))

## 0.16.0 (2024-08-26)


### Features

- **workspace-tools:** Resolve issue with invalid `.ls-lint.yml` config file path ([2315850a](https://github.com/storm-software/storm-ops/commit/2315850a))

## 0.15.0 (2024-08-26)


### Features

- **workspace-tools:** Remove the `format` task as a dependency of `build` ([75966255](https://github.com/storm-software/storm-ops/commit/75966255))

## 0.14.0 (2024-08-23)


### Features

- **k8s-tools:** Initial code check-in of k8s tools ([cac95faa](https://github.com/storm-software/storm-ops/commit/cac95faa))

## 0.13.0 (2024-08-22)


### Features

- **workspace-tools:** Added the `includeApps` option to the Rust and TypeScript plugins ([7bd309f6](https://github.com/storm-software/storm-ops/commit/7bd309f6))

## 0.12.0 (2024-08-21)


### Features

- **terraform-modules:** Added the `full_name` optional variable ([3d612c7a](https://github.com/storm-software/storm-ops/commit/3d612c7a))

## 0.11.0 (2024-08-21)


### Features

- **terraform-modules:** Added the `Name` tag to resources ([80b3d1dc](https://github.com/storm-software/storm-ops/commit/80b3d1dc))

## 0.10.1 (2024-08-21)


### Bug Fixes

- **terraform-modules:** Resolved issue with AWS resource naming convention ([97687c4f](https://github.com/storm-software/storm-ops/commit/97687c4f))

## 0.10.0 (2024-08-21)


### Features

- **terraform-modules:** Added providers back to terraform modules ([d924d7e2](https://github.com/storm-software/storm-ops/commit/d924d7e2))

## 0.9.0 (2024-08-20)


### Features

- **terraform-modules:** Added the `workspace_root` variable to lambda modules ([6e42a015](https://github.com/storm-software/storm-ops/commit/6e42a015))

## 0.8.0 (2024-08-19)


### Features

- **terraform-modules:** Add `region` to resource name ([03291fe8](https://github.com/storm-software/storm-ops/commit/03291fe8))

## 0.7.0 (2024-08-19)


### Features

- **terraform-modules:** Added the `api-lambda-rs` module ([f20c6652](https://github.com/storm-software/storm-ops/commit/f20c6652))

## 0.6.0 (2024-08-19)


### Features

- **terraform-modules:** Added the `lambda-api-gateway` terraform module ([3438fc37](https://github.com/storm-software/storm-ops/commit/3438fc37))

- **terraform-modules:** Added the `environment` variable to the terraform modules ([7bef47d5](https://github.com/storm-software/storm-ops/commit/7bef47d5))


### Bug Fixes

- **terraform-modules:** Rename the `sns_topic_subscription` resource ([a46a1fb0](https://github.com/storm-software/storm-ops/commit/a46a1fb0))

## 0.5.0 (2024-08-19)


### Features

- **terraform-modules:** Added the `sns_topic` terraform module ([015945f3](https://github.com/storm-software/storm-ops/commit/015945f3))

## 0.4.0 (2024-08-18)


### Features

- **terraform-modules:** Add types to variables ([c6e5d6b3](https://github.com/storm-software/storm-ops/commit/c6e5d6b3))

## 0.3.1 (2024-08-18)


### Bug Fixes

- **terraform-modules:** Resolved issue providing the environment variables ([aa5d5d9b](https://github.com/storm-software/storm-ops/commit/aa5d5d9b))

## 0.3.0 (2024-08-18)


### Features

- **terraform-modules:** Added debugging environment variuables to lambda module ([3f78b374](https://github.com/storm-software/storm-ops/commit/3f78b374))

## 0.2.0 (2024-08-17)


### Features

- **terraform-modules:** Added log group to `lambda-rs` terraform module ([5e6f5e6a](https://github.com/storm-software/storm-ops/commit/5e6f5e6a))

## 0.1.0 (2024-08-17)


### Features

- **terraform-modules:** Update names of terraform resources ([57259f3f](https://github.com/storm-software/storm-ops/commit/57259f3f))