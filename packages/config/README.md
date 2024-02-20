<!-- START header -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->


<div align="center"><img src="https://pub-761b436209f44a4d886487c917806c08.r2.dev/storm-banner.gif" width="100%" altText="Storm Software" /></div>
<br />

<div align="center">
<a href="https://stormsoftware.org" target="_blank">Website</a>  |  <a href="https://stormsoftware.org/contact" target="_blank">Contact</a>  |  <a href="https://github.com/storm-software/stormstack" target="_blank">Repository</a>  |  <a href="https://stormstack.github.io/stormstack/" target="_blank">Documentation</a>  |  <a href="https://github.com/storm-software/stormstack/issues/new?assignees=&labels=bug&template=bug-report.yml&title=Bug Report%3A+">Report a Bug</a> | <a href="https://github.com/storm-software/stormstack/issues/new?assignees=&labels=enhancement&template=feature-request.yml&title=Feature Request%3A+">Request a Feature</a> | <a href="https://github.com/storm-software/stormstack/issues/new?assignees=&labels=documentation&template=documentation.yml&title=Documentation Request%3A+">Request Documentation</a> | <a href="https://github.com/storm-software/stormstack/discussions">Ask a Question</a>
</div>

<br />
This package is part of the <b>⚡Storm-Ops</b> monorepo. The Storm-Ops packages include CLI utility applications, tools, and various libraries used to create modern, scalable web applications.
<br />

<h3 align="center">💻 Visit <a href="https://stormsoftware.org" target="_blank">stormsoftware.org</a> to stay up to date with this developer</h3><br />

