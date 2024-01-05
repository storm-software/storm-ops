import { Command, Option } from "commander";
import { lint } from "cspell";
import { parseCircular, parseDependencyTree, prettyCircular } from "dpdm";
import fs from "fs";
import path from "path";
import { runAlex } from "../alex";
import { runManypkg } from "../manypkg";

function createProgram() {
  console.log("Running⚡Storm Linting Tools");

  const root = findWorkspaceRoot();
  process.env.STORM_WORKSPACE_ROOT ??= root;
  process.env.NX_WORKSPACE_ROOT_PATH ??= root;
  root && process.chdir(root);

  const program = new Command("storm-lint");

  program.version("1.0.0", "-v --version", "display CLI version");

  program
    .description("⚡Lint the Storm Workspace")
    .showHelpAfterError()
    .showSuggestionAfterError();

  const cspellConfig = new Option(
    "--cspell-config <file>",
    "CSpell config file path"
  ).default("@storm-software/linting-tools/cspell/config.js");

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
  ).default("check");

  const manypkgArgs = new Option(
    "--manypkg-args <args>",
    "The args provided to the manypkg command"
  ).default([]);

  const manypkgFix = new Option(
    "--manypkg-fix <args>",
    "The args provided to the manypkg command"
  ).default(true);

  program
    .command("manypkg")
    .description("Run package lint with Manypkg for the workspace.")
    .addOption(manypkgType)
    .addOption(manypkgArgs)
    .addOption(manypkgFix)
    .action(manypkgAction);

  const cspellSkip = new Option("--skip-cspell", "Should skip CSpell linting");

  const alexSkip = new Option(
    "--skip-alex",
    "Should skip Alex language linting"
  );

  const depsVersionSkip = new Option(
    "--skip-deps-version",
    "Should skip dependency version consistency linting"
  );

  const circularDepsSkip = new Option(
    "--skip-circular-deps",
    "Should skip circular dependency linting"
  );

  const manypkgSkip = new Option(
    "--skip-manypkg",
    "Should skip Manypkg linting"
  );

  program
    .command("all")
    .description("Run all linters for the workspace.")
    .addOption(cspellSkip)
    .addOption(alexSkip)
    .addOption(depsVersionSkip)
    .addOption(circularDepsSkip)
    .addOption(manypkgSkip)
    .addOption(cspellConfig)
    .addOption(alexConfig)
    .addOption(alexIgnore)
    .addOption(manypkgType)
    .addOption(manypkgArgs)
    .addOption(manypkgFix)
    .action(allAction);

  return program;
}

async function allAction(
  cspellSkip: boolean,
  alexSkip: boolean,
  depsVersionSkip: boolean,
  circularDepsSkip: boolean,
  manypkgSkip: boolean,
  cspellConfig: string,
  alexConfig: string,
  alexIgnore: string,
  manypkgType: string,
  manypkgArgs: string[],
  manypkgFix: boolean
) {
  try {
    console.log("⚡ Linting the Storm Workspace");
    console.log(process.argv);

    const promises = [];
    if (!cspellSkip) {
      promises.push(cspellAction(cspellConfig));
    }

    if (!alexSkip) {
      promises.push(alexAction(alexConfig, alexIgnore));
    }

    if (!depsVersionSkip) {
      promises.push(depsVersionAction());
    }

    if (!circularDepsSkip) {
      promises.push(circularDepsAction());
    }

    if (!manypkgSkip) {
      promises.push(manypkgAction(manypkgType, manypkgArgs, manypkgFix));
    }

    await Promise.all(promises);
    console.log(`⚡ Linted the workspace`);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

async function cspellAction(cspellConfig: string) {
  try {
    console.log("⚡Linting the workspace spelling");
    const result = await lint(["**/*.{txt,js,jsx,ts,tsx,md,mdx}"], {
      cache: true,
      summary: true,
      issues: true,
      progress: false,
      relative: true,
      dot: true,
      debug: true,
      gitignore: true,
      root: process.env["STORM_WORKSPACE_ROOT"]
        ? process.env["STORM_WORKSPACE_ROOT"]
        : process.cwd(),
      defaultConfiguration: false,
      config: cspellConfig
    });
    if (result.errors) {
      console.log("❌ Spelling linting has failed");
      process.exit(1);
    }

    console.log("✅ Spelling linting is complete");
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

async function alexAction(alexConfig: string, alexIgnore: string) {
  try {
    console.log("⚡ Linting the workspace language with alexjs.com");

    if (await runAlex(alexConfig, alexIgnore)) {
      console.error("❌ Language linting has failed");
      process.exit(1);
    }

    console.log("✅ Language linting is complete");
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

async function depsVersionAction() {
  try {
    console.log("⚡ Linting the workspace dependency version consistency");

    const { CDVC } = await import("check-dependency-version-consistency");
    const cdvc = new CDVC(".", { fix: true });

    // Show output for dependencies we fixed.
    if (cdvc.hasMismatchingDependenciesFixable) {
      console.log(cdvc.toFixedSummary());
    }

    // Show output for dependencies that still have mismatches.
    if (cdvc.hasMismatchingDependenciesNotFixable) {
      console.error(`❌ Dependency version consistency linting has failed`);
      console.error(cdvc.toMismatchSummary());
      process.exit(1);
    }

    console.log(`✅ Dependency Version linting is complete`);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

async function circularDepsAction() {
  try {
    console.log("⚡ Linting the workspace circular dependency");

    const tree = await parseDependencyTree("**/*.*", {
      tsconfig: "./tsconfig.base.json",
      transform: true,
      skipDynamicImports: false
    });

    const circulars = parseCircular(tree);
    console.log(prettyCircular(circulars));

    console.log(`✅ Circular dependency linting is complete`);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

async function manypkgAction(
  manypkgType = "check",
  manypkgArgs: string[],
  manypkgFix: boolean
) {
  try {
    console.log("⚡ Linting the workspace's packages with Manypkg");

    await runManypkg(manypkgType, manypkgArgs, manypkgFix);

    console.log(`✅ Manypkg linting is complete`);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

/**
 * Recursive function that walks back up the directory
 * tree to try and find a workspace file.
 *
 * @param dir Directory to start searching with
 */
export function findWorkspaceRoot(): string | undefined {
  return workspaceRootInner(process.cwd(), undefined);
}

export let workspaceRoot = workspaceRootInner(process.cwd(), process.cwd());

// Required for integration tests in projects which depend on Nx at runtime, such as lerna and angular-eslint
export function setWorkspaceRoot(root: string): void {
  workspaceRoot = root;
}

export function workspaceRootInner(
  dir: string,
  candidateRoot: string | undefined
): string | undefined {
  if (process.env.STORM_WORKSPACE_ROOT) return process.env.STORM_WORKSPACE_ROOT;
  if (path.dirname(dir) === dir) return candidateRoot;

  const matches = [path.join(dir, "pnpm-workspace.yaml")];

  if (matches.some(x => fs.existsSync(x))) {
    return dir;
  } else {
    return workspaceRootInner(path.dirname(dir), candidateRoot);
  }
}

export default async function (): Promise<void> {
  const program = createProgram();
  program.exitOverride();

  await program.parseAsync(process.argv);
}
