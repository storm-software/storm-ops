import { type ExecutorContext } from "@nx/devkit";
import { getConfig } from "@storm-software/config-tools/get-config";
import { joinPaths } from "@storm-software/config-tools/utilities/correct-paths";
import {
  getNpmRegistry,
  getRegistry
} from "@storm-software/npm-tools/helpers/get-registry";
import { replaceDepsAliases } from "@storm-software/pnpm-tools/helpers/replace-deps-aliases";
import { execSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { format } from "prettier";
import { getGitHubTools } from "../../utils/github";
import { addPackageJsonGitHead } from "../../utils/package-helpers";
import type { NpmPublishExecutorSchema } from "./schema.d";

export const LARGE_BUFFER = 1024 * 1000000;

export default async function npmPublishExecutorFn(
  options: NpmPublishExecutorSchema,
  context: ExecutorContext
) {
  const workspaceConfig = await getConfig(context.root);
  const github = await getGitHubTools(workspaceConfig);

  const isDryRun = process.env.NX_DRY_RUN === "true" || options.dryRun || false;
  if (!context.projectName) {
    github.error("The `npm-publish` executor requires a `projectName`.");

    return { success: false };
  }

  const projectConfig =
    context.projectsConfigurations?.projects?.[context.projectName];
  if (!projectConfig) {
    github.error(
      `Could not find project configuration for \`${context.projectName}\``
    );

    return { success: false };
  }

  const packageRoot = joinPaths(
    context.root,
    options.packageRoot || joinPaths("dist", projectConfig.root)
  );
  const projectRoot = context.projectsConfigurations.projects[
    context.projectName
  ]?.root
    ? joinPaths(
        context.root,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        context.projectsConfigurations.projects[context.projectName]!.root
      )
    : packageRoot;

  const packageJsonPath = joinPaths(packageRoot, "package.json");
  const packageJsonFile = await readFile(packageJsonPath, "utf8");
  if (!packageJsonFile) {
    github.error(`Could not find \`package.json\` at ${packageJsonPath}`);

    return { success: false };
  }

  const packageJson = JSON.parse(packageJsonFile);

  const projectPackageJsonPath = joinPaths(projectRoot, "package.json");
  const projectPackageJsonFile = await readFile(projectPackageJsonPath, "utf8");
  if (!projectPackageJsonFile) {
    github.error(
      `Could not find \`package.json\` at ${projectPackageJsonPath}`
    );

    return { success: false };
  }

  const projectPackageJson = JSON.parse(projectPackageJsonFile);
  if (packageJson.version !== projectPackageJson.version) {
    console.warn(
      `The version in the package.json file at ${packageJsonPath} (current: ${
        packageJson.version
      }) does not match the version in the package.json file at ${
        projectPackageJsonPath
      } (current: ${
        projectPackageJson.version
      }). This file will be updated to match the version in the project package.json file.`
    );

    if (projectPackageJson.version) {
      packageJson.version = projectPackageJson.version;

      await writeFile(
        packageJsonPath,
        await format(JSON.stringify(packageJson), {
          parser: "json",
          proseWrap: "preserve",
          trailingComma: "none",
          tabWidth: 2,
          semi: true,
          singleQuote: false,
          quoteProps: "as-needed",
          insertPragma: false,
          bracketSameLine: true,
          printWidth: 80,
          bracketSpacing: true,
          arrowParens: "avoid",
          endOfLine: "lf",
          plugins: ["prettier-plugin-packagejson"]
        })
      );
    }
  }

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

  await replaceDepsAliases(packageRoot, context.root);
  await addPackageJsonGitHead(packageRoot);

  const npmPublishCommandSegments = [`npm publish --json`];
  const npmViewCommandSegments = [
    `npm view ${packageName} versions dist-tags --json`
  ];

  const registry = await Promise.resolve(
    options.registry ?? ((await getRegistry()) || getNpmRegistry())
  );
  if (registry) {
    npmPublishCommandSegments.push(`--registry="${registry}" `);
    npmViewCommandSegments.push(`--registry="${registry}" `);
  }

  if (options.otp) {
    npmPublishCommandSegments.push(`--otp="${options.otp}" `);
  }

  let token: string | undefined;
  if (!options.otp) {
    token = await github.getIDToken(
      `npm:${registry.replace(/^https?:\/\//, "")}`
    );
    if (!token) {
      github.error(
        `Either a One time password (OTP) or an OpenID Connect (OIDC) token is required to publish ${
          packageTxt
        } to NPM. Usually the OIDC token should be provided automatically via GitHub Actions (see: https://github.com/actions/toolkit/tree/main/packages/core#oidc-token); however, the release process was unable to retrieve it. Please provide a \`otp\` executor option, or investigate why the OIDC token could not be retrieved.`
      );

      return { success: false };
    }
  }

  npmPublishCommandSegments.push("--provenance --access=public ");

  if (isDryRun) {
    npmPublishCommandSegments.push("--dry-run");
  }

  // Resolve values using the `npm config` command so that things like environment variables and `publishConfig`s are accounted for
  const tag =
    options.tag ||
    execSync("npm config get tag", {
      cwd: packageRoot,
      env: {
        ...process.env,
        NPM_ID_TOKEN: token,
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
    const currentVersion = options.version || packageJson.version;
    try {
      try {
        const result = execSync(npmViewCommandSegments.join(" "), {
          cwd: packageRoot,
          env: {
            ...process.env,
            NPM_ID_TOKEN: token,
            FORCE_COLOR: "true"
          },
          maxBuffer: LARGE_BUFFER,
          killSignal: "SIGTERM"
        });

        const resultJson = JSON.parse(result.toString());
        const distTags = resultJson["dist-tags"] || {};
        if (distTags[tag] === currentVersion) {
          console.warn(
            `Skipped ${packageTxt} because v${
              currentVersion
            } already exists in ${registry} with tag "${tag}"`
          );

          return { success: true };
        }
      } catch (err) {
        console.debug(
          `An error occurred while checking for existing dist-tags. Please note: if this is the first time this package has been published to npm, this can be ignored. \n\nError: ${JSON.stringify(
            err,
            null,
            2
          )}`
        );
      }

      try {
        if (!isDryRun) {
          const command = `npm dist-tag add ${packageName}@${currentVersion} ${tag} --registry="${registry}" `;

          console.debug(
            `Adding the dist-tag ${tag} - preparing to run the following: ${command}`
          );

          const result = execSync(command, {
            cwd: packageRoot,
            env: {
              ...process.env,
              NPM_ID_TOKEN: token,
              FORCE_COLOR: "true"
            },
            maxBuffer: LARGE_BUFFER,
            killSignal: "SIGTERM"
          });

          console.info(
            `Added the dist-tag ${tag} to v${currentVersion} for registry "${
              registry
            }". \n\nExecution response: ${result.toString()}`
          );
        } else {
          console.info(
            `Would have added the dist-tag ${tag} to v${
              currentVersion
            } for registry "${registry}", but [dry-run] was set.\n`
          );
        }

        return { success: true };
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
            const errorMessage = `An unexpected error occured while running the npm dist-tag add command: \n\n${
              stdoutData?.error?.summary
                ? `Summary: ${stdoutData?.error?.summary}${
                    stdoutData?.error?.code
                      ? ` (${stdoutData?.error?.code})`
                      : ""
                  }\n`
                : ""
            }${stdoutData?.error?.detail ? `Detail: ${stdoutData?.error?.detail}\n` : ""}`;
            github.error(errorMessage);

            return { success: false };
          }
        } catch (err) {
          const stdoutData = JSON.parse(err.stdout?.toString() || "{}");

          const errorMessage = `An unexpected error occured while processing the npm dist-tag add output: \n\n${
            stdoutData?.error?.summary
              ? `Summary: ${stdoutData?.error?.summary}${
                  stdoutData?.error?.code ? ` (${stdoutData?.error?.code})` : ""
                }\n`
              : ""
          }${stdoutData?.error?.detail ? `Detail: ${stdoutData?.error?.detail}\n` : ""}`;
          github.error(errorMessage);

          return { success: false };
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
        const errorMessage = `An unexpected error occured while checking for existing dist-tags: \n\n${
          stdoutData?.error?.summary
            ? `Summary: ${stdoutData?.error?.summary}${
                stdoutData?.error?.code ? ` (${stdoutData?.error?.code})` : ""
              }\n`
            : ""
        }${stdoutData?.error?.detail ? `Detail: ${stdoutData?.error?.detail}\n` : ""}`;
        github.error(errorMessage);

        return { success: false };
      }
    }
  }

  try {
    const cwd = packageRoot;
    const command = npmPublishCommandSegments.join(" ");

    console.info(
      `Running publish command "${command}" in current working directory: "${
        cwd
      }" `
    );

    const result = execSync(command, {
      cwd,
      env: {
        ...process.env,
        FORCE_COLOR: "true",
        NPM_ID_TOKEN: token
      },
      maxBuffer: LARGE_BUFFER,
      killSignal: "SIGTERM"
    });

    if (isDryRun) {
      console.info(
        `Would publish tag "${tag}" to ${registry}, but [dry-run] was set. ${
          result ? `\n\nExecution response: ${result.toString()}` : ""
        }`
      );
    } else {
      console.info(
        `Published tag "${tag}" to ${registry}. ${
          result ? `\n\nExecution response: ${result.toString()}` : ""
        }`
      );
    }

    return { success: true };
  } catch (err) {
    try {
      const stdoutData = JSON.parse(err.stdout?.toString() || "{}");
      const errorMessage = `An error occurred while publishing the npm package: \n\n${
        stdoutData?.error?.summary
          ? `Summary: ${stdoutData?.error?.summary}${
              stdoutData?.error?.code ? ` (${stdoutData?.error?.code})` : ""
            }\n`
          : ""
      }${stdoutData?.error?.detail ? `Detail: ${stdoutData?.error?.detail}\n` : ""}`;
      github.error(errorMessage);

      return { success: false };
    } catch (err) {
      const errorMessage = `Something unexpected went wrong when processing the npm publish output. \n\nError: ${JSON.stringify(
        Buffer.isBuffer(err) ? err.toString() : err,
        null,
        2
      )}`;
      github.error(errorMessage);

      return { success: false };
    }
  }
}
