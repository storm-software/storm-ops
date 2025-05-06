import { type ExecutorContext } from "@nx/devkit";
import { joinPaths } from "@storm-software/config-tools/utilities/correct-paths";
import { execSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { pnpmUpdate } from "../../utils/pnpm-deps-update";
import type { NpmPublishExecutorSchema } from "./schema.d";

export const LARGE_BUFFER = 1024 * 1000000;

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
    throw new Error("The `npm-publish` executor requires a `projectName`.");
  }

  const projectConfig =
    context.projectsConfigurations?.projects?.[context.projectName];
  if (!projectConfig) {
    throw new Error(
      `Could not find project configuration for \`${context.projectName}\``
    );
  }

  const packageRoot = joinPaths(
    context.root,
    options.packageRoot || joinPaths("dist", projectConfig.root)
  );

  const packageJsonPath = joinPaths(packageRoot, "package.json");
  const packageJsonFile = await readFile(packageJsonPath, "utf8");
  if (!packageJsonFile) {
    throw new Error(`Could not find \`package.json\` at ${packageJsonPath}`);
  }

  const packageJson = JSON.parse(packageJsonFile);
  const packageName = packageJson.name;

  console.info(
    `🚀  Running Storm NPM Publish executor on the ${packageName} package`
  );

  // If package and project name match, we can make log messages terser
  const packageTxt =
    packageName === context.projectName
      ? `package "${packageName}"`
      : `package "${packageName}" from project "${context.projectName}"`;

  if (packageJson.private === true) {
    console.warn(
      `Skipped ${packageTxt}, because it has \`"private": true\` in ${packageJsonPath}`
    );
    return { success: true };
  }

  await pnpmUpdate(packageRoot, context.root);

  const npmPublishCommandSegments = [`npm publish --json`];
  const npmViewCommandSegments = [
    `npm view ${packageName} versions dist-tags --json`
  ];

  const registry = options.registry
    ? options.registry
    : execSync("npm config get registry", {
        cwd: packageRoot,
        env: {
          ...process.env,
          FORCE_COLOR: "true"
        },
        maxBuffer: LARGE_BUFFER,
        killSignal: "SIGTERM"
      })
        .toString()
        .trim();

  if (registry) {
    npmPublishCommandSegments.push(`--registry="${registry}" `);
    npmViewCommandSegments.push(`--registry="${registry}" `);
  }

  if (options.otp) {
    npmPublishCommandSegments.push(`--otp="${options.otp}" `);
  }

  if (isDryRun) {
    npmPublishCommandSegments.push("--dry-run");
  }

  npmPublishCommandSegments.push("--provenance --access=public ");

  // Resolve values using the `npm config` command so that things like environment variables and `publishConfig`s are accounted for
  const tag =
    options.tag ||
    execSync("npm config get tag", {
      cwd: packageRoot,
      env: {
        ...process.env,
        FORCE_COLOR: "true"
      },
      maxBuffer: LARGE_BUFFER,
      killSignal: "SIGTERM"
    })
      .toString()
      .trim();

  if (tag) {
    npmPublishCommandSegments.push(`--tag="${tag}" `);
  }

  /**
   * In a dry-run scenario, it is most likely that all commands are being run with dry-run, therefore
   * the most up to date/relevant version might not exist on disk for us to read and make the npm view
   * request with.
   *
   * Therefore, so as to not produce misleading output in dry around dist-tags being altered, we do not
   * perform the npm view step, and just show npm publish's dry-run output.
   */
  if (!isDryRun) {
    const currentVersion = packageJson.version;
    try {
      try {
        const result = execSync(npmViewCommandSegments.join(" "), {
          cwd: packageRoot,
          env: {
            ...process.env,
            FORCE_COLOR: "true"
          },
          maxBuffer: LARGE_BUFFER,
          killSignal: "SIGTERM"
        });

        const resultJson = JSON.parse(result.toString());
        const distTags = resultJson["dist-tags"] || {};
        if (distTags[tag] === currentVersion) {
          console.warn(
            `Skipped ${packageTxt} because v${currentVersion} already exists in ${registry} with tag "${tag}"`
          );

          return { success: true };
        }
      } catch (err) {
        console.warn("\n ********************** \n");
        console.warn(
          `An error occurred while checking for existing dist-tags
${JSON.stringify(err)}

Note: If this is the first time this package has been published to NPM, this can be ignored.

`
        );
        console.info("");
      }

      try {
        if (!isDryRun) {
          const command = `npm dist-tag add ${packageName}@${currentVersion} ${tag} --registry="${registry}" `;

          console.info(
            `Adding the dist-tag ${tag} - preparing to run the following:
${command}
`
          );

          const result = execSync(command, {
            cwd: packageRoot,
            env: {
              ...process.env,
              FORCE_COLOR: "true"
            },
            maxBuffer: LARGE_BUFFER,
            killSignal: "SIGTERM"
          });

          console.info(
            `Added the dist-tag ${tag} to v${currentVersion} for registry "${registry}"

Execution response: ${result.toString()}
`
          );
        } else {
          console.info(
            `Would add the dist-tag ${tag} to v${currentVersion} for registry "${registry}", but [dry-run] was set.\n`
          );
        }

        return { success: true };
      } catch (err) {
        try {
          console.warn("\n ********************** \n");

          // Convert buffer to string only if it is not already a string
          let error = err;
          if (Buffer.isBuffer(error)) {
            error = error.toString();
          }

          console.warn(
            `An error occurred while adding dist-tags:
${error}

Note: If this is the first time this package has been published to NPM, this can be ignored.

`
          );
          console.info("");

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

            return { success: false };
          }
        } catch (err) {
          console.error(
            `Something unexpected went wrong when processing the npm dist-tag add output\n${JSON.stringify(err)}`
          );

          return { success: false };
        }
      }
    } catch (err) {
      // Convert buffer to string only if it is not already a string
      let error = err;
      if (Buffer.isBuffer(error)) {
        error = error.toString();
      }

      console.error("\n ********************** \n");
      console.info("");
      console.error(
        "An error occured trying to run the npm dist-tag add command."
      );
      console.error(error);
      console.info("");

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
          `Something unexpected went wrong when checking for existing dist-tags.

Error: ${JSON.stringify(err)}
`
        );

        return { success: false };
      }
    }
  }

  try {
    const cwd = packageRoot;
    const command = npmPublishCommandSegments.join(" ");

    console.info(
      `Running publish command "${command}" in current working directory: "${cwd}" `
    );

    const result = execSync(command, {
      cwd,
      env: {
        ...process.env,
        FORCE_COLOR: "true"
      },
      maxBuffer: LARGE_BUFFER,
      killSignal: "SIGTERM"
    });

    if (isDryRun) {
      console.info(
        `Would publish to ${registry} with tag "${tag}", but [dry-run] was set ${
          result
            ? `

Execution response: ${result.toString()}`
            : ""
        }
`
      );
    } else {
      console.info(`Published to ${registry} with tag "${tag}" ${
        result
          ? `

Execution response: ${result.toString()}`
          : ""
      }
`);
    }

    return { success: true };
  } catch (err) {
    try {
      console.error("\n ********************** \n");
      console.info("");
      console.error("An error occured running npm publish.");
      console.error("Please see below for more information:");
      console.info("");

      const stdoutData = JSON.parse(err.stdout?.toString() || "{}");

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

      console.error("\n ********************** \n");
      return { success: false };
    } catch (err) {
      // Convert buffer to string only if it is not already a string
      let error = err;
      if (Buffer.isBuffer(error)) {
        error = error.toString();
      }

      console.error(
        `Something unexpected went wrong when processing the npm publish output

Error: ${JSON.stringify(error)}
`
      );

      console.error("\n ********************** \n");
      return { success: false };
    }
  }
}
