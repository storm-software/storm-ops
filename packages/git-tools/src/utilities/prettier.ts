import { Tree } from "@nx/devkit";
import { defu } from "defu";
import { format as prettier, resolveConfig } from "prettier";
import importsPlugin from "prettier-plugin-organize-imports";

/**
 * Formats the given code using Prettier based on the configuration resolved for the specified file path.
 *
 * @param path - The file path for which to resolve Prettier configuration.
 * @param data - The code to format.
 * @returns A promise that resolves to the formatted code as a string.
 * @throws An error if Prettier fails to format the code, including details about the file path and the original error message.
 */
export async function format(path: string, data: string): Promise<string> {
  let code = data;
  try {
    const resolvedConfig = await resolveConfig(path);
    if (resolvedConfig) {
      code = await prettier(
        data,
        defu(
          {
            absolutePath: path,
            ...resolvedConfig
          },
          path.endsWith(".ts") || path.endsWith(".tsx")
            ? { plugins: [importsPlugin] }
            : {}
        )
      );
    }
  } catch (error) {
    throw new Error(
      `Failed to format file at ${path} with Prettier: ${
        (error as Error).message
      }`,
      { cause: error }
    );
  }

  return code;
}

/**
 * Formats the changed files in the given Tree using Prettier, based on the configuration resolved for each file path.
 *
 * @param tree - The Tree containing the changed files to format.
 * @returns A promise that resolves when all changed files have been formatted.
 * @remarks If the environment variable NX_SKIP_FORMAT is set to "true", this function will skip formatting.
 * @throws An error if Prettier fails to format any of the changed files, including details about the file path and the original error message.
 */
export async function formatChangedFiles(tree: Tree): Promise<void> {
  if (process.env.NX_SKIP_FORMAT === "true") {
    return;
  }

  const files = new Set(
    tree.listChanges().filter(file => file.type !== "DELETE")
  );

  const results = await Promise.all(
    Array.from(files)
      .filter(file => file.content && file.path)
      .map(async file => [
        file.path,
        await format(file.path, file.content?.toString("utf-8") ?? "")
      ]) as Promise<[string, string]>[]
  );

  for (const [path, content] of results) {
    tree.write(path, content);
  }
}
