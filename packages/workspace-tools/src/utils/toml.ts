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
