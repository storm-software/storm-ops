# storm-banner/banner

📝 Ensures the file has a organization specific banner at the top of source code files.

💼 This rule is enabled in the 🌟 `recommended` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

This rule enforces that all command handler functions in a project have the correct parameter types as defined by the `shell-shock` package. This helps ensure that command handlers are implemented correctly and can prevent runtime errors due to incorrect parameter types.

👎 Examples of **incorrect** code for this rule:

```ts
import ... from "...";
```

👍 Examples of **correct** code for this rule:

```ts
/* -------------------------------------------------------------------

                  🗲 Storm Software - <NAME>

 This code was released as part of the <NAME> project. <NAME>
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/licenses/projects/<NAME>.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/<NAME>
 Documentation:            https://docs.stormsoftware.com/projects/<NAME>
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

import ... from "...";
```

## Version

This rule was introduced in version 0.1.0 of `@storm-software/eslint-plugin-banner`.

## Options

<!-- begin auto-generated rule options list -->

| Name           | Description                                                                 | Type   | Choices           | Required |
| :------------- | :-------------------------------------------------------------------------- | :----- | :---------------- | :------- |
| `commentStyle` | The comment token to use for the banner. Defaults to block ('/_<banner>_/') | String |                   |          |
| `docs`         | The documentation URL to include in the banner.                             | String |                   |          |
| `homepage`     | The homepage URL to include in the banner.                                  | String |                   |          |
| `license`      | The project license to include in the banner.                               | String |                   |          |
| `licensing`    | The licensing URL to include in the banner.                                 | String |                   |          |
| `lineEndings`  | The type of line endings to use. Defaults to the system default             | String | `unix`, `windows` |          |
| `name`         | The name of the repository to use when reading the banner from a file.      | String |                   | Yes      |
| `newlines`     | The number of newlines to use after the banner. Defaults to 1               | Number |                   |          |
| `organization` | The organization to include in the banner.                                  | String |                   |          |
| `repository`   | The repository URL to include in the banner.                                | String |                   |          |

<!-- end auto-generated rule options list -->

## Config

|     | Name          |
| :-- | :------------ |
| 🌟  | `recommended` |
