import { flatConfigsToRulesDTS } from "eslint-typegen/core";
import { builtinRules } from "eslint/use-at-your-own-risk";
import fs from "node:fs/promises";
import {
  astro,
  banner,
  cspell,
  formatters,
  graphql,
  imports,
  javascript,
  jsdoc,
  jsonc,
  jsx,
  markdown,
  mdx,
  next,
  node,
  nx,
  perfectionist,
  pnpm,
  prettier,
  react,
  reactNative,
  regexp,
  secrets,
  sortPackageJson,
  storybook,
  stylistic,
  test,
  toml,
  tsdoc,
  typescript,
  unicorn,
  unocss,
  yaml,
  zod
} from "../src/configs";
import { combine } from "../src/utils/combine";

const configs = await combine(
  {
    plugins: {
      "": {
        rules: Object.fromEntries(builtinRules.entries())
      }
    }
  },
  banner(),
  cspell(),
  astro(),
  formatters(),
  imports(),
  graphql({
    relay: true
  }),
  javascript(),
  jsx(),
  jsdoc(),
  jsonc(),
  markdown(),
  mdx(),
  node(),
  nx(),
  next(),
  prettier(),
  perfectionist(),
  pnpm(),
  react(),
  reactNative(),
  sortPackageJson(),
  stylistic(),
  secrets({ json: true }),
  storybook(),
  test(),
  tsdoc(),
  toml(),
  typescript(),
  regexp(),
  unicorn(),
  unocss(),
  yaml(),
  zod()
);

await fs.writeFile(
  "src/typegen.d.ts",
  `${await flatConfigsToRulesDTS(configs, {
    includeAugmentation: false
  })}

// Names of all the configs
export type ConfigNames = ${(
    configs.map(i => i.name).filter(Boolean) as string[]
  )
    .map(i => JSON.stringify(i))
    .join(" | ")}
`
);
