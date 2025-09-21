import { TSDownOptions } from "./types";

export function getDefaultOptions(
  config: Partial<TSDownOptions> & Pick<TSDownOptions, "projectRoot">
): TSDownOptions {
  return {
    entry: ["./src/*.ts"],
    platform: "node",
    target: "esnext",
    mode: "production",
    dts: true,
    unused: {
      level: "error",
      ignore: ["typescript"]
    },
    publint: true,
    fixedExtension: true,
    ...config
  };
}