[![Version](https://img.shields.io/badge/version-1.3.1-1fb2a6.svg?style=for-the-badge&color=1fb2a6)](https://prettier.io/)&nbsp;
[![Nx](https://img.shields.io/badge/Nx-17.0.2-lightgrey?style=for-the-badge&logo=nx&logoWidth=20&&color=1fb2a6)](http://nx.dev/)&nbsp;[![NextJs](https://img.shields.io/badge/Next.js-14.0.2-lightgrey?style=for-the-badge&logo=nextdotjs&logoWidth=20&color=1fb2a6)](https://nextjs.org/)&nbsp;[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=for-the-badge&logo=commitlint&color=1fb2a6)](http://commitizen.github.io/cz-cli/)&nbsp;![Semantic-Release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=for-the-badge&color=1fb2a6)&nbsp;[![documented with docusaurus](https://img.shields.io/badge/documented_with-docusaurus-success.svg?style=for-the-badge&logo=readthedocs&color=1fb2a6)](https://docusaurus.io/)&nbsp;![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/storm-software/storm-ops/cr.yml?style=for-the-badge&logo=github-actions&color=1fb2a6)

> [!IMPORTANT]
> This repository, and the apps, libraries, and tools contained within, is still in it's initial development phase. As a result, bugs and issues are expected with it's usage. When the main development phase completes, a proper release will be performed, the packages will be availible through NPM (and other distributions), and this message will be removed. However, in the meantime, please feel free to report any issues you may come across.

<br />


<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- END header -->

# Storm Configuration Package

A package containing the definition and Zod validation schema for the custom workspace configuration used by the Storm Software organization.

Below is a list of the available configuration values that can be set through environment variables:

| Name                    | Description                                                                            | Default                     |
| ----------------------- | -------------------------------------------------------------------------------------- | --------------------------- |
| STORM_COLOR_BACKGROUND  | The workspace's background theme color                                                 | `#1d232a`                   |
| STORM_COLOR_ERROR       | The workspace's error theme color                                                      | `#990000`                   |
| STORM_COLOR_FATAL       | The workspace's fatal theme color                                                      | `#7d1a1a`                   |
| STORM_COLOR_INFO        | The workspace's info theme color                                                       | `#0ea5e9`                   |
| STORM_COLOR_PRIMARY     | The workspace's primary theme color                                                    | `#1fb2a6`                   |
| STORM_COLOR_SUCCESS     | The workspace's success theme color                                                    | `#087f5b`                   |
| STORM_COLOR_WARNING     | The workspace's warning theme color                                                    | `#fcc419`                   |
| STORM_ENV               | The current runtime environment of the package                                         | "production"                |
| STORM_HOMEPAGE          | The homepage URL for the workspace                                                     | <https://stormsoftware.org> |
| STORM_LICENSE           | The license used by the workspace                                                      | "Apache License 2.0"        |
| STORM_LOCALE            | The default locale of the workspace                                                    | "en-US"                     |
| STORM_LOG_LEVEL         | The current maximum level of messages to write to the logs                             | "info"                      |
| STORM_ORGANIZATION      | The organization of the workspace                                                      | "storm-software"            |
| STORM_REPOSITORY        | The repo URL of the workspace (i.e. GitHub URL)                                        |
| STORM_RUNTIME_DIRECTORY | The default directory of the storm runtime for storage/generation                      | "node_modules/.storm"       |
| STORM_RUNTIME_VERSION   | The global version of the Storm runtime                                                | "1.0.0"                     |
| STORM_TIMEZONE          | The default timezone of the workspace                                                  | "America/New_York"          |
| STORM_WORKER            | The worker of the package (this is the bot that will be used to perform various tasks) | "stormie-bot"               |

<!-- START doctoc -->
<!-- END doctoc -->

## Installing

Using [pnpm](http://pnpm.io):

```bash
pnpm add -D @storm-software/config
```

<details>
  <summary>Using npm</summary>

```bash
npm install -D @storm-software/config
```

</details>

<details>
  <summary>Using yarn</summary>

```bash
yarn add -D @storm-software/config
```

</details>

## Reduced Package Size

This project uses [tsup](https://tsup.egoist.dev/) to package the source code due to its ability to remove unused code and ship smaller javascript files thanks to code splitting. This helps to greatly reduce the size of the package and to make it easier to use in other projects.

## Development

This project is built using [Nx](https://nx.dev). As a result, many of the usual commands are available to assist in development.

### Building

Run `nx build config` to build the library.

### Running unit tests

Run `nx test config` to execute the unit tests via [Jest](https://jestjs.io).

### Linting

Run `nx lint config` to run [ESLint](https://eslint.org/) on the package.

<!-- START footer -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->


## Storm Workspaces

Storm workspaces are built using <a href="https://nx.dev/" target="_blank">Nx</a>, a set of extensible dev tools for monorepos, which helps you develop like Google, Facebook, and Microsoft. Building on top of Nx, the Open System provides a set of tools and patterns that help you scale your monorepo to many teams while keeping the codebase maintainable.

## Roadmap

See the [open issues](https://github.com/storm-software/stormstack/issues) for a list of proposed features (and known issues).

- [Top Feature Requests](https://github.com/storm-software/stormstack/issues?q=label%3Aenhancement+is%3Aopen+sort%3Areactions-%2B1-desc) (Add your votes using the 👍 reaction)
- [Top Bugs](https://github.com/storm-software/stormstack/issues?q=is%3Aissue+is%3Aopen+label%3Abug+sort%3Areactions-%2B1-desc) (Add your votes using the 👍 reaction)
- [Newest Bugs](https://github.com/storm-software/stormstack/issues?q=is%3Aopen+is%3Aissue+label%3Abug)

## Support

Reach out to the maintainer at one of the following places:

- [Contact](https://stormsoftware.org/contact)
- [GitHub discussions](https://github.com/storm-software/stormstack/discussions)
- <support@stormsoftware.org>

## License

This project is licensed under the **Apache License 2.0**. Feel free to edit and distribute this template as you like.

See [LICENSE](LICENSE) for more information.

## Changelog

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html). Every release, along with the migration instructions, is documented in the [CHANGELOG](CHANGELOG.md) file

## Contributing

First off, thanks for taking the time to contribute! Contributions are what makes the open-source community such an amazing place to learn, inspire, and create. Any contributions you make will benefit everybody else and are **greatly appreciated**.

Please try to create bug reports that are:

- _Reproducible._ Include steps to reproduce the problem.
- _Specific._ Include as much detail as possible: which version, what environment, etc.
- _Unique._ Do not duplicate existing opened issues.
- _Scoped to a Single Bug._ One bug per report.

Please adhere to this project's [code of conduct](.github/CODE_OF_CONDUCT.md).

You can use [markdownlint-cli](https://github.com/storm-software/stormstack/markdownlint-cli) to check for common markdown style inconsistency.

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->

<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="http://www.sullypat.com/"><img src="https://avatars.githubusercontent.com/u/99053093?v=4?s=100" width="100px;" alt="Patrick Sullivan"/><br /><sub><b>Patrick Sullivan</b></sub></a><br /><a href="#design-sullivanpj" title="Design">🎨</a> <a href="https://github.com/storm-software/storm-ops/commits?author=sullivanpj" title="Code">💻</a> <a href="#tool-sullivanpj" title="Tools">🔧</a> <a href="https://github.com/storm-software/storm-ops/commits?author=sullivanpj" title="Documentation">📖</a> <a href="https://github.com/storm-software/storm-ops/commits?author=sullivanpj" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://tylerbenning.com/"><img src="https://avatars.githubusercontent.com/u/7265547?v=4?s=100" width="100px;" alt="Tyler Benning"/><br /><sub><b>Tyler Benning</b></sub></a><br /><a href="#design-tbenning" title="Design">🎨</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://stormsoftware.org"><img src="https://avatars.githubusercontent.com/u/149802440?v=4?s=100" width="100px;" alt="Stormie"/><br /><sub><b>Stormie</b></sub></a><br /><a href="#maintenance-stormie-bot" title="Maintenance">🚧</a></td>
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

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

<br />
<br />
<div align="center">
  <img src="https://pub-e71cff0f90204755bc910518d63cacf8.r2.dev/logo-opengraph.gif" width="100%"/>
</div>
<br />

<div align="center">
<a href="https://www.patsullivan.org" target="_blank">Website</a>  |  <a href="https://www.patsullivan.org/contact" target="_blank">Contact</a>  |  <a href="https://linkedin.com/in/patrick-sullivan-865526b0" target="_blank">LinkedIn</a>  |  <a href="https://medium.com/@pat.joseph.sullivan" target="_blank">Medium</a>  | <a href="https://github.com/sullivanpj" target="_blank">GitHub</a>  |  <a href="https://keybase.io/sullivanp" target="_blank">OpenPGP Key</a>
</div>

<div align="center">
<p><b>Fingerprint:</b> 1BD2 7192 7770 2549 F4C9 F238 E6AD C420 DA5C 4C2D</p>
</div>

<h3 align="center">💻 Visit <a href="https://www.patsullivan.org" target="_blank">patsullivan.org</a> to stay up to date with this developer</h3><br /><br />


<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- END footer -->
