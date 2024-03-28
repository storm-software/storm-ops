import { type ExecutorContext, joinPathFragments, output } from "@nx/devkit";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { parseCargoToml } from "../../utils/toml";
import type { CargoPublishExecutorSchema } from "./schema.d";

const LARGE_BUFFER = 1024 * 1000000;

// biome-ignore lint/nursery/useAwait: <explanation>
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

  const cargoPublishCommandSegments = [`cargo publish --allow-dirty -p ${cargoToml.package.name}`];
  if (isDryRun) {
    cargoPublishCommandSegments.push("--dry-run");
  }

  try {
    const command = cargoPublishCommandSegments.join(" ");
    output.logSingleLine(`Running "${command}"...`);

    const result = execSync(command, {
      maxBuffer: LARGE_BUFFER,
      env: {
        ...process.env,
        FORCE_COLOR: "true"
      },
      cwd: packageRoot,
      stdio: ["ignore", "pipe", "pipe"]
    });
    console.log("");
    console.log(result ? result.toString() : "No Result");

    const resultJson = JSON.parse(result.toString());
    if (
      (resultJson?.message &&
        typeof resultJson.message === "string" &&
        resultJson.message.toLowerCase().includes("crate version") &&
        resultJson.message.toLowerCase().includes("is already uploaded")) ||
      (resultJson?.cause?.message &&
        typeof resultJson.cause.message === "string" &&
        resultJson.cause.message.toLowerCase().includes("crate version") &&
        resultJson.cause.message.toLowerCase().includes("is already uploaded"))
    ) {
      console.warn(
        `Skipped package "${cargoToml.package.name}" from project "${cargoToml.package.name}" because v${cargoToml.package.version} already exists in https://crates.io with tag "latest"`
      );

      return {
        success: true
      };
    }

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

const formatLog = (message?: any, name?: string): string =>
  typeof message === "boolean"
    ? String(message)
    : !message
      ? "<None>"
      : typeof message === "string"
        ? `"${message}"`
        : typeof message === "number"
          ? message.toString()
          : typeof message === "object"
            ? (name ? ` --- ${name} ---\n` : "") +
              Object.keys(message)
                .map((key) => ` - ${key}=${formatLog(message[key], key)}`)
                .join("\n")
            : JSON.stringify(message);
