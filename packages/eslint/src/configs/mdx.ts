import type {
  OptionsComponentExts,
  OptionsFiles,
  OptionsOverrides,
  TypedFlatConfigItem
} from "../types";
import { GLOB_MDX } from "../utils/constants";
import { ensurePackages, interopDefault } from "../utils/helpers";

export async function mdx(
  options: OptionsFiles & OptionsComponentExts & OptionsOverrides = {}
): Promise<TypedFlatConfigItem[]> {
  const { files = [GLOB_MDX], overrides = {} } = options;

  await ensurePackages(["eslint-plugin-mdx"]);

  const mdx = await interopDefault(import("eslint-plugin-mdx"));

  return [
    {
      name: "storm/mdx/setup",
      plugins: {
        mdx
      },
      ...mdx.flat,
      files,
      processor: mdx.createRemarkProcessor({
        lintCodeBlocks: true,
        // optional, if you want to disable language mapper, set it to `false`
        // if you want to override the default language mapper inside, you can provide your own
        languageMapper: {}
      }),
      rules: {
        ...mdx.flat.rules,

        ...overrides
      }
    }
  ];
}
