import * as z from "zod";

/**
 * Storm theme color config values used for styling various workspace elements
 */
export const ColorConfigSchema = z
  .object({
    primary: z
      .string()
      .trim()
      .toLowerCase()
      .regex(/^#([0-9a-f]{3}){1,2}$/i)
      .length(7)
      .default("#0ea5e9")
      .describe("The primary color of the workspace"),
    background: z
      .string()
      .trim()
      .toLowerCase()
      .regex(/^#([0-9a-f]{3}){1,2}$/i)
      .length(7)
      .default("#1d232a")
      .describe("The background color of the workspace"),
    success: z
      .string()
      .trim()
      .toLowerCase()
      .regex(/^#([0-9a-f]{3}){1,2}$/i)
      .length(7)
      .default("#087f5b")
      .describe("The success color of the workspace"),
    info: z
      .string()
      .trim()
      .toLowerCase()
      .regex(/^#([0-9a-f]{3}){1,2}$/i)
      .length(7)
      .default("#0ea5e9")
      .describe("The informational color of the workspace"),
    warning: z
      .string()
      .trim()
      .toLowerCase()
      .regex(/^#([0-9a-f]{3}){1,2}$/i)
      .length(7)
      .default("#fcc419")
      .describe("The warning color of the workspace"),
    error: z
      .string()
      .trim()
      .toLowerCase()
      .regex(/^#([0-9a-f]{3}){1,2}$/i)
      .length(7)
      .default("#990000")
      .describe("The error color of the workspace"),
    fatal: z
      .string()
      .trim()
      .toLowerCase()
      .regex(/^#([0-9a-f]{3}){1,2}$/i)
      .length(7)
      .default("#7d1a1a")
      .describe("The fatal color of the workspace")
  })
  .describe("Colors used for various workspace elements");

/**
 * Storm Workspace config values used during various dev-ops processes. It represents the config of the entire monorepo.
 */
export const StormConfigSchema = z
  .object({
    name: z.string().trim().toLowerCase().describe("The name of the package"),
    namespace: z
      .string()
      .trim()
      .toLowerCase()
      .default("storm-software")
      .describe("The namespace of the package"),
    organization: z
      .string()
      .trim()
      .default("storm-software")
      .describe("The organization of the workspace"),
    repository: z
      .string()
      .trim()
      .url()
      .optional()
      .describe("The repo URL of the workspace (i.e. GitHub)"),
    license: z
      .string()
      .trim()
      .default("Apache License 2.0")
      .describe("The root directory of the package"),
    homepage: z
      .string()
      .trim()
      .url()
      .default("https://stormsoftware.org")
      .describe("The homepage of the workspace"),
    branch: z
      .string()
      .trim()
      .default("main")
      .describe("The branch of the workspace"),
    preMajor: z
      .boolean()
      .default(false)
      .describe(
        "An indicator specifying if the package is still in it's pre-major version"
      ),
    owner: z
      .string()
      .trim()
      .default("@storm-software/development")
      .describe("The owner of the package"),
    worker: z
      .string()
      .trim()
      .default("stormie-bot")
      .describe(
        "The worker of the package (this is the bot that will be used to perform various tasks)"
      ),
    env: z
      .enum(["development", "staging", "production"])
      .default("development")
      .describe("The current runtime environment of the package"),
    ci: z
      .boolean()
      .default(false)
      .describe(
        "An indicator specifying if the current environment is a CI environment"
      ),
    workspaceRoot: z
      .string()
      .trim()
      .describe("The root directory of the workspace"),
    packageDirectory: z
      .string()
      .trim()
      .optional()
      .describe("The root directory of the package"),
    buildDirectory: z
      .string()
      .trim()
      .optional()
      .describe("The build directory for the workspace"),
    runtimeDirectory: z
      .string()
      .trim()
      .default("node_modules/.storm")
      .describe("The runtime directory of Storm"),
    runtimeVersion: z
      .string()
      .trim()
      .regex(
        /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/
      )
      .default("1.0.0")
      .describe("The global version of the Storm runtime"),
    timezone: z
      .string()
      .trim()
      .default("America/New_York")
      .describe("The default timezone of the workspace"),
    locale: z
      .string()
      .trim()
      .default("en-US")
      .describe("The default locale of the workspace"),
    configFile: z
      .string()
      .trim()
      .nullable()
      .default(null)
      .describe(
        "The filepath of the Storm config. When this field is null, no config file was found in the current workspace."
      ),
    colors: ColorConfigSchema.describe(
      "Storm theme config values used for styling various package elements"
    ),
    extensions: z
      .record(z.any())
      .describe("Configuration of each used extension")
  })
  .describe(
    "Storm Workspace config values used during various dev-ops processes. This type is a combination of the StormPackageConfig and StormProject types. It represents the config of the entire monorepo."
  );
