import type { ExecutorContext } from "@nx/devkit";
import type { StormConfig } from "@storm-software/config";
import { withRunExecutor } from "../../base/base-executor";
import { CleanPackageExecutorSchema } from "./schema";
import { joinPathFragments } from "@nx/devkit";
import { createFilesFilter, filterObjectByKey, isObject } from "./utils";
import { PackageJson } from "./types";
import {
  mkdir,
  pathExists,
  remove,
  writeFile,
  readFile,
  copy,
  writeJson,
  readJson
} from "fs-extra";
import { Glob } from "glob";
import { IGNORE_FIELDS, NPM_SCRIPTS, PUBLISH_CONFIG_FIELDS } from "./constants";

export async function cleanPackageExecutorFn(
  options: CleanPackageExecutorSchema,
  context: ExecutorContext,
  config: StormConfig
) {
  const { writeInfo } = await import("@storm-software/config-tools");

  const tempDirectoryName = joinPathFragments(
    config.workspaceRoot,
    "tmp",
    context.root
  );

  const exists = await pathExists(tempDirectoryName);
  if (exists) {
    writeInfo(
      `🧹 Cleaning temporary directory path: ${tempDirectoryName}`,
      config
    );
    await remove(tempDirectoryName);
  }

  await mkdir(tempDirectoryName);
  writeInfo(`Created temporary directory: ${tempDirectoryName}`, config);

  const packageJson = await readJson<PackageJson>(options.packageJsonPath);

  await copy(options.outputPath, tempDirectoryName, {
    filter: createFilesFilter(options.ignoredFiles, options.outputPath)
  });

  if (options.cleanReadMe) {
    await cleanReadMe(
      tempDirectoryName,
      packageJson.repository,
      packageJson.homepage
    );
  }

  if (options.cleanComments) {
    await cleanComments(tempDirectoryName);
  }

  const tempPackageJson = clearPackageJSON(packageJson, options.fields);
  writeJson(
    joinPathFragments(tempDirectoryName, "package.json"),
    tempPackageJson
  );

  await copy(tempDirectoryName, options.outputPath, {
    override: true,
    preserveTimestamps: true
  });

  await remove(tempDirectoryName);

  return {
    success: true
  };
}

function getReadmeUrlFromRepository(repository: PackageJson["repository"]) {
  const repoUrl = typeof repository === "object" ? repository.url : repository;
  if (repoUrl) {
    const name = repoUrl.match(/[^/:]+\/[^/:]+$/)?.[0]?.replace(/\.git$/, "");
    return `https://github.com/${name}#README.md`;
  }

  return null;
}

async function cleanReadMe(
  directoryName: string,
  repository: PackageJson["repository"],
  homepage: PackageJson["homepage"]
) {
  const readmePath = joinPathFragments(directoryName, "README.md");
  const readme = await readFile(readmePath);
  const readmeUrl = getReadmeUrlFromRepository(repository);
  if (homepage || readmeUrl) {
    const cleaned =
      readme.toString().split(/\n##\s*\w/m)[0] +
      "\n## Documentation\n" +
      `Read full docs **[here](${homepage || readmeUrl})**.\n`;

    await writeFile(readmePath, cleaned);
  }
}

async function cleanComments(directoryName: string) {
  const glob = new Glob(["**/*.js"], { cwd: directoryName });

  const files = await glob.walk();
  await Promise.all(
    files.map(async i => {
      const file = joinPathFragments(directoryName, i);
      const content = await readFile(file);
      const cleaned = content
        .toString()
        .replace(/\s*\/\/.*\n/gm, "\n")
        .replace(/\s*\/\*[^/]+\*\/\n?/gm, "\n")
        .replace(/\n+/gm, "\n")
        .replace(/^\n+/gm, "");

      await writeFile(file, cleaned);
    })
  );
}

function clearPackageJSON(packageJson, inputIgnoreFields) {
  const ignoreFields = inputIgnoreFields
    ? IGNORE_FIELDS.concat(inputIgnoreFields)
    : IGNORE_FIELDS;

  if (!packageJson.publishConfig) {
    return packageJson;
  }

  const publishConfig = {
    ...packageJson.publishConfig
  };

  PUBLISH_CONFIG_FIELDS.forEach(field => {
    if (publishConfig[field]) {
      packageJson[field] = publishConfig[field];
      delete publishConfig[field];
    }
  });

  if (!Object.keys(publishConfig).length) {
    // delete property by destructuring
    // eslint-disable-next-line no-unused-vars
    const { publishConfig: _, ...pkg } = packageJson;

    return pkg;
  }

  const cleanPackageJSON = filterObjectByKey(
    {
      ...packageJson,
      publishConfig
    },
    key => !!(key && !ignoreFields.includes(key) && key !== "scripts")
  ) as PackageJson;

  if (packageJson.scripts && !ignoreFields.includes("scripts")) {
    cleanPackageJSON.scripts = filterObjectByKey(
      packageJson.scripts,
      script => !!(script && NPM_SCRIPTS.includes(script))
    );

    if (
      cleanPackageJSON.scripts.publish &&
      /^clean-publish( |$)/.test(cleanPackageJSON.scripts.publish)
    ) {
      // "custom" publish script is actually calling clean-publish
      delete cleanPackageJSON.scripts.publish;
    }
  }

  for (const i in cleanPackageJSON) {
    if (
      isObject(cleanPackageJSON[i]) &&
      Object.keys(cleanPackageJSON[i]).length === 0
    ) {
      delete cleanPackageJSON[i];
    }
  }
  return cleanPackageJSON;
}

export default withRunExecutor<CleanPackageExecutorSchema>(
  "Storm Clean-Package executor",
  cleanPackageExecutorFn,
  {
    skipReadingConfig: false,
    hooks: {
      applyDefaultOptions: (
        options: CleanPackageExecutorSchema
      ): CleanPackageExecutorSchema => {
        options.outputPath ??= "dist/{projectRoot}";
        options.packageJsonPath ??= joinPathFragments(
          options.outputPath,
          "package.json"
        );

        options.cleanReadMe ??= true;
        options.cleanComments ??= true;

        return options;
      }
    }
  }
);
