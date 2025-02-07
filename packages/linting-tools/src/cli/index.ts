import type { StormConfig } from "@storm-software/config";
import {
  findWorkspaceRootSafe,
  writeDebug,
  writeError,
  writeFatal,
  writeInfo,
  writeSuccess
} from "@storm-software/config-tools";
import { CDVC } from "check-dependency-version-consistency";
import { Command, Option } from "commander";
import { lint } from "cspell";
import { parseCircular, parseDependencyTree, prettyCircular } from "dpdm";
import { runAlex } from "../alex";
import { runCodeowners } from "../codeowners";
import { MANY_PKG_TYPE_OPTIONS, runManypkg } from "../manypkg";

let _config: Partial<StormConfig> = {};

export function createProgram(config: StormConfig) {
  _config = config;
  writeInfo("⚡ Running Storm Linting Tools", config);

  const root = findWorkspaceRootSafe();
  process.env.STORM_WORKSPACE_ROOT ??= root;
  process.env.NX_WORKSPACE_ROOT_PATH ??= root;
  root && process.chdir(root);

  const program = new Command("storm-lint");
  program.version("1.0.0", "-v --version", "display CLI version");

  program
    .description("⚡ Lint the Storm Workspace")
    .showHelpAfterError()
    .showSuggestionAfterError();

  const cspellConfig = new Option(
    "--cspell-config <file>",
    "CSpell config file path"
  ).default("@storm-software/linting-tools/cspell/config.json");

  program
    .command("cspell")
    .description("Run spell-check lint for the workspace.")
    .addOption(cspellConfig)
    .action(cspellAction);

  const alexConfig = new Option(
    "--alex-config <file>",
    "Alex.js config file path"
  ).default("@storm-software/linting-tools/alex/.alexrc");

  const alexIgnore = new Option(
    "--alex-ignore <file>",
    "Alex.js Ignore file path"
  ).default("@storm-software/linting-tools/alex/.alexignore");

  program
    .command("alex")
    .description("Run spell-check lint for the workspace.")
    .addOption(alexConfig)
    .addOption(alexIgnore)
    .action(alexAction);

  program
    .command("deps-version")
    .description("Run dependency version consistency lint for the workspace.")
    .action(depsVersionAction);

  program
    .command("circular-deps")
    .description("Run circular dependency lint for the workspace.")
    .action(circularDepsAction);

  const manypkgType = new Option(
    "--manypkg-type <type>",
    "The manypkg command to run"
  )
    .choices(MANY_PKG_TYPE_OPTIONS)
    .argParser(val =>
      !val || !MANY_PKG_TYPE_OPTIONS.includes(val.trim().toLowerCase())
        ? "fix"
        : val.trim().toLowerCase()
    )
    .default("fix");

  const manypkgArgs = new Option(
    "--manypkg-args <args>",
    "The args provided to the manypkg command"
  )
    .argParser(val =>
      !val || !val.replaceAll("", ",")
        ? []
        : val.split(",").map(v => v.trim().toLowerCase())
    )
    .default([]);

  program
    .command("manypkg")
    .description("Run package lint with Manypkg for the workspace.")
    .addOption(manypkgType)
    .addOption(manypkgArgs)
    .action(manypkgAction);

  program
    .command("codeowners")
    .description("Run CODEOWNERS linting for the workspace.")
    .addOption(cspellConfig)
    .action(codeownersAction);

  const skipCspell = new Option(
    "--skip-cspell",
    "Should skip CSpell linting"
  ).default(true);

  const skipAlex = new Option(
    "--skip-alex",
    "Should skip Alex language linting"
  ).default(true);

  const skipDepsVersion = new Option(
    "--skip-deps-version",
    "Should skip dependency version consistency linting"
  ).default(false);

  const skipCircularDeps = new Option(
    "--skip-circular-deps",
    "Should skip circular dependency linting"
  ).default(false);

  const skipManypkg = new Option(
    "--skip-manypkg",
    "Should skip Manypkg linting"
  ).default(false);

  const skipCodeowners = new Option(
    "--skip-codeowners",
    "Should skip CODEOWNERS linting"
  ).default(true);

  program
    .command("all")
    .description("Run all linters for the workspace.")
    .addOption(skipCspell)
    .addOption(skipAlex)
    .addOption(skipDepsVersion)
    .addOption(skipCircularDeps)
    .addOption(skipManypkg)
    .addOption(cspellConfig)
    .addOption(alexConfig)
    .addOption(alexIgnore)
    .addOption(manypkgType)
    .addOption(manypkgArgs)
    .addOption(skipCodeowners)
    .action(allAction);

  return program;
}

async function allAction({
  skipCspell,
  skipAlex,
  skipDepsVersion,
  skipCircularDeps,
  skipManypkg,
  cspellConfig,
  alexConfig,
  alexIgnore,
  manypkgType,
  manypkgArgs
}: {
  skipCspell: boolean;
  skipAlex: boolean;
  skipDepsVersion: boolean;
  skipCircularDeps: boolean;
  skipManypkg: boolean;
  cspellConfig: string;
  alexConfig: string;
  alexIgnore: string;
  manypkgType: string;
  manypkgArgs: string[];
}) {
  try {
    writeDebug("⚡ Linting the Storm Workspace", _config);

    const promises = [] as Promise<any>[];
    if (!skipCspell) {
      promises.push(cspellAction({ cspellConfig }));
    }

    if (!skipAlex) {
      promises.push(alexAction({ alexConfig, alexIgnore }));
    }

    if (!skipDepsVersion) {
      promises.push(depsVersionAction());
    }

    if (!skipCircularDeps) {
      promises.push(circularDepsAction());
    }

    if (!skipManypkg) {
      promises.push(manypkgAction({ manypkgType, manypkgArgs }));
    }

    await Promise.all(promises);
    writeSuccess("Successfully linted the workspace ✅", _config);
  } catch (e) {
    writeFatal(
      `A fatal error occurred while linting the workspace: ${e.message}`,
      _config
    );
    throw new Error(e.message, { cause: e });
  }
}

