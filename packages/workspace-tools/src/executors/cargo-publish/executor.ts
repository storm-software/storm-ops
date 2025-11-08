import { type ExecutorContext, joinPathFragments } from "@nx/devkit";
import { parseCargoToml } from "@storm-software/config-tools/utilities/toml";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import https from "node:https";
import type { CargoPublishExecutorSchema } from "./schema.d";

const LARGE_BUFFER = 1024 * 1000000;

export default async function runExecutor(
  options: CargoPublishExecutorSchema,
  context: ExecutorContext
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
    `🚀  Running Storm Cargo Publish executor on the ${context.projectName} crate`
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
    (options.packageRoot ? options.packageRoot : root) as string
  );

  const cargoToml = parseCargoToml(
    readFileSync(joinPathFragments(packageRoot, "Cargo.toml"), "utf-8")
  );

  try {
    const result = await getRegistryVersion(
      cargoToml.package.name,
      cargoToml.package.version,
      registry
    );
    if (result) {
      console.warn(
        `Skipped publishing crate ${cargoToml.package.name} v${cargoToml.package.version} - ${result}`
      );

      return {
        success: true
      };
    }
  } catch {
    // Do nothing
  }

  const cargoPublishCommandSegments = [
    `cargo publish --allow-dirty -p ${cargoToml.package.name}`
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
        FORCE_COLOR: "true"
      },
      cwd: packageRoot,
      stdio: ["ignore", "pipe", "pipe"]
    });

    console.log("");

    if (isDryRun) {
      console.log(`Would publish to ${registry}, but [dry-run] was set`);
    } else {
      console.log(`Published to ${registry}`);
    }

    return {
      success: true
    };
  } catch (error) {
    console.error(`Failed to publish to ${registry}`);
    console.error(error);
    console.log("");

    return {
      success: false
    };
  }
}

export const getRegistryVersion = (
  name: string,
  version: string,
  registry: string
): Promise<string | null> => {
  const url = `${registry}/api/v1/crates/${encodeURIComponent(name)}/${encodeURIComponent(
    version
  )}`;
  console.log(`Checking for existing version at: ${url}`);

  return new Promise((resolve: (value: string | null) => void) =>
    https
      .get(url, res => {
        res.on("data", d => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            const response = JSON.parse(d.toString());

            const updatedAt = response.version?.updated_at;
            const publishedBy = response.version?.published_by?.name;

            resolve(
              `The ${name} v${version} crate was previously published${
                publishedBy ? ` by ${publishedBy}` : ""
              }${
                updatedAt
                  ? ` on ${new Date(updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      weekday: "long"
                    })}`
                  : ""
              }.`
            );
          }

          resolve(null);
        });
      })
      .on("error", () => {
        resolve(null);
      })
  );
};
