<!-- START header -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->


<div align="center"><img src="https://pub-761b436209f44a4d886487c917806c08.r2.dev/storm-banner.gif" width="100%" alt="Storm Software" /></div>
<br />

<div align="center">
<b>
<a href="https://stormsoftware.com" target="_blank">Website</a>  •
<a href="https://github.com/storm-software/storm-ops" target="_blank">GitHub</a>  •
<a href="https://discord.gg/MQ6YVzakM5">Discord</a>  •  <a href="https://stormstack.github.io/stormstack/" target="_blank">Docs</a>  •  <a href="https://stormsoftware.com/contact" target="_blank">Contact</a>  •
<a href="https://github.com/storm-software/storm-ops/issues/new?assignees=&labels=bug&template=bug-report.yml&title=Bug Report%3A+">Report a Bug</a>
</b>
</div>

<br />
This package is part of the <b>⚡Storm-Ops</b> monorepo. The Storm-Ops packages include CLI utility applications, tools, and various libraries used to create modern, scalable web applications.
<br />

<h3 align="center">💻 Visit <a href="https://stormsoftware.com" target="_blank">stormsoftware.com</a> to stay up to date with this developer</h3><br />

[![Version](https://img.shields.io/badge/version-1.217.2-1fb2a6.svg?style=for-the-badge&color=1fb2a6)](https://prettier.io/)&nbsp;[![Nx](https://img.shields.io/badge/Nx-17.0.2-lightgrey?style=for-the-badge&logo=nx&logoWidth=20&&color=1fb2a6)](http://nx.dev/)&nbsp;[![NextJs](https://img.shields.io/badge/Next.js-14.0.2-lightgrey?style=for-the-badge&logo=nextdotjs&logoWidth=20&color=1fb2a6)](https://nextjs.org/)&nbsp;[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=for-the-badge&logo=commitlint&color=1fb2a6)](http://commitizen.github.io/cz-cli/)&nbsp;![Semantic-Release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=for-the-badge&color=1fb2a6)&nbsp;[![documented with Fumadocs](https://img.shields.io/badge/documented_with-fumadocs-success.svg?style=for-the-badge&logo=readthedocs&color=1fb2a6)](https://fumadocs.vercel.app/)&nbsp;![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/storm-software/storm-ops/cr.yml?style=for-the-badge&logo=github-actions&color=1fb2a6)

<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

> [!IMPORTANT] 
> This repository, and the apps, libraries, and tools contained within, is still in it's initial development phase. As a result, bugs and issues are expected with it's usage. When the main development phase completes, a proper release will be performed, the packages will be availible through NPM (and other distributions), and this message will be removed. However, in the meantime, please feel free to report any issues you may come across.

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<div align="center">
<b>Be sure to ⭐ this repository on <a href="https://github.com/storm-software/storm-ops" target="_blank">GitHub</a> so you can keep up to date on any daily progress!</b>
</div>

<br />

<!-- START doctoc -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [Storm Workspace Tools](#storm-workspace-tools)
  - [Installing](#installing)
  - [Executors](#executors)
  - [Typia Generate](#typia-generate)
    - [Example](#example)
    - [Options](#options)
  - [ESBuild Builder](#esbuild-builder)
    - [Example](#example-1)
    - [Options](#options-1)
  - [Unbuild Builder](#unbuild-builder)
    - [Example](#example-2)
    - [Options](#options-2)
  - [Clean Publish](#clean-publish)
    - [Example](#example-3)
    - [Options](#options-3)
  - [Size-Limit Test](#size-limit-test)
    - [Example](#example-4)
    - [Options](#options-4)
  - [Npm Publish](#npm-publish)
    - [Example](#example-5)
    - [Options](#options-5)
  - [Cargo Publish](#cargo-publish)
    - [Example](#example-6)
    - [Options](#options-6)
  - [Cargo Build](#cargo-build)
    - [Example](#example-7)
    - [Options](#options-7)
  - [Cargo Check](#cargo-check)
    - [Example](#example-8)
    - [Options](#options-8)
  - [Cargo Format](#cargo-format)
    - [Example](#example-9)
    - [Options](#options-9)
  - [Cargo Clippy](#cargo-clippy)
    - [Example](#example-10)
    - [Options](#options-10)
  - [Cargo Doc](#cargo-doc)
    - [Example](#example-11)
    - [Options](#options-11)
  - [Generators](#generators)
  - [Init Storm Workspace Plugin](#init-storm-workspace-plugin)
    - [Options](#options-12)
  - [Workspace Preset](#workspace-preset)
    - [Examples](#examples)
    - [Options](#options-13)
  - [Add Node Library](#add-node-library)
    - [Options](#options-14)
  - [Configuration Schema Creator](#configuration-schema-creator)
    - [Options](#options-15)
  - [Add Neutral Library](#add-neutral-library)
    - [Options](#options-16)
  - [Add browser Library](#add-browser-library)
    - [Options](#options-17)
  - [design-tokens](#design-tokens)
  - [Storm Release Version Generator](#storm-release-version-generator)
    - [Options](#options-18)
  - [Building](#building)
  - [Running unit tests](#running-unit-tests)
  - [Storm Workspaces](#storm-workspaces)
  - [Roadmap](#roadmap)
  - [Support](#support)
  - [License](#license)
  - [Changelog](#changelog)
  - [Contributing](#contributing)
  - [Contributors](#contributors)

<!-- END doctoc -->

<br />

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- END header -->

# Storm Workspace Tools

A package containing tools for managing a Storm workspace. It includes various
[Nx](https://nx.dev) generators and executors for common development tasks.

## Installing

Using [pnpm](http://pnpm.io):

```bash
pnpm add -D @storm-software/workspace-tools
```

<details>
  <summary>Using npm</summary>

```bash
npm install -D @storm-software/workspace-tools
```

</details>

<details>
  <summary>Using yarn</summary>

```bash
yarn add -D @storm-software/workspace-tools
```

</details>

## Executors

The following executors are available in this package to invoke common tasks for
the workspace's projects:

<!-- START executors -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->


## Typia Generate

Run the Typia generator to create runtime type validators

### Example 

This executor can be used by executing the following in a command line utility: 

```cmd 
nx run my-project:typia
```

**Please note:** _The typia executor should be included in the desired projects's `project.json` file.All required options must be included in the `options` property of the json._ 

### Options

The following executor options are available:

| Option    | Type   | Description   | Default   | 
| --------- | ------ | ------------- | --------- | 
| **entryPath \***    | `string`    | The path of the typescript files using \`typia\`.     | "{sourceRoot}"     | 
 | **outputPath \***    | `string`    | The output path of the generated files.     | "{sourceRoot}/__generated__/typia"     | 
 | **tsConfig \***    | `string`    | The path to the \`tsconfig.json\` file.     | "{projectRoot}/tsconfig.json"     | 
 | clean      | `boolean`    | Remove previous output before build.     | `true`     | 


**Please note:** _Option names followed by \* above are required, and must be provided to run the executor._ 



## ESBuild Builder

Run the esbuild build process on a selected project

### Example 

This executor can be used by executing the following in a command line utility: 

```cmd 
nx run my-project:esbuild
```

**Please note:** _The esbuild executor should be included in the desired projects's `project.json` file.All required options must be included in the `options` property of the json._ 

### Options

The following executor options are available:

| Option    | Type   | Description   | Default   | 
| --------- | ------ | ------------- | --------- | 
| **entry \***    | `string[]`   | The path to the entry file (or multiple paths/files), relative to \`projectRoot\` path.     | `[]`     | 
 | **outputPath \***    | `string`    | The output path of the generated files.     | "dist/{projectRoot}"     | 
 | **tsconfig \***    | `string`    | The path to the \`tsconfig.json\` file.     | "{projectRoot}/tsconfig.json"     | 
 | watch      | `boolean`    | Enable re-building when files change.     |     | 
 | assets      | `array`    | List of static assets.     | `[]`     | 
 | clean      | `boolean`    | Remove previous output before build.     | `true`     | 
 | includeSrc      | `boolean`    | Should the source files be added to the distribution folder in an \`src\` directory.     |     | 
 | generatePackageJson      | `boolean`    | Should a package.json file be generated in the output folder or should the existing one be copied in.     | `true`     | 
 | debug      | `boolean`    | Should output be unminified with source mappings.     |     | 
 | platform      | "browser" \| "neutral" \| "node"     | Platform target for outputs.     | "neutral"     | 
 | banner      | `string`    | A short heading added to the top of each distribution file added in the output folder.     | "//      ⚡ Built by Storm Software"     | 
 | minify      | `boolean`    | Should the build process minify the output files?     |     | 
 | verbose      | `boolean`    | Should write extra log outputs with details from the executor.     |     | 


**Please note:** _Option names followed by \* above are required, and must be provided to run the executor._ 



## Unbuild Builder

Run the unbuild build process on a selected project

### Example 

This executor can be used by executing the following in a command line utility: 

```cmd 
nx run my-project:unbuild
```

**Please note:** _The unbuild executor should be included in the desired projects's `project.json` file.All required options must be included in the `options` property of the json._ 

### Options

The following executor options are available:

| Option    | Type   | Description   | Default   | 
| --------- | ------ | ------------- | --------- | 
| entry      | `string[]`   | The path to the entry file (or multiple paths/files), relative to \`projectRoot\` path.     | `[]`     | 
 | outputPath      | `string`    | The output path of the generated files.     | "dist/{projectRoot}"     | 
 | tsconfig      | `string`    | The path to the \`tsconfig.json\` file.     | "{projectRoot}/tsconfig.json"     | 
 | watch      | `boolean`    | Enable re-building when files change.     |     | 
 | assets      | `array`    | List of static assets.     | `[]`     | 
 | clean      | `boolean`    | Remove previous output before build.     | `true`     | 
 | includeSrc      | `boolean`    | Should the source files be added to the distribution folder in an \`src\` directory.     |     | 
 | generatePackageJson      | `boolean`    | Should a package.json file be generated in the output folder or should the existing one be copied in.     | `true`     | 
 | debug      | `boolean`    | Should output be unminified with source mappings.     |     | 
 | **platform \***    | "browser" \| "neutral" \| "node"     | Platform target for outputs.     | "neutral"     | 
 | banner      | `string`    | A short heading added to the top of each distribution file added in the output folder.     | "//      ⚡ Built by Storm Software"     | 
 | minify      | `boolean`    | Should the build process minify the output files?     |     | 
 | verbose      | `boolean`    | Should write extra log outputs with details from the executor.     |     | 


**Please note:** _Option names followed by \* above are required, and must be provided to run the executor._ 



## Clean Publish

Remove configuration files, fields, and scripts for development before publishing package. This tool is inspired by the [clean-publish](https://github.com/shashkovdanil/clean-publish/tree/master) package

### Example 

This executor can be used by executing the following in a command line utility: 

```cmd 
nx run my-project:clean-package
```

**Please note:** _The clean-package executor should be included in the desired projects's `project.json` file.All required options must be included in the `options` property of the json._ 

### Options

The following executor options are available:

| Option    | Type   | Description   | Default   | 
| --------- | ------ | ------------- | --------- | 
| **outputPath \***    | `string`    | The output path of the generated files.     | "dist/{projectRoot}"     | 
 | packageJsonPath      | `string`    | The path to the package.json file, relative to the workspace root.     |     | 
 | **cleanReadMe \***    | `boolean`    | Should API Extractor generate an TSDoc Metadata file.     | `true`     | 
 | **cleanComments \***    | `boolean`    | Should API Extractor generate an TSDoc Metadata file.     | `true`     | 
 | ignoredFiles      | `string`    | List of ESBuild plugins to use during processing     |     | 
 | fields      | `string`    | List of ESBuild plugins to use during processing     |     | 


**Please note:** _Option names followed by \* above are required, and must be provided to run the executor._ 



## Size-Limit Test

Run a size-limit performance test on the project

### Example 

This executor can be used by executing the following in a command line utility: 

```cmd 
nx run my-project:size-limit
```

**Please note:** _The size-limit executor should be included in the desired projects's `project.json` file._ 

### Options

The following executor options are available:

| Option    | Type   | Description   | Default   | 
| --------- | ------ | ------------- | --------- | 
| entry      | `string`    | The path to the entry file, relative to project.     |     | 




## Npm Publish

Publish a package to the NPM registry - DO NOT INVOKE DIRECTLY WITH \`nx run\`. Use \`nx release publish\` instead.

### Example 

This executor can be used by executing the following in a command line utility: 

```cmd 
nx run my-project:npm-publish
```

**Please note:** _The npm-publish executor should be included in the desired projects's `project.json` file._ 

### Options

The following executor options are available:

| Option    | Type   | Description   | Default   | 
| --------- | ------ | ------------- | --------- | 
| packageRoot      | `string`    | The root directory of the package (containing a manifest file at its root) to publish. Defaults to the project root.     |     | 
 | registry      | `string`    | The NPM registry URL to publish the package to.     |     | 
 | tag      | `string`    | The distribution tag to apply to the published package.     |     | 
 | dryRun      | `boolean`    | Whether to run the command without actually publishing the package to the registry.     |     | 




## Cargo Publish

Publish a package to the crates.io registry - DO NOT INVOKE DIRECTLY WITH \`nx run\`. Use \`nx release publish\` instead.

### Example 

This executor can be used by executing the following in a command line utility: 

```cmd 
nx run my-project:cargo-publish
```

**Please note:** _The cargo-publish executor should be included in the desired projects's `project.json` file._ 

### Options

The following executor options are available:

| Option    | Type   | Description   | Default   | 
| --------- | ------ | ------------- | --------- | 
| registry      | `string`    | The Cargo registry URL to publish the package to.     |     | 
 | packageRoot      | `string`    | The root directory of the directory (containing a manifest file at its root) to publish. Defaults to the project root.     |     | 
 | dryRun      | `boolean`    | Whether to run the command without actually publishing the package to the registry.     |     | 




## Cargo Build

Run a Rust build on the project using Cargo

### Example 

This executor can be used by executing the following in a command line utility: 

```cmd 
nx run my-project:cargo-build
```

**Please note:** _The cargo-build executor should be included in the desired projects's `project.json` file.All required options must be included in the `options` property of the json._ 

### Options

The following executor options are available:

| Option    | Type   | Description   | Default   | 
| --------- | ------ | ------------- | --------- | 
| release      | `boolean`    | Run the Cargo command for the project in release mode     |     | 
 | profile      | `string`    | Build artifacts with the specified profile     |     | 
 | outputPath      | `string`    | The output path of the generated files.     | "dist/target/{projectRoot}"     | 
 | **toolchain \***    | "stable" \| "beta" \| "nightly"     | The Rust toolchain to use     | "stable"     | 
 | features      | `string`   | Features of workspace members may be enabled with package-name/feature-name syntax. Array of names is supported     |     | 
 | allFeatures      | `boolean`    | Build all binary targets     |     | 
 | target      | `string`    | Build the specified target     |     | 
 | lib      | `boolean`    | Build the package's library     |     | 
 | bin      | `string`   | Build the specified binary. Array of names or common Unix glob patterns is supported     |     | 
 | bins      | `boolean`    | Build all binary targets     |     | 
 | example      | `string`   | Build the specified example. Array of names or common Unix glob patterns is supported     |     | 
 | examples      | `boolean`    | Build all example targets     |     | 
 | test      | `string`   | Build the specified test. Array of names or common Unix glob patterns is supported     |     | 
 | tests      | `boolean`    | Build all test targets     |     | 
 | bench      | `string`   | Build the specified bench. Array of names or common Unix glob patterns is supported     |     | 
 | benches      | `boolean`    | Build all targets in benchmark mode that have the bench = true manifest flag set. By default this includes the library and binaries built as benchmarks, and bench targets. Be aware that this will also build any required dependencies, so the lib target may be built twice (once as a benchmark, and once as a dependency for binaries, benchmarks, etc.). Targets may be enabled or disabled by setting the bench flag in the manifest settings for the target.     |     | 
 | allTargets      | `boolean`    | Build all test targets     |     | 


**Please note:** _Option names followed by \* above are required, and must be provided to run the executor._ 



## Cargo Check

Check a Rust project with Cargo

### Example 

This executor can be used by executing the following in a command line utility: 

```cmd 
nx run my-project:cargo-check
```

**Please note:** _The cargo-check executor should be included in the desired projects's `project.json` file._ 

### Options

The following executor options are available:

| Option    | Type   | Description   | Default   | 
| --------- | ------ | ------------- | --------- | 
| release      | `boolean`    | Run the Cargo command for the project in release mode     |     | 
 | profile      | `string`    | Build artifacts with the specified profile     |     | 
 | toolchain      | "stable" \| "beta" \| "nightly"     | The Rust toolchain to use     | "stable"     | 
 | features      | `string`   | Features of workspace members may be enabled with package-name/feature-name syntax. Array of names is supported     |     | 
 | allFeatures      | `boolean`    | Build all binary targets     |     | 
 | target      | `string`    | Build the specified target     |     | 
 | lib      | `boolean`    | Build the package's library     |     | 
 | bin      | `string`   | Build the specified binary. Array of names or common Unix glob patterns is supported     |     | 
 | bins      | `boolean`    | Build all binary targets     |     | 
 | example      | `string`   | Build the specified example. Array of names or common Unix glob patterns is supported     |     | 
 | examples      | `boolean`    | Build all example targets     |     | 
 | test      | `string`   | Build the specified test. Array of names or common Unix glob patterns is supported     |     | 
 | tests      | `boolean`    | Build all test targets     |     | 
 | bench      | `string`   | Build the specified bench. Array of names or common Unix glob patterns is supported     |     | 
 | benches      | `boolean`    | Build all targets in benchmark mode that have the bench = true manifest flag set. By default this includes the library and binaries built as benchmarks, and bench targets. Be aware that this will also build any required dependencies, so the lib target may be built twice (once as a benchmark, and once as a dependency for binaries, benchmarks, etc.). Targets may be enabled or disabled by setting the bench flag in the manifest settings for the target.     |     | 
 | allTargets      | `boolean`    | Build all test targets     |     | 




## Cargo Format

Format a Rust project with Cargo

### Example 

This executor can be used by executing the following in a command line utility: 

```cmd 
nx run my-project:cargo-format
```

**Please note:** _The cargo-format executor should be included in the desired projects's `project.json` file._ 

### Options

The following executor options are available:

| Option    | Type   | Description   | Default   | 
| --------- | ------ | ------------- | --------- | 
| release      | `boolean`    | Run the Cargo command for the project in release mode     |     | 
 | profile      | `string`    | Build artifacts with the specified profile     |     | 
 | toolchain      | "stable" \| "beta" \| "nightly"     | The Rust toolchain to use     | "stable"     | 
 | features      | `string`   | Features of workspace members may be enabled with package-name/feature-name syntax. Array of names is supported     |     | 
 | allFeatures      | `boolean`    | Build all binary targets     |     | 
 | lib      | `boolean`    | Build the package's library     |     | 
 | bin      | `string`   | Build the specified binary. Array of names or common Unix glob patterns is supported     |     | 
 | bins      | `boolean`    | Build all binary targets     |     | 
 | example      | `string`   | Build the specified example. Array of names or common Unix glob patterns is supported     |     | 
 | examples      | `boolean`    | Build all example targets     |     | 
 | test      | `string`   | Build the specified test. Array of names or common Unix glob patterns is supported     |     | 
 | tests      | `boolean`    | Build all test targets     |     | 
 | bench      | `string`   | Build the specified bench. Array of names or common Unix glob patterns is supported     |     | 
 | benches      | `boolean`    | Build all targets in benchmark mode that have the bench = true manifest flag set. By default this includes the library and binaries built as benchmarks, and bench targets. Be aware that this will also build any required dependencies, so the lib target may be built twice (once as a benchmark, and once as a dependency for binaries, benchmarks, etc.). Targets may be enabled or disabled by setting the bench flag in the manifest settings for the target.     |     | 
 | allTargets      | `boolean`    | Build all test targets     |     | 




## Cargo Clippy

Lint a Rust project with Cargo Clippy

### Example 

This executor can be used by executing the following in a command line utility: 

```cmd 
nx run my-project:cargo-clippy
```

**Please note:** _The cargo-clippy executor should be included in the desired projects's `project.json` file._ 

### Options

The following executor options are available:

| Option    | Type   | Description   | Default   | 
| --------- | ------ | ------------- | --------- | 
| release      | `boolean`    | Run the Cargo command for the project in release mode     |     | 
 | profile      | `string`    | Build artifacts with the specified profile     |     | 
 | toolchain      | "stable" \| "beta" \| "nightly"     | The Rust toolchain to use     | "stable"     | 
 | target      | `string`    | Build the specified target     |     | 
 | fix      | `boolean`    | Automatically apply suggestions     |     | 




## Cargo Doc

Create docs for a Rust project with Cargo Doc

### Example 

This executor can be used by executing the following in a command line utility: 

```cmd 
nx run my-project:cargo-doc
```

**Please note:** _The cargo-doc executor should be included in the desired projects's `project.json` file.All required options must be included in the `options` property of the json._ 

### Options

The following executor options are available:

| Option    | Type   | Description   | Default   | 
| --------- | ------ | ------------- | --------- | 
| release      | `boolean`    | Run the Cargo command for the project in release mode     | `true`     | 
 | profile      | `string`    | Build artifacts with the specified profile     |     | 
 | **outputPath \***    | `string`    | The output path of the generated files.     | "dist/docs/{projectRoot}"     | 
 | toolchain      | "stable" \| "beta" \| "nightly"     | The Rust toolchain to use     | "stable"     | 
 | noDeps      | `boolean`    | Don't build documentation for dependencies     | `true`     | 
 | features      | `string`   | Features of workspace members may be enabled with package-name/feature-name syntax. Array of names is supported     |     | 
 | allFeatures      | `boolean`    | Build all binary targets     | `true`     | 
 | target      | `string`    | Build the specified target     |     | 
 | lib      | `boolean`    | Build the package's library     | `true`     | 
 | bin      | `string`   | Build the specified binary. Array of names or common Unix glob patterns is supported     |     | 
 | bins      | `boolean`    | Build all binary targets     | `true`     | 
 | example      | `string`   | Build the specified example. Array of names or common Unix glob patterns is supported     |     | 
 | examples      | `boolean`    | Build all example targets     | `true`     | 
 | test      | `string`   | Build the specified test. Array of names or common Unix glob patterns is supported     |     | 
 | tests      | `boolean`    | Build all test targets     |     | 
 | bench      | `string`   | Build the specified bench. Array of names or common Unix glob patterns is supported     |     | 
 | benches      | `boolean`    | Build all targets in benchmark mode that have the bench = true manifest flag set. By default this includes the library and binaries built as benchmarks, and bench targets. Be aware that this will also build any required dependencies, so the lib target may be built twice (once as a benchmark, and once as a dependency for binaries, benchmarks, etc.). Targets may be enabled or disabled by setting the bench flag in the manifest settings for the target.     |     | 
 | allTargets      | `boolean`    | Build all test targets     |     | 


**Please note:** _Option names followed by \* above are required, and must be provided to run the executor._ 



<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- END executors -->

## Generators

The following generators are available with this package to assist in workspace
management:

<!-- START generators -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->


## Init Storm Workspace Plugin

Init Storm Workspace Plugin.

### Options

The following executor options are available:

| Option    | Type   | Description   | Default   | 
| --------- | ------ | ------------- | --------- | 
| skipFormat      | `boolean`    | Skip formatting files.     |     | 




## Workspace Preset

Create a Storm workspace with all of the required files and recommended packages installed.

### Examples 

This generator can be used by executing the following examples in a command line utility: 

Generate a storm workspace with: 
- name: example-repo 
- namespace: storm-software 
- organization: storm-software 
- repositoryUrl: <https://github.com/storm-software/example-repo>

```bash 
nx g @storm-software/workspace-tools:preset --name 'example-repo'
```



Generate a storm workspace with: 
- name: example-repo 
- namespace: example 
- repositoryUrl: <https://github.com/storm-software/example-repo>

```bash 
nx g @storm-software/workspace-tools:preset --name 'example-repo' --namespace 'example'
```



Generate a storm workspace with: 
- name: example-repo 
- namespace: example 
- organization: example-org 
- description: An example workspace 
- repositoryUrl: <https://github.com/example-org/example-repo>

```bash 
nx g @storm-software/workspace-tools:preset --name 'example-repo' --namespace 'example' --organization 'example-org' --description 'An example workspace'
```

### Options

The following executor options are available:

| Option    | Type   | Description   | Default   | 
| --------- | ------ | ------------- | --------- | 
| **name \***    | `string`    | The name of the workspace root.     |     | 
 | **organization \***    | `string`    | The organization that owns the workspace.     | "storm-software"     | 
 | namespace      | `string`    | The npm scope used for the workspace. Defaults to the organization name.     |     | 
 | **includeApps \***    | `boolean`    | Should a separate `apps` folder be created for this workspace (if Yes: `apps` and `libs` folders will be added, if No: `packages` folders will be added)?     |     | 
 | description      | `string`    | The description of the workspace to use in the package.json and README.md files.     |     | 
 | repositoryUrl      | `string`    | The URL of the workspace in GitHub. Defaults to <https://github.com/{organization}/{name}>     |     | 
 | includeRust      | `boolean`    | Should the workspace include Rust support?     |     | 
 | nxCloud      | `boolean`    | Should distributed caching with Nx Cloud be enabled for the workspace?     |     | 
 | **mode \***    | "light" \| "dark"     | Which client mode should be used for the Nx Task Runner?     | "dark"     | 
 | packageManager      | "npm" \| "yarn" \| "pnpm"     | What package manager is used for the workspace?     | "pnpm"     | 


**Please note:** _Option names followed by \* above are required, and must be provided to run the executor._ 



## Add Node Library

Create a new NodeJs TypeScript library package in the Storm workspace

### Options

The following executor options are available:

| Option    | Type   | Description   | Default   | 
| --------- | ------ | ------------- | --------- | 
| **name \***    | `string`    | A name for the library.     |     | 
 | description      | `string`    | The library used by Storm Software for building TypeScript applications.     |     | 
 | **directory \***    | `string`    | A directory where the lib is placed.     |     | 
 | **projectNameAndRootFormat \***    | "as-provided" \| "derived"     | Whether to generate the project name and root directory as provided (`as-provided`) or generate them composing their values and taking the configured layout into account (`derived`).     |     | 
 | tags      | `string`    | Add tags to the library (used for linting).     |     | 
 | strict      | `boolean`    | Whether to enable tsconfig strict mode or not.     | `true`     | 
 | **publishable \***    | `boolean`    | Generate a publishable library.     |     | 
 | **importPath \***    | `string`    | The library name used to import it, like @storm-software/my-awesome-lib. Required for publishable library.     |     | 
 | **buildable \***    | `boolean`    | Generate a buildable library.     | `true`     | 
 | setParserOptionsProject      | `boolean`    | Whether or not to configure the ESLint `parserOptions.project` option. We do not do this by default for lint performance reasons.     |     | 
 | rootProject      | `boolean`    | Is the current project the root project in the workspace.     |     | 


**Please note:** _Option names followed by \* above are required, and must be provided to run the executor._ 



## Configuration Schema Creator

Create a StormConfig JSON schema based on the workspace's project configurations

### Options

The following executor options are available:

| Option    | Type   | Description   | Default   | 
| --------- | ------ | ------------- | --------- | 
| **outputFile \***    | `string`    | The file path where the schema json will be written (relative to the workspace root)     | "./storm.schema.json"     | 


**Please note:** _Option names followed by \* above are required, and must be provided to run the executor._ 



## Add Neutral Library

Create a new Neutral TypeScript library package in the Storm workspaces

### Options

The following executor options are available:

| Option    | Type   | Description   | Default   | 
| --------- | ------ | ------------- | --------- | 
| **name \***    | `string`    | A name for the library.     |     | 
 | description      | `string`    | The library used by Storm Software for building TypeScript applications.     |     | 
 | **directory \***    | `string`    | A directory where the lib is placed.     |     | 
 | **projectNameAndRootFormat \***    | "as-provided" \| "derived"     | Whether to generate the project name and root directory as provided (`as-provided`) or generate them composing their values and taking the configured layout into account (`derived`).     |     | 
 | tags      | `string`    | Add tags to the library (used for linting).     |     | 
 | strict      | `boolean`    | Whether to enable tsconfig strict mode or not.     | `true`     | 
 | **publishable \***    | `boolean`    | Generate a publishable library.     |     | 
 | **importPath \***    | `string`    | The library name used to import it, like @storm-software/my-awesome-lib. Required for publishable library.     |     | 
 | **buildable \***    | `boolean`    | Generate a buildable library.     | `true`     | 
 | setParserOptionsProject      | `boolean`    | Whether or not to configure the ESLint `parserOptions.project` option. We do not do this by default for lint performance reasons.     |     | 
 | rootProject      | `boolean`    | Is the current project the root project in the workspace.     |     | 


**Please note:** _Option names followed by \* above are required, and must be provided to run the executor._ 



## Add browser Library

Create a new browser TypeScript library package in the Storm workspace

### Options

The following executor options are available:

| Option    | Type   | Description   | Default   | 
| --------- | ------ | ------------- | --------- | 
| **name \***    | `string`    | A name for the library.     |     | 
 | description      | `string`    | The library used by Storm Software for building TypeScript applications.     |     | 
 | **directory \***    | `string`    | A directory where the lib is placed.     |     | 
 | **projectNameAndRootFormat \***    | "as-provided" \| "derived"     | Whether to generate the project name and root directory as provided (`as-provided`) or generate them composing their values and taking the configured layout into account (`derived`).     |     | 
 | tags      | `string`    | Add tags to the library (used for linting).     |     | 
 | strict      | `boolean`    | Whether to enable tsconfig strict mode or not.     | `true`     | 
 | **publishable \***    | `boolean`    | Generate a publishable library.     |     | 
 | **importPath \***    | `string`    | The library name used to import it, like @storm-software/my-awesome-lib. Required for publishable library.     |     | 
 | **buildable \***    | `boolean`    | Generate a buildable library.     | `true`     | 
 | setParserOptionsProject      | `boolean`    | Whether or not to configure the ESLint `parserOptions.project` option. We do not do this by default for lint performance reasons.     |     | 
 | rootProject      | `boolean`    | Is the current project the root project in the workspace.     |     | 


**Please note:** _Option names followed by \* above are required, and must be provided to run the executor._ 



## design-tokens

Generate design tokens code using a Token Studio export



## Storm Release Version Generator

The release version generator used in Storm Workspaces

### Options

The following executor options are available:

| Option    | Type   | Description   | Default   | 
| --------- | ------ | ------------- | --------- | 
| **projects \***    | `object[]`   | The ProjectGraphProjectNodes being versioned in the current execution.     |     | 
 | **projectGraph \***    | `object`    | ProjectGraph instance     |     | 
 | specifier      | `string`    | Exact version or semver keyword to apply to the selected release group. Overrides specifierSource.     |     | 
 | **releaseGroup \***    | `object`    | The resolved release group configuration, including name, relevant to all projects in the current execution.     |     | 
 | specifierSource      | "prompt" \| "conventional-commits"     | Which approach to use to determine the semver specifier used to bump the version of the project.     | "conventional-commits"     | 
 | preid      | `string`    | The optional prerelease identifier to apply to the version, in the case that specifier has been set to prerelease.     |     | 
 | packageRoot      | `string`    | The root directory of the directory (containing a manifest file at its root) to publish. Defaults to the project root     |     | 
 | currentVersionResolver      | "registry" \| "disk" \| "git-tag"     | Which approach to use to determine the current version of the project.     | "disk"     | 
 | currentVersionResolverMetadata      | `object`    | Additional metadata to pass to the current version resolver.     | `[object Object]`     | 


**Please note:** _Option names followed by \* above are required, and must be provided to run the executor._ 



<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- END generators -->

## Building

Run `nx build workspace-tools` to build the library.

## Running unit tests

Run `nx test workspace-tools` to execute the unit tests via
[Jest](https://jestjs.io).

<!-- START footer -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->


## Storm Workspaces

Storm workspaces are built using
<a href="https://nx.dev/" target="_blank">Nx</a>, a set of extensible dev tools
for monorepos, which helps you develop like Google, Facebook, and Microsoft.
Building on top of Nx, the Open System provides a set of tools and patterns that
help you scale your monorepo to many teams while keeping the codebase
maintainable.

<div align="right">[ <a href="#table-of-contents">Back to top ▲</a> ]</div>
<br />

## Roadmap

See the [open issues](https://github.com/storm-software/storm-ops/issues) for a
list of proposed features (and known issues).

- [Top Feature Requests](https://github.com/storm-software/storm-ops/issues?q=label%3Aenhancement+is%3Aopen+sort%3Areactions-%2B1-desc)
  (Add your votes using the 👍 reaction)
- [Top Bugs](https://github.com/storm-software/storm-ops/issues?q=is%3Aissue+is%3Aopen+label%3Abug+sort%3Areactions-%2B1-desc)
  (Add your votes using the 👍 reaction)
- [Newest Bugs](https://github.com/storm-software/storm-ops/issues?q=is%3Aopen+is%3Aissue+label%3Abug)

<div align="right">[ <a href="#table-of-contents">Back to top ▲</a> ]</div>
<br />

## Support

Reach out to the maintainer at one of the following places:

- [Contact](https://stormsoftware.com/contact)
- [GitHub discussions](https://github.com/storm-software/storm-ops/discussions)
- <support@stormsoftware.com>

<div align="right">[ <a href="#table-of-contents">Back to top ▲</a> ]</div>
<br />

## License

This project is licensed under the **Apache License 2.0**. Feel free to edit and
distribute this template as you like.

See [LICENSE](LICENSE) for more information.

<div align="right">[ <a href="#table-of-contents">Back to top ▲</a> ]</div>
<br />

## Changelog

This project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html). Every release, along
with the migration instructions, is documented in the [CHANGELOG](CHANGELOG.md)
file

<div align="right">[ <a href="#table-of-contents">Back to top ▲</a> ]</div>
<br />

## Contributing

First off, thanks for taking the time to contribute! Contributions are what
makes the open-source community such an amazing place to learn, inspire, and
create. Any contributions you make will benefit everybody else and are **greatly
appreciated**.

Please try to create bug reports that are:

- _Reproducible._ Include steps to reproduce the problem.
- _Specific._ Include as much detail as possible: which version, what
  environment, etc.
- _Unique._ Do not duplicate existing opened issues.
- _Scoped to a Single Bug._ One bug per report.

Please adhere to this project's [code of conduct](.github/CODE_OF_CONDUCT.md).

You can use
[markdownlint-cli](https://github.com/storm-software/storm-ops/markdownlint-cli)
to check for common markdown style inconsistency.

<div align="right">[ <a href="#table-of-contents">Back to top ▲</a> ]</div>
<br />

## Contributors

Thanks goes to these wonderful people
([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->

<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="http://www.sullypat.com/"><img src="https://avatars.githubusercontent.com/u/99053093?v=4?s=100" width="100px;" alt="Patrick Sullivan"/><br /><sub><b>Patrick Sullivan</b></sub></a><br /><a href="#design-sullivanpj" title="Design">🎨</a> <a href="https://github.com/storm-software/storm-ops/commits?author=sullivanpj" title="Code">💻</a> <a href="#tool-sullivanpj" title="Tools">🔧</a> <a href="https://github.com/storm-software/storm-ops/commits?author=sullivanpj" title="Documentation">📖</a> <a href="https://github.com/storm-software/storm-ops/commits?author=sullivanpj" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://tylerbenning.com/"><img src="https://avatars.githubusercontent.com/u/7265547?v=4?s=100" width="100px;" alt="Tyler Benning"/><br /><sub><b>Tyler Benning</b></sub></a><br /><a href="#design-tbenning" title="Design">🎨</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://stormsoftware.com"><img src="https://avatars.githubusercontent.com/u/149802440?v=4?s=100" width="100px;" alt="Stormie"/><br /><sub><b>Stormie</b></sub></a><br /><a href="#maintenance-stormie-bot" title="Maintenance">🚧</a></td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td align="center" size="13px" colspan="7">
        <img src="https://raw.githubusercontent.com/all-contributors/all-contributors-cli/1b8533af435da9854653492b1327a23a4dbd0a10/assets/logo-small.svg" alt="All Contributors">
          <a href="https://all-contributors.js.org/docs/en/bot/usage">Add your contributions</a>
        </img>
      </td>
    </tr>
  </tfoot>
</table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the
[all-contributors](https://github.com/all-contributors/all-contributors)
specification. Contributions of any kind welcome!

<div align="right">[ <a href="#table-of-contents">Back to top ▲</a> ]</div>
<br />

<hr />
<br />

<div align="center">
<img src="https://pub-761b436209f44a4d886487c917806c08.r2.dev/logo-banner.png" width="100%" alt="Storm Software" />
</div>
<br />

<div align="center">
<a href="https://stormsoftware.com" target="_blank">Website</a>  •  <a href="https://stormsoftware.com/contact" target="_blank">Contact</a>  •  <a href="https://linkedin.com/in/patrick-sullivan-865526b0" target="_blank">LinkedIn</a>  •  <a href="https://medium.com/@pat.joseph.sullivan" target="_blank">Medium</a>  •  <a href="https://github.com/storm-software" target="_blank">GitHub</a>  •  <a href="https://keybase.io/sullivanp" target="_blank">OpenPGP Key</a>
</div>

<div align="center">
<b>Fingerprint:</b> 1BD2 7192 7770 2549 F4C9 F238 E6AD C420 DA5C 4C2D
</div>
<br />

Storm Software is an open source software development organization and creator
of Acidic, StormStack and StormCloud.

Our mission is to make software development more accessible. Our ideal future is
one where anyone can create software without years of prior development
experience serving as a barrier to entry. We hope to achieve this via LLMs,
Generative AI, and intuitive, high-level data modeling/programming languages.

Join us on [Discord](https://discord.gg/MQ6YVzakM5) to chat with the team,
receive release notifications, ask questions, and get involved.

If this sounds interesting, and you would like to help us in creating the next
generation of development tools, please reach out on our
[website](https://stormsoftware.com/contact) or join our
[Slack](https://join.slack.com/t/storm-software/shared_invite/zt-2gsmk04hs-i6yhK_r6urq0dkZYAwq2pA)
channel!

<br />

<div align="center"><a href="https://stormsoftware.com" target="_blank"><img src="https://pub-761b436209f44a4d886487c917806c08.r2.dev/icon-fill.png" alt="Storm Software" width="200px"/></a></div>
<br />
<div align="center"><a href="https://stormsoftware.com" target="_blank"><img src="https://pub-761b436209f44a4d886487c917806c08.r2.dev/visit-us-text.svg" alt="Visit us at stormsoftware.com" height="90px"/></a></div>

<br />

<div align="right">[ <a href="#table-of-contents">Back to top ▲</a> ]</div>
<br />
<br />


<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- END footer -->
