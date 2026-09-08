import { getNpmRegistry } from "@storm-software/npm-tools/helpers/get-registry";
import { getVersion } from "@storm-software/npm-tools/helpers/get-version";
import envPaths from "env-paths";
import { createStorage } from "unstorage";
import fsDriver from "unstorage/drivers/fs";

const VERSION_CACHE_TTL = 1000 * 60 * 60 * 24;

interface CachedVersion {
  checkedAt: number;
  version: string;
}

const storage = createStorage({
  driver: fsDriver({ base: envPaths("storm-bun").cache })
});

function getCacheKey(packageName: string, tag: string) {
  return `versions/${encodeURIComponent(tag)}/${encodeURIComponent(packageName)}`;
}

/**
 * Get an npm package version, using the Storm Bun user cache for one day.
 *
 * @param packageName The npm package to query.
 * @param tag The npm dist-tag to query.
 * @returns The cached or freshly fetched package version.
 */
export async function getCachedVersion(packageName: string, tag: string) {
  const cacheKey = getCacheKey(packageName, tag);

  try {
    const cached = await storage.getItem<CachedVersion>(cacheKey);
    if (
      cached &&
      typeof cached.checkedAt === "number" &&
      typeof cached.version === "string" &&
      Date.now() - cached.checkedAt < VERSION_CACHE_TTL
    ) {
      return cached.version;
    }
  } catch {
    // A user cache must never prevent an update from checking the registry.
  }

  const version = await getVersion(packageName, tag, {
    executable: "bun pm",
    registry: await getNpmRegistry()
  });

  try {
    await storage.setItem(cacheKey, { checkedAt: Date.now(), version });
  } catch {
    // A successful registry response is still useful when the cache is unwritable.
  }

  return version;
}
