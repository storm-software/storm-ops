import type { StormWorkspaceConfig } from "@storm-software/config";
import {
  brandIcon,
  findWorkspaceRootSafe,
  runAsync,
  writeDebug,
  writeFatal,
  writeInfo,
  writeTrace,
  writeWarning
} from "@storm-software/config-tools";
import { INTERNAL_PACKAGES } from "@storm-software/package-constants/internal-packages";
import { Command } from "commander";
import packageJson from "../../package.json" with { type: "json" };
import {
  getCatalog,
  setCatalog,
  upgradeCatalog,
  UpgradeCatalogPackageOptions
} from "../helpers/catalog";

let _config: Partial<StormWorkspaceConfig> = {};

/**
 * Creates the `storm-pnpm` command-line program.
 *
 * @param config The Storm workspace configuration.
 * @returns The created command-line program.
 */
export function createProgram(config: StormWorkspaceConfig) {
  try {
    _config = config;
    writeInfo(
      `${brandIcon(_config)}  Running the \`storm-pnpm\` command-line application`,
      config
    );

    const root = findWorkspaceRootSafe(_config.workspaceRoot || process.cwd());
    process.env.STORM_WORKSPACE_ROOT ??= root;
    process.env.NX_WORKSPACE_ROOT_PATH ??= root;
    if (root) {
      process.chdir(root);
    }

    const program = new Command("storm-pnpm");
    program.version(packageJson.version, "-v --version", "display CLI version");

    program
      .command("update")
      .description("Update pnpm catalog dependency package version.")
      .argument(
        "<packages...>",
        "The package name/pattern to update the version for (e.g., @storm-software/config or @storm-software/ or @storm-software/*).",
        []
      )
      .option(
        "-t, --tag <string>",
        `The npm tag to use when fetching the latest version of the package (e.g., "latest", "next", etc.). Defaults to "latest".`,
        "latest"
      )
      .option(
        "-i, --install",
        "Whether to install the package after updating the version.",
        false
      )
      .option("--all", "Whether to update all Storm Software packages.", false)
      .option(
        "-p, --prefix <string>",
        `The version prefix to use when updating the package (e.g., "^", "~", or "1.2.3"). Defaults to "^".
- Caret (^): The default prefix. It allows updates to the latest minor or patch version while staying within the same major version. Example: “^1.2.3" allows updates to 1.3.0 or 1.2.4, but not 2.0.0.
- Tilde (~): Allows updates to the latest patch version while staying within the same minor version. Example: “~1.2.3" allows updates to 1.2.4 but not 1.3.0.
- Exact (no prefix): Locks the dependency to a specific version. No updates are allowed. Example: 1.2.3 will only use 1.2.3.
- Greater/Less Than (>, <, >=, <=): Specifies a range of acceptable versions. Example: “>=1.2.3 <2.0.0" allows any version from 1.2.3 to 1.9.x.
- Wildcard (*): Allows the most flexibility by accepting any version. Example: “*2.4.6" allows any version.`,
        "^"
      )
      .action(updateAction);

    return program;
  } catch (error) {
    writeFatal(
      `A fatal error occurred while running the Storm pnpm CLI program: \n\n${error.message}`,
      _config
    );

    throw new Error(error.message, { cause: error });
  }
}

async function updateAction(
  packages: string | string[] = [],
  {
    tag,
    install = false,
    all = false,
    prefix = "^"
  }: {
    tag: string;
    install: boolean;
    all: boolean;
    prefix: string;
  }
) {
  try {
    const pkgs = (
      Array.isArray(packages)
        ? packages
        : typeof packages === "string"
          ? [packages.split(",")].flat()
          : []
    )
      .concat(all ? [...INTERNAL_PACKAGES] : [])
      .filter(Boolean)
      .map(pkg => pkg.trim().replaceAll("*", ""));

    writeInfo(
      `${brandIcon(_config)}  Preparing to update the package version for ${pkgs.join(", ")}.`,
      _config
    );

    let catalog = (await getCatalog()) as Record<string, string>;
    if (!catalog) {
      throw new Error(
        "No catalog found in the pnpm-workspace.yaml file of the current workspace."
      );
    }

    let packagesFound = false;
    let packagesUpdated = false;
    for (const pkg of pkgs) {
      const matchedPackages = Object.keys(catalog).filter(p =>
        pkg.endsWith("/") ? p.startsWith(pkg) : p === pkg
      );
      if (matchedPackages.length === 0) {
        writeInfo(
          `No packages found in the catalog matching the name/pattern "${pkg}".`,
          _config
        );
      } else {
        writeDebug(
          `${brandIcon(_config)}  Found ${matchedPackages.length} packages matching "${pkg}" in the pnpm catalog file: \n\n- ${matchedPackages
            .map(p => `${p} (${catalog[p] || "unknown"})`)
            .join("\n- ")}`,
          _config
        );

        packagesFound = true;

        for (const matchedPackage of matchedPackages) {
          writeTrace(`- Upgrading ${matchedPackage}...`, _config);

          const result = await upgradeCatalog(catalog, matchedPackage, {
            tag,
            prefix: prefix as UpgradeCatalogPackageOptions["prefix"],
            workspaceRoot: _config.workspaceRoot
          });
          if (result.updated) {
            catalog = result.catalog;
            packagesUpdated = true;
          }
        }
      }
    }

    if (!packagesFound) {
      writeWarning(
        `No packages were updated since no matching packages were found in the catalog.`,
        _config
      );
      return;
    }

    writeDebug(
      "Finalizing changes to the pnpm workspace's catalog dependencies",
      _config
    );

    if (!packagesUpdated) {
      writeDebug(
        "No packages were updated since all matching packages are already up to date in the catalog.",
        _config
      );
      return;
    }

    await setCatalog(catalog, _config.workspaceRoot);

    if (install) {
      writeDebug(
        "Running `pnpm install --no-frozen-lockfile` to update local dependency versions",
        _config
      );

      const proc = await runAsync(_config, "pnpm install --no-frozen-lockfile");
      proc.stdout?.on("data", data => {
        console.log(data.toString());
      });
    }
  } catch (error) {
    writeFatal(
      `A fatal error occurred while running Storm pnpm update: \n\n${JSON.stringify(
        error,
        null,
        2
      )}`,
      _config
    );

    throw new Error(error.message, { cause: error });
  }
}
