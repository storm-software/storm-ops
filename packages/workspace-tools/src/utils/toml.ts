import TOML from "@ltd/j-toml";
import { type Tree, logger } from "@nx/devkit";

export interface CargoToml {
  // Workspace is only applicable to the root Cargo.toml
  workspace?: { members: string[] };
  package: any;
  dependencies?: Record<
    string,
    string | { version: string; features?: string[]; optional?: boolean }
  >;
  "dev-dependencies"?: Record<string, string | { version: string; features: string[] }>;
  [key: string]: any;
}

export interface CargoMetadata {
  packages: Package[];
  workspace_members: string[];
  resolve: Resolve;
  target_directory: string;
  version: number;
  workspace_root: string;
  metadata: Metadata2;
}

export interface Package {
  name: string;
  version: string;
  id: string;
  license: string;
  license_file: string;
  description: string;
  source: any;
  dependencies: Dependency[];
  targets: Target[];
  features: Features;
  manifest_path: string;
  metadata: Metadata;
  /**
   * From the docs:
   * "List of registries to which this package may be published.
   * Publishing is unrestricted if null, and forbidden if an empty array."
   *
   * Additional observation:
   * false can be used by the end user but it will be converted to an empty
   * array in the cargo metadata output.
   */
  publish: string[] | null;
  authors: string[];
  categories: string[];
  default_run: any;
  rust_version: string;
  keywords: string[];
  readme: string;
  repository: string;
  homepage: string;
  documentation: string;
  edition: string;
  links: any;
}

export interface Dependency {
  name: string;
  source: string;
  req: string;
  kind: any;
  rename: any;
  optional: boolean;
  uses_default_features: boolean;
  features: any[];
  target: string;
  path: string;
  registry: any;
}

export interface Target {
  kind: string[];
  crate_types: string[];
  name: string;
  src_path: string;
  edition: string;
  "required-features": string[];
  doc: boolean;
  doctest: boolean;
  test: boolean;
}

export interface Features {
  default: string[];
  feat1: any[];
  feat2: any[];
}

export interface Metadata {
  docs: Docs;
}

export interface Docs {
  rs: Rs;
}

export interface Rs {
  "all-features": boolean;
}

export interface Resolve {
  nodes: Node[];
  root: string;
}

export interface Node {
  id: string;
  dependencies: string[];
  deps: Dep[];
  features: string[];
}

export interface Dep {
  name: string;
  pkg: string;
  dep_kinds: DepKind[];
}

export interface DepKind {
  kind: any;
  target: string;
}

export interface Metadata2 {
  docs: Docs2;
}

export interface Docs2 {
  rs: Rs2;
}

export interface Rs2 {
  "all-features": boolean;
}

export interface Package {
  name: string;
  version: string;
  id: string;
  license: string;
  license_file: string;
  description: string;
  source: any;
  dependencies: Dependency[];
  targets: Target[];
  features: Features;
  manifest_path: string;
  metadata: Metadata;
  /**
   * From the docs:
   * "List of registries to which this package may be published.
   * Publishing is unrestricted if null, and forbidden if an empty array."
   *
   * Additional observation:
   * false can be used by the end user but it will be converted to an empty
   * array in the cargo metadata output.
   */
  publish: string[] | null;
  authors: string[];
  categories: string[];
  default_run: any;
  rust_version: string;
  keywords: string[];
  readme: string;
  repository: string;
  homepage: string;
  documentation: string;
  edition: string;
  links: any;
}

export function parseCargoTomlWithTree(tree: Tree, projectRoot: string, projectName: string) {
  const cargoTomlString = tree.read(`${projectRoot}/Cargo.toml`)?.toString();
  if (!cargoTomlString) {
    logger.error(`Cannot find a Cargo.toml file in the ${projectName}`);
    throw new Error();
  }

  return parseCargoToml(cargoTomlString);
}

export function parseCargoToml(cargoString?: string) {
  if (!cargoString) {
    throw new Error("Cargo.toml is empty");
  }

  return TOML.parse(cargoString, {
    x: { comment: true }
  }) as unknown as CargoToml;
}

export function stringifyCargoToml(cargoToml: CargoToml) {
  const tomlString = TOML.stringify(cargoToml, {
    newlineAround: "section"
  });

  if (Array.isArray(tomlString)) {
    return tomlString.join("\n");
  }

  return tomlString;
}

export function modifyCargoTable(
  toml: CargoToml,
  section: string,
  key: string,
  value: string | object | any[] | (() => any)
) {
  toml[section] ??= TOML.Section({});
  toml[section][key] =
    typeof value === "object" && !Array.isArray(value)
      ? TOML.inline(value as any)
      : typeof value === "function"
        ? value()
        : value;
}

export function modifyCargoNestedTable(
  toml: CargoToml,
  section: string,
  key: string,
  value: object
) {
  toml[section] ??= {};
  toml[section][key] = TOML.Section(value as any);
}
