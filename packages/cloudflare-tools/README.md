<!-- START header -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->


<div align="center"><img src="https://pub-761b436209f44a4d886487c917806c08.r2.dev/storm-banner.gif" width="100%" altText="Storm Software" /></div>
<br />

<div align="center">
<a href="https://stormsoftware.com" target="_blank">Website</a>  |  <a href="https://stormsoftware.com/contact" target="_blank">Contact</a>  |  <a href="https://github.com/storm-software/storm-ops" target="_blank">Repository</a>  |  <a href="https://stormstack.github.io/stormstack/" target="_blank">Documentation</a>  |  <a href="https://github.com/storm-software/storm-ops/issues/new?assignees=&labels=bug&template=bug-report.yml&title=Bug Report%3A+">Report a Bug</a> | <a href="https://github.com/storm-software/storm-ops/issues/new?assignees=&labels=enhancement&template=feature-request.yml&title=Feature Request%3A+">Request a Feature</a> | <a href="https://github.com/storm-software/storm-ops/issues/new?assignees=&labels=documentation&template=documentation.yml&title=Documentation Request%3A+">Request Documentation</a> | <a href="https://github.com/storm-software/storm-ops/discussions">Ask a Question</a>
</div>

<br />
This package is part of the <b>⚡Storm-Ops</b> monorepo. The Storm-Ops packages include CLI utility applications, tools, and various libraries used to create modern, scalable web applications.
<br />

<h3 align="center">💻 Visit <a href="https://stormsoftware.com" target="_blank">stormsoftware.com</a> to stay up to date with this developer</h3><br />

