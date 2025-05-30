import {
  joinPathFragments,
  ProjectConfiguration,
  readJsonFile
} from "@nx/devkit";
import {
  CargoToml,
  parseCargoToml
} from "@storm-software/config-tools/utilities/toml";
import { existsSync } from "node:fs";
import type { PackageJson } from "nx/src/utils/package-json.js";
import { isEqualProjectTag, ProjectTagConstants } from "./project-tags";

export type PackageManagerType = "package.json" | "Cargo.toml";
export const PackageManagerTypes = {
  PackageJson: "package.json" as PackageManagerType,
  CargoToml: "Cargo.toml" as PackageManagerType
};

export type PackageInfo = {
  content: PackageJson | CargoToml;
  type: PackageManagerType;
};

export const getPackageInfo = (
  project: ProjectConfiguration
): null | PackageInfo => {
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
