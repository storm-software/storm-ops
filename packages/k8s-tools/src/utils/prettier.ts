import { Tree } from "@nx/devkit";
import { PrettierConfig } from "../types";

/**
 * Resolves the existing Prettier configuration.
 *
 * @returns The Prettier configuration or undefined if not found.
 */
export async function resolveUserExistingPrettierConfig(): Promise<
  PrettierConfig | undefined
> {
  let prettier: typeof import("prettier");
  try {
    prettier = require("prettier");
  } catch {
    return undefined;
  }

  if (!prettier) {
    return undefined;
  }
  try {
    const filepath = await prettier.resolveConfigFile();
    if (!filepath) {
      return undefined;
    }

    const config = await prettier.resolveConfig(process.cwd(), {
      useCache: false,
      config: filepath,
    });
    if (!config) {
      return undefined;
    }

    return {
      sourceFilepath: filepath,
      config: config,
    };
  } catch {
    return undefined;
  }
}

export function addToPrettierIgnore(tree: Tree, ignore: string[]) {
  const ignorePath = `${tree.root}/.prettierignore`;

  if (!tree.exists(ignorePath)) {
    tree.write(ignorePath, ignore.join("\n"));
    return;
  }

  try {
    const content = tree.read(ignorePath, "utf8") || "";
    const lines = content.split("\n");
    // Remove duplicates
    const newContent = [...new Set([...lines, ...ignore])].join("\n");
    tree.write(ignorePath, newContent);
  } catch (error: unknown) {
    throw new Error(`Failed to update .prettierignore file: ${String(error)}`);
  }
}
