import { execSync } from "node:child_process";
import {
  joinPathFragments,
  readJsonFile,
  type ExecutorContext
} from "@nx/devkit";
import type { NpmPublishExecutorSchema } from "./schema.d";

const LARGE_BUFFER = 1024 * 1000000;

export default async function npmPublishExecutorFn(
  options: NpmPublishExecutorSchema,
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

  const projectConfig =
    context.projectsConfigurations?.projects?.[context.projectName];
  if (!projectConfig) {
    throw new Error(
      `Could not find project configuration for ${context.projectName}`
    );
  }

  const packageRoot = joinPathFragments(
    context.root,
    options.packageRoot ?? joinPathFragments("dist", projectConfig.root)
  );

  const packageJsonPath = joinPathFragments(packageRoot, "package.json");
  const projectPackageJson = readJsonFile(packageJsonPath);
  const packageName = projectPackageJson.name;

  console.info(
    `🚀  Running Storm NPM Publish executor on the ${packageName} package`
  );

  // If package and project name match, we can make log messages terser
  const packageTxt =
    packageName === context.projectName
      ? `package "${packageName}"`
      : `package "${packageName}" from project "${context.projectName}"`;

  if (projectPackageJson.private === true) {
    console.warn(
      `Skipped ${packageTxt}, because it has \`"private": true\` in ${packageJsonPath}`
    );
    return new Promise(resolve => resolve({ success: true }));
  }

  const npmPublishCommandSegments = ["npm publish --json"];
  const npmViewCommandSegments = [
    `npm view ${context.projectName} versions dist-tags --json`
  ];

  const registry = options.registry
    ? options.registry
    : execSync("npm config get registry").toString().trim();

  if (registry) {
    npmPublishCommandSegments.push(`--registry=${registry}`);
    npmViewCommandSegments.push(`--registry=${registry}`);
  }

  if (options.tag) {
    npmPublishCommandSegments.push(`--tag=${options.tag}`);
  }

  if (options.otp) {
    npmPublishCommandSegments.push(`--otp=${options.otp}`);
  }

  if (isDryRun) {
    npmPublishCommandSegments.push("--dry-run");
  }

  npmPublishCommandSegments.push("--provenance --access public");

  // Resolve values using the `npm config` command so that things like environment variables and `publishConfig`s are accounted for
  const tag = options.tag ?? execSync("npm config get tag").toString().trim();

  /**
   * In a dry-run scenario, it is most likely that all commands are being run with dry-run, therefore
   * the most up to date/relevant version might not exist on disk for us to read and make the npm view
   * request with.
   *
   * Therefore, so as to not produce misleading output in dry around dist-tags being altered, we do not
   * perform the npm view step, and just show npm publish's dry-run output.
   */
  if (!isDryRun) {
    const currentVersion = projectPackageJson.version;
    try {
      try {
        const result = execSync(npmViewCommandSegments.join(" "), {
          env: {
            ...process.env,
            FORCE_COLOR: "true"
          },
          cwd: packageRoot,
          stdio: ["ignore", "pipe", "pipe"]
        });

        const resultJson = JSON.parse(result.toString());
        const distTags = resultJson["dist-tags"] || {};
        if (distTags[tag] === currentVersion) {
          console.warn(
            `Skipped ${packageTxt} because v${currentVersion} already exists in ${registry} with tag "${tag}"`
          );
          return new Promise(resolve => resolve({ success: true }));
        }
      } catch (err) {
        console.warn(
          `An error occurred while checking for existing dist-tags\n${err}\n\nNote: If this is the first time this package has been published to NPM, this can be ignored.`
        );
      }

      try {
        if (!isDryRun) {
          execSync(
            `npm dist-tag add ${context.projectName}@${currentVersion} ${tag} --registry=${registry}`,
            {
              env: {
                ...process.env,
                FORCE_COLOR: "true"
              },
              cwd: packageRoot,
              stdio: ["ignore", "pipe", "pipe"]
            }
          );

          console.info(
            `Added the dist-tag ${tag} to v${currentVersion} for registries "${registry}".\n`
          );
        } else {
          console.info(
            `Would add the dist-tag ${tag} to v${currentVersion} for registries "${registry}", but [dry-run] was set.\n`
          );
        }
        return new Promise(resolve => resolve({ success: true }));
      } catch (err) {
        try {
          const stdoutData = JSON.parse(err.stdout?.toString() || "{}");

          // If the error is that the package doesn't exist, then we can ignore it because we will be publishing it for the first time in the next step
          if (
            stdoutData?.error &&
            !(
              stdoutData.error?.code?.includes("E404") &&
              stdoutData.error?.summary?.includes("no such package available")
            ) &&
            !(
              err.stderr?.toString().includes("E404") &&
              err.stderr?.toString().includes("no such package available")
            )
          ) {
            console.error(
              "npm dist-tag add error please see below for more information:"
            );
            if (stdoutData.error.summary) {
              console.error(stdoutData.error?.summary);
            }
            if (stdoutData.error.detail) {
              console.error(stdoutData.error?.detail);
            }

            if (context.isVerbose) {
              console.error(
                `npm dist-tag add stdout: ${JSON.stringify(stdoutData, null, 2)}`
              );
            }
            return new Promise(resolve => resolve({ success: false }));
          }
        } catch (err) {
          console.error(
            `Something unexpected went wrong when processing the npm dist-tag add output\n${err}`
          );
          return new Promise(resolve => resolve({ success: false }));
        }
      }
    } catch (err) {
      const stdoutData = JSON.parse(err.stdout?.toString() || "{}");
      // If the error is that the package doesn't exist, then we can ignore it because we will be publishing it for the first time in the next step
      if (
        !(
          stdoutData.error?.code?.includes("E404") &&
          stdoutData.error?.summary?.toLowerCase().includes("not found")
        ) &&
        !(
          err.stderr?.toString().includes("E404") &&
          err.stderr?.toString().toLowerCase().includes("not found")
        )
      ) {
        console.error(
          `Something unexpected went wrong when checking for existing dist-tags.\n${err}`
        );
        return new Promise(resolve => resolve({ success: false }));
      }
    }
  }

  try {
    const output = execSync(npmPublishCommandSegments.join(" "), {
      maxBuffer: LARGE_BUFFER,
      env: {
        ...process.env,
        FORCE_COLOR: "true"
      },
      cwd: packageRoot,
      stdio: ["ignore", "pipe", "pipe"]
    });
    console.info(output.toString());

    if (isDryRun) {
      console.info(
        `Would publish to ${registry} with tag "${tag}", but [dry-run] was set`
      );
    } else {
      console.info(`Published to ${registry} with tag "${tag}"`);
    }

    return new Promise(resolve => resolve({ success: true }));
  } catch (err) {
    try {
      const stdoutData = JSON.parse(err.stdout?.toString() || "{}");

      console.error("npm publish error please see below for more information:");
      if (stdoutData.error.summary) {
        console.error(stdoutData.error.summary);
        console.error(stdoutData.error.summary);
      }

      if (stdoutData.error.detail) {
        console.error(stdoutData.error.detail);
      }

      if (context.isVerbose) {
        console.error(
          `npm publish stdout:\n${JSON.stringify(stdoutData, null, 2)}`
        );
      }
      return new Promise(resolve => resolve({ success: false }));
    } catch (err) {
      console.error(
        `Something unexpected went wrong when processing the npm publish output\n${err}`
      );

      return new Promise(resolve => resolve({ success: false }));
    }
  }
}

// export default withRunExecutor<NpmPublishExecutorSchema>("NPM Publish", npmPublishExecutorFn, {
//   skipReadingConfig: false,
//   hooks: {
//     applyDefaultOptions: (options: NpmPublishExecutorSchema): NpmPublishExecutorSchema => {
//       options.packageRoot ??= "{projectRoot}";
//       options.dryRun ??= false;
//       options.firstRelease ??= false;

//       return options;
//     }
//   }
// });
