import { type ExecutorContext, joinPathFragments } from "@nx/devkit";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { parseCargoToml } from "../../utils/toml";
import type { CargoPublishExecutorSchema } from "./schema.d";
import { encode } from "node:querystring";

const LARGE_BUFFER = 1024 * 1000000;

export default async function runExecutor(
  options: CargoPublishExecutorSchema,
  context: ExecutorContext
) {
  const axios = await import("axios");
  const registryApi = axios.default.create({
    baseURL: "https://crates.io/api/v1/crates",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.CARGO_REGISTRY_TOKEN
    },
    timeout: 8000
  });

  /**
   * We need to check both the env var and the option because the executor may have been triggered
   * indirectly via dependsOn, in which case the env var will be set, but the option will not.
   */
  const isDryRun = process.env.NX_DRY_RUN === "true" || options.dryRun || false;

  if (!context.projectName) {
    throw new Error("The executor requires a projectName.");
  }

  if (
    !context.projectName ||
    !context.projectsConfigurations?.projects ||
    !context.projectsConfigurations.projects[context.projectName] ||
    !context.projectsConfigurations.projects[context.projectName]?.root
  ) {
    throw new Error("The executor requires projectsConfigurations.");
  }

  const root = context.projectsConfigurations.projects[context.projectName]?.root;
  const packageRoot = joinPathFragments(
    context.root,
    (options.packageRoot ? options.packageRoot : root) as string
  );

  const cargoToml = parseCargoToml(
    readFileSync(joinPathFragments(packageRoot, "Cargo.toml"), "utf-8")
  );

  try {
    const result = await registryApi.get(
      `/${encode(cargoToml.package.name)}/${encode(cargoToml.package.version)}`
    );
    if (result?.data) {
      console.warn(
        `Skipped package "${cargoToml.package.name}" from project "${context.projectName}" because v${cargoToml.package.version} already exists in https://crates.io with tag "latest"`
      );

      return {
        success: true
      };
    }
  } catch (_: any) {}

  const cargoPublishCommandSegments = [`cargo publish --allow-dirty -p ${cargoToml.package.name}`];
  if (isDryRun) {
    cargoPublishCommandSegments.push("--dry-run");
  }

  try {
    const command = cargoPublishCommandSegments.join(" ");
    console.log("");
    console.log(`Running "${command}"...`);
    console.log("");

    execSync(command, {
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
      console.log("Would publish to https://crates.io, but [dry-run] was set");
    } else {
      console.log("Published to https://crates.io");
    }

    return {
      success: true
    };
  } catch (error: any) {
    console.error("Failed to publish to https://crates.io");
    console.error(error);
    console.log("");

    return {
      success: false
    };
  }
}
