import type { StormConfig } from "@storm-software/config";
import {
  correctPaths,
  findWorkspaceRoot,
  joinPaths,
  writeDebug
} from "@storm-software/config-tools";
import { type Path, glob } from "glob";
import { Entry } from "../types";

/**
 * Get the entry points for the build process
 *
 * @remarks
 * This function will also convert a glob pattern (or patterns) into a list of files
 *
 * @param config - The Storm configuration
 * @param projectRoot - The root of the project
 * @param sourceRoot - The root of the source files
 * @param entry - The entry point(s) for the build process
 * @param emitOnAll - Add an entry point for all files in the source root
 * @returns The entry points (relative to the `projectRoot` path) for the build process
 */
export const getEntryPoints = async (
  config: StormConfig,
  projectRoot: string,
  sourceRoot?: string,
  entry?: Entry,
  emitOnAll = false
): Promise<string[]> => {
  const workspaceRoot = config.workspaceRoot
    ? config.workspaceRoot
    : findWorkspaceRoot();

  const entryPoints: string[] = [];
  if (entry) {
    if (Array.isArray(entry)) {
      entryPoints.push(...entry);
    } else if (typeof entry === "string") {
      entryPoints.push(entry);
    } else {
      entryPoints.push(...Object.values(entry));
    }
  }

  if (emitOnAll) {
    entryPoints.push(
      joinPaths(workspaceRoot, sourceRoot || projectRoot, "**/*.{ts,tsx}")
    );
  }

  const results = [] as string[];
  for (const entryPoint in entryPoints) {
    if (entryPoint.includes("*")) {
      const files = await glob(entryPoint, {
        withFileTypes: true
      });

      results.push(
        ...files.reduce((ret, filePath: Path) => {
          const result = correctPaths(
            joinPaths(filePath.path, filePath.name)
              .replaceAll(correctPaths(workspaceRoot), "")
              .replaceAll(correctPaths(projectRoot), "")
          );
          if (result) {
            writeDebug(
              `Trying to add entry point ${result} at "${joinPaths(
                filePath.path,
                filePath.name
              )}"`,
              config
            );

            if (!results.includes(result)) {
              results.push(result);
            }
          }

          return ret;
        }, [] as string[])
      );
    } else {
      results.push(entryPoint);
    }
  }

  return results;
};