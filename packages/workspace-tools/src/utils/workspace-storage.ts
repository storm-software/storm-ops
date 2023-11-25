import fs from "node:fs";
import path from "node:path";
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
    const cacheFile = path.join(this.cacheDir, key);
    if (fs.existsSync(cacheFile)) {
      return fs.readFileSync(cacheFile, "utf-8");
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
    const cacheFile = path.join(this.cacheDir, key);
    fs.writeFileSync(cacheFile, value);
  }

  /**
   * Remove item from cache
   *
   * @param key - The key to remove
   */
  removeItem(key: string) {
    const cacheFile = path.join(this.cacheDir, key);
    fs.rmSync(cacheFile, { force: true, recursive: true });
  }

  /**
   * Clear the cache
   */
  clear() {
    fs.readdirSync(this.cacheDir).forEach(cacheFile => {
      fs.rmSync(cacheFile, { force: true, recursive: true });
    });
  }

  /**
   * Get the key at the index
   *
   * @param index - The index to get
   * @returns The key at the index
   */
  key(index: number) {
    const files = fs.readdirSync(this.cacheDir);
    if (index < files.length && index >= 0) {
      return files[index];
    }

    return undefined;
  }
}
