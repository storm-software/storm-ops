import {
  existsSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync
} from "node:fs";
import { join } from "node:path";
import { findCacheDirectory } from "./find-cache-dir";

/**
 * A class for storing cached data in the workspace
 */
export class WorkspaceStorage {
  private readonly cacheDir: string;

  constructor({
    cacheName,
    workspaceRoot
  }: {
    cacheName?: string;
    workspaceRoot: string;
  }) {
    this.cacheDir = findCacheDirectory({
      name: "storm",
      cacheName,
      workspaceRoot,
      create: true
    });
  }

  /**
   * Get item from cache
   *
   * @param key - The key to get
   * @returns The value of the key
   */
  getItem(key: string): string | undefined {
    const cacheFile = join(this.cacheDir, key);
    if (existsSync(cacheFile)) {
      return readFileSync(cacheFile, "utf-8");
    }

    return undefined;
  }

  /**
   * Set item to cache
   *
   * @param key - The key to set
   * @param value - The value to set
   */
  setItem(key: string, value: string) {
    writeFileSync(join(this.cacheDir, key), value, { encoding: "utf-8" });
  }

  /**
   * Remove item from cache
   *
   * @param key - The key to remove
   */
  removeItem(key: string) {
    rmSync(join(this.cacheDir, key), { force: true, recursive: true });
  }

  /**
   * Clear the cache
   */
  clear() {
    readdirSync(this.cacheDir).forEach(cacheFile => {
      rmSync(cacheFile, { force: true, recursive: true });
    });
  }

  /**
   * Get the key at the index
   *
   * @param index - The index to get
   * @returns The key at the index
   */
  key(index: number): string | undefined {
    const files = readdirSync(this.cacheDir);
    if (index < files.length && index >= 0) {
      return files[index];
    }

    return undefined;
  }
}
