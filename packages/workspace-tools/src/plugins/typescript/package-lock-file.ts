import { readFileSync, writeFileSync } from "node:fs";
import { ensureDirSync } from "fs-extra";
import { dirname, join } from "node:path";
import { performance } from "node:perf_hooks";
import { combineGlobPatterns } from "nx/src/utils/globs";
import type { CreateDependenciesContext, NxPluginV2 } from "nx/src/utils/nx-plugin";
import {
  getLockFileDependencies,
  getLockFileName,
  getLockFileNodes,
  lockFileExists,
  LOCK_FILES
} from "../../utils/lock-file";
import type { RawProjectGraphDependency } from "nx/src/project-graph/project-graph-builder";
import { detectPackageManager } from "nx/src/utils/package-manager";
import { hashArray } from "nx/src/hasher/file-hasher";
import { projectGraphCacheDirectory } from "nx/src/utils/cache-directory";
import type { ProjectGraph } from "nx/src/devkit-exports";
import { buildExplicitDependencies } from "nx/src/plugins/js/project-graph/build-dependencies/build-dependencies";

interface ParsedLockFile {
  externalNodes?: ProjectGraph["externalNodes"];
  dependencies?: RawProjectGraphDependency[];
}

const parsedLockFile: ParsedLockFile = {};

export const packageLockFilePlugin: NxPluginV2 = {
  name: "storm-software/typescript/package-lock-file",
  createNodes: [
    combineGlobPatterns(LOCK_FILES),
    (lockFile, _opts, ctx) => {
      const packageManager = detectPackageManager(ctx.workspaceRoot);
      // Only process the correct lockfile
      if (lockFile !== getLockFileName(packageManager)) {
        return {};
      }

      const lockFilePath = join(ctx.workspaceRoot, lockFile);
      const lockFileContents = readFileSync(lockFilePath).toString();
      const lockFileHash = getLockFileHash(lockFileContents);

      if (!lockFileNeedsReprocessing(lockFileHash)) {
        const nodes = readCachedParsedLockFile().externalNodes;
        parsedLockFile.externalNodes = nodes;
        return {
          externalNodes: nodes
        };
      }

      const externalNodes = getLockFileNodes(packageManager, lockFileContents, lockFileHash, ctx);
      parsedLockFile.externalNodes = externalNodes;

      return {
        externalNodes
      };
    }
  ],
  createDependencies: (_, ctx: CreateDependenciesContext) => {
    const packageManager = detectPackageManager(ctx.workspaceRoot);

    let lockfileDependencies: RawProjectGraphDependency[] = [];
    // lockfile may not exist yet
    if (lockFileExists(packageManager) && parsedLockFile) {
      const lockFilePath = join(ctx.workspaceRoot, getLockFileName(packageManager));
      const lockFileContents = readFileSync(lockFilePath).toString();
      const lockFileHash = getLockFileHash(lockFileContents);

      if (!lockFileNeedsReprocessing(lockFileHash)) {
        lockfileDependencies = readCachedParsedLockFile().dependencies ?? [];
      } else {
        lockfileDependencies = getLockFileDependencies(
          packageManager,
          lockFileContents,
          lockFileHash,
          ctx
        );

        parsedLockFile.dependencies = lockfileDependencies;
        writeLastProcessedLockfileHash(lockFileHash, parsedLockFile);
      }
    }

    performance.mark("build typescript dependencies - start");
    const explicitProjectDependencies = buildExplicitDependencies(
      {
        analyzeSourceFiles: true,
        analyzePackageJson: true
      },
      ctx
    );
    performance.mark("build typescript dependencies - end");
    performance.measure(
      "build typescript dependencies",
      "build typescript dependencies - start",
      "build typescript dependencies - end"
    );
    return lockfileDependencies.concat(explicitProjectDependencies);
  }
};

function getLockFileHash(lockFileContents: string) {
  return hashArray([lockFileContents]);
}

function lockFileNeedsReprocessing(lockHash: string) {
  try {
    return readFileSync(lockFileHashFile).toString() !== lockHash;
  } catch {
    return true;
  }
}

function writeLastProcessedLockfileHash(hash: string, lockFile: ParsedLockFile) {
  ensureDirSync(dirname(lockFileHashFile));
  writeFileSync(cachedParsedLockFile, JSON.stringify(lockFile, null, 2));
  writeFileSync(lockFileHashFile, hash);
}

function readCachedParsedLockFile(): ParsedLockFile {
  return JSON.parse(readFileSync(cachedParsedLockFile).toString());
}

const lockFileHashFile = join(projectGraphCacheDirectory, "lockfile.hash");
const cachedParsedLockFile = join(projectGraphCacheDirectory, "parsed-lock-file.json");
