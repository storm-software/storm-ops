import { findWorkspaceRoot } from "nx/src/utils/find-workspace-root.js";
import { processTokens } from "../program";

async function createProgram() {
  try {
    console.log("Running ⚡Storm Design Tools");

    const { Command, Option } = await import("commander");

    const root = findWorkspaceRoot(process.cwd());
    process.env.STORM_WORKSPACE_ROOT ??= root?.dir;
    process.env.NX_WORKSPACE_ROOT_PATH ??= root?.dir;
    root?.dir && process.chdir(root.dir);

    const program = new Command("storm-design");
    program.version("1.0.0", "-v --version", "display CLI version");

    const tokensType = new Option(
      "--type <type>",
      "The type of code to generate based on the supplied tokens (TailWind CSS, Tamagui, etc.)"
    )
      .choices(["tailwindcss", "tamagui"])
      .default("tailwindcss");

    const tokensInput = new Option(
      "--input <input> ",
      "The path to the tokens.json file exported from Figma Tokens Studio."
    );

    program
      .command("tokens")
      .description("Run commitlint and commitizen for the workspace.")
      .addOption(tokensType)
      .addOption(tokensInput)
      .action(tokensAction);

    return program;
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

async function tokensAction({
  type = "tailwindcss",
  input
}: {
  type: string;
  input: string;
}) {
  try {
    console.log("⚡ Generating code using the supplied tokens.json");

    await processTokens({
      type,
      input
    });

    console.log("✅ Code generated with the supplied tokens.json is complete");
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

export default async function (): Promise<void> {
  try {
    const program = await createProgram();
    program.exitOverride();

    await program.parseAsync(process.argv);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
