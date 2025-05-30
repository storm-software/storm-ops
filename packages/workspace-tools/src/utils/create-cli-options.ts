import { names } from "@nx/devkit";

export function createCliOptions<
  T extends Record<string, string | number | boolean | string[]>,
>(obj: T): string[] {
  const args: string[] = [];

  for (const key in obj) {
    const value = obj[key];
    if (value) {
      const arg = names(key).fileName;
      if (Array.isArray(value)) {
        args.push(
          `--${arg.toLowerCase()}=${value.map((v) => v.trim()).join(",")}`,
        );
      } else {
        args.push(`--${arg.toLowerCase()}=${value}`);
      }
    }
  }

  return args;
}
