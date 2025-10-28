import type { StormWorkspaceConfig } from "@storm-software/config";
import {
  findWorkspaceRootSafe,
  runAsync,
  writeDebug,
  writeFatal,
  writeInfo,
  writeTrace
} from "@storm-software/config-tools";
import { Command } from "commander";
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
  _config = config;
  writeInfo("⚡  Running the `storm-pnpm` command-line application", config);

  const root = findWorkspaceRootSafe(_config.workspaceRoot || process.cwd());
  process.env.STORM_WORKSPACE_ROOT ??= root;
  process.env.NX_WORKSPACE_ROOT_PATH ??= root;
  if (root) {
    process.chdir(root);
  }

  const program = new Command("storm-pnpm");
  program.version("1.0.0", "-v --version", "display CLI version");

  program
    .command("update")
    .description("Update pnpm catalog dependency package version.")
    .argument(
      "<package-names...>",
      "The package name/pattern to update the version for (e.g., @storm-software/config or @storm-software/ for all Storm packages)."
    )
    .option(
      "-t, --tag <string>",
      `The npm tag to use when fetching the latest version of the package (e.g., "latest", "next", etc.). Defaults to "latest".`,
      "latest"
    )
    .option(
      "-i, --install",
      "Whether to install the package after updating the version."
    )
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
}

async function updateAction(
  packageNames: string | string[],
  {
    tag,
    install = false,
    prefix = "^"
  }: {
    tag: string;
    install: boolean;
    prefix: string;
  }
) {
  try {
    const packages = (
      Array.isArray(packageNames)
        ? packageNames
        : [packageNames.split(",")].flat()
    ).map(p => p.trim().replaceAll("*", ""));

    writeInfo(
      `⚡ Preparing to update the package version for ${packages.join(", ")}.`,
      _config
    );

    let catalog = (await getCatalog()) as Record<string, string>;
    if (!catalog) {
      throw new Error(
        "No catalog found in the pnpm-workspace.yaml file of the current workspace."
      );
    }

    for (const pkg of packages) {
      const matchedPackages = Object.keys(catalog).filter(p =>
        pkg.endsWith("/") ? p.startsWith(pkg) : p === pkg
      );
      if (matchedPackages.length === 0) {
        throw new Error(
          `No packages found in the catalog matching the name/pattern "${pkg}".`
        );
      }

      writeTrace(
        `Found ${matchedPackages.length} matching packages in the catalog file: \n\n- ${matchedPackages
          .map(p => `${p} (${catalog[p] || "unknown"})`)
          .join("\n- ")}`,
        _config
      );

      for (const matchedPackage of matchedPackages) {
        writeTrace(`- Upgrading ${matchedPackage}...`, _config);

        catalog = await upgradeCatalog(catalog, matchedPackage, {
          tag,
          prefix: prefix as UpgradeCatalogPackageOptions["prefix"],
          workspaceRoot: _config.workspaceRoot
        });
      }
    }

    writeDebug(
      "Finalizing changes to the pnpm workspace's catalog dependencies",
      _config
    );

    await setCatalog(catalog, _config.workspaceRoot);

    if (install) {
      writeTrace(
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
