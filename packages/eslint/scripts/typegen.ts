import { flatConfigsToRulesDTS } from "eslint-typegen/core";
import { builtinRules } from "eslint/use-at-your-own-risk";
import fs from "node:fs/promises";
import {
  astro,
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
  yaml
} from "../src/configs";
import { zod } from "../src/configs/zod";
import { combine } from "../src/utils/combine";

const configs = await combine(
  {
    plugins: {
      "": {
        rules: Object.fromEntries(builtinRules.entries())
      }
    }
  },
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

const configNames = configs.map(i => i.name).filter(Boolean) as string[];

let dts = await flatConfigsToRulesDTS(configs, {
  includeAugmentation: false
});

dts += `
// Names of all the configs
export type ConfigNames = ${configNames.map(i => `'${i}'`).join(" | ")}
`;

await fs.writeFile("src/typegen.d.ts", dts);
