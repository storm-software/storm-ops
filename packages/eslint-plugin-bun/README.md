<!-- START header -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->


<div align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://public.storm-cdn.com/storm-software/media/banner-1280x640-dark.gif">
  <source media="(prefers-color-scheme: light)" srcset="https://public.storm-cdn.com/storm-software/media/banner-1280x640-light.gif">
<img src="https://public.storm-cdn.com/storm-software/media/banner-1280x640-dark.gif" width="100%" alt="Storm Software" />
</picture>
</div>
<br />

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- END header -->

# Storm Software - Bun Plugin for ESLint

ESLint plugin that enforces Bun monorepo catalogs. Unlike `@storm-software/eslint-plugin-pnpm` (which writes catalogs to `pnpm-workspace.yaml`), this plugin updates the workspace root `package.json` `catalog` / `catalogs` fields — matching [Bun catalogs](https://bun.com/docs/pm/catalogs).

## Rules

| Rule | Description |
| --- | --- |
| `bun/json-enforce-catalog` | Require `catalog:` for dependency versions; autofix writes the version into root `package.json` |
| `bun/json-valid-catalog` | Ensure `catalog:` references exist in root `package.json` |
| `bun/json-no-unused-catalog-item` | Flag unused catalog entries in root `package.json` |
| `bun/json-no-duplicate-catalog-item` | Flag packages defined in multiple catalogs |

## Installing

```bash
pnpm add -D @storm-software/eslint-plugin-bun
```

## Usage

```js
import bun from "@storm-software/eslint-plugin-bun";

export default [...bun.configs.recommended];
```

## Building

Run `nx build eslint-plugin-bun` to build the library.

<!-- START footer -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

## License

This project is licensed under the **Apache License 2.0**.

See [LICENSE](LICENSE) for more information.

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- END footer -->
