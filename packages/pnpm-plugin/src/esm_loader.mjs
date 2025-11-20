import { createRequire } from "node:module";
import { delimiter } from "node:path";
import { pathToFileURL } from "node:url";

const extraNodePaths = (process.env.NODE_PATH || "")
  .split(delimiter)
  .filter(Boolean);

export async function resolve(specifier, context, defaultResolve) {
  try {
    return await defaultResolve(specifier, context, defaultResolve);
  } catch (originalError) {
    if (
      specifier.startsWith(".") ||
      specifier.startsWith("/") ||
      specifier.match(/^node:/)
    ) {
      // Don't handle relative, absolute, or node: specifiers
      throw originalError;
    }

    for (const basePath of extraNodePaths) {
      const require = createRequire(pathToFileURL(basePath).href);
      try {
        const resolved = require.resolve(specifier);
        return { url: pathToFileURL(resolved).href };
      } catch {
        // Skip and try next
      }
    }

    // Re-throw original error if not found
    throw originalError;
  }
}
