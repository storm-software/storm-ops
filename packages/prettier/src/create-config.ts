import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

type PrettierConfigJson = {
  plugins?: string[];
  [key: string]: unknown;
};

export function createConfig<T extends PrettierConfigJson>(json: T) {
  const { plugins = [], ...rest } = json;

  return {
    ...rest,
    plugins: plugins.map((plugin) => require.resolve(plugin))
  };
}
