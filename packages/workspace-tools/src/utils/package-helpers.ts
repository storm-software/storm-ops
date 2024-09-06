import {
  joinPathFragments,
  ProjectConfiguration,
  readJsonFile
} from "@nx/devkit";
import { existsSync } from "node:fs";
import type { PackageJson } from "nx/src/utils/package-json.js";
import { isEqualProjectTag, ProjectTagConstants } from "./project-tags";
import { CargoToml, parseCargoToml } from "./toml";

export type PackageManagerType = "package.json" | "Cargo.toml";
export const PackageManagerTypes = {
  PackageJson: "package.json" as PackageManagerType,
  CargoToml: "Cargo.toml" as PackageManagerType
};

export type PackageManager = {
  content: PackageJson | CargoToml;
  type: "package.json" | "Cargo.toml";
};

export const getPackageManager = (
  project: ProjectConfiguration
): null | PackageManager => {
  if (
    isEqualProjectTag(
      project,
      ProjectTagConstants.Language.TAG_ID,
      ProjectTagConstants.Language.RUST
    ) &&
    existsSync(joinPathFragments(project.root, "Cargo.toml"))
  ) {
    return {
      type: "Cargo.toml",
      content: parseCargoToml(joinPathFragments(project.root, "Cargo.toml"))
    };
  } else if (
    isEqualProjectTag(
      project,
      ProjectTagConstants.Language.TAG_ID,
      ProjectTagConstants.Language.TYPESCRIPT
    ) &&
    existsSync(joinPathFragments(project.root, "package.json"))
  ) {
    return {
      type: "package.json",
      content: readJsonFile(
        joinPathFragments(project.root, "package.json")
      ) as PackageJson
    };
  }

  return null;
};
