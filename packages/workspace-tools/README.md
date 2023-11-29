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

[![Version](https://img.shields.io/badge/version-1.16.0-1fb2a6.svg?style=for-the-badge&color=1fb2a6)](https://prettier.io/)&nbsp;
[![Nx](https://img.shields.io/badge/Nx-17.0.2-lightgrey?style=for-the-badge&logo=nx&logoWidth=20&&color=1fb2a6)](http://nx.dev/)&nbsp;[![NextJs](https://img.shields.io/badge/Next.js-14.0.2-lightgrey?style=for-the-badge&logo=nextdotjs&logoWidth=20&color=1fb2a6)](https://nextjs.org/)&nbsp;[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=for-the-badge&logo=commitlint&color=1fb2a6)](http://commitizen.github.io/cz-cli/)&nbsp;![Semantic-Release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=for-the-badge&color=1fb2a6)&nbsp;[![documented with docusaurus](https://img.shields.io/badge/documented_with-docusaurus-success.svg?style=for-the-badge&logo=readthedocs&color=1fb2a6)](https://docusaurus.io/)&nbsp;![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/storm-software/storm-ops/cr.yml?style=for-the-badge&logo=github-actions&color=1fb2a6)

<h3 align="center" bold="true">⚠️ <b>Attention</b> ⚠️ This repository, and the apps, libraries, and tools contained within, is still in it's initial development phase. As a result, bugs and issues are expected with it's usage. When the main development phase completes, a proper release will be performed, the packages will be availible through NPM (and other distributions), and this message will be removed. However, in the meantime, please feel free to report any issues you may come across.</h3><br />


<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- END header -->

# Storm Workspace Tools

A package containing tools for managing a Storm workspace. It includes various [Nx](https://nx.dev) generators and executors for common development tasks.

<!-- START doctoc -->
<!-- END doctoc -->

This library was generated with [Nx](https://nx.dev).

## Executors

The following executors are available in this package to invoke common tasks for the workspace's projects:

## Tsup Build executor

Run a build on the project using tsup configuration

### Example

This executor can be used by executing the following in a command line utility:

```cmd
nx run my-project:tsup
```

**Please note:** _The tsup executor should be included in the desired projects's `project.json` file._

### Options

The following executor options are available:

| Option | Type | Description | Default || --------- | ------ | ------------- | --------- || entry | `string` | The path to the entry file, relative to project. | "{sourceRoot}/index.ts" |
,| outputPath | `string` | The output path of the generated files. | "dist/{projectRoot}" |
,| tsConfig | `string` | The path to tsconfig file. | "tsconfig.json" |
,| additionalEntryPoints | `string[]` | List of additional entry points. | ``   |
,| external    | `string[]`  | Mark one or more module as external. Can use * wildcards, such as '*.png'.    |    |
,| bundle    | `boolean`   | Whether to bundle the main entry point and additional entry points. Set to false to keep individual output files.    | `true`    |
,| watch    | `boolean`   | Enable re-building when files change.    |    |
,| assets    | `array`   | List of static assets.    |`` |
,| clean | `boolean` | Remove previous output before build. | `true` |
,| includeSrc | `boolean` | Should the source files be added to the distribution folder in an `src` directory. | `true` |
,| debug | `boolean` | Should output be unminified with source mappings. | |
,| platform | "browser" \| "neutral" \| "node" \| "worker" | Platform target for outputs. | "neutral" |
,| banner | `string` | A short heading added to the top of each typescript file added in the output folder's src directory. | "This code was developed by Storm Software (https://stormsoftware.org) and is licensed under the Apache License 2.0." |
,| verbose | `boolean` | Should write extra log outputs with details from the executor. | |
,| define | `object` | Define global constants that can be used in the source code. The value will be converted into a stringified JSON. | |
,| env | `object` | Define environment variables that can be used in the source code. The value will be converted into a stringified JSON. | |
,| apiReport | `boolean` | Should API Extractor generate an API Report file. | `true` |
,| docModel | `boolean` | Should API Extractor generate an Doc Model markdown file. | `true` |
,| tsdocMetadata | `boolean` | Should API Extractor generate an TSDoc Metadata file. | `true` |
,| options | `object` | Additional options to pass to tsup. See https://paka.dev/npm/tsup@7.2.0/api#d35d54aca71eb26e. | |
,| plugins | `object[]` | List of ESBuild plugins to use during processing | ``   |
,| required    |`string` |    |    |
,| definitions    |`string` | | |

## Generators

The following generators are available with this package to assist in workspace management:

## Init Storm Workspace Plugin

Init Storm Workspace Plugin.

### Options

The following executor options are available:

| Option | Type | Description | Default || --------- | ------ | ------------- | --------- || skipFormat | `boolean` | Skip formatting files. | |

## Storm Workspace preset

Storm workspace preset generator

### Examples

This generator can be used by executing the following examples in a command line utility:

#### Generate a storm workspace with the name: example-repo, namespace: storm-software, organization: storm-software, and repositoryUrl: 'https://github.com/storm-software/example-repo'.

```
nx g @storm-software/workspace-tools:preset --name 'example-repo'
```

#### Generate a storm workspace with the name: example-repo, namespace: example, and repositoryUrl: 'https://github.com/storm-software/example-repo'.

```
nx g @storm-software/workspace-tools:preset --name 'example-repo' --namespace 'example'
```

#### Generate a storm workspace with the name: example-repo, namespace: example, organization: example-org, description: 'An example workspace', and repositoryUrl: 'https://github.com/example-org/example-repo'.

```
nx g @storm-software/workspace-tools:preset --name 'example-repo' --namespace 'example' --organization 'example-org' --description 'An example workspace'
```

### Options

The following executor options are available:

| Option | Type | Description | Default || --------- | ------ | ------------- | --------- || name\* | `string` | The name of the workspace root. | |
,| organization\* | `string` | The organization that owns the workspace. | "storm-software" |
,| namespace | `string` | The npm scope used for the workspace. Defaults to the organization name. | |
,| includeApps\* | `boolean` | Should a separate `apps` folder be created for this workspace (if Yes: `apps` and `libs` folders will be added, if No: `packages` folders will be added)? | |
,| description | `string` | The description of the workspace to use in the package.json and README.md files. | |
,| repositoryUrl | `string` | The URL of the workspace in GitHub. Defaults to the https://github.com/<organization>/<name> | |
,| nxCloud | `boolean` | Should distributed caching with Nx Cloud be enabled for the workspace? | |
,| mode\* | "light" \| "dark" | Which client mode should be used for the Nx Task Runner? | "dark" |
,| packageManager | "npm" \| "yarn" \| "pnpm" | What package manager is used for the workspace? | "pnpm" |

**Please note:** _Option names followed by _ above are required, and must be provided to run the executor.\*

## node-library

Generate a new node library project in the Storm workspace

### Options

The following executor options are available:

| Option | Type | Description | Default || --------- | ------ | ------------- | --------- || name\* | `string` | A name for the library. | |
,| description | `string` | The library used by Storm Software for building TypeScript applications. | |
,| directory\* | `string` | A directory where the lib is placed. | |
,| projectNameAndRootFormat\* | "as-provided" \| "derived" | Whether to generate the project name and root directory as provided (`as-provided`) or generate them composing their values and taking the configured layout into account (`derived`). | |
,| tags | `string` | Add tags to the library (used for linting). | |
,| strict | `boolean` | Whether to enable tsconfig strict mode or not. | `true` |
,| publishable\* | `boolean` | Generate a publishable library. | |
,| importPath\* | `string` | The library name used to import it, like @storm-software/my-awesome-lib. Required for publishable library. | |
,| buildable\* | `boolean` | Generate a buildable library. | `true` |
,| setParserOptionsProject | `boolean` | Whether or not to configure the ESLint `parserOptions.project` option. We do not do this by default for lint performance reasons. | |
,| rootProject | `boolean` | Is the current project the root project in the workspace. | |

**Please note:** _Option names followed by _ above are required, and must be provided to run the executor.\*

## Building

Run `nx build workspace-tools` to build the library.

## Running unit tests

Run `nx test workspace-tools` to execute the unit tests via [Jest](https://jestjs.io).

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
