<!-- START header -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->


<div align="center"><img src="https://public.storm-cdn.com/storm-banner.gif" width="100%" alt="Storm Software" /></div>
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

[![Version](https://img.shields.io/badge/version-1.267.2-1fb2a6.svg?style=for-the-badge&color=1fb2a6)](https://prettier.io/)&nbsp;[![Nx](https://img.shields.io/badge/Nx-17.0.2-lightgrey?style=for-the-badge&logo=nx&logoWidth=20&&color=1fb2a6)](http://nx.dev/)&nbsp;[![NextJs](https://img.shields.io/badge/Next.js-14.0.2-lightgrey?style=for-the-badge&logo=nextdotjs&logoWidth=20&color=1fb2a6)](https://nextjs.org/)&nbsp;[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=for-the-badge&logo=commitlint&color=1fb2a6)](http://commitizen.github.io/cz-cli/)&nbsp;![Semantic-Release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=for-the-badge&color=1fb2a6)&nbsp;[![documented with Fumadocs](https://img.shields.io/badge/documented_with-fumadocs-success.svg?style=for-the-badge&logo=readthedocs&color=1fb2a6)](https://fumadocs.vercel.app/)&nbsp;![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/storm-software/storm-ops/cr.yml?style=for-the-badge&logo=github-actions&color=1fb2a6)

<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

> [!IMPORTANT] 
> This repository, and the apps, libraries, and tools contained within, is still in it's initial development phase. As a result, bugs and issues are expected with it's usage. When the main development phase completes, a proper release will be performed, the packages will be available through NPM (and other distributions), and this message will be removed. However, in the meantime, please feel free to report any issues you may come across.

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<div align="center">
<b>Be sure to ⭐ this <a href="https://github.com/storm-software/storm-ops" target="_blank">repository on GitHub</a> so you can keep up to date on any daily progress!</b>
</div>

<br />

<!-- START doctoc -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [Storm Workspace Tools](#storm-workspace-tools)
  - [Installing](#installing)
  - [Executors](#executors)
  - [typia](#typia)
    - [Example](#example)
  - [esbuild](#esbuild)
    - [Example](#example-1)
  - [unbuild](#unbuild)
    - [Example](#example-2)
  - [clean-package](#clean-package)
    - [Example](#example-3)
  - [size-limit](#size-limit)
    - [Example](#example-4)
  - [npm-publish](#npm-publish)
    - [Example](#example-5)
  - [cargo-publish](#cargo-publish)
    - [Example](#example-6)
  - [cargo-build](#cargo-build)
    - [Example](#example-7)
  - [cargo-check](#cargo-check)
    - [Example](#example-8)
  - [cargo-format](#cargo-format)
    - [Example](#example-9)
  - [cargo-clippy](#cargo-clippy)
    - [Example](#example-10)
  - [cargo-doc](#cargo-doc)
    - [Example](#example-11)
  - [Generators](#generators)
  - [init](#init)
  - [preset](#preset)
  - [node-library](#node-library)
  - [config-schema](#config-schema)
  - [neutral-library](#neutral-library)
  - [browser-library](#browser-library)
  - [release-version](#release-version)
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


## typia

Run the \`typia\` generator to create runtime type validators

### Example 

This executor can be used by executing the following in a command line utility: 

```cmd 
nx run my-project:typia
```

**Please note:** _The typia executor should be included in the desired projects's `project.json` file._ 



## esbuild

Run the \`esbuild\` build process on a selected project

### Example 

This executor can be used by executing the following in a command line utility: 

```cmd 
nx run my-project:esbuild
```

**Please note:** _The esbuild executor should be included in the desired projects's `project.json` file._ 



## unbuild

Run the \`unbuild\` build process on a selected project

### Example 

This executor can be used by executing the following in a command line utility: 

```cmd 
nx run my-project:unbuild
```

**Please note:** _The unbuild executor should be included in the desired projects's `project.json` file._ 



## clean-package

Remove configuration files, fields, and scripts for development before publishing package. The executor will remove these unnecessary files and fields to make the distributable package as light as possible (for scenarios like edge computing, limited memory environments, etc.)

### Example 

This executor can be used by executing the following in a command line utility: 

```cmd 
nx run my-project:clean-package
```

**Please note:** _The clean-package executor should be included in the desired projects's `project.json` file._ 



## size-limit

Run a size-limit performance test on the project

### Example 

This executor can be used by executing the following in a command line utility: 

```cmd 
nx run my-project:size-limit
```

**Please note:** _The size-limit executor should be included in the desired projects's `project.json` file._ 



## npm-publish

Publish a package to the NPM registry

### Example 

This executor can be used by executing the following in a command line utility: 

```cmd 
nx run my-project:npm-publish
```

**Please note:** _The npm-publish executor should be included in the desired projects's `project.json` file._ 



## cargo-publish

Publish a Rust crate to the crates.io registry

### Example 

This executor can be used by executing the following in a command line utility: 

```cmd 
nx run my-project:cargo-publish
```

**Please note:** _The cargo-publish executor should be included in the desired projects's `project.json` file._ 



## cargo-build

Build a Rust project with Cargo Build

### Example 

This executor can be used by executing the following in a command line utility: 

```cmd 
nx run my-project:cargo-build
```

**Please note:** _The cargo-build executor should be included in the desired projects's `project.json` file._ 



## cargo-check

Check a Rust project with Cargo Check

### Example 

This executor can be used by executing the following in a command line utility: 

```cmd 
nx run my-project:cargo-check
```

**Please note:** _The cargo-check executor should be included in the desired projects's `project.json` file._ 



## cargo-format

Format a Rust project with Cargo Fmt

### Example 

This executor can be used by executing the following in a command line utility: 

```cmd 
nx run my-project:cargo-format
```

**Please note:** _The cargo-format executor should be included in the desired projects's `project.json` file._ 



## cargo-clippy

Lint a Rust project with Cargo Clippy

### Example 

This executor can be used by executing the following in a command line utility: 

```cmd 
nx run my-project:cargo-clippy
```

**Please note:** _The cargo-clippy executor should be included in the desired projects's `project.json` file._ 



## cargo-doc

Create docs for a Rust project with Cargo Doc

### Example 

This executor can be used by executing the following in a command line utility: 

```cmd 
nx run my-project:cargo-doc
```

**Please note:** _The cargo-doc executor should be included in the desired projects's `project.json` file._ 



<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- END executors -->

## Generators

The following generators are available with this package to assist in workspace
management:

<!-- START generators -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->


## init

Initialize the `@storm-software/workspace-tools` plugin.



## preset

Storm workspace preset generator



## node-library

Create a new NodeJs TypeScript library package in the Storm workspace



## config-schema

Create a Storm JSON schema based on the workspaces project configurations



## neutral-library

Create a new Neutral TypeScript library package in the Storm workspace



## browser-library

Create a new browser TypeScript library package in the Storm workspace



## release-version

The release version generator used in Storm Workspaces



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
<img src="https://public.storm-cdn.com/brand-banner.png" width="100%" alt="Storm Software" />
</div>
<br />

<div align="center">
<a href="https://stormsoftware.com" target="_blank">Website</a>  •  <a href="https://stormsoftware.com/contact" target="_blank">Contact</a>  •  <a href="https://linkedin.com/in/patrick-sullivan-865526b0" target="_blank">LinkedIn</a>  •  <a href="https://medium.com/@pat.joseph.sullivan" target="_blank">Medium</a>  •  <a href="https://github.com/storm-software" target="_blank">GitHub</a>  •  <a href="https://keybase.io/sullivanp" target="_blank">OpenPGP Key</a>
</div>

<div align="center">
<b>Fingerprint:</b> F47F 1853 BCAD DE9B 42C8  6316 9FDE EC95 47FE D106
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

<div align="center"><a href="https://stormsoftware.com" target="_blank"><img src="https://public.storm-cdn.com/icon-fill.png" alt="Storm Software" width="200px"/></a></div>
<br />
<div align="center"><a href="https://stormsoftware.com" target="_blank"><img src="https://public.storm-cdn.com/visit-us-text.svg" alt="Visit us at stormsoftware.com" height="90px"/></a></div>

<br />

<div align="right">[ <a href="#table-of-contents">Back to top ▲</a> ]</div>
<br />
<br />


<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- END footer -->
