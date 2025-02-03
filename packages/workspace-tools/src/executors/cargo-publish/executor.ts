import { type ExecutorContext, joinPathFragments } from "@nx/devkit";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import https from "node:https";
import { parseCargoToml } from "../../utils/toml";
import type { CargoPublishExecutorSchema } from "./schema.d";

const LARGE_BUFFER = 1024 * 1000000;

export default async function runExecutor(
  options: CargoPublishExecutorSchema,
  context: ExecutorContext,
) {
  /**
   * We need to check both the env var and the option because the executor may have been triggered
   * indirectly via dependsOn, in which case the env var will be set, but the option will not.
   */
  const isDryRun = process.env.NX_DRY_RUN === "true" || options.dryRun || false;

  if (!context.projectName) {
    throw new Error("The executor requires a projectName.");
  }

  console.info(
    `🚀  Running Storm Cargo Publish executor on the ${context.projectName} crate`,
  );

  if (
    !context.projectName ||
    !context.projectsConfigurations?.projects ||
    !context.projectsConfigurations.projects[context.projectName] ||
    !context.projectsConfigurations.projects[context.projectName]?.root
  ) {
    throw new Error("The executor requires projectsConfigurations.");
  }

  const registry = options.registry
    ? options.registry
    : process.env.STORM_REGISTRY_CARGO
      ? process.env.STORM_REGISTRY_CARGO
      : "https://crates.io";

  const root =
    context.projectsConfigurations.projects[context.projectName]?.root;
  const packageRoot = joinPathFragments(
    context.root,
    (options.packageRoot ? options.packageRoot : root) as string,
  );

  const cargoToml = parseCargoToml(
    readFileSync(joinPathFragments(packageRoot, "Cargo.toml"), "utf-8"),
  );

  try {
    const result = await getRegistryVersion(
      cargoToml.package.name,
      cargoToml.package.version,
      registry,
    );
    if (result) {
      console.warn(
        `Skipped package "${cargoToml.package.name}" from project "${context.projectName}" because v${cargoToml.package.version} already exists in ${registry} with tag "latest"`,
      );

      return {
        success: true,
      };
    }
  } catch (_: any) {
    // Do nothing
  }

  const cargoPublishCommandSegments = [
    `cargo publish --allow-dirty -p ${cargoToml.package.name}`,
  ];
  if (isDryRun) {
    cargoPublishCommandSegments.push("--dry-run");
  }

  try {
    const cargoPublishCommand = cargoPublishCommandSegments.join(" ");
    console.log("");
    console.log(`Running "${cargoPublishCommand}"...`);
    console.log("");

    execSync(cargoPublishCommand, {
      maxBuffer: LARGE_BUFFER,
      env: {
        ...process.env,
        FORCE_COLOR: "true",
      },
      cwd: packageRoot,
      stdio: ["ignore", "pipe", "pipe"],
    });

    console.log("");

    if (isDryRun) {
      console.log(`Would publish to ${registry}, but [dry-run] was set`);
    } else {
      console.log(`Published to ${registry}`);
    }

    return {
      success: true,
    };
  } catch (error: any) {
    console.error(`Failed to publish to ${registry}`);
    console.error(error);
    console.log("");

    return {
      success: false,
    };
  }
}

export const getRegistryVersion = (
  name: string,
  version: string,
  registry: string,
): Promise<string> => {
  return new Promise((resolve: (value: string) => void) =>
    https
      .get(
        `${registry}/api/v1/crates/${encodeURIComponent(name)}/${encodeURIComponent(
          version,
        )}`,
        (res) => {
          res.on("data", (d) => {
            resolve(d);
          });
        },
      )
      .on("error", (e) => {
        throw e;
      }),
  );
};
