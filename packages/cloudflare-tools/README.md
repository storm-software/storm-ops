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

[![Version](https://img.shields.io/badge/version-0.25.0-1fb2a6.svg?style=for-the-badge&color=1fb2a6)](https://prettier.io/)&nbsp;[![Nx](https://img.shields.io/badge/Nx-17.0.2-lightgrey?style=for-the-badge&logo=nx&logoWidth=20&&color=1fb2a6)](http://nx.dev/)&nbsp;[![NextJs](https://img.shields.io/badge/Next.js-14.0.2-lightgrey?style=for-the-badge&logo=nextdotjs&logoWidth=20&color=1fb2a6)](https://nextjs.org/)&nbsp;[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=for-the-badge&logo=commitlint&color=1fb2a6)](http://commitizen.github.io/cz-cli/)&nbsp;![Semantic-Release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=for-the-badge&color=1fb2a6)&nbsp;[![documented with Fumadocs](https://img.shields.io/badge/documented_with-fumadocs-success.svg?style=for-the-badge&logo=readthedocs&color=1fb2a6)](https://fumadocs.vercel.app/)&nbsp;![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/storm-software/storm-ops/cr.yml?style=for-the-badge&logo=github-actions&color=1fb2a6)

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

- [Storm Cloudflare Tools](#storm-cloudflare-tools)
  - [Installing](#installing)
  - [Executors](#executors)
  - [Cloudflare Worker Publish](#cloudflare-worker-publish)
    - [Example](#example)
    - [Options](#options)
  - [Cloudflare Worker - Serve executor](#cloudflare-worker---serve-executor)
    - [Example](#example-1)
    - [Options](#options-1)
  - [Generators](#generators)
  - [Init Cloudflare tools Nx Plugin for Storm Workspace](#init-cloudflare-tools-nx-plugin-for-storm-workspace)
    - [Options](#options-2)
  - [Create a Cloudflare Worker Application](#create-a-cloudflare-worker-application)
    - [Options](#options-3)
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

# Storm Cloudflare Tools

A package containing tools for managing a Storm workspace. It includes various
[Nx](https://nx.dev) generators and executors for common development tasks.

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

The following executors are available in this package to invoke common tasks for
the workspace's projects:

<!-- START executors -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->


## Cloudflare Worker Publish

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




## Cloudflare Worker - Serve executor

Serve a worker locally for development using the Wrangler CLI

### Example 

This executor can be used by executing the following in a command line utility: 

```cmd 
nx run my-project:serve
```

**Please note:** _The serve executor should be included in the desired projects's `project.json` file._ 

### Options

The following executor options are available:

| Option    | Type   | Description   | Default   | 
| --------- | ------ | ------------- | --------- | 
| name      | `string`    | Name of the Worker.     |     | 
 | noBundle      | `boolean`    | Skip Wrangler’s build steps and show a preview of the script without modification. Particularly useful when using custom builds.     |     | 
 | env      | `string`    | Perform on a specific environment.     |     | 
 | compatibilityDate      | `string`    | A date in the form yyyy-mm-dd, which will be used to determine which version of the Workers runtime is used.     |     | 
 | compatibilityFlags      | `string[]`   | Flags to use for compatibility checks.     |     | 
 | latest      | `boolean`    | Use the latest version of the Workers runtime.     | `true`     | 
 | ip      | `string`    | IP address to listen on, defaults to localhost.     |     | 
 | port      | `number`    | Port to listen on.     | `8787`     | 
 | inspectorPort      | `number`    | Port for devtools to connect to.     |     | 
 | routes      | `string[]`   | Routes to upload.     |     | 
 | host      | `string`    | Host to forward requests to, defaults to the zone of the project.     |     | 
 | localProtocol      | "http" \| "https"     | Protocol to listen to requests on.     | "http"     | 
 | localUpstream      | `string`    | Host to act as origin in local mode, defaults to dev.host or route.     |     | 
 | assets      | `string`    | Root folder of static assets to be served. Unlike --site, --assets does not require a Worker script to serve your assets.     |     | 
 | site      | `string`    | Root folder of static assets for Workers Sites.     |     | 
 | siteInclude      | `string[]`   | Array of .gitignore-style patterns that match file or directory names from the sites directory. Only matched items will be uploaded.     |     | 
 | siteExclude      | `string[]`   | Array of .gitignore-style patterns that match file or directory names from the sites directory. Matched items will not be uploaded.     |     | 
 | upstreamProtocol      | "http" \| "https"     | Protocol to forward requests to host on.     | "https"     | 
 | var      | `string[]`   | Array of key:value pairs to inject as variables into your code. The value will always be passed as a string to your Worker.     |     | 
 | define      | `string[]`   | Array of key:value pairs to replace global identifiers in your code.     |     | 
 | tsconfig      | `string`    | Path to a custom tsconfig.json file.     |     | 
 | minify      | `boolean`    | Minify the script.     |     | 
 | nodeCompat      | `boolean`    | Enable node.js compatibility.     |     | 
 | persistTo      | `string`    | Specify directory to use for local persistence.     |     | 
 | remote      | `boolean`    | Develop against remote resources and data stored on Cloudflare’s network.     |     | 
 | testScheduled      | `boolean`    | Exposes a /__scheduled fetch route which will trigger a scheduled event (cron trigger) for testing during development.     |     | 
 | logLevel      | "debug" \| "info" \| "log" \| "warn" \| "error" \| "none"     | Specify Wrangler’s logging level.     | "log"     | 




<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- END executors -->

## Generators

The following generators are available with this package to assist in workspace
management:

<!-- START generators -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->


## Init Cloudflare tools Nx Plugin for Storm Workspace

Init Cloudflare tools Nx Plugin in the Storm Workspace

### Options

The following executor options are available:

| Option    | Type   | Description   | Default   | 
| --------- | ------ | ------------- | --------- | 
| unitTestRunner      | "vitest" \| "jest" \| "none"     | Test runner to use for unit tests.     | "vitest"     | 
 | skipFormat      | `boolean`    | Skip formatting files.     |     | 
 | js      | `boolean`    | Use JavaScript instead of TypeScript     |     | 
 | template      | "fetch-handler" \| "scheduled-handler" \| "hono" \| "none"     | Generate the initial worker using a template.     |     | 


**Please note:** _Option names followed by \* above are required, and must be provided to run the executor._ 



## Create a Cloudflare Worker Application

Create a Cloudflare Worker Application

### Options

The following executor options are available:

| Option    | Type   | Description   | Default   | 
| --------- | ------ | ------------- | --------- | 
| **name \***    | `string`    | The name of the worker     |     | 
 | js      | `boolean`    | Use JavaScript instead of TypeScript     |     | 
 | projectNameAndRootFormat      | "as-provided" \| "derived"     | Whether to generate the project name and root directory as provided (`as-provided`) or generate them composing their values and taking the configured layout into account (`derived`).     |     | 
 | tags      | `string`    | Add tags to the application (used for linting).     |     | 
 | frontendProject      | `string`    | Frontend project that needs to access this application. This sets up proxy configuration.     |     | 
 | unitTestRunner      | "vitest" \| "none"     | Test runner to use for unit tests.     | "vitest"     | 
 | template      | "fetch-handler" \| "scheduled-handler" \| "hono" \| "none"     | Generate the initial worker using a template.     | "fetch-handler"     | 
 | port      | `number`    | The port in which the worker will be run on development mode     | `8787`     | 
 | accountId      | `string`    | The Cloudflare account identifier where the worker will be deployed     |     | 
 | directory      | `string`    | The directory of the new application.     |     | 
 | rootProject      | `boolean`    | Create worker application at the root of the workspace     |     | 
 | skipFormat      | `boolean`    | Skip formatting files.     |     | 


**Please note:** _Option names followed by \* above are required, and must be provided to run the executor._ 



<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- END generators -->

## Building

Run `nx build cloudflare-tools` to build the library.

## Running unit tests

Run `nx test cloudflare-tools` to execute the unit tests via
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
