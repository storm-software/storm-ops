<div align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://public.storm-cdn.com/storm-software/banner-1280x640-dark-optimized.gif">
  <source media="(prefers-color-scheme: light)" srcset="https://public.storm-cdn.com/storm-software/banner-1280x640-light-optimized.gif">
<img src="https://public.storm-cdn.com/storm-software/banner-1280x640-dark-optimized.gif" width="100%" alt="Storm Software" />
</picture>
</div>
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

Storm Software's <b>⚡Storm-Ops</b> monorepo contains various configurations and
tools used to manage the Storm Software repositories. <br />

Storm-Ops is built using <a href="https://nx.dev/" target="_blank">Nx</a>, a set
of extensible dev tools for monorepos, which helps you develop like Google,
Facebook, and Microsoft. Building on top of Nx, the Open System provides a set
of tools and patterns that help you scale your monorepo to many teams while
keeping the codebase maintainable.

<h3 align="center">💻 Visit <a href="https://stormsoftware.com" target="_blank">stormsoftware.com</a> to stay up to date with this developer</h3>
<br />

[![github](https://img.shields.io/github/package-json/v/storm-software/storm-ops?style=for-the-badge&color=1fb2a6)](https://github.com/storm-software/storm-ops)&nbsp;[![Nx](https://img.shields.io/badge/Nx-17.0.2-lightgrey?style=for-the-badge&logo=nx&logoWidth=20&&color=1fb2a6)](http://nx.dev/)&nbsp;[![NextJs](https://img.shields.io/badge/Next.js-14.0.2-lightgrey?style=for-the-badge&logo=nextdotjs&logoWidth=20&color=1fb2a6)](https://nextjs.org/)&nbsp;[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=for-the-badge&logo=commitlint&color=1fb2a6)](http://commitizen.github.io/cz-cli/)&nbsp;![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=for-the-badge&color=1fb2a6)&nbsp;![documented with docusaurus](https://img.shields.io/badge/documented_with-docusaurus-success.svg?style=for-the-badge&logo=readthedocs&color=1fb2a6)&nbsp;![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/storm-software/storm-ops/cr.yml?style=for-the-badge&logo=github-actions&color=1fb2a6)

<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

> [!IMPORTANT] 
> This repository, and the apps, libraries, and tools contained within, is still in it's initial development phase. As a result, bugs and issues are expected with it's usage. When the main development phase completes, a proper release will be performed, the packages will be available through NPM (and other distributions), and this message will be removed. However, in the meantime, please feel free to report any issues you may come across.

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<br />

![Alt](https://repobeats.axiom.co/api/embed/1737e8026f460248c9ce34e2b1e06d31351942c1.svg "Repobeats analytics image")

<!--#if GitHubActions-->

[![GitHub Actions Build History](https://buildstats.info/github/chart/storm-software/storm-ops?branch=main&includeBuildsFromPullRequest=false)](https://github.com/storm-software/storm-ops/actions)

<!--#endif-->

<!-- START doctoc -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

## Table of Contents

- [Quick Features](#quick-features)
  - [Included Packages](#included-packages)
  - [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Build](#build)
  - [Development Server](#development-server)
- [Environment Configuration Help](#environment-configuration-help)
  - [Plug-Ins](#plug-ins)
  - [Generate an Application](#generate-an-application)
  - [Generate a Library](#generate-a-library)
  - [Code Scaffolding](#code-scaffolding)
- [Testing](#testing)
  - [Running Unit Tests](#running-unit-tests)
  - [Running End-to-End Tests](#running-end-to-end-tests)
  - [Understand your workspace](#understand-your-workspace)
- [☁ Nx Cloud](#-nx-cloud)
  - [Distributed Computation Caching \& Distributed Task Execution](#distributed-computation-caching--distributed-task-execution)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Support](#support)
- [License](#license)
- [Contributors ✨](#contributors-)

<!-- END doctoc -->

<br />

# Quick Features

The following are some of the features/publishable code that are included in
this monorepo:

- Comprehensive build tools for monorepos using Nx
- Automated code formatting with Prettier
- Linting configurations for ESLint and markdownlint
- Continuous integration and deployment workflows
- TypeScript support with custom configurations
- Testing tools integration with Jest, Vitest, and Cypress
- Documentation generation with Docusaurus
- Semantic versioning and release management with semantic-release
- Commit message linting with Commitizen
- Dependency management and auditing with pnpm
- Custom Nx executors and generators for common development tasks
- Support for Rust projects with Cargo integration
- Design tokens generation and management
- Multi-platform build configurations (Node, Browser, Neutral)
- API documentation generation with API Extractor
- Size-limit performance testing
- Clean publish process for npm packages
- GitHub Actions for automated workflows
- Nx Cloud for distributed computation caching and task execution
- Roadmap and issue tracking with GitHub Issues
- Community support and contributions via GitHub Discussions and Discord

<div align="center">
<a href="https://github.com/storm-software/storm-ops">Be sure to ⭐ this repository on GitHub so you can keep up to date on any daily progress!</a>
</div>

<div align="right">[ <a href="#table-of-contents">Back to top ▲</a> ]</div>
<br />

## Included Packages

The following packages are included in this monorepo:

- **@storm-software/build-tools**: Tools and utilities for building and managing
  projects within the monorepo.
- **@storm-software/cloudflare-tools**: Tools for managing and deploying to
  Cloudflare services.
- **@storm-software/config**: Configuration management tools for various
  environments and services.
- **@storm-software/config-tools**: Utilities for handling configuration files
  and settings.
- **@storm-software/esbuild**: Build tools and configurations for esbuild, a
  fast JavaScript bundler and minifier.
- **@storm-software/eslint**: ESLint configurations and rules for linting
  JavaScript and TypeScript code.
- **@storm-software/git-tools**: Tools for managing Git repositories and
  workflows.
- **@storm-software/k8s-tools**: Kubernetes tools for managing and deploying
  applications.
- **@storm-software/linting-tools**: Linting tools and configurations for
  various languages and file types.
- **@storm-software/markdownlint**: Markdown linting configurations and rules.
- **@storm-software/prettier**: Prettier configurations for code formatting.
- **@storm-software/pulumi-tools**: Tools for managing and deploying
  infrastructure with Pulumi.
- **@storm-software/terraform-tools**: Tools for managing and deploying
  infrastructure with Terraform.
- **@storm-software/testing-tools**: Testing utilities and configurations for
  unit and end-to-end tests.
- **@storm-software/unbuild**: Build tools and configurations for Unbuild, a
  zero-config build tool for JavaScript and TypeScript projects (primarily used
  for libraries).
- **@storm-software/untyped**: Helper functions for running Untyped type
  generation on TypeScript projects.
- **@storm-software/workspace-tools**: Tools and utilities for managing the
  monorepo workspace.
- **@storm-software/tsconfig**: Tools and utilities for managing Rust projects.

<div align="right">[ <a href="#table-of-contents">Back to top ▲</a> ]</div>
<br />

## Tech Stack

<div>
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" alt="TypeScript" width="40" height="40"/>&nbsp;<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/codecov/codecov-plain.svg" alt="Codecov" width="40" height="40"/>&nbsp;<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/apachekafka/apachekafka-original.svg" alt="Kafka" width="40" height="40"/>&nbsp;<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/amazonwebservices/amazonwebservices-original.svg" alt="Kafka" width="40" height="40"/>&nbsp;<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-plain.svg" alt="Kafka" width="40" height="40"/>&nbsp;<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/github/github-original.svg" alt="Kafka" width="40" height="40"/>&nbsp;<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/canva/canva-original.svg" alt="Kafka" width="40" height="40"/>&nbsp;<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/electron/electron-original.svg" alt="Kafka" width="40" height="40"/>&nbsp;<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-plain.svg" alt="Kafka" width="40" height="40"/>&nbsp;<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/eslint/eslint-original.svg" alt="Kafka" width="40" height="40"/>&nbsp;<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/figma/figma-original.svg" alt="Kafka" width="40" height="40"/>&nbsp;<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/graphql/graphql-plain.svg" alt="Kafka" width="40" height="40"/>&nbsp;<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/jira/jira-plain.svg" alt="Kafka" width="40" height="40"/>&nbsp;<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/markdown/markdown-original.svg" alt="Kafka" width="40" height="40"/>&nbsp;<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-plain.svg" alt="Kafka" width="40" height="40"/>&nbsp;<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-plain.svg" alt="Kafka" width="40" height="40"/>&nbsp;<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg" alt="Kafka" width="40" height="40"/>&nbsp;<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg" alt="Kafka" width="40" height="40"/>&nbsp;<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original.svg" alt="Kafka" width="40" height="40"/>&nbsp;<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/storybook/storybook-original.svg" alt="Kafka" width="40" height="40"/>&nbsp;<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/redis/redis-plain.svg" alt="Kafka" width="40" height="40"/>&nbsp;<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/prometheus/prometheus-original.svg" alt="Kafka" width="40" height="40"/>&nbsp;<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/sqlite/sqlite-original.svg" alt="Kafka" width="40" height="40"/>&nbsp;<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" alt="Kafka" width="40" height="40"/>&nbsp;<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-plain.svg" alt="Kafka" width="40" height="40"/>&nbsp;<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/threejs/threejs-original.svg" alt="Kafka" width="40" height="40"/>&nbsp;<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/vscode/vscode-original.svg" alt="Kafka" width="40" height="40"/>&nbsp;<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/android/android-original.svg" alt="Kafka" width="40" height="40"/>&nbsp;<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/apple/apple-original.svg" alt="Kafka" width="40" height="40"/>&nbsp;<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/bash/bash-original.svg" alt="Kafka" width="40" height="40"/>&nbsp;<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/blender/blender-original.svg" alt="Kafka" width="40" height="40"/>&nbsp;<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/jamstack/jamstack-original.svg" alt="Kafka" width="40" height="40"/>&nbsp;<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/npm/npm-original-wordmark.svg" alt="Kafka" width="40" height="40"/>&nbsp;
</div>

**Note:** The above list of technologies is far from exhaustive. It is just
meant to serve as a short list of _some_ of the technologies that are used in
this repository.

<div align="right">[ <a href="#table-of-contents">Back to top ▲</a> ]</div>
<br />

# Getting Started

Once the code is pulled locally, open a command prompt and run `pnpm install` in
the root repo directory (/storm-ops).

More information can be found in the
[Open System documentation](https://storm-software.github.io/storm-ops/docs/getting-started/installation).

<div align="right">[ <a href="#table-of-contents">Back to top ▲</a> ]</div>
<br />

## Build

Run `pnpm build` to build the project. The build artifacts will be stored in the
`dist/` directory. Use the `--prod` flag for a production build.

<div align="right">[ <a href="#table-of-contents">Back to top ▲</a> ]</div>
<br />

## Development Server

Run `pnpm serve` for a dev server. Navigate to <http://localhost:4200/>. The app
will automatically reload if you change any of the source files.

<div align="right">[ <a href="#table-of-contents">Back to top ▲</a> ]</div>
<br />

# Environment Configuration Help

If you run into any issues while trying to run any of the above steps, please
reach out to Patrick Sullivan. See the [Support](#support) section for more
information.

<div align="right">[ <a href="#table-of-contents">Back to top ▲</a> ]</div>
<br />

## Plug-Ins

Some of the plug-ins used by this repository are:

- [@nx/next](https://nx.dev/packages/next)
- [@nx/react](https://nx.dev/packages/react)
- [@nx/lint](https://nx.dev/linter/overview)
- [@nx/js](https://nx.dev/js/overview)
- [@nx/node](https://nodejs.org)
- [@nx/web](https://nx.dev/web/overview)
- [@nx/storybook](https://nx.dev/storybook/overview-react)
- [@nx/cypress](https://nx.dev/packages/cypress)
- [@nx/jest](https://nx.dev/packages/jest)
- And more...

<div align="right">[ <a href="#table-of-contents">Back to top ▲</a> ]</div>
<br />

## Generate an Application

Run `nx g @storm-software/workspace:app my-app` to generate an application.

> You can use any of the plugins above to generate applications as well.

When using Nx, you can create multiple applications and libraries in the same
workspace.

<div align="right">[ <a href="#table-of-contents">Back to top ▲</a> ]</div>
<br />

## Generate a Library

Run `nx g @storm-software/workspace:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are shareable across libraries and applications. They can be imported
from `@storm-ops/my-lib`.

<div align="right">[ <a href="#table-of-contents">Back to top ▲</a> ]</div>
<br />

## Code Scaffolding

Run `nx g @nx/react:component my-component --project=storm-ops` to generate a
new component.

<div align="right">[ <a href="#table-of-contents">Back to top ▲</a> ]</div>
<br />

# Testing

Open System uses [Jest](https://jestjs.io/) for unit testing and
[Cypress](https://www.cypress.io/) for end-to-end testing.

<div align="right">[ <a href="#table-of-contents">Back to top ▲</a> ]</div>
<br />

## Running Unit Tests

Run `pnpm test` to execute the unit tests via [Jest](https://jestjs.io).

Run `pnpm affected:test` to execute the unit tests affected by a change.

<div align="right">[ <a href="#table-of-contents">Back to top ▲</a> ]</div>
<br />

## Running End-to-End Tests

Run `pnpm e2e` to execute the end-to-end tests via
[Cypress](https://www.cypress.io).

Run `pnpm affected:e2e` to execute the end-to-end tests affected by a change.

<div align="right">[ <a href="#table-of-contents">Back to top ▲</a> ]</div>
<br />

## Understand your workspace

Run `pnpm graph` to see a diagram of the dependencies of the Open System
projects.

<div align="right">[ <a href="#table-of-contents">Back to top ▲</a> ]</div>
<br />

# ☁ Nx Cloud

Nx caches the output of any previously run command such as testing and building,
so it can replay the cached results instead of rerunning it. Nx Cloud allows you
to share the computation cache across everyone in your team and CI.

<div align="center">
<img src="https://pub-4661138852db4e5da99a6660fbf9b633.r2.dev/Nx Cloud - Dashboard.png" width="100%" alt="Nx Cloud - Dashboard" />
</div>

<div align="right">[ <a href="#table-of-contents">Back to top ▲</a> ]</div>
<br />

## Distributed Computation Caching & Distributed Task Execution

Nx Cloud pairs with Nx in order to enable you to build and test code more
rapidly, by up to 10 times. Even teams that are new to Nx can connect to Nx
Cloud and start saving time instantly.

Teams using Nx gain the advantage of building full-stack applications with their
preferred framework alongside Nx’s advanced code generation and project
dependency graph, plus a unified experience for both frontend and backend
developers.

Visit [Nx Cloud](https://nx.app/) to learn more.

<div align="right">[ <a href="#table-of-contents">Back to top ▲</a> ]</div>
<br />

# Roadmap

See the [open issues](https://github.com/storm-software/storm-ops/issues) for a
list of proposed features (and known issues).

- [Top Feature Requests](https://github.com/storm-software/storm-ops/issues?q=label%3Aenhancement+is%3Aopen+sort%3Areactions-%2B1-desc)
  (Add your votes using the 👍 reaction)
- [Top Bugs](https://github.com/storm-software/storm-ops/issues?q=is%3Aissue+is%3Aopen+label%3Abug+sort%3Areactions-%2B1-desc)
  (Add your votes using the 👍 reaction)
- [Newest Bugs](https://github.com/storm-software/storm-ops/issues?q=is%3Aopen+is%3Aissue+label%3Abug)

<div align="right">[ <a href="#table-of-contents">Back to top ▲</a> ]</div>
<br />

# Contributing

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

# Support

Reach out to the maintainer at one of the following places:

- [Contact](https://stormsoftware.com/contact)
- [GitHub discussions](https://github.com/storm-software/storm-ops/discussions)
- <contact@stormsoftware.com>

<div align="right">[ <a href="#table-of-contents">Back to top ▲</a> ]</div>
<br />

# License

This project is licensed under the **Apache License 2.0**. Feel free to edit and
distribute this template as you like. If you have any specific questions, please
reach out to the Storm Software development team.

See [LICENSE](LICENSE) for more information.

<br />

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fstorm-software%2Fstorm-ops.svg?type=large&issueType=license)](https://app.fossa.io/projects/git%2Bgithub.com%2Fstorm-software%2Fstorm-ops?ref=badge_large&issueType=license)

<div align="right">[ <a href="#table-of-contents">Back to top ▲</a> ]</div>
<br />

# Contributors ✨

Thanks goes to these wonderful people
([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
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
        <img src="https://raw.githubusercontent.com/all-contributors/all-contributors-cli/1b8533af435da9854653492b1327a23a4dbd0a10/assets/logo-small.svg">
          <a href="https://all-contributors.js.org/docs/en/bot/usage">Add your contributions</a>
        </img>
      </td>
    </tr>
  </tfoot>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

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
of Cyclone UI, Storm Stack and Acidic.

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
