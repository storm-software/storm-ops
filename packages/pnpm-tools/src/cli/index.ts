import type { StormWorkspaceConfig } from "@storm-software/config";
import {
  findWorkspaceRootSafe,
  writeFatal,
  writeInfo,
  writeSuccess
} from "@storm-software/config-tools";
import { Argument, Command } from "commander";
import { exec } from "node:child_process";
import { getCatalog, upgradeCatalogPackage } from "../helpers/catalog";

let _config: Partial<StormWorkspaceConfig> = {};

export function createProgram(config: StormWorkspaceConfig) {
  _config = config;
  writeInfo("⚡  Running Storm pnpm command-line application", config);

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
        "<name>",
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

export async function updateAction({
  name,
  tag
}: {
  name: string;
  tag: string;
}) {
  try {
    writeInfo(
      `⚡ Preparing to update the package version for ${name}. Please provide the requested details below...`,
      _config
    );

    const catalog = await getCatalog();
    if (!catalog) {
      throw new Error(
        "No catalog found in the pnpm-workspace.yaml file of the current workspace."
      );
    }

    const matchedPackages = Object.keys(catalog).filter(pkg =>
      name.endsWith("/") ? pkg.startsWith(name) : pkg === name
    );
    if (matchedPackages.length === 0) {
      throw new Error(
        `No packages found in the catalog matching the name/pattern "${name}".`
      );
    }

    await Promise.all(
      matchedPackages.map(pkg =>
        upgradeCatalogPackage(pkg, { tag, throwIfMissingInCatalog: true })
      )
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
      `A fatal error occurred while running Storm pnpm update: \n\n${error.message}`,
      _config
    );
    throw new Error(error.message, { cause: error });
  }
}
