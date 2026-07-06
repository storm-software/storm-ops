import type { PackageJson as NxPackageJson } from "nx/src/utils/package-json";

export interface PackageJson extends NxPackageJson {
  repository?: string | { type?: string; url: string };
  homepage?: string;
}