async function cspellAction({
  cspellConfig = "@storm-software/linting-tools/cspell/config.json"
}: {
  cspellConfig: string;
}) {
  try {
    writeInfo("⚡Linting the workspace spelling");
    const result = await lint(["**/*.{txt,js,jsx,ts,tsx,md,mdx}"], {
      cache: true,
      summary: true,
      issues: true,
      progress: false,
      relative: true,
      dot: true,
      debug: true,
      gitignore: true,
      root:
        _config.workspaceRoot ||
        process.env.STORM_WORKSPACE_ROOT ||
        process.cwd(),
      defaultConfiguration: false,
      config: cspellConfig
    });
    if (result.errors && result.filesWithIssues) {
      throw new Error(
        `CSpell found ${result.errors} errors in ${result.filesWithIssues} files`
      );
    }

    writeSuccess("Spelling linting is complete ✅", _config);
  } catch (e) {
    writeError(`Spelling linting has failed ❌ \n\n${e.message}`, _config);
    throw new Error(e.message, { cause: e });
  }
}

async function codeownersAction() {
  try {
    writeInfo("⚡Linting the workspace CODEOWNERS file");

    await runCodeowners();

    writeSuccess("CODEOWNERS linting is complete ✅", _config);
  } catch (e) {
    writeError("CODEOWNERS linting has failed ❌", _config);
    writeFatal(
      `A fatal error occurred while CODEOWNERS linting the workspace: \n\n${e.message} \n`,
      _config
    );
    throw new Error(e.message, { cause: e });
  }
}

async function alexAction({
  alexConfig = "@storm-software/linting-tools/alex/config.json",
  alexIgnore = "@storm-software/linting-tools/alex/.alexignore"
}: {
  alexConfig: string;
  alexIgnore: string;
}) {
  try {
    writeDebug("⚡ Linting the workspace language with alexjs.com", _config);

    const result = await runAlex(alexConfig, alexIgnore);
    if (result) {
      throw new Error(`Alex CLI Error Code: ${result}`);
    }

    writeSuccess("Language linting is complete ✅", _config);
  } catch (e) {
    writeError(`Language linting has failed ❌ \n\n${e.message} `, _config);
    writeFatal(
      `A fatal error occurred while language linting the workspace: \n\n${e.message} \n`,
      _config
    );
    throw new Error(e.message, { cause: e });
  }
}

async function depsVersionAction() {
  try {
    writeDebug(
      "⚡ Linting the workspace dependency version consistency",
      _config
    );

    const cdvc = new CDVC(".", { fix: true });

    // Show output for dependencies we fixed.
    if (cdvc.hasMismatchingDependenciesFixable) {
      writeDebug(cdvc.toFixedSummary(), _config);
    }

    // Show output for dependencies that still have mismatches.
    if (cdvc.hasMismatchingDependenciesNotFixable) {
      throw new Error(cdvc.toMismatchSummary());
    }

    writeSuccess("Dependency Version linting is complete ✅", _config);
  } catch (e) {
    writeError(
      `Dependency version consistency linting has failed ❌ \n\n${e.message} `,
      _config
    );
    writeFatal(
      `A fatal error occurred while dependency Version linting the workspace: ${e.message}`,
      _config
    );
    throw new Error(e.message, { cause: e });
  }
}

async function circularDepsAction() {
  try {
    writeDebug("⚡ Linting the workspace circular dependency", _config);

    const circulars = parseCircular(
      await parseDependencyTree(["**/*"], {
        exclude: new RegExp(
          "^(.*/(node_modules|dist|tmp|coverage|.nx|.cache|.next|__test__|__fixtures__)/).*"
        ),
        extensions: [".ts", ".tsx"],
        tsconfig: "./tsconfig.base.json",
        transform: true,
        skipDynamicImports: false
      }),
      true
    );
    if (circulars && circulars.length > 0) {
      throw new Error(
        prettyCircular(
          circulars,
          "Circular dependencies found in this Storm workspace: \n"
        )
      );
    }

    writeSuccess("Circular dependency linting is complete ✅", _config);
  } catch (e) {
    writeError(
      `Circular dependency linting has failed ❌ \n\n${e.message} `,
      _config
    );
    writeFatal(
      `A fatal error occurred while circular dependency linting the workspace: ${e.message}`,
      _config
    );
    throw new Error(e.message, { cause: e });
  }
}

async function manypkgAction({
  manypkgType = "fix",
  manypkgArgs = []
}: {
  manypkgType: string;
  manypkgArgs: string[];
}) {
  try {
    writeDebug("⚡ Linting the workspace's packages with Manypkg", _config);

    await runManypkg(_config, manypkgType, manypkgArgs);

    writeSuccess("Manypkg linting is complete ✅", _config);
  } catch (e) {
    writeError(`Manypkg linting has failed ❌ \n\n${e.message} `, _config);
    writeFatal(
      `A fatal error occurred while manypkg linting the workspace: ${e.message}`,
      _config
    );
    throw new Error(e.message, { cause: e });
  }
}