[![Version](https://img.shields.io/badge/version-0.1.0-1fb2a6.svg?style=for-the-badge&color=1fb2a6)](https://prettier.io/)&nbsp;
[![Nx](https://img.shields.io/badge/Nx-17.0.2-lightgrey?style=for-the-badge&logo=nx&logoWidth=20&&color=1fb2a6)](http://nx.dev/)&nbsp;[![NextJs](https://img.shields.io/badge/Next.js-14.0.2-lightgrey?style=for-the-badge&logo=nextdotjs&logoWidth=20&color=1fb2a6)](https://nextjs.org/)&nbsp;[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=for-the-badge&logo=commitlint&color=1fb2a6)](http://commitizen.github.io/cz-cli/)&nbsp;![Semantic-Release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=for-the-badge&color=1fb2a6)&nbsp;[![documented with docusaurus](https://img.shields.io/badge/documented_with-docusaurus-success.svg?style=for-the-badge&logo=readthedocs&color=1fb2a6)](https://docusaurus.io/)&nbsp;![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/storm-software/storm-ops/cr.yml?style=for-the-badge&logo=github-actions&color=1fb2a6)

> [!IMPORTANT]
> This repository, and the apps, libraries, and tools contained within, is still in it's initial development phase. As a result, bugs and issues are expected with it's usage. When the main development phase completes, a proper release will be performed, the packages will be availible through NPM (and other distributions), and this message will be removed. However, in the meantime, please feel free to report any issues you may come across.

<br />


<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- END header -->

# Storm Cloudflare Tools

A package containing tools for managing a Storm workspace. It includes various [Nx](https://nx.dev) generators and executors for common development tasks.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

This library was generated with [Nx](https://nx.dev).

## Installing

Using [pnpm](http://pnpm.io):

```bash
pnpm add -D @storm-software/cloudflare-tools
```

<details>
  <summary>Using npm</summary>

```bash
npm install -D @storm-software/cloudflare-tools
```

</details>

<details>
  <summary>Using yarn</summary>

```bash
yarn add -D @storm-software/cloudflare-tools
```

</details>

## Executors

The following executors are available in this package to invoke common tasks for the workspace's projects:

<!-- START executors -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->


## Cloudflare Worker - Publish Executor

Publish a Cloudflare worker using the Wrangler CLI

### Example 

This executor can be used by executing the following in a command line utility: 

```cmd 
nx run my-project:cloudflare-publish
```

**Please note:** _The cloudflare-publish executor should be included in the desired projects's `project.json` file._ 

### Options

The following executor options are available:

| Option    | Type   | Description   | Default   | 
| --------- | ------ | ------------- | --------- | 
| name      | `string`    | Name of the Worker.     |     | 
 | noBundle      | `boolean`    | Skip Wrangler’s build steps and directly deploy script without modification. Particularly useful when using custom builds.     |     | 
 | env      | `string`    | Perform on a specific environment.     |     | 
 | outdir      | `string`    | Path to directory where Wrangler will write the bundled Worker files.     |     | 
 | compatibilityDate      | `string`    | A date in the form yyyy-mm-dd, which will be used to determine which version of the Workers runtime is used.     |     | 
 | compatibilityFlags      | `string[]`   | Flags to use for compatibility checks.     |     | 
 | latest      | `boolean`    | Use the latest version of the Workers runtime.     | `true`     | 
 | assets      | `string`    | Root folder of static assets to be served. Unlike --site, --assets does not require a Worker script to serve your assets.     |     | 
 | site      | `string`    | Root folder of static assets for Workers Sites.     |     | 
 | siteInclude      | `string[]`   | Array of .gitignore-style patterns that match file or directory names from the sites directory. Only matched items will be uploaded.     |     | 
 | siteExclude      | `string[]`   | Array of .gitignore-style patterns that match file or directory names from the sites directory. Matched items will not be uploaded.     |     | 
 | var      | `string[]`   | Array of key:value pairs to inject as variables into your code. The value will always be passed as a string to your Worker.     |     | 
 | define      | `string[]`   | Array of key:value pairs to replace global identifiers in your code.     |     | 
 | triggers      | `string[]`   | Cron schedules to attach to the deployed Worker. Refer to Cron Trigger Examples.     |     | 
 | routes      | `string[]`   | Routes where this Worker will be deployed.     |     | 
 | tsConfig      | `string`    | Path to a custom tsconfig.json file.     |     | 
 | minify      | `boolean`    | Minify the bundled script before deploying.     |     | 
 | nodeCompat      | `boolean`    | Enable node.js compatibility.     |     | 
 | keepVars      | `boolean`    | It is recommended best practice to treat your Wrangler developer environment as a source of truth for your Worker configuration, and avoid making changes via the Cloudflare dashboard. If you change your environment variables or bindings in the Cloudflare dashboard, Wrangler will override them the next time you deploy. If you want to disable this behavior set keepVars to true.     |     | 




<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- END executors -->

## Generators

The following generators are available with this package to assist in workspace management:

<!-- START generators -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->


<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- END generators -->

## Building

Run `nx build cloudflare-tools` to build the library.

## Running unit tests

Run `nx test cloudflare-tools` to execute the unit tests via [Jest](https://jestjs.io).

<!-- START footer -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->


## Storm Workspaces

Storm workspaces are built using <a href="https://nx.dev/" target="_blank">Nx</a>, a set of extensible dev tools for monorepos, which helps you develop like Google, Facebook, and Microsoft. Building on top of Nx, the Open System provides a set of tools and patterns that help you scale your monorepo to many teams while keeping the codebase maintainable.

## Roadmap

See the [open issues](https://github.com/storm-software/storm-ops/issues) for a list of proposed features (and known issues).

- [Top Feature Requests](https://github.com/storm-software/storm-ops/issues?q=label%3Aenhancement+is%3Aopen+sort%3Areactions-%2B1-desc) (Add your votes using the 👍 reaction)
- [Top Bugs](https://github.com/storm-software/storm-ops/issues?q=is%3Aissue+is%3Aopen+label%3Abug+sort%3Areactions-%2B1-desc) (Add your votes using the 👍 reaction)
- [Newest Bugs](https://github.com/storm-software/storm-ops/issues?q=is%3Aopen+is%3Aissue+label%3Abug)

## Support

Reach out to the maintainer at one of the following places:

- [Contact](https://stormsoftware.com/contact)
- [GitHub discussions](https://github.com/storm-software/storm-ops/discussions)
- <support@stormsoftware.com>

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

You can use [markdownlint-cli](https://github.com/storm-software/storm-ops/markdownlint-cli) to check for common markdown style inconsistency.

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

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
