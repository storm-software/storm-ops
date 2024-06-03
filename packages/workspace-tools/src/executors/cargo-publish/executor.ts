import { type ExecutorContext, joinPathFragments } from "@nx/devkit";
import { exec } from "node:child_process";
import { readFileSync } from "node:fs";
import { parseCargoToml } from "../../utils/toml";
import type { CargoPublishExecutorSchema } from "./schema.d";
import https from "node:https";

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

  const githubRegistry = options.githubRegistry
    ? options.githubRegistry
    : process.env.STORM_REGISTRY_GITHUB;
  const cargoRegistry = options.cargoRegistry
    ? options.cargoRegistry
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
      cargoRegistry
    );
    if (result) {
      console.warn(
        `Skipped package "${cargoToml.package.name}" from project "${context.projectName}" because v${cargoToml.package.version} already exists in ${cargoRegistry} with tag "latest"`
      );

      return {
        success: true
      };
    }
  } catch (_: any) {}

  const cargoPublishCommandSegments = [
    `cargo publish --allow-dirty -p ${cargoToml.package.name}`
  ];
  const githubPublishCommandSegments = [
    `npm dist-tag add ${cargoToml.package.name}@${cargoToml.package.version} "latest" `
  ];
  if (githubRegistry) {
    githubPublishCommandSegments.push(`--registry=${githubRegistry}`);
  }

  if (isDryRun) {
    cargoPublishCommandSegments.push("--dry-run");
  }

  try {
    const cargoPublishCommand = cargoPublishCommandSegments.join(" ");
    const githubPublishCommand = githubPublishCommandSegments.join(" ");
    console.log("");
    console.log(
      `Running "${cargoPublishCommand}" and "${githubPublishCommand}"...`
    );
    console.log("");

    await Promise.all([
      exec(cargoPublishCommand, {
        maxBuffer: LARGE_BUFFER,
        env: {
          ...process.env,
          FORCE_COLOR: "true"
        },
        cwd: packageRoot
      }),
      exec(githubPublishCommand, {
        env: {
          ...process.env,
          FORCE_COLOR: "true"
        },
        cwd: packageRoot
      })
    ]);

    console.log("");

    if (isDryRun) {
      console.log(
        `Would publish to ${cargoRegistry}${githubRegistry ? ` and ${githubRegistry}` : ""}, but [dry-run] was set`
      );
    } else {
      console.log(
        `Published to ${cargoRegistry}${githubRegistry ? ` and ${githubRegistry}` : ""}`
      );
    }

    return {
      success: true
    };
  } catch (error: any) {
    console.error(
      `Failed to publish to ${cargoRegistry}${githubRegistry ? ` and ${githubRegistry}` : ""}`
    );
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
  cargoRegistry: string
): Promise<string> => {
  return new Promise((resolve: (value: string) => void) =>
    https
      .get(
        `${cargoRegistry}/api/v1/crates/${encodeURIComponent(name)}/${encodeURIComponent(
          version
        )}`,
        res => {
          res.on("data", d => {
            resolve(d);
          });
        }
      )
      .on("error", e => {
        throw e;
      })
  );
};
