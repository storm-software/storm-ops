import type { StormWorkspaceConfig } from "@storm-software/config";
import {
  findWorkspaceRootSafe,
  writeFatal,
  writeInfo,
  writeSuccess,
  writeTrace
} from "@storm-software/config-tools";
import { Argument, Command } from "commander";
import { exec } from "node:child_process";
import { getCatalog, upgradeCatalogPackage } from "../helpers/catalog";

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

  const root = findWorkspaceRootSafe(process.cwd());
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
    .addArgument(
      new Argument(
        "<package-name>",
        "The package name/pattern to update the version for (e.g., @storm-software/config or @storm-software/ for all Storm packages)."
      )
    )
    .option(
      "--tag <tag>",
      'The npm tag to use when fetching the latest version of the package (e.g., "latest", "next", etc.). Defaults to "latest".',
      "latest"
    )
    .action(updateAction);

  return program;
}

async function updateAction(
  packageName: string,
  {
    tag
  }: {
    tag: string;
  }
) {
  try {
    writeInfo(
      `⚡ Preparing to update the package version for ${packageName}.`,
      _config
    );

    const catalog = await getCatalog();
    if (!catalog) {
      throw new Error(
        "No catalog found in the pnpm-workspace.yaml file of the current workspace."
      );
    }

    writeTrace(
      `Found catalog file with the following details: \n\n${JSON.stringify(
        catalog
      )}`,
      _config
    );

    const matchedPackages = Object.keys(catalog).filter(pkg =>
      packageName.endsWith("/")
        ? pkg.startsWith(packageName)
        : pkg === packageName
    );
    if (matchedPackages.length === 0) {
      throw new Error(
        `No packages found in the catalog matching the name/pattern "${packageName}".`
      );
    }

    writeTrace(
      `Found ${matchedPackages.length} matching packages in the catalog file: \n\n- ${matchedPackages.join("\n- ")}`,
      _config
    );

    await Promise.all(
      matchedPackages.map(pkg =>
        upgradeCatalogPackage(pkg, { tag, throwIfMissingInCatalog: true })
      )
    );

    writeTrace(
      "Running `pnpm dedupe` to update local dependency versions",
      _config
    );

    await new Promise<string>((resolve, reject) => {
      exec("pnpm dedupe", (error, stdout, stderr) => {
        if (error) {
          return reject(error);
        }
        if (stderr) {
          return reject(stderr);
        }
        return resolve(stdout.trim());
      });
    });

    writeSuccess(
      `🎉 Storm pnpm update processing completed successfully!`,
      _config
    );
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
