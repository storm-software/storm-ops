import { type ExecutorContext } from "@nx/devkit";
import { getConfig } from "@storm-software/config-tools/get-config";
import { joinPaths } from "@storm-software/config-tools/utilities/correct-paths";
import { createJiti, type Jiti } from "jiti";
import { execSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { format } from "prettier";
import prettierPlugin from "prettier-plugin-packagejson";
import { getGitHubTools } from "../../utils/github";
import {
  addPackageJsonGitHead,
  stripPrivateWorkspaceDeps
} from "../../utils/package-helpers";
import { getWorkspacePackageManager } from "../../utils/package-manager";
import { isPreviouslyStagedVersionError } from "./publish-status";
import type { NpmPublishExecutorSchema } from "./schema.d";

const LARGE_BUFFER = 1024 * 1000000;

async function replaceDepsAliases(
  jiti: Jiti,
  packageRoot: string,
  workspaceRoot: string,
  packageManager: string
) {
  if (packageManager === "bun") {
    const { replaceDepsAliases: replaceBunDepsAliases } = await jiti.import<{
      replaceDepsAliases: (
        packageRoot: string,
        workspaceRoot: string
      ) => Promise<void>;
    }>(jiti.esmResolve("@storm-software/bun-tools"));
    return replaceBunDepsAliases(packageRoot, workspaceRoot);
  }

  if (packageManager === "pnpm") {
    const { replaceDepsAliases: replacePnpmDepsAliases } = await jiti.import<{
      replaceDepsAliases: (
        packageRoot: string,
        workspaceRoot: string
      ) => Promise<void>;
    }>(jiti.esmResolve("@storm-software/pnpm-tools"));
    return replacePnpmDepsAliases(packageRoot, workspaceRoot);
  }

  // npm/yarn: skip catalog resolution; workspace protocol handled at publish time by the registry tooling
}

export default async function npmPublishExecutorFn(
  options: NpmPublishExecutorSchema,
  context: ExecutorContext
) {
  const workspaceConfig = await getConfig(context.root);
  const packageManager = await getWorkspacePackageManager(
    context.root,
    workspaceConfig
  );
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

  const jiti = createJiti(context.root, {
    fsCache: joinPaths(context.root, "node_modules/.cache/storm", "jiti"),
    interopDefault: true
  });

  const { getNpmRegistry, getRegistry } = await jiti.import<{
    getNpmRegistry: () => Promise<string | undefined>;
    getRegistry: () => Promise<string | undefined>;
  }>(jiti.esmResolve("@storm-software/npm-tools/helpers"));

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
          plugins: [prettierPlugin]
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

  const removedPrivateWorkspaceDeps = await stripPrivateWorkspaceDeps(
    packageRoot,
    context.root
  );
  if (removedPrivateWorkspaceDeps.length > 0) {
    console.info(
      `Removed private workspace dependencies from ${packageJsonPath}: ${removedPrivateWorkspaceDeps.join(", ")}`
    );
  }

  await replaceDepsAliases(jiti, packageRoot, context.root, packageManager);
  await addPackageJsonGitHead(packageRoot);

  const currentVersion = options.version || packageJson.version;

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
  if (!options.otp && registry) {
    token = await github.getIDToken(
      `npm:${registry.replace(/^https?:\/\//, "")}`
    );
    if (!token) {
      github.warning(
        `Either a One time password (OTP) or an OpenID Connect (OIDC) token is generally required to publish ${
          packageTxt
        } to NPM. Usually the OIDC token should be provided automatically via GitHub Actions (see: https://github.com/actions/toolkit/tree/main/packages/core#oidc-token); however, the release process was unable to retrieve it. Please provide a \`otp\` executor option, or investigate why the OIDC token could not be retrieved.`
      );
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
        NPM_ID_TOKEN: token ? token : undefined,
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

  // One lookup. Skip when this version is already the dist-tag. A 404 means the package is new.
  if (!isDryRun) {
    try {
      const result = execSync(npmViewCommandSegments.join(" "), {
        cwd: packageRoot,
        env: {
          NPM_ID_TOKEN: token,
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
        NPM_ID_TOKEN: token,
        ...process.env,
        FORCE_COLOR: "true"
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
    if (!isDryRun && isPreviouslyStagedVersionError(err, currentVersion)) {
      console.warn(
        `npm reported that ${packageName}@${currentVersion} was previously staged. Treating it as published.`
      );

      return { success: true };
    }

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
