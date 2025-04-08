import { Entry } from "@storm-software/build-tools";
import { StormWorkspaceConfig } from "@storm-software/config";
import {
  correctPaths,
  findWorkspaceRoot,
  joinPaths,
  writeDebug
} from "@storm-software/config-tools";
import { type Path, glob } from "glob";

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
  config: StormWorkspaceConfig,
  projectRoot: string,
  sourceRoot?: string,
  entry?: Entry,
  emitOnAll = false
): Promise<Array<{ in: string; out: string }>> => {
  const workspaceRoot = config.workspaceRoot || findWorkspaceRoot();

  const entryPoints = [] as Array<{ in: string; out: string }>;
  if (entry) {
    if (typeof entry === "string") {
      entryPoints.push({ in: entry, out: entry });
    } else if (Array.isArray(entry)) {
      entryPoints.push(...entry.map(entry => ({ in: entry, out: entry })));
    } else {
      entryPoints.push(
        ...Object.entries(entry).map(([key, value]) => {
          if (typeof value === "string") {
            return { in: value, out: key };
          } else {
            return { in: key, out: key };
          }
        })
      );
    }
  }

  if (emitOnAll) {
    entryPoints.push({
      in: joinPaths(workspaceRoot, sourceRoot || projectRoot, "**/*.{ts,tsx}"),
      out: joinPaths(workspaceRoot, sourceRoot || projectRoot, "**/*.{ts,tsx}")
    });
  }

  const results = await Promise.all(
    entryPoints.map(async entryPoint => {
      const paths = [] as Array<{ in: string; out: string }>;
      if (entryPoint.in.includes("*")) {
        const files = await glob(entryPoint.in, {
          withFileTypes: true,
          ignore: ["**/node_modules/**"]
        });

        paths.push(
          ...files.reduce(
            (ret, filePath: Path) => {
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

                if (!paths.some(p => p.in === result)) {
                  paths.push({
                    in: result,
                    out: entryPoint.out.replace(entryPoint.in, result)
                  });
                }
              }

              return ret;
            },
            [] as Array<{ in: string; out: string }>
          )
        );
      } else {
        writeDebug(`Trying to add entry point ${entryPoint}"`, config);

        if (!paths.some(p => p.in === entryPoint.in)) {
          paths.push(entryPoint);
        }
      }

      return paths;
    })
  );

  return results.filter(Boolean).reduce(
    (ret, result) => {
      result.forEach(res => {
        if (res && !ret.some(p => p.in === res.in)) {
          ret.push(res);
        }
      });

      return ret;
    },
    [] as Array<{ in: string; out: string }>
  );
};
