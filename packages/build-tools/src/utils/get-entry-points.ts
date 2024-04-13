import { joinPathFragments } from "@nx/devkit";
import type { TypeScriptBuildOptions } from "../../declarations";
import type { StormConfig } from "@storm-software/config";
import {
  findWorkspaceRoot,
  removeExtension,
  writeDebug
} from "@storm-software/config-tools";
import { type Path, globSync } from "glob";

export const getEntryPoints = (
  config: StormConfig,
  projectRoot: string,
  sourceRoot: string,
  options: TypeScriptBuildOptions
): string[] => {
  const workspaceRoot = config.workspaceRoot
    ? config.workspaceRoot
    : findWorkspaceRoot();

  let entryPoints: string[] = [];
  if (options.entry) {
    entryPoints.push(options.entry);
  }
  if (options.additionalEntryPoints) {
    entryPoints.push(...options.additionalEntryPoints);
  }

  if (options.emitOnAll === true) {
    entryPoints = globSync(joinPathFragments(sourceRoot, "**/*.{ts,tsx}"), {
      withFileTypes: true
    }).reduce((ret, filePath: Path) => {
      let formattedPath = workspaceRoot.replaceAll("\\", "/");
      if (formattedPath.toUpperCase().startsWith("C:")) {
        // Handle starting pattern for Window's paths
        formattedPath = formattedPath.substring(2);
      }

      let propertyKey = joinPathFragments(
        filePath.path,
        removeExtension(filePath.name)
      )
        .replaceAll("\\", "/")
        .replaceAll(formattedPath, "")
        .replaceAll(sourceRoot, "")
        .replaceAll(projectRoot, "");

      if (propertyKey) {
        while (propertyKey.startsWith("/")) {
          propertyKey = propertyKey.substring(1);
        }

        writeDebug(
          `Trying to add entry point ${propertyKey} at "${joinPathFragments(
            filePath.path,
            filePath.name
          )}"`,
          config
        );

        if (!ret.includes(propertyKey)) {
          ret.push(joinPathFragments(filePath.path, filePath.name));
        }
      }

      return ret;
    }, entryPoints);
  }

  return entryPoints;
};
