import { type ExecutorContext, joinPathFragments, output } from "@nx/devkit";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { parseCargoToml } from "../../utils/toml";
import type { CratesPublishExecutorSchema } from "./schema";

const LARGE_BUFFER = 1024 * 1000000;

// biome-ignore lint/nursery/useAwait: <explanation>
export default async function runExecutor(
  options: CratesPublishExecutorSchema,
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

    execSync(command, {
      maxBuffer: LARGE_BUFFER,
      env: {
        ...process.env
      },
      cwd: packageRoot,
      stdio: "inherit"
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

    return {
      success: false
    };
  }
}
